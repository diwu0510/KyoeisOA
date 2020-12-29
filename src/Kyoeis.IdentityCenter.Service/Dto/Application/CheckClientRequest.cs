// ReSharper disable InconsistentNaming

namespace Kyoeis.IdentityCenter.Service.Dto.Application
{
    public class CheckClientRequest
    {
        /// <summary>
        /// 客户端ID
        /// </summary>
        public string client_id { get; set; }

        /// <summary>
        /// 客户端密钥
        /// </summary>
        public string client_secret { get; set; }

        /// <summary>
        /// 作用域
        /// </summary>
        public string scopes { get; set; }
    }
}
