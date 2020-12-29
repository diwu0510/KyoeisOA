namespace Kyoeis.IdentityCenter.Areas.OAuth2._0.Models
{
    public class LoginRequest
    {
        /// <summary>
        /// 账号
        /// </summary>
        public string Account { get; set; }

        /// <summary>
        /// 密码
        /// </summary>
        public string Password { get; set; }

        /// <summary>
        /// 回调地址
        /// </summary>
        public string RedirectUrl { get; set; }

        /// <summary>
        /// 状态值
        /// </summary>
        public string State { get; set; }
    }
}
