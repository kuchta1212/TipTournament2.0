using Microsoft.EntityFrameworkCore.Migrations;

namespace TipTournament2._0.Data.Migrations
{
    public partial class addcolumnsapplicationuser : Migration
    {
        protected override void Up(MigrationBuilder migrationBuilder)
        {
            migrationBuilder.DropColumn(
                name: "Points",
                table: "AspNetUsers");

            migrationBuilder.AddColumn<int>(
                name: "AlfaPoints",
                table: "AspNetUsers",
                nullable: false,
                defaultValue: 0);

            migrationBuilder.AddColumn<int>(
                name: "DeltaPoints",
                table: "AspNetUsers",
                nullable: false,
                defaultValue: 0);

            migrationBuilder.AddColumn<int>(
                name: "GamaPoints",
                table: "AspNetUsers",
                nullable: false,
                defaultValue: 0);

            migrationBuilder.AddColumn<int>(
                name: "LambdaPoints",
                table: "AspNetUsers",
                nullable: false,
                defaultValue: 0);

            migrationBuilder.AddColumn<int>(
                name: "OmikronPoints",
                table: "AspNetUsers",
                nullable: false,
                defaultValue: 0);

            migrationBuilder.AddColumn<int>(
                name: "TotalPoints",
                table: "AspNetUsers",
                nullable: false,
                defaultValue: 0);
        }

        protected override void Down(MigrationBuilder migrationBuilder)
        {
            migrationBuilder.DropColumn(
                name: "AlfaPoints",
                table: "AspNetUsers");

            migrationBuilder.DropColumn(
                name: "DeltaPoints",
                table: "AspNetUsers");

            migrationBuilder.DropColumn(
                name: "GamaPoints",
                table: "AspNetUsers");

            migrationBuilder.DropColumn(
                name: "LambdaPoints",
                table: "AspNetUsers");

            migrationBuilder.DropColumn(
                name: "OmikronPoints",
                table: "AspNetUsers");

            migrationBuilder.DropColumn(
                name: "TotalPoints",
                table: "AspNetUsers");

            migrationBuilder.AddColumn<int>(
                name: "Points",
                table: "AspNetUsers",
                type: "int",
                nullable: false,
                defaultValue: 0);
        }
    }
}
