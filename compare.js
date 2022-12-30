/*
  compare.js
  Creates a comparative report from scored reports.
*/

// ########## FUNCTIONS

// Replaces the placeholders in a template with eponymous query parameters.
const replaceHolders = (template, query) => template
.replace(/__([a-zA-Z]+)__/g, (ph, qp) => query[qp]);
// Compares the scored reports and returns a comparison.
exports.compare = (comparisonTemplate, comparer, reports) => {
  // Create a query.
  const query = {};
  // Populate the query.
  comparer(reports, query);
  // Use it to create a comparison.
  const comparison = replaceHolders(comparisonTemplate, query);
  // Return the comparison.
  console.log(`Comparison complete. Report count: ${reports.length}`);
  return comparison;
};
