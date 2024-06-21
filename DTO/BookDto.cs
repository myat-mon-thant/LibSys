namespace Lib2.DTO
{
    public class BookDto
    {
        public string Title { get; set; }
        public int AuthorId { get; set; }
        public int CategoryId { get; set; }

        public DateTime? PublicationDate { get; set; }

        public int? Price { get; set; }
    }
}
