/*
  digest.js
  Creates a digest from a scored report.
  Arguments:
    0. Digesting function.
    1. Scored report.
*/

// ########## FUNCTIONS

// Digests the scored reports and returns them, digested.
exports.digest = async (digester, reports) => {
  const digests = {};
  // For each report:
  for (const report of reports) {
    // Use it to create a digest.
    const digestedReport = await digester(report);
    // Add the digest to the array of digests.
    digests[report.id] = digestedReport;
    console.log(`Report ${report.id} digested`);
  };
  // Return the digests.
  console.log(`Digesting complete; report count ${reports.length}`);
  return digests;
};
