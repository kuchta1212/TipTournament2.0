using Microsoft.EntityFrameworkCore.Migrations;

namespace TipTournament2._0.Data.Migrations
{
    public partial class addcolumnuseridteamplacebet : Migration
    {
        protected override void Up(MigrationBuilder migrationBuilder)
        {
            migrationBuilder.AddColumn<string>(
                name: "UserId",
                table: "TeamPlaceBets",
                nullable: true);

            migrationBuilder.CreateIndex(
                name: "IX_TeamPlaceBets_UserId",
                table: "TeamPlaceBets",
                column: "UserId");

            migrationBuilder.AddForeignKey(
                name: "FK_TeamPlaceBets_AspNetUsers_UserId",
                table: "TeamPlaceBets",
                column: "UserId",
                principalTable: "AspNetUsers",
                principalColumn: "Id",
                onDelete: ReferentialAction.Restrict);
        }

        protected override void Down(MigrationBuilder migrationBuilder)
        {
            migrationBuilder.DropForeignKey(
                name: "FK_TeamPlaceBets_AspNetUsers_UserId",
                table: "TeamPlaceBets");

            migrationBuilder.DropIndex(
                name: "IX_TeamPlaceBets_UserId",
                table: "TeamPlaceBets");

            migrationBuilder.DropColumn(
                name: "UserId",
                table: "TeamPlaceBets");
        }
    }
}
