// ReSharper disable InconsistentNaming

namespace Kyoeis.IdentityCenter.Areas.OAuth2._0.Models
{
    public class TokenRequest
    {
        /// <summary>
        /// 授权类型，必须固定为 "authorization_code"
        /// </summary>
        public string grant_type { get; set; }

        /// <summary>
        /// 注册后分配的客户端ID
        /// </summary>
        public string client_id { get; set; }

        /// <summary>
        /// 注册后分配的客户端密钥
        /// </summary>
        public string client_secret { get; set; }

        /// <summary>
        /// 上一步生成的Code
        /// </summary>
        public string code { get; set; }

        /// <summary>
        /// 回调地址
        /// </summary>
        public string redirect_url { get; set; }
    }
}
