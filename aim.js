/*
  aim.js
  Module for aiming a script at a host.
*/

// ########## FUNCTIONS

// Returns a string representing the date and time.
const nowString = () => (new Date()).toISOString().slice(0, 19);
// Returns a script, aimed at a host, as a job.
exports.aim = (script, host, requester) => {
  // Make all url commands in the script visit the host.
  script.commands.forEach(command => {
    if (command.type === 'url') {
      command.id = host.id;
      command.which = host.which;
      command.what = host.what;
    }
  });
  // Add source information to the script.
  script.sources = {
    script: script.id,
    host,
    requester
  }
  // Create a job-creation time stamp.
  const timeStamp = Math.floor((Date.now() - Date.UTC(2022, 1)) / 2000).toString(36);
  // Change the script ID to a job ID.
  script.id = `${timeStamp}-${script.id}-${host.id}`;
  // Add the job-creation time to the script.
  script.jobCreationTime = nowString();
  // Return the job.
  return script;
};
