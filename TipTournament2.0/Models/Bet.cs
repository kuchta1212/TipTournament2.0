namespace TipTournament2._0.Models
{
    using System;
    using System.Collections.Generic;
    using System.ComponentModel.DataAnnotations;
    using System.ComponentModel.DataAnnotations.Schema;
    using System.Linq;
    using System.Threading.Tasks;

    public class Bet
    {
        [Key]
        [DatabaseGenerated(DatabaseGeneratedOption.Identity)]
        public string Id { get; set; }

        [ForeignKey("AspNetUsers")]
        public ApplicationUser User { get; set; }

        [ForeignKey("Match")]
        public Match Match { get; set; }

        [ForeignKey("Result")]
        public Result Tip { get; set; }
    }
}
