# CLAUDE.md

This file provides guidance to Claude Code (claude.ai/code) when working with code in this repository.

## Project Overview

TipTournament2.0 is a sports betting tournament prediction app (e.g., Euro 2024). Users predict match results, group winners, knockout outcomes, team placements, and top scorers. Built as an ASP.NET Core 3.1 backend with a React TypeScript frontend, deployed to Azure.

## Build & Run Commands

### Backend (.NET)
```bash
dotnet restore
dotnet build
dotnet run                    # Starts on https://localhost:5001
dotnet publish -c Release     # Production build (includes frontend)
```

### Frontend (from /ClientApp)
```bash
npm install
npm start                     # Dev server
npm run build                 # Production build
npm test                      # Jest tests (CI mode, jsdom)
npm run lint                  # ESLint
```

The .csproj build targets auto-run `npm install` on Debug builds and `npm install && npm run build` on Publish.

## Architecture

### Backend Structure
- **Controllers/** - REST API endpoints (`HomeController`, `BetsController`, `MatchController`, `AdminController`)
- **Models/** - EF Core entities
- **Data/** - `ApplicationDbContext`, migrations, `IDbContextWrapper` for data access
- **Coordinator/** - Result calculation per tournament stage (factory pattern via `IResultCoordinatorFactory`):
  - `GroupMatchesResultCoordinator` - Group stage
  - `DeltaResultCoordinator` - Knockout rounds
  - `OmikronResultCoordinator` - Stage-based scoring
  - `WinnerResultCoordinator` - Tournament winner
  - `LambdaResultCoordinator` - Best-of-three
- **Calculator/** - `IBetResultMaker` calculates bet outcomes
- **MatchClient/** - External match data retrieval (web scraping with HtmlAgilityPack)
- **Utils/** - `ITeamGenerator`, `IBetGenerator` for tournament structure setup

### Frontend Structure (`ClientApp/src/`)
- **components/api/** - API client layer (`Api.ts`, `AdminApi.ts`, `HttpClient.ts`)
- **components/Bets/** - Betting UI (GroupBets, DeltaBets, TeamPlaceBets, TopShooterBets)
- **components/MainPage/** - Home page (Matches, Ranking, UserBets)
- **components/Admin/** - Admin dashboard
- **components/api-authorization/** - OIDC auth components (oidc-client)
- **typings/** - TypeScript type definitions
- **ResponseConvertor.ts** - Transforms API responses for UI

### DI Registration (Startup.cs)
All services registered as transient: `IDbContextWrapper`, `IMatchClient`, `IBetResultMaker`, `IResultCoordinatorFactory`, `ITeamGenerator`, `IBetGenerator`.

### Authentication
ASP.NET Identity + IdentityServer4 for OIDC. `ProfileService` extends JWT claims. Role-based authorization supported.

## Tournament Domain Model

**TournamentStage** enum drives most business logic: Group, RoundOf32, RoundOf16, Quarterfinal, Semifinal, Final, Winner, Lambda, Omikron.

**Bet types**: MatchBets (match results), GroupBets (group winners/runners-up), DeltaBets (knockout predictions), TeamPlaceBets (placement predictions), TopShooterBets (top scorer).

## Configuration

- `appsettings.json` - Tournament structure (groups, match counts per stage, final match ID), DeltaStage match pairings, OmikronStage teams, feature flags (`additionalDeltaEvaluation`)
- `appsettings.Development.json` - Local DB connection string (gitignored)
- Database: SQL Server via EF Core. Migrations in `Data/Migrations/`

## CI/CD

GitHub Actions (`.github/workflows/azure-webapps-dotnet-core.yml`): builds on push to `master`, deploys to Azure Web App "tipovacka". Uses .NET 3.1 SDK.

## Key Technical Notes

- `TypeScriptCompileBlocked=true` in csproj — TypeScript is compiled by react-scripts, not MSBuild
- SPA proxy: React dev server proxied through ASP.NET Core SPA middleware
- Quartz.NET is referenced but scheduler is currently commented out
