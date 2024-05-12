namespace TipTournament2._0.Utils
{
    using System;
    using System.Collections.Generic;
    using System.Linq;
    using System.Runtime.Serialization;
    using System.Threading.Tasks;

    [DataContract]
    public class TeamOption
    {
        [DataMember(Name = "type")]
        public TeamOptionType Type { get; set; }

        [DataMember(Name = "groupId")]
        public string GroupId { get; set; }

        [DataMember(Name = "groupIds")]
        public string[] GroupIds { get; set; }
    }

    public enum TeamOptionType
    {
        Winner,
        Runner,
        BestOfThree
    }
}
