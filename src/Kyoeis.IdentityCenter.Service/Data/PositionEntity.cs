using FreeSql.DataAnnotations;
using Kyoeis.Data.Common;
using System;

namespace Kyoeis.IdentityCenter.Service.Data
{
    /// <summary>
    /// 用户职位
    /// </summary>
    [Table(Name = "base_position")]
    public class PositionEntity : BaseAuditEntity
    {
        /// <summary>
        /// 职位名称
        /// </summary>
        public string Name { get; set; }

        /// <summary>
        /// 所属公司
        /// </summary>
        public Guid CompanyId { get; set; }

        /// <summary>
        /// 排序
        /// </summary>
        public int Sort { get; set; }
    }
}
