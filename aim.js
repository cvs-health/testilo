/*
  aim.js
  Module for aiming a script at a host.
  Arguments:
    0. script object.
    1. host object.
    2. email address to be notified of completion.
    3?. time stamp.
*/

// ########## FUNCTIONS

// Returns a string representing the date and time.
const nowString = () => (new Date()).toISOString().slice(0, 19);
// Returns a script, aimed at a host, as a job.
exports.aim = (script, host, requester, timeStamp = '') => {
  // Initialize a job based on the script.
  const job = JSON.parse(JSON.stringify(script));
  // Make all url commands in the script visit the host.
  job.commands.forEach(command => {
    if (command.type === 'url') {
      command.id = host.id;
      command.which = host.which;
      command.what = host.what;
    }
  });
  // Add source information to the script.
  job.sources = {
    script: script.id,
    batch: '',
    host,
    requester
  }
  // Create a job-creation time stamp, if not specified.
  
  timeStamp = timeStamp || Math.floor((Date.now() - Date.UTC(2022, 1)) / 2000).toString(36);
  // Change the script ID to a job ID.
  job.id = `${timeStamp}-${script.id}-${host.id}`;
  // Add the job-creation time to the script.
  job.jobCreationTime = nowString();
  // Add the time stamp to the job.
  job.timeStamp = timeStamp;
  // Return the job.
  return job;
};
