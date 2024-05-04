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
  Validates compare module.
*/

// ########## IMPORTS

// Function to process files.
const fs = require('fs/promises');
// Function to digest reports.
const {compare} = require('../../compare');
// Digesting function.
const {comparer} = require('./comparer');

// ########## FUNCTIONS

// Validates the digest module.
const validate = async () => {
  // Get the reports.
  const report0JSON = await fs.readFile(`${__dirname}/report0.json`, 'utf8');
  const scoredReport0 = JSON.parse(report0JSON);
  const report1JSON = await fs.readFile(`${__dirname}/report1.json`, 'utf8');
  const scoredReport1 = JSON.parse(report1JSON);
  // Get the comparison template.
  const comparisonTemplate = await fs.readFile(`${__dirname}/comparison.html`, 'utf8');
  // Perform the comparison.
  const comparison = compare(comparisonTemplate, comparer, [scoredReport0, scoredReport1]);
  // Validate the comparison.
  if (typeof comparison === 'string') {
    console.log('Success: Comparing left the comparison a string');
  }
  else {
    console.log('ERROR: Comparing changed the comparison type');
    return;
  }
  if (comparison.includes('<h2>Introduction</h2>')) {
    console.log('Success: Comparing left the static template content unchanged');
  }
  else {
    console.log('ERROR: Comparing changed the static template content');
    return;
  }
  if (comparison.includes('Page of Example0 got score 100')) {
    console.log('Success: Comparing interpolated the data correctly');
  }
  else {
    console.log('ERROR: Comparing did not interpolate the data correctly');
    return;
  }
};
validate();
