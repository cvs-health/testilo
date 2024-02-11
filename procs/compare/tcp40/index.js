/*
  index
  Compares scores in a summary report.
*/

// ########## IMPORTS

// Module to access files.
const fs = require('fs/promises');
const {getBarCell, getNowDate, getNowDateSlash} = require('../../util');

// CONSTANTS

// Newlines with indentations.
const innestJoiner = '\n          ';

// ########## FUNCTIONS

// Returns the maximum score.
const getMaxScore = summaryReport => summaryReport.data.reduce(
  (max, result) => Math.max(max, result.score), 0
);
// Converts summary report data to a table body.
const getTableBody = async summaryReport => {
  const maxScore = getMaxScore(summaryReport);
  const rows = summaryReport.data
  .sort((a, b) => a.score - b.score)
  .map(result => {
    const {id, sources, score} = result;
    const {what, which} = sources.target;
    const pageCell = `<th scope="row"><a href="${which}">${what}</a></th>`;
    const scoreDestination = process.env.DIGEST_URL.replace('__id__', id);
    const numCell = `<td><a href="${scoreDestination}">${score}</a></td>`;
    // Make the bar width proportional.
    const barCell = getBarCell(score, maxScore, 25, false);
    const row = `<tr>${pageCell}${numCell}${barCell}</tr>`;
    return row;
  });
  return rows.join(innestJoiner);
};
// Populates a query for a comparative table.
const populateQuery = async (id, what, summaryReport, query) => {
  query.id = id;
  query.what = what;
  query.pageCount = summaryReport.data.length;
  query.tableBody = await getTableBody(summaryReport);
  query.dateISO = getNowDate();
  query.dateSlash = getNowDateSlash();
};
// Returns a comparison.
exports.comparer = async (id, what, summaryReport) => {
  // Create a query to replace placeholders.
  const query = {};
  populateQuery(id, what, summaryReport, query);
  // Get the template.
  let template = await fs.readFile(`${__dirname}/index.html`, 'utf8');
  // Replace its placeholders.
  Object.keys(query).forEach(param => {
    template = template.replace(new RegExp(`__${param}__`, 'g'), query[param]);
  });
  // Return the comparison.
  return template;
};
