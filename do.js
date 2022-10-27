/*
  do.js
  Invokes Testilo modules with arguments.
  This is the universal module for use of Testilo from a command line.
  Arguments:
    0. function to execute.
    1+. arguments to pass to the function.
  Usage examples:
    node do aim script454 https://www.w3c.org/ 'World Wide Web Consortium' w3c
    node do merge script454 webOrgs
    node do score sp25a (to score all reports in REPORTDIR_RAW)
    node do score sp25a 8ep9f- (same, but only if names start with 8ep9f-)
    node do digest dp25a (to digest all reports in REPORTDIR_SCORED)
    node do digest dp25a 8ep9f- (same, but only if names start with 8ep9f-)
    node do compare cp25a weborgs (to write weborgs.html, comparing all reports in REPORTDIR_SCORED)
*/

// ########## IMPORTS

// Module to keep secrets.
require('dotenv').config();
// Function to process a script aiming.
const {aim} = require('./aim');
// Function to process a script-batch merger.
const {merge} = require('./merge');
// Function to score reports.
const {score} = require('./score');
// Function to digest reports.
const {digest} = require('./digest');
// Function to compare scores.
const {compare} = require('./compare');

// ########## CONSTANTS

const watchDir = process.env.WATCHDIR;
const rawDir = process.env.REPORTDIR_RAW;
const scoredDir = process.env.REPORTDIR_SCORED;
const digestedDir = process.env.REPORTDIR_DIGESTED;
const comparisonDir = process.env.COMPARISONDIR;

// ########## FUNCTIONS

// Fulfills a high-level testing request.
const doAim = async (scriptName, hostURL, hostName, hostID, notifyee) => {
  await aim(
    scriptName,
    {
      id: hostID,
      which: hostURL,
      what: hostName
    }, 
    notifyee
  );
  console.log(`Request for aiming ${scriptID}.json at ${hostName} completed`);
};
// Fulfills a merger request.
const doMerge = async (scriptName, batchName) => {
  await merge(scriptName, batchName);
  console.log(`Batch ${batchName}.json merged into script ${scriptName} in ${watchDir}`);
};
// Fulfills a scoring request.
const doScore = async (scoreProcID, reportIDStart) => {
  const reportCount = await score(scoreProcID, reportIDStart);
  console.log(
    `Scoring completed. Score proc: ${scoreProcID}. Report count: ${reportCount}. Directory: ${scoredDir}`
  );
};
// Starts a watch.
const doWatch = async (isDirWatch, isForever, interval) => {
  console.log(
    `Starting a ${isForever ? 'repeating' : 'one-time'} ${isDirWatch ? 'directory' : 'network'} watch`
  );
  await cycle(isDirWatch, isForever, interval);
  console.log('Watching ended');
};

// ########## OPERATION

// Execute the requested function.
if (fn === 'high' && fnArgs.length === 1) {
  doHigh(fnArgs)
  .then(() => {
    console.log('Execution completed');
  });
}
else if (fn === 'watch' && fnArgs.length === 3) {
  doWatch(... fnArgs)
  .then(() => {
    console.log('Execution completed');
  });
}
else {
  console.log('ERROR: Invalid statement');
}
