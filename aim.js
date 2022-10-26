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

// ########## FUNCTIONS

// Returns a string representing the date and time.
const nowString = () => (new Date()).toISOString().slice(0, 19);
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
  // Add the job-creation time to the script.
  script.jobCreationTime = nowString();
  // Return the host-specific script.
  return script;
};
