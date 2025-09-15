namespace BitHub.Backend.Dtos
{
    public class MappingDetailDto
    {
        public int MappingDetailId { get; set; }
        public int OrdinalPosition { get; set; }
        public string MutationJSON { get; set; } = string.Empty;
        public string OutputName { get; set; } = string.Empty;
        public int OutputDataTypeId { get; set; }
    }
}