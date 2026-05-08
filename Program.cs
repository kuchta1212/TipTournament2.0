using Microsoft.AspNetCore.Identity;
using Microsoft.EntityFrameworkCore;
using Microsoft.Extensions.FileProviders;
using TipTournament2._0.Calculator;
using TipTournament2._0.Coordinator;
using TipTournament2._0.Data;
using TipTournament2._0.MatchClient;
using TipTournament2._0.Models;
using TipTournament2._0.Utils;

var builder = WebApplication.CreateBuilder(args);

// Database
builder.Services.AddDbContext<ApplicationDbContext>(options =>
    options.UseSqlServer(builder.Configuration.GetConnectionString("DefaultConnection")));

// Identity with cookie auth
builder.Services.AddDefaultIdentity<ApplicationUser>(options => options.SignIn.RequireConfirmedAccount = false)
    .AddRoles<IdentityRole>()
    .AddEntityFrameworkStores<ApplicationDbContext>();

builder.Services.ConfigureApplicationCookie(options =>
{
    options.LoginPath = "/authentication/login";
    options.LogoutPath = "/authentication/logout";
    options.Cookie.HttpOnly = true;
    options.Cookie.SameSite = SameSiteMode.Strict;
    options.Events.OnRedirectToLogin = context =>
    {
        if (context.Request.Path.StartsWithSegments("/api"))
        {
            context.Response.StatusCode = 401;
            return Task.CompletedTask;
        }
        context.Response.Redirect(context.RedirectUri);
        return Task.CompletedTask;
    };
});

// Options
builder.Services.Configure<DeltaStageOptions>(opt =>
{
    opt.FirstRound = builder.Configuration.GetSection("DeltaStage:FirstRound").Get<FirstRoundOptions[]>();
    opt.NextRounds = builder.Configuration.GetSection("DeltaStage:Next").Get<NextRoundOptions[]>();
});

builder.Services.Configure<OmikronStageOptions>(opt =>
{
    opt.TeamIds = builder.Configuration.GetSection("OmikronStage:TeamIds").Get<string[]>();
});

builder.Services.Configure<GeneralOption>(opt =>
{
    opt.FinalMatchId = builder.Configuration.GetSection("General:finalMatchId").Get<string>();
    opt.GroupCount = builder.Configuration.GetSection("General:groupCount").Get<int>();
    opt.MatchCount = builder.Configuration.GetSection("General:matchCount").Get<Dictionary<TournamentStage, int>>();
});

builder.Services.Configure<FeatureFlags>(opt =>
{
    opt.AdditionalDeltaEvaluation = builder.Configuration.GetSection("FeatureFlags:additionalDeltaEvaluation").Get<bool>();
});

// MVC
builder.Services.AddControllersWithViews();
builder.Services.AddRazorPages();

// Application services
builder.Services.AddTransient<IDbContextWrapper, DbContextWrapper>();
builder.Services.AddTransient<IMatchClient, TipTournament2._0.MatchClient.MatchClient>();
builder.Services.AddTransient<IBetResultMaker, BetResultMaker>();
builder.Services.AddTransient<IResultCoordinatorFactory, ResultCoordinatorFactory>();
builder.Services.AddTransient<ITeamGenerator, TeamGenerator>();

var app = builder.Build();

// Seed the "Admin" role on startup (idempotent)
using (var scope = app.Services.CreateScope())
{
    var roleManager = scope.ServiceProvider.GetRequiredService<RoleManager<IdentityRole>>();
    if (!await roleManager.RoleExistsAsync("Admin"))
    {
        await roleManager.CreateAsync(new IdentityRole("Admin"));
    }
}

app.UseDeveloperExceptionPage();
app.UseHttpsRedirection();
app.UseStaticFiles();

// In production, serve the React build output from ClientApp/build
var spaPath = Path.Combine(app.Environment.ContentRootPath, "ClientApp", "build");
IFileProvider spaFileProvider = null;
if (Directory.Exists(spaPath))
{
    spaFileProvider = new PhysicalFileProvider(spaPath);
    app.UseStaticFiles(new StaticFileOptions
    {
        FileProvider = spaFileProvider
    });
}

app.UseRouting();
app.UseAuthentication();
app.UseAuthorization();

app.MapControllerRoute(
    name: "default",
    pattern: "{controller}/{action=Index}/{id?}");
app.MapRazorPages();
if (spaFileProvider != null)
{
    app.MapFallbackToFile("index.html", new StaticFileOptions
    {
        FileProvider = spaFileProvider
    });
}
else
{
    app.MapFallbackToFile("index.html");
}

app.Run();
