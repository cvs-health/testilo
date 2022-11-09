/*
  do.js
  Invokes Testilo modules with arguments.
  This is the universal module for use of Testilo from a command line.
  Arguments:
    0. function to execute.
    1+. arguments to pass to the function.
  Usage examples:
    node call aim tp25 https://www.w3c.org/ 'World Wide Web Consortium' w3c developer@w3.org
    node call merge script454 webOrgs
    node call score sp25a (to score the first raw report)
    node call score sp25a 8ep9f (to score the first raw report whose name starts with 8ep9f)
    node call multiScore sp25a
    node call digest dp25a (to digest the first scored report)
    node call digest dp25a 8ep9f (to digest the first scored report whose name starts with 8ep9f)
    node call multiDigest dp25a
    node call compare cp25a weborgs (to write weborgs.html, comparing all scored reports)
*/

// ########## IMPORTS

// Module to keep secrets.
require('dotenv').config();
// Function to process a script aiming.
const fs = require('fs/promises');
const {aim} = require('./aim');
// Function to process a script-batch merger.
const {merge} = require('./merge');
// Function to score a report.
const {score} = require('./score');
// Function to score multiple reports.
const {multiScore} = require('./multiScore');
// Function to digest a report.
const {digest} = require('./digest');
// Function to digest multiple reports.
const {multiDigest} = require('./multiDigest');
// Function to compare scores.
const {compare} = require('./compare');

// ########## CONSTANTS

const scriptDir = process.env.SCRIPTDIR;
const scoreProcDir = process.env.SCOREPROCDIR;
const digestProcDir = process.env.DIGESTPROCDIR;
const jobDir = process.env.JOBDIR;
const rawDir = process.env.REPORTDIR_RAW;
const scoredDir = process.env.REPORTDIR_SCORED;
const digestedDir = process.env.REPORTDIR_DIGESTED;
const comparisonDir = process.env.COMPARISONDIR;
const fn = process.argv[2];
const fnArgs = process.argv.slice(3);

// ########## FUNCTIONS

