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
// Indexes of issues.
const issueIndex = {};
const issueMatcher = [];
Object.keys(issueClasses).forEach(issueClassName => {
  Object.keys(issueClasses[issueClassName].tools).forEach(toolName => {
    Object.keys(issueClasses[issueClassName].tools[toolName]).forEach(issueID => {
      if (! issueIndex[toolName]) {
        issueIndex[toolName] = {};
      }
      issueIndex[toolName][issueID] = issueClassName;
      if (issueClasses[issueClassName].tools[toolName][issueID].variable) {
        issueMatcher.push(issueID);
      }
    })
  });
});

// FUNCTIONS

// Scores a report.
exports.scorer = report => {
  console.log(`Scoring report ${report.id}`);
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
          issue: 0,
          tool: 0,
          prevention: 0,
          log: 0,
          latency: 0
        },
        details: {
          severity: {
            total: [0, 0, 0, 0],
            byTool: {}
          },
          prevention: {},
          issue: {}
        }
      };
      const {summary, details} = score;
      // For each test act:
      testActs.forEach(act => {
        // If a successful standard result exists:
        const {which, standardResult} = act;
        if (
          standardResult
          && standardResult.totals
          && standardResult.totals.length === 4
          && standardResult.instances
        ) {
          // Add the severity totals of the tool to the score.
          const {totals} = standardResult;
          details.severity.byTool[which] = totals;
          // Add the instance data of the tool to the score.
          standardResult.instances.forEach(instance => {
            let ruleID = issueIndex[which][instance.ruleID];
            if (! ruleID) {
              ruleID = issueMatcher.find(pattern => {
                const patternRE = new RegExp(pattern);
                return patternRE.test(instance.ruleID);
              });
            }
            if (ruleID) {
              const issueID = issueIndex[which][ruleID];
              if (! details.issue[issueID]) {
                details.issue[issueID] = {
                  weight: issueClasses[issueID].weight,
                  tools: {}
                };
              }
              if (! details.issue[issueID].tools[which]) {
                details.issue[issueID].tools[which] = {};
              }
              if (! details.issue[issueID].tools[which][ruleID]) {
                details.issue[issueID].tools[which][ruleID] = {
                  quality: issueClasses[issueID][which][ruleID].quality,
                  complaints: {
                    countTotal: 0,
                    texts: []
                  }
                };
              }
              details
              .issue[issueID]
              .tools[which][ruleID]
              .complaints
              .countTotal += instance.count || 1;
              if (
                ! details
                .issue[issueID]
                .tools[which][ruleID]
                .complaints
                .texts
                .includes(instance.complaint)
              ) {
                details.issue[issueID].tools[which][ruleID].complaints.texts.push(instance.complaint);
              }
            }
            else {
              console.log(`ERROR: ${instance.ruleID} of ${which} not found in issueClasses`);
            }
          });
        }
        // Otherwise, i.e. if no successful standard result exists:
        else {
          // Add a prevented result to the act if not already there.
          if (! act.result) {
            act.result = {};
          }
          if (! act.result.prevented) {
            act.result.prevented = true;
          };
          // Add the tool and the prevention score to the score.
          details.prevention[which] = preventionWeight;
        }
      });
      // Add the severity detail totals to the score.
      details.severity.total = Object.keys(details.severity.byTool).reduce((severityTotals, toolID) => {
        details.severity.byTool[toolID].forEach((severityScore, index) => {
          severityTotals[index] += severityScore;
        });
        return severityTotals;
      }, details.severity.total);
      // Add the summary issue total to the score.
      Object.keys(details.issue).forEach(issueID => {
        Object.keys(details.issue[issueID].tools).forEach(toolID => {
          Object.keys(details.issue[issueID].tools[toolID]).forEach(ruleID => {
            summary.issue += details.issue[issueID].weight
            * details.issue[issueID].tools[toolID][ruleID].quality
            * details.issue[issueID].tools[toolID][ruleID].complaints.countTotal;
          });
        });
      });
      // Add the summary tool total to the score.
      summary.tool = toolWeight * details.severity.total.reduce(
        (total, current, index) => total + severityWeights[index] * current, 0
      );
      // Add the summary prevention total to the score.
      summary.prevention = Object.values(details.prevention).reduce(
        (total, current) => total + current
      );
      // Add the summary log score to the score.
      const {jobData} = report;
      summary.log = Math.max(0, Math.round(
        logWeights.logCount * jobData.logCount
        + logWeights.logSize * jobData.logSize +
        + logWeights.errorLogCount * jobData.errorLogCount
        + logWeights.errorLogSize * jobData.errorLogSize
        + logWeights.prohibitedCount * jobData.prohibitedCount +
        + logWeights.visitRejectionCount * jobData.visitRejectionCount
      ));
      // Add the summary latency score to the score.
      summary.latency = Math.round(
        latencyWeight * (Math.max(0, jobData.visitLatency - normalLatency))
      );
      // Round the unrounded scores.
      Object.keys(summary).forEach(summaryTypeName => {
        summary[summaryTypeName] = Math.round(summary[summaryTypeName]);
      });
      details.severity.total.forEach((severityTotal, index) => {
        details.severity.total[index] = Math.round(severityTotal);
      });
      // Add the summary total score to the score.
      summary.total = summary.issue
      + summary.tool
      + summary.prevention
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
