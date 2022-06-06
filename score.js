/*
  score.js
  Testilo scoring script.
*/

// ########## IMPORTS

// Module to keep secrets.
require('dotenv').config();
// Module to read and write files.
const fs = require('fs/promises');

// ########## CONSTANTS

const reportDirRaw = process.env.REPORTDIR_RAW || 'reports/raw';
const reportDirScored = process.env.REPORTDIR_SCORED || 'reports/scored';
const reportIDStart = process.argv[2];
const scoreProcID = process.argv[3];

// ########## FUNCTIONS

const score = async () => {
  const reportDirRawAbs = `${__dirname}/${reportDirRaw}`;
  const allReportFileNames = await fs.readdir(reportDirRawAbs);
  const sourceReportFileNames = allReportFileNames
  .filter(fileName => fileName.startsWith(reportIDStart) && fileName.endsWith('.json'));
  const {scorer} = require(`./procs/score/${scoreProcID}`);
  for (const fileName of sourceReportFileNames) {
    const reportJSON = await fs
    .readFile(`${reportDirRawAbs}/${fileName}`, 'utf8');
    const report = JSON.parse(reportJSON);
    scorer(report);
    report.score.scoreProcID = scoreProcID;
    const scoredReportJSON = JSON.stringify(report, null, 2);
    await fs.writeFile(`${__dirname}/${reportDirScored}/${fileName}`, scoredReportJSON);
    console.log(`Report ${fileName.slice(0, -5)} scored and saved`);
  };
};

// ########## OPERATION

score();
