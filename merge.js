/*
  merge.js
  Merges a batch and a script to produce jobs.
  Arguments:
    0. script
    1. batch
    2. whether to provide test isolation (no if omitted)
*/

// ########## IMPORTS

// Module to keep secrets.
require('dotenv').config();

// ########## CONSTANTS

const stdRequester = process.env.REQUESTER;

// ########## FUNCTIONS

// Merges a batch into a script and writes jobs.
exports.merge = async (script, batch, requester = stdRequester) => {
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
