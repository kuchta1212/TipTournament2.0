using Microsoft.EntityFrameworkCore.Migrations;

namespace TipTournament2._0.Data.Migrations
{
    public partial class addgroupbets : Migration
    {
        protected override void Up(MigrationBuilder migrationBuilder)
        {
            migrationBuilder.CreateTable(
                name: "GroupBets",
                columns: table => new
                {
                    Id = table.Column<string>(nullable: false),
                    FirstId = table.Column<string>(nullable: true),
                    SecondId = table.Column<string>(nullable: true),
                    ThirdId = table.Column<string>(nullable: true),
                    FourthId = table.Column<string>(nullable: true),
                    Points = table.Column<int>(nullable: false)
                },
                constraints: table =>
                {
                    table.PrimaryKey("PK_GroupBets", x => x.Id);
                    table.ForeignKey(
                        name: "FK_GroupBets_Teams_FirstId",
                        column: x => x.FirstId,
                        principalTable: "Teams",
                        principalColumn: "Id",
                        onDelete: ReferentialAction.Restrict);
                    table.ForeignKey(
                        name: "FK_GroupBets_Teams_FourthId",
                        column: x => x.FourthId,
                        principalTable: "Teams",
                        principalColumn: "Id",
                        onDelete: ReferentialAction.Restrict);
                    table.ForeignKey(
                        name: "FK_GroupBets_Teams_SecondId",
                        column: x => x.SecondId,
                        principalTable: "Teams",
                        principalColumn: "Id",
                        onDelete: ReferentialAction.Restrict);
                    table.ForeignKey(
                        name: "FK_GroupBets_Teams_ThirdId",
                        column: x => x.ThirdId,
                        principalTable: "Teams",
                        principalColumn: "Id",
                        onDelete: ReferentialAction.Restrict);
                });

            migrationBuilder.CreateIndex(
                name: "IX_GroupBets_FirstId",
                table: "GroupBets",
                column: "FirstId");

            migrationBuilder.CreateIndex(
                name: "IX_GroupBets_FourthId",
                table: "GroupBets",
                column: "FourthId");

            migrationBuilder.CreateIndex(
                name: "IX_GroupBets_SecondId",
                table: "GroupBets",
                column: "SecondId");

            migrationBuilder.CreateIndex(
                name: "IX_GroupBets_ThirdId",
                table: "GroupBets",
                column: "ThirdId");
        }

        protected override void Down(MigrationBuilder migrationBuilder)
        {
            migrationBuilder.DropTable(
                name: "GroupBets");
        }
    }
}
