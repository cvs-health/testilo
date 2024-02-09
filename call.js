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
// Module to perform common operations.
const {getNowStamp, getRandomString} = require('./procs/util');
// Function to process files.
const fs = require('fs/promises');
// Function to process a list-to-batch conversion.
const {batch} = require('./batch');
// Function to create a script from rule specifications.
const {script} = require('./script');
// Function to process a merger.
const {merge} = require('./merge');
// Function to score reports.
const {score} = require('./score');
// Function to digest reports.
const {digest} = require('./digest');
// Function to difgest reports.
const {difgest} = require('./difgest');
// Function to compare scores.
const {compare} = require('./compare');
// Function to summarize reports.
const {summarize} = require('./summarize');
// Function to track audits.
const {track} = require('./track');

// ########## CONSTANTS

const specDir = process.env.SPECDIR;
const functionDir = process.env.FUNCTIONDIR;
const jobDir = process.env.JOBDIR;
const reportDir = process.env.REPORTDIR;
const fn = process.argv[2];
const fnArgs = process.argv.slice(3);

// ########## FUNCTIONS

// Converts a target list to a batch.
const callBatch = async (id, what) => {
  // Get the target list.
  const listString = await fs.readFile(`${specDir}/targetLists/${id}.tsv`, 'utf8');
  const list = listString
  .split('\n')
  .filter(target => target.length)
  .map(target => target.split('\t'));
  // Convert it to a batch.
  const batchObj = batch(id, what, list);
  // Save the batch.
  if (batchObj) {
    const batchJSON = JSON.stringify(batchObj, null, 2);
    await fs.writeFile(`${specDir}/batches/${id}.json`, `${batchJSON}\n`);
    console.log(`Target list ${id} converted to a batch and saved in ${specDir}/batches`);
  }
};
// Fulfills a script-creation request.
const callScript = async (scriptID, classificationID = null, ... issueIDs) => {
  // Get any issue classification.
  const issues = classificationID
  ? require(`${functionDir}/score/${classificationID}`).issues
  : null;
  // Create a script.
  const scriptObj = script(scriptID, issues, ... issueIDs);
  // Save the script.
  const scriptJSON = JSON.stringify(scriptObj, null, 2);
  await fs.writeFile(`${specDir}/scripts/${scriptID}.json`, `${scriptJSON}\n`);
  console.log(`Script ${scriptID} created and saved in ${specDir}/scripts`);
};
// Fulfills a merging request.
const callMerge = async (
  scriptID,
  batchID,
  standard,
  observe,
  requester,
  timeStamp,
  todoDir
) => {
  // Get the script and the batch.
  const scriptJSON = await fs.readFile(`${specDir}/scripts/${scriptID}.json`, 'utf8');
  const script = JSON.parse(scriptJSON);
  const batchJSON = await fs.readFile(`${specDir}/batches/${batchID}.json`, 'utf8');
  const batch = JSON.parse(batchJSON);
  // Merge them into an array of jobs.
  const jobs = merge(script, batch, standard, observe === 'true', requester, timeStamp);
  // Save the jobs.
  const subdir = `${jobDir}/${todoDir === 'true' ? 'todo' : 'pending'}`;
  for (const job of jobs) {
    const jobJSON = JSON.stringify(job, null, 2);
    await fs.writeFile(`${subdir}/${job.id}.json`, `${jobJSON}\n`);
  }
  const truncatedID = `${jobs[0].timeStamp}-${jobs[0].mergeID}-…`;
  console.log(`Script ${scriptID} and batch ${batchID} merged as ${truncatedID} in ${subdir}`);
};
// Gets the file base names (equal to the IDs) of the selected reports.
const getReportIDs = async (type, selector = '') => {
  const allFileNames = await fs.readdir(`${reportDir}/${type}`);
  const reportIDs = allFileNames
  .filter(fileName => fileName.endsWith('.json'))
  .filter(fileName => fileName.startsWith(selector))
  .map(fileName => fileName.slice(0, -5));
  return reportIDs;
};
// Gets and returns a report.
const getReport = async (type, id) => {
  const reportJSON = await fs.readFile(`${reportDir}/${type}/${id}.json`, 'utf8');
  const report = JSON.parse(reportJSON);
  return report;
};
// Fulfills a scoring request.
const callScore = async (scorerID, selector = '') => {
  // Get the raw reports to be scored.
  const reportIDs = await getReportIDs('raw', selector);
  // If any exist:
  if (reportIDs.length) {
    // Get the scorer.
    const {scorer} = require(`${functionDir}/score/${scorerID}`);
    // Score and save the reports.
    const scoredReportDir = `${reportDir}/scored`;
    await fs.mkdir(scoredReportDir, {recursive: true});
    for (const reportID of reportIDs) {
      const report = await getReport('raw', reportID);
      score(scorer, report);
      await fs.writeFile(
        `${scoredReportDir}/${reportID}.json`, `${JSON.stringify(report, null, 2)}\n`
      );
    }
    console.log(`Reports scored and saved in ${scoredReportDir}`);
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
  const reports = await getReports('scored', selector);
  // If any exist:
  if (reports.length) {
    // Get the digester.
    const {digester} = require(`${functionDir}/digest/${digesterID}/index`);
    // Digest the reports.
    const digestedReports = await digest(digester, reports);
    const digestedReportDir = `${reportDir}/digested`;
    await fs.mkdir(digestedReportDir, {recursive: true});
    // For each digested report:
    for (const reportID of Object.keys(digestedReports)) {
      // Save it.
      await fs.writeFile(`${digestedReportDir}/${reportID}.html`, digestedReports[reportID]);
    };
    console.log(`Reports digested and saved in ${digestedReportDir}`);
  }
  // Otherwise, i.e. if no scored reports are to be digested:
  else {
    // Report this.
    console.log('ERROR: No scored reports to be digested');
  }
};
// Fulfills a difgesting request.
const callDifgest = async (difgesterID, reportAID, reportBID) => {
  // Get the scored reports to be difgested.
  const reportAArray = await getReports('scored', reportAID);
  const reportBArray = await getReports('scored', reportBID);
  const reportA = reportAArray[0];
  const reportB = reportBArray[0];
  // If both exist:
  if (reportAID && reportBID) {
    // Get the difgester.
    const difgesterDir = `${functionDir}/difgest/${difgesterID}`;
    const {difgester} = require(`${difgesterDir}/index`);
    // Difgest the reports.
    const difgestedReport = await difgest(difgester, reportA, reportB);
    const difgestedReportDir = `${reportDir}/difgested`;
    await fs.mkdir(difgestedReportDir, {recursive: true});
    // Save the difgested report.
    const difgestID = `${getNowStamp()}-${getRandomString(2)}-0`;
    const difgestPath = `${difgestedReportDir}/${difgestID}.html`;
    await fs.writeFile(difgestPath, difgestedReport);
    console.log(`Reports ${reportAID} and ${reportBID} difgested and saved as ${difgestPath}`);
  }
  // Otherwise, i.e. if no scored reports are to be digested:
  else {
    // Report this.
    console.log('ERROR: No pair of scored reports to be digested');
  }
};
// Fulfills a comparison request.
// Get the scored reports to be scored.
const callCompare = async (compareProcID, comparisonNameBase, selector = '') => {
  const reports = await getReports('scored', selector);
  // If any exist:
  if (reports.length) {
    // Get the comparer.
    const comparerDir = `${functionDir}/compare/${compareProcID}`;
    const {comparer} = require(`${comparerDir}/index`);
    // Compare the reports.
    const comparison = await compare(comparer, reports);
    // Save the comparison.
    const comparisonDir = `${reportDir}/comparative`;
    await fs.mkdir(comparisonDir, {recursive: true}); 
    await fs.writeFile(`${comparisonDir}/${comparisonNameBase}.html`, comparison);
    console.log(`Comparison completed and saved in ${comparisonDir}`);
  }
};
// Fulfills a credit request.
const callCredit = async (tallyID, selector = '') => {
  // Get the scored reports to be tallied.
  const reports = await getReports('scored', selector);
  // If any exist:
  if (reports.length) {
    // Get the tallier.
    const {credit} = require(`${functionDir}/analyze/credit`);
    // Tally the reports.
    const tally = credit(reports);
    // Save the tally.
    const creditDir = `${reportDir}/credit`;
    await fs.mkdir(creditDir, {recursive: true}); 
    await fs.writeFile(`${creditDir}/${tallyID}.json`, JSON.stringify(tally, null, 2));
    console.log(`Reports tallied and credit report ${tallyID} saved in ${creditDir}`);
  }
  // Otherwise, i.e. if no scored reports are to be tallied:
  else {
    // Report this.
    console.log('ERROR: No scored reports to be tallied');
  }
};
// Fulfills a summarization request.
const callSummarize = async (what, selector = '') => {
  // Get the scored reports to be summarized.
  const reports = await getReports('scored', selector);
  // If any exist:
  if (reports.length) {
    // Summarize them.
    const summary = summarize(what, reports);
    // Add the selector, if any, to the summary.
    if (selector) {
      summary.selector = selector;
    }
    // Save the summary.
    const summaryDir = `${reportDir}/summarized`;
    await fs.mkdir(summaryDir, {recursive: true}); 
    const filePath = `${summaryDir}/${summary.id}.json`;
    await fs.writeFile(filePath, `${JSON.stringify(summary, null, 2)}\n`);
    console.log(`Reports summarized and summary saved as ${filePath}`);
  }
  // Otherwise, i.e. if no scored reports are to be summarized:
  else {
    // Report this.
    console.log('ERROR: No scored reports to be summarized');
  }
};
// Fulfills a tracking request.
const callTrack = async (trackerID, summaryID, orderID, targetWhat) => {
  // Get the summary.
  try {
    const summaryJSON = await fs.readFile(`${reportDir}/summarized/${summaryID}.json`, 'utf8');
    const summary = JSON.parse(summaryJSON);
    // Remove unwanted audits from it.
    summary.data = summary.data.filter(audit => {
      if (orderID && audit.order !== orderID) {
        return false;
      }
      if (targetWhat && audit.target && audit.target.what !== targetWhat) {
        return false;
      }
      return true;
    });
    // If any audits remain:
    if (summary.data.length) {
      // Get the tracker.
      const {tracker} = require(`${functionDir}/track/${trackerID}/index`);
      // Track the audits.
      const [reportID, trackingReport] = await track(tracker, summary);
      // Save the tracking report.
      await fs.mkdir(`${reportDir}/tracking`, {recursive: true});
      const reportPath = `${reportDir}/tracking/${reportID}.html`;
      await fs.writeFile(reportPath, trackingReport);
      console.log(`Tracking report saved in ${reportPath}`);
    }
    // Otherwise, i.e. if no audits remain:
    else {
      console.log('ERROR: No audits match the request');
    }
  }
  catch(error) {
    console.log(`ERROR: Tracking request invalid (${error.message})`);
  }
};

// ########## OPERATION

// Execute the requested function.
if (fn === 'batch' && fnArgs.length === 2) {
  callBatch(... fnArgs)
  .then(() => {
    console.log('Execution completed');
  });
}
else if (fn === 'script' && (fnArgs.length === 1 || fnArgs.length > 2)) {
  callScript(... fnArgs)
  .then(() => {
    console.log('Execution completed');
  });
}
else if (fn === 'merge' && fnArgs.length === 7) {
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
else if (fn === 'digest' && fnArgs.length && fnArgs.length < 3) {
  callDigest(... fnArgs)
  .then(() => {
    console.log('Execution completed');
  });
}
else if (fn === 'difgest' && fnArgs.length === 3) {
  callDifgest(... fnArgs)
  .then(() => {
    console.log('Execution completed');
  });
}
else if (fn === 'compare' && fnArgs.length > 1 && fnArgs.length < 4) {
  callCompare(... fnArgs)
  .then(() => {
    console.log('Execution completed');
  });
}
else if (fn === 'credit' && fnArgs.length > 0 && fnArgs.length < 3) {
  callCredit(... fnArgs)
  .then(() => {
    console.log('Execution completed');
  });
}
else if (fn === 'summarize' && fnArgs.length > 0 && fnArgs.length < 3) {
  callSummarize(... fnArgs)
  .then(() => {
    console.log('Execution completed');
  });
}
else if (fn === 'track' && fnArgs.length > 1 && fnArgs.length < 5) {
  callTrack(... fnArgs)
  .then(() => {
    console.log('Execution completed');
  });
}
else {
  console.log('ERROR: Invalid statement');
}
