namespace AIDoor.WebAPI.Models.Enums;

/// <summary>
/// 申请状态枚举
/// </summary>
public enum ApplicationStatus
{
    /// <summary>
    /// 待审核
    /// </summary>
    Pending = 0,

    /// <summary>
    /// 已批准
    /// </summary>
    Approved = 1,

    /// <summary>
    /// 已拒绝
    /// </summary>
    Rejected = 2,

    /// <summary>
    /// 已撤销
    /// </summary>
    Withdrawn = 3
}