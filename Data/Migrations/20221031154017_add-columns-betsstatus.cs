using Microsoft.EntityFrameworkCore.Migrations;

namespace TipTournament2._0.Data.Migrations
{
    public partial class addcolumnsbetsstatus : Migration
    {
        protected override void Up(MigrationBuilder migrationBuilder)
        {
            migrationBuilder.AddColumn<bool>(
                name: "LambdaStageDone",
                table: "BetsStatuses",
                nullable: false,
                defaultValue: false);

            migrationBuilder.AddColumn<bool>(
                name: "OmikronStageDone",
                table: "BetsStatuses",
                nullable: false,
                defaultValue: false);

            migrationBuilder.AddColumn<bool>(
                name: "WinnerStageDone",
                table: "BetsStatuses",
                nullable: false,
                defaultValue: false);
        }

        protected override void Down(MigrationBuilder migrationBuilder)
        {
            migrationBuilder.DropColumn(
                name: "LambdaStageDone",
                table: "BetsStatuses");

            migrationBuilder.DropColumn(
                name: "OmikronStageDone",
                table: "BetsStatuses");

            migrationBuilder.DropColumn(
                name: "WinnerStageDone",
                table: "BetsStatuses");
        }
    }
}
