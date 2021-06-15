using System;
using Microsoft.EntityFrameworkCore.Migrations;

namespace TipTournament2._0.Data.Migrations
{
    public partial class AddUpdateStatusTable : Migration
    {
        protected override void Up(MigrationBuilder migrationBuilder)
        {
            migrationBuilder.CreateTable(
                name: "UpdateStatuses",
                columns: table => new
                {
                    Id = table.Column<string>(nullable: false),
                    AmountOfUpdates = table.Column<int>(nullable: false),
                    Date = table.Column<DateTime>(nullable: false),
                    ErrorMessage = table.Column<string>(nullable: true)
                },
                constraints: table =>
                {
                    table.PrimaryKey("PK_UpdateStatuses", x => x.Id);
                });
        }

        protected override void Down(MigrationBuilder migrationBuilder)
        {
            migrationBuilder.DropTable(
                name: "UpdateStatuses");
        }
    }
}
