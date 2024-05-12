namespace TipTournament2._0.Models
{
    using System;
    using System.Collections.Generic;
    using System.ComponentModel.DataAnnotations;
    using System.ComponentModel.DataAnnotations.Schema;
    using System.Linq;
    using System.Threading.Tasks;

    public class BetsStatus
    {
        [Key]
        [DatabaseGenerated(DatabaseGeneratedOption.Identity)]
        public string Id { get; set; }

        public string UserId { get; set; }

        [ForeignKey("UserId")]
        public ApplicationUser User { get; set; }

        public bool MatchesInGroupsDone { get; set; }

        public bool GroupStagesDone { get; set; }

        public bool FirstStagesDones { get; set; }

        public bool QuerterfinalStageDone { get; set; }

        public bool SemifinalStageDone { get; set; }

        public bool FinalStageDone { get; set; }

        public bool WinnerStageDone { get; set; }

        public bool LambdaStageDone { get; set; }

        public bool OmikronStageDone { get; set; }
    }
}
