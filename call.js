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
// Function to process a list-to-batch conversion.
const {batch} = require('./batch');
// Function to create a script from rule specifications.
const {script} = require('./script');
// Function to process a merger.
const {merge} = require('./merge');
// Function to generate a job series.
const {series} = require('./series');
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

// Converts a target list to a batch.
const callBatch = async (listID, what) => {
  // Get the target list.
  const listString = await fs.readFile(`${specDir}/targetLists/${listID}.tsv`, 'utf8');
  const list = listString.split('\n').map(target => target.split('\t'));
  // Convert it to a batch.
  const batchObj = batch(listID, what, list);
  // Save the batch.
  const batchJSON = JSON.stringify(batchObj, null, 2);
  await fs.writeFile(`${specDir}/batches/${listID}.json`, `${batchJSON}\n`);
  console.log(`Target list ${listID} converted to a batch and saved in ${specDir}/batches`);
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
  await fs.writeFile(`${specDir}/scripts/${scriptID}.json`, scriptJSON);
  console.log(`Script ${scriptID} created and saved in ${specDir}/scripts`);
};
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
    `Script ${scriptID} and batch ${batchID} merged; jobs ${timeStamp}-… saved in ${jobDir}/todo`
  );
};
// Fulfills a series request.
const callSeries = async (idStart, count, interval) => {
  // Get the initial job.
  const jobNames = await fs.readdir(`${jobDir}/todo`);
  const seriesJobName = jobNames.find(jobName => jobName.startsWith(idStart));
  // If it exists:
  if (seriesJobName) {
    // Generate a job series.
    const jobJSON = await fs.readFile(`${jobDir}/todo/${seriesJobName}`, 'utf8');
    const job = JSON.parse(jobJSON);
    const jobSeries = series(job, count, interval);
    // Save the jobs.
    for (const item of jobSeries) {
      await fs.writeFile(`${jobDir}/todo/${item.id}.json`);
    }
    console.log(`Series of ${jobSeries.length} jobs generated and saved in ${jobDir}/todo`);
  }
  // Otherwise, i.e. if it does not exist:
  else {
    // Report this.
    console.log('ERROR: No matching to-do job found');
  }
};
// Gets selected reports.
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
  const reports = await getReports('raw', selector);
  // If any exist:
  if (reports.length) {
    // Get the scorer.
    const {scorer} = require(`${functionDir}/score/${scorerID}`);
    // Score the reports.
    score(scorer, reports);
    const scoredReportDir = `${reportDir}/scored`;
    // For each scored report:
    for (const report of reports) {
      // Save it.
      await fs.writeFile(`${scoredReportDir}/${report.id}.json`, JSON.stringify(report, null, 2));
    };
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
    const digesterDir = `${functionDir}/digest/${digesterID}`;
    const {digester} = require(`${digesterDir}/index`);
    // Digest the reports.
    const digestedReports = await digest(digester, reports);
    const digestedReportDir = `${reportDir}/digested`;
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
    await fs.writeFile(`${reportDir}/credit/${tallyID}.json`, JSON.stringify(tally, null, 2));
    console.log(`Reports tallied and credit report saved in ${reportDir}/credit`);
  }
  // Otherwise, i.e. if no scored reports are to be tallied:
  else {
    // Report this.
    console.log('ERROR: No scored reports to be tallied');
  }
};

// ########## OPERATION

// Execute the requested function.
if (fn === 'aim' && fnArgs.length === 5) {
  callAim(... fnArgs)
  .then(() => {
    console.log('Execution completed');
  });
}
else if (fn === 'batch' && fnArgs.length === 2) {
  callBatch(... fnArgs)
  .then(() => {
    console.log('Execution completed');
  });
}
else if (fn === 'script' && fnArgs.length) {
  callScript(... fnArgs)
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
else if (fn === 'series' && fnArgs.length === 3) {
  callSeries(... fnArgs)
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
else if (fn === 'compare' && fnArgs.length > 1 && fnArgs.length < 4) {
  callCompare(... fnArgs)
  .then(() => {
    console.log('Execution completed');
  });
}
else if (fn === 'credit' && fnArgs.length === 2) {
  callCredit(... fnArgs)
  .then(() => {
    console.log('Execution completed');
  });
}
else {
  console.log('ERROR: Invalid statement');
}
