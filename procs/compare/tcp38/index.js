/*
  index
  Compares scores in reports scored by tsp38 for use by Testu.
*/

// ########## IMPORTS

// Module to access files.
const fs = require('fs/promises');

// CONSTANTS

// Digester ID.
const id = 'tcp38';
// Newlines with indentations.
const joiner = '\n      ';
const innerJoiner = '\n        ';
const innestJoiner = '\n          ';

// ########## FUNCTIONS

// Returns data on the targets.
const getData = async scoredReports => {
  // For each scored report:
  const bodyData = [];
  for (const report of scoredReports) {
    // Get data.
    const {id, sources, score} = report;
    if (id && sources && sources.script && score) {
      bodyData.push({
        id,
        org: sources.target.what,
        url: sources.target.which,
        score: score.summary.total
      });
    }
  };
  // Return the report count, the script ID of the first report, and the data of all the reports.
  return {
    pageCount: scoredReports.length,
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
    const numCell = `<td><a href="testu/digest?jobID=${id}">${score}</a></td>`;
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
  query.script = 'ts37';
  query.scorer = 'tsp38';
  query.digester = 'tdp38';
  query.comparer = 'tcp38';
  query.tableBody = await getTableBody(data.bodyData);
  const date = new Date();
  query.dateISO = date.toISOString().slice(0, 10);
  query.dateSlash = query.dateISO.replace(/-/g, '/');
};
// Returns a comparative report.
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
  // Return the comparison.
  return template;
};
