/*
  merge.js
  Merges a script and a batch and returns jobs.
*/

// ########## IMPORTS

// Module to keep secrets.
require('dotenv').config();
// Utility module.
const {alphaNumOf, dateOf, getRandomString, getNowStamp, isValidDeviceID} = require('./procs/util');

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
// Length of the random merger ID.
const mergeIDLength = 2;

// ########## FUNCTIONS

// Merges a script and a batch and returns jobs.
exports.merge = (script, batch, standard, observe, requester, timeStamp, deviceID) => {
  // If standard is invalid:
  if (! ['also', 'only', 'no'].includes(standard)) {
    // Report this and quit.
    console.log('ERROR: Invalid standard treatment specified');
    return [];
  }
  // If observe is invalid:
  if (! [true, false].includes(observe)) {
    // Report this and quit.
    console.log('ERROR: Invalid observe configuration specified');
    return [];
  }
  // If a time stamp was specified:
  if (timeStamp) {
    // If it is invalid:
    if (! dateOf(timeStamp)) {
      // Report this and quit.
      console.log('ERROR: Timestamp invalid');
      return [];
    }
  }
  // Otherwise, i.e. if no time stamp was specified:
  else {
    // Create one for the job.
    timeStamp = getNowStamp();
  }
  // If deviceID is invalid:
  if (! isValidDeviceID(deviceID)) {
    // Report this and quit.
    console.log('ERROR: Device ID invalid');
    return [];
  }
  // Initialize a job as a copy of the script.
  const protoJob = JSON.parse(JSON.stringify(script));
  // Add an initialized sources property to it.
  protoJob.sources = {
    script: script.id,
    batch: batch.id,
    lastTarget: false,
    target: {
      id: '',
      what: '',
      which: ''
    },
    requester
  };
  // Add properties to the job.
  protoJob.standard = standard;
  protoJob.observe = observe;
  protoJob.timeStamp = timeStamp;
  protoJob.creationTimeStamp = getNowStamp();
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
  // Delete the no-longer-necessary job property.
  delete protoJob.isolate;
  // Initialize an array of jobs.
  const jobs = [];
  // Get an ID for the merger.
  const mergeID = getRandomString(mergeIDLength);
  // For each target in the batch:
  const {targets} = batch;
  targets.forEach((target, index) => {
    // If the target has the required identifiers:
    const {id, what, which} = target;
    if (id && what && which) {
      // Initialize a job.
      const job = JSON.parse(JSON.stringify(protoJob));
      // Make the job ID unique.
      const targetID = alphaNumOf(index);
      job.id = `${timeStamp}-${mergeID}-${targetID}`;
      // Add other properties to the job.
      job.mergeID = mergeID;
      job.sendReportTo = process.env.SEND_REPORT_TO || '';
      // If the target is the last one:
      if (index === targets.length - 1) {
        // Add that fact to the sources property of the job.
        job.sources.lastTarget = true;
      }
      // Add other data to the sources property of the job.
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
              // Add properties to any launch act in the replacer.
              replacerActs = JSON.parse(JSON.stringify(replacerActs));
              for (const replacerAct of replacerActs) {
                if (replacerAct.type === 'launch') {
                  replacerAct.which = act.launch;
                  replacerAct.deviceID = deviceID;
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
