namespace TipTournament2._0.Models
{
    using System;
    using System.Collections.Generic;
    using System.ComponentModel.DataAnnotations;
    using System.ComponentModel.DataAnnotations.Schema;
    using System.Linq;
    using System.Threading.Tasks;

    public class DeltaBet
    {
        [Key]
        [DatabaseGenerated(DatabaseGeneratedOption.Identity)]
        public string Id { get; set; }

        public Match Match { get; set; }

        public Team HomeTeamBet { get; set; }

        public Team AwayTeamBet { get; set; }

        public int Points { get; set; }

        public ApplicationUser User { get; set; }
    }
}
