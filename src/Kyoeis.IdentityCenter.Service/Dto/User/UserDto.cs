using Kyoeis.Data.Common;
using System;

namespace Kyoeis.IdentityCenter.Service.Dto.User
{
    public class UserDto : BaseEntity
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
    }
}
