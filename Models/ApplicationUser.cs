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

        // Plain-text recovery code for password reset. Admin can read this from
        // the admin UI and share it with users (no email pipeline). Acceptable
        // tradeoff for a small private friend pool — see auth flow design.
        public string RecoveryCode { get; set; }
    }
}
