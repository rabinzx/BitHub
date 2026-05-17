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
        var connection = new SqliteConnection(_connectionString);
        connection.Open();

        // enable foreign key enforcement
        using (var cmd = connection.CreateCommand())
        {
            cmd.CommandText = "PRAGMA foreign_keys = ON;";
            cmd.ExecuteNonQuery();
        }

        CreateUserTable(connection);
        CreateMappingTable(connection);
        CreateDataTypeTable(connection);
        CreateMappingDetailTable(connection);
        CreateIntervalTable(connection);
        CreateRoutineTable(connection);
    }

    private void CreateUserTable(SqliteConnection connection)
    {
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

    private void CreateMappingTable(SqliteConnection connection)
    {
        using var command = connection.CreateCommand();
        command.CommandText = @"
            CREATE TABLE IF NOT EXISTS Mappings (
                MappingId INTEGER PRIMARY KEY AUTOINCREMENT,
                Description TEXT NOT NULL,
                CreatedDate TEXT CURRENT_TIMESTAMP,
                CreatedBy TEXT NOT NULL,
                FOREIGN KEY (CreatedBy) REFERENCES Users(Id)
            );
        ";
        command.ExecuteNonQuery();
    }

    private void CreateDataTypeTable(SqliteConnection connection)
    {
        using var command = connection.CreateCommand();
        command.CommandText = @"
            CREATE TABLE IF NOT EXISTS DataTypes (
                DataTypeId INTEGER PRIMARY KEY AUTOINCREMENT,
                TypeName TEXT NOT NULL UNIQUE
            );

            INSERT OR IGNORE INTO DataTypes (TypeName) 
            VALUES 
                ('String'), 
                ('Integer'), 
                ('Float'), 
                ('Boolean'), 
                ('Date'), 
                ('DateTime');
        ";
        command.ExecuteNonQuery();
    }

    private void CreateMappingDetailTable(SqliteConnection connection)
    {
        using var command = connection.CreateCommand();
        command.CommandText = @"
            CREATE TABLE IF NOT EXISTS MappingDetails (
                MappingDetailId INTEGER PRIMARY KEY AUTOINCREMENT,
                OrdinalPosition INTEGER,
                MutationJSON TEXT,
                OutputName TEXT NOT NULL,
                OutputDataTypeId INTEGER NOT NULL,
                MappingId INTEGER NOT NULL,
                FOREIGN KEY (OutputDataTypeId) REFERENCES DataTypes(DataTypeId),
                FOREIGN KEY (MappingId) REFERENCES Mappings(MappingId)
            );
        ";
        command.ExecuteNonQuery();
    }

    private void CreateIntervalTable(SqliteConnection connection)
    {
        using var command = connection.CreateCommand();
        command.CommandText = @"
            CREATE TABLE IF NOT EXISTS Intervals (
                IntervalId INTEGER PRIMARY KEY AUTOINCREMENT,
                IntervalName TEXT NOT NULL UNIQUE,
                IntervalDetailDefaultJSON TEXT
            );
        ";
        command.ExecuteNonQuery();

        command.CommandText = @"
            INSERT INTO Intervals (IntervalName, IntervalDetailDefaultJSON) 
            VALUES
                ('Hourly', '{" + "\"hour\":1" + @"}'),
                ('Daily', '{" + "\"day\":1" + @"}}'),
                ('Weekly', '{" + "\"week\":1,\"dayOfWeek\":[]" + @"}'),
                ('Monthly', '{" + "\"month\":[],\"dayOfMonth\":[]" + @"}')
            ON CONFLICT (IntervalName) DO UPDATE SET 
                IntervalDetailDefaultJSON = excluded.IntervalDetailDefaultJSON;
        ";
        command.ExecuteNonQuery();
    }
    
    private void CreateRoutineTable(SqliteConnection connection)
    {
        using var command = connection.CreateCommand();
        command.CommandText = @"
            CREATE TABLE IF NOT EXISTS Routines (
                RoutineId INTEGER PRIMARY KEY AUTOINCREMENT,
                RoutineName TEXT NOT NULL,
                IntervalId INTEGER NOT NULL,
                SourcePath TEXT NOT NULL,
                SQLConnectionString TEXT NOT NULL,
                StartDate TEXT NOT NULL,
                StartTime TEXT NOT NULL,
                EndDate TEXT,
                CreatedDate TEXT CURRENT_TIMESTAMP,
                CreatedBy TEXT NOT NULL,
                UpdatedDate TEXT NOT NULL,
                UpdatedBy TEXT NOT NULL,
                FOREIGN KEY (IntervalId) REFERENCES Intervals(IntervalId),
                FOREIGN KEY (CreatedBy) REFERENCES Users(Id)
            );
        ";
        command.ExecuteNonQuery();
    }
}
