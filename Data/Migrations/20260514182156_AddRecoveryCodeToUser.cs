using Microsoft.EntityFrameworkCore.Migrations;

#nullable disable

namespace TipTournament2._0.Data.Migrations
{
    /// <inheritdoc />
    public partial class AddRecoveryCodeToUser : Migration
    {
        /// <inheritdoc />
        protected override void Up(MigrationBuilder migrationBuilder)
        {
            migrationBuilder.AddColumn<string>(
                name: "RecoveryCode",
                table: "AspNetUsers",
                type: "nvarchar(max)",
                nullable: true);
        }

        /// <inheritdoc />
        protected override void Down(MigrationBuilder migrationBuilder)
        {
            migrationBuilder.DropColumn(
                name: "RecoveryCode",
                table: "AspNetUsers");
        }
    }
}
