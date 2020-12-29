using Kyoeis.IdentityCenter.Areas.OAuth2._0.Models;
using Microsoft.AspNetCore.Mvc;
using Microsoft.AspNetCore.Mvc.ModelBinding;
using Microsoft.Extensions.Caching.Distributed;
using System;
using System.Text;
using System.Web;

namespace Kyoeis.IdentityCenter.Areas.OAuth2._0.Controllers
{
    [Area("oauth2.0")]
    public class AuthorizeController : Controller
    {
        private readonly IDistributedCache _cache;

        public AuthorizeController(IDistributedCache cache)
        {
            _cache = cache;
        }

        public IActionResult Index(AuthorizeRequest request)
        {
            var dict = new ModelStateDictionary();

            if (string.IsNullOrWhiteSpace(request.redirect_url))
            {
                dict.AddModelError(nameof(request.redirect_url), "回调地址不能为空");
                return BadRequest(dict);
            }

            if (string.IsNullOrWhiteSpace(request.response_type))
            {
                dict.AddModelError(nameof(request.response_type), "返回类型不能为空");
                return BadRequest(dict);
            }

            if (!request.response_type.Equals("code", StringComparison.OrdinalIgnoreCase))
            {
                dict.AddModelError(nameof(request.response_type), "返回类型无效");
                return BadRequest(dict);
            }

            if (string.IsNullOrWhiteSpace(request.client_id))
            {
                dict.AddModelError(nameof(request.client_id), "client_id不能为空");
                return BadRequest(dict);
            }

            if (string.IsNullOrWhiteSpace(request.state))
            {
                dict.AddModelError(nameof(request.client_id), "状态值不能为空");
                return BadRequest(dict);
            }

            // TODO: 验证 client_id 是否有效
            // TODO: 验证 client_id 和 redirect_url 是否匹配

            //var code = BuildCode();

            //var options = new DistributedCacheEntryOptions
            //{
            //    AbsoluteExpiration = DateTimeOffset.Now.AddMinutes(10)
            //};

            //_cache.Set($"authorize_{code}", Encoding.UTF8.GetBytes(request.client_id), options);

            //var url = $"{HttpUtility.UrlDecode(request.redirect_url)}?code={code}&state={request.state}";

            var model = new LoginRequest
            {
                RedirectUrl = HttpUtility.UrlEncode(request.redirect_url),
                State = request.state
            };

            return View(model);
        }

        /// <summary>
        /// 
        /// </summary>
        /// <param name="request"></param>
        /// <returns></returns>
        [HttpPost]
        [ValidateAntiForgeryToken]
        public IActionResult Index(LoginRequest request)
        {
            var dict = new ModelStateDictionary();

            if (string.IsNullOrWhiteSpace(request.RedirectUrl))
            {
                dict.AddModelError(nameof(request.RedirectUrl), "回调地址无效");
                return BadRequest(dict);
            }

            if (string.IsNullOrWhiteSpace(request.Account) ||
                string.IsNullOrWhiteSpace(request.Password))
            {
                dict.AddModelError(string.Empty, "用户名/密码不能为空");
                return BadRequest(dict);
            }

            // TODO: 验证用户名和密码


            var code = BuildCode();

            var options = new DistributedCacheEntryOptions
            {
                AbsoluteExpiration = DateTimeOffset.Now.AddMinutes(10)
            };

            _cache.Set($"authorize_{code}", Encoding.UTF8.GetBytes(request.Account), options);

            var originUrl = HttpUtility.UrlDecode(request.RedirectUrl);
            
            // 是否带问号
            var hasQuestionMark = false;
            // 是否带查询参数
            var hasQueryString = false;

            if (originUrl.Contains("?"))
            {
                hasQuestionMark = true;

                if (!originUrl.EndsWith("?"))
                {
                    hasQueryString = true;
                }
            }

            var sb = new StringBuilder(originUrl);
            if (!hasQuestionMark)
            {
                sb.Append('?');
            }
            else if (hasQueryString)
            {
                sb.Append('&');
            }

            sb.Append($"code={code}&state={request.State}");

            return Redirect(sb.ToString());
        }

        public IActionResult Token(TokenRequest request)
        {
            var dict = new ModelStateDictionary();

            if (string.IsNullOrWhiteSpace(request.redirect_url))
            {
                dict.AddModelError(nameof(request.redirect_url), "回调地址不能为空");
                return BadRequest(dict);
            }

            if (string.IsNullOrWhiteSpace(request.grant_type))
            {
                dict.AddModelError(nameof(request.grant_type), "授权类型不能为空");
                return BadRequest(dict);
            }

            if (!request.grant_type.Equals("authorization_code", StringComparison.OrdinalIgnoreCase))
            {
                dict.AddModelError(nameof(request.grant_type), "授权类型无效");
                return BadRequest(dict);
            }

            if (string.IsNullOrWhiteSpace(request.client_id))
            {
                dict.AddModelError(nameof(request.client_id), "client_id 不能为空");
                return BadRequest(dict);
            }

            if (string.IsNullOrWhiteSpace(request.client_secret))
            {
                dict.AddModelError(nameof(request.client_secret), "client_secret 不能为空");
                return BadRequest(dict);
            }

            if (string.IsNullOrWhiteSpace(request.code))
            {
                dict.AddModelError(nameof(request.code), "Authorization Code 不能为空");
                return BadRequest(dict);
            }

            var cache = _cache.Get($"authorize_{request.code}");
            if (cache == null)
            {
                dict.AddModelError(nameof(request.code), "Authorization Code 无效");
                return BadRequest(dict);
            }

            var userAccount = Encoding.UTF8.GetString(cache);

            // TODO: 验证 client_id 和 client_secret 是否匹配
            
            // 准备返回
            var accessToken = Guid.NewGuid().ToString();
            var option = new DistributedCacheEntryOptions { AbsoluteExpiration = DateTimeOffset.Now.AddDays(30)};
            
            _cache.Set($"access_token_{accessToken}", Encoding.UTF8.GetBytes(userAccount), option);

            // return Redirect(sb.ToString());
            return Json(new {access_token = accessToken, expires_in = 2592000, app_id = userAccount, request.redirect_url});
        }

        [HttpPost]
        public IActionResult UserInfo([FromBody]UserInfoRequest request)
        {
            var accessToken = request.access_token;
            if (string.IsNullOrWhiteSpace(accessToken))
            {
                return Json(new {Code = 404});
            }

            var bytes = _cache.Get($"access_token_{request.access_token}");
            if (bytes == null)
            {
                return Json(new {Code = 404});
            }

            var account = Encoding.UTF8.GetString(bytes);

            // TODO: 去获取用户

            return Json(new {Name = account, Account = account});
        }

        private static string BuildCode()
        {
            return Guid.NewGuid().ToString("N");
        }
    }
}
