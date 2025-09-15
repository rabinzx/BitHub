using System.Diagnostics;
using System.IdentityModel.Tokens.Jwt;
using System.Security.Claims;
using System.Text.Json;
using BitHub.Backend.Dtos;
using Microsoft.AspNetCore.Authorization;
using Microsoft.AspNetCore.Mvc;

[ApiController]
[Route("api/[controller]/[action]")]
public class MappingController : ControllerBase
{
    private readonly DatabaseUtility _databaseUtility;
    public MappingController(DatabaseUtility databaseUtility)
    {
        _databaseUtility = databaseUtility;
    }

    [HttpPost]
    [Authorize]
    public async Task<IActionResult> GetDataTypes()
    {
        var query = "SELECT DataTypeId, TypeName FROM DataTypes;";
        var dataTypes = await _databaseUtility.QueryAsync<DataTypeDto>(query);
        return Ok(dataTypes);
    }

    [HttpPost]
    [Authorize]
    public async Task<IActionResult> GetMappings()
    {
        /*
                MappingId INTEGER PRIMARY KEY AUTOINCREMENT,
                Description TEXT NOT NULL,
                CreatedDate TEXT CURRENT_TIMESTAMP,
                CreatedBy TEXT NOT NULL
        */
        var userId = User.FindFirstValue(JwtRegisteredClaimNames.Sub);
        var query = "SELECT MappingId, Description, CreatedDate FROM Mappings where CreatedBy = @Id;";
        var mappings = await _databaseUtility.QueryAsync<MappingDto>(query, new { Id = userId });
        return Ok(mappings);
    }
    
    [HttpPost]
    [Authorize]
    public async Task<IActionResult> GetMappingDetails(JsonElement req)
    {
        /*
                MappingId INTEGER PRIMARY KEY AUTOINCREMENT,
                Description TEXT NOT NULL,
                CreatedDate TEXT CURRENT_TIMESTAMP,
                CreatedBy TEXT NOT NULL
        */
        var userId = User.FindFirstValue(JwtRegisteredClaimNames.Sub); 
        req.TryGetProperty("mappingId", out var mappingId);
        var query = @"SELECT MappingDetailId, OrdinalPosition, MutationJSON, OutputName, OutputDataTypeId 
                    FROM MappingDetails md
                    join Mappings m on md.MappingId = m.MappingId
                    where m.CreatedBy = @Id
                    and md.MappingId = @MappingId
                    order by MappingDetailId;";
        var mappingDetails = await _databaseUtility.QueryAsync<MappingDetailDto>(query, new { Id = userId, MappingId = mappingId.GetInt32() });
        return Ok(mappingDetails);
    }
}