// index: digester for scoring procedure tsp28.

// IMPORTS

// Issue classification
const {issues} = require('../../score/tic31');
// Function to process files.
const fs = require('fs/promises');

// CONSTANTS

// Digester ID.
const id = 'tdp31';
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
const getScoreRow = (componentName, score) => `<tr><th>${componentName}</th><td>${score}</td></tr>`;
// Adds parameters to a query for a digest.
const populateQuery = (report, query) => {
  const {sources, jobData, score} = report;
  const {script, target, requester} = sources;
  const {scoreProcID, summary, details} = score;
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
  const rows = {
    summaryRows: [],
    issueRows: []
  };
  ['total', 'issue', 'tool', 'prevention', 'log', 'latency'].forEach(sumItem => {
    query[sumItem] = summary[sumItem];
    rows.summaryRows.push(getScoreRow(sumItem, query[sumItem]));
  });
  // Sort the issue IDs in descending score order.
  const issueIDs = Object.keys(details.issue);
  issueIDs.sort((a, b) => details.issue[b].score - details.issue[a].score);
  // Get rows for the issue-score table.
  issueIDs.forEach(issueID => {
    rows.issueRows.push(getScoreRow(issueID, details.issue[issueID].score));
  });
  // Add the rows to the query.
  ['summaryRows', 'issueRows'].forEach(rowType => {
    query[rowType] = rows[rowType].join(innerJoiner);
  });
  // Add paragraph groups about the issue details to the query.
  const issueDetailRows = [];
  issueIDs.forEach(issueID => {
    issueDetailRows.push(`<h3 class="bars">Issue <code>${issueID}</code></h3>`);
    issueDetailRows.push(`<p>WCAG: ${issues[issueID].wcag || 'N/A'}</p>`);
    const issueData = details.issue[issueID];
    issueDetailRows.push(`<p>Score: ${issueData.score}</p>`);
    const toolIDs = Object.keys(issueData.tools);
    toolIDs.forEach(toolID => {
      issueDetailRows.push(`<h4>Complaints by <code>${toolID}</code></h5>`);
      const ruleIDs = Object.keys(issueData.tools[toolID]);
      ruleIDs.forEach(ruleID => {
        const ruleData = issueData.tools[toolID][ruleID];
        issueDetailRows.push(`<h5>Rule <code>${ruleID}</code></h5>`);
        issueDetailRows.push(`<p>Description: ${ruleData.what}</p>`);
        issueDetailRows.push(`<p>Count of instances: ${ruleData.complaints.countTotal}</p>`);
        issueDetailRows.push('<h6>Complaint specifics</h6>');
        issueDetailRows.push('<ul>');
        ruleData.complaints.texts.forEach(text => {
          issueDetailRows.push(`  <li>${htmlEscape(text || '')}</li>`);
        });
        issueDetailRows.push('</ul>');
      });
    });
  });
  query.issueDetailRows = issueDetailRows.join(innerJoiner);
  // Add an HTML-safe copy of the report to the query to be appended to the digest.
  const reportJSON = JSON.stringify(report, null, 2);
  const reportJSONSafe = htmlEscape(reportJSON);
  query.report = reportJSONSafe;
};
// Returns a digested report.
exports.digester = async report => {
  // Create a query to replace placeholders.
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
