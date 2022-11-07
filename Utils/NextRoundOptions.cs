namespace TipTournament2._0.Utils
{
    using System;
    using System.Collections.Generic;
    using System.Linq;
    using System.Runtime.Serialization;
    using System.Threading.Tasks;

    [DataContract]
    public class NextRoundOptions
    {
        [DataMember(Name = "matchId")]
        public string MatchId { get; set; }

        [DataMember(Name = "matches")]
        public List<string> Matches { get; set; }
    }
}
