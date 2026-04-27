-- ============================================
-- Clear TipTournament2.0 DB for World Cup 2026
-- Keeps: AspNetUsers + Identity tables
-- ============================================

-- 1. Bets (depend on matches, users, results)
DELETE FROM Bets;           -- MatchBet
DELETE FROM DeltaBets;
DELETE FROM GroupBets;
DELETE FROM TeamPlaceBets;  -- SpecificTeamPlaceBet
DELETE FROM TopShooterBets;
DELETE FROM BetsStatuses;

-- 2. Results
DELETE FROM DeltaBetResults;
DELETE FROM GroupBetResults;
DELETE FROM GroupResults;
DELETE FROM Results;

-- 3. Tournament structure
DELETE FROM Matches;
DELETE FROM Groups;
DELETE FROM Teams;

-- 4. Misc
DELETE FROM Comments;
DELETE FROM UpdateStatuses;

-- 5. Reset user points and payment status for new tournament
UPDATE AspNetUsers SET
    TotalPoints = 0,
    AlfaPoints = 0,
    GamaPoints = 0,
    DeltaPoints = 0,
    LambdaPoints = 0,
    OmikronPoints = 0,
    Payed = 0;
