namespace TipTournament2._0.Utils
{
    using System.Runtime.Serialization;

    [DataContract]
    public class FeatureFlags
    {
        [DataMember(Name = "additionalDeltaEvaluation")]
        public bool AdditionalDeltaEvaluation { get; set; }
    }
}
