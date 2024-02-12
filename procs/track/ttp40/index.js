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
  // JSON of pruned summary report.
  const {summaries} = summaryReport;
  summaries.forEach(result => {
    delete result.sources.target.id;
  });
  query.summaryReportJSON = JSON.stringify(summaryReport);
  // For each score:
  const rows = [];
  const targetWhats = Array.from(new Set(summaries.map(result => result.sources.target.what))).sort();
  summaries.forEach(result => {
    // Create an HTML table row for it.
    const timeCell = `<td>${result.endTime}</td>`;
    const digestLinkDestination = digestURL.replace('__id__', result.id);
    const scoreCell = `<td><a href=${digestLinkDestination}>${result.score}</a></td>`;
    const {target} = result.sources;
    const targetID = alphaNumOf(targetWhats.indexOf(target.what));
    const targetLink = `<a href="${target.which}">${target.what}</a>`;
    const targetCell = `<td>${targetID}: ${targetLink}</td>`;
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
