/*
  merge.js
  Merges a batch and a script to produce host-specific scripts.
  Arguments:
    0. base of name of script located in process.env.SCRIPTDIR.
    1. base of name of batch located in process.env.BATCHDIR.
  Usage example:
    node merge tp18 weborgs
  Note: The subdirectory for host-specific scripts will be created if it does not exist.
*/

// ########## IMPORTS

// Module to keep secrets.
require('dotenv').config();
// Module to read and write files.
const fs = require('fs/promises');

// ########## CONSTANTS

const scriptDir = process.env.SCRIPTDIR || 'scripts';
const batchDir = process.env.BATCHDIR || 'batches';
const jobDir = process.env.JOBDIR || 'watch';

// ########## FUNCTIONS

// Returns a string representing the date and time.
const nowString = () => (new Date()).toISOString().slice(0, 19);
// Merges a batch into a script and writes host-specific scripts.
exports.merge = async (scriptName, batchName) => {
  const scriptJSON = await fs.readFile(`${scriptDir}/${scriptName}.json`, 'utf8');
  const batchJSON = await fs.readFile(`${batchDir}/${batchName}.json`, 'utf8');
  const script = JSON.parse(scriptJSON);
  const batch = JSON.parse(batchJSON);
  // Create the watch directory if it does not exist.
  await fs.mkdir(jobDir, {recursive: true});
  // Create a job-creation time stamp.
  const timeStamp = Math.floor((Date.now() - Date.UTC(2022, 1)) / 2000).toString(36);
  // For each host in the batch:
  const {hosts} = batch;
  const newScripts = hosts.map(host => {
    // Copy the script.
    const newScript = JSON.parse(JSON.stringify(script));
    // In the copy, make all url commands visit the host.
    newScript.commands.forEach(command => {
      if (command.type === 'url') {
        command.id = host.id;
        command.which = host.which;
        command.what = host.what;
      }
    });
    // Add source information to the script.
    newScript.sources = {
      script: script.id,
      batch: batch.id
    }
    // Add the job-creation time to the script.
    newScript.jobCreationTime = nowString();
    // Change the script id property to include the time stamp and the host ID.
    newScript.id = `${timeStamp}-${newScript.id}-${host.id}`;
    // Return the host-specific script.
    return newScript;
  });
  // Write the host-specific scripts.
  for (const newScript of newScripts) {
    await fs.writeFile(`${jobDir}/${newScript.id}.json`, JSON.stringify(newScript, null, 2));
  };
  console.log(`Merger completed. Script count: ${hosts.length}. Time stamp: ${timeStamp}`);
};
