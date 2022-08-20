/*
  index: digester for scoring procedure spA11yMessage.
  Creator of parameters for substitution into index.html.
  Usage example for selected files in REPORTDIR_SCORED: node digest dpA11yMessage 35k1r
  Usage example for all files in REPORTDIR_SCORED: node digest dpA11yMessage
*/

// CONSTANTS

  // Newlines with indentations.
  const joiner = '\n      ';
  const innerJoiner = '\n        ';

// FUNCTIONS

// Makes strings HTML-safe.
const htmlEscape = textOrNumber => textOrNumber
.toString()
.replace(/&/g, '&amp;')
.replace(/</g, '&lt;');
// Gets a row of the score-summary table.
const getScoreRow = (component, score) => `<tr><th>${component}</th><td>${score}</td></tr>`;
// Adds parameters to a query for a digest.
exports.makeQuery = (report, query) => {
  // Add an HTML-safe copy of the host report to the query to be appended to the digest.
  const {script, host, score} = report;
  const reportJSON = JSON.stringify(report, null, 2);
  const reportJSONSafe = htmlEscape(reportJSON);
  query.report = reportJSONSafe;
  // Add the job data to the query.
  query.dateISO = report.endTime.slice(0, 10);
  query.dateSlash = query.dateISO.replace(/-/g, '/');
  if (host && host.what && host.which) {
    query.org = host.what;
    query.url = host.which;
  }
  else {
    const firstURLCommand = script.commands.find(command => command.type === 'url');
    if (firstURLCommand && firstURLCommand.what && firstURLCommand.which) {
      query.org = firstURLCommand.what;
      query.url = firstURLCommand.which;
    }
    else {
      console.log('ERROR: host missing or invalid');
      return;
    }
  }
  // Add the score data to the query.
  const scoreRows = [];
  Object.keys(score).forEach(scoreName => {
    scoreRows.push(getScoreRow(scoreName, score[scoreName]));
  });
  query.totalScore = score.total;
  query.scoreRows = scoreRows.join(innerJoiner);
};
