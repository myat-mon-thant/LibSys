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
    public class AuthorsController : ControllerBase
    {
        private readonly LibraryDbContext _context;

        public AuthorsController(LibraryDbContext context)
        {
            _context = context;
        }

        // GET: api/Authors
        [HttpGet]
        public async Task<ActionResult<IEnumerable<Author>>> GetAuthors()
        {
            var authors = await _context.Authors.Where(a=> a.Status == "Active" || a.Status == "Edit").ToListAsync();
            return Ok(new ApiResponses<Author> 
            {
                Success = true, 
                Message = "Successfully get", 
                Data = authors 
            });
        }

        // GET: api/Authors/5
        [HttpGet("{id}")]
        public async Task<ActionResult<Author>> GetAuthor(int id)
        {
            var author = await _context.Authors.FindAsync(id);


            if (author == null || author.Status != "Active" && author.Status != "Edit")
            {
                return NotFound();
            }

            return Ok(new ApiResponse<Author>
            {
                Success = true,
                Message = "Successfully get",
                Data = author
            });
        }

        // POST: api/Authors
        // To protect from overposting attacks, see https://go.microsoft.com/fwlink/?linkid=2123754
        [HttpPost("{id}")]
        public async Task<ActionResult<Author>> PostAuthor(int id, [FromBody] Author author)

        {
            if (author == null || string.IsNullOrWhiteSpace(author.Name))
            {
                return BadRequest(new ApiResponse<Author>
                {
                    Success = false,
                    Message = "Author data is invalid. Name cannot be empty.",
                    Data = author
                });
            }
            if (id == 0)
            {
                var authors = new Author
                {
                    Name = author.Name
                };
                _context.Authors.Add(authors);
                await _context.SaveChangesAsync();

                return CreatedAtAction("GetAuthor", new { id = author.Id }, new ApiResponse<Author>
                {
                    Success = true,
                    Message = "Author created successfully.",
                    Data = author
                });

            }
            else
            {
                var updateAuthor = await _context.Authors.FindAsync(id);
                if (updateAuthor == null)
                {
                    return NotFound();
                }


                // Update the author object with the values from the authorDto
                updateAuthor.Name = author.Name;

                // Set the author status to "Active" since it's being edited
                updateAuthor.Status = "Active";

                    // Update the author in the database
                    _context.Authors.Update(updateAuthor);
                    await _context.SaveChangesAsync();

                    return Ok(new ApiResponse<Author>
                    {
                        Success = true,
                        Message = "Author updated successfully.",
                        Data = author
                    });
                } 
            }

        // DELETE: api/Authors/5
        [HttpDelete("{id}")]
        public async Task<IActionResult> DeleteAuthor(int id)
        {
            var author = await _context.Authors.FindAsync(id);
            var bookLists = await _context.Books
                .Where(p => p.AuthorId == id)
                .ToListAsync();

            foreach (var bookList in bookLists)
            {
                bookList.Status = "Delete";
            }
            await _context.SaveChangesAsync(); //book save


            if (author == null)
            {
                return NotFound(new ApiResponse<Author> 
                { 
                    Success = false,
                    Message = "Author not found.",
                    Data = author
                });
            }

            //soft delete
            author.Status = "Delete";
            _context.Entry(author).State = EntityState.Modified;
            await _context.SaveChangesAsync();

            return Ok(new ApiResponse<Author> 
            { 
                Success = true,
                Message = "Author delete successfully.",
                Data = author
            });
        }

        private bool AuthorExists(int id)
        {
            return _context.Authors.Any(e => e.Id == id);
        }
    }
}
