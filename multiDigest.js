/*
  multiDigest.js
  Creates digests from scored reports.
  Reads all reports in process.env.REPORTDIR_SCORED and outputs them, digested, into
  process.env.REPORTDIR_DIGESTED.
  Argument:
    0. Base of name of digest proc located in process.env.DIGESTPROCDIR.
  Usage example: node digest dp25a
*/

// ########## IMPORTS

// Module to keep secrets.
require('dotenv').config();
// Module to read and write files.
const fs = require('fs/promises');

// ########## CONSTANTS

const reportDirScored = process.env.REPORTDIR_SCORED || 'reports/scored';
const reportDirDigested = process.env.REPORTDIR_DIGESTED || 'reports/digested';
const digestProcDir = process.env.DIGESTPROCDIR || `${__dirname}/procs/digest`;

// ########## FUNCTIONS

// Replaces the placeholders in content with eponymous query parameters.
const replaceHolders = (content, query) => content
.replace(/__([a-zA-Z]+)__/g, (ph, qp) => query[qp]);
// Creates digests.
exports.multiDigest = async digesterID => {
  // Identify the reports to be digested.
  let reportFileNames = await fs.readdir(reportDirScored);
  reportFileNames = reportFileNames.filter(fileName => fileName.endsWith('.json'));
  // For each report:
  const {makeQuery} = require(`${digestProcDir}/${digesterID}/index.js`);
  for (const fileName of reportFileNames) {
    const reportJSON = await fs.readFile(`${reportDirScored}/${fileName}`, 'utf8');
    const report = JSON.parse(reportJSON);
    // Define its replacements for the placeholders in the digest template.
    const query = {};
    makeQuery(report, query);
    // Replace the placeholders.
    const template = await fs.readFile(`${digestProcDir}/${digesterID}/index.html`, 'utf8');
    const digest = replaceHolders(template, query);
    // Write its digest.
    const fileNameBase = fileName.slice(0, -5);
    await fs.writeFile(`${reportDirDigested}/${fileNameBase}.html`, digest);
    console.log(`Report ${fileNameBase} digested and saved`);
  };
  return reportFileNames.length;
};
