using Microsoft.EntityFrameworkCore.Migrations;

namespace TipTournament2._0.Data.Migrations
{
    public partial class UpdatingtoV3init : Migration
    {
        protected override void Up(MigrationBuilder migrationBuilder)
        {
            migrationBuilder.DropForeignKey(
                name: "FK_Matches_Results_Results",
                table: "Matches");

            migrationBuilder.DropIndex(
                name: "IX_Matches_Results",
                table: "Matches");

            migrationBuilder.DropColumn(
                name: "AwayTeam",
                table: "Matches");

            migrationBuilder.DropColumn(
                name: "HomeTeam",
                table: "Matches");

            migrationBuilder.DropColumn(
                name: "Results",
                table: "Matches");

            migrationBuilder.AddColumn<string>(
                name: "AwayId",
                table: "Matches",
                nullable: true);

            migrationBuilder.AddColumn<string>(
                name: "GroupId",
                table: "Matches",
                nullable: true);

            migrationBuilder.AddColumn<string>(
                name: "HomeId",
                table: "Matches",
                nullable: true);

            migrationBuilder.AddColumn<string>(
                name: "ResultId",
                table: "Matches",
                nullable: true);

            migrationBuilder.AddColumn<int>(
                name: "Stage",
                table: "Matches",
                nullable: false,
                defaultValue: 0);

            migrationBuilder.CreateTable(
                name: "Group",
                columns: table => new
                {
                    Id = table.Column<string>(nullable: false),
                    GroupName = table.Column<string>(nullable: true)
                },
                constraints: table =>
                {
                    table.PrimaryKey("PK_Group", x => x.Id);
                });

            migrationBuilder.CreateTable(
                name: "Teams",
                columns: table => new
                {
                    Id = table.Column<string>(nullable: false),
                    Name = table.Column<string>(nullable: true),
                    IconPath = table.Column<string>(nullable: true),
                    FinishedAt = table.Column<int>(nullable: false)
                },
                constraints: table =>
                {
                    table.PrimaryKey("PK_Teams", x => x.Id);
                });

            migrationBuilder.CreateTable(
                name: "TopShooterBets",
                columns: table => new
                {
                    Id = table.Column<string>(nullable: false),
                    ShoterNameOne = table.Column<string>(nullable: true),
                    ShoterNameTwo = table.Column<string>(nullable: true),
                    ShoterNameThree = table.Column<string>(nullable: true),
                    Points = table.Column<int>(nullable: false)
                },
                constraints: table =>
                {
                    table.PrimaryKey("PK_TopShooterBets", x => x.Id);
                });

            migrationBuilder.CreateTable(
                name: "TeamPlaceBets",
                columns: table => new
                {
                    Id = table.Column<string>(nullable: false),
                    teamId = table.Column<string>(nullable: true),
                    StageBet = table.Column<int>(nullable: false),
                    IsCorrect = table.Column<bool>(nullable: false)
                },
                constraints: table =>
                {
                    table.PrimaryKey("PK_TeamPlaceBets", x => x.Id);
                    table.ForeignKey(
                        name: "FK_TeamPlaceBets_Teams_teamId",
                        column: x => x.teamId,
                        principalTable: "Teams",
                        principalColumn: "Id",
                        onDelete: ReferentialAction.Restrict);
                });

            migrationBuilder.CreateIndex(
                name: "IX_Matches_AwayId",
                table: "Matches",
                column: "AwayId");

            migrationBuilder.CreateIndex(
                name: "IX_Matches_GroupId",
                table: "Matches",
                column: "GroupId");

            migrationBuilder.CreateIndex(
                name: "IX_Matches_HomeId",
                table: "Matches",
                column: "HomeId");

            migrationBuilder.CreateIndex(
                name: "IX_Matches_ResultId",
                table: "Matches",
                column: "ResultId");

            migrationBuilder.CreateIndex(
                name: "IX_TeamPlaceBets_teamId",
                table: "TeamPlaceBets",
                column: "teamId");

            migrationBuilder.AddForeignKey(
                name: "FK_Matches_Teams_AwayId",
                table: "Matches",
                column: "AwayId",
                principalTable: "Teams",
                principalColumn: "Id",
                onDelete: ReferentialAction.Restrict);

            migrationBuilder.AddForeignKey(
                name: "FK_Matches_Group_GroupId",
                table: "Matches",
                column: "GroupId",
                principalTable: "Group",
                principalColumn: "Id",
                onDelete: ReferentialAction.Restrict);

            migrationBuilder.AddForeignKey(
                name: "FK_Matches_Teams_HomeId",
                table: "Matches",
                column: "HomeId",
                principalTable: "Teams",
                principalColumn: "Id",
                onDelete: ReferentialAction.Restrict);

            migrationBuilder.AddForeignKey(
                name: "FK_Matches_Results_ResultId",
                table: "Matches",
                column: "ResultId",
                principalTable: "Results",
                principalColumn: "Id",
                onDelete: ReferentialAction.Restrict);
        }

        protected override void Down(MigrationBuilder migrationBuilder)
        {
            migrationBuilder.DropForeignKey(
                name: "FK_Matches_Teams_AwayId",
                table: "Matches");

            migrationBuilder.DropForeignKey(
                name: "FK_Matches_Group_GroupId",
                table: "Matches");

            migrationBuilder.DropForeignKey(
                name: "FK_Matches_Teams_HomeId",
                table: "Matches");

            migrationBuilder.DropForeignKey(
                name: "FK_Matches_Results_ResultId",
                table: "Matches");

            migrationBuilder.DropTable(
                name: "Group");

            migrationBuilder.DropTable(
                name: "TeamPlaceBets");

            migrationBuilder.DropTable(
                name: "TopShooterBets");

            migrationBuilder.DropTable(
                name: "Teams");

            migrationBuilder.DropIndex(
                name: "IX_Matches_AwayId",
                table: "Matches");

            migrationBuilder.DropIndex(
                name: "IX_Matches_GroupId",
                table: "Matches");

            migrationBuilder.DropIndex(
                name: "IX_Matches_HomeId",
                table: "Matches");

            migrationBuilder.DropIndex(
                name: "IX_Matches_ResultId",
                table: "Matches");

            migrationBuilder.DropColumn(
                name: "AwayId",
                table: "Matches");

            migrationBuilder.DropColumn(
                name: "GroupId",
                table: "Matches");

            migrationBuilder.DropColumn(
                name: "HomeId",
                table: "Matches");

            migrationBuilder.DropColumn(
                name: "ResultId",
                table: "Matches");

            migrationBuilder.DropColumn(
                name: "Stage",
                table: "Matches");

            migrationBuilder.AddColumn<string>(
                name: "AwayTeam",
                table: "Matches",
                type: "nvarchar(max)",
                nullable: true);

            migrationBuilder.AddColumn<string>(
                name: "HomeTeam",
                table: "Matches",
                type: "nvarchar(max)",
                nullable: true);

            migrationBuilder.AddColumn<string>(
                name: "Results",
                table: "Matches",
                type: "nvarchar(450)",
                nullable: true);

            migrationBuilder.CreateIndex(
                name: "IX_Matches_Results",
                table: "Matches",
                column: "Results");

            migrationBuilder.AddForeignKey(
                name: "FK_Matches_Results_Results",
                table: "Matches",
                column: "Results",
                principalTable: "Results",
                principalColumn: "Id",
                onDelete: ReferentialAction.Restrict);
        }
    }
}
