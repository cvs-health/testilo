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
  return `<tr><th>${summary}</th><td>${wcag}<td>${scoreA}</td><td>${scoreB}</td><td>${scoreB - scoreA}</td><td>${barCell}</td></tr>`;
};
// Adds parameters to a query for a digest.
const populateQuery = (reports, digestURLs, query) => {
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
    query[`digest${suffix}`] = digestURLs[index];
    // Get the union of the issues in the reports.
    Object.keys(details.issue).forEach(issueID => issueIDs.add(issueID));
  });
  // Get data on the issues.
  const issuesData = issueIDs.map(issueID => ({
    id: issueID,
    what: issues[issueID].summary,
    wcag: issues[isssueID].wcag,
    scoreA: reports[0].score.details.issue[issueID] ? reports[0].score.details[issueID].score : 0,
    scoreB: reports[1].score.details.issue[issueID] ? reports[1].score.details[issueID].score : 0,
  }));
  // Sort the issue data in descending order of B less A scores.
  issuesData.sort((i, j) => i[scoreB] - i[scoreA] - j[scoreB] + j[scoreA]);
  // Get rows for the issue-score table.
  issuesData.forEach(issueData => {
    const {id, what, wcag, scoreA, scoreB} = issueData;
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
exports.digester = async (reports, digestURLs) => {
  // Create a query to replace placeholders.
  const query = {};
  populateQuery(reports, digestURLs, query);
  // Get the template.
  let template = await fs.readFile(`${__dirname}/index.html`, 'utf8');
  // Replace its placeholders.
  Object.keys(query).forEach(param => {
    template = template.replace(new RegExp(`__${param}__`, 'g'), query[param]);
  });
  // Return the digest.
  return template;
};
