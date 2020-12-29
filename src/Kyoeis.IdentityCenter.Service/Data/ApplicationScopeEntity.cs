using FreeSql.DataAnnotations;
using System;

namespace Kyoeis.IdentityCenter.Service.Data
{
    [Table(Name = "base_application_scope")]
    public class ApplicationScopeEntity
    {
        /// <summary>
        /// 应用ID
        /// </summary>
        public Guid ApplicationId { get; set; }

        /// <summary>
        /// 作用域ID
        /// </summary>
        public Guid ScopeId { get; set; }

        /// <summary>
        /// 应用
        /// </summary>
        public virtual ApplicationEntity Application { get; set; }

        /// <summary>
        /// 作用域
        /// </summary>
        public virtual ScopeEntity Scope { get; set; }
    }
}
