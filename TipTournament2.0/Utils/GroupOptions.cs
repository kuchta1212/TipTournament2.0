namespace TipTournament2._0.Utils
{
    using System;
    using System.Collections.Generic;
    using System.Linq;
    using System.Runtime.Serialization;
    using System.Threading.Tasks;

    [DataContract]
    public class GroupOptions
    {
        [DataMember(Name = "winner")]
        public string Winner { get; set; }

        [DataMember(Name = "runner")]
        public string Runner { get; set; }
    }
}
