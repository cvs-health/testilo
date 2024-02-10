/*
  compare.js
  Creates a comparison from a summary report.
  Arguments:
    0. Comparing function.
    1. Summary report.
*/

// ########## FUNCTIONS

// Compares the summarized reports and returns a comparison.
exports.compare = async (id, what, comparer, summaryReport) => {
  // Return the comparison.
  console.log(`Comparison complete. Report count: ${summaryReport.data.length}`);
  return comparer(id, what, summaryReport);
};
