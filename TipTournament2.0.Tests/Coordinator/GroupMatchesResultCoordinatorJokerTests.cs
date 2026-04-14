namespace TipTournament2._0.Tests.Coordinator
{
    using System.Collections.Generic;
    using System.Linq;
    using Moq;
    using TipTournament2._0.Calculator;
    using TipTournament2._0.Coordinator;
    using TipTournament2._0.Data;
    using TipTournament2._0.MatchClient;
    using TipTournament2._0.Models;
    using Xunit;
    using Match = TipTournament2._0.Models.Match;

    public class GroupMatchesResultCoordinatorJokerTests
    {
        private readonly Mock<IMatchClient> mockMatchClient = new Mock<IMatchClient>();
        private readonly Mock<IDbContextWrapper> mockDb = new Mock<IDbContextWrapper>();
        private readonly Mock<IBetResultMaker> mockBetMaker = new Mock<IBetResultMaker>();

        private void SetupCommon(Result result, out Result savedResult, out Match match)
        {
            savedResult = new Result { Id = "r1", HomeTeam = result.HomeTeam, AwayTeam = result.AwayTeam };
            match = new Match { Id = "m1" };

            this.mockDb.Setup(d => d.SaveResult(result)).Returns(savedResult);
            this.mockDb.Setup(d => d.GetMatchById("m1")).Returns(match);
            this.mockDb.Setup(d => d.GetBetsForMatch(It.IsAny<Match>())).Returns(new List<MatchBet>());
            this.mockBetMaker.Setup(b => b.UpdateBetResult(It.IsAny<List<MatchBet>>(), It.IsAny<Result>())).Returns(new List<MatchBet>());
        }

        #region Joker doubles base points for each BetResult level

        [Theory]
        [InlineData(BetResult.WINNER, 2)]     // 1 * 2 = 2
        [InlineData(BetResult.DIFFERENCE, 4)]  // 2 * 2 = 4
        [InlineData(BetResult.SCORE, 8)]       // 4 * 2 = 8
        public void Joker_CorrectBet_DoublesBasePoints(BetResult betResult, int expectedPoints)
        {
            var result = new Result { HomeTeam = 2, AwayTeam = 1 };
            this.SetupCommon(result, out var savedResult, out var match);

            var user = new ApplicationUser { Id = "u1", AlfaPoints = 0, TotalPoints = 0 };
            var bet = new MatchBet { Result = betResult, IsJoker = true, DixitBonus = 0 };

            this.mockDb.Setup(d => d.GetAllUsers()).Returns(new List<ApplicationUser> { user });
            this.mockDb.Setup(d => d.GetBetForMatchAndUser(match, "u1")).Returns(bet);

            var sut = new GroupMatchesResultCoordinator(this.mockMatchClient.Object, this.mockDb.Object, this.mockBetMaker.Object);
            sut.UploadNewResult("m1", result);

            Assert.Equal(expectedPoints, user.AlfaPoints);
            Assert.Equal(expectedPoints, user.TotalPoints);
        }

        #endregion

        #region Joker wrong bet = zero points (no negative penalty)

        [Fact]
        public void Joker_WrongBet_GetsZeroPoints()
        {
            var result = new Result { HomeTeam = 2, AwayTeam = 1 };
            this.SetupCommon(result, out var savedResult, out var match);

            var user = new ApplicationUser { Id = "u1", AlfaPoints = 0, TotalPoints = 0 };
            var bet = new MatchBet { Result = BetResult.NOTHING, IsJoker = true, DixitBonus = 0 };

            this.mockDb.Setup(d => d.GetAllUsers()).Returns(new List<ApplicationUser> { user });
            this.mockDb.Setup(d => d.GetBetForMatchAndUser(match, "u1")).Returns(bet);

            var sut = new GroupMatchesResultCoordinator(this.mockMatchClient.Object, this.mockDb.Object, this.mockBetMaker.Object);
            sut.UploadNewResult("m1", result);

            Assert.Equal(0, user.AlfaPoints);
            Assert.Equal(0, user.TotalPoints);
        }

        [Fact]
        public void Joker_WrongBet_DoesNotAffectPreExistingPoints()
        {
            var result = new Result { HomeTeam = 2, AwayTeam = 1 };
            this.SetupCommon(result, out var savedResult, out var match);

            var user = new ApplicationUser { Id = "u1", AlfaPoints = 10, TotalPoints = 25 };
            var bet = new MatchBet { Result = BetResult.NOTHING, IsJoker = true, DixitBonus = 0 };

            this.mockDb.Setup(d => d.GetAllUsers()).Returns(new List<ApplicationUser> { user });
            this.mockDb.Setup(d => d.GetBetForMatchAndUser(match, "u1")).Returns(bet);

            var sut = new GroupMatchesResultCoordinator(this.mockMatchClient.Object, this.mockDb.Object, this.mockBetMaker.Object);
            sut.UploadNewResult("m1", result);

            // Points unchanged — wrong joker adds 0, not negative
            Assert.Equal(10, user.AlfaPoints);
            Assert.Equal(25, user.TotalPoints);
        }

        #endregion

        #region Joker + DixitBonus interaction: only base points doubled, dixit added separately

        [Fact]
        public void Joker_WithDixitBonus_OnlyBaseDoubled_DixitAddedSeparately()
        {
            var result = new Result { HomeTeam = 2, AwayTeam = 1 };
            this.SetupCommon(result, out var savedResult, out var match);

            var user = new ApplicationUser { Id = "u1", AlfaPoints = 0, TotalPoints = 0 };
            // WINNER=1, Joker doubles to 2, DixitBonus=3 added on top → 5
            var bet = new MatchBet { Result = BetResult.WINNER, IsJoker = true, DixitBonus = 3 };

            this.mockDb.Setup(d => d.GetAllUsers()).Returns(new List<ApplicationUser> { user });
            this.mockDb.Setup(d => d.GetBetForMatchAndUser(match, "u1")).Returns(bet);

            var sut = new GroupMatchesResultCoordinator(this.mockMatchClient.Object, this.mockDb.Object, this.mockBetMaker.Object);
            sut.UploadNewResult("m1", result);

            Assert.Equal(5, user.AlfaPoints);   // (1 * 2) + 3 = 5
            Assert.Equal(5, user.TotalPoints);
        }

        [Fact]
        public void Joker_Difference_WithDixitBonus2_Gets6Points()
        {
            var result = new Result { HomeTeam = 2, AwayTeam = 1 };
            this.SetupCommon(result, out var savedResult, out var match);

            var user = new ApplicationUser { Id = "u1", AlfaPoints = 0, TotalPoints = 0 };
            // DIFFERENCE=2, Joker doubles to 4, DixitBonus=2 → 6
            var bet = new MatchBet { Result = BetResult.DIFFERENCE, IsJoker = true, DixitBonus = 2 };

            this.mockDb.Setup(d => d.GetAllUsers()).Returns(new List<ApplicationUser> { user });
            this.mockDb.Setup(d => d.GetBetForMatchAndUser(match, "u1")).Returns(bet);

            var sut = new GroupMatchesResultCoordinator(this.mockMatchClient.Object, this.mockDb.Object, this.mockBetMaker.Object);
            sut.UploadNewResult("m1", result);

            Assert.Equal(6, user.AlfaPoints);   // (2 * 2) + 2 = 6
            Assert.Equal(6, user.TotalPoints);
        }

        [Fact]
        public void Joker_Score_WithDixitBonus_FullCalculation()
        {
            var result = new Result { HomeTeam = 2, AwayTeam = 1 };
            this.SetupCommon(result, out var savedResult, out var match);

            var user = new ApplicationUser { Id = "u1", AlfaPoints = 0, TotalPoints = 0 };
            // SCORE=4, Joker doubles to 8, DixitBonus=2 → 10
            var bet = new MatchBet { Result = BetResult.SCORE, IsJoker = true, DixitBonus = 2 };

            this.mockDb.Setup(d => d.GetAllUsers()).Returns(new List<ApplicationUser> { user });
            this.mockDb.Setup(d => d.GetBetForMatchAndUser(match, "u1")).Returns(bet);

            var sut = new GroupMatchesResultCoordinator(this.mockMatchClient.Object, this.mockDb.Object, this.mockBetMaker.Object);
            sut.UploadNewResult("m1", result);

            Assert.Equal(10, user.AlfaPoints);   // (4 * 2) + 2 = 10
            Assert.Equal(10, user.TotalPoints);
        }

        [Fact]
        public void Joker_Score_WithMaxDixitBonus3_Gets11Points()
        {
            // Maximum possible from a single bet: SCORE Joker + max Dixit = (4*2) + 3 = 11
            var result = new Result { HomeTeam = 2, AwayTeam = 1 };
            this.SetupCommon(result, out var savedResult, out var match);

            var user = new ApplicationUser { Id = "u1", AlfaPoints = 0, TotalPoints = 0 };
            var bet = new MatchBet { Result = BetResult.SCORE, IsJoker = true, DixitBonus = 3 };

            this.mockDb.Setup(d => d.GetAllUsers()).Returns(new List<ApplicationUser> { user });
            this.mockDb.Setup(d => d.GetBetForMatchAndUser(match, "u1")).Returns(bet);

            var sut = new GroupMatchesResultCoordinator(this.mockMatchClient.Object, this.mockDb.Object, this.mockBetMaker.Object);
            sut.UploadNewResult("m1", result);

            Assert.Equal(11, user.AlfaPoints);   // (4 * 2) + 3 = 11
            Assert.Equal(11, user.TotalPoints);
        }

        #endregion

        #region Non-joker bets are not affected (backward compatibility)

        [Fact]
        public void NonJoker_CorrectBet_NormalScoring()
        {
            var result = new Result { HomeTeam = 2, AwayTeam = 1 };
            this.SetupCommon(result, out var savedResult, out var match);

            var user = new ApplicationUser { Id = "u1", AlfaPoints = 0, TotalPoints = 0 };
            var bet = new MatchBet { Result = BetResult.SCORE, IsJoker = false, DixitBonus = 0 };

            this.mockDb.Setup(d => d.GetAllUsers()).Returns(new List<ApplicationUser> { user });
            this.mockDb.Setup(d => d.GetBetForMatchAndUser(match, "u1")).Returns(bet);

            var sut = new GroupMatchesResultCoordinator(this.mockMatchClient.Object, this.mockDb.Object, this.mockBetMaker.Object);
            sut.UploadNewResult("m1", result);

            Assert.Equal(4, user.AlfaPoints);
            Assert.Equal(4, user.TotalPoints);
        }

        [Fact]
        public void NonJoker_WithDixitBonus_NormalScoring()
        {
            // Existing behavior preserved: non-joker WINNER + Dixit=2 → 1+2=3
            var result = new Result { HomeTeam = 2, AwayTeam = 1 };
            this.SetupCommon(result, out var savedResult, out var match);

            var user = new ApplicationUser { Id = "u1", AlfaPoints = 0, TotalPoints = 0 };
            var bet = new MatchBet { Result = BetResult.WINNER, IsJoker = false, DixitBonus = 2 };

            this.mockDb.Setup(d => d.GetAllUsers()).Returns(new List<ApplicationUser> { user });
            this.mockDb.Setup(d => d.GetBetForMatchAndUser(match, "u1")).Returns(bet);

            var sut = new GroupMatchesResultCoordinator(this.mockMatchClient.Object, this.mockDb.Object, this.mockBetMaker.Object);
            sut.UploadNewResult("m1", result);

            Assert.Equal(3, user.AlfaPoints);   // (1 * 1) + 2 = 3
            Assert.Equal(3, user.TotalPoints);
        }

        [Fact]
        public void NonJoker_WrongBet_ZeroPoints()
        {
            var result = new Result { HomeTeam = 2, AwayTeam = 1 };
            this.SetupCommon(result, out var savedResult, out var match);

            var user = new ApplicationUser { Id = "u1", AlfaPoints = 5, TotalPoints = 15 };
            var bet = new MatchBet { Result = BetResult.NOTHING, IsJoker = false, DixitBonus = 0 };

            this.mockDb.Setup(d => d.GetAllUsers()).Returns(new List<ApplicationUser> { user });
            this.mockDb.Setup(d => d.GetBetForMatchAndUser(match, "u1")).Returns(bet);

            var sut = new GroupMatchesResultCoordinator(this.mockMatchClient.Object, this.mockDb.Object, this.mockBetMaker.Object);
            sut.UploadNewResult("m1", result);

            Assert.Equal(5, user.AlfaPoints);
            Assert.Equal(15, user.TotalPoints);
        }

        [Fact]
        public void IsJoker_DefaultsFalse_OldBetsUnaffected()
        {
            // Simulates old bets from DB that were created before IsJoker existed.
            // bool defaults to false, so old bets should score normally.
            var result = new Result { HomeTeam = 2, AwayTeam = 1 };
            this.SetupCommon(result, out var savedResult, out var match);

            var user = new ApplicationUser { Id = "u1", AlfaPoints = 0, TotalPoints = 0 };
            var bet = new MatchBet { Result = BetResult.SCORE, DixitBonus = 1 };
            // IsJoker not set — defaults to false

            this.mockDb.Setup(d => d.GetAllUsers()).Returns(new List<ApplicationUser> { user });
            this.mockDb.Setup(d => d.GetBetForMatchAndUser(match, "u1")).Returns(bet);

            var sut = new GroupMatchesResultCoordinator(this.mockMatchClient.Object, this.mockDb.Object, this.mockBetMaker.Object);
            sut.UploadNewResult("m1", result);

            Assert.Equal(5, user.AlfaPoints);   // 4 + 1 (no doubling)
            Assert.Equal(5, user.TotalPoints);
        }

        #endregion

        #region Multiple users: joker vs non-joker scoring in same match

        [Fact]
        public void MultipleUsers_JokerAndNonJoker_CorrectPointsForEach()
        {
            var result = new Result { HomeTeam = 2, AwayTeam = 1 };
            this.SetupCommon(result, out var savedResult, out var match);

            var userWithJoker = new ApplicationUser { Id = "u1", AlfaPoints = 0, TotalPoints = 0 };
            var userWithoutJoker = new ApplicationUser { Id = "u2", AlfaPoints = 0, TotalPoints = 0 };
            var userWrongJoker = new ApplicationUser { Id = "u3", AlfaPoints = 0, TotalPoints = 0 };

            var betJoker = new MatchBet { Result = BetResult.SCORE, IsJoker = true, DixitBonus = 0 };
            var betNormal = new MatchBet { Result = BetResult.SCORE, IsJoker = false, DixitBonus = 0 };
            var betWrongJoker = new MatchBet { Result = BetResult.NOTHING, IsJoker = true, DixitBonus = 0 };

            this.mockDb.Setup(d => d.GetAllUsers()).Returns(new List<ApplicationUser> { userWithJoker, userWithoutJoker, userWrongJoker });
            this.mockDb.Setup(d => d.GetBetForMatchAndUser(match, "u1")).Returns(betJoker);
            this.mockDb.Setup(d => d.GetBetForMatchAndUser(match, "u2")).Returns(betNormal);
            this.mockDb.Setup(d => d.GetBetForMatchAndUser(match, "u3")).Returns(betWrongJoker);

            var sut = new GroupMatchesResultCoordinator(this.mockMatchClient.Object, this.mockDb.Object, this.mockBetMaker.Object);
            sut.UploadNewResult("m1", result);

            Assert.Equal(8, userWithJoker.AlfaPoints);      // SCORE(4) * 2 = 8
            Assert.Equal(4, userWithoutJoker.AlfaPoints);    // SCORE(4) * 1 = 4
            Assert.Equal(0, userWrongJoker.AlfaPoints);      // NOTHING = 0 (joker doesn't help)
        }

        [Fact]
        public void MultipleUsers_JokerWithDixit_NonJokerWithDixit_CorrectTotals()
        {
            var result = new Result { HomeTeam = 2, AwayTeam = 1 };
            this.SetupCommon(result, out var savedResult, out var match);

            var userJoker = new ApplicationUser { Id = "u1", AlfaPoints = 10, TotalPoints = 20 };
            var userNormal = new ApplicationUser { Id = "u2", AlfaPoints = 5, TotalPoints = 15 };

            var betJoker = new MatchBet { Result = BetResult.WINNER, IsJoker = true, DixitBonus = 2 };
            var betNormal = new MatchBet { Result = BetResult.WINNER, IsJoker = false, DixitBonus = 2 };

            this.mockDb.Setup(d => d.GetAllUsers()).Returns(new List<ApplicationUser> { userJoker, userNormal });
            this.mockDb.Setup(d => d.GetBetForMatchAndUser(match, "u1")).Returns(betJoker);
            this.mockDb.Setup(d => d.GetBetForMatchAndUser(match, "u2")).Returns(betNormal);

            var sut = new GroupMatchesResultCoordinator(this.mockMatchClient.Object, this.mockDb.Object, this.mockBetMaker.Object);
            sut.UploadNewResult("m1", result);

            // userJoker: (1*2) + 2 = 4 added
            Assert.Equal(14, userJoker.AlfaPoints);
            Assert.Equal(24, userJoker.TotalPoints);

            // userNormal: (1*1) + 2 = 3 added
            Assert.Equal(8, userNormal.AlfaPoints);
            Assert.Equal(18, userNormal.TotalPoints);
        }

        #endregion

        #region Accumulation: Joker points add to existing user points correctly

        [Fact]
        public void Joker_AccumulatesOnExistingPoints()
        {
            var result = new Result { HomeTeam = 2, AwayTeam = 1 };
            this.SetupCommon(result, out var savedResult, out var match);

            // User has existing points from previous matches
            var user = new ApplicationUser { Id = "u1", AlfaPoints = 15, TotalPoints = 42 };
            var bet = new MatchBet { Result = BetResult.DIFFERENCE, IsJoker = true, DixitBonus = 1 };

            this.mockDb.Setup(d => d.GetAllUsers()).Returns(new List<ApplicationUser> { user });
            this.mockDb.Setup(d => d.GetBetForMatchAndUser(match, "u1")).Returns(bet);

            var sut = new GroupMatchesResultCoordinator(this.mockMatchClient.Object, this.mockDb.Object, this.mockBetMaker.Object);
            sut.UploadNewResult("m1", result);

            // (2*2) + 1 = 5 added
            Assert.Equal(20, user.AlfaPoints);   // 15 + 5
            Assert.Equal(47, user.TotalPoints);  // 42 + 5
        }

        #endregion

        #region End-to-end: DixitBonus computed then Joker applied

        [Fact]
        public void EndToEnd_JokerBet_WithDixitBonusComputed_FullPipeline()
        {
            // Full pipeline: BetResultMaker → DixitBonusCalculator → RecalculatePoints with Joker
            // 1 correct out of 2 total → Dixit bonus = 3 (only 1 correct)
            var result = new Result { HomeTeam = 2, AwayTeam = 1 };
            var savedResult = new Result { Id = "r1", HomeTeam = 2, AwayTeam = 1 };
            var match = new Match { Id = "m1" };

            var userA = new ApplicationUser { Id = "uA", AlfaPoints = 0, TotalPoints = 0 };
            var userB = new ApplicationUser { Id = "uB", AlfaPoints = 0, TotalPoints = 0 };

            var betA = new MatchBet { Result = BetResult.NOTHING, IsJoker = false };
            var betB = new MatchBet { Result = BetResult.NOTHING, IsJoker = true };  // Joker bet
            var allBets = new List<MatchBet> { betA, betB };

            this.mockBetMaker.Setup(b => b.UpdateBetResult(allBets, savedResult))
                .Callback<List<MatchBet>, Result>((bets, r) =>
                {
                    bets[0].Result = BetResult.NOTHING;   // userA wrong
                    bets[1].Result = BetResult.WINNER;     // userB correct
                })
                .Returns(allBets);

            this.mockDb.Setup(d => d.SaveResult(result)).Returns(savedResult);
            this.mockDb.Setup(d => d.GetMatchById("m1")).Returns(match);
            this.mockDb.Setup(d => d.GetBetsForMatch(It.IsAny<Match>())).Returns(allBets);
            this.mockDb.Setup(d => d.GetAllUsers()).Returns(new List<ApplicationUser> { userA, userB });
            this.mockDb.Setup(d => d.GetBetForMatchAndUser(match, "uA")).Returns(betA);
            this.mockDb.Setup(d => d.GetBetForMatchAndUser(match, "uB")).Returns(betB);

            var sut = new GroupMatchesResultCoordinator(this.mockMatchClient.Object, this.mockDb.Object, this.mockBetMaker.Object);
            sut.UploadNewResult("m1", result);

            // DixitBonusCalculator should give betB DixitBonus=3 (only 1 of 2 correct)
            Assert.Equal(3, betB.DixitBonus);

            // userA: wrong bet, no points
            Assert.Equal(0, userA.AlfaPoints);
            Assert.Equal(0, userA.TotalPoints);

            // userB: (WINNER=1 * Joker=2) + DixitBonus=3 = 5
            Assert.Equal(5, userB.AlfaPoints);
            Assert.Equal(5, userB.TotalPoints);
        }

        [Fact]
        public void EndToEnd_JokerBet_NoDixitBonus_WhenManyCorrect()
        {
            // 8 out of 10 correct → 80% → no Dixit bonus. Joker still doubles base.
            var result = new Result { HomeTeam = 1, AwayTeam = 0 };
            var savedResult = new Result { Id = "r1", HomeTeam = 1, AwayTeam = 0 };
            var match = new Match { Id = "m1" };

            var allBets = new List<MatchBet>();
            var users = new List<ApplicationUser>();
            for (int i = 0; i < 10; i++)
            {
                allBets.Add(new MatchBet { Result = BetResult.NOTHING, IsJoker = i == 0 }); // first bet is Joker
                users.Add(new ApplicationUser { Id = $"u{i}", AlfaPoints = 0, TotalPoints = 0 });
            }

            this.mockBetMaker.Setup(b => b.UpdateBetResult(allBets, savedResult))
                .Callback<List<MatchBet>, Result>((bets, r) =>
                {
                    for (int i = 0; i < 8; i++) bets[i].Result = BetResult.WINNER;
                    // bets[8] and bets[9] stay NOTHING
                })
                .Returns(allBets);

            this.mockDb.Setup(d => d.SaveResult(result)).Returns(savedResult);
            this.mockDb.Setup(d => d.GetMatchById("m1")).Returns(match);
            this.mockDb.Setup(d => d.GetBetsForMatch(It.IsAny<Match>())).Returns(allBets);
            this.mockDb.Setup(d => d.GetAllUsers()).Returns(users);
            for (int i = 0; i < 10; i++)
            {
                var idx = i;
                this.mockDb.Setup(d => d.GetBetForMatchAndUser(match, $"u{idx}")).Returns(allBets[idx]);
            }

            var sut = new GroupMatchesResultCoordinator(this.mockMatchClient.Object, this.mockDb.Object, this.mockBetMaker.Object);
            sut.UploadNewResult("m1", result);

            // 80% correct → 0 Dixit bonus for all
            Assert.All(allBets, b => Assert.Equal(0, b.DixitBonus));

            // User 0: Joker + WINNER → (1*2)+0 = 2
            Assert.Equal(2, users[0].AlfaPoints);
            Assert.Equal(2, users[0].TotalPoints);

            // Users 1-7: non-Joker + WINNER → (1*1)+0 = 1
            for (int i = 1; i < 8; i++)
            {
                Assert.Equal(1, users[i].AlfaPoints);
                Assert.Equal(1, users[i].TotalPoints);
            }

            // Users 8-9: NOTHING → 0
            Assert.Equal(0, users[8].AlfaPoints);
            Assert.Equal(0, users[9].AlfaPoints);
        }

        [Fact]
        public void EndToEnd_JokerWrongBet_WithDixitBonusComputedForOthers()
        {
            // User has Joker but bet is wrong. DixitBonus computed but irrelevant since NOTHING.
            // Actually, DixitBonusCalculator sets DixitBonus=0 for NOTHING bets.
            var result = new Result { HomeTeam = 2, AwayTeam = 1 };
            var savedResult = new Result { Id = "r1", HomeTeam = 2, AwayTeam = 1 };
            var match = new Match { Id = "m1" };

            var userJoker = new ApplicationUser { Id = "uJ", AlfaPoints = 10, TotalPoints = 30 };
            var userCorrect = new ApplicationUser { Id = "uC", AlfaPoints = 5, TotalPoints = 20 };

            var betJokerWrong = new MatchBet { Result = BetResult.NOTHING, IsJoker = true };
            var betCorrect = new MatchBet { Result = BetResult.NOTHING, IsJoker = false };
            var allBets = new List<MatchBet> { betJokerWrong, betCorrect };

            this.mockBetMaker.Setup(b => b.UpdateBetResult(allBets, savedResult))
                .Callback<List<MatchBet>, Result>((bets, r) =>
                {
                    bets[0].Result = BetResult.NOTHING;  // Joker user is wrong
                    bets[1].Result = BetResult.SCORE;     // Other user is correct
                })
                .Returns(allBets);

            this.mockDb.Setup(d => d.SaveResult(result)).Returns(savedResult);
            this.mockDb.Setup(d => d.GetMatchById("m1")).Returns(match);
            this.mockDb.Setup(d => d.GetBetsForMatch(It.IsAny<Match>())).Returns(allBets);
            this.mockDb.Setup(d => d.GetAllUsers()).Returns(new List<ApplicationUser> { userJoker, userCorrect });
            this.mockDb.Setup(d => d.GetBetForMatchAndUser(match, "uJ")).Returns(betJokerWrong);
            this.mockDb.Setup(d => d.GetBetForMatchAndUser(match, "uC")).Returns(betCorrect);

            var sut = new GroupMatchesResultCoordinator(this.mockMatchClient.Object, this.mockDb.Object, this.mockBetMaker.Object);
            sut.UploadNewResult("m1", result);

            // Joker wrong bet: DixitBonus=0 (DixitBonusCalculator sets 0 for NOTHING), points = (0*2)+0 = 0
            Assert.Equal(0, betJokerWrong.DixitBonus);
            Assert.Equal(10, userJoker.AlfaPoints);    // unchanged
            Assert.Equal(30, userJoker.TotalPoints);   // unchanged

            // Correct bet: 1 of 2 correct → DixitBonus=3, points = (4*1)+3 = 7
            Assert.Equal(3, betCorrect.DixitBonus);
            Assert.Equal(12, userCorrect.AlfaPoints);  // 5 + 7
            Assert.Equal(27, userCorrect.TotalPoints); // 20 + 7
        }

        #endregion

        #region AlfaPoints and TotalPoints always stay in sync

        [Fact]
        public void Joker_BothAlfaAndTotalPointsUpdatedIdentically()
        {
            var result = new Result { HomeTeam = 2, AwayTeam = 1 };
            this.SetupCommon(result, out var savedResult, out var match);

            // User has different Alfa and Total (other stages contributed to Total)
            var user = new ApplicationUser { Id = "u1", AlfaPoints = 5, TotalPoints = 30 };
            var bet = new MatchBet { Result = BetResult.SCORE, IsJoker = true, DixitBonus = 1 };

            this.mockDb.Setup(d => d.GetAllUsers()).Returns(new List<ApplicationUser> { user });
            this.mockDb.Setup(d => d.GetBetForMatchAndUser(match, "u1")).Returns(bet);

            var sut = new GroupMatchesResultCoordinator(this.mockMatchClient.Object, this.mockDb.Object, this.mockBetMaker.Object);
            sut.UploadNewResult("m1", result);

            // (4*2)+1 = 9 added to BOTH
            Assert.Equal(14, user.AlfaPoints);   // 5 + 9
            Assert.Equal(39, user.TotalPoints);  // 30 + 9

            // Delta between Alfa and Total unchanged
            Assert.Equal(25, user.TotalPoints - user.AlfaPoints);
        }

        #endregion
    }
}