// Fulfills an aiming request.
const callAim = async (scriptName, hostURL, hostName, hostID, requester) => {
  const scriptJSON = await fs.readFile(`${scriptDir}/${scriptName}.json`, 'utf8');
  const script = JSON.parse(scriptJSON);
  const aimedScript = aim(
    script,
    {
      id: hostID,
      which: hostURL,
      what: hostName
    }, 
    requester
  );
  const scriptID = script.sources.script;
  const jobID = aimedScript.id;
  await fs.writeFile(`${jobDir}/${jobID}.json`, `${JSON.stringify(aimedScript, null, 2)}\n`);
  console.log(`Script ${scriptID} aimed at ${hostName} saved as ${jobID}.json in ${jobDir}`);
};
// Fulfills a merger request.
const callMerge = async (scriptName, batchName) => {
  await merge(scriptName, batchName);
  console.log(`Batch ${batchName}.json merged into script ${scriptName} in ${jobDir}`);
};
// Fulfills a scoring request.
const callScore = async (scoreProcID, reportIDStart = '') => {
  // Identify the raw reports.
  const rawFileNames = await fs.readdir(rawDir);
  const rawReportNames = rawFileNames.filter(fileName => fileName.endsWith('.json'));
  // If any exist:
  if (rawReportNames.length) {
    // Identify the one to be scored.
    let rawReportName = '';
    if (reportIDStart) {
      rawReportName = rawReportNames.find(reportName => reportName.startsWith(reportIDStart));
    }
    else {
      rawReportName = rawReportNames[0];
    }
    // If it exists:
    if (rawReportName) {
      // Score it.
      const rawReportJSON = await fs.readFile(`${rawDir}/${rawReportName}.json`);
      const rawReport = JSON.parse(rawReportJSON);
      const {scorer} = require(`${scoreProcDir}/${scoreProcID}.js`);
      const scoredReport = score(scorer, rawReport);
      // Save it, scored.
      await fs.writeFile(
        `${scoredDir}/${scoredReport.id}.json`, JSON.stringify(scoredReport, null, 2)
      );
      console.log(`Report ${rawReport.id} scored and saved in ${scoredDir}`);
    }
    // Otherwise, i.e. if it does not exist:
    else {
      // Report this.
      console.log('ERROR: Specified raw report not found');
    }
  }
  // Otherwise, i.e. if no raw report found:
  else {
    // Report this.
    console.log('ERROR: No raw report found');
  }
};
// Fulfills a multiple-report scoring request.
const callMultiScore = async scoreProcID => {
  // Identify all the raw reports.
  const rawFileNames = await fs.readdir(rawDir);
  const rawReportNames = rawFileNames.filter(fileName => fileName.endsWith('.json'));
  // If any exist:
  if (rawReportNames.length) {
    // For each of them:
    const {scorer} = require(`${scoreProcDir}/${scoreProcID}.js`);
    for (const rawReportName of rawReportNames) {
      // Score it.
      const rawReportJSON = await fs.readFile(`${rawDir}/${rawReportName}.json`);
      const rawReport = JSON.parse(rawReportJSON);
      const scoredReport = score(scorer, rawReport);
      // Save it, scored.
      await fs.writeFile(
        `${scoredDir}/${scoredReport.id}.json`, JSON.stringify(scoredReport, null, 2)
      );
      console.log(`Report ${rawReport.id} scored and saved in ${scoredDir}`);
    }
  }
  // Otherwise, i.e. if no raw report exists:
  else {
    // Report this.
    console.log('ERROR: No raw report found');
  }
};
// Prepares to fulfill a digesting request.
const digestPrep = async digestProcID => {
  const {digest} = require('testilo/digest');
  const {makeQuery} = require(`${digestProcDir}/${digestProcID}/index`);
  const digestTemplate = await fs.readFile(`${digestProcDir}/${digestProcID}/index.html`, 'utf8');
  // Identify the scored reports.
  const scoredFileNames = await fs.readdir(scoredDir);
  const scoredReportNames = scoredFileNames.filter(fileName => fileName.endsWith('.json'));
  // Return the data required for the fulfillment of the request.
  return {
    anyScoredReports: scoredReportNames.length > 0,
    digest,
    makeQuery,
    digestTemplate,
    scoredReportNames
  };
};
// Digests and saves a report.
const digestReport = async (scoredReportName, prepData) => {
  // Digest the specified report.
  const scoredReportJSON = await fs.readFile(`${scoredDir}/${scoredReportName}.json`, 'utf8');
  const scoredReport = JSON.parse(scoredReportJSON);
  const digestedReport = digest(prepData.digestTemplate, prepData.makeQuery, scoredReport);
  // Save it, digested.
  await fs.writeFile(`${digestedDir}/${digestedReport.id}.html`, digestedReport);
  console.log(`Report ${scoredReport.id} digested and saved in ${digestedDir}`);
};
// Fulfills a digesting request.
const callDigest = async (digestProcID, reportIDStart = '') => {
  const prepData = await digestPrep(digestProcID);
  // If any scored reports exist:
  if (prepData.anyScoredReports) {
    // Identify the one to be digested.
    let scoredReportName = '';
    if (reportIDStart) {
      scoredReportName = prepData.scoredReportNames.find(
        reportName => reportName.startsWith(reportIDStart)
      );
    }
    else {
      scoredReportName = prepData.scoredReportNames[0];
    }
    // If it exists:
    if (scoredReportName) {
      // Digest and save it.
      await digestReport(scoredReportName, prepData);
    }
    // Otherwise, i.e. if it does not exist:
    else {
      // Report this.
      console.log('ERROR: Specified scored report not found');
    }
  }
  // Otherwise, i.e. if no scored report exists:
  else {
    // Report this.
    console.log('ERROR: No scored report found');
  }
};
// Fulfills a multiple-report digesting request.
const callMultiDigest = async digestProcID => {
  const prepData = await digestPrep(digestProcID);
  // If any scored reports exist:
  if (prepData.anyScoredReports) {
    // For each of them:
    for (const scoredReportName of prepData.scoredReportNames) {
      // Digest and save it.
      await digestReport(scoredReportName, prepData);
    }
  }
  // Otherwise, i.e. if no raw report exists:
  else {
    // Report this.
    console.log('ERROR: No raw report found');
  }
  console.log(
    `Digesting completed. Digest proc: ${digestProcID}. Report count: ${prepData.scoredReportNames.length}. Directory: ${digestedDir}`
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
