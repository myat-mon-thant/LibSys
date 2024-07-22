using System;
using System.Collections.Generic;
using System.Linq;
using System.Threading.Tasks;
using Microsoft.AspNetCore.Http;
using Microsoft.AspNetCore.Mvc;
using Microsoft.EntityFrameworkCore;
using Lib2.Models;
using Lib2.DTO;
using static System.Reflection.Metadata.BlobBuilder;

namespace Lib2.Controllers
{
    [Route("api/[controller]")]
    [ApiController]
    public class BooksController : ControllerBase
    {
        private readonly LibraryDbContext _context;

        public BooksController(LibraryDbContext context)
        {
            _context = context;
        }

        // GET: api/Books
        [HttpGet]
        public async Task<ActionResult<IEnumerable<Book>>> GetBooks()
        {
            var books = await _context.Books.Where(a => a.Status == "Active" || a.Status == "Edit").ToListAsync();
            /*return Ok(new ApiResponses<Book>
            {
                Success = true,
                Message = "Book Get Successfully",
                Data = books
            });*/

            return Ok(new
            {
                Success = true,
                Message = "Book Get Successfully",
                Data = books
            });

        }

        // GET: api/Authors/5
        [HttpGet("{id}")]
        public async Task<ActionResult<Book>> GetBook(int id)
        {
            var book = await _context.Books.FindAsync(id);


            if (book == null || book.Status != "Active" && book.Status != "Edit")
            {
                return NotFound(new ApiResponse<Book> 
                { 
                    Success = false,
                    Message = "Books not found",
                    Data = book
                });
            }

            return Ok(new ApiResponse<Book>
            {
                Success = true,
                Message = "Book Get Successfully",
                Data = book
            });
        }

       
        // PUT: api/Books/5
        // To protect from overposting attacks, see https://go.microsoft.com/fwlink/?linkid=2123754
        [HttpPut("{id}")]
        
        public async Task<IActionResult> PutBook(int id, BookDto bookDto)
        {
            if (bookDto == null)
            {
                return BadRequest();
            }

            // Find the book in the database
            var book = await _context.Books.FindAsync(id);
            if (book == null)
            {
                return NotFound();
            }

            /*// Check if the author and category exist
            var author = await _context.Authors.FindAsync(bookDto.AuthorId);
            if (author == null)
            {
                return BadRequest();
            }

            var category = await _context.Categories.FindAsync(bookDto.CategoryId);
            if (category == null)
            {
                return BadRequest();
            }
*/
            // Update the book object with the values from the bookDto
            book.Title = bookDto.Title;
            book.AuthorId = bookDto.AuthorId;
            book.CategoryId = bookDto.CategoryId;
            book.PublicationDate = bookDto.PublicationDate;
            book.Price = bookDto.Price;
            book.CreatedDate = DateTime.Now;
            book.Status = "Edit";

            // Update the book in the database
            _context.Entry(book).State = EntityState.Modified;
            await _context.SaveChangesAsync();
            return Ok(new
            {
                Success = true,
                Message = "Book updated successfully.",
                Data = book
            });

        }

       
        [HttpPost]
        public async Task<ActionResult<Book>> PostBook([FromBody] BookDto bookDto)
        {
            /*if (bookDto == null)
                
            return BadRequest();*/

            // Check if the author and category exist
            /*var author = await _context.Authors.FindAsync(bookDto.AuthorId);
            if (author == null)
                return BadRequest();

            var category = await _context.Categories.FindAsync(bookDto.CategoryId);
            if (category == null)    
                return BadRequest();*/
            // Create the book entity
            var book = new Book()
            {
                Title = bookDto.Title,
                AuthorId = bookDto.AuthorId,
                CategoryId = bookDto.CategoryId,
                PublicationDate = bookDto.PublicationDate,
                Price = bookDto.Price,
                Status = "Active", // Set the default status
                CreatedDate = DateTime.Now // Set the created date
            };
            Console.WriteLine("book", book);

            _context.Books.Add(book);
            await _context.SaveChangesAsync();
           
            return Ok(
                new ApiResponse<Book> 
                { 
                    Success = true,
                    Message = "Books are created successfully.",
                    Data = book
                });
            
        }


        // DELETE: api/Books/5
        [HttpDelete("{id}")]
        public async Task<IActionResult> DeleteBook(int id)
        {
            var book = await _context.Books.FindAsync(id);
            if (book == null)
            {
                return NotFound(new ApiResponse<Book> 
                {
                    Success = false,
                    Message = "Books not found",
                    Data = book
                });
            }
            book.Status = "Delete";
            _context.Entry(book).State = EntityState.Modified;
            /*_context.Books.Remove(book);*/
            await _context.SaveChangesAsync();

            return Ok(new ApiResponse<Book> 
            {
                Success = true,
                Message = "Books are deleted successfully.",
                Data = book
            });
        }

        private bool BookExists(int id)
        {
            return _context.Books.Any(e => e.Id == id);
        }
    }
}
