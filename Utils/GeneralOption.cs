namespace TipTournament2._0.Utils
{
    using System.Collections.Generic;
    using System.Runtime.Serialization;
    using TipTournament2._0.Models;

    [DataContract]
    public class GeneralOption
    {
        [DataMember(Name = "finalMatchId")]
        public string FinalMatchId { get; set; }

        [DataMember(Name = "groupCount")]
        public int GroupCount { get; set; }

        [DataMember(Name = "matchCount")]
        public Dictionary<TournamentStage, int> MatchCount { get; set; }
    }
}
