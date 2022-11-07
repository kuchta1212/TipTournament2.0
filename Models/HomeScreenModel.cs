namespace TipTournament2._0.Models
{
    using System;
    using System.Collections.Generic;
    using System.Linq;
    using System.Threading.Tasks;

    public class HomeScreenModel
    {
        public List<Match> Matches { get; set; }

        public List<ApplicationUser> Users { get; set; }

        public List<MatchBet> Bets { get; set; }

        public UpdateStatus Status {get; set; }
    }
}
