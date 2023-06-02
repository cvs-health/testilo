/*
  tsp27
  Testilo score proc 27

  Computes target score data and adds them to a ts26 report.
*/

// IMPORTS

const {issueClasses} = require('./tic27');

// CONSTANTS

// ID of this proc.
const scoreProcID = 'tsp27';
// Configuration disclosures.
const severityWeights = [1, 2, 3, 4];
const toolWeight = 0.1;
const logWeights = {
  logCount: 0.1,
  logSize: 0.002,
  errorLogCount: 0.2,
  errorLogSize: 0.004,
  prohibitedCount: 3,
  visitRejectionCount: 2
};
// How much each second of excess latency adds to the score.
const latencyWeight = 1;
// Normal latency (1.5 second per visit).
const normalLatency = 20;
// How much each prevention adds to the score.
const preventionWeight = 200;
// Index of issues.
const issueIndex = {};
Object.keys(issueClasses).forEach(issueClassName => {
  Object.keys(issueClasses[issueClassName].tools).forEach(toolName => {
    Object.keys(issueClasses[issueClassName].tools[toolName]).forEach(issueID => {
      if (! issueIndex[toolName]) {
        issueIndex[toolName] = {};
      }
      issueIndex[toolName][issueID] = issueClassName;
    })
  });
});

// FUNCTIONS

// Scores a report.
exports.scorer = report => {
  console.log(report.id);
  // If there are any acts in the report:
  const {acts} = report;
  if (Array.isArray(acts) && acts.length) {
    // If any of them are test acts:
    const testActs = acts.filter(act => act.type === 'test');
    if (testActs.length) {
      // Initialize the score data.
      const score = {
        scoreProcID,
        summary: {
          total: 0,
          issues: 0,
          tools: 0,
          preventions: 0,
          log: 0,
          latency: 0
        },
        toolTotals: [0, 0, 0, 0],
        issues: {},
        tools: {},
        preventions: {}
      };
      const {summary, toolTotals, issues, tools, preventions} = score;
      // For each test act:
      testActs.forEach(act => {
        // If a standard result with valid totals and instances exists:
        const {which, standardResult} = act;
        if (
          standardResult
          && standardResult.totals
          && standardResult.totals.length === 4
          && standardResult.instances
          && standardResult.instances.length
        ) {
          // Add the tool totals to the score.
          const {totals} = standardResult;
          tools[which] = totals;
          toolTotals.forEach((total, index) => {
            toolTotals[index] += toolWeight * totals[index];
            summary.tools += toolWeight * totals[index] * severityWeights[index];
          });
          // Update the issue totals for the tool.
          const issueTotals = {};
          standardResult.instances.forEach(instance => {
            const issueID = issueIndex[which][instance.issueID];
            if (! issueID) {
              console.log(`issueID problem for ${which}: ${instance.issueID}`);
            }
            if (! issueTotals[issueID]) {
              issueTotals[issueID] = 0;
            }
            issueTotals[issueID] += instance.count || 1;
          });
          // Update the issue totals in the score.
          Object.keys(issueTotals).forEach(issueID => {
            issues[issueID] = Math.max(issues[issueID] || 0, issueTotals[issueID]);
          });
          summary.issues = Object.values(issues).reduce((total, current) => total + current);
        }
        // Otherwise, i.e. if no result with totals exists:
        else {
          // Add a prevented result to the act if not already there.
          if (! act.result) {
            act.result = {};
          }
          if (! act.result.prevented) {
            act.result.prevented = true;
          };
          // Add the tool and the prevention score to the score.
          score.preventions[which] = preventionWeight;
          summary.preventions += preventionWeight;
        }
      });
      // Add the log score to the score.
      const {jobData} = report;
      summary.log = Math.max(0, Math.round(
        logWeights.logCount * jobData.logCount
        + logWeights.logSize * jobData.logSize +
        + logWeights.errorLogCount * jobData.errorLogCount
        + logWeights.errorLogSize * jobData.errorLogSize
        + logWeights.prohibitedCount * jobData.prohibitedCount +
        + logWeights.visitRejectionCount * jobData.visitRejectionCount
      ));
      summary.latency = Math.round(
        latencyWeight * (Math.max(0, jobData.visitLatency - normalLatency))
      );
      // Round the scores.
      Object.keys(summary).forEach(summaryTypeName => {
        summary[summaryTypeName] = Math.round(summary[summaryTypeName]);
      });
      toolTotals.forEach((severityTotal, index) => {
        toolTotals[index] = Math.round(toolTotals[index]);
      });
      // Add the total score to the score.
      summary.total = summary.issues
      + summary.tools
      + summary.preventions
      + summary.log
      + summary.latency;
      // Add the score to the report.
      report.score = score;
    }
    // Otherwise, i.e. if none of them is a test act:
    else {
      // Report this.
      console.log('ERROR: No test acts');
    }
  }
  // Otherwise, i.e. if there are no acts in the report:
  else {
    // Report this.
    console.log('ERROR: No acts');
  }
};
