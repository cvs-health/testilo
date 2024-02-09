// index: tracker for tracking procedure ttp40.

// IMPORTS

// Module to keep secrets.
require('dotenv').config();
// Module to process files.
const fs = require('fs/promises');
// Utility module.
const {alphaNumOf, getNowDate, getNowDateSlash} = require('../../util');

// CONSTANTS

// Tracker ID.
const trackerID = 'ttp40';
// Newline with indentations.
const innerJoiner = '\n          ';
// Digest URL.
const digestURL = process.env.DIGEST_URL;

// FUNCTIONS

// Adds parameters to a query for a tracking report.
const populateQuery = async (id, summary, query) => {
  // General parameters.
  query.id = id;
  query.tp = trackerID;
  query.dateISO = getNowDate();
  query.dateSlash = getNowDateSlash();
  query.summaryJSON = JSON.stringify(summary);
  // Graph.
  const Plot = await import('@observablehq/plot');
  const graphData = [];
  summary.data.forEach(result => {
    graphData.push({
      target: result.target.what,
      time: new Date(`20${result.endTime}Z`),
      score: result.score
    });
  });
  query.svg = Plot.plot({
    style: 'overflow: visible;',
    y: {grid: true},
    marks: [
      Plot.ruleY([0]),
      Plot.lineY(graphData, {
        x: 'time',
        y: 'score',
        stroke: 'target'
      }),
      Plot.text(graphData, Plot.selectLast({
        x: 'time',
        y: 'score',
        z: 'target',
        text: 'target',
        textAnchor: 'start',
        dx: 3
      }))
    ]
  });
  // For each score:
  const rows = [];
  const results = summary.data;
  const targetWhats = Array.from(new Set(results.map(result => result.target.what))).sort();
  summary.data.forEach(result => {
    // Create an HTML table row for it.
    const timeCell = `<td>${result.endTime}</td>`;
    const digestLinkDestination = digestURL.replace('__id__', result.id);
    const scoreCell = `<td><a href=${digestLinkDestination}>${result.score}</a></td>`;
    const orderCell = `<td class="center">${result.order}</td>`;
    const targetID = alphaNumOf(targetWhats.indexOf(result.target.what));
    const targetLink = `<a href="${result.target.which}">${result.target.what}</a>`;
    const targetCell = `<td>${targetID}: ${targetLink}</td>`;
    const row = `<tr>${[timeCell, scoreCell, orderCell, targetCell].join('')}</tr>`;
    // Add the row to the array of rows.
    rows.push(row);
  });
  // Add the rows to the query.
  query.scoreRows = rows.join(innerJoiner);
};
// Returns a tracking report.
exports.tracker = async (id, summary) => {
  // Create a query to replace placeholders.
  const query = {};
  await populateQuery(id, summary, query);
  // Get the template.
  let template = await fs.readFile(`${__dirname}/index.html`, 'utf8');
  // Replace its placeholders.
  Object.keys(query).forEach(param => {
    template = template.replace(new RegExp(`__${param}__`, 'g'), query[param]);
  });
  // Return the tracking report.
  return template;
};
