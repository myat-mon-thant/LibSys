namespace Lib2.DTO
{
    public class ApiResponse<Model>
    {
        public bool Success { get; set; }
        public string Message { get; set; } = string.Empty;

        public Model? Data { get; set; }
    }

    public class ApiResponses<Model>
    {
        public bool Success { get; set; }
        public string Message { get; set; } = string.Empty;

        public List<Model>? Data { get; set; }
    }
}
