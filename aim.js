/*
  aim.js
  Returns a script aimed at a host.
  Arguments:
    0. base of name of script located in process.env.SCRIPTDIR.
    1. ID of the host.
    2. URL of the host.
    3. Name of the host.
    4. ID of the requester.
  Usage example:
    node aim tp18 w3c https://www.w3.org/ 'World Wide Web Consortium' 
*/

// ########## IMPORTS

// Module to keep secrets.
require('dotenv').config();
// Module to read and write files.
const fs = require('fs/promises');

// ########## CONSTANTS

const scriptDir = process.env.SCRIPTDIR || 'scripts';
const scriptName = process.argv[2];
const host = {
  id: process.argv[3],
  which: process.argv[4],
  what: process.argv[5]
};
const requester = process.argv[6];

// ########## FUNCTIONS

// Returns a script, aimed at a host.
exports.aim = async () => {
  // Copy the script.
  const scriptFile = await fs.readFile(`${scriptDir}/${scriptName}.json`, 'utf8');
  const script = JSON.parse(scriptFile);
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
  newScript.source = {
    script: script.id,
    requester
  }
  // Change the script id property to include the host ID.
  newScript.id += `-${host.id}`;
  // Return the host-specific script.
  return newScript;
};
