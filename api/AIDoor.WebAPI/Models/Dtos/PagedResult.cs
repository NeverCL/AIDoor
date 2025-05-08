namespace AIDoor.WebAPI.Models.Dtos
{
    /// <summary>
    /// 分页结果
    /// </summary>
    /// <typeparam name="T">结果类型</typeparam>
    public class PagedResult<T>
    {
        /// <summary>
        /// 数据
        /// </summary>
        public IEnumerable<T> Data { get; set; } = Enumerable.Empty<T>();

        /// <summary>
        /// 总数
        /// </summary>
        public int Total { get; set; }

        /// <summary>
        /// 当前页码
        /// </summary>
        public int Page { get; set; }

        /// <summary>
        /// 每页条数
        /// </summary>
        public int Limit { get; set; }

        /// <summary>
        /// 总页数
        /// </summary>
        public int TotalPages => Limit > 0 ? (int)Math.Ceiling(Total / (double)Limit) : 0;
    }
}