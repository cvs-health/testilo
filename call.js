/*
  do.js
  Invokes Testilo modules with arguments.
  This is the universal module for use of Testilo from a command line.
  Arguments:
    0. function to execute.
    1+. arguments to pass to the function.
  Usage examples:
    node call aim script454 https://www.w3c.org/ 'World Wide Web Consortium' w3c
    node call merge script454 webOrgs
    node call score sp25a (to score all reports in REPORTDIR_RAW)
    node call score sp25a 8ep9f- (same, but only if names start with 8ep9f-)
    node call digest dp25a (to digest all reports in REPORTDIR_SCORED)
    node call digest dp25a 8ep9f- (same, but only if names start with 8ep9f-)
    node call compare cp25a weborgs (to write weborgs.html, comparing all reports in REPORTDIR_SCORED)
*/

// ########## IMPORTS

// Module to keep secrets.
require('dotenv').config();
// Function to process a script aiming.
const fs = require('fs/promises');
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

const jobDir = process.env.JOBDIR;
const scoredDir = process.env.REPORTDIR_SCORED;
const digestedDir = process.env.REPORTDIR_DIGESTED;
const comparisonDir = process.env.COMPARISONDIR;
const fn = process.argv[2];
const fnArgs = process.argv.slice(3);

// ########## FUNCTIONS

// Fulfills an aiming request.
const callAim = async (scriptName, hostURL, hostName, hostID, notifyee) => {
  const aimedScript = await aim(
    scriptName,
    {
      id: hostID,
      which: hostURL,
      what: hostName
    }, 
    notifyee
  );
  const aimedScriptID = aimedScript.id;
  await fs.writeFile(`${jobDir}/${aimedScriptID}.json`, JSON.stringify(aimedScript, null, 2));
  console.log(`Script ${aimedScriptID}.json has been aimed at ${hostName} and saved in ${jobDir}`);
};
// Fulfills a merger request.
const callMerge = async (scriptName, batchName) => {
  await merge(scriptName, batchName);
  console.log(`Batch ${batchName}.json merged into script ${scriptName} in ${jobDir}`);
};
// Fulfills a scoring request.
const callScore = async (scoreProcID, reportIDStart) => {
  const reportCount = await score(scoreProcID, reportIDStart);
  console.log(
    `Scoring completed. Score proc: ${scoreProcID}. Report count: ${reportCount}. Directory: ${scoredDir}`
  );
};
// Fulfills a digesting request.
const callDigest = async (digestProcID, reportIDStart) => {
  const reportCount = await digest(digestProcID, reportIDStart);
  console.log(
    `Digesting completed. Digest proc: ${digestProcID}. Report count: ${reportCount}. Directory: ${digestedDir}`
  );
};
// Fulfills a comparison request.
const callCompare = async (compareProcID, comparisonNameBase) => {
  await compare(compareProcID, comparisonNameBase);
  console.log(
    `Comparison completed. Comparison proc: ${compareProcID}. Directory: ${comparisonDir}`
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
else if (fn === 'merge' && fnArgs.length === 2) {
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
else if (fn === 'digest' && fnArgs.length > 0 && fnArgs.length < 3) {
  callDigest(... fnArgs)
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
