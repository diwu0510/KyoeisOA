using FreeSql.DataAnnotations;
using Kyoeis.Data.Common;
using System.Collections.Generic;

namespace Kyoeis.IdentityCenter.Service.Data
{
    /// <summary>
    /// 公司实体
    /// </summary>
    [Table(Name = "base_company")]
    public class CompanyEntity : BaseAuditEntity
    {
        /// <summary>
        /// 公司标识
        /// </summary>
        public string Code { get; set; }
        
        /// <summary>
        /// 公司名称
        /// </summary>
        public string Name { get; set; }
        
        /// <summary>
        /// 地址
        /// </summary>
        public string Address { get; set; }

        /// <summary>
        /// 备注
        /// </summary>
        public string Remark { get; set; }

        /// <summary>
        /// 下属部门
        /// </summary>
        public List<DepartmentEntity> Departments { get; set; }
    }
}
