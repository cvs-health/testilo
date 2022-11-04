/*
  aim.js
  Module for aiming a script at a host.
*/

// ########## IMPORTS

// Module to keep secrets.
require('dotenv').config();
// Module to read and write files.
const fs = require('fs/promises');

// ########## CONSTANTS

const scriptDir = process.env.SCRIPTDIR || 'scripts';

// ########## FUNCTIONS

// Returns a script, aimed at a host.
exports.aim = async (scriptName, host, requester) => {
  // Copy the script.
  const scriptFile = await fs.readFile(`${scriptDir}/${scriptName}.json`, 'utf8');
  const script = JSON.parse(scriptFile);
  // In the copy, make all url commands visit the host.
  script.commands.forEach(command => {
    if (command.type === 'url') {
      command.id = host.id;
      command.which = host.which;
      command.what = host.what;
    }
  });
  // Add source information to the script.
  script.source = {
    script: script.id,
    host,
    requester
  }
  // Create a job-creation time stamp.
  const timeStamp = Math.floor((Date.now() - Date.UTC(2022, 1)) / 2000).toString(36);
  // Change the script id property to include the time stamp and the host ID.
  script.id = `${timeStamp}-${script.id}-${host.id}`;
  // Return the host-specific script.
  return script;
};
