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
  validate.js
  Validates merge module.
*/

// ########## IMPORTS

// Function to process files.
const fs = require('fs/promises');
// Function to merge a batch and a script.
const {merge} = require('../../merge');

// ########## FUNCTIONS

// Validates the merge module.
const validate = async () => {
  // Get the script and the batch.
  const scriptJSON = await fs.readFile(`${__dirname}/script.json`, 'utf8');
  const script = JSON.parse(scriptJSON);
  const batchJSON = await fs.readFile(`${__dirname}/batch.json`);
  const batch = JSON.parse(batchJSON);
  const requester = 'me@mydomain.tld';
  // Perform the merger without and with isolation.
  const jobsNoIsolation = merge(script, batch, requester, false, 'no', false, '', 'reports/', '');
  const jobsYesIsolation = merge(script, batch, requester, true, 'no', false, '', 'reports/', '');
  const jobArrays = [jobsNoIsolation, jobsYesIsolation];
  // Validate the jobs.
  if (jobsNoIsolation && jobsYesIsolation) {
    console.log('Success: Both job arrays exist');
  }
  else {
    console.log('ERROR: A job array does not exist');
    return;
  }
  if (
    jobArrays.every(array => [0, 1].every(jobIndex => Object.keys(array[jobIndex]).length === 8))
  ) {
    console.log('Success: Every job has 8 properties');
  }
  else {
    console.log('ERROR: A job does not have 8 properties');
    return;
  }
  if (jobArrays.every(array => [0, 1].every(
    jobIndex => {
      const job = array[jobIndex];
      return job.id === `${job.timeStamp}-${job.sources.script}-${job.sources.target.id}`;
    }
  ))) {
    console.log('Success: Every job has a correct ID');
  }
  else {
    console.log('ERROR: A job does not have a correct ID');
    return;
  }
  if (jobArrays.every(array => [0, 1].every(jobIndex => array[jobIndex].what === script.what))) {
    console.log('Success: Every job has a correct what property');
  }
  else {
    console.log('ERROR: A job does not have a correct what property');
    return;
  }
  if (jobArrays.every(array => [0, 1].every(jobIndex => array[jobIndex].strict === script.strict))) {
    console.log('Success: Every job has a correct strict property');
  }
  else {
    console.log('ERROR: A job does not have a correct strict property');
    return;
  }
  if (jobArrays.every(
    array => [0, 1].every(jobIndex => array[jobIndex].timeLimit === script.timeLimit)
  )) {
    console.log('Success: Every job has a correct timeLimit property');
  }
  else {
    console.log('ERROR: A job does not have a correct timeLimit property');
    return;
  }
  if (jobArrays.every(
    array => [0, 1].every(jobIndex => array[jobIndex].sources.script === script.id)
  )) {
    console.log('Success: Every job has a correct sources.script property');
  }
  else {
    console.log('ERROR: A job does not have a correct sources.script property');
    return;
  }
  if (jobArrays.every(
    array => [0, 1].every(jobIndex => array[jobIndex].sources.batch === batch.id)
  )) {
    console.log('Success: Every job has a correct sources.batch property');
  }
  else {
    console.log('ERROR: A job does not have a correct sources.batch property');
    return;
  }
  if (jobArrays.every(array => [0, 1].every(
    jobIndex => array[jobIndex].sources.target.id === batch.targets[jobIndex].id
  ))) {
    console.log('Success: Every job has a correct sources.target.id property');
  }
  else {
    console.log('ERROR: A job does not have a correct sources.target.id property');
    return;
  }
  if (jobArrays.every(array => [0, 1].every(
    jobIndex => array[jobIndex].sources.target.what === batch.targets[jobIndex].what
  ))) {
    console.log('Success: Every job has a correct sources.target.what property');
  }
  else {
    console.log('ERROR: A job does not have a correct sources.target.what property');
    return;
  }
  if (jobArrays.every(
    array => [0, 1].every(jobIndex => array[jobIndex].sources.requester === requester)
  )) {
    console.log('Success: Every job has a correct sources.requester property');
  }
  else {
    console.log('ERROR: A job does not have a correct sources.requester property');
    return;
  }
  if (jobArrays.every(array => [0, 1].every(
    jobIndex => /^\d{4}-\d{2}-\d{2}T\d{2}:\d{2}:\d{2}$/.test(array[jobIndex].creationTime)
  ))) {
    console.log('Success: Every job has a valid creationTime property');
  }
  else {
    console.log('ERROR: A job does not have a valid creationTime property');
    return;
  }
  if (
    jobArrays[0][0].acts.length === 7
    && jobArrays[0][1].acts.length === 9
    && jobArrays[1][0].acts.length === 9
    && jobArrays[1][1].acts.length === 12
  ) {
    console.log('Success: Every job has a correct act count');
  }
  else {
    console.log('ERROR: A job does not have a correct act count');
    return;
  }
  const job00Act0 = jobArrays[0][0].acts[0];
  if (
    job00Act0.type === 'launch'
    && job00Act0.which === script.acts[0].launch
  ) {
    console.log('Success: Job 0 of array 0 has a correct act 0');
  }
  else {
    console.log('ERROR: Job 0 of array 0 has an incorrect act 0');
    return;
  }
  const job01Act3 = jobArrays[0][1].acts[3];
  if (
    job01Act3.type === 'test'
    && job01Act3.which === 'continuum'
  ) {
    console.log('Success: Job 1 of array 0 has correct act 3 type and which properties');
  }
  else {
    console.log('ERROR: Job 1 of array 0 has an incorrect act 3 type or which property');
    return;
  }
  const job10Act7 = jobArrays[1][0].acts[7];
  if (
    job10Act7.type === 'url'
    && job10Act7.what === 'example'
  ) {
    console.log('Success: Job 0 of array 1 has correct act 7 type and what properties');
  }
  else {
    console.log('ERROR: Job 1 of array 0 has an incorrect act 7 type or what property');
    return;
  }
};
validate();
