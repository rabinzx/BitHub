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
public class RoutineController : ControllerBase
{
    private readonly DatabaseUtility _databaseUtility;
    public RoutineController(DatabaseUtility databaseUtility)
    {
        _databaseUtility = databaseUtility;
    }

    [HttpPost]
    [Authorize]
    public async Task<IActionResult> GetIntervals()
    {
        var query = "SELECT IntervalId, IntervalName, IntervalDetailDefaultJSON FROM Intervals;";
        var intervals = await _databaseUtility.QueryAsync<IntervalDto>(query);
        return Ok(intervals);
    }

    [HttpPost]
    [Authorize]
    public async Task<IActionResult> GetRoutines()
    {
        var userId = User.FindFirstValue(JwtRegisteredClaimNames.Sub);
        // req.TryGetProperty("mappingId", out var mappingId);
        var query = @"SELECT RoutineId, RoutineName, IntervalId, SourcePath, SQLConnectionString, StartDate, StartTime, EndDate
                    FROM Routines r
                    WHERE r.CreatedBy = @Id
                    ORDER BY RoutineId;";
        var routines = await _databaseUtility.QueryAsync<RoutineDto>(query, new { Id = userId});
        return Ok(routines);
    }

    [HttpPost]
    [Authorize]
    public async Task<IActionResult> SaveRoutine(RoutineDto routine)
    {
        if (routine.RoutineId == 0)
        {
            // INSERT
            var insertSql = @"
                INSERT INTO Routines
                    (RoutineName, IntervalId, SourcePath, SQLConnectionString, StartTime, StartDate, EndDate, CreatedDate, CreatedBy, UpdatedDate, UpdatedBy)
                VALUES
                    (@RoutineName, @IntervalId, @SourcePath, @SQLConnectionString, @StartTime, @StartDate, @EndDate, CURRENT_TIMESTAMP, @CreatedBy, CURRENT_TIMESTAMP, @UpdatedBy);
            ";

            var parameters = new
            {
                RoutineName = routine.RoutineName,
                IntervalId = routine.IntervalId,
                SourcePath = routine.SourcePath,
                SQLConnectionString = routine.SQLConnectionString,
                StartTime = routine.StartTime,
                StartDate = routine.StartDate,
                EndDate = routine.EndDate,
                CreatedBy = User.FindFirstValue(JwtRegisteredClaimNames.Sub),
                UpdatedBy = User.FindFirstValue(JwtRegisteredClaimNames.Sub)
            };

            await _databaseUtility.ExecuteAsync(insertSql, parameters);
            
        } else
        {
            // UPDATE
            var updateSql = @"
                UPDATE Routines
                SET RoutineName = @RoutineName,
                    IntervalId = @IntervalId,
                    SourcePath = @SourcePath,
                    SQLConnectionString = @SQLConnectionString,
                    StartTime = @StartTime,
                    StartDate = @StartDate,
                    EndDate = @EndDate,
                    UpdatedDate = CURRENT_TIMESTAMP,
                    UpdatedBy = @UpdatedBy
                WHERE RoutineId = @RoutineId;
            ";

            var parameters = new
            {
                RoutineId = routine.RoutineId,
                RoutineName = routine.RoutineName,
                IntervalId = routine.IntervalId,
                SourcePath = routine.SourcePath,
                SQLConnectionString = routine.SQLConnectionString,
                StartTime = routine.StartTime,
                StartDate = routine.StartDate,
                EndDate = routine.EndDate,
                UpdatedBy = User.FindFirstValue(JwtRegisteredClaimNames.Sub)
            };

            await _databaseUtility.ExecuteAsync(updateSql, parameters);
        }
        
        return Ok("Routine saved successfully.");
    }
}