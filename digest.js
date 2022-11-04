/*
  digest.js
  Creates digests from scored reports.
  Reads reports in process.env.REPORTDIR_SCORED and outputs into process.env.REPORTDIR_DIGESTED.
  Arguments:
    0. Base of name of digest proc located in procs/digest.
    1?. starting substring of names of reports in process.env.REPORTDIR_SCORED.
  Usage examples:
    node digest dp18a 35k1r (to digest all scored reports with names starting with 35k1r)
    node digest dp18a (to digest all scored reports)
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
exports.digest = async (digesterID, reportIDStart) => {
  const reportDirScoredAbs = `${__dirname}/${reportDirScored}`;
  let reportFileNames = await fs.readdir(reportDirScoredAbs);
  reportFileNames = reportFileNames.filter(fileName => fileName.endsWith('.json'));
  if (reportIDStart) {
    reportFileNames = reportFileNames
    .filter(fileName => fileName.startsWith(reportIDStart));
  }
  const {makeQuery} = require(`${__dirname}/procs/digest/${digesterID}/index.js`);
  for (const fileName of reportFileNames) {
    const reportJSON = await fs.readFile(`${reportDirScoredAbs}/${fileName}`, 'utf8');
    const report = JSON.parse(reportJSON);
    const query = {};
    makeQuery(report, query);
    const template = await fs
    .readFile(`${__dirname}/procs/digest/${digesterID}/index.html`, 'utf8');
    const digest = replaceHolders(template, query);
    const fileNameBase = fileName.slice(0, -5);
    await fs.writeFile(`${digestProcDir}/${fileNameBase}.html`, digest);
    console.log(`Report ${fileNameBase} digested and saved`);
  };
  return reportFileNames.length;
};
