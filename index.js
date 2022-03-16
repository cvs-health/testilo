/*
  index.js
  Testilo main script.
*/

// ########## IMPORTS

// Module to keep secrets local.
require('dotenv').config();
// Module to make HTTPS requests.
// const https = require('https');
const http = require('http');

// ########## CONSTANTS
const {USERNAME, AUTHCODE, HOSTNAME, PORT} =  process.env;

// ########## FUNCTIONS

// Requests data.
const getData = what => {
  const content = {
    userName: USERNAME,
    authCode: AUTHCODE,
    what
  };
  const contentJSON = JSON.stringify(content);
  const options = {
    hostname: HOSTNAME,
    port: PORT,
    path: `/aorta/api`,
    method: 'POST',
    headers: {
      'Content-Type': 'application/json',
      'Content-Length': Buffer.byteLength(contentJSON)
    }
  };
  const request = http.request(options, response => {
    const chunks = [];
    response.on('data', chunk => {
      chunks.push(chunk);
    });
    // When the response is complete:
    response.on('end', () => {
      console.log(`Response to ${what}:\n${JSON.stringify(JSON.parse(chunks.join('')), null, 2)}`);
    });
  });
  request.end(contentJSON);
};
// Waits.
const wait = seconds => {
  return new Promise(resolve => {
    setTimeout(() => {
      resolve('')
    }, 1000 * seconds)
  });
};
// Requests the orders and jobs repeatedly.
const askForever = async () => {
  while(1 < 2) {
    await wait(3);
    getData('seeOrders');
    await wait(3);
    getData('seeJobs');
  }
};
askForever();

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
