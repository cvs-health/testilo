/*
  digest.js
  Creates a digest from a scored report.
  Arguments:
    0. Digest template.
    1. Digest proc.
    2. Scored report.
*/

// ########## FUNCTIONS

// Replaces the placeholders in content with eponymous query parameters.
const replaceHolders = (content, query) => content
.replace(/__([a-zA-Z]+)__/g, (ph, qp) => query[qp]);
// Creates a digest.
exports.digest = (digestTemplate, digestProc, scoredReport) => {
  // Create a query.
  const query = {};
  digestProc(scoredReport, query);
  // Use it to replace the placeholders in the template.
  const digest = replaceHolders(digestTemplate, query);
  // Return the digest.
  console.log(`Report ${scoredReport.job.id} digested`);
  return digest;
};
