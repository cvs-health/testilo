/*
  tsp27
  Testilo score proc 27

  Totals the standardized tool totals from a ts26.
*/

// IMPORTS

const {issues} = require('./tic27');

// CONSTANTS

// ID of this proc.
const scoreProcID = 'tsp27';
// Configuration disclosures.
const severityWeights = [1, 2, 3, 4];
const logWeights = {
  logCount: 0.5,
  logSize: 0.01,
  errorLogCount: 1,
  errorLogSize: 0.02,
  prohibitedCount: 15,
  visitRejectionCount: 10
};
const latencyWeight = 1;
// Normal latency (1.5 second per visit).
const normalLatency = 20;
// How much each prevention adds to the score.
const preventionWeight = 100;

// FUNCTIONS

// Scores a report.
exports.scorer = report => {
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
      const {summary} = score;
      // For each test act:
      testActs.forEach(act => {
        // If a standard result with valid totals exists:
        const {which} = act;
        if (
          act.standardResult && act.standardResult.totals && act.standardResult.totals.length === 4
        ) {
          // Add the tool totals to the score.
          const {totals} = act.standardResult;
          score.tools[which] = totals;
          score.toolTotals.forEach((total, index) => {
            score.toolTotals[index] += totals[index];
            summary.tools += totals[index] * severityWeights[index];
          });
          // If 
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
      summary.latency = Math.round(latencyWeight * (jobData.visitLatency - normalLatency));
      // Add the total score to the score.
      summary.total = summary.tools + summary.preventions + summary.log + summary.latency;
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
