
namespace TipTournament2._0.Jobs
{
    using Quartz;
    using System;
    using System.Threading.Tasks;
    using TipTournament2._0.Coordinator;
    using TipTournament2._0.Data;

    public class CheckForResultsJob : IJob
    {
        private readonly IResultCoordinator coordinator;
        private readonly IDbContextWrapper contextWrapper;

        public CheckForResultsJob(IResultCoordinator coordinator, IDbContextWrapper contextWrapper)
        {
            this.coordinator = coordinator;
            this.contextWrapper = contextWrapper;
        }

        public Task Execute(IJobExecutionContext context)
        {
            throw new NotImplementedException();
            //try
            //{
            //    var amountOfUpdates = await this.coordinator.Coordinate();
            //    this.contextWrapper.StoreUpdateStatus(new Models.UpdateStatus() { Date = DateTime.Now, AmountOfUpdates = amountOfUpdates });
            //}
            //catch(Exception ex)
            //{
            //    this.contextWrapper.StoreUpdateStatus(new Models.UpdateStatus() { Date = DateTime.Now, ErrorMessage = ex.ToString() });
            //}
            
        }

    }
}
