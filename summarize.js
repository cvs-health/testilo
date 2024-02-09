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
  const order = sources && sources.order || '';
  const target = sources && sources.target || '';
  const summary = {
    id: id || '',
    endTime: jobData && jobData.endTime || '',
    order: order || '',
    target,
    score: score && score.summary && score.summary.total || null
  };
  return summary;
};
