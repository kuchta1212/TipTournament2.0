namespace TipTournament2._0.Models
{
    using System;
    using System.Collections.Generic;
    using System.ComponentModel.DataAnnotations;
    using System.ComponentModel.DataAnnotations.Schema;
    using System.Linq;
    using System.Threading.Tasks;

    public class SpecificTeamPlaceBet
    {
        [Key]
        [DatabaseGenerated(DatabaseGeneratedOption.Identity)]
        public string Id { get; set; }

        public string teamId { get; set; }

        [ForeignKey("teamId")]
        public Team Team { get; set; }

        public TournamentStage StageBet { get; set; }

        public bool IsWinnerBet { get; set; }

        public bool IsCorrect { get; set; }

        public string UserId { get; set; }

        [ForeignKey("UserId")]
        public ApplicationUser User { get; set; }
    }
}
