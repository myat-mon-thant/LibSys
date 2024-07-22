using Microsoft.OpenApi.Writers;

namespace Lib2.DTO
{
    public class BookDto
    {
        public int? Id { get; set; }
        public string Title { get; set; }
        public int AuthorId { get; set; }
        public int CategoryId { get; set; }

        public DateTime? PublicationDate { get; set; }

        public int? Price { get; set; }
    }
}
