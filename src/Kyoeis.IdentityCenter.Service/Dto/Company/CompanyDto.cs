using Kyoeis.Data.Common;

namespace Kyoeis.IdentityCenter.Service.Dto.Company
{
    public class CompanyDto : BaseEntity
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
    }
}
