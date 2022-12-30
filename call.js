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
    await fs.writeFile(`${jobDir}/${job.id}.json`, jobJSON);
  }
  const {timeStamp} = jobs[0];
  console.log(
    `Script ${scriptID} and batch ${batchID} merged; jobs ${timeStamp}… saved in ${jobDir}`
  );
};
// Fulfills a scoring request.
const callScore = async (scorerID, selector = '') => {
  // Identify the raw reports to be scored.
  const rawFileNames = await fs.readdir(`${reportDir}/raw`);
  const reportIDs = rawFileNames
  .filter(fileName => fileName.endsWith('.json'))
  .filter(fileName => fileName.startsWith(selector))
  .map(fileName => fileName.slice(0, -5));
  // If any exist:
  if (reportIDs.length) {
    // Get the scorer.
    const {scorer} = require(`${functionDir}/score/${scorerID}`);
    // Get the reports.
    const rawReports = [];
    for (const reportID of reportIDs) {
      const rawReportJSON = await fs.readFile(`${reportDir}/raw/${reportID}.json`, 'utf8');
      const rawReport = JSON.parse(rawReportJSON);
      rawReports.push(rawReport);
    };
    // Score them
    const scoredReports = score(scorer, rawReports);
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
// Fulfills a multiple-report scoring request.
const callMultiScore = async scoreProcID => {
  // Score all raw reports.
  await multiScore(scoreProcID);
};
// Prepares to fulfill a digesting request.
const digestPrep = async digestProcID => {
  const {digest} = require('./digest');
  const {makeQuery} = require(`./${digestProcDir}/${digestProcID}/index`);
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
  const scoredReportJSON = await fs.readFile(`${scoredDir}/${scoredReportName}`, 'utf8');
  const scoredReport = JSON.parse(scoredReportJSON);
  const digestedReport = digest(prepData.digestTemplate, prepData.makeQuery, scoredReport);
  // Save it, digested.
  await fs.writeFile(`${digestedDir}/${scoredReport.job.id}.html`, digestedReport);
  console.log(`Digested report ${scoredReport.job.id} saved in ${digestedDir}`);
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
    `Digesting completed. Digest proc: ${digestProcID}. Report count: ${prepData.scoredReportNames.length}. Directory: ${digestedDir}.`
  );
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
