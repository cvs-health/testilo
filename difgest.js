/*
  difgest.js
  Creates difgests from scored reports.
  Arguments:
    0. Difgesting function.
    1. Array of 2 scored reports.
*/

// ########## FUNCTIONS

// Difgests the scored reports and returns a difgest.
exports.difgest = async (difgester, reportA, reportB) => {
  const difgestedReport = await difgester(reportA, reportB);
  console.log(`Reports ${reportA.id} and ${reportB.id} difgested`);
  // Return the difgest.
  return difgestedReport;
};
