namespace TipTournament2._0.Utils
{
    using System;
    using System.Collections.Generic;
    using System.Linq;
    using System.Runtime.Serialization;
    using System.Threading.Tasks;

    [DataContract]
    public class OmikronStageOptions
    {
        [DataMember(Name = "TeamIds")]
        public string[] TeamIds { get; set; }
    }
}
