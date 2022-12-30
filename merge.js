/*
  merge.js
  Merges a script and a batch and returns jobs.
  Arguments:
    0. script
    1. batch
    2. whether to provide test isolation (no if omitted)
*/

// ########## IMPORTS

// Module to keep secrets.
require('dotenv').config();

// ########## CONSTANTS

const stdRequester = process.env.REQUESTER;
const contaminantNames = new Set([
  'axe',
  'continuum',
  'focAll',
  'focInd',
  'focOp',
  'hover',
  'htmlcs',
  'ibm',
  'menuNav',
  'textNodes',
  'wave'
]);

// ########## FUNCTIONS

// Merges a script and a batch and returns jobs.
exports.merge = (script, batch, requester, isolate = false) => {
  if (isolate === 'false') {
    isolate = false;
  }
  // If the requester is unspecified, make it the standard requester.
  requester ||= stdRequester;
  // Create a timestamp.
  const timeStamp = Math.floor((Date.now() - Date.UTC(2022, 1)) / 2000).toString(36);
  // Create a time description.
  const creationTime = (new Date()).toISOString().slice(0, 19);
  // Initialize a target-independent job.
  const protoJob = JSON.parse(JSON.stringify(script));
  // Add the timestamp to the ID of the job.
  protoJob.id = `${timeStamp}-${protoJob.id}-`;
  // Add a sources property to the job.
  protoJob.sources = {
    script: script.id,
    batch: batch.id,
    target: {
      id: '',
      what: ''
    },
    requester
  };
  // Add time properties to the job.
  protoJob.creationTime = creationTime;
  protoJob.timeStamp = timeStamp;
  // If isolation was requested:
  if (isolate) {
    // Append a copy of the previous placeholder to each eligible contaminating test in the script.
    let {acts} = protoJob;
    let lastPlaceholder = {};
    for (const actIndexString in acts) {
      const actIndex = Number.parseInt(actIndexString);
      const act = acts[actIndex];
      if (act.type === 'placeholder') {
        lastPlaceholder = act;
      }
      else if (
        act.type === 'test'
        && contaminantNames.has(act.which)
        && actIndex < acts.length - 1
        && acts[actIndex + 1].type !== 'placeholder'
      ) {
        acts[actIndex] = JSON.parse(JSON.stringify([act, lastPlaceholder]));
      }
    };
    protoJob.acts = acts.flat();
  }
  // Initialize an array of jobs.
  const jobs = [];
  // For each target in the batch:
  const {targets} = batch;
  for (const target of targets) {
    // Initialize a job.
    const job = JSON.parse(JSON.stringify(protoJob));
    // Add the target ID to the job ID.
    job.id += target.id;
    // Add data on the target to the sources property of the job.
    job.sources.target.id = target.id;
    job.sources.target.what = target.what;
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
    job.acts = acts.flat();
    // Append the job to the array of jobs.
    jobs.push(job);
  };
  return jobs;
};
