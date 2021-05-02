namespace TipTournament.Calculator
{
    using System;
    using System.Collections.Generic;
    using System.Linq;
    using System.Threading.Tasks;
    using TipTournament.Models;

    public interface IBetResultMaker
    {
        List<Bet> UpdateBetResult(List<Bet> bets);
    }
}
