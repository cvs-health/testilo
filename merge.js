/*
  merge.js
  Merges a batch and a script to produce host scripts.
  Arguments:
    0. base of name of script located in process.env.SCRIPTDIR.
    1. base of name of batch located in process.env.BATCHDIR.
    2. name of subdirectory of process.env.HOSTSCRIPTDIR into which to write host scripts.
  Usage example:
    node merge tp18 weborgs tp18-weborgs-1
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
const hostScriptDir = process.env.HOSTSCRIPTDIR || 'hostScripts';
const scriptName = process.argv[2];
const batchName = process.argv[3];
const hostScriptSubdir = process.argv[4];

// ########## FUNCTIONS

// Merges a batch into a script and writes host scripts.
const merge = async (script, batch, timeStamp, outDir) => {
  await fs.mkdir(outDir, {recursive: true});
  const {hosts} = batch;
  // For each host in the batch:
  const hostScripts = hosts.map(host => {
    // Copy the script.
    const newScript = JSON.parse(JSON.stringify(script));
    // In the copy, make all url commands visit the host.
    newScript.commands.forEach(command => {
      if (command.type === 'url') {
        command.which = host.which;
        command.what = host.what;
      }
    });
    // Create a host script.
    return {
      id: `${timeStamp}-${host.id}`,
      host,
      script: newScript
    };
  });
  // Write the host scripts.
  for (const hostScript of hostScripts) {
    await fs.writeFile(outDir, JSON.stringify(hostScript, null, 2));
  };
  console.log(`Merger completed. Count of host scripts: ${hosts.length}`);
};

// ########## OPERATION

fs.readFile(`${scriptDir}/${scriptName}.json`, 'utf8')
.then(scriptFile => {
  fs.readFile(`${batchDir}/${batchName}.json`, 'utf8')
  .then(async batchFile => {
    const script = JSON.parse(scriptFile);
    const batch = JSON.parse(batchFile);
    const timeStamp = Math.floor((Date.now() - Date.UTC(2022, 1)) / 2000).toString(36);
    const outDir = `${hostScriptDir}/${hostScriptSubdir}`;
    await merge(script, batch, timeStamp, outDir);
  });
});
