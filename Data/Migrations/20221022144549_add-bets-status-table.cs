using Microsoft.EntityFrameworkCore.Migrations;

namespace TipTournament2._0.Data.Migrations
{
    public partial class addbetsstatustable : Migration
    {
        protected override void Up(MigrationBuilder migrationBuilder)
        {
            migrationBuilder.CreateTable(
                name: "BetsStatuses",
                columns: table => new
                {
                    Id = table.Column<string>(nullable: false),
                    UserId = table.Column<string>(nullable: true),
                    MatchesInGroupsDone = table.Column<bool>(nullable: false),
                    GroupStagesDone = table.Column<bool>(nullable: false),
                    QuerterfinalStageDone = table.Column<bool>(nullable: false),
                    SemifinalStageDone = table.Column<bool>(nullable: false),
                    FinalStageDone = table.Column<bool>(nullable: false)
                },
                constraints: table =>
                {
                    table.PrimaryKey("PK_BetsStatuses", x => x.Id);
                    table.ForeignKey(
                        name: "FK_BetsStatuses_AspNetUsers_UserId",
                        column: x => x.UserId,
                        principalTable: "AspNetUsers",
                        principalColumn: "Id",
                        onDelete: ReferentialAction.Restrict);
                });

            migrationBuilder.CreateIndex(
                name: "IX_BetsStatuses_UserId",
                table: "BetsStatuses",
                column: "UserId");
        }

        protected override void Down(MigrationBuilder migrationBuilder)
        {
            migrationBuilder.DropTable(
                name: "BetsStatuses");
        }
    }
}
