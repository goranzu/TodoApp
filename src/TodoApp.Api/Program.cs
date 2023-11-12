using Microsoft.AspNetCore.Identity;
using Microsoft.EntityFrameworkCore;
using TodoApp.Api.Data;
using TodoApp.Api.Handlers;

var builder = WebApplication.CreateBuilder(args);
var port = Environment.GetEnvironmentVariable("PORT") ?? "8081";
if (builder.Environment.IsProduction())
{
    builder.WebHost.UseUrls($"http://*:{port}");
}

builder.Services.AddDbContext<TodoAppDbContext>(options =>
{
    var defaultString = builder.Configuration.GetConnectionString("Default");
    var databaseUrl = Environment.GetEnvironmentVariable("DATABASE_PRIVATE_URL");
    var connectionString = string.IsNullOrEmpty(databaseUrl)
        ? defaultString
        : DatabaseHelpers.BuildConnectionString(databaseUrl);
    options.UseNpgsql(connectionString);
});
builder.Services.AddIdentity<IdentityUser, IdentityRole>()
    .AddEntityFrameworkStores<TodoAppDbContext>()
    .AddDefaultTokenProviders();
builder.Services.AddHostedService<DatabaseInitializer>();

builder.Services.AddAuthorization();
builder.Services.AddProblemDetails();
builder.Services.AddSpaStaticFiles(options => { options.RootPath = "wwwroot"; });

if (builder.Environment.IsDevelopment())
{
    builder.Services.Configure<IdentityOptions>(options =>
    {
        options.User.RequireUniqueEmail = false;
        options.Password.RequireDigit = false;
        options.Password.RequireLowercase = false;
        options.Password.RequireUppercase = false;
        options.Password.RequireNonAlphanumeric = false;
        options.Password.RequiredLength = 3;
    });
}

var app = builder.Build();

var apiGroup = app.MapGroup("/api");
apiGroup.MapGet("/", () => "Hello World!");
apiGroup.MapGet("/user", UserHandlers.GetUser);
apiGroup.MapPost("/register", RegisterHandler.Handler);
apiGroup.MapPost("/login", LoginHandler.Handler);
apiGroup.MapPost("/logout", LogoutHandler.Handler)
    .RequireAuthorization();

app.UseRouting();
app.UseAuthentication();
app.UseAuthorization();
if (app.Environment.IsDevelopment())
{
    app.UseDeveloperExceptionPage();
}

if (app.Environment.IsProduction())
{
    app.UseHttpsRedirection();
}

app.UseStatusCodePages();
app.UseSpaStaticFiles();

app.UseEndpoints(_ => { });

app.Use((context, next) =>
{
    if (context.Request.Path.StartsWithSegments("/api"))
    {
        context.Response.StatusCode = StatusCodes.Status404NotFound;
        return Task.CompletedTask;
    }

    return next();
});

app.UseSpa(options =>
{
    if (app.Environment.IsDevelopment())
    {
        options.UseProxyToSpaDevelopmentServer("http://localhost:5173");
    }
});

app.Run();