using System;

namespace Kyoeis.Data.Common
{
    /// <summary>
    /// 带增删改审计的实体
    /// </summary>
    public class BaseFullAuditEntity : BaseAuditEntity, IDeleteAudit
    {
        /// <summary>
        /// 删除时间
        /// </summary>
        public DateTime? DeleteTime { get; set; }

        /// <summary>
        /// 删除人姓名
        /// </summary>
        public string Deleter { get; set; }

        /// <summary>
        /// 删除人ID
        /// </summary>
        public Guid? DeleteBy { get; set; }
    }
}
