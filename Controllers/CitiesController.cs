using System;
using System.Threading.Tasks;
using System.Linq;
using System.Collections.Generic;

using Microsoft.EntityFrameworkCore;
using Microsoft.AspNetCore.Mvc;
using Microsoft.AspNetCore.Http;

using WorldCities.Data;
using WorldCities.Data.Models;


namespace WorldCities.Controllers
{
    [Route("api/[controller]")]
    [ApiController]
    public class CitiesController : ControllerBase
    {
        private readonly ApplicationDbContext _context;

        public CitiesController(ApplicationDbContext context)
        {
            _context = context;
        }

		//[HttpGet]
		//public async Task<ActionResult<ApiResult<City>>> GetCities(int pageIndex=0, int pageSize=10, string sortColumn=null, string sortOrder=null, string filterColumn=null, string filterQuery=null)
		//{
		//    return await ApiResult<City>.CreateAsync(_context.Cities, pageIndex, pageSize, sortColumn, sortOrder, filterColumn, filterQuery);
		//}

		[HttpGet]
		public async Task<ActionResult<IEnumerable<City>>> GetCities()
		{
			//return this.Ok(_context.Cities.Where(p => p.Lat >= 0));
			//return _context.Cities;
			return await _context.Cities.Where(p => p.Lat >= 0).ToListAsync();
        }

		[HttpGet("{id}")]
        public async Task<ActionResult<City>> GetCity(int id)
        {
            var city = await _context.Cities.FindAsync(id);

            if(city == null)
            {
                return NotFound();
            }

            return city;
        }

        [HttpPut("{id}")]
        public async Task<IActionResult> PutCity(int id, City city)
        {
            if(id != city.Id)
			{
				return BadRequest();
			}
			
			_context.Entry(city).State = EntityState.Modified;
			
			try
			{
				await _context.SaveChangesAsync();
			}
			
			catch (DbUpdateConcurrencyException)
			{
				if(!CityExists(id))
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
		public async Task<ActionResult<City>> PostCity(City city)
		{
			_context.Cities.Add(city);
			await _context.SaveChangesAsync();
			
			return CreatedAtAction("GetCity", new { id = city.Id }, city);
		}
		
		[HttpDelete("{id}")]
		public async Task<ActionResult<City>> DeleteCity(int id)
		{
			var city = await _context.Cities.FindAsync(id);
			if(city == null)
			{
				return NotFound();
			}
			
			_context.Cities.Remove(city);
			await _context.SaveChangesAsync();
			
			return NoContent();
		}
		
		private bool CityExists(int id)
		{
			return _context.Cities.Any(e => e.Id == id);
		}
    }
}
