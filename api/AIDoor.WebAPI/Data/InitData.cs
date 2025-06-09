using AIDoor.WebAPI.Domain;
using AIDoor.WebAPI.Models;
using Microsoft.EntityFrameworkCore;
using System;
using System.Security.Cryptography;
using System.Text;

namespace AIDoor.WebAPI.Data;

public class InitData
{
    public void Seed(AppDbContext context)
    {
        if (!context.ApplicationCategories.Any())
        {
            SeedCategories(context);
        }

        if (!context.Applications.Any())
        {
            SeedApplications(context);
        }

        if (!context.Users.Any())
        {
            SeedUsers(context);
        }

        if (!context.Accounts.Any())
        {
            SeedAccounts(context);
        }

        if (!context.Banners.Any())
        {
            SeedBanners(context);
        }

        context.SaveChanges();
    }

    private void SeedCategories(AppDbContext context)
    {
        var categories = new List<AppCategory>
        {
            new AppCategory
            {
                Id = 1,
                Name = "大模型",
                DisplayOrder = 1,
                IsActive = true,
                CreatedAt = DateTime.Now
            },
            new AppCategory
            {
                Id = 2,
                Name = "小模型",
                DisplayOrder = 2,
                IsActive = true,
                CreatedAt = DateTime.Now
            },
            new AppCategory
            {
                Id = 3,
                Name = "插件",
                DisplayOrder = 3,
                IsActive = true,
                CreatedAt = DateTime.Now
            },
            new AppCategory
            {
                Id = 4,
                Name = "工具",
                DisplayOrder = 4,
                IsActive = true,
                CreatedAt = DateTime.Now
            }
        };

        context.ApplicationCategories.AddRange(categories);
    }

    private void SeedApplications(AppDbContext context)
    {
        var applications = new List<AppItem>
        {
            new AppItem
            {
                Id = 1,
                Title = "大模型应用1",
                Description = "这是大模型应用1的简介",
                Content = "大模型应用1是一种基于人工智能的先进应用程序，它利用大规模语言模型技术为用户提供智能对话和内容生成服务。\n\n该应用采用了最新的深度学习算法，能够理解复杂的语言指令，生成高质量的文本内容，并根据用户的需求提供定制化的服务。它不仅可以用于日常对话，还可以辅助写作、编程、教育等多种场景。\n\n大模型应用1的特点包括：强大的语言理解能力、丰富的知识储备、灵活的交互方式等。无论是个人用户还是企业客户，都能从中获得实用的帮助和独特的价值。",
                ImageUrl = "https://img1.baidu.com/it/u=990091063,3716780155&fm=253&fmt=auto&app=120&f=JPEG?w=655&h=1418",
                Link = "https://chat.openai.com",
                DisplayOrder = 1,
                IsActive = true,
                CategoryId = 1,
                CreatedAt = DateTime.Now
            },
            new AppItem
            {
                Id = 2,
                Title = "小模型应用1",
                Description = "这是小模型应用1的简介",
                Content = "小模型应用1是一款轻量级的人工智能应用，专为移动设备和低算力环境设计。虽然模型规模较小，但它在特定领域内具有出色的性能和效率。\n\n这款应用通过优化的算法和精简的模型结构，实现了在有限资源下的智能功能。它可以在没有网络连接的情况下运行，保护用户隐私的同时提供实时响应。\n\n小模型应用1特别适合需要快速处理和即时反馈的场景，如文本分类、情感分析、简单问答等。它以低能耗、高效率、强隐私为核心优势，为用户带来便捷而实用的AI体验。",
                ImageUrl = "https://img1.baidu.com/it/u=990091063,3716780155&fm=253&fmt=auto&app=120&f=JPEG?w=655&h=1418",
                Link = "https://yiyan.baidu.com",
                DisplayOrder = 1,
                IsActive = true,
                CategoryId = 2,
                CreatedAt = DateTime.Now
            },
            new AppItem
            {
                Id = 3,
                Title = "插件1",
                Description = "这是插件1的简介",
                Content = "插件1是一款功能强大的扩展工具，专为增强主应用的功能而设计。作为模块化架构的一部分，它可以无缝集成到现有系统中，为用户提供额外的功能和服务。\n\n该插件采用了先进的接口设计和标准化的数据交换协议，确保与主应用之间的高效通信和协作。用户可以根据自己的需求选择安装或卸载插件，实现个性化的使用体验。\n\n插件1的主要功能包括：数据分析增强、自动化工作流、专业领域支持等。通过这些功能，用户可以显著提高工作效率，扩展应用的使用场景，获得更丰富的功能体验。",
                ImageUrl = "https://img1.baidu.com/it/u=990091063,3716780155&fm=253&fmt=auto&app=120&f=JPEG?w=655&h=1418",
                Link = "https://github.com/features/copilot",
                DisplayOrder = 1,
                IsActive = true,
                CategoryId = 3,
                CreatedAt = DateTime.Now
            },
            new AppItem
            {
                Id = 4,
                Title = "工具1",
                Description = "这是工具1的简介",
                Content = "工具1是一款专业的AI辅助工具，旨在简化复杂任务和提高工作效率。它结合了用户友好的界面和强大的功能，适合各种技术水平的用户使用。\n\n这款工具提供了丰富的功能模块，包括数据处理、内容转换、智能分析等。通过直观的操作流程和清晰的结果展示，用户可以轻松完成以往需要专业知识的任务。\n\n工具1的设计理念是\"专业功能，简单使用\"。它隐藏了复杂的技术细节，为用户提供了一套易于理解和操作的工具集。无论是日常工作还是专业项目，工具1都能提供有力的支持和帮助。",
                ImageUrl = "https://img1.baidu.com/it/u=990091063,3716780155&fm=253&fmt=auto&app=120&f=JPEG?w=655&h=1418",
                Link = "https://www.midjourney.com",
                DisplayOrder = 1,
                IsActive = true,
                CategoryId = 4,
                CreatedAt = DateTime.Now
            }
        };

        context.Applications.AddRange(applications);
    }

