namespace TipTournament.Data
{
    using Microsoft.AspNetCore.Identity.EntityFrameworkCore;
    using Microsoft.EntityFrameworkCore;
    using System;
    using System.Collections.Generic;
    using System.Text;
    using TipTournament.Models;

    public class ApplicationDbContext : IdentityDbContext
    {
        public DbSet<Match> Matches { get; set; }

        public DbSet<Result> Results { get; set; }

        public DbSet<Bet> Bets { get; set; }

        public DbSet<ApplicationUser> Players { get; set; }

        public ApplicationDbContext(DbContextOptions<ApplicationDbContext> options)
            : base(options)
        {
        }
    }
}
