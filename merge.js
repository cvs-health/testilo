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
exports.merge = (script, batch, standard, observe, requester, timeStamp, browserID, deviceID) => {
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
  if (deviceID && ! isValidDeviceID(deviceID)) {
    // Report this and quit.
    console.log('ERROR: Device ID invalid');
    return [];
  }
  // If browserID is invalid:
  if (browserID && ! ['chromium', 'firefox', 'webkit'].includes(browserID)) {
    // Report this and quit.
    console.log('ERROR: Browser ID invalid');
    return [];
  }
  // Initialize a job template as a copy of the script.
  const protoJob = JSON.parse(JSON.stringify(script));
  // Add an initialized sources property to it.
  protoJob.sources = {
    script: script.id,
    batch: batch.id,
    lastTarget: false,
    target: {
      what: '',
      url: ''
    },
    requester
  };
  // If a device ID was specified for the jobs:
  if (deviceID) {
    // Substitute it for the device ID from the script.
    protoJob.deviceID = deviceID;
  }
  // If a browser ID was specified for the jobs:
  if (browserID) {
    // Substitute it for the browser ID from the script.
    protoJob.browserID = browserID;
  }
  // Add other properties to the job template.
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
    // Flatten the acts, causing insertion of placeholder copies before acts needing them.
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
  const targetIDs = Object.keys(targets);
  targetIDs.forEach((what, index) => {
    // If the target has the required identifiers:
    const {actGroups, url} = targets[what];
    if (actGroups && url) {
      // Initialize a job.
      const job = JSON.parse(JSON.stringify(protoJob));
      // Make the job ID unique.
      const targetSuffix = alphaNumOf(index);
      job.id = `${timeStamp}-${mergeID}-${targetSuffix}`;
      // Add other properties to the job.
      job.mergeID = mergeID;
      job.sendReportTo = process.env.SEND_REPORT_TO || '';
      // If the target is the last one:
      if (index === targetIDs.length - 1) {
        // Add that fact to the sources property of the job.
        job.sources.lastTarget = true;
      }
      // Add other data to the sources property of the job.
      job.sources.target.what = what;
      job.sources.target.url = url;
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
      console.log('ERROR: Target in batch missing id, what, or url property');
    }
  });
  return jobs;
};
