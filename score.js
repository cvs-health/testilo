/*
  score.js
  Testilo scoring script.
*/

// ########## IMPORTS

// Module to keep secrets.
require('dotenv').config();
// Module to read and write files.
const fs = require('fs').promises;

// ########## CONSTANTS

const reportDirRaw = process.env.REPORTDIR_RAW || 'reports/raw';
const reportDirScored = process.env.REPORTDIR_SCORED || 'reports/scored';
const reportID = process.argv[2];

// ########## FUNCTIONS

const score = async () => {
  const reportJSON = await fs.readFile(`${__dirname}/${reportDirRaw}/${reportID}.json`, 'utf8');
  const report = JSON.parse(reportJSON);
  const scorerID = report.script.id;
  const {scorer} = require(`./procs/score/${scorerID}`);
  scorer(report);
  const scoredReportJSON = JSON.stringify(report, null, 2);
  await fs.writeFile(`${__dirname}/${reportDirScored}/${reportID}.json`, scoredReportJSON);
  console.log(`Report ${reportID} scored and saved`);
};

// ########## OPERATION

score();
