// index: digester for scoring procedure tsp27.

// IMPORTS

// Issue classification
const {issueClasses} = require('../../score/tic27');
// Function to process files.
const fs = require('fs/promises');

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
const populateQuery = (report, query) => {
  const {sources, jobData, score} = report;
  const {script, target, requester} = sources;
  const {scoreProcID, summary, details} = score;
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
  // Add values for the score-summary table to the query.
  ['total', 'issue', 'tool', 'prevention', 'log', 'latency'].forEach(sumItem => {
    query[sumItem] = summary[sumItem];
  });
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
  Object.keys(details.issue).forEach(issueID => {
    rows.issueRows.push(getScoreRow(issueID, details.issue[issueID].score));
  });
  // Add the rows to the query.
  ['summaryRows', 'issueRows'].forEach(rowType => {
    query[rowType] = rows[rowType].join(innerJoiner);
  });
  // Add paragraphs about the issues to the query.
  const issueSummaryItems = [];
  Object.keys(details.issue).forEach(issueID => {
    const issueHeading = `<h4>Issue ${issueID}</h4>`;
    const wcagP = `<p>WCAG: ${issueClasses[issueID].wcag || 'N/A'}</p>`;
    const scoreP = `<p>Score: ${details.issue[issueID]}</p>`;
    const issueIntroP = '<p>Issue reports in this category:</p>';
    const issueListItems = [];
    const issueData = details.issue[issueID];
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
  // Add an HTML-safe copy of the report to the query to be appended to the digest.
  const reportJSON = JSON.stringify(report, null, 2);
  const reportJSONSafe = htmlEscape(reportJSON);
  query.report = reportJSONSafe;
};
// Returns a digested report.
exports.digester = async report => {
  // Create a query to replace plateholders.
  const query = {};
  populateQuery(report, query);
  // Get the template.
  let template = await fs.readFile(`${__dirname}/index.html`, 'utf8');
  // Replace its placeholders.
  Object.keys(query).forEach(param => {
    template = template.replace(new RegExp(`__${param}__`, 'g'), query[param]);
  });
  // Return the digest.
  return template;
};
