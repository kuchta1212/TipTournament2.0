namespace TipTournament.Models
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

        public string HomeTeam { get; set; }

        public string AwayTeam { get; set; }

        public DateTime StartTime { get; set; }
        
        [ForeignKey("Results")]
        public Result Result { get; set; }

        public bool Ended { get; set; }

        public string Link { get; set; }
    }
}
