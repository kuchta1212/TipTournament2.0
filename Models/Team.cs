namespace TipTournament2._0.Models
{
    using System;
    using System.Collections.Generic;
    using System.ComponentModel.DataAnnotations;
    using System.ComponentModel.DataAnnotations.Schema;
    using System.Linq;
    using System.Threading.Tasks;

    public class Team
    {
        [Key]
        [DatabaseGenerated(DatabaseGeneratedOption.Identity)]
        public string Id { get; set; }

        public string Name { get; set; }

        public string IconPath { get; set; }

        public TournamentStage FinishedAt { get; set; }

        public override bool Equals(object obj)
        {
            var comparer = (Team)obj;

            return comparer.Id == this.Id;
        }
    }
}
