/*
  validate.js
  Validates series module.
*/

// ########## IMPORTS

// Function to process files.
const fs = require('fs/promises');
// Function to generate a job series.
const {series} = require('../../series');

// ########## FUNCTIONS

// Validates the series module.
const validate = async () => {
  // Get the job.
  const jobJSON = await fs.readFile(`${__dirname}/job.json`, 'utf8');
  const job = JSON.parse(jobJSON);
  // Generate the series.
  const jobs = series(job, 3, 5);
  // Validate the series.
  if (Array.isArray(jobs) && jobs.length === 3) {
    console.log('Success: The count of jobs is correct');
  }
  else {
    console.log('ERROR: The jobs are not an array of length 3');
    return;
  }
  const job0 = jobs[0];
  if (
    job.id
    && job.id === '240223T0815-mon-example'
    && job0.id === job.id
    && job0.sources
    && job0.sources.series
    && job0.sources.series === job.id
  ) {
    console.log('Success: The first job has the correct id and sources.series');
  }
  else {
    console.log('ERROR: The first job has an incorrect id or sources.series');
    return;
  }
  const job1 = jobs[1];
  const job2 = jobs[2];
  if (
    job2.id
    && job2.id === '240223T0825-mon-example'
    && job2.sources
    && job2.sources.series
    && job2.sources.series === '240223T0815-mon-example'
  ) {
    console.log('Success: The third job has the correct id and sources.series');
  }
  else {
    console.log('ERROR: The first job has an incorrect id or sources.series');
    return;
  }
  if (
    job1.acts
    && job1.acts.length === 3
    && job1.acts[2].rules
    && job1.acts[2].rules.length === 2
    && job2.acts
    && job2.acts.length === 3
    && job2.acts[2].rules
    && job2.acts[2].rules.length === 2
    && job2.acts[2].rules[1] === job1.acts[2].rules[1]
  ) {
    console.log('Success: The second and third jobs invoke the same rule');
  }
  else {
    console.log('ERROR: The second and third job do not invoke the same rule');
    return;
  }
};
validate();
