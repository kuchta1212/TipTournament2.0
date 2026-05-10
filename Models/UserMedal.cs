namespace TipTournament2._0.Models
{
    using System.ComponentModel.DataAnnotations;
    using System.ComponentModel.DataAnnotations.Schema;

    public class UserMedal
    {
        [Key]
        public string Id { get; set; }

        [Required]
        public string UserId { get; set; }

        [Required]
        public Tournament Tournament { get; set; }

        [Required]
        public MedalPlace Place { get; set; }
    }

    public enum Tournament
    {
        E20 = 0,
        E24 = 1,
        WC22 = 2
    }

    public enum MedalPlace
    {
        Gold = 0,
        Silver = 1,
        Bronze = 2
    }
}
