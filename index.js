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
  console.log(`Submitted ${what} request to Aorta`);
  const data = JSON.stringify({
    userName: USERNAME,
    authCode: AUTHCODE,
    what
  });
  const options = {
    hostname: HOSTNAME,
    port: PORT,
    path: `/aorta/api`,
    method: 'POST',
    headers: {
      'Content-Type': 'application/json',
      'Content-Length': Buffer.byteLength(data)
    }
  };
  const request = http.request(options, response => {
    const chunks = [];
    response.on('data', chunk => {
      chunks.push(chunk);
    });
    // When the response is complete:
    response.on('end', () => {
      console.log(`Response from Aorta:\n${chunks.join('')}`);
    });
  });
  request.end(JSON.stringify(data));
  console.log('Request finished');
};

// Request the orders.
getData('seeOrders');

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
