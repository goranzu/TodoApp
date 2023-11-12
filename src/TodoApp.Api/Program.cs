using System.ComponentModel.DataAnnotations;
using System.Security.Claims;
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
    var connectionString = Environment.GetEnvironmentVariable("DATABASE_PRIVATE_URL") ??
                           builder.Configuration.GetConnectionString("Default");
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
apiGroup.MapGet("/user",
    (ClaimsPrincipal user) => { return Results.Ok(user.Claims.ToDictionary(x => x.Type, x => x.Value)); });
apiGroup.MapPost("/register",
    async (RegisterForm registerForm, SignInManager<IdentityUser> signInManager,
        UserManager<IdentityUser> userManager) =>
    {
        if (!registerForm.Password.Equals(registerForm.ConfirmPassword))
        {
            return Results.ValidationProblem(new Dictionary<string, string[]>
            {
                {
                    "ConfirmPassword", new[] { "Passwords do not match" }
                }
            });
        }

        var user = new IdentityUser { Email = registerForm.Email, UserName = registerForm.Email };
        var result = await userManager.CreateAsync(user, registerForm.Password);
        if (!result.Succeeded)
        {
            var errors = result.Errors
                .GroupBy(e => e.Code)
                .ToDictionary(
                    group => group.Key,
                    group => group.Select(e => e.Description).ToArray()
                );
            return Results.ValidationProblem(errors);
        }

        await signInManager.SignInAsync(user, true);

        return Results.Ok();
    });

apiGroup.MapPost("/login",
    async (LoginForm loginForm, SignInManager<IdentityUser> signInManager) =>
    {
        var result = await signInManager.PasswordSignInAsync(loginForm.Email, loginForm.Password, true, false);

        if (!result.Succeeded)
        {
            return Results.Problem("Invalid login details", null, StatusCodes.Status400BadRequest);
        }

        return Results.Ok();
    });
apiGroup.MapDelete("/logout",
        async (SignInManager<IdentityUser> signInManager) => { await signInManager.SignOutAsync(); })
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

public sealed class LoginForm
{
    [Required] [EmailAddress] public string Email { get; set; } = null!;
    [Required] [MinLength(3)] public string Password { get; set; } = null!;
}

public sealed class RegisterForm
{
    [Required] [EmailAddress] public string Email { get; set; } = null!;
    [Required] [MinLength(3)] public string Password { get; set; } = null!;
    [Required] [MinLength(3)] public string ConfirmPassword { get; set; } = null!;
}