/*
  score.js
  Scores a Testaro report.
  Arguments:
    0. Score proc.
    1. Raw report.
*/

// ########## FUNCTIONS

// Score the specified raw report and return it, scored.
exports.score = async (scorer, rawReport) => {
  // Initialize a scored report.
  const scoredReport = JSON.parse(JSON.stringify(rawReport));
  // Score it.
  await scorer(scoredReport);
  console.log(`Report ${rawReport.job.id} scored`);
  return scoredReport;
};
