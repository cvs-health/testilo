/*
  cp24.js
  Returns a query for replacing placeholders in the associated template.
*/

// ########## IMPORTS

// Module to keep secrets local.
require('dotenv').config();
// Module to access files.
const fs = require('fs/promises');

// ########## CONSTANTS

const query = {};

// ########## FUNCTIONS

// Returns data on the targets.
const getData = async scoredReports => {
  const bodyData = [];
  for (const report of scoredReports) {
    const {id, acts, sources, score} = report;
    bodyData.push({
      id,
      org: sources.target.what,
      url: acts[1].which,
      score: score.summary.total
    });
  };
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
    const numCell = `<td><a href="digests/${id}.html">${score}</a></td>`;
    // Make the bar width proportional.
    const barWidth = 100 * score / maxScore;
    const bar = `<rect height="100%" width="${barWidth}%" fill="red"></rect>`;
    const barCell = `<td aria-hidden="true"><svg width="100%" height="0.7em">${bar}</svg></td>`;
    const row = `<tr>${pageCell}${numCell}${barCell}</tr>`;
    return row;
  });
  return rows.join('\n          ');
};
// Populates a query for a comparative table.
exports.getQuery = async (scoredReports, query) => {
  const data = await getData(scoredReports);
  query.pageCount = data.pageCount;
  query.tableBody = await getTableBody(data.bodyData);
  const date = new Date();
  query.dateISO = date.toISOString().slice(0, 10);
  query.dateSlash = query.dateISO.replace(/-/g, '/');
};
