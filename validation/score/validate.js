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
  validate.js
  Validates score module.
*/

// ########## IMPORTS

// Function to process files.
const fs = require('fs/promises');
// Function to score reports.
const {score} = require('../../score');
// Scoring function.
const {scorer} = require('./scorer');

// ########## FUNCTIONS

// Validates the score module.
const validate = async () => {
  // Get the report.
  const reportJSON = await fs.readFile(`${__dirname}/report.json`, 'utf8');
  const rawReport = JSON.parse(reportJSON);
  // Perform the scoring.
  const scoredReports = score(scorer, [rawReport]);
  // Validate the scored report.
  if (Array.isArray(scoredReports) && scoredReports.length === 1) {
    console.log('Success: The count of scored reports is correct');
  }
  else {
    console.log('ERROR: The scored reports are not an array of length 1');
    return;
  }
  const report = scoredReports[0];
  if (report.timeLimit === 10) {
    console.log('Success: Scoring left the time limit unchanged');
  }
  else {
    console.log('ERROR: Scoring changed or deleted the time limit');
    return;
  }
  if (report.acts && Array.isArray(report.acts) && report.acts.length === 3) {
    console.log('Success: Scoring left the act count unchanged');
  }
  else {
    console.log('ERROR: Scoring changed the act count or deleted or retyped the acts');
    return;
  }
  if (report.acts[2].result && report.acts[2].result.visibleElements === 100) {
    console.log('Success: Scoring left the bulk test result unchanged');
  }
  else {
    console.log('ERROR: Scoring changed the bulk test result');
    return;
  }
  if (report.score && report.score.testCount === 1) {
    console.log('Success: The score was correctly added to the report');
  }
  else {
    console.log('ERROR: The score was not correctly added to the report');
    return;
  }
};
validate();
