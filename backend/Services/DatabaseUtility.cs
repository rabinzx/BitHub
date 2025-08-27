using Dapper;
using Microsoft.Data.Sqlite;

public class DatabaseUtility
{
    private readonly string _connectionString;
    public DatabaseUtility(IConfiguration configuration)
    {
        _connectionString = configuration.GetConnectionString("ConfigDb") ?? "Data Source=ConfigDb.db";
    }

    private SqliteConnection GetConnection() => new SqliteConnection(_connectionString);

    public async Task<T?> QuerySingleOrDefaultAsync<T>(string query, object? parameters = null)
    {
        using var conn = GetConnection();

        var result = await conn.QuerySingleOrDefaultAsync<T>(
            query, parameters);
        return result;
    }

    public async Task<T?> ExecuteScalarAsync<T>(string query, object? parameters = null)
    {
        using var conn = GetConnection();

        var result = await conn.ExecuteScalarAsync<T>(
            query, parameters);
        return result;
    }
    
    
}