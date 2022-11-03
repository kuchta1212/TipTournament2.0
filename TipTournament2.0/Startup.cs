namespace TipTournament2._0
{
    using Microsoft.AspNetCore.Authentication;
    using Microsoft.AspNetCore.Builder;
    using Microsoft.AspNetCore.Hosting;
    using Microsoft.AspNetCore.HttpsPolicy;
    using Microsoft.AspNetCore.Identity;
    using Microsoft.AspNetCore.Identity.UI;
    using Microsoft.AspNetCore.SpaServices.ReactDevelopmentServer;
    using Microsoft.EntityFrameworkCore;
    using Microsoft.Extensions.Configuration;
    using Microsoft.Extensions.DependencyInjection;
    using Microsoft.Extensions.Hosting;
    using Newtonsoft.Json;
    using Quartz;
    using System;
    using System.Collections.Generic;
    using TipTournament2._0.Calculator;
    using TipTournament2._0.Coordinator;
    using TipTournament2._0.Data;
    using TipTournament2._0.Jobs;
    using TipTournament2._0.MatchClient;
    using TipTournament2._0.Models;
    using TipTournament2._0.Utils;

    public class Startup
    {
        public Startup(IConfiguration configuration)
        {
            Configuration = configuration;
        }

        public IConfiguration Configuration { get; }

        // This method gets called by the runtime. Use this method to add services to the container.
        public void ConfigureServices(IServiceCollection services)
        {
            services.AddDbContext<ApplicationDbContext>(options =>
                options.UseSqlServer(
                    Configuration.GetConnectionString("DefaultConnection")));

            services.AddDefaultIdentity<ApplicationUser>(options => options.SignIn.RequireConfirmedAccount = false)
                .AddRoles<IdentityRole>()
                .AddEntityFrameworkStores<ApplicationDbContext>();

            services.AddIdentityServer()
                .AddApiAuthorization<ApplicationUser, ApplicationDbContext>()
                .AddProfileService<ProfileService>();

            services.AddAuthentication()
                .AddIdentityServerJwt();

            services.Configure<DeltaStageOptions>(opt =>
            {
                opt.FirstRound = Configuration.GetSection("DeltaStage:FirstRound").Get<FirstRoundOptions[]>();
                opt.NextRounds = Configuration.GetSection("DeltaStage:Next").Get<NextRoundOptions[]>();
            });

            services.Configure<OmikronStageOptions>(opt =>
            {
                opt.TeamIds = Configuration.GetSection("OmikronStage:TeamIds").Get<string[]>();
            });

            services.AddControllersWithViews();
            services.AddRazorPages();

            // In production, the React files will be served from this directory
            services.AddSpaStaticFiles(configuration =>
            {
                configuration.RootPath = "ClientApp/build";
            });

            //var jobKey = new JobKey("check-results-job-key");
            //services.AddTransient<CheckForResultsJob>();
            //services.AddQuartz(q =>
            //{
            //    q.SchedulerId = "Scheduler-Core";
            //    q.SchedulerName = "Scheduler-Core";
            //    q.UseMicrosoftDependencyInjectionScopedJobFactory();

            //    q.AddJob<CheckForResultsJob>(j => j
            //        .WithIdentity(jobKey)
            //    );

            //    q.AddTrigger(t => t
            //        .WithIdentity("Cron Trigger")
            //        .ForJob(jobKey)
            //        .StartNow()
            //        .WithCronSchedule("0 05 15,18,21 13-23 JUN ? 2021")
            //        .WithDescription("check-results-job-key")
            //    );
            //});

            //services.AddQuartzServer(options =>
            //{
            //    // when shutting down we want jobs to complete gracefully
            //    options.WaitForJobsToComplete = true;
            //});

            services.AddTransient<IDbContextWrapper, DbContextWrapper>();
            services.AddTransient<IMatchClient, MatchClient.MatchClient>();
            services.AddTransient<IBetResultMaker, BetResultMaker>();
            services.AddTransient<IResultCoordinator, ResultCoordinator>();
            services.AddTransient<ITeamGenerator, TeamGenerator>();
            services.AddTransient<IBetGenerator, BetGenerator>();
        }

        // This method gets called by the runtime. Use this method to configure the HTTP request pipeline.
        public void Configure(IApplicationBuilder app, IWebHostEnvironment env)
        {
            //if (env.IsDevelopment())
            //{
                app.UseDeveloperExceptionPage();
                app.UseDatabaseErrorPage();
            //}
            //else
            //{
            //    app.UseExceptionHandler("/Error");
            //    // The default HSTS value is 30 days. You may want to change this for production scenarios, see https://aka.ms/aspnetcore-hsts.
            //    app.UseHsts();
            //}

            app.UseHttpsRedirection();
            app.UseStaticFiles();
            app.UseSpaStaticFiles();

            app.UseRouting();

            app.UseAuthentication();
            app.UseIdentityServer();
            app.UseAuthorization();
            app.UseEndpoints(endpoints =>
            {
                endpoints.MapControllerRoute(
                    name: "default",
                    pattern: "{controller}/{action=Index}/{id?}");
                endpoints.MapRazorPages();
            });

            app.UseSpa(spa =>
            {
                spa.Options.SourcePath = "ClientApp";

                if (env.IsDevelopment())
                {
                    spa.UseReactDevelopmentServer(npmScript: "start");
                }
            });
        }
    }
}
