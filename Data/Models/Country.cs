using System;
using System.Collections.Generic;
using System.ComponentModel.DataAnnotations;
using System.ComponentModel.DataAnnotations.Schema;
using System.Linq;
using System.Threading.Tasks;
using System.Text.Json.Serialization;

namespace WorldCities.Data.Models
{
    [Table("Countries")]
    public class Country
    {
        #region Constructor
        public Country()
        {
        }
        #endregion
        #region Properties
        /// <summary>
        /// unique id
        /// </summary>
        [Key]
        [Required]
        public int Id { get; set; }

        /// <summary>
        /// Name
        /// </summary>
        public string Name { get; set; }

        /// <summary>
        /// iso2 code
        /// </summary>
        [JsonPropertyName("ISO2")]
        public string ISO2 { get; set; }

        /// <summary>
        /// iso3 code
        /// </summary>
        [JsonPropertyName("ISO3")]
        public string ISO3 { get; set; }
        #endregion

        #region Navigation Properties
        /// <summary>
        /// list containing of this country's cities
        /// </summary>
        public virtual List<City> Cities { get; set; }
        #endregion
    }
}