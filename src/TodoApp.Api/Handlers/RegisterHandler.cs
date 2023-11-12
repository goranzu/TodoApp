using System.ComponentModel.DataAnnotations;
using Microsoft.AspNetCore.Identity;

namespace TodoApp.Api.Handlers;

public static class RegisterHandler
{
    public sealed class RegisterForm
    {
        [Required] [EmailAddress] public string Email { get; set; } = null!;
        [Required] [MinLength(3)] public string Password { get; set; } = null!;
        [Required] [MinLength(3)] public string ConfirmPassword { get; set; } = null!;
    }

    public static async Task<IResult> Handler(RegisterForm registerForm, SignInManager<IdentityUser> signInManager,
        UserManager<IdentityUser> userManager)
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
    }
}