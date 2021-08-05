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

        #region Client-side properties
        /// <summary>
        /// Third option for the counting of cities per each country
        ///     1: CountryDTO entity class ( Data Transfer Object )
        ///     2: dynamic anonymity ( on the go )
        ///         cons:   a. scalability
        ///     3: this region ( secured entities )
        ///         cons:   a. entities are meant to be object wrappers for objects and views
        ///                 b. data is large
        ///                 
        ///                 :: method too specific but not meant for flexibiltiy // kitchen sink
        ///                 
        /// 
        /// The number of cities related to this country.
        /// </summary>
        [NotMapped] // to not update in the db
        public int TotCities
        { 
        get
            {
                return (Cities != null)
                    ?Cities.Count
                    :_TotCities;
            }
            set { _TotCities = value; }
        }
        private int _TotCities = 0;
        #endregion

        #region Navigation Properties
        /// <summary>
        /// list containing of this country's cities
        /// </summary>
        [JsonIgnore]
        public virtual List<City> Cities { get; set; }
        #endregion
    }
}