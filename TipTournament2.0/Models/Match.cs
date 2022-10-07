namespace TipTournament2._0.Models
{
    using System;
    using System.Collections.Generic;
    using System.ComponentModel.DataAnnotations;
    using System.ComponentModel.DataAnnotations.Schema;
    using System.Linq;
    using System.Threading.Tasks;

    public class Match
    {
        [Key]
        [DatabaseGenerated(DatabaseGeneratedOption.Identity)]
        public string Id { get; set; }

        public Team Home { get; set; }

        public Team Away { get; set; }

        public DateTime StartTime { get; set; }

        public Result Result { get; set; }

        public bool Ended { get; set; }

        public string Link { get; set; }

        public TournamentStage Stage { get; set; }
    }
}
