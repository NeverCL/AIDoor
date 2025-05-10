using Microsoft.EntityFrameworkCore.Migrations;

#nullable disable

namespace AIDoor.WebAPI.Migrations
{
    /// <inheritdoc />
    public partial class Init1 : Migration
    {
        /// <inheritdoc />
        protected override void Up(MigrationBuilder migrationBuilder)
        {
            migrationBuilder.AddColumn<int>(
                name: "PublisherId",
                table: "Users",
                type: "int",
                nullable: true);

            migrationBuilder.AddColumn<int>(
                name: "PublisherId1",
                table: "Users",
                type: "int",
                nullable: true);

            migrationBuilder.CreateIndex(
                name: "IX_Users_PublisherId1",
                table: "Users",
                column: "PublisherId1");

            migrationBuilder.AddForeignKey(
                name: "FK_Users_Publishers_PublisherId1",
                table: "Users",
                column: "PublisherId1",
                principalTable: "Publishers",
                principalColumn: "Id");
        }

        /// <inheritdoc />
        protected override void Down(MigrationBuilder migrationBuilder)
        {
            migrationBuilder.DropForeignKey(
                name: "FK_Users_Publishers_PublisherId1",
                table: "Users");

            migrationBuilder.DropIndex(
                name: "IX_Users_PublisherId1",
                table: "Users");

            migrationBuilder.DropColumn(
                name: "PublisherId",
                table: "Users");

            migrationBuilder.DropColumn(
                name: "PublisherId1",
                table: "Users");
        }
    }
}
