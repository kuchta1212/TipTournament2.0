namespace TipTournament2._0.Data
{
    using Microsoft.AspNetCore.Identity.EntityFrameworkCore;
    using Microsoft.EntityFrameworkCore;
    using TipTournament2._0.Models;

    public class ApplicationDbContext : IdentityDbContext<ApplicationUser>
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

        public DbSet<GroupBetResult> GroupBetResults { get; set; }

        public DbSet<DeltaBetResult> DeltaBetResults { get; set; }

        public ApplicationDbContext(DbContextOptions options) : base(options)
        {
        }
    }
}
