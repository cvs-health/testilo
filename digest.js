/*
  digest.js
  Creates digests from a scored reports.
  Arguments:
    0. Digest template.
    1. Digesting function.
    2. Array of scored reports.
*/

// ########## FUNCTIONS

// Replaces the placeholders in content with eponymous query parameters.
const replaceHolders = (content, query) => content
.replace(/__([a-zA-Z]+)__/g, (ph, qp) => query[qp]);
// Digests the scored reports and returns them, digested.
exports.digest = (digestTemplate, digester, reports) => {
  const digests = {};
  // Create a query.
  const query = {};
  // For each report:
  for (const report of reports) {
    // Populate the query.
    digester(report, query);
    // Use it to create a digest.
    const digestedReport = replaceHolders(digestTemplate, query);
    // Add the digest to the array of digests.
    digests[report.id] = digestedReport;
    console.log(`Report ${report.id} digested`);
  };
  // Return the digests.
  console.log(`Digesting complete. Report count: ${reports.length}`);
  return digests;
};
