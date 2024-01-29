// index: difgester for scoring procedure tsp40.

// IMPORTS

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
const innerJoiner = '\n        ';

// FUNCTIONS

// Gets a row of the issue-score-summary table.
const getIssueScoreRow = (summary, wcag, scoreA, scoreB, bMoreMax, aMoreMax) => {
  const bMore = scoreB - scoreA;
  const barCell = getBarCell(bMore, bMore > 0 ? bMoreMax : aMoreMax);
  return `<tr><th>${summary}</th><td>${wcag}<td>${scoreA}</td><td>${scoreB}</td><td>${scoreB - scoreA}</td>${bMore > 0 ? barCell : '<td></td>'}${bMore > 0 ? '<td></td>' : barCell}</tr>`;
};
// Adds parameters to a query for a difgest.
const populateQuery = (reports, difgestURLs, query) => {
  // General parameters.
  query.fp = id;
  query.dateISO = new Date().toISOString().slice(0, 10);
  query.dateSlash = query.dateISO.replace(/-/g, '/');
  // For each report:
  const issueIDs = new Set();
  reports.forEach((report, index) => {
    // Add report-specific synopsis parameters to the query.
    const suffix = ['A', 'B'].indexOf(index);
    const {sources, jobData, score} = report;
    const {target} = sources;
    const {summary, details} = score;
    query[`org${suffix}`] = target.what;
    query[`url${suffix}`] = target.which;
    const dateISO = jobData.endTime.slice(0, 10);
    query[`dateSlash${suffix}`] = dateISO.replace(/-/g, '/');
    query[`total${suffix}`] = summary.total;
    query[`digest${suffix}`] = difgestURLs[index];
    // Get the union of the issues in the reports.
    Object.keys(details.issue).forEach(issueID => issueIDs.add(issueID));
  });
  // Get data on the issues.
  const issuesData = Array.from(issueIDs).map(issueID => ({
    id: issueID,
    what: issues[issueID].summary,
    wcag: issues[issueID].wcag,
    scoreA: reports[0].score.details.issue[issueID] ? reports[0].score.details[issueID].score : 0,
    scoreB: reports[1].score.details.issue[issueID] ? reports[1].score.details[issueID].score : 0,
  }));
  // Sort the issue data in descending order of B less A scores.
  issuesData.sort((i, j) => i[scoreB] - i[scoreA] - j[scoreB] + j[scoreA]);
  // Get rows for the issue-score table.
  const bMoreMax = issuesData[0].scoreB - issuesData[0].scoreA;
  const lastIssue = issuesData[issueIDs.size - 1];
  const aMoreMax = lastIssue.scoreA - lastIssue.scoreB;
  const issueRows = [];
  issuesData.forEach(issueData => {
    const {id, what, wcag, scoreA, scoreB} = issueData;
    if (issues[id]) {
      issueRows.push(
        getIssueScoreRow(what, wcag, scoreA, scoreB, bMoreMax, aMoreMax)
      );
    }
    else {
      console.log(`ERROR: Issue ${id} not found`);
    }
  });
  // Add the rows to the query.
  query.issueRows = issueRows.join(innerJoiner);
};
// Returns a difgested report.
exports.difgester = async (reports, difgestURLs) => {
  // Create a query to replace placeholders.
  const query = {};
  populateQuery(reports, difgestURLs, query);
  // Get the template.
  let template = await fs.readFile(`${__dirname}/index.html`, 'utf8');
  // Replace its placeholders.
  Object.keys(query).forEach(param => {
    template = template.replace(new RegExp(`__${param}__`, 'g'), query[param]);
  });
  // Return the digest.
  return template;
};
