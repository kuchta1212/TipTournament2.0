namespace TipTournament2._0.Models
{
    using System;
    using System.Collections.Generic;
    using System.ComponentModel.DataAnnotations;
    using System.ComponentModel.DataAnnotations.Schema;
    using System.Linq;
    using System.Threading.Tasks;

    public class GroupBetResult
    {
        [Key]
        [DatabaseGenerated(DatabaseGeneratedOption.Identity)]
        public string Id { get; set; }

        public bool IsFirstCorrect { get; set; }

        public bool IsSecondCorrect { get; set; }

        public bool IsThirdCorrect { get; set; }

        public bool IsFourthCorrect { get; set; }

        public int Points { get; set; }
    }
}
