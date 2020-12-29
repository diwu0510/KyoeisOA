using Kyoeis.Data.Common;

namespace Kyoeis.IdentityCenter.Service.Dto.Application
{
    public class ApplicationDto : BaseEntity
    {
        /// <summary>
        /// 编号
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
        /// 备注
        /// </summary>
        public string Remark { get; set; }
    }
}
