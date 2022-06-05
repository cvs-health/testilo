/*
  digest.js
  Testilo digesting script.
*/

// ########## IMPORTS

// Module to keep secrets.
require('dotenv').config();
// Module to read and write files.
const fs = require('fs').promises;

// ########## CONSTANTS

const reportDirScored = process.env.REPORTDIR_SCORED || 'reports/scored';
const reportDirDigested = process.env.REPORTDIR_DIGESTED || 'reports/digested';
const reportIDStart = process.argv[2];
const digesterID = process.argv[3];

// ########## FUNCTIONS

// Replaces the placeholders in content with eponymous query parameters.
const replaceHolders = (content, query) => content
.replace(/__([a-zA-Z]+)__/g, (ph, qp) => query[qp]);
// Creates a digest.
const digest = async () => {
  const reportDirScoredAbs = `${__dirname}/${reportDirScored}`;
  const allReportFileNames = await fs.readdir(reportDirScoredAbs);
  const sourceReportFileNames = allReportFileNames
  .filter(fileName => fileName.startsWith(reportIDStart) && fileName.endsWith('.json'));
  const {makeQuery} = require(`${__dirname}/procs/digest/${digesterID}/index.js`);
  for (const fileName of sourceReportFileNames) {
    const reportJSON = await fs.readFile(`${reportDirScoredAbs}/${fileName}`, 'utf8');
    const report = JSON.parse(reportJSON);
    const query = {};
    makeQuery(report, query);
    const template = await fs
    .readFile(`${__dirname}/procs/digest/${digesterID}/index.html`, 'utf8');
    const digest = replaceHolders(template, query);
    const fileNameBase = fileName.slice(0, -5);
    await fs.writeFile(`${__dirname}/${reportDirDigested}/${fileNameBase}.html`, digest);
    console.log(`Report ${fileNameBase} digested and saved`);
  };
};

// ########## OPERATION

digest();
