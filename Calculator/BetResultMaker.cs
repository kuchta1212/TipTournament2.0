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
                var result = new DeltaBetResult();
                result.IsHomeTeamCorrect = bet.HomeTeamBetId == match.HomeId;
                result.IsAwayTeamCorrect = bet.AwayTeamBetId == match.AwayId;
                
                if (result.IsHomeTeamCorrect)
                {
                    result.Points += 2;
                }

                if (result.IsAwayTeamCorrect)
                {
                    result.Points += 2;
                }

                bet.Result = result;
            }
            return bets;
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
