/*
  digest.js
  Creates a digest from a scored report.
  Arguments:
    0. Digesting function.
    1. Scored report.
*/

// ########## FUNCTIONS

// Digests the scored reports and returns them, digested.
exports.digest = async (digester, report) => {
  // Create a digest.
  const digest = await digester(report);
  console.log(`Report ${report.id} digested`);
  // Return the digest.
  return digest;
};
