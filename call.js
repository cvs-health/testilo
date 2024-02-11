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
const {getFileID, getNowStamp, getRandomString} = require('./procs/util');
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
// Function to credit tools for issues in reports.
const {credit} = require('./credit');
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

// Gets a summary report.
const getSummaryReport = async selector => {
  const summaryDir = `${reportDir}/summarized`;
  const summaryReportNames = await fs.readdir(summaryDir);
  const summaryReportName = summaryReportNames.find(reportName => reportName.startsWith(selector));
  if (summaryReportName) {
    const summaryReportJSON = await fs.readFile(`${summaryDir}/${summaryReportName}`, 'utf8');
    const summaryReport = JSON.parse(summaryReportJSON);
    return summaryReport;
  }
  else {
    throw new Error(`ERROR: No summary report name starts with ${selector}`);
  }
};
// Converts a target list to a batch.
const callBatch = async (id, what) => {
  // Get the target list.
  try {
    const listString = await fs.readFile(`${specDir}/targetLists/${id}.txt`, 'utf8');
    const list = listString
    .split('\n')
    .filter(target => target.length)
    .map(target => target.split('|'));
    // Convert it to a batch.
    const batchObj = batch(id, what, list);
    // Save the batch.
    if (batchObj) {
      const batchJSON = JSON.stringify(batchObj, null, 2);
      const batchPath = `${specDir}/batches/${id}.json`;
      await fs.writeFile(batchPath, `${batchJSON}\n`);
      console.log(`Target list ${id} converted to a batch and saved as ${batchPath}`);
    }
  }
  catch(error) {
    console.log(`ERROR converting target list to batch (${error.message})`);
  }
};
// Fulfills a script-creation request.
const callScript = async (scriptID, what, classificationID = null, ... issueIDs) => {
  try {
    // Get any issue classification.
    const issues = classificationID
    ? require(`${functionDir}/score/${classificationID}`).issues
    : null;
    // Sanitize the ID.
    scriptID = scriptID.replace(/[^a-zA-Z0-9]/g, '');
    if (scriptID === '') {
      scriptID = `script-${getRandomString(2)}`;
    }
    // Create a script.
    const scriptObj = script(scriptID, what, issues, ... issueIDs);
    // Save the script.
    const scriptJSON = JSON.stringify(scriptObj, null, 2);
    const scriptPath = `${specDir}/scripts/${scriptID}.json`;
    await fs.writeFile(scriptPath, `${scriptJSON}\n`);
    console.log(`Script created and saved as ${scriptPath}`);
  }
  catch(error) {
    console.log(`ERROR creating script (${error.message})`);
  }
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
  try {
    // If the todoDir argument is invalid:
    if (! ['true', 'false'].includes(todoDir)) {
      // Report this.
      throw new Error('Invalid todoDir configuration');
    }
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
  }
  catch(error) {
    console.log(`ERROR merging script and batch (${error.message})`);
  }
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
  // Get the base base names (equal to the IDs) of the scored reports to be digested.
  const reportIDs = await getReportIDs('scored', selector);
  // If any exist:
  if (reportIDs.length) {
    try {
      // Get the digester.
      const {digester} = require(`${functionDir}/digest/${digesterID}/index`);
      // Digest and save the reports.
      const digestDir = `${reportDir}/digested`;
      await fs.mkdir(digestDir, {recursive: true});
      for (const reportID of reportIDs) {
        const report = await getReport('scored', reportID);
        const digestedReport = await digest(digester, report);
        await fs.writeFile(`${digestDir}/${reportID}.html`, digestedReport);
      };
      console.log(`Reports digested and saved in ${digestDir}`);
    }
    catch(error) {
      console.log(`ERROR digesting reports (${error.message})`);
    }
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
  const reportA = await getReport('scored', reportAID);
  const reportB = await getReport('scored', reportBID);
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
// Fulfills a summarization request.
const callSummarize = async (what, selector = '') => {
  // Get the IDs of the scored reports to be summarized.
  const reportIDs = await getReportIDs('scored', selector);
  // If any exist:
  if (reportIDs.length) {
    // Initialize a summary report.
    const summaryReport = {
      id: getFileID(2),
      what,
      data: []
    };
    // For each report to be summarized:
    for (const reportID of reportIDs) {
      // Get it.
      const report = await getReport('scored', reportID);
      // Add a summary of it to the summary report.
      const summary = summarize(report);
      summaryReport.data.push(summary);
    };
    // Save the summary report.
    const summaryDir = `${reportDir}/summarized`;
    await fs.mkdir(summaryDir, {recursive: true}); 
    const filePath = `${summaryDir}/${summaryReport.id}.json`;
    await fs.writeFile(filePath, `${JSON.stringify(summaryReport, null, 2)}\n`);
    console.log(`Reports summarized and summary report saved as ${filePath}`);
  }
  // Otherwise, i.e. if no scored reports are to be summarized:
  else {
    // Report this.
    console.log('ERROR: No scored reports to be summarized');
  }
};
// Fulfills a comparison request.
const callCompare = async (what, compareProcID, selector) => {
  // Get the specified summary report.
  const summaryReport = await getSummaryReport(selector);
  // If it exists:
  if (summaryReport) {
    try {
      // Get the comparer.
      const comparerDir = `${functionDir}/compare/${compareProcID}`;
      const {comparer} = require(`${comparerDir}/index`);
      // Compare the reports and save the comparison.
      const comparisonDir = `${reportDir}/comparative`;
      await fs.mkdir(comparisonDir, {recursive: true}); 
      const id = getFileID(2);
      const comparison = await compare(id, what, comparer, summaryReport);
      const comparisonPath = `${comparisonDir}/${id}.html`;
      await fs.writeFile(comparisonPath, comparison);
      console.log(`Comparison completed and saved as ${comparisonPath}`);
    }
    catch(error) {
      console.log(`ERROR comparing scores (${error.message})`);
    }
  }
};
// Fulfills a credit request.
const callCredit = async (what, selector = '') => {
  // Get the IDs of the scored reports to be credited.
  const reportIDs = await getReportIDs('scored', selector);
  // If any exist:
  if (reportIDs.length) {
    // Get an array of the score properties of the reports to be credited.
    const reportScores = [];
    for (const id of reportIDs) {
      const report = await getReport('scored', id);
      reportScores.push(report.score);
    }
    // Credit the reports.
    const tally = credit(what, reportScores);
    // Save the credit report.
    const creditDir = `${reportDir}/credit`;
    await fs.mkdir(creditDir, {recursive: true});
    const creditReportID = getFileID(2);
    const reportPath = `${creditDir}/${creditReportID}.json`;
    await fs.writeFile(reportPath, JSON.stringify(tally, null, 2));
    console.log(`Reports credited and credit report saved as ${reportPath}`);
  }
  // Otherwise, i.e. if no scored reports are to be credited:
  else {
    // Report this.
    console.log('ERROR: No scored reports to be credited');
  }
};
// Fulfills a tracking request.
const callTrack = async (trackerID, summaryID, orderID, targetWhat) => {
  // Get the summary.
  try {
    const summaryJSON = await fs.readFile(`${reportDir}/summarized/${summaryID}.json`, 'utf8');
    const summary = JSON.parse(summaryJSON);
    // Remove unwanted audits from it.
    summary.data = summary.data.filter(result => {
      if (orderID && result.order !== orderID) {
        return false;
      }
      if (targetWhat && result.target && result.target.what !== targetWhat) {
        return false;
      }
      return true;
    });
    // If any results remain:
    if (summary.data.length) {
      // Get the tracker.
      const {tracker} = require(`${functionDir}/track/${trackerID}/index`);
      // Track the results.
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
else if (fn === 'script' && (fnArgs.length === 2 || fnArgs.length > 3)) {
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
else if (fn === 'summarize' && fnArgs.length > 0 && fnArgs.length < 3) {
  callSummarize(... fnArgs)
  .then(() => {
    console.log('Execution completed');
  });
}
else if (fn === 'compare' && fnArgs.length === 3) {
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
else if (fn === 'track' && fnArgs.length > 1 && fnArgs.length < 5) {
  callTrack(... fnArgs)
  .then(() => {
    console.log('Execution completed');
  });
}
else {
  console.log('ERROR: Invalid statement');
}
