namespace TipTournament2._0.Calculator
{
    using System;
    using System.Collections.Generic;
    using System.Linq;
    using System.Threading.Tasks;
    using TipTournament2._0.Models;

    public interface IBetResultMaker
    {
        List<Bet> UpdateBetResult(List<Bet> bets);
    }
}
