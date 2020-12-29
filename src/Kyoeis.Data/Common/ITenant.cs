using System;

namespace Kyoeis.Data.Common
{
    /// <summary>
    /// 带租户信息的实体
    /// </summary>
    public interface ITenant
    {
        /// <summary>
        /// 公司ID
        /// </summary>
        Guid CompanyId { get; set; }

        /// <summary>
        /// 部门ID
        /// </summary>
        Guid DepartmentId { get; set; }

        /// <summary>
        /// 处理人ID
        /// </summary>
        Guid HandlerId { get; set; }
    }
}
