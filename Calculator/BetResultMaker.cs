namespace TipTournament2._0.Calculator
{
    using System;
    using System.Collections.Generic;
    using System.Linq;
    using System.Threading.Tasks;
    using TipTournament2._0.Models;

    public class BetResultMaker : IBetResultMaker
    {
        public List<MatchBet> UpdateBetResult(List<MatchBet> bets, Result result)
        {
           foreach(var bet in bets)
           {
                var betResult = this.GetBetResult(result, bet);
                bet.Result = betResult;
           }

            return bets;
        }

        public List<DeltaBet> UpdateDeltaBetsResult(List<DeltaBet> bets, Match match)
        {
           foreach(var bet in bets)
            {
                bet.Result ??= new DeltaBetResult();

                bet.Result.IsHomeTeamCorrect = bet.HomeTeamBetId == match.HomeId;
                bet.Result.IsAwayTeamCorrect = bet.AwayTeamBetId == match.AwayId;

                if (bet.Result.IsHomeTeamCorrect)
                {
                    bet.Result.Points += 2;
                }

                if (bet.Result.IsAwayTeamCorrect)
                {
                    bet.Result.Points += 2;
                }
            }
            return bets;
        }

        public List<DeltaBet> UpdateAdditionalDeltaBetsResult(List<DeltaBet> bets, Match match)
        {
            var finalBetsList = new List<DeltaBet>();
            foreach (var bet in bets)
            {
                // Additional points reward a predicted team that reached this match through a different part
                // of the bracket. When the bet belongs to this same match (the final), a team that landed in
                // the exact slot it was predicted for went the correct way and is already scored by the
                // regular evaluation, so it must not earn additional points.
                var isSameMatch = bet.MatchId == match.Id;

                var homeTeamReached = bet.HomeTeamBetId == match.HomeId || bet.HomeTeamBetId == match.AwayId;
                var awayTeamReached = bet.AwayTeamBetId == match.AwayId || bet.AwayTeamBetId == match.HomeId;

                var additionalHomeTeamCorrect = homeTeamReached && !(isSameMatch && bet.HomeTeamBetId == match.HomeId);
                var addtionalAwayTeamCorrect = awayTeamReached && !(isSameMatch && bet.AwayTeamBetId == match.AwayId);

                if (additionalHomeTeamCorrect || addtionalAwayTeamCorrect)
                {
                    bet.Result ??= new DeltaBetResult();
                    bet.Result.AdditionalResult ??= new DeltaBetResult();

                    bet.Result.AdditionalResult.IsHomeTeamCorrect = additionalHomeTeamCorrect;
                    bet.Result.AdditionalResult.IsAwayTeamCorrect = addtionalAwayTeamCorrect;

                    if (bet.Result.AdditionalResult.IsHomeTeamCorrect)
                    {
                        bet.Result.AdditionalResult.Points += 2;
                    }

                    if (bet.Result.AdditionalResult.IsAwayTeamCorrect)
                    {
                        bet.Result.AdditionalResult.Points += 2;
                    }

                    finalBetsList.Add(bet);
                }
            }
            return finalBetsList;
        }


        public List<GroupBet> UpdateGroupBetsResult(List<GroupBet> bets, GroupResult groupResult)
        {

            foreach (var bet in bets)
            {
                var result = new GroupBetResult();
                result.IsFirstCorrect = bet.FirstId == groupResult.FirstId;
                result.IsSecondCorrect = bet.SecondId == groupResult.SecondId;
                result.IsThirdCorrect = bet.ThirdId == groupResult.ThirdId;
                result.IsFourthCorrect = bet.FourthId == groupResult.FourthId;

                if (result.IsFirstCorrect)
                {
                    result.Points++;
                }

                if (result.IsSecondCorrect)
                {
                    result.Points++;
                }

                if (result.IsThirdCorrect)
                {
                    result.Points++;
                }

                if (result.IsFourthCorrect)
                {
                    result.Points++;
                }

                bet.Result = result;
            }
            return bets;
        }

        public List<TopShooterBet> UpdateLambdaResults(List<TopShooterBet> bets, string name)
        {
            foreach(var bet in bets)
            {
                bet.IsCorrect = bet.ShoterName == name;
                bet.Points = bet.IsCorrect ? 7 : 0;
            }

            return bets;
        }

        public List<SpecificTeamPlaceBet> UpdateOmikronBets(List<SpecificTeamPlaceBet> bets, List<SpecificTeamPlaceBet> actualResults)
        {
            foreach(var bet in bets)
            {
                var result = actualResults.Where(r => r.teamId == bet.teamId).First();
                bet.IsCorrect = bet.StageBet == result.StageBet;
            }

            return bets;
        }

        public List<SpecificTeamPlaceBet> UpdateWinnerBets(List<SpecificTeamPlaceBet> bets, string winnerId)
        {
            foreach(var bet in bets)
            {
                bet.IsCorrect = bet.teamId == winnerId;
            }

            return bets;
        }

        private BetResult GetBetResult(Result result, MatchBet bet)
        {
            if ((result.HomeTeam == bet.Tip.HomeTeam) && (result.AwayTeam == bet.Tip.AwayTeam))
            {
                return BetResult.SCORE;
            }
                

            var resultDiff = result.HomeTeam - result.AwayTeam;
            var betDiff = bet.Tip.HomeTeam - bet.Tip.AwayTeam;

            if (resultDiff == betDiff)
            {
                return BetResult.DIFFERENCE;
            }

            if (resultDiff != 0 && betDiff != 0)
            {
                if((result.IsHomeTeamWinner() && bet.Tip.IsHomeTeamWinner()) || (!result.IsHomeTeamWinner() && !bet.Tip.IsHomeTeamWinner()))
                {
                    return BetResult.WINNER;
                }
            }

            return BetResult.NOTHING;
        }
    }
}
