/*
  © 2024 CVS Health and/or one of its affiliates. All rights reserved.

  Permission is hereby granted, free of charge, to any person obtaining a copy
  of this software and associated documentation files (the "Software"), to deal
  in the Software without restriction, including without limitation the rights
  to use, copy, modify, merge, publish, distribute, sublicense, and/or sell
  copies of the Software, and to permit persons to whom the Software is
  furnished to do so, subject to the following conditions:

  The above copyright notice and this permission notice shall be included in all
  copies or substantial portions of the Software.

  THE SOFTWARE IS PROVIDED "AS IS", WITHOUT WARRANTY OF ANY KIND, EXPRESS OR
  IMPLIED, INCLUDING BUT NOT LIMITED TO THE WARRANTIES OF MERCHANTABILITY,
  FITNESS FOR A PARTICULAR PURPOSE AND NONINFRINGEMENT. IN NO EVENT SHALL THE
  AUTHORS OR COPYRIGHT HOLDERS BE LIABLE FOR ANY CLAIM, DAMAGES OR OTHER
  LIABILITY, WHETHER IN AN ACTION OF CONTRACT, TORT OR OTHERWISE, ARISING FROM,
  OUT OF OR IN CONNECTION WITH THE SOFTWARE OR THE USE OR OTHER DEALINGS IN THE
  SOFTWARE.
*/

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
const getMaxScore = summaryReport => summaryReport.summaries.reduce(
  (max, result) => Math.max(max, result.score), 0
);
// Converts summary report data to a table body.
const getTableBody = async summaryReport => {
  const maxScore = getMaxScore(summaryReport);
  const rows = summaryReport.summaries
  .sort((a, b) => a.score - b.score)
  .map(result => {
    const {id, score, targetWhat, url} = result;
    const pageCell = `<th scope="row"><a href="${url}">${targetWhat}</a></th>`;
    const scoreDestination = process.env.DIGEST_URL.replace('__id__', id);
    const numCell = `<td class="num"><a href="${scoreDestination}">${score}</a></td>`;
    // Make the bar width proportional.
    const barCell = getBarCell(score, maxScore, 25, false);
    const row = `<tr>${pageCell}${numCell}${barCell}</tr>`;
    return row;
  });
  return rows.join(innestJoiner);
};
// Populates a query for a comparative table.
const populateQuery = exports.populateQuery = async (id, what, summaryReport, query) => {
  query.id = id;
  query.what = what;
  query.pageCount = summaryReport.summaries.length;
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
