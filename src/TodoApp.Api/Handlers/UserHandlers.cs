using System.Security.Claims;

namespace TodoApp.Api.Handlers;

public static class UserHandlers
{
    public static IResult GetUser(ClaimsPrincipal user)
    {
        return Results.Ok(user.Claims.ToDictionary(x => x.Type, x => x.Value));
    }
}