using Microsoft.EntityFrameworkCore.Migrations;

namespace TipTournament2._0.Data.Migrations
{
    public partial class AddcolumnsGroupBet : Migration
    {
        protected override void Up(MigrationBuilder migrationBuilder)
        {
            migrationBuilder.AddColumn<string>(
                name: "GroupId",
                table: "GroupBets",
                nullable: true);

            migrationBuilder.AddColumn<string>(
                name: "UserId",
                table: "GroupBets",
                nullable: true);

            migrationBuilder.CreateIndex(
                name: "IX_GroupBets_GroupId",
                table: "GroupBets",
                column: "GroupId");

            migrationBuilder.CreateIndex(
                name: "IX_GroupBets_UserId",
                table: "GroupBets",
                column: "UserId");

            migrationBuilder.AddForeignKey(
                name: "FK_GroupBets_Groups_GroupId",
                table: "GroupBets",
                column: "GroupId",
                principalTable: "Groups",
                principalColumn: "Id",
                onDelete: ReferentialAction.Restrict);

            migrationBuilder.AddForeignKey(
                name: "FK_GroupBets_AspNetUsers_UserId",
                table: "GroupBets",
                column: "UserId",
                principalTable: "AspNetUsers",
                principalColumn: "Id",
                onDelete: ReferentialAction.Restrict);
        }

        protected override void Down(MigrationBuilder migrationBuilder)
        {
            migrationBuilder.DropForeignKey(
                name: "FK_GroupBets_Groups_GroupId",
                table: "GroupBets");

            migrationBuilder.DropForeignKey(
                name: "FK_GroupBets_AspNetUsers_UserId",
                table: "GroupBets");

            migrationBuilder.DropIndex(
                name: "IX_GroupBets_GroupId",
                table: "GroupBets");

            migrationBuilder.DropIndex(
                name: "IX_GroupBets_UserId",
                table: "GroupBets");

            migrationBuilder.DropColumn(
                name: "GroupId",
                table: "GroupBets");

            migrationBuilder.DropColumn(
                name: "UserId",
                table: "GroupBets");
        }
    }
}
