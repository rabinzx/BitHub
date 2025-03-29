using System.Diagnostics;

var builder = WebApplication.CreateBuilder(args);

// Add services to the container.
// Learn more about configuring Swagger/OpenAPI at https://aka.ms/aspnetcore/swashbuckle
builder.Services.AddEndpointsApiExplorer();
builder.Services.AddSwaggerGen();

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


var app = builder.Build();

// Configure the HTTP request pipeline.
if (app.Environment.IsDevelopment())
{
    app.UseSwagger();
    app.UseSwaggerUI();
}

app.UseHttpsRedirection();

var summaries = new[]
{
    "Freezing", "Bracing", "Chilly", "Cool", "Mild", "Warm", "Balmy", "Hot", "Sweltering", "Scorching"
};

// app.MapGet("/weatherforecast", () =>
// {
//     var forecast =  Enumerable.Range(1, 5).Select(index =>
//         new WeatherForecast
//         (
//             DateOnly.FromDateTime(DateTime.Now.AddDays(index)),
//             Random.Shared.Next(-20, 55),
//             summaries[Random.Shared.Next(summaries.Length)]
//         ))
//         .ToArray();
//     return forecast;
// })
// .WithName("GetWeatherForecast")
// .WithOpenApi();

app.Use(async (context, next) =>
{
    Debug.WriteLine("CSP Middleware: Adding Content-Security-Policy header.");
    string nonce = Convert.ToBase64String(Guid.NewGuid().ToByteArray());
    context.Items["CSP-Nonce"] = nonce;
    context.Response.Headers.Append("Content-Security-Policy", 
        $"default-src 'self'; script-src 'self' 'nonce-{nonce}' https://apis.google.com; style-src 'self' 'nonce-{nonce}';");

    await next();
});

app.MapGet("/", () => "ASP.NET 8 API Home Page!");

// This endpoint returns a nonce value that can be used in the CSP header for inline scripts
app.MapGet("/api/nonce", (HttpContext context) => {
    return Results.Json(new { nonce = context.Items["CSP-Nonce"] });
});

app.MapGet("/api/sayhello", () => Results.Json(new {msg = "Hello from ASP.NET 8 API!"}));

app.Run();

