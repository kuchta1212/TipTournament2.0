using Microsoft.EntityFrameworkCore.Migrations;

namespace TipTournament2._0.Data.Migrations
{
    public partial class addremovecolumnstopshootersbet : Migration
    {
        protected override void Up(MigrationBuilder migrationBuilder)
        {
            migrationBuilder.DropColumn(
                name: "ShoterNameOne",
                table: "TopShooterBets");

            migrationBuilder.DropColumn(
                name: "ShoterNameThree",
                table: "TopShooterBets");

            migrationBuilder.DropColumn(
                name: "ShoterNameTwo",
                table: "TopShooterBets");

            migrationBuilder.AddColumn<string>(
                name: "ShoterName",
                table: "TopShooterBets",
                nullable: true);

            migrationBuilder.AddColumn<string>(
                name: "UserId",
                table: "TopShooterBets",
                nullable: true);

            migrationBuilder.CreateIndex(
                name: "IX_TopShooterBets_UserId",
                table: "TopShooterBets",
                column: "UserId");

            migrationBuilder.AddForeignKey(
                name: "FK_TopShooterBets_AspNetUsers_UserId",
                table: "TopShooterBets",
                column: "UserId",
                principalTable: "AspNetUsers",
                principalColumn: "Id",
                onDelete: ReferentialAction.Restrict);
        }

        protected override void Down(MigrationBuilder migrationBuilder)
        {
            migrationBuilder.DropForeignKey(
                name: "FK_TopShooterBets_AspNetUsers_UserId",
                table: "TopShooterBets");

            migrationBuilder.DropIndex(
                name: "IX_TopShooterBets_UserId",
                table: "TopShooterBets");

            migrationBuilder.DropColumn(
                name: "ShoterName",
                table: "TopShooterBets");

            migrationBuilder.DropColumn(
                name: "UserId",
                table: "TopShooterBets");

            migrationBuilder.AddColumn<string>(
                name: "ShoterNameOne",
                table: "TopShooterBets",
                type: "nvarchar(max)",
                nullable: true);

            migrationBuilder.AddColumn<string>(
                name: "ShoterNameThree",
                table: "TopShooterBets",
                type: "nvarchar(max)",
                nullable: true);

            migrationBuilder.AddColumn<string>(
                name: "ShoterNameTwo",
                table: "TopShooterBets",
                type: "nvarchar(max)",
                nullable: true);
        }
    }
}
