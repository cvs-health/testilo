/*
  compare.js
  Creates a comparative report from scored reports.
*/

// ########## FUNCTIONS

// Replaces the placeholders in a template with eponymous query parameters.
const replaceHolders = (template, query) => template
.replace(/__([a-zA-Z]+)__/g, (ph, qp) => query[qp]);
// Creates a report comparing the scores of scored reports.
exports.compare = async (template, comparer, scoredReports) => {
  const {getQuery} = comparer;
  const query = getQuery(scoredReports);
  const comparativeReport = replaceHolders(template, query);
  return comparativeReport;
};
