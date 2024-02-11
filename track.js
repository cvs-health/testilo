/*
  track.js
  Creates tracking reports from report summaries.
  Arguments:
    0. Tracking function.
    1. Summary.
*/

// ########## IMPORTS

// Module to perform common operations.
const {getFileID} = require('./procs/util');

// ########## FUNCTIONS

// Creates and returns a tracking report from a summary.
exports.track = async (tracker, summaryReport) => {
  // Use the tracker to create a tracking report.
  const id = getFileID(2);
  const trackingReport = await tracker(id, summaryReport);
  console.log(`Tracking report ${id} created`);
  return [id, trackingReport];
};
