using Microsoft.AspNetCore.Identity;

namespace TodoApp.Api.Handlers;

public static class LogoutHandler
{
    public static async Task<IResult> Handler(SignInManager<IdentityUser> signInManager)
    {
        await signInManager.SignOutAsync();
        return Results.NoContent();
    }
}