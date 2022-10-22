namespace TipTournament2._0.Models
{
    using System;
    using System.Collections.Generic;
    using System.ComponentModel.DataAnnotations;
    using System.ComponentModel.DataAnnotations.Schema;
    using System.Linq;
    using System.Threading.Tasks;

    public class GroupBet
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

        public int Points { get; set; }

        public string UserId { get; set; }

        [ForeignKey("UserId")]
        public ApplicationUser User { get; set; }

        public string GroupId { get; set; }

        [ForeignKey("GroupId")]
        public Group Group { get; set; }
    }
}
