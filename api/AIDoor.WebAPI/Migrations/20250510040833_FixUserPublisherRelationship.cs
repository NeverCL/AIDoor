using Microsoft.EntityFrameworkCore.Migrations;

#nullable disable

namespace AIDoor.WebAPI.Migrations
{
    /// <inheritdoc />
    public partial class FixUserPublisherRelationship : Migration
    {
        /// <inheritdoc />
        protected override void Up(MigrationBuilder migrationBuilder)
        {
            migrationBuilder.DropForeignKey(
                name: "FK_Publishers_Users_UserId",
                table: "Publishers");

            migrationBuilder.DropForeignKey(
                name: "FK_Users_Publishers_PublisherId1",
                table: "Users");

            migrationBuilder.DropIndex(
                name: "IX_Users_PublisherId1",
                table: "Users");

            migrationBuilder.DropIndex(
                name: "IX_Publishers_UserId",
                table: "Publishers");

            migrationBuilder.DropColumn(
                name: "PublisherId1",
                table: "Users");

            migrationBuilder.CreateIndex(
                name: "IX_Users_PublisherId",
                table: "Users",
                column: "PublisherId",
                unique: true);

            migrationBuilder.AddForeignKey(
                name: "FK_Users_Publishers_PublisherId",
                table: "Users",
                column: "PublisherId",
                principalTable: "Publishers",
                principalColumn: "Id",
                onDelete: ReferentialAction.Restrict);
        }

        /// <inheritdoc />
        protected override void Down(MigrationBuilder migrationBuilder)
        {
            migrationBuilder.DropForeignKey(
                name: "FK_Users_Publishers_PublisherId",
                table: "Users");

            migrationBuilder.DropIndex(
                name: "IX_Users_PublisherId",
                table: "Users");

            migrationBuilder.AddColumn<int>(
                name: "PublisherId1",
                table: "Users",
                type: "int",
                nullable: true);

            migrationBuilder.CreateIndex(
                name: "IX_Users_PublisherId1",
                table: "Users",
                column: "PublisherId1");

            migrationBuilder.CreateIndex(
                name: "IX_Publishers_UserId",
                table: "Publishers",
                column: "UserId");

            migrationBuilder.AddForeignKey(
                name: "FK_Publishers_Users_UserId",
                table: "Publishers",
                column: "UserId",
                principalTable: "Users",
                principalColumn: "Id",
                onDelete: ReferentialAction.Restrict);

            migrationBuilder.AddForeignKey(
                name: "FK_Users_Publishers_PublisherId1",
                table: "Users",
                column: "PublisherId1",
                principalTable: "Publishers",
                principalColumn: "Id");
        }
    }
}
