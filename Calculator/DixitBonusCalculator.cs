namespace TipTournament2._0.Calculator
{
    using System.Collections.Generic;
    using System.Linq;
    using TipTournament2._0.Models;

    public static class DixitBonusCalculator
    {
        public static void ApplyDixitBonus(List<MatchBet> bets)
        {
            if (bets == null || bets.Count == 0)
            {
                return;
            }

            var totalCount = bets.Count;
            var correctCount = bets.Count(b => b.Result != BetResult.NOTHING);

            foreach (var bet in bets)
            {
                if (bet.Result == BetResult.NOTHING)
                {
                    bet.DixitBonus = 0;
                    continue;
                }

                bet.DixitBonus = CalculateBonus(correctCount, totalCount);
            }
        }

        public static void ApplyDixitBonus(List<DeltaBet> bets)
        {
            if (bets == null || bets.Count == 0)
            {
                return;
            }

            var totalCount = bets.Count;
            var correctCount = bets.Count(b => b.Result != null && b.Result.Points > 0);

            foreach (var bet in bets)
            {
                if (bet.Result == null || bet.Result.Points <= 0)
                {
                    bet.DixitBonus = 0;
                    continue;
                }

                bet.DixitBonus = CalculateBonus(correctCount, totalCount);
            }
        }

        private static int CalculateBonus(int correctCount, int totalCount)
        {
            if (correctCount == 1)
            {
                return 3;
            }

            var ratio = (double)correctCount / totalCount;

            if (ratio < 0.20)
            {
                return 2;
            }

            if (ratio < 0.40)
            {
                return 1;
            }

            return 0;
        }
    }
}
