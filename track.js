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
exports.track = async (tracker, what, summaryReport) => {
  // Use the tracker to create a tracking report.
  const id = getFileID(2);
  const trackingReport = await tracker(id, what, summaryReport);
  // Return an ID usable for the report and the report.
  return [id, trackingReport];
};
