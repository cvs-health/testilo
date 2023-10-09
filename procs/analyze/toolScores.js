/*
  toolScores.js
  Tabulates tool scores from a report.
*/
const report = require(`${__dirname}/../../../testejo/reports/scored/${process.argv[2]}.json`);
const toolCounts = report.score.details.severity.byTool;
const result = {};
Object.keys(toolCounts).forEach(toolID => {
  result[toolID] = toolCounts[toolID]
  .reduce((total, current, index) => total + (index + 1) * current, 0);
});
console.log(JSON.stringify(result, null, 2));
