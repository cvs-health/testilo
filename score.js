/*
  score.js
  Scores a Testaro report.
  Arguments:
    0. Score proc.
    1. Raw report.
*/

// ########## FUNCTIONS

// Score the specified raw report and return it, scored.
exports.score = async (scoreProc, rawReport) => {
  // Initialize a scored report.
  const scoredReport = JSON.parse(JSON.stringify(rawReport));
  // Score it.
  await scoreProc(scoredReport);
  console.log(`Report ${rawReport.id} scored`);
  return scoredReport;
};
