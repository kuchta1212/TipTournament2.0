namespace TipTournament2._0.Controllers
{
    using Microsoft.AspNetCore.Authorization;
    using Microsoft.AspNetCore.Mvc;
    using System;
    using System.Collections.Generic;
    using System.Linq;
    using TipTournament2._0.Data;
    using TipTournament2._0.Models;

    [ApiController]
    [Authorize]
    [Route("api/stats")]
    public class StatsController : Controller
    {
        private readonly IDbContextWrapper context;

        public StatsController(IDbContextWrapper context)
        {
            this.context = context;
        }

        [HttpGet]
        public IActionResult GetStats()
        {
            var allBets = this.context.GetAllBetsWithIncludes();
            var allDeltaBets = this.context.GetAllDeltaBetsWithIncludes();
            var matches = this.context.GetMatches();
            var users = this.context.GetAllUsers();

            var endedMatches = matches.Where(m => m.Ended).ToList();
            var endedMatchIds = new HashSet<string>(endedMatches.Select(m => m.Id));
            var betsOnEndedMatches = allBets.Where(b => endedMatchIds.Contains(b.Match.Id)).ToList();

            var result = new
            {
                RankingOverTime = ComputeRankingOverTime(allBets, allDeltaBets, endedMatches, users),
                MatchNoOneGuessed = ComputeMatchNoOneGuessed(betsOnEndedMatches, endedMatches),
                ExactScoreHeroes = ComputeExactScoreHeroes(betsOnEndedMatches),
                DixitLegends = ComputeDixitLegends(betsOnEndedMatches),
                BiggestUpsets = ComputeBiggestUpsets(betsOnEndedMatches, endedMatches),
                MostPredictableMatches = ComputeMostPredictable(betsOnEndedMatches, endedMatches),
                JokerEfficiency = ComputeJokerEfficiency(betsOnEndedMatches),
                AveragePointsPerMatch = ComputeAveragePoints(users, betsOnEndedMatches)
            };

            return new OkObjectResult(result);
        }

        private static string GetPhaseLabel(Match match)
        {
            if (match.Stage == TournamentStage.Group)
                return $"Kolo {match.Round}";

            switch (match.Stage)
            {
                case TournamentStage.FirstRound: return "Osmifinále";
                case TournamentStage.Quarterfinal: return "Čtvrtfinále";
                case TournamentStage.Semifinal: return "Semifinále";
                case TournamentStage.Final: return "Finále";
                default: return match.Stage.ToString();
            }
        }

        private object ComputeRankingOverTime(List<MatchBet> allBets, List<DeltaBet> allDeltaBets, List<Match> endedMatches, List<ApplicationUser> users)
        {
            var orderedMatches = endedMatches.OrderBy(m => m.StartTime).ThenBy(m => m.Id).ToList();

            // Group stage match bets by match
            var matchBetsByMatch = allBets
                .Where(b => b.Match.Ended)
                .GroupBy(b => b.Match.Id)
                .ToDictionary(g => g.Key, g => g.ToList());

            // Delta bets by match (knockout stage)
            var deltaBetsByMatch = allDeltaBets
                .Where(b => b.Match != null && b.Match.Ended && b.Result != null)
                .GroupBy(b => b.Match.Id)
                .ToDictionary(g => g.Key, g => g.ToList());

            var cumulative = users.ToDictionary(u => u.Id, u => 0);
            var entries = new List<object>();

            foreach (var match in orderedMatches)
            {
                // Add points from group-stage match bets
                if (matchBetsByMatch.TryGetValue(match.Id, out var matchBets))
                {
                    foreach (var bet in matchBets)
                    {
                        var points = (int)bet.Result;
                        if (bet.IsJoker && bet.Result != BetResult.NOTHING)
                        {
                            points *= 2;
                        }
                        points += bet.DixitBonus;

                        if (cumulative.ContainsKey(bet.User.Id))
                        {
                            cumulative[bet.User.Id] += points;
                        }
                    }
                }

                // Add points from delta bets (knockout stage)
                if (deltaBetsByMatch.TryGetValue(match.Id, out var deltaBets))
                {
                    foreach (var bet in deltaBets)
                    {
                        var points = bet.Result.Points + bet.DixitBonus;
                        if (bet.Result.AdditionalResult != null)
                        {
                            points += bet.Result.AdditionalResult.Points;
                        }

                        if (cumulative.ContainsKey(bet.UserId))
                        {
                            cumulative[bet.UserId] += points;
                        }
                    }
                }

                entries.Add(new
                {
                    MatchLabel = GetPhaseLabel(match),
                    MatchStartTime = match.StartTime,
                    PlayerPoints = users.Select(u => new
                    {
                        UserName = u.UserName,
                        CumulativePoints = cumulative.ContainsKey(u.Id) ? cumulative[u.Id] : 0
                    }).ToList()
                });
            }

            return entries;
        }

        private object ComputeMatchNoOneGuessed(List<MatchBet> betsOnEnded, List<Match> endedMatches)
        {
            var matchesWithBets = betsOnEnded
                .GroupBy(b => b.Match.Id)
                .Where(g => g.All(b => b.Result == BetResult.NOTHING))
                .Select(g => g.First().Match)
                .ToList();

            return matchesWithBets.Select(m => new
            {
                MatchId = m.Id,
                Home = m.Home?.Name,
                Away = m.Away?.Name,
                HomeIcon = m.Home?.IconPath,
                AwayIcon = m.Away?.IconPath,
                Result = m.Result != null ? $"{m.Result.HomeTeam}:{m.Result.AwayTeam}" : null,
                StartTime = m.StartTime
            }).OrderBy(m => m.StartTime).ToList();
        }

        private object ComputeExactScoreHeroes(List<MatchBet> betsOnEnded)
        {
            return betsOnEnded
                .Where(b => b.Result == BetResult.SCORE)
                .GroupBy(b => b.User.UserName)
                .Select(g => new { UserName = g.Key, Count = g.Count() })
                .OrderByDescending(x => x.Count)
                .ToList();
        }

        private object ComputeDixitLegends(List<MatchBet> betsOnEnded)
        {
            return betsOnEnded
                .Where(b => b.DixitBonus == 3)
                .GroupBy(b => b.User.UserName)
                .Select(g => new { UserName = g.Key, Count = g.Count() })
                .OrderByDescending(x => x.Count)
                .ToList();
        }

        private object ComputeBiggestUpsets(List<MatchBet> betsOnEnded, List<Match> endedMatches)
        {
            return betsOnEnded
                .GroupBy(b => b.Match.Id)
                .Select(g =>
                {
                    var match = g.First().Match;
                    var total = g.Count();
                    var nothingCount = g.Count(b => b.Result == BetResult.NOTHING);
                    return new
                    {
                        MatchId = match.Id,
                        Home = match.Home?.Name,
                        Away = match.Away?.Name,
                        HomeIcon = match.Home?.IconPath,
                        AwayIcon = match.Away?.IconPath,
                        Result = match.Result != null ? $"{match.Result.HomeTeam}:{match.Result.AwayTeam}" : null,
                        CorrectPercentage = Math.Round((double)(total - nothingCount) / total * 100, 1),
                        TotalBets = total
                    };
                })
                .OrderBy(x => x.CorrectPercentage)
                .Take(10)
                .ToList();
        }

        private object ComputeMostPredictable(List<MatchBet> betsOnEnded, List<Match> endedMatches)
        {
            return betsOnEnded
                .GroupBy(b => b.Match.Id)
                .Select(g =>
                {
                    var match = g.First().Match;
                    var total = g.Count();
                    var correctCount = total - g.Count(b => b.Result == BetResult.NOTHING);
                    return new
                    {
                        MatchId = match.Id,
                        Home = match.Home?.Name,
                        Away = match.Away?.Name,
                        HomeIcon = match.Home?.IconPath,
                        AwayIcon = match.Away?.IconPath,
                        Result = match.Result != null ? $"{match.Result.HomeTeam}:{match.Result.AwayTeam}" : null,
                        CorrectPercentage = Math.Round((double)correctCount / total * 100, 1),
                        TotalBets = total
                    };
                })
                .OrderByDescending(x => x.CorrectPercentage)
                .Take(10)
                .ToList();
        }

        private object ComputeJokerEfficiency(List<MatchBet> betsOnEnded)
        {
            var jokerBets = betsOnEnded.Where(b => b.IsJoker).ToList();

            return jokerBets
                .GroupBy(b => b.User.UserName)
                .Select(g =>
                {
                    var total = g.Count();
                    var correct = g.Count(b => b.Result != BetResult.NOTHING);
                    var extraPoints = g.Sum(b =>
                    {
                        if (b.Result != BetResult.NOTHING)
                        {
                            return (int)b.Result;
                        }
                        return 0;
                    });

                    return new
                    {
                        UserName = g.Key,
                        JokersUsed = total,
                        JokersCorrect = correct,
                        SuccessRate = total > 0 ? Math.Round((double)correct / total * 100, 1) : 0,
                        TotalExtraPoints = extraPoints
                    };
                })
                .OrderByDescending(x => x.TotalExtraPoints)
                .ToList();
        }

        private object ComputeAveragePoints(List<ApplicationUser> users, List<MatchBet> betsOnEnded)
        {
            var betCountByUser = betsOnEnded
                .GroupBy(b => b.User.Id)
                .ToDictionary(g => g.Key, g => g.Count());

            return users
                .Where(u => betCountByUser.ContainsKey(u.Id) && betCountByUser[u.Id] > 0)
                .Select(u => new
                {
                    UserName = u.UserName,
                    TotalAlfaPoints = u.AlfaPoints,
                    MatchesBetOn = betCountByUser[u.Id],
                    Average = Math.Round((double)u.AlfaPoints / betCountByUser[u.Id], 2)
                })
                .OrderByDescending(x => x.Average)
                .ToList();
        }
    }
}
