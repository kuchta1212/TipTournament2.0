using Microsoft.EntityFrameworkCore.Migrations;

namespace TipTournament2._0.Data.Migrations
{
    public partial class addresults : Migration
    {
        protected override void Up(MigrationBuilder migrationBuilder)
        {
            migrationBuilder.DropColumn(
                name: "Points",
                table: "GroupBets");

            migrationBuilder.DropColumn(
                name: "Points",
                table: "DeltaBets");

            migrationBuilder.AddColumn<bool>(
                name: "IsCorrect",
                table: "TopShooterBets",
                nullable: false,
                defaultValue: false);

            migrationBuilder.AddColumn<string>(
                name: "ResultId",
                table: "GroupBets",
                nullable: true);

            migrationBuilder.AddColumn<string>(
                name: "ResultId",
                table: "DeltaBets",
                nullable: true);

            migrationBuilder.CreateTable(
                name: "DeltaBetResults",
                columns: table => new
                {
                    Id = table.Column<string>(nullable: false),
                    IsHomeTeamCorrect = table.Column<bool>(nullable: false),
                    IsAwayTeamCorrect = table.Column<bool>(nullable: false),
                    Points = table.Column<int>(nullable: false)
                },
                constraints: table =>
                {
                    table.PrimaryKey("PK_DeltaBetResults", x => x.Id);
                });

            migrationBuilder.CreateTable(
                name: "GroupBetResults",
                columns: table => new
                {
                    Id = table.Column<string>(nullable: false),
                    IsFirstCorrect = table.Column<bool>(nullable: false),
                    IsSecondCorrect = table.Column<bool>(nullable: false),
                    IsThirdCorrect = table.Column<bool>(nullable: false),
                    IsFourthCorrect = table.Column<bool>(nullable: false),
                    Points = table.Column<int>(nullable: false)
                },
                constraints: table =>
                {
                    table.PrimaryKey("PK_GroupBetResults", x => x.Id);
                });

            migrationBuilder.CreateIndex(
                name: "IX_GroupBets_ResultId",
                table: "GroupBets",
                column: "ResultId");

            migrationBuilder.CreateIndex(
                name: "IX_DeltaBets_ResultId",
                table: "DeltaBets",
                column: "ResultId");

            migrationBuilder.AddForeignKey(
                name: "FK_DeltaBets_DeltaBetResults_ResultId",
                table: "DeltaBets",
                column: "ResultId",
                principalTable: "DeltaBetResults",
                principalColumn: "Id",
                onDelete: ReferentialAction.Restrict);

            migrationBuilder.AddForeignKey(
                name: "FK_GroupBets_GroupBetResults_ResultId",
                table: "GroupBets",
                column: "ResultId",
                principalTable: "GroupBetResults",
                principalColumn: "Id",
                onDelete: ReferentialAction.Restrict);
        }

        protected override void Down(MigrationBuilder migrationBuilder)
        {
            migrationBuilder.DropForeignKey(
                name: "FK_DeltaBets_DeltaBetResults_ResultId",
                table: "DeltaBets");

            migrationBuilder.DropForeignKey(
                name: "FK_GroupBets_GroupBetResults_ResultId",
                table: "GroupBets");

            migrationBuilder.DropTable(
                name: "DeltaBetResults");

            migrationBuilder.DropTable(
                name: "GroupBetResults");

            migrationBuilder.DropIndex(
                name: "IX_GroupBets_ResultId",
                table: "GroupBets");

            migrationBuilder.DropIndex(
                name: "IX_DeltaBets_ResultId",
                table: "DeltaBets");

            migrationBuilder.DropColumn(
                name: "IsCorrect",
                table: "TopShooterBets");

            migrationBuilder.DropColumn(
                name: "ResultId",
                table: "GroupBets");

            migrationBuilder.DropColumn(
                name: "ResultId",
                table: "DeltaBets");

            migrationBuilder.AddColumn<int>(
                name: "Points",
                table: "GroupBets",
                type: "int",
                nullable: false,
                defaultValue: 0);

            migrationBuilder.AddColumn<int>(
                name: "Points",
                table: "DeltaBets",
                type: "int",
                nullable: false,
                defaultValue: 0);
        }
    }
}
