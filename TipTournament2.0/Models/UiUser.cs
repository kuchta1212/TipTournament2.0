namespace TipTournament2._0.Models
{
    using System;
    using System.Collections.Generic;
    using System.Linq;
    using System.Threading.Tasks;

    public class UiUser
    {
        public string Id { get; set; }

        public string UserName { get; set; }

        public int Points { get; set; }

        public bool Payed { get; set; }

        public static UiUser FromApplicationUser(ApplicationUser appUser)
        {
            return new UiUser()
            {
                Id = appUser.Id,
                UserName = appUser.UserName,
                Points = appUser.Points,
                Payed = appUser.Payed
            };
        }
    }
}
