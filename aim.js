/*
  aim.js
  Module for aiming a script at a host.
*/

// ########## FUNCTIONS

// Returns a script, aimed at a host.
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
  script.source = {
    script: script.id,
    host,
    requester
  }
  // Create a job-creation time stamp.
  const timeStamp = Math.floor((Date.now() - Date.UTC(2022, 1)) / 2000).toString(36);
  // Add a job-ID property to the script, including the time stamp, the script ID, and the host ID.
  script.jobID = `${timeStamp}-${script.id}-${host.id}`;
  // Return the host-specific script.
  return script;
};
