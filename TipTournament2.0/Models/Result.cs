﻿using System;
using System.Collections.Generic;
using System.ComponentModel.DataAnnotations;
using System.ComponentModel.DataAnnotations.Schema;
using System.Linq;
using System.Threading.Tasks;

namespace TipTournament2._0.Models
{
    public class Result
    {
        [Key]
        [DatabaseGenerated(DatabaseGeneratedOption.Identity)]
        public string Id { get; set; }

        public int HomeTeam { get; set; }

        public int AwayTeam { get; set; }

        public bool IsHomeTeamWinner()
        {
            return HomeTeam > AwayTeam;
        }

        public bool IsDraw()
        {
            return HomeTeam == AwayTeam;
        }
    }
}
