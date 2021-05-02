﻿namespace TipTournament.Data
{
    using System;
    using System.Collections.Generic;
    using System.Linq;
    using System.Threading.Tasks;
    using TipTournament.Models;

    public interface IDbContextWrapper
    {
        List<Match> GetMatches();

        List<Bet> GetBetsForUser(string userId);

        List<ApplicationUser> GetUsers();

        List<Bet> GetAllBets();

        void UploadBets(List<Bet> bets, string userUd);

        ApplicationUser GetUser(string userId);

        void SetUserAsPayed(string userId);

        void SaveMatches(List<Match> matches);

        void SaveResults(List<Match> matchesWithResults);

        List<Match> GetNotEndedMatches();

        List<Bet> GetBetsForMatches(List<Match> matches);

        void UpdateBets(List<Bet> bets);

        List<ApplicationUser> GetAllUsers();
    }
}