using System.Security.Cryptography;
using System.Text;

namespace Kyoeis.Utility.Hash
{
    public class Md5Util
    {
        public static string Encrypt(string input)
        {
            var md5 = MD5.Create();
            var bytes = md5.ComputeHash(Encoding.UTF8.GetBytes(input));
            var sb = new StringBuilder();
            foreach (var t in bytes)
            {
                sb.Append(t.ToString("x2"));
            }

            return sb.ToString();
        }
    }
}
