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
    // Create a representation of the initial job.
    const template = JSON.stringify(job);
    // If the initial job has an ID:
    const jobID = template.id;
    if (jobID) {
      // If the ID specifies a valid time:
      const s = jobID.slice(0, 11);
      const dateSpec = `20${s[0]}${s[1]}-${s[2]}${s[3]}-${s[4]}${s[5]}`;
      const timeSpec = `${s[7]}${s[8]}:${s[9]}${s[10]}`;
      const dateTimeSpec = `${dateSpec}T${timeSpec}Z`;
      const start = new Date(dateTimeSpec);
      const startNum = valueOf(start);
      if (startNum) {
        // Initialize the series.
        const series = [];
        // For each job required:
        for (let i = 0; i < count; i++) {
          // Add it to the series.
          const nextJob = JSON.parse(template);
          const nextDate = new Date(startNum + i * interval * 60000);
          const nextTimeStamp = nextDate.toISOString().slice(2, 16).replace(/-:/g, '');
          nextJob.id.replace(/^[^-]+/, nextTimeStamp);
          nextJob.sources.series = nextJob.id;
          series.push(nextJob);
        }
        return series;
      }
      else {
        console.log('ERROR: Initial job ID starts with an invalid time specification');
      }
    }
    else {
      console.log('ERROR: Initial job has no ID');
    }
  }
  else {
    console.log('ERROR: Arguments invalid');
  }
};
