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

        public Team First { get; set; }

        public Team Second { get; set; }

        public Team Third { get; set; }

        public Team Fourth { get; set; }

        public int Points { get; set; }

        public ApplicationUser User { get; set; }

        public Group Group { get; set; }
    }
}
