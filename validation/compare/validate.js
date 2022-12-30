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
