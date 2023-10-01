/*
  ruleCounts.js
  Tabulates tool rules from a issue classification.
*/

const {issues} = require('../score/tic36');

const counts = {
  total: 0
};
// For each issue:
Object.values(issues).forEach(issue => {
  // For each tool with any rules of the issue:
  Object.keys(issue.tools).forEach(toolName => {
    if (! counts[toolName]) {
      counts[toolName] = 0;
    }
    const increment = Object.keys(issue.tools[toolName]).length;
    counts[toolName] += increment;
    counts.total += increment;
  });
});
console.log(JSON.stringify(counts, null, 2));
