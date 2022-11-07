namespace TipTournament2._0.Utils
{
    using System;
    using System.Collections.Generic;
    using System.Linq;
    using System.Runtime.Serialization;
    using System.Threading.Tasks;

    [DataContract]
    public class DeltaStageOptions
    {
        [DataMember(Name = "FirstRound")]
        public FirstRoundOptions[] FirstRound { get; set; }

        [DataMember(Name = "Next")]
        public NextRoundOptions[] NextRounds { get; set; }
    }
}
