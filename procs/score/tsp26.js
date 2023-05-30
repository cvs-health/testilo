/*
  tsp26
  Testilo score proc 26

  Computes scores from Testilo script ts26 and adds them to a report.
*/

// IMPORTS

const {issues} = require('./tic26');

// CONSTANTS

// ID of this proc.
const scoreProcID = 'tsp26';
// Configuration disclosures.
const severityWeights = [1, 2, 3, 4];
const logWeights = {
  logCount: 0.5,
  logSize: 0.01,
  errorLogCount: 1,
  errorLogSize: 0.02,
  prohibitedCount: 15,
  visitTimeoutCount: 10,
  visitRejectionCount: 10,
  visitLatency: 1
};
// Normal latency (1 second per visit).
const normalLatency = 13;
// How much each prevention adds to the score.
const preventionWeight = 100;
// Tools.
const tools = [
  'alfa',
  'axe',
  'continuum',
  'htmlcs',
  'ibm',
  'nuVal',
  'qualWeb',
  'tenon',
  'testaro',
  'wave'
];

// VARIABLES

let summary = {};
let preventionScores = {};

// FUNCTIONS

// Scores a report.
exports.scorer = async report => {
  // Initialize the score.
  report.score = {
    summary = {
      total: 0,
      tools: 0,
      preventions: 0,
      log: 0,
      latency: 0
    },
    toolTotals: [],
    tools: {},
    preventions = {}
  };
  // If there are any acts in the report:
  const {acts} = report;
  if (Array.isArray(acts) && acts.length) {
    // If any of them are test acts:
    const testActs = acts.filter(act => act.type === 'test');
    if (testActs.length) {
      // Initialize a report score.
      report.score = {
        tools: {},
        total: 0
      };
      const {score} = report;
      // For each test act:
      testActs.forEach(act => {
        // If a result with totals exists:
        const {which} = act;
        if (act.result && act.result.totals && act.result.totals.length === 4) {
          // Add the totals to the score.
          const {totals} = act.result;
          score.tools[which] = totals;
          score.toolTotals.forEach((total, index) => {
            score.toolTotals[index] += totals[index];
            score.summary.tools += totals[index] * severityWeights[index];
          });
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
          // Add the tool and a prevention score to the score.
          report.score.preventions[which] = preventionWeight;
          report.score.preventions += preventionWeight;
        }
      });
      // Get the log score.
      const {jobData} = report;
      const logScore = logWeights.logCount * jobData.logCount
      + logWeights.logSize * jobData.logSize +
      + logWeights.errorLogCount * jobData.errorLogCount
      + logWeights.errorLogSize * jobData.errorLogSize
      + logWeights.prohibitedCount * jobData.prohibitedCount +
      + logWeights.visitTimeoutCount * jobData.visitTimeoutCount +
      + logWeights.visitRejectionCount * jobData.visitRejectionCount
      + logWeights.visitLatency * (jobData.visitLatency - normalLatency);
      const roundedLogScore = Math.max(0, Math.round(logScore));
      summary.log = roundedLogScore;
      summary.total += roundedLogScore;
    }
    // Otherwise, i.e. if none of them is a test act:
    else {
      // Report this.
      console.log('ERROR: No test acts');
  // Add the score facts to the report.
  report.score = {
    scoreProcID,
    logWeights,
    soloWeight,
    issueWeights,
    preventionWeights,
    toolDetails,
    issueDetails,
    preventionScores,
    summary
  };
};
exports.issues = issues;
