/*
  score.js
  Scores Testaro reports.
  Arguments:
    0. Scoring function.
    1. Array of reports.
*/

// ########## FUNCTIONS

// Score the specified raw reports and return them, scored.
exports.score = async (scorer, reports) => {
  const scoredReports = [];
  for (const report of reports) {
    scorer(report);
    scoredReports.push(report);
    console.log(`Report ${rawReport.id} scored`);
  }
  console.log(`Scoring complete. Report count: ${rawReports.length}`);
  return scoredReports;
};
