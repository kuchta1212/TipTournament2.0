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
            var data = await this.LoadData();

            foreach(var record in data)
            {
                var match = new Match()
                { 
                    HomeTeam = record.HomeTeam,
                    AwayTeam = record.AwayTeam,
                    Link = record.Link,
                    StartTime = DateTime.ParseExact(record.Date, "dd. M. yyyy", CultureInfo.InvariantCulture)
                        .AddHours(int.Parse(record.TimeOrResult.Split(':')[0]))
                        .AddMinutes(int.Parse(record.TimeOrResult.Split(':')[1]))
                };
                matches.Add(match);
            }
            return matches;
        }

        private async Task<List<HtmlRecord>> LoadData()
        {
            var records = new List<HtmlRecord>();
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
                foreach (var group in groups)
                {
                    var record = new HtmlRecord();
                    var index = 0;
                    foreach (var item in group.ChildNodes)
                    {
                        if (item.Name != "td")
                        {
                            continue;
                        }

                        if (item.HasClass("tal") && index == 0)
                        {
                            record.Date = item.InnerHtml;
                        }

                        if (item.HasClass("tac") && index == 1)
                        {
                            record.HomeTeam = item.InnerText;
                        }

                        if (item.HasClass("tac") && index == 2)
                        {
                            record.AwayTeam = item.InnerText;
                        }

                        if (item.HasClass("tac") && index == 3)
                        {
 
                            record.TimeOrResult = item.InnerText;
                            record.Link = item.ChildNodes.First().Attributes.First().Value;
                        }
                        index++;
                    }
                    records.Add(record);
                    if (records.Count == 36)
                    {
                        break;
                    }
                }
            }
            return records;
        }
    }
}
