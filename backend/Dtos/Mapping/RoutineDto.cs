namespace BitHub.Backend.Dtos
{
    public class RoutineDto
    {
        public int RoutineId { get; set; }
        public string? RoutineName { get; set; } = string.Empty;
        public int IntervalId { get; set; }
        public string? SourcePath { get; set; } = string.Empty;
        public string? SQLConnectionString { get; set; } = string.Empty;
        public string StartDate { get; set; } = string.Empty;
        public string StartTime { get; set; } = string.Empty;
        public string? EndDate { get; set; } = string.Empty;
    }

}