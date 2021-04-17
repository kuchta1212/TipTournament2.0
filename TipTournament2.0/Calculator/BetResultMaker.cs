namespace TipTournament2._0.Calculator
{
    using System;
    using System.Collections.Generic;
    using System.Linq;
    using System.Threading.Tasks;
    using TipTournament2._0.Models;

    public class BetResultMaker : IBetResultMaker
    {
        public List<Bet> UpdateBetResult(List<Bet> bets)
        {
            throw new NotImplementedException();
        }

        private BetResult GetBetResult(Result result, Bet bet)
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

            if (resultDiff != 0)
            {
                if(result.IsHomeTeamWinner() && bet.Tip.IsHomeTeamWinner())
                {
                    return BetResult.WINNER;
                }
            }

            return BetResult.NOTHING;
        }
    }
}
