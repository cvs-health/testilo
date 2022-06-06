/*
  ttp0.js
  Converts a set of scored reports to an HTML bar-graph table.
  Arguments:
    0. Subdirectory of report directory.
    1. What columns to include:
      'aut': Autotest.
      'aa': Autotest and axe.
      'p3': Axe, IBM, and WAVE.
*/

// ########## IMPORTS

// Module to keep secrets local.
require('dotenv').config();
// Module to access files.
const fs = require('fs/promises');

// ########## CONSTANTS

const reportDirScored = process.env.REPORTDIR_SCORED || 'reports/scored';
const reportIDStart = process.argv[2];

// ########## FUNCTIONS

const getData = async () => {
  const reportDirAbs = `${__readdir}/${reportDirScored}`;
  const reportFileNamesAll = await fs.readdir(reportDirAbs);
  const reportFileNamesSource = reportFileNamesAll
  .filter(fileName => fileName.startsWith(reportIDStart) && fileName.endsWith('.json'));
  const tableData = [];
  for (const fileName of reportFileNamesSource) {
    const fileJSON = await fs.readFile(`${reportDirAbs}/${fileName}`, 'utf8');
    const file = JSON.parse(fileJSON);
  }
};

// ########## OPERATION

const colSpec = process.argv[3];
// Directory.
const dir = `${process.env.REPORTDIR}/${process.argv[2]}`;
// Get the data.
const dataJSON = fs.readFileSync(`${dir}/deficit.json`, 'utf8');
const data = JSON.parse(dataJSON);
const result = data.result;
// If the column option is p3, sort the data by Axe score.
if (colSpec === 'p3') {
  result.sort((a, b) => a.deficit.axe - b.deficit.axe);
}
// Identify the containing HTML code.
const options = ['aut', 'aa', 'p3'];
const optionColNames = [['Score (lower is better)'], ['Autotest', 'Axe'], ['Axe', 'IBM', 'WAVE']];
const optionPropNames = [['total'], ['total', 'axe'], ['axe', 'ibm', 'wave']];
const colNames = optionColNames[options.indexOf(colSpec)];
const propNames = optionPropNames[options.indexOf(colSpec)];
const head = colNames.map(header => `<th scope="col" colspan="2">${header}</th>`).join('');
const tableClasses = ['linkSmaller', 'secondCellRight'];
if (colSpec !== 'aut') {
  tableClasses.push('fourthCellRight');
  if (colSpec === 'p3') {
    tableClasses.push('sixthCellRight');
  }
}
const tableStartLines = [
  '<table class="allBorder a11yDeficits">',
  '  <caption>Accessibility scores of web pages</caption>',
  '  <thead>',
  `    <tr><th scope="col">Page</th>${head}</tr>`,
  '  </thead>',
  `  <tbody class="${tableClasses.join(' ')}">`
];
const tableEndLines = [
  '  </tbody>',
  '</table>'
];
// Calibrate the bar widths.
const maxDeficits = {};
propNames.forEach(propName => {
  maxDeficits[propName] = result.reduce(
    (max, thisItem) => Math.max(max, thisItem.deficit[propName]), 0
  );
});
// Compile the HTML code representing the data.
const tableMidLines = result.map(item => {
  const pageCell = `<th scope="row"><a href="${item.url}">${item.org}</a></th>`;
  const numCells = [];
  if (propNames.includes('total')) {
    numCells.push(`<td><a href="htmlReports/${item.fileBase}.html">${item.deficit.total}</a></td>`);
  }
  propNames.filter(name => name !== 'total').forEach(name => {
    const itemScore = item.deficit[name];
    numCells.push(`<td>${itemScore !== null ? itemScore : '?'}</td>`);
  });
  const barCells = [];
  propNames.forEach(name => {
    const itemScore = item.deficit[name];
    if (itemScore === null) {
      barCells.push('<td aria-hidden="true">?</td>');
    }
    else {
      const barWidth = maxDeficits[name] ? 100 * item.deficit[name] / maxDeficits[name] : 0;
      const bar = `<rect height="100%" width="${barWidth}%" fill="red"></rect>`;
      barCells.push(`<td aria-hidden="true"><svg width="100%" height="0.7em">${bar}</svg></td>`);
    }
  });
  const numBarCells = numCells.map((cell, index) => `${cell}${barCells[index]}`);
  const row = `    <tr>${pageCell}${numBarCells.join('')}</tr>`;
  return row;
});
// Combine the containing and contained lines of HTML code.
const tableLines = tableStartLines.concat(tableMidLines, tableEndLines);
const table = tableLines.join('\n');
// Create the file.
fs.writeFileSync(`${dir}/deficit.html`, `${table}\n`);
