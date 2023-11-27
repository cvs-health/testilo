/*
  merge.js
  Merges a script and a batch and returns jobs.
  Arguments:
    0. script
    1. batch
    2. requester
    3. whether to provide test isolation
    4. value of the standard property
    5. whether reporting is to be granular
    6. date and time as a compact timestamp for job execution, if not now
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
  'testaro'
]);
const randomIDChars = (() => {
  const digits = Array(10).fill('').map((digit, index) => index.toString());
  const uppers = Array(26).fill('').map((letter, index) => String.fromCodePoint(65 + index));
  const lowers = Array(26).fill('').map((letter, index) => String.fromCodePoint(97 + index));
  return digits.concat(uppers, lowers);
})();
  

// ########## FUNCTIONS

// Inserts a character periodically in a string.
const punctuate = (string, insertion, chunkSize) => {
  const segments = [];
  let startIndex = 0;
  while (startIndex < string.length) {
    segments.push(string.slice(startIndex, startIndex + chunkSize));
    startIndex += chunkSize;
  }
  return segments.join(insertion);
};
// Converts a compact timestamp to a date.
const dateOf = timeStamp => {
  if (/^\d{6}T\d{4}$/.test(timeStamp)) {
    const dateString = punctuate(timeStamp.slice(0, 6), '-', 2);
    const timeString = punctuate(timeStamp.slice(7, 11), ':', 2);
    return new Date(`20${dateString}T${timeString}Z`);
  } else {
    return null;
  }
};
// Converts a date and time to a compact timestamp.
const stampTime = date => date.toISOString().replace(/[-:]/g, '').slice(2, 13);
// Generates a random string.
const getRandomID = length => {
  const chars = [];
  for (let i = 0; i < length; i++) {
    chars.push(randomIDChars[Math.floor(62 * Math.random())]);
  }
  return chars.join('');
};
// Merges a script and a batch and returns jobs.
exports.merge = (script, batch, requester, isolate, standard, isGranular, timeStamp) => {
  if (isolate === 'false') {
    isolate = false;
  }
  // If a timestamp was specified:
  if (timeStamp) {
    // If it is invalid:
    if (! dateOf(timeStamp)) {
      // Report this and quit.
      console.log(`ERROR: Timestamp invalid`);
      return [];
    }
  }
  // Otherwise, i.e. if no timestamp was specified:
  else {
    // Create one for the job.
    timeStamp = stampTime(new Date());
  }
  // If the requester is blank or unspecified, make it the standard requester.
  requester ||= stdRequester;
  // Create a creation-time description.
  const creationTime = (new Date()).toISOString().slice(0, 19);
  // Initialize a target-independent job.
  const protoJob = JSON.parse(JSON.stringify(script));
  // Make the timestamp and a random string the ID of the job.
  protoJob.id = `${timeStamp}-${getRandomID(Number.parseInt(process.env.RANDOM_ID_LENGTH, 10))}`;
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
    // Configure the job for it.
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
