/*
  score.js
  Testilo scoring script.
  Usage example: node score 35k1r-railpass sp10a
*/

// ########## IMPORTS

// Module to keep secrets.
require('dotenv').config();
// Module to read and write files.
const fs = require('fs/promises');

// ########## CONSTANTS

const reportDirRaw = process.env.REPORTDIR_RAW || 'reports/raw';
const reportDirScored = process.env.REPORTDIR_SCORED || 'reports/scored';
const scoreProcID = process.argv[2];
const reportIDStart = process.argv[3];

// ########## FUNCTIONS

// Score the specified reports.
const score = async () => {
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
    report.score.scoreProcID = scoreProcID;
    // Write it to a file.
    const scoredReportJSON = JSON.stringify(report, null, 2);
    await fs.writeFile(`${__dirname}/${reportDirScored}/${fileName}`, `${scoredReportJSON}\n`);
    console.log(`Report ${fileName.slice(0, -5)} scored and saved`);
  };
};

// ########## OPERATION

score();
