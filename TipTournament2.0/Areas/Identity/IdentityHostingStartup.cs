using Microsoft.AspNetCore.Hosting;


[assembly: HostingStartup(typeof(TipTournament2._0.Areas.Identity.IdentityHostingStartup))]
namespace TipTournament2._0.Areas.Identity
{
    public class IdentityHostingStartup : IHostingStartup
    {
        public void Configure(IWebHostBuilder builder)
        {
            builder.ConfigureServices((context, services) => {
            });
        }
    }
}