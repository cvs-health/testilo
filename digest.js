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
const reportID = process.argv[2];

// ########## FUNCTIONS

// Replaces the placeholders in content with eponymous query parameters.
const replaceHolders = (content, query) => content
.replace(/__([a-zA-Z]+)__/g, (ph, qp) => query[qp]);
// Creates a digest.
const digest = async () => {
  const reportJSON = await fs.readFile(`${__dirname}/${reportDirScored}/${reportID}.json`, 'utf8');
  const report = JSON.parse(reportJSON);
  const digesterID = report.script.id;
  const {digester} = require(`${__dirname}/procs/digest/${digesterID}/index.js`);
  const {makeQuery} = digester;
  const query = {};
  makeQuery(report, query);
  const template = await fs.readFile(`${__dirname}/procs/digest/${digesterID}/index.html`, 'utf8');
  const digest = replaceHolders(template, query);
  await fs.writeFile(`${__dirname}/${reportDirDigested}/${reportID}.html`, digest);
  console.log(`Report ${reportID} digested and saved`);
};

// ########## OPERATION

digest();
