using System;

namespace Kyoeis.Data.Common
{
    /// <summary>
    /// 更新审计
    /// </summary>
    public interface IUpdateAudit
    {
        /// <summary>
        /// 更新时间
        /// </summary>
        DateTime UpdateTime { get; set; }

        /// <summary>
        /// 更新人姓名
        /// </summary>
        string Updater { get; set; }

        /// <summary>
        /// 更新人ID
        /// </summary>
        Guid UpdateBy { get; set; }
    }
}
