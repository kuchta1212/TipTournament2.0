using HtmlAgilityPack;
using System;
using System.Collections.Generic;
using System.Globalization;
using System.Linq;
using System.Net;
using System.Net.Http;
using System.Text;
using System.Threading.Tasks;
using TipTournament2._0.Models;

namespace TipTournament2._0.MatchClient
{
    public class MatchClient : IMatchClient
    {
        private const string Uri = "https://www.idnes.cz/fotbal/databanka/euro-2021-los.Umli48513";

        public Task<Dictionary<Match, Result>> CheckForUdpates()
        {
            throw new NotImplementedException();
        }

        public Task<Result> GetResult(Match match)
        {
            throw new NotImplementedException();
        }

        public async Task<List<Match>> LoadMatches()
        {
            var matches = new List<Match>();
            var httpClient = new HttpClient();
            var response = await httpClient.GetAsync(Uri);

            if (response.StatusCode == HttpStatusCode.OK)
            {
                var contenttype = response.Content.Headers.First(h => h.Key.Equals("Content-Type"));
                var rawencoding = contenttype.Value.First();

                var bytes = await response.Content.ReadAsByteArrayAsync();
                var html = Encoding.UTF8.GetString(bytes);
  
                var htmlDocument = new HtmlDocument();
                htmlDocument.LoadHtml(html);
                var htmlNode = htmlDocument.GetElementbyId("table-los");
                var groups = htmlNode.SelectNodes("//tr[@class='r1']");
                foreach(var group in groups)
                {
                    var match = new Match();
                    var index = 0;
                    foreach(var item in group.ChildNodes)
                    {
                        if(item.Name != "td")
                        {
                            continue;
                        }

                        if (item.HasClass("tal") && index == 0)
                        {
                            match.StartTime = DateTime.ParseExact(item.InnerHtml, "dd. M. yyyy", CultureInfo.InvariantCulture);
                        }

                        if (item.HasClass("tac") && index == 1)
                        {
                            match.HomeTeam = item.InnerText;
                        }
                        
                        if (item.HasClass("tac") && index == 2)
                        {
                            match.AwayTeam = item.InnerText;
                        }

                        if (item.HasClass("tac") && index == 3)
                        {
                            //time
                            var time = item.InnerText;
                            match.StartTime = match.StartTime.AddHours(int.Parse(time.Split(':')[0])).AddMinutes(int.Parse(time.Split(':')[1]));
                            match.Link = item.ChildNodes.First().Attributes.First().Value;
                        }
                        index++;
                    }
                    matches.Add(match);
                    if(matches.Count == 36)
                    {
                        break;
                    }
                }
            }
            return matches;
        }
    }
}
