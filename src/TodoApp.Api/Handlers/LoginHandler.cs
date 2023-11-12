using System.ComponentModel.DataAnnotations;
using Microsoft.AspNetCore.Identity;

namespace TodoApp.Api.Handlers;

public static class LoginHandler
{
    public sealed class LoginForm
    {
        [Required] [EmailAddress] public string Email { get; set; } = null!;
        [Required] [MinLength(3)] public string Password { get; set; } = null!;
    }

    public static async Task<IResult> Handler(LoginForm loginForm, SignInManager<IdentityUser> signInManager)
    {
        var result = await signInManager.PasswordSignInAsync(loginForm.Email, loginForm.Password, true, false);

        if (!result.Succeeded)
        {
            return Results.Problem("Invalid login details", null, StatusCodes.Status400BadRequest);
        }

        return Results.Ok();
    }
}