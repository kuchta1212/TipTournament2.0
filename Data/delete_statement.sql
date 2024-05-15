delete from dbo.Bets
delete from dbo.BetsStatuses
delete from dbo.TopShooterBets
delete from dbo.UpdateStatuses
delete from dbo.TeamPlaceBets
delete from dbo.DeltaBets
delete from dbo.DeltaBetResults
delete from dbo.Matches
delete from dbo.Groups
delete from dbo.GroupBets
delete from dbo.GroupResults
delete from dbo.GroupBetResults
delete from dbo.Teams
delete from dbo.Results
delete from dbo.AspNetUsers where Id != 'c893061d-b147-4f87-8067-40ff9c8b8776'
update dbo.AspNetUsers
set AlfaPoints = 0, DeltaPoints = 0, GamaPoints = 0, LambdaPoints = 0, OmikronPoints = 0, TotalPoints = 0
where Id = 'c893061d-b147-4f87-8067-40ff9c8b8776'