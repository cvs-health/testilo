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

// index: digester for scoring procedure tsp50.

// IMPORTS

// Module to keep secrets.
require('dotenv').config();
// Module to classify tool rules into issues
const {issues} = require('../../score/tic50');
// Module to process files.
const fs = require('fs/promises');
// Utility module.
const {getNowDate, getNowDateSlash} = require('../../util');

// CONSTANTS

// Digester ID.
const digesterID = 'tdp50';
// Newline with indentations.
const innerJoiner = '\n        ';
const outerJoiner = '\n      ';
// Directory of WCAG links.
const wcagPhrases = {};

// FUNCTIONS

// Gets a row of the score-summary table.
const getScoreRow = (componentName, score) => `<tr><th>${componentName}</th><td>${score}</td></tr>`;
// Gets a WCAG link or, if not obtainable, a numeric identifier.
const getWCAGTerm = wcag => {
  const wcagPhrase = wcagPhrases[wcag];
  const wcagTerm = wcagPhrase
  ? `<a href="https://www.w3.org/WAI/WCAG22/Understanding/${wcagPhrase}.html">${wcag}</a>`
  : wcag;
  return wcagTerm;
};
// Gets a row of the issue-score-summary table.
const getIssueScoreRow = (issueConstants, issueDetails) => {
  const {summary, wcag, weight} = issueConstants;
  const wcagTerm = getWCAGTerm(wcag);
  const {instanceCounts, score} = issueDetails;
  const toolList = Object
  .keys(instanceCounts)
  .map(tool => `<code>${tool}</code>:${instanceCounts[tool]}`)
  .join(', ');
  return `<tr><th>${summary}</th><td class="center">${wcagTerm}<td class="right num">${weight}</td><td class="right num">${score}</td><td>${toolList}</td></tr>`;
};
// Populates the directory of WCAG understanding verbal IDs.
const getWCAGPhrases = async () => {
  // Get the copy of file https://raw.githubusercontent.com/w3c/wcag/main/guidelines/wcag.json.
  const wcagJSON = await fs.readFile(`${__dirname}/../../../wcag.json`, 'utf8');
  const wcag = JSON.parse(wcagJSON);
  const {principles} = wcag;
  // For each principle in it:
  principles.forEach(principle => {
    // If it is usable:
    if (principle.num && principle.id && principle.id.startsWith('WCAG2:')) {
      // Add it to the directory.
      wcagPhrases[principle.num] = principle.id.slice(6);
      const {guidelines} = principle;
      // For each guideline in the principle:
      guidelines.forEach(guideline => {
        // If it is usable:
        if (guideline.num && guideline.id && guideline.id.startsWith('WCAG2:')) {
          // Add it to the directory.
          wcagPhrases[guideline.num] = guideline.id.slice(6);
          const {successcriteria} = guideline;
          // For each success criterion in the guideline:
          successcriteria.forEach(successCriterion => {
            // If it is usable:
            if (
              successCriterion.num
              && successCriterion.id
              && successCriterion.id.startsWith('WCAG2:')
            ) {
              // Add it to the directory.
              wcagPhrases[successCriterion.num] = successCriterion.id.slice(6);
            }
          });
        }
      });
    }
  });
};
// Adds parameters to a query for a digest.
const populateQuery = async (report, query) => {
  const {
    browserID, device, id, isolate, lowMotion, score, sources, standard, strict, target
  } = report;
  const {agent, requester, script} = sources;
  const {scoreProcID, summary, details} = score;
  query.ts = script;
  query.sp = scoreProcID;
  query.dp = digesterID;
  // Add the job data to the query.
  query.dateISO = getNowDate();
  query.dateSlash = getNowDateSlash();
  query.org = target.what;
  query.url = target.url;
  query.redirections = strict ? 'prohibited' : 'permitted';
  query.isolation = isolate ? 'yes' : 'no';
  query.standard
  = ['original', 'standard', 'original and standard'][['no', 'only', 'also'].indexOf(standard)];
  query.motion = lowMotion ? 'requested' : 'not requested';
  query.requester = requester;
  query.device = device.id;
  query.browser = browserID;
  query.agent = agent ? ` on agent ${agent}` : '';
  query.reportURL = process.env.SCORED_REPORT_URL.replace('__id__', id);
  // Populate the WCAG phrase directory.
  await getWCAGPhrases();
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
    const wcag = issues[issueID].wcag;
    const wcagTerm = wcag ? getWCAGTerm(wcag) : 'N/A';
    issueDetailRows.push(`<p>WCAG: ${wcagTerm}</p>`);
    const issueData = details.issue[issueID];
    issueDetailRows.push(`<p>Score: ${issueData.score}</p>`);
    issueDetailRows.push('<h4>Elements</h4>');
    const issuePaths = details.element[issueID];
    if (issuePaths.length) {
      issueDetailRows.push('<ul>');
      issuePaths.forEach(pathID => {
        issueDetailRows.push(`  <li>${pathID}</li>`);
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
        /*
        This fails unless the caller handles such URLs and has compatible scored report URLs.
        const href = `${query.reportURL}?tool=${toolID}&rule=${ruleID}`;
        const detailLabel = `Issue ${issueSummary} tool ${toolID} rule ${ruleID} instance details`;
        issueDetailRows.push(
          `<p><a href="${href}" aria-label="${detailLabel}">Instance details</a></p>`
        );
        */
      });
    });
  });
  query.issueDetailRows = issueDetailRows.join(outerJoiner);
  // Add paragraphs about the elements to the query.
  const elementRows = [];
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
    if (elementIssues) {
      elementRows.push(
        `<h5>Element <code>${pathID}</code></h5>`,
        '<ul>',
        ... elementIssues.map(issueID => `  <li>${issues[issueID].summary}</li>`).sort(),
        '</ul>'
      );
    }
  });
  query.elementRows = elementRows.join(outerJoiner);
};
// Returns a digested report.
exports.digester = async report => {
  // Create a query to replace placeholders.
  const query = {};
  await populateQuery(report, query);
  // Get the template.
  let template = await fs.readFile(`${__dirname}/index.html`, 'utf8');
  // Replace its placeholders.
  Object.keys(query).forEach(param => {
    template = template.replace(new RegExp(`__${param}__`, 'g'), query[param]);
  });
  // Return the digest.
  return template;
};
