using Microsoft.EntityFrameworkCore.Migrations;

#nullable disable

namespace AIDoor.WebAPI.Migrations
{
    /// <inheritdoc />
    public partial class RemoveRecordFields : Migration
    {
        /// <inheritdoc />
        protected override void Up(MigrationBuilder migrationBuilder)
        {
            migrationBuilder.DropIndex(
                name: "IX_UserRecords_Title",
                table: "UserRecords");

            migrationBuilder.DropColumn(
                name: "ImageUrl",
                table: "UserRecords");

            migrationBuilder.DropColumn(
                name: "Notes",
                table: "UserRecords");

            migrationBuilder.DropColumn(
                name: "Title",
                table: "UserRecords");

            migrationBuilder.AddColumn<int>(
                name: "AppId",
                table: "UserRecords",
                type: "int",
                nullable: true);

            migrationBuilder.AddColumn<int>(
                name: "ContentId",
                table: "UserRecords",
                type: "int",
                nullable: true);
        }

        /// <inheritdoc />
        protected override void Down(MigrationBuilder migrationBuilder)
        {
            migrationBuilder.DropColumn(
                name: "AppId",
                table: "UserRecords");

            migrationBuilder.DropColumn(
                name: "ContentId",
                table: "UserRecords");

            migrationBuilder.AddColumn<string>(
                name: "ImageUrl",
                table: "UserRecords",
                type: "longtext",
                nullable: false)
                .Annotation("MySql:CharSet", "utf8mb4");

            migrationBuilder.AddColumn<string>(
                name: "Notes",
                table: "UserRecords",
                type: "longtext",
                nullable: true)
                .Annotation("MySql:CharSet", "utf8mb4");

            migrationBuilder.AddColumn<string>(
                name: "Title",
                table: "UserRecords",
                type: "varchar(200)",
                maxLength: 200,
                nullable: false,
                defaultValue: "")
                .Annotation("MySql:CharSet", "utf8mb4");

            migrationBuilder.CreateIndex(
                name: "IX_UserRecords_Title",
                table: "UserRecords",
                column: "Title");
        }
    }
}
