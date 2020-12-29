using System;
using FreeSql.DataAnnotations;

namespace Kyoeis.Data.Common
{
    /// <summary>
    /// 带增改审计的实体
    /// </summary>
    public class BaseAuditEntity : BaseEntity, ISoftDeleted, ICreateAudit, IUpdateAudit
    {
        /// <summary>
        /// 是否删除
        /// </summary>
        [Column(CanUpdate = false)]
        public bool IsDeleted { get; set; }

        /// <summary>
        /// 创建时间
        /// </summary>
        [Column(CanUpdate = false)]
        public DateTime CreateTime { get; set; } = DateTime.Now;

        /// <summary>
        /// 创建人姓名
        /// </summary>
        [Column(CanUpdate = false)]
        public string Creator { get; set; }

        /// <summary>
        /// 创建人ID
        /// </summary>
        [Column(CanUpdate = false)]
        public Guid CreateBy { get; set; }

        /// <summary>
        /// 更新时间
        /// </summary>
        public DateTime UpdateTime { get; set; } = DateTime.Now;

        /// <summary>
        /// 更新人姓名
        /// </summary>
        public string Updater { get; set; }

        /// <summary>
        /// 更新人ID
        /// </summary>
        public Guid UpdateBy { get; set; }
    }
}
