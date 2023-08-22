/*
  series.js
  Generates a series of Testaro jobs.
  Arguments:
    0. Initial job.
    1. Job count.
    2. Time interval in minutes.
*/

// ########## FUNCTIONS

// Scores the specified raw reports.
exports.series = (job, count, interval) => {
  // If the arguments are valid:
  if (
    typeof job === 'object'
    && count
    && typeof count === 'number'
    && count === Math.floor(count)
    && count > 1
    && interval
    && typeof interval === 'number'
    && interval === Math.floor(interval)
    && interval > 0
  ) {
    // Get a copy of the initial job.
    const template = JSON.parse(JSON.stringify(job));
    // If it has an ID:
    const jobID = template.id;
    if (jobID) {
      // If the ID specifies a valid time:
      const s = jobID.slice(0, 11);
      const dateSpec = `20${s[0]}${s[1]}-${s[2]}${s[3]}-${s[4]}${s[5]}`;
      const timeSpec = `${s[7]}${s[8]}:${s[9]}${s[10]}`;
      const dateTimeSpec = `${dateSpec}T${timeSpec}Z`;
      const start = new Date(dateTimeSpec);
      const startNum = start.valueOf();
      if (startNum) {
        // Initialize the series.
        const series = [];
        // For each job required:
        for (let i = 0; i < count; i++) {
          // Create it.
          const nextJob = JSON.parse(JSON.stringify(template));
          nextJob.sources.series = nextJob.id;
          // Revise its ID.
          const nextDate = new Date(startNum + i * interval * 60000);
          const nextTimeStamp = nextDate.toISOString().slice(2, 16).replace(/[-:]/g, '');
          nextJob.id = nextJob.id.replace(/^[^-]+/, nextTimeStamp);
          // Add the job to the series.
          series.push(nextJob);
        }
        return series;
      }
      // Otherwise, i.e. if it does not specify a valid time:
      else {
        // Report this.
        console.log('ERROR: Initial job ID starts with an invalid time specification');
      }
    }
    // Otherwise, i.e. if it has no ID:
    else {
      // Report this.
      console.log('ERROR: Initial job has no ID');
    }
  }
  // Otherwise, i.e. if they are invalid:
  else {
    // Report this.
    console.log('ERROR: Arguments invalid');
  }
};
