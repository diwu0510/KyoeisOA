using Kyoeis.IdentityCenter.Service.Cache;
using Microsoft.Extensions.DependencyInjection;
using System.Linq;

namespace Kyoeis.IdentityCenter.Service
{
    public static class IdentityCenterServiceDependencyInjectionExtensions
    {
        public static void AddIdentityCenterService(this IServiceCollection services)
        {
            var assembly = typeof(ServiceModule).Assembly;
            var types = assembly.GetTypes().Where(x => x.Name.EndsWith("Service") && x.Namespace != "BaseService").ToList();

            foreach (var type in types)
            {
                services.AddTransient(type);
            }

            services.AddSingleton<CacheManager>();
        }
    }
}
