/*
  compare.js
  Creates a comparison from scored reports.
  Arguments:
    0. Comparing function.
    1. Array of scored reports.
*/

// ########## FUNCTIONS

// Compares the scored reports and returns a comparison.
exports.compare = async (comparer, scoredReports) => {
  // Return the comparison.
  console.log(`Comparison complete. Report count: ${scoredReports.length}`);
  return comparer(scoredReports);
};
