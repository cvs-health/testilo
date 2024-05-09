/*
  © 2024 CVS Health and/or one of its affiliates. All rights reserved.

  Permission is hereby granted, free of charge, to any person obtaining a copy
  of this software and associated documentation files (the "Software"), to deal
  in the Software without restriction, including without limitation the rights
  to use, copy, modify, merge, publish, distribute, sublicense, and/or sell
  copies of the Software, and to permit persons to whom the Software is
  furnished to do so, subject to the following conditions:

  The above copyright notice and this permission notice shall be included in all
  copies or substantial portions of the Software.

  THE SOFTWARE IS PROVIDED "AS IS", WITHOUT WARRANTY OF ANY KIND, EXPRESS OR
  IMPLIED, INCLUDING BUT NOT LIMITED TO THE WARRANTIES OF MERCHANTABILITY,
  FITNESS FOR A PARTICULAR PURPOSE AND NONINFRINGEMENT. IN NO EVENT SHALL THE
  AUTHORS OR COPYRIGHT HOLDERS BE LIABLE FOR ANY CLAIM, DAMAGES OR OTHER
  LIABILITY, WHETHER IN AN ACTION OF CONTRACT, TORT OR OTHERWISE, ARISING FROM,
  OUT OF OR IN CONNECTION WITH THE SOFTWARE OR THE USE OR OTHER DEALINGS IN THE
  SOFTWARE.
*/

// index: digester for scoring procedure tsp43.

// IMPORTS

// Module to keep secrets.
require('dotenv').config();
// Module to classify tool rules into issues
const {issues} = require('../../score/tic43');
// Module to process files.
const fs = require('fs/promises');
// Utility module.
const {getNowDate, getNowDateSlash} = require('../../util');

// CONSTANTS

// Digester ID.
const digesterID = 'tdp43e';
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
  const {agent, script, target, requester} = sources;
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
  query.agent = `on agent ${agent}` || '';
  query.reportURL = process.env.SCORED_REPORT_URL.replace('__id__', id);
  // Add values for the score-summary table to the query.
  const rows = {
    summaryRows: [],
    issueRows: []
  };
  ['total', 'issueCount', 'issue', 'solo', 'tool', 'element', 'prevention', 'log', 'latency']
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
    issueDetailRows.push('<h4>Elements</h4>');
    const issuePaths = details.element[issueID];
    if (issuePaths.length) {
      issueDetailRows.push('<ul>');
      issuePaths.forEach(pathID => {
        issueDetailRows.push(`<li>${pathID}</li>`);
      });
      issueDetailRows.push('</ul>');
    }
    else {
      issueDetailRows.push('<p>None identified</p>');
    }
    const toolIDs = Object.keys(issueData.tools);
    toolIDs.forEach(toolID => {
      issueDetailRows.push(`<h4>Violations of <code>${toolID}</code> rules</h4>`);
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
  // Add paragraphs about the multi-issue elements to the query.
  const multiIssueElementRows = [];
  const issueElements = {};
  Object.keys(details.element).forEach(issueID => {
    const pathIDs = details.element[issueID];
    pathIDs.forEach(pathID => {
      issueElements[pathID] ??= [];
      issueElements[pathID].push(issueID);
    });
  });
  const sortedPathIDs = Object.keys(issueElements).sort();
  sortedPathIDs.forEach(pathID => {
    const elementIssues = issueElements[pathID];
    if (elementIssues && elementIssues.length > 1) {
      multiIssueElementRows.push(
        `<h5>Element <code>${pathID}</code></h5>`,
        '<ul>',
        ... elementIssues.map(issue => `<li>${issue}</li>`),
        '</ul>'
      );
    }
  });
  query.multiIssueElementRows = multiIssueElementRows.join(innerJoiner);
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
