namespace TipTournament2._0.Models
{
    using System;
    using System.Collections.Generic;

    public class DeadlineInfo
    {
        public DateTime TournamentStart { get; set; }
        public Dictionary<TournamentStage, DateTime> StageDeadlines { get; set; }
    }
}
