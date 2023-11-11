using Microsoft.AspNetCore.Identity;
using Microsoft.AspNetCore.Identity.EntityFrameworkCore;
using Microsoft.EntityFrameworkCore;

namespace TodoApp.Api.Data;

public class TodoAppDbContext : IdentityDbContext<IdentityUser>
{
    public TodoAppDbContext(DbContextOptions options) : base(options)
    {
    }
}