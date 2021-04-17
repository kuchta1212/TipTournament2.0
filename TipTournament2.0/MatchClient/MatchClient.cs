namespace TipTournament2._0.MatchClient
{
    using HtmlAgilityPack;
    using System;
    using System.Collections.Generic;
    using System.Globalization;
    using System.Linq;
    using System.Net;
    using System.Net.Http;
    using System.Text;
    using System.Text.RegularExpressions;
    using System.Threading.Tasks;
    using TipTournament2._0.Models;

    public class MatchClient : IMatchClient
    {
        private const string Uri = "https://www.idnes.cz/fotbal/databanka/euro-2021-los.Umli48513";
        private readonly Regex regex;

        public MatchClient()
        {
            this.regex = new Regex(@"(\d*):(\d*)");
        }

        public async Task<List<Models.Match>> CheckForUpdates(List<Models.Match> matches)
        {
            var updatedMatches = new List<Models.Match>();
            var data = await this.LoadData();
            foreach(var match in matches)
            {
                var record = data.First(r => r.HomeTeam == match.HomeTeam && r.AwayTeam == match.AwayTeam);

                var regexMatch = this.regex.Match(record.TimeOrResult);
                if (!regexMatch.Success)
                {
                    //some issue, should not happen hopefully :D 
                    continue;
                }

                var home = int.Parse(regexMatch.Groups[1].Value);
                var away = int.Parse(regexMatch.Groups[2].Value);

                if ( match.Result == null && match.StartTime.Hour == home && match.StartTime.Minute == away)
                {
                    //match was still not played or even started
                    continue;
                }

                if(!record.TimeOrResult.Contains("!"))
                {
                    match.Ended = true;
                }

                var result = match.Result ?? new Result();
                result.HomeTeam = home;
                result.AwayTeam = away;

                if(match.Result == null)
                {
                    match.Result = result;
                }

                updatedMatches.Add(match);
            }

            return updatedMatches;
        }

        public Task<Result> GetResult(Models.Match match)
        {
            throw new NotImplementedException();
        }

        public async Task<List<Models.Match>> LoadMatches()
        {
            var matches = new List<Models.Match>();
            var data = await this.LoadData();

            foreach(var record in data)
            {
                var match = new Models.Match()
                {
                    HomeTeam = record.HomeTeam,
                    AwayTeam = record.AwayTeam,
                    Link = record.Link,
                    StartTime = DateTime.ParseExact(record.Date, "dd. M. yyyy", CultureInfo.InvariantCulture)
                        .AddHours(int.Parse(record.TimeOrResult.Split(':')[0]))
                        .AddMinutes(int.Parse(record.TimeOrResult.Split(':')[1])),
                    Ended = false
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
