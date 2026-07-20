namespace TipTournament2._0.Tests.Calculator
{
    using System.Collections.Generic;
    using TipTournament2._0.Calculator;
    using TipTournament2._0.Models;
    using Xunit;

    public class BetResultMakerTests
    {
        private readonly BetResultMaker sut = new BetResultMaker();

        #region UpdateBetResult

        [Fact]
        public void UpdateBetResult_ExactScoreMatch_ReturnsScore()
        {
            var result = new Result { HomeTeam = 2, AwayTeam = 1 };
            var bets = new List<MatchBet>
            {
                new MatchBet { Tip = new Result { HomeTeam = 2, AwayTeam = 1 } }
            };

            var updated = this.sut.UpdateBetResult(bets, result);

            Assert.Equal(BetResult.SCORE, updated[0].Result);
        }

        [Fact]
        public void UpdateBetResult_SameGoalDifferenceDifferentScores_ReturnsDifference()
        {
            var result = new Result { HomeTeam = 3, AwayTeam = 1 };
            var bets = new List<MatchBet>
            {
                new MatchBet { Tip = new Result { HomeTeam = 2, AwayTeam = 0 } }
            };

            var updated = this.sut.UpdateBetResult(bets, result);

            Assert.Equal(BetResult.DIFFERENCE, updated[0].Result);
        }

        [Fact]
        public void UpdateBetResult_CorrectWinnerDifferentDifference_ReturnsWinner()
        {
            var result = new Result { HomeTeam = 3, AwayTeam = 1 };
            var bets = new List<MatchBet>
            {
                new MatchBet { Tip = new Result { HomeTeam = 1, AwayTeam = 0 } }
            };

            var updated = this.sut.UpdateBetResult(bets, result);

            Assert.Equal(BetResult.WINNER, updated[0].Result);
        }

        [Fact]
        public void UpdateBetResult_WrongPrediction_ReturnsNothing()
        {
            var result = new Result { HomeTeam = 0, AwayTeam = 2 };
            var bets = new List<MatchBet>
            {
                new MatchBet { Tip = new Result { HomeTeam = 2, AwayTeam = 0 } }
            };

            var updated = this.sut.UpdateBetResult(bets, result);

            Assert.Equal(BetResult.NOTHING, updated[0].Result);
        }

        [Fact]
        public void UpdateBetResult_TiePredictedCorrectly_ReturnsScore()
        {
            var result = new Result { HomeTeam = 0, AwayTeam = 0 };
            var bets = new List<MatchBet>
            {
                new MatchBet { Tip = new Result { HomeTeam = 0, AwayTeam = 0 } }
            };

            var updated = this.sut.UpdateBetResult(bets, result);

            Assert.Equal(BetResult.SCORE, updated[0].Result);
        }

        [Fact]
        public void UpdateBetResult_TiePredictedDifferentScores_ReturnsDifference()
        {
            var result = new Result { HomeTeam = 2, AwayTeam = 2 };
            var bets = new List<MatchBet>
            {
                new MatchBet { Tip = new Result { HomeTeam = 1, AwayTeam = 1 } }
            };

            var updated = this.sut.UpdateBetResult(bets, result);

            Assert.Equal(BetResult.DIFFERENCE, updated[0].Result);
        }

        [Fact]
        public void UpdateBetResult_TiePredictedActualNotTie_ReturnsNothing()
        {
            var result = new Result { HomeTeam = 2, AwayTeam = 1 };
            var bets = new List<MatchBet>
            {
                new MatchBet { Tip = new Result { HomeTeam = 1, AwayTeam = 1 } }
            };

            var updated = this.sut.UpdateBetResult(bets, result);

            Assert.Equal(BetResult.NOTHING, updated[0].Result);
        }

        [Fact]
        public void UpdateBetResult_ActualTieBetNotTie_ReturnsNothing()
        {
            var result = new Result { HomeTeam = 1, AwayTeam = 1 };
            var bets = new List<MatchBet>
            {
                new MatchBet { Tip = new Result { HomeTeam = 2, AwayTeam = 0 } }
            };

            var updated = this.sut.UpdateBetResult(bets, result);

            Assert.Equal(BetResult.NOTHING, updated[0].Result);
        }

        [Fact]
        public void UpdateBetResult_HomeWinPredictedAwayWon_ReturnsNothing()
        {
            var result = new Result { HomeTeam = 0, AwayTeam = 3 };
            var bets = new List<MatchBet>
            {
                new MatchBet { Tip = new Result { HomeTeam = 2, AwayTeam = 1 } }
            };

            var updated = this.sut.UpdateBetResult(bets, result);

            Assert.Equal(BetResult.NOTHING, updated[0].Result);
        }

        [Fact]
        public void UpdateBetResult_MultipleBets_AllEvaluated()
        {
            var result = new Result { HomeTeam = 2, AwayTeam = 1 };
            var bets = new List<MatchBet>
            {
                new MatchBet { Tip = new Result { HomeTeam = 2, AwayTeam = 1 } },
                new MatchBet { Tip = new Result { HomeTeam = 0, AwayTeam = 0 } }
            };

            var updated = this.sut.UpdateBetResult(bets, result);

            Assert.Equal(BetResult.SCORE, updated[0].Result);
            Assert.Equal(BetResult.NOTHING, updated[1].Result);
        }

        #endregion

        #region UpdateDeltaBetsResult

        [Fact]
        public void UpdateDeltaBetsResult_BothTeamsCorrect_Returns4Points()
        {
            var match = new Match { HomeId = "teamA", AwayId = "teamB" };
            var bets = new List<DeltaBet>
            {
                new DeltaBet { HomeTeamBetId = "teamA", AwayTeamBetId = "teamB" }
            };

            var updated = this.sut.UpdateDeltaBetsResult(bets, match);

            Assert.Equal(4, updated[0].Result.Points);
            Assert.True(updated[0].Result.IsHomeTeamCorrect);
            Assert.True(updated[0].Result.IsAwayTeamCorrect);
        }

        [Fact]
        public void UpdateDeltaBetsResult_OnlyHomeCorrect_Returns2Points()
        {
            var match = new Match { HomeId = "teamA", AwayId = "teamB" };
            var bets = new List<DeltaBet>
            {
                new DeltaBet { HomeTeamBetId = "teamA", AwayTeamBetId = "teamC" }
            };

            var updated = this.sut.UpdateDeltaBetsResult(bets, match);

            Assert.Equal(2, updated[0].Result.Points);
            Assert.True(updated[0].Result.IsHomeTeamCorrect);
            Assert.False(updated[0].Result.IsAwayTeamCorrect);
        }

        [Fact]
        public void UpdateDeltaBetsResult_OnlyAwayCorrect_Returns2Points()
        {
            var match = new Match { HomeId = "teamA", AwayId = "teamB" };
            var bets = new List<DeltaBet>
            {
                new DeltaBet { HomeTeamBetId = "teamC", AwayTeamBetId = "teamB" }
            };

            var updated = this.sut.UpdateDeltaBetsResult(bets, match);

            Assert.Equal(2, updated[0].Result.Points);
            Assert.False(updated[0].Result.IsHomeTeamCorrect);
            Assert.True(updated[0].Result.IsAwayTeamCorrect);
        }

        [Fact]
        public void UpdateDeltaBetsResult_NeitherCorrect_Returns0Points()
        {
            var match = new Match { HomeId = "teamA", AwayId = "teamB" };
            var bets = new List<DeltaBet>
            {
                new DeltaBet { HomeTeamBetId = "teamC", AwayTeamBetId = "teamD" }
            };

            var updated = this.sut.UpdateDeltaBetsResult(bets, match);

            Assert.Equal(0, updated[0].Result.Points);
        }

        [Fact]
        public void UpdateDeltaBetsResult_NullResult_InitializesDeltaBetResult()
        {
            var match = new Match { HomeId = "teamA", AwayId = "teamB" };
            var bets = new List<DeltaBet>
            {
                new DeltaBet { HomeTeamBetId = "teamA", AwayTeamBetId = "teamB", Result = null }
            };

            var updated = this.sut.UpdateDeltaBetsResult(bets, match);

            Assert.NotNull(updated[0].Result);
            Assert.Equal(4, updated[0].Result.Points);
        }

        #endregion

        #region UpdateAdditionalDeltaBetsResult

        [Fact]
        public void UpdateAdditionalDeltaBetsResult_BothCorrectSwapped_Returns4Points()
        {
            var match = new Match { HomeId = "teamA", AwayId = "teamB" };
            var bets = new List<DeltaBet>
            {
                new DeltaBet { HomeTeamBetId = "teamB", AwayTeamBetId = "teamA", Result = null }
            };

            var updated = this.sut.UpdateAdditionalDeltaBetsResult(bets, match);

            Assert.Single(updated);
            Assert.Equal(4, updated[0].Result.AdditionalResult.Points);
            Assert.True(updated[0].Result.AdditionalResult.IsHomeTeamCorrect);
            Assert.True(updated[0].Result.AdditionalResult.IsAwayTeamCorrect);
        }

        [Fact]
        public void UpdateAdditionalDeltaBetsResult_DifferentMatchHomeTeamReached_Returns2Points()
        {
            var match = new Match { Id = "match_2", HomeId = "teamA", AwayId = "teamB" };
            var bets = new List<DeltaBet>
            {
                new DeltaBet { MatchId = "match_1", HomeTeamBetId = "teamA", AwayTeamBetId = "teamC", Result = null }
            };

            var updated = this.sut.UpdateAdditionalDeltaBetsResult(bets, match);

            Assert.Single(updated);
            Assert.Equal(2, updated[0].Result.AdditionalResult.Points);
            Assert.True(updated[0].Result.AdditionalResult.IsHomeTeamCorrect);
            Assert.False(updated[0].Result.AdditionalResult.IsAwayTeamCorrect);
        }

        [Fact]
        public void UpdateAdditionalDeltaBetsResult_SameMatchCorrectSlots_ExcludedFromResult()
        {
            var match = new Match { Id = "match_final", HomeId = "teamA", AwayId = "teamB" };
            var bets = new List<DeltaBet>
            {
                new DeltaBet { MatchId = "match_final", HomeTeamBetId = "teamA", AwayTeamBetId = "teamB", Result = null }
            };

            var updated = this.sut.UpdateAdditionalDeltaBetsResult(bets, match);

            Assert.Empty(updated);
        }

        [Fact]
        public void UpdateAdditionalDeltaBetsResult_SameMatchHomeCorrectSlotAwayMissing_ExcludedFromResult()
        {
            var match = new Match { Id = "match_final", HomeId = "teamA", AwayId = "teamB" };
            var bets = new List<DeltaBet>
            {
                new DeltaBet { MatchId = "match_final", HomeTeamBetId = "teamA", AwayTeamBetId = "teamC", Result = null }
            };

            var updated = this.sut.UpdateAdditionalDeltaBetsResult(bets, match);

            Assert.Empty(updated);
        }

        [Fact]
        public void UpdateAdditionalDeltaBetsResult_SameMatchHomeCrossedToAway_Returns2Points()
        {
            var match = new Match { Id = "match_final", HomeId = "teamA", AwayId = "teamB" };
            var bets = new List<DeltaBet>
            {
                new DeltaBet { MatchId = "match_final", HomeTeamBetId = "teamB", AwayTeamBetId = "teamC", Result = null }
            };

            var updated = this.sut.UpdateAdditionalDeltaBetsResult(bets, match);

            Assert.Single(updated);
            Assert.Equal(2, updated[0].Result.AdditionalResult.Points);
            Assert.True(updated[0].Result.AdditionalResult.IsHomeTeamCorrect);
            Assert.False(updated[0].Result.AdditionalResult.IsAwayTeamCorrect);
        }

        [Fact]
        public void UpdateAdditionalDeltaBetsResult_NeitherCorrect_ExcludedFromResult()
        {
            var match = new Match { HomeId = "teamA", AwayId = "teamB" };
            var bets = new List<DeltaBet>
            {
                new DeltaBet { HomeTeamBetId = "teamC", AwayTeamBetId = "teamD", Result = null }
            };

            var updated = this.sut.UpdateAdditionalDeltaBetsResult(bets, match);

            Assert.Empty(updated);
        }

        [Fact]
        public void UpdateAdditionalDeltaBetsResult_InitializesNestedResults()
        {
            var match = new Match { Id = "match_final", HomeId = "teamA", AwayId = "teamB" };
            var bets = new List<DeltaBet>
            {
                new DeltaBet { MatchId = "match_final", HomeTeamBetId = "teamB", AwayTeamBetId = "teamA", Result = null }
            };

            var updated = this.sut.UpdateAdditionalDeltaBetsResult(bets, match);

            Assert.NotNull(updated[0].Result);
            Assert.NotNull(updated[0].Result.AdditionalResult);
        }

        #endregion

        #region UpdateGroupBetsResult

        [Fact]
        public void UpdateGroupBetsResult_AllCorrect_Returns4Points()
        {
            var groupResult = new GroupResult
            {
                FirstId = "t1", SecondId = "t2", ThirdId = "t3", FourthId = "t4"
            };
            var bets = new List<GroupBet>
            {
                new GroupBet { FirstId = "t1", SecondId = "t2", ThirdId = "t3", FourthId = "t4" }
            };

            var updated = this.sut.UpdateGroupBetsResult(bets, groupResult);

            Assert.Equal(4, updated[0].Result.Points);
            Assert.True(updated[0].Result.IsFirstCorrect);
            Assert.True(updated[0].Result.IsSecondCorrect);
            Assert.True(updated[0].Result.IsThirdCorrect);
            Assert.True(updated[0].Result.IsFourthCorrect);
        }

        [Fact]
        public void UpdateGroupBetsResult_ThreeCorrect_Returns3Points()
        {
            var groupResult = new GroupResult
            {
                FirstId = "t1", SecondId = "t2", ThirdId = "t3", FourthId = "t4"
            };
            var bets = new List<GroupBet>
            {
                new GroupBet { FirstId = "t1", SecondId = "t2", ThirdId = "t3", FourthId = "wrong" }
            };

            var updated = this.sut.UpdateGroupBetsResult(bets, groupResult);

            Assert.Equal(3, updated[0].Result.Points);
        }

        [Fact]
        public void UpdateGroupBetsResult_OneCorrect_Returns1Point()
        {
            var groupResult = new GroupResult
            {
                FirstId = "t1", SecondId = "t2", ThirdId = "t3", FourthId = "t4"
            };
            var bets = new List<GroupBet>
            {
                new GroupBet { FirstId = "t1", SecondId = "wrong", ThirdId = "wrong", FourthId = "wrong" }
            };

            var updated = this.sut.UpdateGroupBetsResult(bets, groupResult);

            Assert.Equal(1, updated[0].Result.Points);
        }

        [Fact]
        public void UpdateGroupBetsResult_AllWrong_Returns0Points()
        {
            var groupResult = new GroupResult
            {
                FirstId = "t1", SecondId = "t2", ThirdId = "t3", FourthId = "t4"
            };
            var bets = new List<GroupBet>
            {
                new GroupBet { FirstId = "w1", SecondId = "w2", ThirdId = "w3", FourthId = "w4" }
            };

            var updated = this.sut.UpdateGroupBetsResult(bets, groupResult);

            Assert.Equal(0, updated[0].Result.Points);
        }

        #endregion

        #region UpdateLambdaResults

        [Fact]
        public void UpdateLambdaResults_CorrectName_IsCorrectAndSevenPoints()
        {
            var bets = new List<TopShooterBet>
            {
                new TopShooterBet { ShoterName = "Ronaldo" }
            };

            var updated = this.sut.UpdateLambdaResults(bets, "Ronaldo");

            Assert.True(updated[0].IsCorrect);
            Assert.Equal(7, updated[0].Points);
        }

        [Fact]
        public void UpdateLambdaResults_WrongName_NotCorrectAndZeroPoints()
        {
            var bets = new List<TopShooterBet>
            {
                new TopShooterBet { ShoterName = "Messi" }
            };

            var updated = this.sut.UpdateLambdaResults(bets, "Ronaldo");

            Assert.False(updated[0].IsCorrect);
            Assert.Equal(0, updated[0].Points);
        }

        #endregion

        #region UpdateOmikronBets

        [Fact]
        public void UpdateOmikronBets_StageMatches_IsCorrectTrue()
        {
            var bets = new List<SpecificTeamPlaceBet>
            {
                new SpecificTeamPlaceBet { teamId = "t1", StageBet = TournamentStage.Quarterfinal }
            };
            var actual = new List<SpecificTeamPlaceBet>
            {
                new SpecificTeamPlaceBet { teamId = "t1", StageBet = TournamentStage.Quarterfinal }
            };

            var updated = this.sut.UpdateOmikronBets(bets, actual);

            Assert.True(updated[0].IsCorrect);
        }

        [Fact]
        public void UpdateOmikronBets_StageDoesNotMatch_IsCorrectFalse()
        {
            var bets = new List<SpecificTeamPlaceBet>
            {
                new SpecificTeamPlaceBet { teamId = "t1", StageBet = TournamentStage.Quarterfinal }
            };
            var actual = new List<SpecificTeamPlaceBet>
            {
                new SpecificTeamPlaceBet { teamId = "t1", StageBet = TournamentStage.Semifinal }
            };

            var updated = this.sut.UpdateOmikronBets(bets, actual);

            Assert.False(updated[0].IsCorrect);
        }

        #endregion

        #region UpdateWinnerBets

        [Fact]
        public void UpdateWinnerBets_CorrectTeam_IsCorrectTrue()
        {
            var bets = new List<SpecificTeamPlaceBet>
            {
                new SpecificTeamPlaceBet { teamId = "t1" }
            };

            var updated = this.sut.UpdateWinnerBets(bets, "t1");

            Assert.True(updated[0].IsCorrect);
        }

        [Fact]
        public void UpdateWinnerBets_WrongTeam_IsCorrectFalse()
        {
            var bets = new List<SpecificTeamPlaceBet>
            {
                new SpecificTeamPlaceBet { teamId = "t1" }
            };

            var updated = this.sut.UpdateWinnerBets(bets, "t2");

            Assert.False(updated[0].IsCorrect);
        }

        #endregion
    }
}
