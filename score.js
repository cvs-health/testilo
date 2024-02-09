/*
  score.js
  Scores a Testaro report.
  Arguments:
    0. Scoring function.
    1. Report.
*/

// ########## FUNCTIONS

// Scores the specified raw report.
exports.score = (scorer, report) => {
  scorer(report);
  console.log(`Report ${report.id} scored`);
};
