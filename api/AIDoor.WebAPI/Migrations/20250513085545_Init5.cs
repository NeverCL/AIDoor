using System;
using Microsoft.EntityFrameworkCore.Migrations;

#nullable disable

namespace AIDoor.WebAPI.Migrations
{
    /// <inheritdoc />
    public partial class Init5 : Migration
    {
        /// <inheritdoc />
        protected override void Up(MigrationBuilder migrationBuilder)
        {
            migrationBuilder.DropIndex(
                name: "IX_Banners_DisplayOrder",
                table: "Banners");

            migrationBuilder.DropIndex(
                name: "IX_Banners_IsEnabled",
                table: "Banners");

            migrationBuilder.DropColumn(
                name: "ClickCount",
                table: "Banners");

            migrationBuilder.DropColumn(
                name: "Description",
                table: "Banners");

            migrationBuilder.DropColumn(
                name: "DisplayOrder",
                table: "Banners");

            migrationBuilder.DropColumn(
                name: "EndDate",
                table: "Banners");

            migrationBuilder.DropColumn(
                name: "IsEnabled",
                table: "Banners");

            migrationBuilder.DropColumn(
                name: "QrCodeViewCount",
                table: "Banners");

            migrationBuilder.DropColumn(
                name: "RedirectUrl",
                table: "Banners");

            migrationBuilder.DropColumn(
                name: "StartDate",
                table: "Banners");
        }

        /// <inheritdoc />
        protected override void Down(MigrationBuilder migrationBuilder)
        {
            migrationBuilder.AddColumn<int>(
                name: "ClickCount",
                table: "Banners",
                type: "int",
                nullable: false,
                defaultValue: 0);

            migrationBuilder.AddColumn<string>(
                name: "Description",
                table: "Banners",
                type: "varchar(500)",
                maxLength: 500,
                nullable: true)
                .Annotation("MySql:CharSet", "utf8mb4");

            migrationBuilder.AddColumn<int>(
                name: "DisplayOrder",
                table: "Banners",
                type: "int",
                nullable: false,
                defaultValue: 0);

            migrationBuilder.AddColumn<DateTime>(
                name: "EndDate",
                table: "Banners",
                type: "datetime(6)",
                nullable: true);

            migrationBuilder.AddColumn<bool>(
                name: "IsEnabled",
                table: "Banners",
                type: "tinyint(1)",
                nullable: false,
                defaultValue: false);

            migrationBuilder.AddColumn<int>(
                name: "QrCodeViewCount",
                table: "Banners",
                type: "int",
                nullable: false,
                defaultValue: 0);

            migrationBuilder.AddColumn<string>(
                name: "RedirectUrl",
                table: "Banners",
                type: "varchar(255)",
                maxLength: 255,
                nullable: true)
                .Annotation("MySql:CharSet", "utf8mb4");

            migrationBuilder.AddColumn<DateTime>(
                name: "StartDate",
                table: "Banners",
                type: "datetime(6)",
                nullable: true);

            migrationBuilder.CreateIndex(
                name: "IX_Banners_DisplayOrder",
                table: "Banners",
                column: "DisplayOrder");

            migrationBuilder.CreateIndex(
                name: "IX_Banners_IsEnabled",
                table: "Banners",
                column: "IsEnabled");
        }
    }
}
