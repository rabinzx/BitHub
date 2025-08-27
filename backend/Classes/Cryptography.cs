using System.Text;
using System.IdentityModel.Tokens.Jwt; 
using System.Security.Claims;
using Microsoft.IdentityModel.Tokens;
using Isopoh.Cryptography.Argon2;
using System.Security.Cryptography;

public interface ICryptography
{
    string GenerateJwtToken(string username);
    string HashPassword(string password);
    bool VerifyPassword(string hashedPassword, string inputPassword);
}

public class Cryptography : ICryptography
{
    private readonly IConfiguration _configuration;
    public Cryptography(IConfiguration configuration)
    {
        _configuration = configuration;
    }

    public string GenerateJwtToken(string username)
    {
        var claims = new[]
        {
            new Claim(JwtRegisteredClaimNames.Sub, username),
            new Claim(JwtRegisteredClaimNames.Jti, Guid.NewGuid().ToString())
        };

        var key = new SymmetricSecurityKey(Encoding.UTF8.GetBytes(_configuration["Jwt:Key"]!));
        var creds = new SigningCredentials(key, SecurityAlgorithms.HmacSha256);

        var token = new JwtSecurityToken(
            issuer: _configuration["Jwt:Issuer"],
            audience: _configuration["Jwt:Issuer"],
            claims: claims,
            expires: DateTime.Now.AddMinutes(30),
            signingCredentials: creds);

        return new JwtSecurityTokenHandler().WriteToken(token);
    }

    public string HashPassword(string password)
    {
        // Generate a random salt
        byte[] salt = new byte[16];
        using (var rng = RandomNumberGenerator.Create())
        {
            rng.GetBytes(salt);
        }

        // Configure Argon2 parameters
        var config = new Argon2Config
        {
            Type = Argon2Type.DataIndependentAddressing,
            Version = Argon2Version.Nineteen,
            TimeCost = 4,
            MemoryCost = 65536, // 64 MB
            Lanes = 4,
            Threads = Environment.ProcessorCount,
            Password = Encoding.UTF8.GetBytes(password),
            Salt = salt,
            HashLength = 32
        };

        using (var argon2 = new Argon2(config))
        {
            var hash = argon2.Hash();
            return config.EncodeString(hash.Buffer);
        }
    }

    public bool VerifyPassword(string hashedPassword, string inputPassword)
    {
        // Uses Isopoh.Cryptography.Argon2's built-in verification
        return Argon2.Verify(hashedPassword, inputPassword);
    }

}