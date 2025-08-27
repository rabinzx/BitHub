using Microsoft.Data.Sqlite;

public class SqliteInitializer
{
    private readonly string _connectionString;
    public SqliteInitializer(IConfiguration configuration)
    {
        _connectionString = configuration.GetConnectionString("ConfigDb") ?? "Data Source=ConfigDb.db";
    }
    public void Initialize()
    {
        using var connection = new SqliteConnection(_connectionString);
        connection.Open();
        using var command = connection.CreateCommand();
        command.CommandText = @"
            CREATE TABLE IF NOT EXISTS Users (
                Id INTEGER PRIMARY KEY AUTOINCREMENT,
                UserName TEXT NOT NULL UNIQUE,
                Password TEXT NOT NULL
            );
        ";
        command.ExecuteNonQuery();
    }
}