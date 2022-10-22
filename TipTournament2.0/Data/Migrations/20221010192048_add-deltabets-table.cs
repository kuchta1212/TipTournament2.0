using Microsoft.EntityFrameworkCore.Migrations;

namespace TipTournament2._0.Data.Migrations
{
    public partial class adddeltabetstable : Migration
    {
        protected override void Up(MigrationBuilder migrationBuilder)
        {
            migrationBuilder.CreateTable(
                name: "DeltaBets",
                columns: table => new
                {
                    Id = table.Column<string>(nullable: false),
                    MatchId = table.Column<string>(nullable: true),
                    HomeTeamBetId = table.Column<string>(nullable: true),
                    AwayTeamBetId = table.Column<string>(nullable: true),
                    Points = table.Column<int>(nullable: false),
                    UserId = table.Column<string>(nullable: true)
                },
                constraints: table =>
                {
                    table.PrimaryKey("PK_DeltaBets", x => x.Id);
                    table.ForeignKey(
                        name: "FK_DeltaBets_Teams_AwayTeamBetId",
                        column: x => x.AwayTeamBetId,
                        principalTable: "Teams",
                        principalColumn: "Id",
                        onDelete: ReferentialAction.Restrict);
                    table.ForeignKey(
                        name: "FK_DeltaBets_Teams_HomeTeamBetId",
                        column: x => x.HomeTeamBetId,
                        principalTable: "Teams",
                        principalColumn: "Id",
                        onDelete: ReferentialAction.Restrict);
                    table.ForeignKey(
                        name: "FK_DeltaBets_Matches_MatchId",
                        column: x => x.MatchId,
                        principalTable: "Matches",
                        principalColumn: "Id",
                        onDelete: ReferentialAction.Restrict);
                    table.ForeignKey(
                        name: "FK_DeltaBets_AspNetUsers_UserId",
                        column: x => x.UserId,
                        principalTable: "AspNetUsers",
                        principalColumn: "Id",
                        onDelete: ReferentialAction.Restrict);
                });

            migrationBuilder.CreateIndex(
                name: "IX_DeltaBets_AwayTeamBetId",
                table: "DeltaBets",
                column: "AwayTeamBetId");

            migrationBuilder.CreateIndex(
                name: "IX_DeltaBets_HomeTeamBetId",
                table: "DeltaBets",
                column: "HomeTeamBetId");

            migrationBuilder.CreateIndex(
                name: "IX_DeltaBets_MatchId",
                table: "DeltaBets",
                column: "MatchId");

            migrationBuilder.CreateIndex(
                name: "IX_DeltaBets_UserId",
                table: "DeltaBets",
                column: "UserId");
        }

        protected override void Down(MigrationBuilder migrationBuilder)
        {
            migrationBuilder.DropTable(
                name: "DeltaBets");
        }
    }
}
