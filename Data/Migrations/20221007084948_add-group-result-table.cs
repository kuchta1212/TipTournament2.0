using Microsoft.EntityFrameworkCore.Migrations;

namespace TipTournament2._0.Data.Migrations
{
    public partial class addgroupresulttable : Migration
    {
        protected override void Up(MigrationBuilder migrationBuilder)
        {
            migrationBuilder.AddColumn<string>(
                name: "ResultId",
                table: "Groups",
                nullable: true);

            migrationBuilder.CreateTable(
                name: "GroupResults",
                columns: table => new
                {
                    Id = table.Column<string>(nullable: false),
                    FirstId = table.Column<string>(nullable: true),
                    SecondId = table.Column<string>(nullable: true),
                    ThirdId = table.Column<string>(nullable: true),
                    FourthId = table.Column<string>(nullable: true)
                },
                constraints: table =>
                {
                    table.PrimaryKey("PK_GroupResults", x => x.Id);
                    table.ForeignKey(
                        name: "FK_GroupResults_Teams_FirstId",
                        column: x => x.FirstId,
                        principalTable: "Teams",
                        principalColumn: "Id",
                        onDelete: ReferentialAction.Restrict);
                    table.ForeignKey(
                        name: "FK_GroupResults_Teams_FourthId",
                        column: x => x.FourthId,
                        principalTable: "Teams",
                        principalColumn: "Id",
                        onDelete: ReferentialAction.Restrict);
                    table.ForeignKey(
                        name: "FK_GroupResults_Teams_SecondId",
                        column: x => x.SecondId,
                        principalTable: "Teams",
                        principalColumn: "Id",
                        onDelete: ReferentialAction.Restrict);
                    table.ForeignKey(
                        name: "FK_GroupResults_Teams_ThirdId",
                        column: x => x.ThirdId,
                        principalTable: "Teams",
                        principalColumn: "Id",
                        onDelete: ReferentialAction.Restrict);
                });

            migrationBuilder.CreateIndex(
                name: "IX_Groups_ResultId",
                table: "Groups",
                column: "ResultId");

            migrationBuilder.CreateIndex(
                name: "IX_GroupResults_FirstId",
                table: "GroupResults",
                column: "FirstId");

            migrationBuilder.CreateIndex(
                name: "IX_GroupResults_FourthId",
                table: "GroupResults",
                column: "FourthId");

            migrationBuilder.CreateIndex(
                name: "IX_GroupResults_SecondId",
                table: "GroupResults",
                column: "SecondId");

            migrationBuilder.CreateIndex(
                name: "IX_GroupResults_ThirdId",
                table: "GroupResults",
                column: "ThirdId");

            migrationBuilder.AddForeignKey(
                name: "FK_Groups_GroupResults_ResultId",
                table: "Groups",
                column: "ResultId",
                principalTable: "GroupResults",
                principalColumn: "Id",
                onDelete: ReferentialAction.Restrict);
        }

        protected override void Down(MigrationBuilder migrationBuilder)
        {
            migrationBuilder.DropForeignKey(
                name: "FK_Groups_GroupResults_ResultId",
                table: "Groups");

            migrationBuilder.DropTable(
                name: "GroupResults");

            migrationBuilder.DropIndex(
                name: "IX_Groups_ResultId",
                table: "Groups");

            migrationBuilder.DropColumn(
                name: "ResultId",
                table: "Groups");
        }
    }
}
