namespace TipTournament2._0.Data
{
    using IdentityServer4.EntityFramework.Options;
    using Microsoft.AspNetCore.ApiAuthorization.IdentityServer;
    using Microsoft.EntityFrameworkCore;
    using Microsoft.Extensions.Options;
    using System;
    using System.Collections.Generic;
    using System.Linq;
    using System.Threading.Tasks;
    using TipTournament2._0.Models;

    public class ApplicationDbContext : ApiAuthorizationDbContext<ApplicationUser>
    {
        public DbSet<Match> Matches { get; set; }

        public DbSet<Result> Results { get; set; }

        public DbSet<MatchBet> Bets { get; set; }

        public DbSet<ApplicationUser> Players { get; set; }

        public DbSet<UpdateStatus> UpdateStatuses { get; set; }

        public DbSet<Team> Teams { get; set; }

        public DbSet<Group> Groups { get; set; }

        public DbSet<GroupBet> GroupBets { get; set; }

        public DbSet<SpecificTeamPlaceBet> TeamPlaceBets { get; set; }

        public DbSet<TopShooterBet> TopShooterBets { get; set; }

        public DbSet<Comment> Comments { get; set; }

        public DbSet<GroupResult> GroupResults { get; set; }

        public DbSet<DeltaBet> DeltaBets { get; set; }

        public DbSet<BetsStatus> BetsStatuses { get; set; }

        public ApplicationDbContext(
            DbContextOptions options,
            IOptions<OperationalStoreOptions> operationalStoreOptions) : base(options, operationalStoreOptions)
        {
        }
    }
}
