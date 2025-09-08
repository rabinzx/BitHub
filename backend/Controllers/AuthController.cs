using System.Text.Json;
using Microsoft.AspNetCore.Authorization;
using Microsoft.AspNetCore.Mvc;

[ApiController]
[Route("api/[controller]/[action]")]
public class AuthController : ControllerBase
{
    private readonly ICryptography _cryptography;
    private readonly DatabaseUtility _databaseUtility;
    public AuthController(ICryptography cryptography, DatabaseUtility databaseUtility)
    {
        _cryptography = cryptography;
        _databaseUtility = databaseUtility;
    }
    
    [HttpPost]
    public async Task<IActionResult> LoginAsync(JsonElement req)
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

            var query = "SELECT Password FROM Users WHERE UserName = @UserName LIMIT 1;";
            var hashedPassword = await _databaseUtility.QuerySingleOrDefaultAsync<string>(query, new { UserName = username });
            
            if (string.IsNullOrEmpty(hashedPassword))
            {
                result = new
                {
                    result = "error",
                    externalMessage = "Invalid username or password",
                };
                return Ok(result);
            }

            var isAuthenticated = _cryptography.VerifyPassword(hashedPassword, password);
            if (isAuthenticated)
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

    [HttpPost]
    public async Task<IActionResult> RegisterUser(JsonElement req)
    {
        var response = new { result = "error", externalMessage = "Registration failed" };
        if (req.TryGetProperty("username", out var usernameProp) &&
            req.TryGetProperty("password", out var passwordProp))
        {
            string username = usernameProp.GetString() ?? "";
            string password = passwordProp.GetString() ?? "";

            // Check if username already exists
            var existsQuery = "SELECT Id FROM Users WHERE UserName = @UserName LIMIT 1;";
            var existingId = await _databaseUtility.QuerySingleOrDefaultAsync<long?>(existsQuery, new { UserName = username });
            if (existingId != null && existingId > 0)
            {
                response = new { result = "error", externalMessage = "Username already exists" };
            }
            else
            {
                var hashedPassword = _cryptography.HashPassword(password);
                var parameters = new { UserName = username, Password = hashedPassword };

                // Execute the query
                var query = "INSERT INTO Users (UserName, Password) VALUES (@UserName, @Password); SELECT last_insert_rowid();";
                var id = await _databaseUtility.ExecuteScalarAsync<long>(query, parameters);
                response = new { result = "success", externalMessage = "Successfully Registered" };
            }
        }
        return Ok(response);
    }

    [HttpPost]
    [Authorize]
    public IActionResult Logoff()
    {
        // Handle logoff logic
        Response.Cookies.Delete("Authorization");
        return Ok();
    }
}