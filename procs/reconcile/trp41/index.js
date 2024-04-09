// index: reconciler for scoring procedure tsp41.

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

// Reconciler ID.
const reconcilerID = 'trp41';
// Newline with indentations.
const innerJoiner = '\n        ';

// FUNCTIONS

// Gets a row of the score-summary table.
const getScoreRow = (componentName, score) => `<tr><th>${componentName}</th><td>${score}</td></tr>`;
// Gets a row of the issue-score-summary table.
const getIssueScoreRow = (summary, wcag, score, tools) => {
  const toolList = tools.map(tool => `<code>${tool}</code>`).join(', ');
  return `<tr><th>${summary}</th><td class="center">${wcag}<td class="right">${score}</td><td>${toolList}</td></tr>`;
};
// Adds parameters to a query for a reconciliation report.
const populateQuery = (report, query) => {
  const {id, sources, score} = report;
  const {script, target, requester} = sources;
  const {scoreProcID, details} = score;
  query.ts = script;
  query.sp = scoreProcID;
  query.rp = reconcilerID;
  // Add the job data to the query.
  query.dateISO = getNowDate();
  query.dateSlash = getNowDateSlash();
  query.org = target.what;
  query.url = target.which;
  query.requester = requester;
  query.reportURL = process.env.SCORED_REPORT_URL.replace('__id__', id);
  // Sort the issue IDs in descending score order.
  const issueIDs = Object.keys(details.issue);
  issueIDs.sort((a, b) => details.issue[b].score - details.issue[a].score);
  // Get the instance-count tables.
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
exports.reconciler = async report => {
  // Create a query to replace placeholders.
  const query = {};
  populateQuery(report, query);
  // Get the template.
  let template = await fs.readFile(`${__dirname}/index.html`, 'utf8');
  // Replace its placeholders.
  Object.keys(query).forEach(param => {
    template = template.replace(new RegExp(`__${param}__`, 'g'), query[param]);
  });
  // Return the reconciliation report.
  return template;
};
