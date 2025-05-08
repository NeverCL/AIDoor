using Microsoft.EntityFrameworkCore.Migrations;

#nullable disable

namespace AIDoor.WebAPI.Migrations
{
    /// <inheritdoc />
    public partial class Init7 : Migration
    {
        /// <inheritdoc />
        protected override void Up(MigrationBuilder migrationBuilder)
        {
            migrationBuilder.DropForeignKey(
                name: "FK_DeveloperApplications_Users_UserId",
                table: "DeveloperApplications");

            migrationBuilder.DropPrimaryKey(
                name: "PK_DeveloperApplications",
                table: "DeveloperApplications");

            migrationBuilder.RenameTable(
                name: "DeveloperApplications",
                newName: "DeveloperApplication");

            migrationBuilder.RenameIndex(
                name: "IX_DeveloperApplications_UserId",
                table: "DeveloperApplication",
                newName: "IX_DeveloperApplication_UserId");

            migrationBuilder.RenameIndex(
                name: "IX_DeveloperApplications_Status",
                table: "DeveloperApplication",
                newName: "IX_DeveloperApplication_Status");

            migrationBuilder.AddPrimaryKey(
                name: "PK_DeveloperApplication",
                table: "DeveloperApplication",
                column: "Id");

            migrationBuilder.AddForeignKey(
                name: "FK_DeveloperApplication_Users_UserId",
                table: "DeveloperApplication",
                column: "UserId",
                principalTable: "Users",
                principalColumn: "Id",
                onDelete: ReferentialAction.Restrict);
        }

        /// <inheritdoc />
        protected override void Down(MigrationBuilder migrationBuilder)
        {
            migrationBuilder.DropForeignKey(
                name: "FK_DeveloperApplication_Users_UserId",
                table: "DeveloperApplication");

            migrationBuilder.DropPrimaryKey(
                name: "PK_DeveloperApplication",
                table: "DeveloperApplication");

            migrationBuilder.RenameTable(
                name: "DeveloperApplication",
                newName: "DeveloperApplications");

            migrationBuilder.RenameIndex(
                name: "IX_DeveloperApplication_UserId",
                table: "DeveloperApplications",
                newName: "IX_DeveloperApplications_UserId");

            migrationBuilder.RenameIndex(
                name: "IX_DeveloperApplication_Status",
                table: "DeveloperApplications",
                newName: "IX_DeveloperApplications_Status");

            migrationBuilder.AddPrimaryKey(
                name: "PK_DeveloperApplications",
                table: "DeveloperApplications",
                column: "Id");

            migrationBuilder.AddForeignKey(
                name: "FK_DeveloperApplications_Users_UserId",
                table: "DeveloperApplications",
                column: "UserId",
                principalTable: "Users",
                principalColumn: "Id",
                onDelete: ReferentialAction.Restrict);
        }
    }
}
