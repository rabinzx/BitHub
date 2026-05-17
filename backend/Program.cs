using System.Diagnostics;
using System.Text;
using System.Text.Json;
using Microsoft.AspNetCore.Authentication.JwtBearer;
using Microsoft.IdentityModel.Tokens;

var builder = WebApplication.CreateBuilder(args);

// Add services to the container.
// Learn more about configuring Swagger/OpenAPI at https://aka.ms/aspnetcore/swashbuckle
builder.Services.AddEndpointsApiExplorer();
builder.Services.AddSwaggerGen();

builder.Configuration
        .SetBasePath(builder.Environment.ContentRootPath)
        .AddJsonFile("appsettings.json", optional: false, reloadOnChange: true)
        .AddJsonFile("appsettings.local.json", optional: true, reloadOnChange: true) 
        .AddJsonFile($"appsettings.{builder.Environment.EnvironmentName}.json", optional: true) 
        .AddEnvironmentVariables();

// Add CORS policy (Cross-Origin Resource Sharing) to allow requests from the React app
builder.Services.AddCors(options =>
{
    options.AddDefaultPolicy(builder =>
    {
        builder.WithOrigins("http://localhost:5173")
            .AllowAnyHeader()
            .AllowAnyMethod();
    });
});

builder.Services.AddScoped<ICryptography, Cryptography>();

builder.Services.AddAuthentication(JwtBearerDefaults.AuthenticationScheme)
    .AddJwtBearer(options =>
    {
        options.MapInboundClaims = false; // preserve original claim types like "sub" (To prevent Microsoft.Identity override claim types https://stackoverflow.com/a/61900842)
        var jwtSection = builder.Configuration.GetSection("Jwt");
        options.TokenValidationParameters = new TokenValidationParameters
        {
            ValidateIssuer = true,
            ValidateAudience = true,
            ValidateLifetime = true,
            ValidateIssuerSigningKey = true,
            ValidIssuer = jwtSection["Issuer"]!,
            ValidAudience = jwtSection["Issuer"]!,
            IssuerSigningKey = new SymmetricSecurityKey(Encoding.UTF8.GetBytes(jwtSection["Key"]!))
        };
    });

builder.Services.AddAuthorization();

builder.Services.AddControllers();

builder.Services.AddSingleton<SqliteInitializer>();

builder.Services.AddSingleton<DatabaseUtility>();

builder.Services.AddControllers()
    .AddJsonOptions(opts =>
    {
        opts.JsonSerializerOptions.PropertyNamingPolicy = JsonNamingPolicy.CamelCase;
    });

var app = builder.Build();

// Configure the HTTP request pipeline.
if (app.Environment.IsDevelopment())
{
    app.UseSwagger();
    app.UseSwaggerUI();
}

app.UseHttpsRedirection();

app.UseCors(); // Enable CORS policy

app.Use(async (context, next) =>
{
    Debug.WriteLine("CSP Middleware: Adding Content-Security-Policy header.");
    string nonce = Convert.ToBase64String(Guid.NewGuid().ToByteArray());
    context.Items["CSP-Nonce"] = nonce;
    context.Response.Headers.Append("Content-Security-Policy", 
        $"default-src 'self'; script-src 'self' 'nonce-{nonce}' https://apis.google.com; style-src 'self' 'nonce-{nonce}';");

    await next();
});

app.Use(async (context, next) =>
{
    var token = context.Request.Cookies["Authorization"];

    if (!string.IsNullOrEmpty(token))
    {
        context.Request.Headers.Authorization = $"Bearer {token}";
    }

    await next();
});

app.UseAuthentication();
app.UseAuthorization();

// This endpoint returns a nonce value that can be used in the CSP header for inline scripts
app.MapGet("/api/nonce", (HttpContext context) =>
{
    return Results.Json(new { nonce = context.Items["CSP-Nonce"] });
});

app.MapControllers();

// Run database initializer at startup
using (var scope = app.Services.CreateScope())
{
    var sqliteInitializer = scope.ServiceProvider.GetRequiredService<SqliteInitializer>();
    sqliteInitializer.Initialize();
}

app.Run();

