using System.Text.Json;
using Microsoft.AspNetCore.Authorization;
using Microsoft.AspNetCore.Mvc;

[ApiController]
[Route("api/[controller]/[action]")]
public class AuthController : ControllerBase
{
    private readonly ICryptography _cryptography;
    public AuthController(ICryptography cryptography)
    {
        _cryptography = cryptography;
    }
    
    [HttpPost]
    public IActionResult Login(JsonElement req)
    {
        // jwt authentication example
        // https://medium.com/@solomongetachew112/jwt-authentication-in-net-8-a-complete-guide-for-secure-and-scalable-applications-6281e5e8667c
        var result = new
        {
            result = "error",
            externalMessage = "Login failed",
        };

        // Access properties dynamically
        if (req.TryGetProperty("username", out var usernameProp) &&
            req.TryGetProperty("password", out var passwordProp))
        {
            string username = usernameProp.GetString() ?? "";
            string password = passwordProp.GetString() ?? "";

            if (username == "lantong")
            {
                // Generate JWT token
                string token = _cryptography.GenerateJwtToken(username);
                int exipres_in_hours = 1; // Token expiration time in hours
                var cookieOptions = new CookieOptions
                {
                    HttpOnly = true,
                    Secure = true, // Only send over HTTPS
                    SameSite = SameSiteMode.Strict,
                    Expires = DateTime.UtcNow.AddHours(exipres_in_hours)
                };
                Response.Cookies.Append("Authorization", token, cookieOptions);

                return Ok(new
                {
                    result = "success",
                    resultData = new 
                    {
                        access_token = token,
                        expires_in = exipres_in_hours * 3600 // Token expiration time in seconds
                    }
                });
            }
        }
        else
        {
            result = new
            {
                result = "error",
                externalMessage = "Invalid request format",
            };
        }

        return Ok(result);
    }

    [HttpGet]
    [Authorize]
    public IActionResult LogInTest()
    {
        // Handle logoff logic
        return Ok(new { msg = "Logged In successfully" });
    }

    [HttpPost]
    [Authorize]
    public IActionResult Logoff()
    {
        // Handle logoff logic
        return Ok();
    }
}