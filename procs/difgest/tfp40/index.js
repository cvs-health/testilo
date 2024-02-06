// index: difgester for scoring procedure tsp40.

// IMPORTS

// Module to keep secrets.
require('dotenv').config();
// Module to classify tool rules into issues
const {issues} = require('../../score/tic40');
// Module to process files.
const fs = require('fs/promises');
// Utility module.
const {getBarCell} = require('../../util');

// CONSTANTS

// Difgester ID.
const id = 'tfp40';
// Newline with indentations.
const innerJoiner = '\n          ';

// FUNCTIONS

// Gets a row of the issue-score-summary table with a two-column bar graph.
const getIssueScoreRow = (summary, wcag, scoreA, scoreB, aSuperiorityMax, bSuperiorityMax) => {
  const svgWidthSum = 25;
  const maxSum = aSuperiorityMax + bSuperiorityMax;
  const aSVGWidth = svgWidthSum * aSuperiorityMax / maxSum;
  const bSVGWidth = svgWidthSum * bSuperiorityMax / maxSum;
  const bSuperiority = scoreA - scoreB;
  const cells = [
    `<th>${summary}</th>`,
    `<td class="center">${wcag}</td>`,
    `<td class="right">${scoreA}</td>`,
    `<td class="right">${scoreB}</td>`,
    `<td class="right">${scoreA - scoreB}</td>`,
    bSuperiority < 0
    ? getBarCell(Math.abs(bSuperiority), aSuperiorityMax, aSVGWidth, true)
    : '<td aria-hidden="true" class="right"></td>',
    bSuperiority > 0
    ? getBarCell(Math.abs(bSuperiority), bSuperiorityMax, bSVGWidth, false)
    : '<td aria-hidden="true"></td>'
  ];
  return `<tr>${cells.join('')}</tr>`;
};
// Adds parameters to a query for a difgest.
const populateQuery = (reportA, reportB, query) => {
  // General parameters.
  query.fp = id;
  query.dateISO = new Date().toISOString().slice(0, 10);
  query.dateSlash = query.dateISO.replace(/-/g, '/');
  // For each report:
  const issueIDs = new Set();
  [reportA, reportB].forEach((report, index) => {
    // Add report-specific synopsis parameters to the query.
    const suffix = ['A', 'B'][index];
    const {id, sources, jobData, score} = report;
    const {target} = sources;
    const {summary, details} = score;
    query[`org${suffix}`] = target.what;
    query[`url${suffix}`] = target.which;
    query[`dateTime${suffix}`] = jobData.replace(/-/g, '/').replace('T', ', ');
    query[`total${suffix}`] = summary.total;
    query[`digest${suffix}URL`] = process.env.DIGEST_URL.replace('__id__', id);
    // Get the union of the issues in the reports.
    Object.keys(details.issue).forEach(issueID => issueIDs.add(issueID));
  });
  // Get data on the issues.
  const issuesData = Array.from(issueIDs).map(issueID => {
    const issueDataA = reportA.score.details.issue[issueID] || null;
    const issueDataB = reportB.score.details.issue[issueID] || null;
    return {
      id: issueID,
      what: issueDataA ? issueDataA.summary : issueDataB.summary,
      wcag: issueDataA ? issueDataA.wcag : issueDataB.wcag,
      scoreA: issueDataA ? issueDataA.score : 0,
      scoreB: issueDataB ? issueDataB.score : 0
    };
  });
  // Sort the issue data in descending order of B less A scores.
  issuesData.sort((i, j) => i.scoreB - i.scoreA - j.scoreB + j.scoreA);
  // Get rows for the issue-score table.
  const lastIssue = issuesData[issueIDs.size - 1];
  const aSuperiorityMax = Math.max(0, lastIssue.scoreB - lastIssue.scoreA);
  const bSuperiorityMax = Math.max(0, issuesData[0].scoreA - issuesData[0].scoreB);
  const issueRows = [];
  issuesData.forEach(issueData => {
    const {id, what, wcag, scoreA, scoreB} = issueData;
    if (issues[id]) {
      issueRows.push(getIssueScoreRow(what, wcag, scoreA, scoreB, aSuperiorityMax, bSuperiorityMax));
    }
    else {
      console.log(`ERROR: Issue ${id} not found`);
    }
  });
  // Add the rows to the query.
  query.issueRows = issueRows.join(innerJoiner);
};
// Returns a difgested report.
exports.difgester = async (reportA, reportB) => {
  // Create a query to replace placeholders.
  const query = {};
  populateQuery(reportA, reportB, query);
  // Get the template.
  let template = await fs.readFile(`${__dirname}/index.html`, 'utf8');
  // Replace its placeholders.
  Object.keys(query).forEach(param => {
    template = template.replace(new RegExp(`__${param}__`, 'g'), query[param]);
  });
  // Return the digest.
  return template;
};
