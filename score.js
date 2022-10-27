/*
  score.js
  Scores Testaro reports.
  Reads reports in process.env.REPORTDIR_RAW and outputs into process.env.REPORTDIR_SCORED.
  Arguments:
    0. Base of name of score proc located in procs/score.
    1?. Starting substring of names of reports in process.env.REPORTDIR_RAW.
  Usage examples:
    node score sp18a 35k1r (to score all reports with names starting with 35k1r)
    node score sp18a (to score all reports)
*/

// ########## IMPORTS

// Module to keep secrets.
require('dotenv').config();
// Module to read and write files.
const fs = require('fs/promises');

// ########## CONSTANTS

const reportDirRaw = process.env.REPORTDIR_RAW || 'reports/raw';
const reportDirScored = process.env.REPORTDIR_SCORED || 'reports/scored';

// ########## FUNCTIONS

// Score the specified reports and return their count.
exports.score = async (scoreProcID, reportIDStart) => {
  // Identify the reports to be scored.
  const reportDirRawAbs = `${__dirname}/${reportDirRaw}`;
  let reportFileNames = await fs.readdir(reportDirRawAbs);
  reportFileNames = reportFileNames.filter(fileName => fileName.endsWith('.json'));
  if (reportIDStart) {
    reportFileNames = reportFileNames.filter(fileName => fileName.startsWith(reportIDStart));
  }
  // For each of them:
  const {scorer} = require(`./procs/score/${scoreProcID}`);
  for (const fileName of reportFileNames) {
    // Score it.
    const reportJSON = await fs.readFile(`${reportDirRawAbs}/${fileName}`, 'utf8');
    const report = JSON.parse(reportJSON);
    await scorer(report);
    report.scoreProcID = scoreProcID;
    // Write it to a file.
    const scoredReportJSON = JSON.stringify(report, null, 2);
    await fs.writeFile(`${__dirname}/${reportDirScored}/${fileName}`, `${scoredReportJSON}\n`);
    console.log(`Report ${fileName.slice(0, -5)} scored and saved`);
  };
  return reportFileNames.length;
};
