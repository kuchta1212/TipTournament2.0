using Microsoft.EntityFrameworkCore.Migrations;

namespace TipTournament2._0.Data.Migrations
{
    public partial class BetResutcolumnadd : Migration
    {
        protected override void Up(MigrationBuilder migrationBuilder)
        {
            migrationBuilder.AddColumn<int>(
                name: "Result",
                table: "Bets",
                nullable: false,
                defaultValue: 0);
        }

        protected override void Down(MigrationBuilder migrationBuilder)
        {
            migrationBuilder.DropColumn(
                name: "Result",
                table: "Bets");
        }
    }
}
