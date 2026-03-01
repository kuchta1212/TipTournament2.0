namespace TipTournament2._0.Tests.Models
{
    using TipTournament2._0.Models;
    using Xunit;

    public class ResultTests
    {
        [Fact]
        public void IsHomeTeamWinner_HomeGreaterThanAway_ReturnsTrue()
        {
            var result = new Result { HomeTeam = 3, AwayTeam = 1 };

            Assert.True(result.IsHomeTeamWinner());
        }

        [Fact]
        public void IsHomeTeamWinner_Tie_ReturnsFalse()
        {
            var result = new Result { HomeTeam = 1, AwayTeam = 1 };

            Assert.False(result.IsHomeTeamWinner());
        }

        [Fact]
        public void IsHomeTeamWinner_AwayWins_ReturnsFalse()
        {
            var result = new Result { HomeTeam = 0, AwayTeam = 2 };

            Assert.False(result.IsHomeTeamWinner());
        }

        [Fact]
        public void IsTie_EqualScores_ReturnsTrue()
        {
            var result = new Result { HomeTeam = 2, AwayTeam = 2 };

            Assert.True(result.IsTie());
        }

        [Fact]
        public void IsTie_UnequalScores_ReturnsFalse()
        {
            var result = new Result { HomeTeam = 2, AwayTeam = 1 };

            Assert.False(result.IsTie());
        }

        [Fact]
        public void ToString_FormatsAsHomeColonAway()
        {
            var result = new Result { HomeTeam = 3, AwayTeam = 1 };

            Assert.Equal("3:1", result.ToString());
        }
    }
}
