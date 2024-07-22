namespace Lib2.DTO
{
    public class CategoryDto
    {
     
        public string Name { get; set; } = null!;
        public List<bookData>? book { get; set; } = new List<bookData>();

    }

    public class bookData
    {
        public string? Title { get; set; }
        public int AuthorId { get; set; }
     
        public DateTime? PublicationDate { get; set; }

        public int? Price { get; set; }
    }
}


