using System;
using System.Collections.Generic;

namespace Lib2.Models;

public partial class Author
{
    public int Id { get; set; }

    public string Name { get; set; } = null!;

    public string Status { get; set; } = null!;

    public DateTime CreatedDate { get; set; }

    public virtual ICollection<Book> Books { get; set; } = new List<Book>();
}
