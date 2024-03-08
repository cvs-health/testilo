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
const populateQuery = async (id, what, summaryReport, query) => {
  // General parameters.
  query.id = id;
  query.what = what;
  query.tp = trackerID;
  query.dateISO = getNowDate();
  query.dateSlash = getNowDateSlash();
  // JSON of summary report.
  const {summaries} = summaryReport;
  query.summaryReportJSON = JSON.stringify(summaryReport);
  // Legend.

  // Get an array of target descriptions and assign to each an ID.
  const rows = [];
  const targets = Array
  .from(new Set(summaries.map(result => result.sources.target.what)))
  .sort()
  .map((targetWhat, index) => [alphaNumOf(index), targetWhat]);
  const targetIDs = {};
  targets.forEach(target => {
    targetIDs[target[1]] = target[0];
  });
  // Add legend items to the query.
  const legendItems = targets.map(target => `<li>${target[0]}: ${target[1]}</li>`);
  query.legendItems = legendItems.join('\n        ');
  // For each result:
  summaries.forEach(result => {
    // Create a date-time cell.
    const timeCell = `<td>${result.endTime}</td>`;
    // Create a score cell.
    const digestLinkDestination = digestURL.replace('__id__', result.id);
    const scoreCell = `<td><a href=${digestLinkDestination}>${result.score}</a></td>`;
    // Create a target cell.
    const {target} = result.sources;
    const targetLink = `<a href="${target.which}">${target.what}</a>`;
    const targetCell = `<td>${targetIDs[target.what]}: ${targetLink}</td>`;
    const row = `<tr>${[timeCell, scoreCell, targetCell].join('')}</tr>`;
    // Add the row to the array of rows.
    rows.push(row);
  });
  // Add the rows to the query.
  query.scoreRows = rows.join(innerJoiner);
};
// Returns a tracking report.
exports.tracker = async (id, what, summaryReport) => {
  // Create a query to replace placeholders.
  const query = {};
  await populateQuery(id, what, summaryReport, query);
  // Get the template.
  let template = await fs.readFile(`${__dirname}/index.html`, 'utf8');
  // Replace its placeholders.
  Object.keys(query).forEach(param => {
    template = template.replace(new RegExp(`__${param}__`, 'g'), query[param]);
  });
  // Return the tracking report.
  return template;
};
