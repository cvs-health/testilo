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

const reportDir = process.env.REPORTDIR || 'reports';
const reportID = process.argv[2];

// ########## FUNCTIONS

const score = async () => {
  const reportJSON = await fs.readFile(`${__dirname}/${reportDir}/${reportID}.json`, 'utf8');
  const report = JSON.parse(reportJSON);
  const scorerID = report.script.id;
  const {scorer} = require(`./procs/score/${scorerID}`);
  scorer(report);
  const scoredReportJSON = JSON.stringify(report, null, 2);
  await fs.writeFile(`${__dirname}/${reportDir}/${reportID}-scored.json`, scoredReportJSON);
  console.log(`Report ${reportID} scored and saved`);
};

// ########## OPERATION

score();
