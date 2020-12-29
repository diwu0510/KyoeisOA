using FreeSql.DataAnnotations;
using Kyoeis.Data.Common;

namespace Kyoeis.IdentityCenter.Service.Data
{
    /// <summary>
    /// 作用域实体
    /// </summary>
    [Table(Name = "base_scope")]
    public class ScopeEntity : BaseAuditEntity
    {
        /// <summary>
        /// 作用域标识
        /// </summary>
        public string Code { get; set; }

        /// <summary>
        /// 作用域名称
        /// </summary>
        public string Name { get; set; }

        /// <summary>
        /// 备注
        /// </summary>
        public string Remark { get; set; }
    }
}
