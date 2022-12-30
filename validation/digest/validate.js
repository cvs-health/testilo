/*
  validate.js
  Validates digest module.
*/

// ########## IMPORTS

// Function to process files.
const fs = require('fs/promises');
// Function to digest reports.
const {digest} = require('../../digest');
// Digesting function.
const {digester} = require('./digester');

// ########## FUNCTIONS

// Validates the digest module.
const validate = async () => {
  // Get the report.
  const reportJSON = await fs.readFile(`${__dirname}/report.json`, 'utf8');
  const scoredReport = JSON.parse(reportJSON);
  // Get the digest template.
  const digestTemplate = await fs.readFile(`${__dirname}/digest.html`, 'utf8');
  // Perform the digesting.
  const digests = digest(digestTemplate, digester, [scoredReport]);
  // Validate the digest.
  if (Array.isArray(digests) && digests.length === 1) {
    console.log('Success: The count of digests is correct');
  }
  else {
    console.log('ERROR: The digests are not an array of length 1');
    return;
  }
  const digestedReport = digests[0];
  if (typeof digestedReport === 'string') {
    console.log('Success: Digesting left the digest a string');
  }
  else {
    console.log('ERROR: Digesting changed the digest type');
    return;
  }
  if (digestedReport.includes('<h2>Introduction</h2>')) {
    console.log('Success: Digesting left the static template content unchanged');
  }
  else {
    console.log('ERROR: Digesting changed the static template content');
    return;
  }
  if (digestedReport.includes('the web page of Example')) {
    console.log('Success: Digesting interpolated the target correctly');
  }
  else {
    console.log('ERROR: Digesting did not interpolate the target correctly');
    return;
  }
  if (digestedReport.includes('count of tests was 1')) {
    console.log('Success: Digesting interpolated the score correctly');
  }
  else {
    console.log('ERROR: Digesting did not interpolate the score correctly');
    return;
  }
};
validate();
