using System;

namespace Kyoeis.IdentityCenter.Service.Dto.Department
{
    public class DepartmentDto
    {
        public Guid Id { get; set; }

        /// <summary>
        /// 部门标识
        /// </summary>
        public string Code { get; set; }

        /// <summary>
        /// 部门名称
        /// </summary>
        public string Name { get; set; }

        /// <summary>
        /// 所属公司
        /// </summary>
        public Guid CompanyId { get; set; }

        /// <summary>
        /// 上级ID
        /// </summary>
        public Guid? ParentId { get; set; }

        /// <summary>
        /// 直接负责人ID
        /// </summary>
        public Guid? DirectLeaderId { get; set; }

        /// <summary>
        /// 部门负责人
        /// </summary>
        public Guid? ManagerId { get; set; }

    }
}
