namespace TipTournament2._0.Models
{
    using Microsoft.AspNetCore.Identity;
    using System;
    using System.Collections.Generic;
    using System.Linq;
    using System.Threading.Tasks;

    public class ApplicationUser : IdentityUser
    {
        public int Points { get; set; }

        public bool Payed { get; set; }
    }
}
