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
    public class CategoriesController : ControllerBase
    {
        private readonly LibraryDbContext _context;

        public CategoriesController(LibraryDbContext context)
        {
            _context = context;
        }

        // GET: api/Categories
        [HttpGet]
        public async Task<ActionResult<IEnumerable<Category>>> GetCategories()
        {
            var categories= await _context.Categories.Where(a => a.Status == "Active" || a.Status == "Edit").OrderByDescending(x=>x.Id).ToListAsync();
            return Ok(
                new ApiResponses<Category>
                {
                    Success = true,
                    Message = "Category get successfully",
                    Data = categories
                });
        }

        // GET: api/Categories/5
        // GET: api/Authors/5
        [HttpGet("{id}")]
        public async Task<ActionResult<Category>> GetCategory(int id)
        {
            var category = await _context.Categories.FindAsync(id);


            if (category == null || category.Status != "Active" && category.Status != "Edit")
            {
                return NotFound(new ApiResponse<Category>
                {
                    Success= false,
                    Message = "Category not found",
                    Data = null
                });
            }

            return Ok(new ApiResponse<Category>
            {
                Success = true,
                Message = "Category get successfully",
                Data = category
            });
        }

        [HttpPost("{id}")]
        public async Task<ActionResult<Category>> PostCategory(int id, [FromBody] Category category)
        {

            if (category == null || string.IsNullOrWhiteSpace(category.Name))
            {
                return BadRequest(new ApiResponse<Category>
                {
                    Success = false,
                    Message = "Category data is invalid. Name cannot be empty.",
                    Data = category
                });
            }


            var item = await _context.Categories.Where(x => x.Status == "Active" && x.Name == category.Name).FirstOrDefaultAsync();
            if (item != null)
            {
                return BadRequest(new ApiResponse<Category>
                {
                    Success = false,
                    Message = "This Category name do not allow!",
                    Data = item
                });
            }
           
                var updateCategory = await _context.Categories.FindAsync(id);
                if (updateCategory == null)
                {
                    return BadRequest(new ApiResponse<Category>
                    {
                        Success = false,
                        Message = "Category data is invalid. Name cannot be empty.",
                        Data = null
                    });
                }

                // Update the category object with the values from the categoryDto
                updateCategory.Name = category.Name;

                // Set the category status to "Active" since it's being edited
                updateCategory.Status = "Active";
                _context.Categories.Update(updateCategory);
                await _context.SaveChangesAsync();

                return Ok(new ApiResponse<Category>
                {
                    Success = true,
                    Message = "Category updated successfully.",
                    Data = category
                });
            }
        
        





        [HttpPost]
        public async Task<ActionResult<CategoryDto>> PostCategory(CategoryDto categoryDto)
        {
            if (categoryDto == null || string.IsNullOrWhiteSpace(categoryDto.Name))
            {
                return BadRequest(new ApiResponse<CategoryDto>
                {
                    Success = false,
                    Message = "Category data is invalid. Name cannot be empty.",
                    Data = categoryDto
                });
            }

            var item = await _context.Categories.Where(x => x.Status == "Active" && x.Name == categoryDto.Name).FirstOrDefaultAsync();
            if (item != null)
            {
                return BadRequest(new ApiResponse<Category>
                {
                    Success = false,
                    Message = "This Category name do not allow!",
                    Data = item
                });
            }
            var category = new Category
            {
                Name = categoryDto.Name
            };
            category.Status = "Active"; // Set default status
            category.CreatedDate = DateTime.Now; // Set created date

            _context.Categories.Add(category);
            await _context.SaveChangesAsync();

            int latestId = category.Id;

            
            if (categoryDto.book != null)    //Want to add new Book
            {
                foreach (var bookDto in categoryDto.book)
                {
                    var New_book = new Book
                    {
                        Title = bookDto.Title,
                        AuthorId = bookDto.AuthorId,
                        CategoryId = latestId,
                        PublicationDate = bookDto.PublicationDate,
                        Price = bookDto.Price,
                        Status = "Active", // Set the default status
                        CreatedDate = DateTime.Now // Set the created date
                    };
                    _context.Books.Add(New_book);
                    await _context.SaveChangesAsync();

                }
            }

            //return CreatedAtAction("GetCategory", new { id = category.Id }, new ApiResponse<Category>
            //{
            //    Success = true,
            //    Message = "Category created successfully.",
            //    Data = category
            //});

            return Ok(new ApiResponse<CategoryDto>
            {
                Success = true,
                Message = "Category created Successfully",
                Data = categoryDto
            });

        }
        // DELETE: api/Categories/5
        [HttpDelete("{id}")]
        public async Task<IActionResult> DeleteCategory(int id)
        {
            var category = await _context.Categories.FindAsync(id);
            var bookLists = await _context.Books
                .Where(p => p.CategoryId == id)
                .ToListAsync();

            foreach (var bookList in bookLists)
            {
                bookList.Status = "Delete";
            }
            await _context.SaveChangesAsync(); //book save
            if (category == null)
            {
                return NotFound(new ApiResponse<Category> 
                {
                    Success = false,
                    Message = "Category not found",
                    Data = category
                });
            }

            // Soft delete by changing the status
            category.Status = "Delete";
            _context.Entry(category).State = EntityState.Modified;
            await _context.SaveChangesAsync(); // category save

            return Ok(new ApiResponse<Category>
            {
                Success = true,
                Message = "Category deleted successfully.",
                Data = category
            });
        }

        private bool CategoryExists(int id)
        {
            return _context.Categories.Any(e => e.Id == id);
        }
    }
}
