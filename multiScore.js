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
// Module to score reports.
const {score} = require('./score');

// ########## CONSTANTS

const reportDirRaw = process.env.REPORTDIR_RAW || 'reports/raw';
const reportDirScored = process.env.REPORTDIR_SCORED || 'reports/scored';
const scoreProcDir = process.env.SCOREPROCDIR || `${__dirname}/procs/score`;

// ########## FUNCTIONS

// Score the specified reports and return their count.
exports.multiScore = async scoreProcID => {
  // Get the score proc.
  const {scorer} = require(`${scoreProcDir}/${scoreProcID}`);
  // Identify the reports to be scored.
  let reportFileNames = await fs.readdir(reportDirRaw);
  reportFileNames = reportFileNames.filter(fileName => fileName.endsWith('.json'));
  // For each of them:
  for (const fileName of reportFileNames) {
    // Score it.
    const rawReportJSON = await fs.readFile(`${reportDirRaw}/${fileName}`, 'utf8');
    const rawReport = JSON.parse(rawReportJSON);
    const scoredReport = await score(scorer, rawReport);
    // Write it to a file.
    const scoredReportJSON = JSON.stringify(scoredReport, null, 2);
    await fs.writeFile(`${reportDirScored}/${fileName}`, `${scoredReportJSON}\n`);
  };
  console.log(
    `Scored reports saved in ${reportDirScored}. Report count: ${reportFileNames.length}.`
  );
};
