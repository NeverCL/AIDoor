using Microsoft.EntityFrameworkCore.Migrations;

#nullable disable

namespace AIDoor.WebAPI.Migrations
{
    /// <inheritdoc />
    public partial class UpdateUserContentImagesType : Migration
    {
        /// <inheritdoc />
        protected override void Up(MigrationBuilder migrationBuilder)
        {
            // 更改 Images 列类型为 JSON
            migrationBuilder.AlterColumn<string>(
                name: "Images",
                table: "UserContents",
                type: "json",
                nullable: false,
                oldClrType: typeof(string),
                oldType: "longtext");
        }

        /// <inheritdoc />
        protected override void Down(MigrationBuilder migrationBuilder)
        {
            // 恢复 Images 列类型
            migrationBuilder.AlterColumn<string>(
                name: "Images",
                table: "UserContents",
                type: "longtext",
                nullable: false,
                oldClrType: typeof(string),
                oldType: "json");
        }
    }
}