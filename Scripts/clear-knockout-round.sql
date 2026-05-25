-- ============================================
-- Clear test data for a range of knockout stages
--
-- Stage values (TournamentStage enum):
--   1 = RoundOf32   (first knockout round in WC2026)
--   2 = RoundOf16   (Osmifinále)
--   3 = Quarterfinal
--   4 = Semifinal
--   5 = Final
--
-- Defaults below wipe the entire knockout bracket (1..5).
-- Narrow by changing @StageMin / @StageMax, e.g. 1,1 = RoundOf32 only.
--
-- Run inside a transaction. Review the verification SELECTs
-- before uncommenting COMMIT.
-- ============================================

BEGIN TRANSACTION;

DECLARE @StageMin INT = 1;   -- <-- inclusive lower bound
DECLARE @StageMax INT = 5;   -- <-- inclusive upper bound

-- ---- snapshot what we're about to touch ----
SELECT 'matches in range' AS info, Stage, COUNT(*) AS cnt
FROM Matches WHERE Stage BETWEEN @StageMin AND @StageMax
GROUP BY Stage ORDER BY Stage;

SELECT 'delta bets evaluated in range' AS info, m.Stage, COUNT(*) AS cnt
FROM DeltaBets db
JOIN Matches m ON m.Id = db.MatchId
WHERE m.Stage BETWEEN @StageMin AND @StageMax AND db.ResultId IS NOT NULL
GROUP BY m.Stage ORDER BY m.Stage;

-- ---- 1. clear DeltaBet evaluations (keep the user's pick) ----
DECLARE @OrphanResults TABLE (Id NVARCHAR(450));

INSERT INTO @OrphanResults (Id)
SELECT db.ResultId
FROM DeltaBets db
JOIN Matches m ON m.Id = db.MatchId
WHERE m.Stage BETWEEN @StageMin AND @StageMax AND db.ResultId IS NOT NULL;

UPDATE db
SET ResultId = NULL, DixitBonus = 0
FROM DeltaBets db
JOIN Matches m ON m.Id = db.MatchId
WHERE m.Stage BETWEEN @StageMin AND @StageMax;

-- delete the now-orphan DeltaBetResults (incl. any AdditionalResult chain)
DELETE r
FROM DeltaBetResults r
WHERE r.Id IN (SELECT Id FROM @OrphanResults)
   OR r.Id IN (SELECT AdditionalResultId FROM DeltaBetResults
               WHERE Id IN (SELECT Id FROM @OrphanResults));

-- ---- 2. clear Match teams + result link in range ----
DECLARE @MatchResultIds TABLE (Id NVARCHAR(450));
INSERT INTO @MatchResultIds (Id)
SELECT ResultId FROM Matches
WHERE Stage BETWEEN @StageMin AND @StageMax AND ResultId IS NOT NULL;

UPDATE Matches
SET HomeId = NULL, AwayId = NULL, Ended = 0, ResultId = NULL
WHERE Stage BETWEEN @StageMin AND @StageMax;

DELETE FROM Results WHERE Id IN (SELECT Id FROM @MatchResultIds);

-- ---- 3. recompute DeltaPoints + TotalPoints from remaining bets ----
;WITH PerUser AS (
    SELECT db.UserId, SUM(ISNULL(r.Points, 0) + ISNULL(db.DixitBonus, 0)) AS Pts
    FROM DeltaBets db
    LEFT JOIN DeltaBetResults r ON r.Id = db.ResultId
    GROUP BY db.UserId
)
UPDATE u
SET TotalPoints = u.TotalPoints - u.DeltaPoints + ISNULL(p.Pts, 0),
    DeltaPoints = ISNULL(p.Pts, 0)
FROM AspNetUsers u
LEFT JOIN PerUser p ON p.UserId = u.Id;

-- ---- verify, then COMMIT ----
SELECT 'matches after wipe (HomeId/AwayId should be NULL)' AS info, Id, Stage, HomeId, AwayId, Ended, ResultId
FROM Matches WHERE Stage BETWEEN @StageMin AND @StageMax
ORDER BY Stage, Id;

-- ROLLBACK;   -- uncomment to abort
-- COMMIT;    -- uncomment to apply
