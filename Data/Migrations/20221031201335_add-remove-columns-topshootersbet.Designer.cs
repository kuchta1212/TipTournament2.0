﻿// <auto-generated />
using System;
using Microsoft.EntityFrameworkCore;
using Microsoft.EntityFrameworkCore.Infrastructure;
using Microsoft.EntityFrameworkCore.Metadata;
using Microsoft.EntityFrameworkCore.Migrations;
using Microsoft.EntityFrameworkCore.Storage.ValueConversion;
using TipTournament2._0.Data;

namespace TipTournament2._0.Data.Migrations
{
    [DbContext(typeof(ApplicationDbContext))]
    [Migration("20221031201335_add-remove-columns-topshootersbet")]
    partial class addremovecolumnstopshootersbet
    {
        protected override void BuildTargetModel(ModelBuilder modelBuilder)
        {
#pragma warning disable 612, 618
            modelBuilder
                .HasAnnotation("ProductVersion", "3.1.12")
                .HasAnnotation("Relational:MaxIdentifierLength", 128)
                .HasAnnotation("SqlServer:ValueGenerationStrategy", SqlServerValueGenerationStrategy.IdentityColumn);

            modelBuilder.Entity("IdentityServer4.EntityFramework.Entities.DeviceFlowCodes", b =>
                {
                    b.Property<string>("UserCode")
                        .HasColumnType("nvarchar(200)")
                        .HasMaxLength(200);

                    b.Property<string>("ClientId")
                        .IsRequired()
                        .HasColumnType("nvarchar(200)")
                        .HasMaxLength(200);

                    b.Property<DateTime>("CreationTime")
                        .HasColumnType("datetime2");

                    b.Property<string>("Data")
                        .IsRequired()
                        .HasColumnType("nvarchar(max)")
                        .HasMaxLength(50000);

                    b.Property<string>("DeviceCode")
                        .IsRequired()
                        .HasColumnType("nvarchar(200)")
                        .HasMaxLength(200);

                    b.Property<DateTime?>("Expiration")
                        .IsRequired()
                        .HasColumnType("datetime2");

                    b.Property<string>("SubjectId")
                        .HasColumnType("nvarchar(200)")
                        .HasMaxLength(200);

                    b.HasKey("UserCode");

                    b.HasIndex("DeviceCode")
                        .IsUnique();

                    b.HasIndex("Expiration");

                    b.ToTable("DeviceCodes");
                });

            modelBuilder.Entity("IdentityServer4.EntityFramework.Entities.PersistedGrant", b =>
                {
                    b.Property<string>("Key")
                        .HasColumnType("nvarchar(200)")
                        .HasMaxLength(200);

                    b.Property<string>("ClientId")
                        .IsRequired()
                        .HasColumnType("nvarchar(200)")
                        .HasMaxLength(200);

                    b.Property<DateTime>("CreationTime")
                        .HasColumnType("datetime2");

                    b.Property<string>("Data")
                        .IsRequired()
                        .HasColumnType("nvarchar(max)")
                        .HasMaxLength(50000);

                    b.Property<DateTime?>("Expiration")
                        .HasColumnType("datetime2");

                    b.Property<string>("SubjectId")
                        .HasColumnType("nvarchar(200)")
                        .HasMaxLength(200);

                    b.Property<string>("Type")
                        .IsRequired()
                        .HasColumnType("nvarchar(50)")
                        .HasMaxLength(50);

                    b.HasKey("Key");

                    b.HasIndex("Expiration");

                    b.HasIndex("SubjectId", "ClientId", "Type");

                    b.ToTable("PersistedGrants");
                });

            modelBuilder.Entity("Microsoft.AspNetCore.Identity.IdentityRole", b =>
                {
                    b.Property<string>("Id")
                        .HasColumnType("nvarchar(450)");

                    b.Property<string>("ConcurrencyStamp")
                        .IsConcurrencyToken()
                        .HasColumnType("nvarchar(max)");

                    b.Property<string>("Name")
                        .HasColumnType("nvarchar(256)")
                        .HasMaxLength(256);

                    b.Property<string>("NormalizedName")
                        .HasColumnType("nvarchar(256)")
                        .HasMaxLength(256);

                    b.HasKey("Id");

                    b.HasIndex("NormalizedName")
                        .IsUnique()
                        .HasName("RoleNameIndex")
                        .HasFilter("[NormalizedName] IS NOT NULL");

                    b.ToTable("AspNetRoles");
                });

            modelBuilder.Entity("Microsoft.AspNetCore.Identity.IdentityRoleClaim<string>", b =>
                {
                    b.Property<int>("Id")
                        .ValueGeneratedOnAdd()
                        .HasColumnType("int")
                        .HasAnnotation("SqlServer:ValueGenerationStrategy", SqlServerValueGenerationStrategy.IdentityColumn);

                    b.Property<string>("ClaimType")
                        .HasColumnType("nvarchar(max)");

                    b.Property<string>("ClaimValue")
                        .HasColumnType("nvarchar(max)");

                    b.Property<string>("RoleId")
                        .IsRequired()
                        .HasColumnType("nvarchar(450)");

                    b.HasKey("Id");

                    b.HasIndex("RoleId");

                    b.ToTable("AspNetRoleClaims");
                });

            modelBuilder.Entity("Microsoft.AspNetCore.Identity.IdentityUserClaim<string>", b =>
                {
                    b.Property<int>("Id")
                        .ValueGeneratedOnAdd()
                        .HasColumnType("int")
                        .HasAnnotation("SqlServer:ValueGenerationStrategy", SqlServerValueGenerationStrategy.IdentityColumn);

                    b.Property<string>("ClaimType")
                        .HasColumnType("nvarchar(max)");

                    b.Property<string>("ClaimValue")
                        .HasColumnType("nvarchar(max)");

                    b.Property<string>("UserId")
                        .IsRequired()
                        .HasColumnType("nvarchar(450)");

                    b.HasKey("Id");

                    b.HasIndex("UserId");

                    b.ToTable("AspNetUserClaims");
                });

            modelBuilder.Entity("Microsoft.AspNetCore.Identity.IdentityUserLogin<string>", b =>
                {
                    b.Property<string>("LoginProvider")
                        .HasColumnType("nvarchar(128)")
                        .HasMaxLength(128);

                    b.Property<string>("ProviderKey")
                        .HasColumnType("nvarchar(128)")
                        .HasMaxLength(128);

                    b.Property<string>("ProviderDisplayName")
                        .HasColumnType("nvarchar(max)");

                    b.Property<string>("UserId")
                        .IsRequired()
                        .HasColumnType("nvarchar(450)");

                    b.HasKey("LoginProvider", "ProviderKey");

                    b.HasIndex("UserId");

                    b.ToTable("AspNetUserLogins");
                });

            modelBuilder.Entity("Microsoft.AspNetCore.Identity.IdentityUserRole<string>", b =>
                {
                    b.Property<string>("UserId")
                        .HasColumnType("nvarchar(450)");

                    b.Property<string>("RoleId")
                        .HasColumnType("nvarchar(450)");

                    b.HasKey("UserId", "RoleId");

                    b.HasIndex("RoleId");

                    b.ToTable("AspNetUserRoles");
                });

            modelBuilder.Entity("Microsoft.AspNetCore.Identity.IdentityUserToken<string>", b =>
                {
                    b.Property<string>("UserId")
                        .HasColumnType("nvarchar(450)");

                    b.Property<string>("LoginProvider")
                        .HasColumnType("nvarchar(128)")
                        .HasMaxLength(128);

                    b.Property<string>("Name")
                        .HasColumnType("nvarchar(128)")
                        .HasMaxLength(128);

                    b.Property<string>("Value")
                        .HasColumnType("nvarchar(max)");

                    b.HasKey("UserId", "LoginProvider", "Name");

                    b.ToTable("AspNetUserTokens");
                });

            modelBuilder.Entity("TipTournament2._0.Models.ApplicationUser", b =>
                {
                    b.Property<string>("Id")
                        .HasColumnType("nvarchar(450)");

                    b.Property<int>("AccessFailedCount")
                        .HasColumnType("int");

                    b.Property<string>("ConcurrencyStamp")
                        .IsConcurrencyToken()
                        .HasColumnType("nvarchar(max)");

                    b.Property<string>("Email")
                        .HasColumnType("nvarchar(256)")
                        .HasMaxLength(256);

                    b.Property<bool>("EmailConfirmed")
                        .HasColumnType("bit");

                    b.Property<bool>("LockoutEnabled")
                        .HasColumnType("bit");

                    b.Property<DateTimeOffset?>("LockoutEnd")
                        .HasColumnType("datetimeoffset");

                    b.Property<string>("NormalizedEmail")
                        .HasColumnType("nvarchar(256)")
                        .HasMaxLength(256);

                    b.Property<string>("NormalizedUserName")
                        .HasColumnType("nvarchar(256)")
                        .HasMaxLength(256);

                    b.Property<string>("PasswordHash")
                        .HasColumnType("nvarchar(max)");

                    b.Property<bool>("Payed")
                        .HasColumnType("bit");

                    b.Property<string>("PhoneNumber")
                        .HasColumnType("nvarchar(max)");

                    b.Property<bool>("PhoneNumberConfirmed")
                        .HasColumnType("bit");

                    b.Property<int>("Points")
                        .HasColumnType("int");

                    b.Property<string>("SecurityStamp")
                        .HasColumnType("nvarchar(max)");

                    b.Property<bool>("TwoFactorEnabled")
                        .HasColumnType("bit");

                    b.Property<string>("UserName")
                        .HasColumnType("nvarchar(256)")
                        .HasMaxLength(256);

                    b.HasKey("Id");

                    b.HasIndex("NormalizedEmail")
                        .HasName("EmailIndex");

                    b.HasIndex("NormalizedUserName")
                        .IsUnique()
                        .HasName("UserNameIndex")
                        .HasFilter("[NormalizedUserName] IS NOT NULL");

                    b.ToTable("AspNetUsers");
                });

            modelBuilder.Entity("TipTournament2._0.Models.BetsStatus", b =>
                {
                    b.Property<string>("Id")
                        .ValueGeneratedOnAdd()
                        .HasColumnType("nvarchar(450)");

                    b.Property<bool>("FinalStageDone")
                        .HasColumnType("bit");

                    b.Property<bool>("GroupStagesDone")
                        .HasColumnType("bit");

                    b.Property<bool>("LambdaStageDone")
                        .HasColumnType("bit");

                    b.Property<bool>("MatchesInGroupsDone")
                        .HasColumnType("bit");

                    b.Property<bool>("OmikronStageDone")
                        .HasColumnType("bit");

                    b.Property<bool>("QuerterfinalStageDone")
                        .HasColumnType("bit");

                    b.Property<bool>("SemifinalStageDone")
                        .HasColumnType("bit");

                    b.Property<string>("UserId")
                        .HasColumnType("nvarchar(450)");

                    b.Property<bool>("WinnerStageDone")
                        .HasColumnType("bit");

                    b.HasKey("Id");

                    b.HasIndex("UserId");

                    b.ToTable("BetsStatuses");
                });

            modelBuilder.Entity("TipTournament2._0.Models.Comment", b =>
                {
                    b.Property<string>("Id")
                        .ValueGeneratedOnAdd()
                        .HasColumnType("nvarchar(450)");

                    b.Property<DateTime>("CreatedOn")
                        .HasColumnType("datetime2");

                    b.Property<string>("Text")
                        .HasColumnType("nvarchar(max)");

                    b.HasKey("Id");

                    b.ToTable("Comments");
                });

            modelBuilder.Entity("TipTournament2._0.Models.DeltaBet", b =>
                {
                    b.Property<string>("Id")
                        .ValueGeneratedOnAdd()
                        .HasColumnType("nvarchar(450)");

                    b.Property<string>("AwayTeamBetId")
                        .HasColumnType("nvarchar(450)");

                    b.Property<string>("HomeTeamBetId")
                        .HasColumnType("nvarchar(450)");

                    b.Property<string>("MatchId")
                        .HasColumnType("nvarchar(450)");

                    b.Property<int>("Points")
                        .HasColumnType("int");

                    b.Property<string>("UserId")
                        .HasColumnType("nvarchar(450)");

                    b.HasKey("Id");

                    b.HasIndex("AwayTeamBetId");

                    b.HasIndex("HomeTeamBetId");

                    b.HasIndex("MatchId");

                    b.HasIndex("UserId");

                    b.ToTable("DeltaBets");
                });

            modelBuilder.Entity("TipTournament2._0.Models.Group", b =>
                {
                    b.Property<string>("Id")
                        .ValueGeneratedOnAdd()
                        .HasColumnType("nvarchar(450)");

                    b.Property<string>("GroupName")
                        .HasColumnType("nvarchar(max)");

                    b.Property<string>("ResultId")
                        .HasColumnType("nvarchar(450)");

                    b.HasKey("Id");

                    b.HasIndex("ResultId");

                    b.ToTable("Groups");
                });

            modelBuilder.Entity("TipTournament2._0.Models.GroupBet", b =>
                {
                    b.Property<string>("Id")
                        .ValueGeneratedOnAdd()
                        .HasColumnType("nvarchar(450)");

                    b.Property<string>("FirstId")
                        .HasColumnType("nvarchar(450)");

                    b.Property<string>("FourthId")
                        .HasColumnType("nvarchar(450)");

                    b.Property<string>("GroupId")
                        .HasColumnType("nvarchar(450)");

                    b.Property<int>("Points")
                        .HasColumnType("int");

                    b.Property<string>("SecondId")
                        .HasColumnType("nvarchar(450)");

                    b.Property<string>("ThirdId")
                        .HasColumnType("nvarchar(450)");

                    b.Property<string>("UserId")
                        .HasColumnType("nvarchar(450)");

                    b.HasKey("Id");

                    b.HasIndex("FirstId");

                    b.HasIndex("FourthId");

                    b.HasIndex("GroupId");

                    b.HasIndex("SecondId");

                    b.HasIndex("ThirdId");

                    b.HasIndex("UserId");

                    b.ToTable("GroupBets");
                });

            modelBuilder.Entity("TipTournament2._0.Models.GroupResult", b =>
                {
                    b.Property<string>("Id")
                        .ValueGeneratedOnAdd()
                        .HasColumnType("nvarchar(450)");

                    b.Property<string>("FirstId")
                        .HasColumnType("nvarchar(450)");

                    b.Property<string>("FourthId")
                        .HasColumnType("nvarchar(450)");

                    b.Property<string>("SecondId")
                        .HasColumnType("nvarchar(450)");

                    b.Property<string>("ThirdId")
                        .HasColumnType("nvarchar(450)");

                    b.HasKey("Id");

                    b.HasIndex("FirstId");

                    b.HasIndex("FourthId");

                    b.HasIndex("SecondId");

                    b.HasIndex("ThirdId");

                    b.ToTable("GroupResults");
                });

            modelBuilder.Entity("TipTournament2._0.Models.Match", b =>
                {
                    b.Property<string>("Id")
                        .ValueGeneratedOnAdd()
                        .HasColumnType("nvarchar(450)");

                    b.Property<string>("AwayId")
                        .HasColumnType("nvarchar(450)");

                    b.Property<bool>("Ended")
                        .HasColumnType("bit");

                    b.Property<string>("GroupId")
                        .HasColumnType("nvarchar(450)");

                    b.Property<string>("HomeId")
                        .HasColumnType("nvarchar(450)");

                    b.Property<string>("Link")
                        .HasColumnType("nvarchar(max)");

                    b.Property<string>("ResultId")
                        .HasColumnType("nvarchar(450)");

                    b.Property<int>("Stage")
                        .HasColumnType("int");

                    b.Property<DateTime>("StartTime")
                        .HasColumnType("datetime2");

                    b.HasKey("Id");

                    b.HasIndex("AwayId");

                    b.HasIndex("GroupId");

                    b.HasIndex("HomeId");

                    b.HasIndex("ResultId");

                    b.ToTable("Matches");
                });

            modelBuilder.Entity("TipTournament2._0.Models.MatchBet", b =>
                {
                    b.Property<string>("Id")
                        .ValueGeneratedOnAdd()
                        .HasColumnType("nvarchar(450)");

                    b.Property<string>("AspNetUsers")
                        .HasColumnType("nvarchar(450)");

                    b.Property<string>("Matches")
                        .HasColumnType("nvarchar(450)");

                    b.Property<int>("Result")
                        .HasColumnType("int");

                    b.Property<string>("Results")
                        .HasColumnType("nvarchar(450)");

                    b.HasKey("Id");

                    b.HasIndex("AspNetUsers");

                    b.HasIndex("Matches");

                    b.HasIndex("Results");

                    b.ToTable("Bets");
                });

            modelBuilder.Entity("TipTournament2._0.Models.Result", b =>
                {
                    b.Property<string>("Id")
                        .ValueGeneratedOnAdd()
                        .HasColumnType("nvarchar(450)");

                    b.Property<int>("AwayTeam")
                        .HasColumnType("int");

                    b.Property<int>("HomeTeam")
                        .HasColumnType("int");

                    b.HasKey("Id");

                    b.ToTable("Results");
                });

            modelBuilder.Entity("TipTournament2._0.Models.SpecificTeamPlaceBet", b =>
                {
                    b.Property<string>("Id")
                        .ValueGeneratedOnAdd()
                        .HasColumnType("nvarchar(450)");

                    b.Property<bool>("IsCorrect")
                        .HasColumnType("bit");

                    b.Property<bool>("IsWinnerBet")
                        .HasColumnType("bit");

                    b.Property<int>("StageBet")
                        .HasColumnType("int");

                    b.Property<string>("UserId")
                        .HasColumnType("nvarchar(450)");

                    b.Property<string>("teamId")
                        .HasColumnType("nvarchar(450)");

                    b.HasKey("Id");

                    b.HasIndex("UserId");

                    b.HasIndex("teamId");

                    b.ToTable("TeamPlaceBets");
                });

            modelBuilder.Entity("TipTournament2._0.Models.Team", b =>
                {
                    b.Property<string>("Id")
                        .ValueGeneratedOnAdd()
                        .HasColumnType("nvarchar(450)");

                    b.Property<int>("FinishedAt")
                        .HasColumnType("int");

                    b.Property<string>("IconPath")
                        .HasColumnType("nvarchar(max)");

                    b.Property<string>("Name")
                        .HasColumnType("nvarchar(max)");

                    b.HasKey("Id");

                    b.ToTable("Teams");
                });

            modelBuilder.Entity("TipTournament2._0.Models.TopShooterBet", b =>
                {
                    b.Property<string>("Id")
                        .ValueGeneratedOnAdd()
                        .HasColumnType("nvarchar(450)");

                    b.Property<int>("Points")
                        .HasColumnType("int");

                    b.Property<string>("ShoterName")
                        .HasColumnType("nvarchar(max)");

                    b.Property<string>("UserId")
                        .HasColumnType("nvarchar(450)");

                    b.HasKey("Id");

                    b.HasIndex("UserId");

                    b.ToTable("TopShooterBets");
                });

            modelBuilder.Entity("TipTournament2._0.Models.UpdateStatus", b =>
                {
                    b.Property<string>("Id")
                        .ValueGeneratedOnAdd()
                        .HasColumnType("nvarchar(450)");

                    b.Property<int>("AmountOfUpdates")
                        .HasColumnType("int");

                    b.Property<DateTime>("Date")
                        .HasColumnType("datetime2");

                    b.Property<string>("ErrorMessage")
                        .HasColumnType("nvarchar(max)");

                    b.HasKey("Id");

                    b.ToTable("UpdateStatuses");
                });

            modelBuilder.Entity("Microsoft.AspNetCore.Identity.IdentityRoleClaim<string>", b =>
                {
                    b.HasOne("Microsoft.AspNetCore.Identity.IdentityRole", null)
                        .WithMany()
                        .HasForeignKey("RoleId")
                        .OnDelete(DeleteBehavior.Cascade)
                        .IsRequired();
                });

            modelBuilder.Entity("Microsoft.AspNetCore.Identity.IdentityUserClaim<string>", b =>
                {
                    b.HasOne("TipTournament2._0.Models.ApplicationUser", null)
                        .WithMany()
                        .HasForeignKey("UserId")
                        .OnDelete(DeleteBehavior.Cascade)
                        .IsRequired();
                });

            modelBuilder.Entity("Microsoft.AspNetCore.Identity.IdentityUserLogin<string>", b =>
                {
                    b.HasOne("TipTournament2._0.Models.ApplicationUser", null)
                        .WithMany()
                        .HasForeignKey("UserId")
                        .OnDelete(DeleteBehavior.Cascade)
                        .IsRequired();
                });

            modelBuilder.Entity("Microsoft.AspNetCore.Identity.IdentityUserRole<string>", b =>
                {
                    b.HasOne("Microsoft.AspNetCore.Identity.IdentityRole", null)
                        .WithMany()
                        .HasForeignKey("RoleId")
                        .OnDelete(DeleteBehavior.Cascade)
                        .IsRequired();

                    b.HasOne("TipTournament2._0.Models.ApplicationUser", null)
                        .WithMany()
                        .HasForeignKey("UserId")
                        .OnDelete(DeleteBehavior.Cascade)
                        .IsRequired();
                });

            modelBuilder.Entity("Microsoft.AspNetCore.Identity.IdentityUserToken<string>", b =>
                {
                    b.HasOne("TipTournament2._0.Models.ApplicationUser", null)
                        .WithMany()
                        .HasForeignKey("UserId")
                        .OnDelete(DeleteBehavior.Cascade)
                        .IsRequired();
                });

            modelBuilder.Entity("TipTournament2._0.Models.BetsStatus", b =>
                {
                    b.HasOne("TipTournament2._0.Models.ApplicationUser", "User")
                        .WithMany()
                        .HasForeignKey("UserId");
                });

            modelBuilder.Entity("TipTournament2._0.Models.DeltaBet", b =>
                {
                    b.HasOne("TipTournament2._0.Models.Team", "AwayTeamBet")
                        .WithMany()
                        .HasForeignKey("AwayTeamBetId");

                    b.HasOne("TipTournament2._0.Models.Team", "HomeTeamBet")
                        .WithMany()
                        .HasForeignKey("HomeTeamBetId");

                    b.HasOne("TipTournament2._0.Models.Match", "Match")
                        .WithMany()
                        .HasForeignKey("MatchId");

                    b.HasOne("TipTournament2._0.Models.ApplicationUser", "User")
                        .WithMany()
                        .HasForeignKey("UserId");
                });

            modelBuilder.Entity("TipTournament2._0.Models.Group", b =>
                {
                    b.HasOne("TipTournament2._0.Models.GroupResult", "Result")
                        .WithMany()
                        .HasForeignKey("ResultId");
                });

            modelBuilder.Entity("TipTournament2._0.Models.GroupBet", b =>
                {
                    b.HasOne("TipTournament2._0.Models.Team", "First")
                        .WithMany()
                        .HasForeignKey("FirstId");

                    b.HasOne("TipTournament2._0.Models.Team", "Fourth")
                        .WithMany()
                        .HasForeignKey("FourthId");

                    b.HasOne("TipTournament2._0.Models.Group", "Group")
                        .WithMany()
                        .HasForeignKey("GroupId");

                    b.HasOne("TipTournament2._0.Models.Team", "Second")
                        .WithMany()
                        .HasForeignKey("SecondId");

                    b.HasOne("TipTournament2._0.Models.Team", "Third")
                        .WithMany()
                        .HasForeignKey("ThirdId");

                    b.HasOne("TipTournament2._0.Models.ApplicationUser", "User")
                        .WithMany()
                        .HasForeignKey("UserId");
                });

            modelBuilder.Entity("TipTournament2._0.Models.GroupResult", b =>
                {
                    b.HasOne("TipTournament2._0.Models.Team", "First")
                        .WithMany()
                        .HasForeignKey("FirstId");

                    b.HasOne("TipTournament2._0.Models.Team", "Fourth")
                        .WithMany()
                        .HasForeignKey("FourthId");

                    b.HasOne("TipTournament2._0.Models.Team", "Second")
                        .WithMany()
                        .HasForeignKey("SecondId");

                    b.HasOne("TipTournament2._0.Models.Team", "Third")
                        .WithMany()
                        .HasForeignKey("ThirdId");
                });

            modelBuilder.Entity("TipTournament2._0.Models.Match", b =>
                {
                    b.HasOne("TipTournament2._0.Models.Team", "Away")
                        .WithMany()
                        .HasForeignKey("AwayId");

                    b.HasOne("TipTournament2._0.Models.Group", null)
                        .WithMany("Matches")
                        .HasForeignKey("GroupId");

                    b.HasOne("TipTournament2._0.Models.Team", "Home")
                        .WithMany()
                        .HasForeignKey("HomeId");

                    b.HasOne("TipTournament2._0.Models.Result", "Result")
                        .WithMany()
                        .HasForeignKey("ResultId");
                });

            modelBuilder.Entity("TipTournament2._0.Models.MatchBet", b =>
                {
                    b.HasOne("TipTournament2._0.Models.ApplicationUser", "User")
                        .WithMany()
                        .HasForeignKey("AspNetUsers");

                    b.HasOne("TipTournament2._0.Models.Match", "Match")
                        .WithMany()
                        .HasForeignKey("Matches");

                    b.HasOne("TipTournament2._0.Models.Result", "Tip")
                        .WithMany()
                        .HasForeignKey("Results");
                });

            modelBuilder.Entity("TipTournament2._0.Models.SpecificTeamPlaceBet", b =>
                {
                    b.HasOne("TipTournament2._0.Models.ApplicationUser", "User")
                        .WithMany()
                        .HasForeignKey("UserId");

                    b.HasOne("TipTournament2._0.Models.Team", "Team")
                        .WithMany()
                        .HasForeignKey("teamId");
                });

            modelBuilder.Entity("TipTournament2._0.Models.TopShooterBet", b =>
                {
                    b.HasOne("TipTournament2._0.Models.ApplicationUser", "User")
                        .WithMany()
                        .HasForeignKey("UserId");
                });
#pragma warning restore 612, 618
        }
    }
}
