using System;
using System.Linq;
using AutoMapper;
using FreeSql;
using Kyoeis.Data;
using Kyoeis.Data.Common;
using Kyoeis.IdentityCenter.Service;
using Microsoft.AspNetCore.Builder;
using Microsoft.AspNetCore.Hosting;
using Microsoft.Extensions.Configuration;
using Microsoft.Extensions.DependencyInjection;
using Microsoft.Extensions.Hosting;
using Serilog;

namespace Kyoeis.IdentityCenter
{
    public class Startup
    {
        public Startup(IConfiguration configuration)
        {
            Configuration = configuration;
        }

        public IConfiguration Configuration { get; }

        public void ConfigureServices(IServiceCollection services)
        {
            // 添加分布式缓存
            services.AddDistributedMemoryCache();

            services.AddAutoMapper(options =>
            {
                options.AddProfile<IdentityCenterServiceProfile>();
            });

            // 添加 Service
            services.AddIdentityCenterService();

            // 添加 FreeSql
            FreeSqlManager.Add(
                DataType.MySql,
                Configuration.GetConnectionString("DefaultConnectionString"),
                options =>
                {
                    options.AutoSyncStructure = true;
                    options.MonitorBeforeExecute += command =>
                    {
                        Console.WriteLine(command.CommandText);
                    };
                    options.GlobalFilterConfigure = filter =>
                    {
                        filter.Apply<ISoftDeleted>("SoftDelete", x => !x.IsDeleted);
                    };
                }
            );

            services.AddControllersWithViews();
        }

        public void Configure(IApplicationBuilder app, IWebHostEnvironment env)
        {
            if (env.IsDevelopment())
            {
                app.UseDeveloperExceptionPage();
            }
            else
            {
                app.UseExceptionHandler("/Home/Error");
                app.UseHsts();
            }

            app.UseSerilogRequestLogging();

            // app.UseHttpsRedirection();

            app.UseStaticFiles();

            app.UseRouting();

            app.UseAuthentication();

            app.UseAuthorization();

            app.UseEndpoints(endpoints =>
            {
                endpoints.MapControllerRoute(
                    name: "areas",
                    pattern: "{area:exists}/{controller=Home}/{action=Index}/{id?}"
                );

                endpoints.MapControllerRoute(
                    name: "default",
                    pattern: "{controller=Home}/{action=Index}/{id?}");
            });
        }
    }
}
