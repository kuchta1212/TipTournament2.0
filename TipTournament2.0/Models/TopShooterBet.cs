namespace TipTournament2._0.Models
{
    using System;
    using System.Collections.Generic;
    using System.ComponentModel.DataAnnotations;
    using System.ComponentModel.DataAnnotations.Schema;
    using System.Linq;
    using System.Threading.Tasks;

    public class TopShooterBet
    {
        [Key]
        [DatabaseGenerated(DatabaseGeneratedOption.Identity)]
        public string Id { get; set; }

        public string ShoterNameOne { get; set; }

        public string ShoterNameTwo { get; set; }

        public string ShoterNameThree { get; set; }

        public int Points { get; set; }
    }
}
