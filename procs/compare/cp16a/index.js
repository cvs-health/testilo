/*
  cp16a.js
  Returns a query for an HTML page including a bar-graph table.
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

// Returns data on the hosts in the report directory.
const getData = async () => {
  const reportDirAbs = `${__dirname}/../../../${reportDirScored}`;
  const reportFileNamesAll = await fs.readdir(reportDirAbs);
  const reportFileNamesSource = reportFileNamesAll.filter(fileName => fileName.endsWith('.json'));
  const pageCount = reportFileNamesSource.length;
  const bodyData = [];
  for (const fileName of reportFileNamesSource) {
    const fileJSON = await fs.readFile(`${reportDirAbs}/${fileName}`, 'utf8');
    const file = JSON.parse(fileJSON);
    const {id, host, score} = file;
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
    // Make the bar width the square root of its proportional width.
    const barWidth = 100 * Math.sqrt(score / maxScore);
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
