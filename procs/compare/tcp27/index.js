// index: comparer for scoring procedure tsp27

// ########## IMPORTS

// Module to access files.
const fs = require('fs/promises');

// CONSTANTS

// Digester ID.
const id = 'tcp27';
// Newlines with indentations.
const joiner = '\n      ';
const innerJoiner = '\n        ';
const innestJoiner = '\n          ';

// ########## FUNCTIONS

// Returns data on the targets.
const getData = async scoredReports => {
  const bodyData = [];
  for (const report of scoredReports) {
    const {id, sources, score} = report;
    bodyData.push({
      id,
      org: sources.target.what,
      url: sources.target.which,
      score: score.summary.total
    });
  };
  return {
    pageCount: scoredReports.length,
    script: scoredReports[0].sources.script,
    bodyData
  }
};
// Returns the maximum score.
const getMaxScore = tableData => tableData.reduce((max, item) => Math.max(max, item.score), 0);
// Converts report data to a table body.
const getTableBody = async bodyData => {
  const maxScore = getMaxScore(bodyData);
  const rows = bodyData
  .sort((a, b) => a.score - b.score)
  .map(item => {
    const {id, org, url, score} = item;
    const pageCell = `<th scope="row"><a href="${url}">${org}</a></th>`;
    const numCell = `<td><a href="digests/${id}.html">${score}</a></td>`;
    // Make the bar width proportional.
    const barWidth = 100 * score / maxScore;
    const bar = `<rect height="100%" width="${barWidth}%" fill="red"></rect>`;
    const barCell = `<td aria-hidden="true"><svg width="100%" height="0.7em">${bar}</svg></td>`;
    const row = `<tr>${pageCell}${numCell}${barCell}</tr>`;
    return row;
  });
  return rows.join(innestJoiner);
};
// Populates a query for a comparative table.
const populateQuery = async (scoredReports, query) => {
  const data = await getData(scoredReports);
  query.pageCount = data.pageCount;
  query.scriptID = scoredReports[0].sources.script;
  query.scorer = 'tsp27';
  query.digester = 'tdp27';
  query.comparer = 'tcp27';
  query.tableBody = await getTableBody(data.bodyData);
  const date = new Date();
  query.dateISO = date.toISOString().slice(0, 10);
  query.dateSlash = query.dateISO.replace(/-/g, '/');
};
// Returns a digested report.
exports.comparer = async scoredReports => {
  // Create a query to replace placeholders.
  const query = {};
  populateQuery(scoredReports, query);
  // Get the template.
  let template = await fs.readFile(`${__dirname}/index.html`, 'utf8');
  // Replace its placeholders.
  Object.keys(query).forEach(param => {
    template = template.replace(new RegExp(`__${param}__`, 'g'), query[param]);
  });
  // Return the digest.
  return template;
};
