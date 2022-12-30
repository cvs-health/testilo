/*
  comparer.
  Creator of parameters for substitution into comparison.html.
*/

// FUNCTIONS

// Adds parameters to a query for a comparison.
exports.comparer = (reports, query) => {
  const entries = reports.map(report => ({
    target: report.sources.target.what,
    score: report.score.total
  }));
  const entriesHTML = entries
  .map(entry => `<li>Page of ${entry.target} got score ${entry.score}.</li>`)
  .join('\n        ');
  query.list = `<ul>\n        ${entriesHTML}\n      </ul>`;
};
