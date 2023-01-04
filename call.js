/*
  call.js
  Invokes Testilo modules with arguments.
  This is the universal module for use of Testilo from a command line.
  Arguments:
    0. function to execute.
    1+. arguments to pass to the function.
  Usage examples:
    node call merge ts25 webOrgs user@domain.tld true
    node call score sp25a
    node call digest dp25a
    node call compare cp25a weborgs
*/

// ########## IMPORTS

// Module to keep secrets.
require('dotenv').config();
// Function to process files.
const fs = require('fs/promises');
// Function to process a merger.
const {merge} = require('./merge');
// Function to score reports.
const {score} = require('./score');
// Function to digest reports.
const {digest} = require('./digest');
// Function to compare scores.
const {compare} = require('./compare');

// ########## CONSTANTS

const specDir = process.env.SPECDIR;
const functionDir = process.env.FUNCTIONDIR;
const jobDir = process.env.JOBDIR;
const reportDir = process.env.REPORTDIR;
const fn = process.argv[2];
const fnArgs = process.argv.slice(3);

// ########## FUNCTIONS

// Fulfills a merging request.
const callMerge = async (scriptID, batchID, requester, withIsolation = false) => {
  // Get the script and the batch.
  const scriptJSON = await fs.readFile(`${specDir}/scripts/${scriptID}.json`, 'utf8');
  const script = JSON.parse(scriptJSON);
  const batchJSON = await fs.readFile(`${specDir}/batches/${batchID}.json`, 'utf8');
  const batch = JSON.parse(batchJSON);
  // Merge them into an array of jobs.
  const jobs = merge(script, batch, requester, withIsolation);
  // Save the jobs.
  for (const job of jobs) {
    const jobJSON = JSON.stringify(job, null, 2);
    await fs.writeFile(`${jobDir}/todo/${job.id}.json`, jobJSON);
  }
  const {timeStamp} = jobs[0];
  console.log(
    `Script ${scriptID} and batch ${batchID} merged; jobs ${timeStamp}… saved in ${jobDir}/todo`
  );
};
// Get selected reports.
const getReports = async (type, selector = '') => {
  const allFileNames = await fs.readdir(`${reportDir}/${type}`);
  const reportIDs = allFileNames
  .filter(fileName => fileName.endsWith('.json'))
  .filter(fileName => fileName.startsWith(selector))
  .map(fileName => fileName.slice(0, -5));
  const reports = [];
  for (const reportID of reportIDs) {
    const reportJSON = await fs.readFile(`${reportDir}/${type}/${reportID}.json`, 'utf8');
    const report = JSON.parse(reportJSON);
    reports.push(report);
  }
  return reports;
};
// Fulfills a scoring request.
const callScore = async (scorerID, selector = '') => {
  // Get the raw reports to be scored.
  const reports = getReports('raw', selector);
  // If any exist:
  if (reports.length) {
    // Get the scorer.
    const {scorer} = require(`${functionDir}/score/${scorerID}`);
    // Score the reports.
    const scoredReports = score(scorer, reports);
    const scoredReportDir = `${reportDir}/scored`;
    // For each scored report:
    for (const scoredReport of scoredReports) {
      // Save it.
      await fs.writeFile(
        `${scoredReportDir}/${scoredReport.id}.json`, JSON.stringify(scoredReport, null, 2)
      );
    };
  }
  // Otherwise, i.e. if no raw reports are to be scored:
  else {
    // Report this.
    console.log('ERROR: No raw reports to be scored');
  }
};
// Fulfills a digesting request.
const callDigest = async (digesterID, selector = '') => {
  // Get the scored reports to be digested.
  const reports = getReports('scored', selector);
  // If any exist:
  if (reports.length) {
    const digesterDir = `${functionDir}/digest/${digesterID}`;
    // Get the digester.
    const {digester} = require(`${digesterDir}/index`);
    // Get the template.
    const template = await fs.readFile(`${digesterDir}/index.html`);
    // Digest the reports.
    const digestedReports = digest(template, digester, reports);
    const digestedReportDir = `${reportDir}/digested`;
    // For each digested report:
    for (const digestedReport of digestedReports) {
      // Save it.
      await fs.writeFile(
        `${digestedReportDir}/${digestedReport.id}.json`, JSON.stringify(digestedReport, null, 2)
      );
    };
  }
  // Otherwise, i.e. if no scored reports are to be digested:
  else {
    // Report this.
    console.log('ERROR: No scored reports to be digested');
  }
};
// Fulfills a comparison request.
const callCompare = async (compareProcID, comparisonNameBase) => {
  await compare(compareProcID, comparisonNameBase);
  console.log(
    `Comparison completed. Comparison proc: ${compareProcID}. Directory: ${comparisonDir}.`
  );
};

// ########## OPERATION

// Execute the requested function.
if (fn === 'aim' && fnArgs.length === 5) {
  callAim(... fnArgs)
  .then(() => {
    console.log('Execution completed');
  });
}
else if (fn === 'merge' && fnArgs.length > 2 && fnArgs.length < 5) {
  callMerge(... fnArgs)
  .then(() => {
    console.log('Execution completed');
  });
}
else if (fn === 'score' && fnArgs.length > 0 && fnArgs.length < 3) {
  callScore(... fnArgs)
  .then(() => {
    console.log('Execution completed');
  });
}
else if (fn === 'multiScore' && fnArgs.length === 1) {
  callMultiScore(... fnArgs)
  .then(() => {
    console.log('Execution completed');
  });
}
else if (fn === 'digest' && fnArgs.length > 0 && fnArgs.length < 3) {
  callDigest(... fnArgs)
  .then(() => {
    console.log('Execution completed');
  });
}
else if (fn === 'multiDigest' && fnArgs.length === 1) {
  callMultiDigest(... fnArgs)
  .then(() => {
    console.log('Execution completed');
  });
}
else if (fn === 'compare' && fnArgs.length === 2) {
  callCompare(... fnArgs)
  .then(() => {
    console.log('Execution completed');
  });
}
else {
  console.log('ERROR: Invalid statement');
}
