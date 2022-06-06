/*
  ttp0.js
  Converts a set of scored reports to an HTML bar-graph table.
*/

// ########## IMPORTS

// Module to keep secrets local.
require('dotenv').config();
// Module to access files.
const fs = require('fs/promises');

// ########## CONSTANTS

const reportDirScored = process.env.REPORTDIR_SCORED || 'reports/scored';
const reportIDStart = process.argv[2];
const tableStartLines = [
  '<table class="allBorder a11yDeficits">',
  '  <caption>Accessibility scores of web pages</caption>',
  '  <thead>',
  '    <tr><th scope="col">Page</th><th scope="col" colspan="2">Score (lower is better)</tr>',
  '  </thead>',
  '  <tbody class="linkSmaller secondCellRight">'
];
const tableEndLines = [
  '  </tbody>',
  '</table>'
];

// ########## FUNCTIONS

// Gets data on the hosts and their scores.
const getData = async () => {
  const reportDirAbs = `${__readdir}/${reportDirScored}`;
  const reportFileNamesAll = await fs.readdir(reportDirAbs);
  const reportFileNamesSource = reportFileNamesAll
  .filter(fileName => fileName.startsWith(reportIDStart) && fileName.endsWith('.json'));
  const tableData = [];
  for (const fileName of reportFileNamesSource) {
    const fileJSON = await fs.readFile(`${reportDirAbs}/${fileName}`, 'utf8');
    const file = JSON.parse(fileJSON);
    const {id, host, score} = file;
    tableData.push({
      id,
      host,
      score
    });
  };
  return tableData;
};
// Gets the maximum score.
const getMaxScore = tableData => tableData
.reduce((max, item) => Math.max(max, item.score.scores.total));
// Compiles the table body.
const getBody = tableData => {
  const maxScore = getMaxScore(tableData);
  const rows = tableData
  .sort((a, b) => a.score.scores.total - b.score.scores.total)
  .map(item => {
    const score = item.score.scores.total;
    const pageCell = `<th scope="row"><a href="${item.host.url}">${item.host.what}</a></th>`;
    const numCell = `<td><a href="reports/${item.id}.html">${score}</a></td>`;
    const barWidth = 100 * score / maxScore;
    const bar = `<rect height="100%" width="${barWidth}%" fill="red"></rect>`;
    const barCell = `<td aria-hidden="true"><svg width="100%" height="0.7em">${bar}</svg></td>`;
    const row = `    <tr>${pageCell}${numCell}${barCell}</tr>`;
    return row;
  });
  return rows.join('\n    ');
};
// Compiles the table.
exports.getTable = async () => {
  const tableData = await getData();
  const table = [
    tableStartLines,
    getBody(tableData),
    tableEndLines
  ].join('\n  ');
  return table;
};
