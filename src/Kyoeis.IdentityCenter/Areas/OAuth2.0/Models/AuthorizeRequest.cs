// ReSharper disable InconsistentNaming
namespace Kyoeis.IdentityCenter.Areas.OAuth2._0.Models
{
    public class AuthorizeRequest
    {
        /// <summary>
        /// 返回类型，固定为 "code"
        /// </summary>
        public string response_type { get; set; }

        /// <summary>
        /// 客户端注册的ID
        /// </summary>
        public string client_id { get; set; }

        /// <summary>
        /// 成功授权后的回调地址，注意要将url进行UrlEncode
        /// </summary>
        public string redirect_url { get; set; }

        /// <summary>
        /// 客户端的状态值，成功授权后会原样返回，
        /// 客户端需要验证state参数以保证和请求时是否一致
        /// </summary>
        public string state { get; set; }

        /// <summary>
        /// 要进行授权的列表
        /// </summary>
        public string scope { get; set; }
    }
}
