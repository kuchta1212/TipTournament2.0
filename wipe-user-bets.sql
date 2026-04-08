-- Wipe all bets for a specific user
-- Replace 'USER_ID_HERE' with the actual UserId (from AspNetUsers.Id)

DECLARE @UserId NVARCHAR(450) = 'USER_ID_HERE';

-- To find your user ID, uncomment:
-- SELECT Id, UserName, Email FROM AspNetUsers WHERE UserName LIKE '%your_name%';

-- Collect result IDs before deleting bets (FK is on the bet side)
DECLARE @GroupBetResultIds TABLE (Id NVARCHAR(450));
INSERT INTO @GroupBetResultIds SELECT ResultId FROM GroupBets WHERE UserId = @UserId AND ResultId IS NOT NULL;

DECLARE @DeltaBetResultIds TABLE (Id NVARCHAR(450));
INSERT INTO @DeltaBetResultIds SELECT ResultId FROM DeltaBets WHERE UserId = @UserId AND ResultId IS NOT NULL;

-- Delete bets first (they hold the FK to results)
DELETE FROM Bets WHERE UserId = @UserId;
DELETE FROM GroupBets WHERE UserId = @UserId;
DELETE FROM DeltaBets WHERE UserId = @UserId;
DELETE FROM TeamPlaceBets WHERE UserId = @UserId;
DELETE FROM TopShooterBets WHERE UserId = @UserId;

-- Now delete the orphaned results
DELETE FROM GroupBetResults WHERE Id IN (SELECT Id FROM @GroupBetResultIds);
DELETE FROM DeltaBetResults WHERE Id IN (SELECT Id FROM @DeltaBetResultIds);

-- Reset bet status so the UI doesn't think you've already submitted
DELETE FROM BetsStatuses WHERE UserId = @UserId;

PRINT 'All bets wiped for user: ' + @UserId;
