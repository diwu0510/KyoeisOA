using Microsoft.AspNetCore.Mvc;
using System.Net.Http;
using System.Text;
using System.Text.Json;
using System.Threading.Tasks;
using System.Web;
// ReSharper disable InconsistentNaming

namespace Kyoeis.WebSite.Controllers
{
    public class OAuthController : Controller
    {
        private readonly IHttpClientFactory _clientFactory;

        public OAuthController(IHttpClientFactory clientFactory)
        {
            _clientFactory = clientFactory;
        }

        public IActionResult Index()
        {
            var url =
                $"http://localhost:5000/oauth2.0/authorize?client_id=x&state=1&response_type=code&redirect_url={HttpUtility.UrlEncode("http://localhost:5002/oauth/signIn/#/abc")}";
            return Redirect(url);
        }

        public async Task<IActionResult> SignIn(string code, string state)
        {
            var client = _clientFactory.CreateClient("OAuth");
            var content = await client.GetAsync(
                $"http://localhost:5000/oauth2.0/authorize/token?code={code}&client_id=aa&client_secret=bb&&grant_type=authorization_code&&redirect_url=aaa");

            var str = await content.Content.ReadAsStringAsync();

            var response =
                JsonSerializer.Deserialize<OAuthAccessTokenResponse>(str);
            
            var content2 = await client.PostAsync("http://localhost:5000/oauth2.0/authorize/userInfo",
                new StringContent(JsonSerializer.Serialize(new {response.access_token}), Encoding.UTF8, "application/json"));

            return Content(await content2.Content.ReadAsStringAsync());
        }
    }

    public class OAuthAccessTokenResponse
    {
        public int expires_in { get; set; }

        public string access_token { get; set; }

        public string open_id { get; set; }
    }
}
