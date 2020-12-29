using System;

namespace Kyoeis.Data.Common
{
    /// <summary>
    /// 创建审计
    /// </summary>
    public interface ICreateAudit
    {
        /// <summary>
        /// 创建时间
        /// </summary>
        DateTime CreateTime { get; set; }

        /// <summary>
        /// 创建人姓名
        /// </summary>
        string Creator { get; set; }

        /// <summary>
        /// 创建人ID
        /// </summary>
        Guid CreateBy { get; set; }
    }
}
