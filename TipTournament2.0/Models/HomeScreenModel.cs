using System;
using System.Collections.Generic;
using System.Linq;
using System.Threading.Tasks;

namespace TipTournament2._0.Models
{
    public class HomeScreenModel
    {
        public List<Match> Matches { get; set; }

        public List<ApplicationUser> Users { get; set; }

        public List<Bet> Bets { get; set; }
    }
}
