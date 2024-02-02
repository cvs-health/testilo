// index: digester for scoring procedure tsp40.

// IMPORTS

// Module to keep secrets.
require('dotenv').config();
// Module to classify tool rules into issues
const {issues} = require('../../score/tic40');
// Module to process files.
const fs = require('fs/promises');

// CONSTANTS

// Digester ID.
const digesterID = 'tdp40';
// Newline with indentations.
const innerJoiner = '\n        ';

// FUNCTIONS

// Gets a row of the score-summary table.
const getScoreRow = (componentName, score) => `<tr><th>${componentName}</th><td>${score}</td></tr>`;
// Gets a row of the issue-score-summary table.
const getIssueScoreRow = (summary, wcag, score, tools) => {
  const toolList = tools.map(tool => `<code>${tool}</code>`).join(', ');
  return `<tr><th>${summary}</th><td>${wcag}<td>${score}</td><td>${toolList}</td></tr>`;
};
// Adds parameters to a query for a digest.
const populateQuery = (report, query) => {
  const {id, sources, jobData, score} = report;
  const {script, target, requester} = sources;
  const {scoreProcID, summary, details} = score;
  query.ts = script;
  query.sp = scoreProcID;
  query.dp = digesterID;
  // Add the job data to the query.
  query.dateISO = jobData.endTime.slice(0, 8);
  query.dateSlash = query.dateISO.replace(/-/g, '/');
  query.org = target.what;
  query.url = target.which;
  query.requester = requester;
  query.reportURL = process.env.SCORED_REPORT_URL.replace('__id__', id);
  // Add values for the score-summary table to the query.
  const rows = {
    summaryRows: [],
    issueRows: []
  };
  ['total', 'issueCount', 'issue', 'solo', 'tool', 'prevention', 'log', 'latency']
  .forEach(sumItem => {
    query[sumItem] = summary[sumItem];
    rows.summaryRows.push(getScoreRow(sumItem, query[sumItem]));
  });
  // Sort the issue IDs in descending score order.
  const issueIDs = Object.keys(details.issue);
  issueIDs.sort((a, b) => details.issue[b].score - details.issue[a].score);
  // Get rows for the issue-score table.
  issueIDs.forEach(issueID => {
    const {score, tools} = details.issue[issueID];
    if (issues[issueID]) {
      rows.issueRows.push(
        getIssueScoreRow(issues[issueID].summary, issues[issueID].wcag, score, Object.keys(tools))
      );
    }
    else {
      console.log(`ERROR: Issue ${issueID} not found`);
    }
  });
  // Add the rows to the query.
  ['summaryRows', 'issueRows'].forEach(rowType => {
    query[rowType] = rows[rowType].join(innerJoiner);
  });
  // Add paragraph groups about the issue details to the query.
  const issueDetailRows = [];
  issueIDs.forEach(issueID => {
    issueDetailRows.push(`<h3 class="bars">Issue: ${issues[issueID].summary}</h3>`);
    issueDetailRows.push(`<p>Impact: ${issues[issueID].why || 'N/A'}</p>`);
    issueDetailRows.push(`<p>WCAG: ${issues[issueID].wcag || 'N/A'}</p>`);
    const issueData = details.issue[issueID];
    issueDetailRows.push(`<p>Score: ${issueData.score}</p>`);
    const toolIDs = Object.keys(issueData.tools);
    toolIDs.forEach(toolID => {
      issueDetailRows.push(`<h4>Violations of <code>${toolID}</code> rules</h5>`);
      const ruleIDs = Object.keys(issueData.tools[toolID]);
      ruleIDs.forEach(ruleID => {
        const ruleData = issueData.tools[toolID][ruleID];
        issueDetailRows.push(`<h5>Rule <code>${ruleID}</code></h5>`);
        issueDetailRows.push(`<p>Description: ${ruleData.what}</p>`);
        issueDetailRows.push(`<p>Count of instances: ${ruleData.complaints.countTotal}</p>`);
      });
    });
  });
  query.issueDetailRows = issueDetailRows.join(innerJoiner);
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
