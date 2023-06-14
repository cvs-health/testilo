/*
  index: digester for scoring procedure tsp27.
  Creator of parameters for substitution into index.html.
*/

// IMPORTS

const {issueClasses} = require('../../score/tic27');

// CONSTANTS

// Digester ID.
const id = 'tdp27';
// Newlines with indentations.
const joiner = '\n      ';
const innerJoiner = '\n        ';

// FUNCTIONS

// Makes strings HTML-safe.
const htmlEscape = textOrNumber => textOrNumber
.toString()
.replace(/&/g, '&amp;')
.replace(/</g, '&lt;')
.replace(/"/g, '&quot;');
// Gets a row of the score-summary table.
const getScoreRow = (componentName, score) => `<tr><th>${componentName}</th><td>${score}</td></tr>`;
// Adds parameters to a query for a digest.
exports.makeQuery = (report, query) => {
  // Add an HTML-safe copy of the report to the query to be appended to the digest.
  const {sources, jobData, score} = report;
  const {script, target, requester} = sources;
  const reportJSON = JSON.stringify(report, null, 2);
  const reportJSONSafe = htmlEscape(reportJSON);
  query.report = reportJSONSafe;
  const {scoreProcID, summary, issues} = score;
  const {total} = summary;
  query.ts = script;
  query.sp = scoreProcID;
  query.dp = id;
  // Add the job data to the query.
  query.dateISO = jobData.endTime.slice(0, 10);
  query.dateSlash = query.dateISO.replace(/-/g, '/');
  query.org = target.what;
  query.url = target.which;
  query.requester = requester;
  // Add the total score to the query.
  if (typeof total === 'number') {
    query.totalScore = total;
  }
  else {
    console.log('ERROR: missing or invalid total score');
    return;
  }
  // Get rows for a score-summary table.
  const rows = {
    summaryRows: [],
    issueRows: []
  };
  const componentIDs = ['issues', 'tools', 'preventions', 'log', 'latency'];
  ['total'].concat(componentIDs).forEach(itemID => {
    if (summary[itemID]) {
      rows.summaryRows.push(getScoreRow(itemID, summary[itemID]));
    }
  });
  // Get rows for an issue-score table.
  Object.keys(issues).forEach(issueID => {
    rows.issueRows.push(getScoreRow(issueID, issues[issueID]));
  });
  // Add the rows to the query.
  ['summaryRows', 'issueRows'].forEach(rowType => {
    query[rowType] = rows[rowType].join(innerJoiner);
  });
  // Add paragraphs about the issues to the query.
  const issueSummaryItems = [];
  Object.keys(issues).forEach(issueID => {
    const issueHeading = `<h4>Issue ${issueID}</h4>`;
    const wcagP = `<p>WCAG: ${issueClasses[issueID].wcag || 'N/A'}</p>`;
    const scoreP = `<p>Score: ${issues[issueID]}</p>`;
    const issueIntroP = '<p>Issue reports in this category:</p>';
    const issueListItems = [];
    const issueData = issueDetails.issues[issueName];
    const toolIDs = Object.keys(issueData.tools);
    toolIDs.forEach(toolID => {
      const testIDs = Object.keys(issueData.tools[toolID]);
      testIDs.forEach(testID => {
        const testData = issueData.tools[toolID][testID];
        const {score, what} = testData;
        const listItem =
          `<li>Package <code>${toolID}</code>, test <code>${testID}</code>, score ${score} (${what})</li>`;
        issueListItems.push(listItem);
      });
    });
    const issueList = [
      '<ul>',
      issueListItems.join('\n  '),
      '</ul>'
    ].join(joiner);
    issueSummaryItems.push(issueHeading, wcagP, scoreP, issueIntroP, issueList);
  });
  query.issueSummary = issueSummaryItems.join(joiner);
};
