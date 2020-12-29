using FreeSql.DataAnnotations;
using Kyoeis.Data.Common;
using System;

namespace Kyoeis.IdentityCenter.Service.Data
{
    /// <summary>
    /// 用户实体
    /// </summary>
    [Table(Name = "base_user")]
    public class UserEntity : BaseAuditEntity
    {
        /// <summary>
        /// 用户标识
        /// </summary>
        public string Code { get; set; }

        /// <summary>
        /// 中文名字
        /// </summary>
        public string ChineseName { get; set; }

        /// <summary>
        /// 英文名字
        /// </summary>
        public string EnglishName { get; set; }

        /// <summary>
        /// 密码
        /// </summary>
        public string Password { get; set; }

        /// <summary>
        /// 密码加盐
        /// </summary>
        public string Salt { get; set; }

        /// <summary>
        /// 所属部门ID
        /// </summary>
        public Guid DepartmentId { get; set; }

        /// <summary>
        /// 手机号码
        /// </summary>
        public string Mobile { get; set; }

        /// <summary>
        /// 电子邮件
        /// </summary>
        public string Email { get; set; }

        /// <summary>
        /// 地址
        /// </summary>
        public string Address { get; set; }

        /// <summary>
        /// 是否在职
        /// </summary>
        public bool IsOnJob { get; set; }

        /// <summary>
        /// 职位ID
        /// </summary>
        public Guid PositionId { get; set; }

        /// <summary>
        /// 所属部门
        /// </summary>
        public virtual DepartmentEntity Department { get; set; }

        /// <summary>
        /// 所处职位
        /// </summary>
        public virtual PositionEntity Position { get; set; }
    }
}
