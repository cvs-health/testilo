/*
  score.js
  Scores Testaro reports.
  Arguments:
    0. Scoring function.
    1. Array of reports.
*/

// ########## FUNCTIONS

// Scores the specified raw reports.
exports.score = (scorer, reports) => {
  // For each report:
  for (const report of reports) {
    // Score it.
    scorer(report);
    console.log(`Report ${report.id} scored`);
  }
  console.log(`Scoring complete; report count ${reports.length}`);
};
