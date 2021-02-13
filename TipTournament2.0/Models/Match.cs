using System;
using System.Collections.Generic;
using System.ComponentModel.DataAnnotations;
using System.ComponentModel.DataAnnotations.Schema;
using System.Linq;
using System.Threading.Tasks;

namespace TipTournament2._0.Models
{
    public class Match
    {
        [Key]
        [DatabaseGenerated(DatabaseGeneratedOption.Identity)]
        public string Id { get; set; }

        public string HomeTeam { get; set; }

        public string AwayTeam { get; set; }

        public DateTime StartTime { get; set; }
        
        [ForeignKey("Result")]
        public Result Result { get; set; }

        public bool Ended { get; set; }
    }
}
