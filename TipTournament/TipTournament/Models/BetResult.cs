namespace TipTournament.Models
{
    using System;
    using System.Collections.Generic;
    using System.Linq;
    using System.Threading.Tasks;

    public enum BetResult
    {
        //WRONG
        NOTHING = 0,

        //CORRECT WINNER
        WINNER = 1,

        //CORRECT WINNER AND CORRECT DIFFERNECE IN GOALS
        DIFFERENCE = 2,

        //CORRECT RESULT AND CORRECT WINNER
        SCORE = 4,
    }
}
