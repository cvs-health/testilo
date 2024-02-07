/*
  summarize.js
  Returns a summary of reports.
*/

// ########## IMPORTS

// Module to keep secrets.
require('dotenv').config();
// Module to perform common operations.
const {getNowStamp} = require('./procs/util');

// ########## FUNCTIONS

// Returns a summary.
exports.summarize = (what, reports) => {
  const data = reports.map(report => {
    const {id, jobData, score, sources} = report;
    const order = sources && sources.order || '';
    const target = sources && sources.target || '';
    return {
      id: id || '',
      endTime: jobData && jobData.endTime || '',
      order: order || '',
      target,
      score: score && score.summary && score.summary.total || null
    };
  });
  const summary = {
    what,
    timeStamp: getNowStamp(),
    data
  };
  return summary;
};
