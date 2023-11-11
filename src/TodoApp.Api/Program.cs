using Microsoft.AspNetCore.Identity;
using Microsoft.EntityFrameworkCore;
using TodoApp.Api.Data;

var builder = WebApplication.CreateBuilder(args);
var port = Environment.GetEnvironmentVariable("PORT") ?? "8081";
if (builder.Environment.IsProduction())
{
    builder.WebHost.UseUrls($"http://*:{port}");
}

builder.Services.AddDbContext<TodoAppDbContext>(options =>
{
    var connectionString = builder.Configuration.GetConnectionString("Default");
    options.UseNpgsql(connectionString);
});
builder.Services.AddIdentity<IdentityUser, IdentityRole>()
    .AddEntityFrameworkStores<TodoAppDbContext>()
    .AddDefaultTokenProviders();
builder.Services.AddHostedService<DatabaseInitializer>();


builder.Services.AddProblemDetails();
builder.Services.AddSpaStaticFiles(options => { options.RootPath = "wwwroot"; });

var app = builder.Build();

var apiGroup = app.MapGroup("/api");
apiGroup.MapGet("/", () => "Hello World!");

app.UseRouting();
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