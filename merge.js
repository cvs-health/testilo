/*
  merge.js
  Merges a script and a batch and returns jobs.
*/

// ########## IMPORTS

// Module to keep secrets.
require('dotenv').config();
// Module to perform common actions.
const {alphaNumOf, dateOf, getRandomString, getNowStamp} = require('./procs/util');

// ########## CONSTANTS

// Tools that alter the page.
const contaminantNames = new Set([
  'alfa',
  'aslint',
  'axe',
  'ed11y',
  'htmlcs',
  'testaro'
]);


// ########## FUNCTIONS

// Merges a script and a batch and returns jobs.
exports.merge = (script, batch, requester, timeStamp) => {
  // If a time stamp was specified:
  if (timeStamp) {
    // If it is invalid:
    if (! dateOf(timeStamp)) {
      // Report this and quit.
      console.log(`ERROR: Timestamp invalid`);
      return [];
    }
  }
  // Otherwise, i.e. if no time stamp was specified:
  else {
    // Create one for the job.
    timeStamp = getNowStamp();
  }
  // Initialize a job as a copy of the script.
  const protoJob = JSON.parse(JSON.stringify(script));
  // Add an initialized sources property to it.
  protoJob.sources = {
    script: script.id,
    batch: batch.id,
    target: {
      id: '',
      what: '',
      which: ''
    },
    requester
  };
  // Add properties to the job.
  protoJob.creationTimeStamp = getNowStamp();
  protoJob.timeStamp = timeStamp;
  // If isolation was requested:
  if (script.isolate) {
    // For each act:
    let {acts} = protoJob;
    let lastPlaceholder = {};
    for (const actIndexString in acts) {
      // If it is a placeholder:
      const actIndex = Number.parseInt(actIndexString);
      const act = acts[actIndex];
      if (act.type === 'placeholder') {
        // Identify it as the current one.
        lastPlaceholder = act;
      }
      // Otherwise, if it is a non-final target-modifying test act:
      else if (
        act.type === 'test'
        && contaminantNames.has(act.which)
        && actIndex < acts.length - 1
      ) {
        // Change it to an array of itself and the current placeholder.
        acts[actIndex] = JSON.parse(JSON.stringify([act, lastPlaceholder]));
      }
    };
    // Flatten the acts.
    protoJob.acts = acts.flat();
  }
  // Initialize an array of jobs.
  const jobs = [];
  // For each target in the batch:
  const {targets} = batch;
  const mergeID = getRandomString(2);
  targets.forEach((target, index) => {
    // If the target has the required identifiers:
    const {id, what, which} = target;
    if (id && what && which) {
      // Initialize a job.
      const job = JSON.parse(JSON.stringify(protoJob));
      // Make the job ID unique.
      const targetID = alphaNumOf(index);
      job.id = `${timeStamp}-${mergeID}-${targetID}`;
      // Add a report destination to the job.
      job.sendReportTo = process.env.SEND_REPORT_TO || '';
      // Add data to the sources property of the job.
      job.sources.target.id = targetID;
      job.sources.target.what = target.what;
      job.sources.target.which = target.which;
      // Replace each placeholder object in the job with the named replacer array of the target.
      let {acts} = job;
      for (const actIndex in acts) {
        const act = acts[actIndex];
        if (act.type === 'placeholder') {
          const replacerName = act.which;
          if (replacerName && target.acts) {
            let replacerActs = target.acts[replacerName];
            if (replacerActs) {
              // Add a which property to any launch act in the replacer.
              replacerActs = JSON.parse(JSON.stringify(replacerActs));
              for (const replacerAct of replacerActs) {
                if (replacerAct.type === 'launch') {
                  replacerAct.which = act.launch;
                }
              }
              acts[actIndex] = replacerActs;
            }
            else {
              console.log(`ERROR: Target ${target.id} has no ${replacerName} replacer`);
            }
          }
          else {
            console.log(`ERROR: Placeholder for target ${target.id} not replaceable`);
          }
        }
      }
      // Flatten the acts.
      job.acts = acts.flat();
      // Append the job to the array of jobs.
      jobs.push(job);
    }
    else {
      console.log('ERROR: Target in batch missing id, what, or which property');
    }
  });
  return jobs;
};
