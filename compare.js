/*
  compare.js
  Creates a comparison from a summary report.
  Arguments:
    0. Comparison ID.
    1. Comparison description.
    2. Comparing function.
    3. Summary report.
*/

// ########## FUNCTIONS

// Compares the summarized reports and returns a comparison.
exports.compare = async (id, what, comparer, summaryReport) => {
  // Return the comparison.
  console.log(`Comparison complete. Report count: ${summaryReport.summaries.length}`);
  return comparer(id, what, summaryReport);
};
