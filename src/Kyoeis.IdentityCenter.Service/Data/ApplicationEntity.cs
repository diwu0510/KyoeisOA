using FreeSql.DataAnnotations;
using Kyoeis.Data.Common;
using System.Collections.Generic;

namespace Kyoeis.IdentityCenter.Service.Data
{
    /// <summary>
    /// 接入的应用实体
    /// </summary>
    [Table(Name = "base_application")]
    public class ApplicationEntity : BaseAuditEntity
    {
        /// <summary>
        /// 客户端标识
        /// </summary>
        public string Code { get; set; }

        /// <summary>
        /// 应用名称
        /// </summary>
        public string Name { get; set; }

        /// <summary>
        /// client_id
        /// </summary>
        public string ClientId { get; set; }

        /// <summary>
        /// client_secret
        /// </summary>
        public string ClientSecret { get; set; }

        /// <summary>
        /// 是否可用
        /// </summary>
        public bool IsEnabled { get; set; }

        /// <summary>
        /// 作用域
        /// </summary>
        public string Scopes { get; set; }

        /// <summary>
        /// 备注
        /// </summary>
        public string Remark { get; set; }

        /// <summary>
        /// 与作用域的映射
        /// </summary>
        public virtual List<ApplicationScopeEntity> ApplicationScopes { get; set; }
    }
}
