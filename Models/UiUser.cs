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

        public int TotalPoints { get; set; }

        public int AlfaPoints { get; set; }

        public int GamaPoints { get; set; }

        public int DeltaPoints { get; set; }

        public int LambdaPoints { get; set; }

        public int OmikronPoints { get; set; }

        public bool Payed { get; set; }

        public List<UiUserMedal> Medals { get; set; } = new List<UiUserMedal>();

        public static UiUser FromApplicationUser(ApplicationUser appUser, List<UserMedal> medals = null)
        {
            return new UiUser()
            {
                Id = appUser.Id,
                UserName = appUser.UserName,
                TotalPoints = appUser.TotalPoints,
                AlfaPoints = appUser.AlfaPoints,
                GamaPoints = appUser.GamaPoints,
                DeltaPoints = appUser.DeltaPoints,
                LambdaPoints = appUser.LambdaPoints,
                OmikronPoints = appUser.OmikronPoints,
                Payed = appUser.Payed,
                Medals = (medals ?? new List<UserMedal>())
                    .Select(m => new UiUserMedal { Tournament = m.Tournament, Place = m.Place })
                    .ToList()
            };
        }
    }

    public class UiUserMedal
    {
        public Tournament Tournament { get; set; }
        public MedalPlace Place { get; set; }
    }
}
