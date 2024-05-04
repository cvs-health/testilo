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
  cpProductPrice.js
  Returns a query for an HTML page including a bar-graph table.
*/

// ########## IMPORTS

// Module to keep secrets local.
require('dotenv').config();
// Module to access files.
const fs = require('fs/promises');

// ########## CONSTANTS

const reportDir = process.env.REPORTDIR;
const query = {};

// ########## FUNCTIONS

// Returns data on the hosts in the report directory.
const getData = async () => {
  const reportDirAbs = `${__dirname}/../../../${reportDir}/scored`;
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
      score: score.total
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
  .sort((a, b) => b.score - a.score)
  .map(item => {
    const {id, org, url, score} = item;
    const pageCell = `<th scope="row"><a href="${url}">${org}</a></th>`;
    const numCell = `<td><a href="digests/${id}.html">${score}</a></td>`;
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
