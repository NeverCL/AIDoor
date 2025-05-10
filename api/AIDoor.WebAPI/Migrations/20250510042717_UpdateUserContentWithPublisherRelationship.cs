using Microsoft.EntityFrameworkCore.Migrations;

#nullable disable

namespace AIDoor.WebAPI.Migrations
{
    /// <inheritdoc />
    public partial class UpdateUserContentWithPublisherRelationship : Migration
    {
        /// <inheritdoc />
        protected override void Up(MigrationBuilder migrationBuilder)
        {
            migrationBuilder.DropForeignKey(
                name: "FK_UserContents_Users_UserId",
                table: "UserContents");

            migrationBuilder.RenameColumn(
                name: "UserId",
                table: "UserContents",
                newName: "PublisherId");

            migrationBuilder.RenameIndex(
                name: "IX_UserContents_UserId",
                table: "UserContents",
                newName: "IX_UserContents_PublisherId");

            migrationBuilder.AddForeignKey(
                name: "FK_UserContents_Publishers_PublisherId",
                table: "UserContents",
                column: "PublisherId",
                principalTable: "Publishers",
                principalColumn: "Id",
                onDelete: ReferentialAction.Restrict);
        }

        /// <inheritdoc />
        protected override void Down(MigrationBuilder migrationBuilder)
        {
            migrationBuilder.DropForeignKey(
                name: "FK_UserContents_Publishers_PublisherId",
                table: "UserContents");

            migrationBuilder.RenameColumn(
                name: "PublisherId",
                table: "UserContents",
                newName: "UserId");

            migrationBuilder.RenameIndex(
                name: "IX_UserContents_PublisherId",
                table: "UserContents",
                newName: "IX_UserContents_UserId");

            migrationBuilder.AddForeignKey(
                name: "FK_UserContents_Users_UserId",
                table: "UserContents",
                column: "UserId",
                principalTable: "Users",
                principalColumn: "Id",
                onDelete: ReferentialAction.Restrict);
        }
    }
}
