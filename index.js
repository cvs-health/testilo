/*
  index.js
  Testilo main script.
*/

// ########## IMPORTS

// Module to keep secrets local.
require('dotenv').config();
const {USERNAME, AUTHCODE, ENVIRONMENT, INTERVAL} =  process.env;
const protocol = process.env[`${ENVIRONMENT}PROTOCOL`];
const hostname = process.env[`${ENVIRONMENT}HOSTNAME`];
const port = process.env[`${ENVIRONMENT}PORT`];
// Module to make HTTP(S) requests.
const client = require(protocol);
// Module to perform tests.
const {handleRequest} = require('testaro');

// ########## VARIABLES
let working = false;

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
    hostname,
    port,
    path: '/aorta/api',
    method: 'POST',
    headers: {
      'Content-Type': 'application/json',
      'Content-Length': Buffer.byteLength(contentJSON)
    }
  };
  const responseData = await new Promise(resolve => {
    const request = client.request(options, response => {
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
const wait = ms => {
  return new Promise(resolve => {
    setTimeout(() => {
      resolve('');
    }, ms)
  });
};
// Asks Aorta to assign an order to this tester.
const claimOrder = async () => {
  // Get the orders.
  const orders = await makeAortaRequest('seeOrders');
  // If there are any:
  if (Array.isArray(orders)) {
    if (orders.length) {
      // Ask Aorta to make the first order a job assigned to this tester.
      const orderName = orders[0].id;
      return {
        response: await makeAortaRequest('claimOrder', {
          orderName,
          testerName: USERNAME
        })
      };
    }
    else {
      return 'noOrders';
    }
  }
  else {
    return JSON.stringify(orders, null, 2);
  }
};
// Performs the first Aorta job assigned to this tester, submits a report, and returns the status.
const doJob = async () => {
  if (working) {
    console.log('Skipped an interval because job still running');
    return 'skipped';
  }
  else {
    working = true;
    // Get the jobs.
    const jobs = await makeAortaRequest('seeJobs');
    // If there are any:
    if (Array.isArray(jobs)) {
      if (jobs.length) {
        // Perform the first one.
        const job = jobs[0];
        await handleRequest(job);
        // Submit the report to Aorta.
        const jobResult = await makeAortaRequest('createReport', {report: job});
        console.log(JSON.stringify(jobResult, null, 2));
        return jobResult;
      }
      else {
        console.log('noJobs');
        return 'noJobs';
      }
    }
    else {
      console.log(JSON.stringify(jobs, null, 2));
    }
    working = false;
  }
};
// Repeatedly claims orders, performs jobs, and submits reports.
const cycle = async () => {
  const interval = Number.parseInt(INTERVAL);
  while (true) {
    await wait(interval);
    const jobResult = await doJob();
    if (jobResult === 'noJobs') {
      const orderResult = await claimOrder();
      console.log(JSON.stringify(orderResult, null, 2));
      if (orderResult.response) {
        await doJob();
      }
    }
  };
};

// ########## OPERATION

cycle();
