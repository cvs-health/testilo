/*
  digest: digest template.
  Creator of parameters for substitution into digest.html.
*/

// FUNCTIONS

// Adds parameters to a query for a digest.
exports.digester = (report, query) => {
  query.target = report.sources.target.what;
  query.testCount = report.score.testCount;
};
