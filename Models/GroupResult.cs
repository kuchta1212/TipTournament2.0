namespace TipTournament2._0.Models
{
    using System;
    using System.Collections.Generic;
    using System.ComponentModel.DataAnnotations;
    using System.ComponentModel.DataAnnotations.Schema;
    using System.Linq;
    using System.Threading.Tasks;

    public class GroupResult
    {
        [Key]
        [DatabaseGenerated(DatabaseGeneratedOption.Identity)]
        public string Id { get; set; }

        public string FirstId { get; set; }

        [ForeignKey("FirstId")]
        public Team First { get; set; }

        public string SecondId { get; set; }

        [ForeignKey("SecondId")]
        public Team Second { get; set; }

        public string ThirdId { get; set; }
        
        [ForeignKey("ThirdId")]
        public Team Third { get; set; }

        public string FourthId { get; set; }

        [ForeignKey("FourthId")]
        public Team Fourth { get; set; }
    }
}
