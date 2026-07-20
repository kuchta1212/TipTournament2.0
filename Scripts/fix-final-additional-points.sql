-- ============================================================
-- Fix: remove wrongly-awarded "advanced through a different part
-- of the bracket" (AdditionalResult) points from the FINAL.
--
-- Bug: for the final, additional points were credited even when the
-- predicted finalist landed in the SAME slot it was predicted for
-- (i.e. it went the correct way) - which is already scored by the
-- regular evaluation. Only a *crossed* finalist should earn the
-- additional points:
--     home slot: predicted home team finished as the away finalist  (HomeTeamBetId = AwayId)
--     away slot: predicted away team finished as the home finalist  (AwayTeamBetId = HomeId)
--
-- Per-bet points wrongly added (to remove):
--     2 * (HomeTeamBetId = HomeId) + 2 * (AwayTeamBetId = AwayId)
--
-- Only Stage 5 (TournamentStage.Final) is affected; earlier knockout
-- rounds evaluate the additional result against OTHER matches, so those
-- points are legitimate and are intentionally left untouched.
--
-- Run inside the transaction, review the SELECTs, then COMMIT.
-- ============================================================

BEGIN TRANSACTION;

DECLARE @FinalStage INT = 5;

IF OBJECT_ID('tempdb..#FinalFix') IS NOT NULL DROP TABLE #FinalFix;

-- Every final DeltaBet that currently carries an AdditionalResult,
-- with the stored points, the corrected (crossed-only) values and the
-- amount that must be deducted from the player.
SELECT
    db.Id            AS DeltaBetId,
    db.UserId        AS UserId,
    add_r.Id         AS AdditionalResultId,
    add_r.Points     AS StoredAdditionalPoints,
    CAST(CASE WHEN db.HomeTeamBetId = m.AwayId THEN 1 ELSE 0 END AS BIT) AS NewHomeCorrect,
    CAST(CASE WHEN db.AwayTeamBetId = m.HomeId THEN 1 ELSE 0 END AS BIT) AS NewAwayCorrect,
    (CASE WHEN db.HomeTeamBetId = m.AwayId THEN 2 ELSE 0 END
   + CASE WHEN db.AwayTeamBetId = m.HomeId THEN 2 ELSE 0 END)            AS NewPoints,
    (CASE WHEN db.HomeTeamBetId = m.HomeId THEN 2 ELSE 0 END
   + CASE WHEN db.AwayTeamBetId = m.AwayId THEN 2 ELSE 0 END)            AS Deduction
INTO #FinalFix
FROM dbo.DeltaBets db
JOIN dbo.Matches m             ON m.Id = db.MatchId
JOIN dbo.DeltaBetResults r     ON r.Id = db.ResultId
JOIN dbo.DeltaBetResults add_r ON add_r.Id = r.AdditionalResultId
WHERE m.Stage = @FinalStage;

-- ---- (a) anomaly check: stored points should equal Deduction + NewPoints.
--         Any rows here mean the stored additional points are not what the
--         buggy code would have produced (e.g. the final was uploaded twice).
--         Investigate before committing.
SELECT 'ANOMALY - stored <> deduction + corrected' AS info, f.*
FROM #FinalFix f
WHERE f.StoredAdditionalPoints <> f.Deduction + f.NewPoints;

-- ---- (b) preview the players who will lose points ----
SELECT u.UserName, u.DeltaPoints, u.TotalPoints,
       f.StoredAdditionalPoints, f.NewPoints, f.Deduction
FROM #FinalFix f
JOIN dbo.AspNetUsers u ON u.Id = f.UserId
WHERE f.Deduction > 0
ORDER BY f.Deduction DESC, u.UserName;

-- ---- 1. deduct the wrongly-awarded points from each player ----
;WITH PerUser AS (
    SELECT UserId, SUM(Deduction) AS Ded
    FROM #FinalFix
    GROUP BY UserId
)
UPDATE u
SET u.DeltaPoints = u.DeltaPoints - p.Ded,
    u.TotalPoints = u.TotalPoints - p.Ded
FROM dbo.AspNetUsers u
JOIN PerUser p ON p.UserId = u.Id
WHERE p.Ded > 0;

-- ---- 2. correct the additional result structure (crossed-only) ----
UPDATE add_r
SET add_r.IsHomeTeamCorrect = f.NewHomeCorrect,
    add_r.IsAwayTeamCorrect = f.NewAwayCorrect,
    add_r.Points            = f.NewPoints
FROM dbo.DeltaBetResults add_r
JOIN #FinalFix f ON f.AdditionalResultId = add_r.Id
WHERE add_r.Points            <> f.NewPoints
   OR add_r.IsHomeTeamCorrect <> f.NewHomeCorrect
   OR add_r.IsAwayTeamCorrect <> f.NewAwayCorrect;

-- ---- 3. (OPTIONAL) drop additional results that are now empty ----
--         The fixed code creates no AdditionalResult when nothing crossed.
--         Leaving a 0-point row is harmless (badge hidden, adds 0), so this
--         step is optional cleanup. Uncomment to remove the empty rows.
-- UPDATE r
-- SET r.AdditionalResultId = NULL
-- FROM dbo.DeltaBetResults r
-- JOIN #FinalFix f ON f.AdditionalResultId = r.AdditionalResultId
-- WHERE f.NewPoints = 0;
--
-- DELETE add_r
-- FROM dbo.DeltaBetResults add_r
-- JOIN #FinalFix f ON f.AdditionalResultId = add_r.Id
-- WHERE f.NewPoints = 0;

-- ---- verify final state ----
SELECT u.UserName, u.DeltaPoints, u.TotalPoints,
       add_r.Points AS AdditionalPointsNow,
       add_r.IsHomeTeamCorrect, add_r.IsAwayTeamCorrect
FROM #FinalFix f
JOIN dbo.AspNetUsers u         ON u.Id = f.UserId
JOIN dbo.DeltaBetResults add_r ON add_r.Id = f.AdditionalResultId
ORDER BY u.UserName;

DROP TABLE #FinalFix;

-- ROLLBACK;   -- default: abort. Review the SELECTs above first.
-- COMMIT;     -- uncomment to apply
