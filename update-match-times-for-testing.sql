-- Update all match StartTimes for manual deadline testing.
-- Spaces matches 3 minutes apart starting from now (UTC),
-- ordered by Stage (Group → Final) then by Id within each stage.
--
-- Usage: Run against your local TipTournament DB before starting the app.

WITH OrderedMatches AS (
    SELECT Id, StartTime,
           ROW_NUMBER() OVER (ORDER BY Stage, Id) - 1 AS Offset
    FROM Matches
)
UPDATE OrderedMatches
SET StartTime = DATEADD(MINUTE, Offset * 3 + 5, GETUTCDATE());
