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
            return await _context.Categories.Where(a => a.Status == "Active" || a.Status == "Edit").ToListAsync();
        }

        // GET: api/Categories/5
        // GET: api/Authors/5
        [HttpGet("{id}")]
        public async Task<ActionResult<Category>> GetCategory(int id)
        {
            var category = await _context.Categories.FindAsync(id);


            if (category == null || category.Status != "Active" && category.Status != "Edit")
            {
                return NotFound();
            }

            return category;
        }

        // PUT: api/Categories/5
        // To protect from overposting attacks, see https://go.microsoft.com/fwlink/?linkid=2123754
        /*[HttpPut("{id}")]
        public async Task<IActionResult> PutCategory(int id, Category category)
        {
            if (id != category.Id)
            {
                return BadRequest();
            }

            _context.Entry(category).State = EntityState.Modified;

            try
            {
                await _context.SaveChangesAsync();
            }
            catch (DbUpdateConcurrencyException)
            {
                if (!CategoryExists(id))
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

        // POST: api/Categories
        // To protect from overposting attacks, see https://go.microsoft.com/fwlink/?linkid=2123754
        /*[HttpPost]
        public async Task<ActionResult<Category>> PostCategory(Category category)
        {
            if (category == null || string.IsNullOrWhiteSpace(category.Name))
            {
                return BadRequest("Category data is invalid. Name cannot be empty.");
            }
            else
            {
                _context.Categories.Add(category);
                await _context.SaveChangesAsync();

                return CreatedAtAction("GetCategory", new { id = category.Id }, category);
            }
            
        }*/

        /*[HttpPut("{id}")]
        public async Task<IActionResult> PutCategory(int id, Category category)
        {
            if (id != category.Id)
            {
                return BadRequest();
            }

            var existingCategory = await _context.Categories.AsNoTracking().FirstOrDefaultAsync(c => c.Id == id);

            if (existingCategory == null)
            {
                return NotFound();
            }

            // Preserve CreatedDate
            category.CreatedDate = existingCategory.CreatedDate;

            _context.Entry(category).State = EntityState.Modified;

            try
            {
                await _context.SaveChangesAsync();
            }
            catch (DbUpdateConcurrencyException)
            {
                if (!CategoryExists(id))
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
*/

        [HttpPut("{id}")]
        public async Task<IActionResult> PutCategory(int id, CategoryDto categoryDto)
        {
            // Find the category in the database
            var category = await _context.Categories.FindAsync(id);
            if (category == null)
            {
                return NotFound();
            }

            // Update the category object with the values from the categoryDto
            category.Name = categoryDto.Name;

            // Set the category status to "Active" since it's being edited
            category.Status = "Edit";

            // Update the category in the database
            _context.Entry(category).State = EntityState.Modified;

            try
            {
                await _context.SaveChangesAsync();
            }
            catch (DbUpdateConcurrencyException)
            {
                if (!CategoryExists(id))
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
        [HttpPost]
        public async Task<ActionResult<CategoryDto>> PostCategory(CategoryDto categoryDto)
        {
            if (categoryDto == null || string.IsNullOrWhiteSpace(categoryDto.Name))
            {
                return BadRequest("Category data is invalid. Name cannot be empty.");
            }

            var item = await _context.Categories.Where(x => x.Status == "Active" && x.Name==categoryDto.Name).FirstOrDefaultAsync();
            if (item != null)
            {
                return BadRequest("This Category name do not allow!");
            }
            var category = new Category
            {
                Name = categoryDto.Name
            };
            category.Status = "Active"; // Set default status
            category.CreatedDate = DateTime.Now; // Set created date

            _context.Categories.Add(category);
            await _context.SaveChangesAsync();

            return CreatedAtAction("GetCategory", new { id = category.Id }, category);
        }

        /*[HttpPost]
        public async Task<ActionResult<CategoryDto>> PostCategory(CategoryDto categoryDto)
        {
            if (categoryDto == null || string.IsNullOrWhiteSpace(categoryDto.Name))
            {
                return BadRequest("Category data is invalid. Name cannot be empty.");
            }

            // Check if a category with the same name exists
            var existingCategory = await _context.Categories
                .FirstOrDefaultAsync(c => c.Name == categoryDto.Name);

            if (existingCategory != null)
            {
                // If the category exists but is not active, update its status and other properties
                if (existingCategory.Status != "Active")
                {
                    existingCategory.Status = "Active"; // Update the status to Active
                    existingCategory.CreatedDate = DateTime.Now; // Update the created date
                                                                 // Update other properties as needed
                    await _context.SaveChangesAsync();
                    return Ok(existingCategory); // Return the updated category
                }
                else
                {
                    return BadRequest("A category with the same name already exists and is active.");
                }
            }
            else
            {
                // Create a new category if it does not exist
                var category = new Category
                {
                    Name = categoryDto.Name,
                    Status = "Active", // Set default status
                    CreatedDate = DateTime.Now // Set created date
                };

                _context.Categories.Add(category);
                await _context.SaveChangesAsync();

                return CreatedAtAction("GetCategory", new { id = category.Id }, category);
            }
        }*/
        /*[HttpPost]
        public async Task<ActionResult<CategoryDto>> PostCategory(CategoryDto categoryDto)
        {
            if (categoryDto == null || string.IsNullOrWhiteSpace(categoryDto.Name))
            {
                return BadRequest("Category data is invalid. Name cannot be empty.");
            }

            // Check if an active category with the same name exists
            var existingActiveCategory = await _context.Categories
                .FirstOrDefaultAsync(c => c.Name == categoryDto.Name && c.Status == "Active");

            if (existingActiveCategory != null)
            {
                return BadRequest("A category with the same name already exists and is active.");
            }

            // Check if a category with the same name exists but is not active
            var existingInactiveCategory = await _context.Categories
                .FirstOrDefaultAsync(c => c.Name == categoryDto.Name && c.Status != "Active");

            if (existingInactiveCategory != null)
            {
                // If an inactive category with the same name exists, create a new category with the same name
                var newCategory = new Category
                {
                    Name = categoryDto.Name,
                    Status = "Active", // Set default status
                    CreatedDate = DateTime.Now // Set created date
                };

                _context.Categories.Add(newCategory);
                await _context.SaveChangesAsync();

                return CreatedAtAction("GetCategory", new { id = newCategory.Id }, newCategory);
            }
            else
            {
                // If no category with the same name exists, create a new category
                var category = new Category
                {
                    Name = categoryDto.Name,
                    Status = "Active", // Set default status
                    CreatedDate = DateTime.Now // Set created date
                };

                _context.Categories.Add(category);
                await _context.SaveChangesAsync();

                return CreatedAtAction("GetCategory", new { id = category.Id }, category);
            }
        }*/


        /*[HttpPost]
        public async Task<ActionResult<CategoryDto>> PostCategory(CategoryDto categoryDto)
        {
           var item = await _context.Categories.Where(x=>x.Name== categoryDto.Name  || x.Status=="Active").FirstOrDefaultAsync();

            if (item != null || item.Id == 0)
            {
                var data = new Category()
                {
                    Name = categoryDto.Name,
                    Status = "Active",
                    CreatedDate = DateTime.Now,
                };
                _context.Categories.Add(data);
                await _context.SaveChangesAsync();
                return Ok("Added successfully");

            }

            return BadRequest();

        }
*/
        // DELETE: api/Categories/5
        [HttpDelete("{id}")]
        public async Task<IActionResult> DeleteCategory(int id)
        {
            var category = await _context.Categories.FindAsync(id);
            if (category == null)
            {
                return NotFound();
            }

            // Soft delete by changing the status
            category.Status = "Delete";
            _context.Entry(category).State = EntityState.Modified;
            await _context.SaveChangesAsync();

            return NoContent();
        }

        private bool CategoryExists(int id)
        {
            return _context.Categories.Any(e => e.Id == id);
        }
    }
}