    private void SeedUsers(AppDbContext context)
    {
        var users = new List<User>
        {
            new User
            {
                Id = 1,
                Username = "测试用户",
                PhoneNumber = "13800138000",
                // PasswordHash = "jGl25bVBBBW96Qi9Te4V37Fnqchz/Eu4qB9vKrRIqRg=", // 123456的SHA-256哈希
                IsActive = true,
                CreatedAt = DateTime.Now
            }
        };

        context.Users.AddRange(users);
    }

    private void SeedAccounts(AppDbContext context)
    {
        var accounts = new List<Account>
        {
            new Account
            {
                Id = 1,
                Username = "admin",
                PasswordHash = ComputeSha256Hash("11111122"),
                IsAdmin = true,
                IsActive = true,
                CreatedAt = DateTime.Now
            }
        };

        context.Accounts.AddRange(accounts);
    }

    private string ComputeSha256Hash(string rawData)
    {
        using (SHA256 sha256Hash = SHA256.Create())
        {
            byte[] bytes = sha256Hash.ComputeHash(Encoding.UTF8.GetBytes(rawData));

            StringBuilder builder = new StringBuilder();
            for (int i = 0; i < bytes.Length; i++)
            {
                builder.Append(bytes[i].ToString("x2"));
            }
            return builder.ToString();
        }
    }

    private void SeedUserRecords(AppDbContext context)
    {
        var records = new List<UserRecord>
        {
            new UserRecord
            {
                Id = 1,
                RecordType = RecordType.Like,
                UserId = 1,
                TargetUserId = 2,
                ContentId = 1,
                ViewCount = 1,
                IsActive = true,
                CreatedAt = DateTime.Now
            },
            new UserRecord
            {
                Id = 2,
                RecordType = RecordType.Like,
                UserId = 1,
                TargetUserId = 3,
                ContentId = 2,
                ViewCount = 1,
                IsActive = true,
                CreatedAt = DateTime.Now
            },
            // 添加用户记录数据 - 收藏
            new UserRecord
            {
                Id = 3,
                RecordType = RecordType.Favorite,
                UserId = 1,
                TargetUserId = 2,
                ContentId = 1,
                ViewCount = 1,
                IsActive = true,
                CreatedAt = DateTime.Now
            },
            new UserRecord
            {
                Id = 4,
                RecordType = RecordType.Favorite,
                UserId = 1,
                TargetUserId = 3,
                ContentId = 2,
                ViewCount = 1,
                IsActive = true,
                CreatedAt = DateTime.Now
            },
            // 添加用户记录数据 - 足迹
            new UserRecord
            {
                Id = 5,
                RecordType = RecordType.ContentFootprint,
                UserId = 1,
                ContentId = 1,
                LastViewedAt = DateTime.Now,
                ViewCount = 5,
                IsActive = true,
                CreatedAt = DateTime.Now
            },
            new UserRecord
            {
                Id = 6,
                RecordType = RecordType.ContentFootprint,
                UserId = 1,
                ContentId = 2,
                LastViewedAt = DateTime.Now,
                ViewCount = 3,
                IsActive = true,
                CreatedAt = DateTime.Now
            },
            new UserRecord
            {
                Id = 7,
                RecordType = RecordType.ContentFootprint,
                UserId = 1,
                ContentId = 3,
                LastViewedAt = DateTime.Now,
                ViewCount = 2,
                IsActive = true,
                CreatedAt = DateTime.Now
            },
            new UserRecord
            {
                Id = 8,
                RecordType = RecordType.AppFootprint,
                UserId = 1,
                AppId = 1,
                LastViewedAt = DateTime.Now,
                ViewCount = 10,
                IsActive = true,
                CreatedAt = DateTime.Now
            },
            new UserRecord
            {
                Id = 9,
                RecordType = RecordType.AppFootprint,
                UserId = 1,
                AppId = 2,
                LastViewedAt = DateTime.Now,
                ViewCount = 7,
                IsActive = true,
                CreatedAt = DateTime.Now
            },
            new UserRecord
            {
                Id = 10,
                RecordType = RecordType.AppFootprint,
                UserId = 1,
                AppId = 3,
                LastViewedAt = DateTime.Now,
                ViewCount = 4,
                IsActive = true,
                CreatedAt = DateTime.Now
            }
        };

        context.UserRecords.AddRange(records);
    }

    private void SeedBanners(AppDbContext context)
    {
        var banners = new List<Banner>
        {
            new Banner
            {
                Id = 1,
                Title = "扫描二维码加入我们的开发者社群",
                BannerImageUrl = "https://img1.baidu.com/it/u=990091063,3716780155&fm=253&fmt=auto&app=120&f=JPEG?w=655&h=1418",
                QrCodeImageUrl = "https://img1.baidu.com/it/u=990091063,3716780155&fm=253&fmt=auto&app=120&f=JPEG?w=655&h=1418",
                CreatedAt = DateTime.Now
            }
        };

        context.Banners.AddRange(banners);
    }
}