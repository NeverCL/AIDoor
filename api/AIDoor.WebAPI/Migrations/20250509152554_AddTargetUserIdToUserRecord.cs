using Microsoft.EntityFrameworkCore.Migrations;

#nullable disable

namespace AIDoor.WebAPI.Migrations
{
    /// <inheritdoc />
    public partial class AddTargetUserIdToUserRecord : Migration
    {
        /// <inheritdoc />
        protected override void Up(MigrationBuilder migrationBuilder)
        {
            // Add TargetUserId column
            migrationBuilder.AddColumn<int>(
                name: "TargetUserId",
                table: "UserRecords",
                type: "int",
                nullable: true);

            migrationBuilder.RenameColumn(
                name: "FollowingCount",
                table: "Publishers",
                newName: "FavoritesCount");

            migrationBuilder.CreateIndex(
                name: "IX_UserRecords_TargetUserId",
                table: "UserRecords",
                column: "TargetUserId");

            migrationBuilder.AddForeignKey(
                name: "FK_UserRecords_Users_TargetUserId",
                table: "UserRecords",
                column: "TargetUserId",
                principalTable: "Users",
                principalColumn: "Id");
        }

        /// <inheritdoc />
        protected override void Down(MigrationBuilder migrationBuilder)
        {
            migrationBuilder.DropForeignKey(
                name: "FK_UserRecords_Users_TargetUserId",
                table: "UserRecords");

            migrationBuilder.DropIndex(
                name: "IX_UserRecords_TargetUserId",
                table: "UserRecords");

            migrationBuilder.DropColumn(
                name: "TargetUserId",
                table: "UserRecords");

            migrationBuilder.RenameColumn(
                name: "FavoritesCount",
                table: "Publishers",
                newName: "FollowingCount");
        }
    }
}
