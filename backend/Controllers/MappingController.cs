using System.Diagnostics;
using System.IdentityModel.Tokens.Jwt;
using System.Security.Claims;
using System.Text.Json;
using BitHub.Backend.Dtos;
using Dapper;
using Microsoft.AspNetCore.Authorization;
using Microsoft.AspNetCore.Mvc;
using Microsoft.Data.Sqlite;

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
                    JOIN Mappings m ON md.MappingId = m.MappingId
                    WHERE m.CreatedBy = @Id
                    AND md.MappingId = @MappingId
                    ORDER BY MappingDetailId;";
        var mappingDetails = await _databaseUtility.QueryAsync<MappingDetailDto>(query, new { Id = userId, MappingId = mappingId.GetInt32() });
        return Ok(mappingDetails);
    }

    [HttpPost]
    [Authorize]
    public async Task<IActionResult> SaveMappingDetails(MappingDetailPayloadDto payload)
    {
        int mappingId = payload.MappingId;
        List<MappingDetailDto> mappingDetails = payload.MappingDetails;
        
        // var tmpNewMappingDetails = mappingDetails.Where(m => m.MappingDetailId == 0)
        // .Select(m => new MappingDetailWithMappingIdDto
        // {
        //     MappingId = mappingId,
        //     OrdinalPosition = m.OrdinalPosition,
        //     MutationJSON = m.MutationJSON,
        //     OutputName = m.OutputName,
        //     OutputDataTypeId = m.OutputDataTypeId
        // }).ToList();

        // var query = @"INSERT INTO MappingDetails (MappingId, OrdinalPosition, MutationJSON, OutputName, OutputDataTypeId)
        //               VALUES (@MappingId, @OrdinalPosition, @MutationJSON, @OutputName, @OutputDataTypeId);";
        // await _databaseUtility.ExecuteAsync(query, tmpNewMappingDetails);

        
        using var conn = _databaseUtility.GetConnection();
        await conn.OpenAsync();
        using var tx = conn.BeginTransaction();

        try
        {
            foreach (var row in payload.MappingDetails)
            {
                if (row.MappingDetailId > 0)
                {
                    // UPDATE
                    var updateSql = @"
                        UPDATE MappingDetails
                        SET 
                            OrdinalPosition = @OrdinalPosition,
                            MutationJSON = @MutationJSON,
                            OutputName = @OutputName,
                            OutputDataTypeId = @OutputDataTypeId
                        WHERE MappingDetailId = @MappingDetailId;
                    ";

                    await conn.ExecuteAsync(updateSql, row, tx);
                }
                else
                {
                    // INSERT
                    var insertSql = @"
                        INSERT INTO MappingDetails
                            (MappingId, OrdinalPosition, MutationJSON, OutputName, OutputDataTypeId)
                        VALUES
                            (@MappingId, @OrdinalPosition, @MutationJSON, @OutputName, @OutputDataTypeId);
                    ";

                    var parameters = new
                    {
                        MappingId = payload.MappingId,
                        row.OrdinalPosition,
                        row.MutationJSON,
                        row.OutputName,
                        row.OutputDataTypeId
                    };

                    await conn.ExecuteAsync(insertSql, parameters, tx);
                }
            }

            // If all operations succeed, commit
            tx.Commit();

            return Ok(payload);
        }
        catch (Exception ex)
        {
            // If any one operation fails → rollback everything
            tx.Rollback();
            return BadRequest(new { error = ex.Message });
        }
    }
}