function sleep(ms) {
  return new Promise(resolve => setTimeout(resolve, ms));
}

function findTournaments() {
  const tourneys = Array.from(document.querySelectorAll(".styles__draftPoolTournamentCell__t5vYo"));
  return tourneys;
}

function clickBack() {
  const back = document.querySelector(".styles__backRow__anE4_")
  return back;
}

function exportToCSV(filename, csvData) {
  const csvBlob = new Blob([csvData], { type: "text/csv" });
  const csvURL = URL.createObjectURL(csvBlob);

  const a = document.createElement("a");
  a.href = csvURL;
  a.download = filename;

  a.style.display = "none";
  document.body.appendChild(a);
  a.click();

  // Cleanup
  document.body.removeChild(a);
  URL.revokeObjectURL(csvURL);
}

async function findDivs() {

  var tournament_info = [['Entry Number', 'Lineup Players', 'Winnings', 'Place', 'Tournament Name', 'Entry Value', 'Sport',
    'Entrants', 'Fill %', 'Slate', 'Max Entries', 'Draft Size', 'Draft Rounds',
    'Rake', 'Start Time']];

  
  document.querySelector(".styles__infoIcon__Ac3ZD").click();
  await sleep(750);
  var tourney_info = [];

  var tourney_name = document.querySelector(".styles__title__ZrO6C").textContent.trim();
  tourney_info.push(tourney_name);

  var entry_value = document.querySelector(".styles__entryInfoValue__qx_JF").textContent.trim();
  tourney_info.push(entry_value);
  
  var raw_tourney_info = document.querySelectorAll(".styles__infoValue__F0R73")

  var sport = raw_tourney_info[0].textContent.trim();
  tourney_info.push(sport);
  var entrants = raw_tourney_info[1].textContent.trim().replace(',','');
  tourney_info.push(entrants);
  var fill = raw_tourney_info[2].textContent.trim();
  tourney_info.push(fill);
  var slate = raw_tourney_info[3].textContent.trim();
  tourney_info.push(slate);
  var max_entries = raw_tourney_info[5].textContent.trim();
  tourney_info.push(max_entries);
  var draft_size = raw_tourney_info[6].textContent.trim();
  tourney_info.push(draft_size);
  var draft_rounds = raw_tourney_info[7].textContent.trim();
  tourney_info.push(draft_rounds);
  var rake = raw_tourney_info[8].textContent.trim();
  tourney_info.push(rake);
  var start_time = raw_tourney_info[9].textContent.trim();
  tourney_info.push(start_time);


  document.querySelector(".styles__closeButton__ZYuEF").click();
  await sleep(750);

  // Gather individual lineup information
  var lineups = Array.from(document.querySelectorAll(".styles__draftPoolTeamCell__Qapze"));

  if (lineups.length > 0) {
    for (let LineupIndex = 0; LineupIndex < lineups.length; LineupIndex++) {
      var lineup_info = lineups[LineupIndex].querySelector(".styles__colorBar__aqn_e");
      var finish_pos = lineup_info.getElementsByTagName('p')[0].textContent.trim();
      var winnings = Array.from(lineup_info.childNodes)
        .filter(node => node.nodeType === 3) // Filter out non-text nodes
        .map(node => node.textContent.trim())
        .join(' ').replace(',','');
      var lineup_players = lineups[LineupIndex].querySelector(".styles__players__UkT6g").textContent.trim();
      var lineup_players = lineup_players.replace(/,/g, ' / ');
      console.log(lineup_players)
      var lineup_index = LineupIndex + 1;

      var lineup_temp = [];
      lineup_temp.push(lineup_index, lineup_players, winnings, finish_pos);
      var lineup_temp = lineup_temp.concat(tourney_info)
      tournament_info.push(lineup_temp);
    };
  }
  exportToCSV("Results", tournament_info.join("\n"));
  return; // Use return to exit the findDivs function
}

chrome.storage.sync.get(['startdate', 'stopdate'], async function (data) {
  const start = data.startdate || "2020-01-01";
  const stop = data.stopdate || "2020-01-02";
  console.log(`Start Date: ${start}, Stop Date: ${stop}`);
  await findDivs(start, stop);
});
