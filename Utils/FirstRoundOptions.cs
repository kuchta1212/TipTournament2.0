namespace TipTournament2._0.Utils
{
    using System;
    using System.Collections.Generic;
    using System.Linq;
    using System.Runtime.Serialization;
    using System.Threading.Tasks;

    [DataContract]
    public class FirstRoundOptions
    {
        [DataMember(Name = "matchId")]
        public string MatchId { get; set; }

        [DataMember(Name = "home")]
        public TeamOption Home { get; set; }

        [DataMember(Name = "away")]
        public TeamOption Away { get; set; }
    }
}
