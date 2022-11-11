namespace TipTournament2._0.Calculator
{
    using System;
    using System.Collections.Generic;
    using System.Linq;
    using System.Threading.Tasks;
    using TipTournament2._0.Models;

    public interface IBetResultMaker
    {
        List<MatchBet> UpdateBetResult(List<MatchBet> bets, Result result);

        List<GroupBet> UpdateGroupBetsResult(List<GroupBet> bets, GroupResult result);

        List<DeltaBet> UpdateDeltaBetsResult(List<DeltaBet> bets, Match match);
    }
}
