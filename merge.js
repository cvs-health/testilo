/*
  merge.js
  Merges a script and a batch and returns jobs.
  Arguments:
    0. script
    1. batch
    2. requester
    3. value of the standard property
    4. value of the granularity property
    5. whether to provide test isolation (no if omitted)
*/

// ########## IMPORTS

// Module to keep secrets.
require('dotenv').config();

// ########## CONSTANTS

const stdRequester = process.env.REQUESTER;
// Tools that alter the page.
const contaminantNames = new Set([
  'alfa',
  'aslint',
  'axe',
  'htmlcs',
  'ibm',
  'testaro'
]);

// ########## FUNCTIONS

// Merges a script and a batch and returns jobs.
exports.merge = (script, batch, requester, isolate, standard, isGranular) => {
  if (isolate === 'false') {
    isolate = false;
  }
  // If the requester is unspecified, make it the standard requester.
  requester ||= stdRequester;
  // Create a timestamp.
  const timeStamp = new Date().toISOString().replace(/[-:]/g, '').slice(2, 15);
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
      which: '',
      what: ''
    },
    requester,
    sendReportTo: process.env.REPORT_URL || ''
  };
  // Add properties to the job.
  protoJob.creationTime = creationTime;
  protoJob.timeStamp = timeStamp;
  protoJob.standard = standard || 'only';
  protoJob.observe = isGranular || false;
  // If isolation was requested:
  if (isolate) {
    // Perform it.
    let {acts} = protoJob;
    let lastPlaceholder = {};
    for (const actIndexString in acts) {
      const actIndex = Number.parseInt(actIndexString);
      const act = acts[actIndex];
      const nextAct = acts[actIndex + 1];
      if (act.type === 'placeholder') {
        lastPlaceholder = act;
      }
      else if (
        act.type === 'test'
        && contaminantNames.has(act.which)
        && actIndex < acts.length - 1
        && (nextAct.type === 'test')
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
    // If the target has the required identifiers:
    const {id, which, what} = target;
    if (id && which && what) {
      // Initialize a job.
      const job = JSON.parse(JSON.stringify(protoJob));
      // Append the target ID to the job ID.
      job.id += target.id;
      // Add data on the target to the sources property of the job.
      job.sources.target.id = target.id;
      job.sources.target.which = target.which;
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
    }
    else {
      console.log('ERROR: Target in batch missing id, which, or what property');
    }
  };
  return jobs;
};
