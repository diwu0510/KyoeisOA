using System.Collections.Generic;

namespace Kyoeis.Core
{
    /// <summary>
    /// 分页列表
    /// </summary>
    public class PaginationList<T>
    {
        /// <summary>
        /// 数据总数量
        /// </summary>
        public long Total { get; set; }

        /// <summary>
        /// 当前页
        /// </summary>
        public int PageIndex { get; set; }

        /// <summary>
        /// 每页显示数量
        /// </summary>
        public int PageSize { get; set; }

        /// <summary>
        /// 数据列表
        /// </summary>
        public IEnumerable<T> Data { get; set; }
    }
}
