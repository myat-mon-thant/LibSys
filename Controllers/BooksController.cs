using System;
using System.Collections.Generic;
using System.Linq;
using System.Threading.Tasks;
using Microsoft.AspNetCore.Http;
using Microsoft.AspNetCore.Mvc;
using Microsoft.EntityFrameworkCore;
using Lib2.Models;
using Lib2.DTO;

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
            return await _context.Books.Where(a => a.Status == "Active" || a.Status == "Edit").ToListAsync();
        }

        // GET: api/Authors/5
        [HttpGet("{id}")]
        public async Task<ActionResult<Book>> GetBook(int id)
        {
            var book = await _context.Books.FindAsync(id);


            if (book == null || book.Status != "Active" && book.Status != "Edit")
            {
                return NotFound();
            }

            return book;
        }

        /*// PUT: api/Books/5
        // To protect from overposting attacks, see https://go.microsoft.com/fwlink/?linkid=2123754
        [HttpPut("{id}")]
        public async Task<IActionResult> PutBook(int id, Book book)
        {
            if (id != book.Id)
            {
                return BadRequest();
            }

            _context.Entry(book).State = EntityState.Modified;

            try
            {
                await _context.SaveChangesAsync();
            }
            catch (DbUpdateConcurrencyException)
            {
                if (!BookExists(id))
                {
                    return NotFound();
                }
                else
                {
                    throw;
                }
            }

            return NoContent();
        }*/

        // PUT: api/Books/5
        // To protect from overposting attacks, see https://go.microsoft.com/fwlink/?linkid=2123754
        [HttpPut("{id}")]
        public async Task<IActionResult> PutBook(int id, BookDto bookDto)
        {
            // Find the author in the database
            var book = await _context.Books.FindAsync(id);
            if (book == null)
            {
                return NotFound();
            }

            // Update the author object with the values from the authorDto
            book.Title = bookDto.Title;
            book.AuthorId = bookDto.AuthorId;
            book.CategoryId = bookDto.CategoryId;
            book.PublicationDate = bookDto.PublicationDate;
            book.Price = bookDto.Price;

            // Set the author status to "Active" since it's being edited
            book.Status = "Edit";

            // Update the author in the database
            _context.Entry(book).State = EntityState.Modified;

            try
            {
                await _context.SaveChangesAsync();
            }
            catch (DbUpdateConcurrencyException)
            {
                if (!BookExists(id))
                {
                    return NotFound();
                }
                else
                {
                    throw;
                }
            }

            return NoContent();
        }

        // POST: api/Books
        // To protect from overposting attacks, see https://go.microsoft.com/fwlink/?linkid=2123754
        //[HttpPost]
        //public async Task<ActionResult<Book>> PostBook([FromBody]BookDto book)
        //{
        //    _context.Books.Add(book);
        //    await _context.SaveChangesAsync();

        //    return CreatedAtAction("GetBook", new { id = book.Id }, book);
        //}

        [HttpPost]
        public async Task<ActionResult<Book>> PostBook([FromBody] BookDto bookDto)
        {
            if (bookDto == null)
                return BadRequest("Book data is required.");

            // Check if the author and category exist
            var author = await _context.Authors.FindAsync(bookDto.AuthorId);
            if (author == null)
                return BadRequest("Invalid AuthorId.");

            var category = await _context.Categories.FindAsync(bookDto.CategoryId);
            if (category == null)
                return BadRequest("Invalid CategoryId.");

            // Create the book entity
            var book = new Book
            {
                Title = bookDto.Title,
                AuthorId = bookDto.AuthorId,
                CategoryId = bookDto.CategoryId,
                PublicationDate = bookDto.PublicationDate,
                Price = bookDto.Price,
                Status = "Active", // Set the default status
                CreatedDate = DateTime.Now // Set the created date
            };


            _context.Books.Add(book);
            await _context.SaveChangesAsync();
            return CreatedAtAction(nameof(GetBook), new { id = book.Id }, book);
        }


        // DELETE: api/Books/5
        [HttpDelete("{id}")]
        public async Task<IActionResult> DeleteBook(int id)
        {
            var book = await _context.Books.FindAsync(id);
            if (book == null)
            {
                return NotFound();
            }
            book.Status = "Delete";
            _context.Entry(book).State = EntityState.Modified;
            /*_context.Books.Remove(book);*/
            await _context.SaveChangesAsync();

            return NoContent();
        }

        private bool BookExists(int id)
        {
            return _context.Books.Any(e => e.Id == id);
        }
    }
}
