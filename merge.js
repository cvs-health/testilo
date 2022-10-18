/*
  merge.js
  Merges a batch and a script to produce host-specific scripts.
  Arguments:
    0. base of name of script located in process.env.SCRIPTDIR.
    1. base of name of batch located in process.env.BATCHDIR.
  Usage example:
    node merge tp18 weborgs
  Note: The subdirectory for host scripts will be created if it does not exist.
*/

// ########## IMPORTS

// Module to keep secrets.
require('dotenv').config();
// Module to read and write files.
const fs = require('fs/promises');

// ########## CONSTANTS

const scriptDir = process.env.SCRIPTDIR || 'scripts';
const batchDir = process.env.BATCHDIR || 'batches';
const watchDir = process.env.WATCHDIR || 'watch';
const scriptName = process.argv[2];
const batchName = process.argv[3];

// ########## FUNCTIONS

// Merges a batch into a script and writes host-specific scripts.
const merge = async (script, batch) => {
  // Create the watch directory if it does not exist.
  await fs.mkdir(watchDir, {recursive: true});
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
    // Change the script id property to include the host ID.
    newScript.id += `-${host.id}`;
    // Return the host-specific script.
    return newScript;
  });
  // Write the host-specific scripts.
  for (const newScript of newScripts) {
    await fs.writeFile(`${watchDir}/${newScript.id}.json`, JSON.stringify(newScript, null, 2));
  };
  console.log(`Merger completed. Count of scripts created: ${hosts.length}`);
};

// ########## OPERATION

fs.readFile(`${scriptDir}/${scriptName}.json`, 'utf8')
.then(scriptFile => {
  fs.readFile(`${batchDir}/${batchName}.json`, 'utf8')
  .then(async batchFile => {
    const script = JSON.parse(scriptFile);
    const batch = JSON.parse(batchFile);
    await merge(script, batch);
  });
});
