using Dapper;
using Microsoft.Data.Sqlite;

public class DatabaseUtility
{
    private readonly string _connectionString;
    public DatabaseUtility(IConfiguration configuration)
    {
        _connectionString = configuration.GetConnectionString("ConfigDb") ?? "Data Source=ConfigDb.db";
    }

    public SqliteConnection GetConnection() => new SqliteConnection(_connectionString);

    public async Task<IEnumerable<object>> QueryAsync(string query, object? parameters = null)
    {
        using var conn = GetConnection();

        var result = await conn.QueryAsync(
            query, parameters);
        return result;
    }

    public async Task<IEnumerable<T>> QueryAsync<T>(string query, object? parameters = null)
    {
        using var conn = GetConnection();

        var result = await conn.QueryAsync<T>(
            query, parameters);
        return result;
    }

    public async Task<object?> QuerySingleOrDefaultAsync(string query, object? parameters = null)
    {
        using var conn = GetConnection();

        var result = await conn.QuerySingleOrDefaultAsync(
            query, parameters);
        return result;
    }

    public async Task<T?> QuerySingleOrDefaultAsync<T>(string query, object? parameters = null)
    {
        using var conn = GetConnection();

        var result = await conn.QuerySingleOrDefaultAsync<T>(
            query, parameters);
        return result;
    }

    public async Task<object?> ExecuteScalarAsync(string query, object? parameters = null)
    {
        using var conn = GetConnection();

        var result = await conn.ExecuteScalarAsync(
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
    
    public async Task ExecuteAsync(string query, object? parameters = null)
    {
        using var conn = GetConnection();

        var result = await conn.ExecuteAsync(
            query, parameters);
    }
    
}