// index: digester for scoring procedure tsp40.

// IMPORTS

// Module to keep secrets.
require('dotenv').config();
// Module to classify tool rules into issues
const {issues} = require('../../score/tic40');
// Module to process files.
const fs = require('fs/promises');
// Utility module.
const {getNowDate, getNowDateSlash} = require('../../util');

// CONSTANTS

// Digester ID.
const digesterID = 'tdp42';
// Newline with indentations.
const innerJoiner = '\n        ';

// FUNCTIONS

// Gets a row of the score-summary table.
const getScoreRow = (componentName, score) => `<tr><th>${componentName}</th><td>${score}</td></tr>`;
// Gets a row of the issue-score-summary table.
const getIssueScoreRow = (issueConstants, issueDetails) => {
  const {summary, wcag} = issueConstants;
  const {instanceCounts, score} = issueDetails;
  const toolList = Object
  .keys(instanceCounts)
  .map(tool => `<code>${tool}</code>:${instanceCounts[tool]}`)
  .join(', ');
  return `<tr><th>${summary}</th><td class="center">${wcag}<td class="right num">${score}</td><td>${toolList}</td></tr>`;
};
// Adds parameters to a query for a digest.
const populateQuery = (report, query) => {
  const {acts, id, sources, score} = report;
  const {script, target, requester} = sources;
  const {scoreProcID, summary, details} = score;
  query.ts = script;
  query.sp = scoreProcID;
  query.dp = digesterID;
  // Add the job data to the query.
  query.dateISO = getNowDate();
  query.dateSlash = getNowDateSlash();
  query.org = target.what;
  query.url = target.which;
  query.requester = requester;
  const firstLaunch = acts.find(act => act.type === 'launch');
  if (firstLaunch) {
    query.device = firstLaunch.deviceID || 'unknown';
  }
  else {
    query.device = 'unknown';
  }
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
    if (issues[issueID]) {
      rows.issueRows.push(getIssueScoreRow(issues[issueID], details.issue[issueID]));
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
    const issueSummary = issues[issueID].summary;
    issueDetailRows.push(`<h3 class="bars">Issue: ${issueSummary}</h3>`);
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
        const href = `${query.reportURL}?tool=${toolID}&rule=${ruleID}`;
        const detailLabel = `Issue ${issueSummary} tool ${toolID} rule ${ruleID} instance details`;
        issueDetailRows.push(
          `<p><a href="${href}" aria-label="${detailLabel}">Instance details</a></p>`
        );
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
