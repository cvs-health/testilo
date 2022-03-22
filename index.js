/*
  index.js
  Testilo main script.
*/

// ########## IMPORTS

// Module to keep secrets local.
require('dotenv').config();
// Module to make HTTP(S) requests.
// const https = require('https');
const http = require('http');
// Module to read and write files.
const fs = require('fs').promises;
// Module to perform tests.
const {handleRequest} = require('testaro');

// ########## CONSTANTS
const {USERNAME, AUTHCODE, HOSTNAME, PORT} =  process.env;

// ########## FUNCTIONS

// Sends a request to the Aorta server and returns the response data.
const makeAortaRequest = async (what, specs = {}) => {
  const content = {
    userName: USERNAME,
    authCode: AUTHCODE,
    what
  };
  Object.assign(content, specs);
  const contentJSON = JSON.stringify(content);
  const options = {
    hostname: HOSTNAME,
    port: PORT,
    path: '/aorta/api',
    method: 'POST',
    headers: {
      'Content-Type': 'application/json',
      'Content-Length': Buffer.byteLength(contentJSON)
    }
  };
  const responseData = await new Promise(resolve => {
    const request = http.request(options, response => {
      const chunks = [];
      response.on('data', chunk => {
        chunks.push(chunk);
      });
      // When the response is complete:
      response.on('end', () => {
        // Return its data.
        resolve(JSON.parse(chunks.join('')));
      });
    });
    request.end(contentJSON);
  });
  return responseData;
};
// Waits.
const wait = seconds => {
  return new Promise(resolve => {
    setTimeout(() => {
      resolve('')
    }, 1000 * seconds)
  });
};
// Asks Aorta to assign an order to this tester.
const claimOrder = async () => {
  await wait(2);
  // Get the orders.
  const orders = await makeAortaRequest('seeOrders');
  await wait(2);
  // If there are any:
  let jobResult;
  if (orders.length) {
    // Ask Aorta to make the first order a job assigned to this tester.
    const orderName = orders[0].id;
    jobResult = await makeAortaRequest('claimOrder', {
      orderName,
      testerName: USERNAME
    });
  }
  else {
    jobResult = {error: 'noOrders'};
  }
  console.log(JSON.stringify(jobResult, null, 2));
};
// Performs the first Aorta job assigned to this tester and submits a report on it.
const doJob = async () => {
  await wait(2);
  // Get the jobs.
  const jobs = await makeAortaRequest('seeJobs');
  await wait(2);
  // If there are any:
  let reportResult;
  if (jobs.length) {
    // Perform the first one.
    const job = jobs[0];
    await handleRequest(job);
    // Submit the report to Aorta.
    reportResult = await makeAortaRequest('createReport', {report: job});
    // Delete any temporary files created by the ibm test.
    await fs.rm('results', {
      recursive: true,
      force: true
    });
  }
  else {
    reportResult = {error: 'noJobs'};
  }
  console.log(JSON.stringify(reportResult, null, 2));
};
// claimOrder();
doJob();

// ########## PLATFORM

/**
 * @description Gracefully shut down Node and clean up.
 *
 */
 function shutdownNode() {
  console.log('\nShutting down Node.');
  // Perform any cleanup.
  process.exit(0);
}
/**
* @description Handle unhandled exceptions in the code.
* @param err
*/
function handleUncaughtException(err) {

  console.log('Unhandled exception occurred.' , err);
  // Uncomment if DB connection is made
  console.log('Unhandled exception or rejection. Node is shut down.');
  process.exit(1);
}
// Process shutdown and error conditions.
process.on('SIGTERM', shutdownNode);
process.on('SIGINT', shutdownNode);
process.on('uncaughtException', handleUncaughtException);
process.on('unhandledRejection', handleUncaughtException);
