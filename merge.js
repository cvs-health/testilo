/*
  © 2024 CVS Health and/or one of its affiliates. All rights reserved.

  Permission is hereby granted, free of charge, to any person obtaining a copy
  of this software and associated documentation files (the "Software"), to deal
  in the Software without restriction, including without limitation the rights
  to use, copy, modify, merge, publish, distribute, sublicense, and/or sell
  copies of the Software, and to permit persons to whom the Software is
  furnished to do so, subject to the following conditions:

  The above copyright notice and this permission notice shall be included in all
  copies or substantial portions of the Software.

  THE SOFTWARE IS PROVIDED "AS IS", WITHOUT WARRANTY OF ANY KIND, EXPRESS OR
  IMPLIED, INCLUDING BUT NOT LIMITED TO THE WARRANTIES OF MERCHANTABILITY,
  FITNESS FOR A PARTICULAR PURPOSE AND NONINFRINGEMENT. IN NO EVENT SHALL THE
  AUTHORS OR COPYRIGHT HOLDERS BE LIABLE FOR ANY CLAIM, DAMAGES OR OTHER
  LIABILITY, WHETHER IN AN ACTION OF CONTRACT, TORT OR OTHERWISE, ARISING FROM,
  OUT OF OR IN CONNECTION WITH THE SOFTWARE OR THE USE OR OTHER DEALINGS IN THE
  SOFTWARE.
*/

/*
  merge.js
  Merges a script and a batch and returns jobs.
*/

// ########## IMPORTS

// Module to keep secrets.
require('dotenv').config();
// Utility module.
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
// Length of the random merger ID.
const mergeIDLength = 2;

// ########## FUNCTIONS

// Merges a script and a batch and returns jobs.
exports.merge = (script, batch, executionTimeStamp) => {
  // If a time stamp was specified:
  if (executionTimeStamp) {
    // If it is invalid:
    if (! dateOf(executionTimeStamp)) {
      // Report this and quit.
      console.log('ERROR: Execution time stamp invalid');
      return [];
    }
  }
  // Otherwise, i.e. if no time stamp was specified:
  else {
    // Create one for the job.
    executionTimeStamp = getNowStamp();
  }
  // Initialize a job template as a copy of the script.
  const protoJob = JSON.parse(JSON.stringify(script));
  // Populate empty properties of the template.
  protoJob.creationTimeStamp = getNowStamp();
  protoJob.executionTimeStamp = executionTimeStamp;
  const {sources} = protoJob;
  sources.batch = batch.id;
  sources.mergeID = getRandomString(mergeIDLength);
  // If isolation was requested:
  if (protoJob.isolate) {
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
    // Flatten the acts, causing insertion of placeholder copies before acts needing them.
    protoJob.acts = acts.flat();
  }
  // Initialize an array of jobs.
  const jobs = [];
  // For each target in the batch:
  const {targets} = batch;
  const targetIDs = Object.keys(targets);
  targetIDs.forEach((what, index) => {
    // If the target has the required identifiers:
    const {actGroups, url} = targets[what];
    if (actGroups && url) {
      // Initialize a job.
      const job = JSON.parse(JSON.stringify(protoJob));
      const {sources} = job;
      // Make the job ID unique.
      const targetSuffix = alphaNumOf(index);
      job.id = `${executionTimeStamp}-${sources.mergeID}-${targetSuffix}`;
      // If the target is the last one:
      if (index === targetIDs.length - 1) {
        // Add that fact to the sources property of the job.
        sources.lastTarget = true;
      }
      // Populate the target-specific properties of the job.
      sources.target.what = what;
      sources.target.url = url;
      // Replace each placeholder object in the job with the named act group of the target.
      let {acts} = job;
      for (const actIndex in acts) {
        const act = acts[actIndex];
        if (act.type === 'placeholder') {
          const replacerName = act.which;
          const replacerActs = actGroups[replacerName];
          if (replacerName && actGroups && replacerActs) {
            // Add properties to any launch act in the replacer.
            for (const replacerAct of replacerActs) {
              if (replacerAct.type === 'launch') {
                if (act.deviceID) {
                  replacerAct.deviceID = act.deviceID;
                }
                if (act.browserID) {
                  replacerAct.browserID = act.browserID;
                }
              }
            };
            acts[actIndex] = replacerActs;
          }
          else {
            console.log(`ERROR: Placeholder for target ${what} not replaceable`);
          }
        }
      }
      // Flatten the acts.
      job.acts = acts.flat();
      // Append the job to the array of jobs.
      jobs.push(job);
    }
    else {
      console.log(`ERROR: Target ${what} in batch missing actGroups or url property`);
    }
  });
  return jobs;
};
