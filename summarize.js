/*
  summarize.js
  Returns a summary of a report.
*/

// ########## IMPORTS

// Module to keep secrets.
require('dotenv').config();

// ########## FUNCTIONS

// Returns a report summary.
exports.summarize = report => {
  const {id, jobData, score, sources} = report;
  const summary = {
    id: id || null,
    endTime: jobData && jobData.endTime || null,
    sources: sources || null,
    score: score && score.summary && score.summary.total || null
  };
  return summary;
};
