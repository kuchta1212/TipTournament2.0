using Microsoft.EntityFrameworkCore.Migrations;

namespace TipTournament2._0.Data.Migrations
{
    public partial class addadditionaldeltaresult : Migration
    {
        protected override void Up(MigrationBuilder migrationBuilder)
        {
            migrationBuilder.AddColumn<string>(
                name: "AdditionalResultId",
                table: "DeltaBetResults",
                nullable: true);

            migrationBuilder.CreateIndex(
                name: "IX_DeltaBetResults_AdditionalResultId",
                table: "DeltaBetResults",
                column: "AdditionalResultId");

            migrationBuilder.AddForeignKey(
                name: "FK_DeltaBetResults_DeltaBetResults_AdditionalResultId",
                table: "DeltaBetResults",
                column: "AdditionalResultId",
                principalTable: "DeltaBetResults",
                principalColumn: "Id",
                onDelete: ReferentialAction.Restrict);
        }

        protected override void Down(MigrationBuilder migrationBuilder)
        {
            migrationBuilder.DropForeignKey(
                name: "FK_DeltaBetResults_DeltaBetResults_AdditionalResultId",
                table: "DeltaBetResults");

            migrationBuilder.DropIndex(
                name: "IX_DeltaBetResults_AdditionalResultId",
                table: "DeltaBetResults");

            migrationBuilder.DropColumn(
                name: "AdditionalResultId",
                table: "DeltaBetResults");
        }
    }
}
