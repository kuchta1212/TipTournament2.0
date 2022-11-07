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

        public string MatchId { get; set; }

        [ForeignKey("MatchId")]
        public Match Match { get; set; }

        public string HomeTeamBetId { get; set; }

        [ForeignKey("HomeTeamBetId")]
        public Team HomeTeamBet { get; set; }

        public string AwayTeamBetId { get; set; }

        [ForeignKey("AwayTeamBetId")]
        public Team AwayTeamBet { get; set; }

        public string ResultId { get; set; }

        [ForeignKey("ResultId")]
        public DeltaBetResult Result { get; set; }

        public string UserId { get; set; }

        [ForeignKey("UserId")]
        public ApplicationUser User { get; set; }
    }
}
