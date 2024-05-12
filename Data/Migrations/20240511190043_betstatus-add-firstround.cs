using Microsoft.EntityFrameworkCore.Migrations;

namespace TipTournament2._0.Data.Migrations
{
    public partial class betstatusaddfirstround : Migration
    {
        protected override void Up(MigrationBuilder migrationBuilder)
        {
            migrationBuilder.AddColumn<bool>(
                name: "FirstStagesDones",
                table: "BetsStatuses",
                nullable: false,
                defaultValue: false);
        }

        protected override void Down(MigrationBuilder migrationBuilder)
        {
            migrationBuilder.DropColumn(
                name: "FirstStagesDones",
                table: "BetsStatuses");
        }
    }
}
