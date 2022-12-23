/*
  merge.js
  Merges a batch and a script to produce jobs.
  Arguments:
    0. base of name of script located in process.env.SCRIPTDIR.
    1. base of name of batch located in process.env.BATCHDIR.
    2. email address to be notified of completion.
  Usage examples:
    node call merge ts25 weborgs developer@w3.org
    node call merge ts25 weborgs
  Note: The subdirectory for jobs will be created if it does not exist.
*/

// ########## IMPORTS

// Module to keep secrets.
require('dotenv').config();
// Module to read and write files.
const fs = require('fs/promises');
// Module to aim a script at a host.
const {aim} = require('./aim');

// ########## CONSTANTS

const scriptDir = process.env.SCRIPTDIR || 'scripts';
const batchDir = process.env.BATCHDIR || 'batches';
const jobDir = process.env.JOBDIR || 'watch';
const stdRequester = process.env.REQUESTER;

// ########## FUNCTIONS

// Merges a batch into a script and writes jobs.
exports.merge = async (scriptName, batchName, requester = stdRequester) => {
  // Get the script and the batch.
  const scriptJSON = await fs.readFile(`${scriptDir}/${scriptName}.json`, 'utf8');
  const batchJSON = await fs.readFile(`${batchDir}/${batchName}.json`, 'utf8');
  const script = JSON.parse(scriptJSON);
  const batch = JSON.parse(batchJSON);
  const timeStamp = Math.floor((Date.now() - Date.UTC(2022, 1)) / 2000).toString(36);
  // Create the job directory if it does not exist.
  await fs.mkdir(jobDir, {recursive: true});
  // For each host in the batch:
  const {hosts} = batch;
  for (const host of hosts) {
    // Aim the script at the host.
    const job = await aim(script, host, requester, timeStamp);
    // Add the batch name to the job.
    job.sources.batch = batchName;
    // Save the job.
    await fs.writeFile(`${jobDir}/${job.id}.json`, JSON.stringify(job, null, 2));
  };
  console.log(`Merger completed. Job count: ${hosts.length}. Time stamp ${timeStamp}.`);
};
