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
exports.merge = async (script, batch, requester, isolate = false) => {
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
    for (const actIndex in acts) {
      if (acts[actIndex].type === 'placeholder') {
        lastPlaceholder = acts[actIndex];
      }
      else if (
        contaminantNames.has(acts[actIndex].type)
        && actIndex < acts.length - 1
        && acts[actIndex + 1].type !== 'placeholder'
      ) {
        acts[actIndex] = JSON.parse(JSON.stringify([acts[actIndex], lastPlaceholder]));
      }
    };
    acts = acts.flat();
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
    // Replace each placeholder in the job with the named replacer of the target.
    let {acts} = job;
    for (const act of acts) {
      if (act.type === 'placeholder') {
        const replacerName = act.which;
        act.length = 0;
        if (replacerName && target.acts && target.acts[replacerName]) {
          act.push(target.acts[replacerName]);
        }
        else {
          console.log(`ERROR: Placeholder for ${target.id} not replaceable`);
        }
      }
    }
    acts = acts.flat();
    // Append the job to the array of jobs.
    jobs.push(job);
  };
  return jobs;
};
