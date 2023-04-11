using System.ComponentModel.DataAnnotations;

namespace cubemeter_api.Base
{
    public abstract class BaseDto
    {
        [Required]
        public long Id { get; set; }
    }
}