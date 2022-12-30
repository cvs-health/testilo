/*
  score.js
  Scores Testaro reports.
  Arguments:
    0. Scoring function.
    1. Array of reports.
*/

// ########## FUNCTIONS

// Scores the specified raw reports and returns them, scored.
exports.score = (scorer, reports) => {
  const scoredReports = [];
  // For each report:
  for (const report of reports) {
    // Score it.
    const scoredReport = JSON.parse(JSON.stringify(report));
    scorer(scoredReport);
    // Append it to the array of scored reports.
    scoredReports.push(scoredReport);
    console.log(`Report ${report.id} scored`);
  }
  // Return the array of scored reports.
  console.log(`Scoring complete; report count ${reports.length}`);
  return scoredReports;
};
