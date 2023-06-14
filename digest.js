/*
  digest.js
  Creates digests from a scored reports.
  Arguments:
    0. Digesting function.
    1. Array of scored reports.
*/

// ########## FUNCTIONS

// Digests the scored reports and returns them, digested.
exports.digest = (digester, reports) => {
  const digests = {};
  // For each report:
  reports.forEach(report => {
    // Use it to create a digest.
    const digestedReport = digester(report);
    // Add the digest to the array of digests.
    digests[report.id] = digestedReport;
    console.log(`Report ${report.id} digested`);
  });
  // Return the digests.
  console.log(`Digesting complete. Report count: ${reports.length}`);
  return digests;
};
