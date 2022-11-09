/*
  multiScore.js
  Scores multiple Testaro reports.
  Reads all reports in process.env.REPORTDIR_RAW and outputs them, scored, into
  process.env.REPORTDIR_SCORED.
  Arguments:
    0. Base of name of score proc located in process.env.SCOREPROCDIR.
  Usage example: node score sp18a
*/

// ########## IMPORTS

// Module to keep secrets.
require('dotenv').config();
// Module to read and write files.
const fs = require('fs/promises');

// ########## CONSTANTS

const reportDirRaw = process.env.REPORTDIR_RAW || 'reports/raw';
const reportDirScored = process.env.REPORTDIR_SCORED || 'reports/scored';
const scoreProcDir = process.env.SCOREPROCDIR || `${__dirname}/procs/score`;

// ########## FUNCTIONS

// Score the specified reports and return their count.
exports.multiScore = async scoreProcID => {
  // Identify the reports to be scored.
  let reportFileNames = await fs.readdir(reportDirRaw);
  reportFileNames = reportFileNames.filter(fileName => fileName.endsWith('.json'));
  // For each of them:
  const {scorer} = require(`${scoreProcDir}/${scoreProcID}`);
  for (const fileName of reportFileNames) {
    // Score it.
    const reportJSON = await fs.readFile(`${reportDirRaw}/${fileName}`, 'utf8');
    const report = JSON.parse(reportJSON);
    await scorer(report);
    report.scoreProcID = scoreProcID;
    // Write it to a file.
    const scoredReportJSON = JSON.stringify(report, null, 2);
    await fs.writeFile(`${reportDirScored}/${fileName}`, `${scoredReportJSON}\n`);
    console.log(`Report ${fileName.slice(0, -5)} scored and saved`);
  };
  return reportFileNames.length;
};
