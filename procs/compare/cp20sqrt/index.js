/*
  cp20sqrt.js
  Returns a query for replacing placeholders in the associated template.
  Makes the bar widths the square roots of their proportional widths, for cases of extreme
  score disparity.
*/

// ########## IMPORTS

// Module to keep secrets local.
require('dotenv').config();
// Module to access files.
const fs = require('fs/promises');

// ########## CONSTANTS

const reportDirScored = process.env.REPORTDIR_SCORED || 'reports/scored';
const query = {};

// ########## FUNCTIONS

// Returns data on the targets.
const getData = async scoredReports => {
  const reportCount = scoredReports.length;
  const bodyData = [];
  for (const report of scoredReports) {
    const {id, host, score} = report;
    bodyData.push({
      id,
      org: host.what,
      url: host.which,
      score: score.summary.total
    });
  };
  return {
    pageCount,
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
// Returns a query for a comparative table.
exports.getQuery = async () => {
  const data = await getData();
  query.pageCount = data.pageCount;
  query.tableBody = await getTableBody(data.bodyData);
  const date = new Date();
  query.dateISO = date.toISOString().slice(0, 10);
  query.dateSlash = query.dateISO.replace(/-/g, '/');
  return query;
};
