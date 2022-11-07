namespace TipTournament2._0.Models
{
    using Microsoft.AspNetCore.Identity;
    using System;
    using System.Collections.Generic;
    using System.Linq;
    using System.Threading.Tasks;

    public class ApplicationUser : IdentityUser
    {
        public int TotalPoints { get; set; }

        public int AlfaPoints { get; set; }

        public int GamaPoints { get; set; }

        public int DeltaPoints { get; set; }

        public int LambdaPoints { get; set; }

        public int OmikronPoints { get; set; }

        public bool Payed { get; set; }
    }
}
