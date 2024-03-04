/*
  rescore.js
  Rescores and returns a scored report.
  Arguments:
    0. scoring function.
    1. scored report.
    2. restriction type (tools or issues).
    3. array of IDs of tools or issues to be included.
*/

// ########## IMPORTS

// Module to perform common operations.
const {getNowStamp} = require('./procs/util');

// ########## FUNCTIONS

// Rescores a report.
exports.rescore = (scorer, report, restrictionType, includedIDs) => {
  const result = {
    success: true
  };
  // If tools are restricted:
  const {acts, id, score} = report;
  if (restrictionType === 'tools') {
    // If all the tools included by the restriction are in the report:
    const reportToolIDs = new Set(acts.filter(act => act.type === 'test').map(act => act.which));
    if (includedIDs.every(
      includedID => acts.some(act => act.type === 'test' && act.which === includedID)
    )) {
      // Delete the acts that are tests of other tools.
      report.acts = acts.filter(act => act.type !== 'test' || includedIDs.includes(act.which));
    }
    // Otherwise, i.e. if any tool included by the restriction is not in the report:
    else {
      // Report this and abort rescoring.
      const message = `Report includes only tools ${Array.from(reportToolIDs).join(', ')}`;
      result.success = false;
      result.error = message;
      console.log(`ERROR: ${message}`);
    }
  }
  // Otherwise, if issues are restricted:
  else if (restrictionType === 'issues') {
    // Initialize data on the violated rules of the issues included by the restriction.
    const ruleData = {};
    // For each issue with any rule violations:
    const issueDetails = score.details.issue;
    const reportIssueIDs = Object.keys(issueDetails);
    reportIssueIDs.forEach(reportIssueID => {
      // If the restriction includes the issue:
      if (includedIDs.includes(reportIssueID)) {
        // For each tool with any violated rules of the issue:
        const issueToolIDs = Object.keys(issueDetails[reportIssueID].tools);
        issueToolIDs.forEach(issueToolID => {
          // For each violated rule of the issue of the tool:
          const issueToolRuleIDs = Object.keys(issueDetails[reportIssueID].tools[issueToolID]);
          issueToolRuleIDs.forEach(issueToolRuleID => {
            // Add the rule to the rule data.
            ruleData[issueToolID] ??= [];
            ruleData[issueToolID].push(issueToolRuleID);
          });
        });
      }
    });
    // For each act:
    acts.forEach(act => {
      // If it is a test act:
      if (act.type === 'test') {
        // Delete any standard instances of rules not included by the restriction.
        const {data, standardResult} = act;
        standardResult.instances = standardResult.instances.filter(
          instance => ruleData[act.which].includes(instance.ruleID)
        );
        // Reinitialize the totals of the standard result.
        standardResult.totals = [0, 0, 0, 0];
        const {totals} = standardResult;
        // If the tool of the act is Testaro:
        if (act.which === 'testaro') {
          // Recalculate the totals of the act.
          const {ruleTotals} = data;
          ruleTotals.forEach(ruleTotal => {
            totals.forEach((total, index) => {
              totals[index] += ruleTotal[index];
            });
          });
        }
        // Otherwise, i.e. if the tool is not Testaro:
        else {
          // Recalculate the totals of the act.
          const {instances} = standardResult;
          instances.forEach(instance => {
            const {count, ordinalSeverity} = instance;
            totals[ordinalSeverity] += count * ordinalSeverity;
          });
        }
      }
    });
  }
  // Otherwise, i.e. if neither tools nor issues are restricted:
  else {
    // Report this and abort rescoring.
    const message = 'Neither tools nor issues are restricted';
    result.success = false;
    result.error = message;
    console.log(`ERROR: ${message}`);
  }
  // Add rescoring data to the report.
  report.rescore = {
    originalID: id,
    timeStamp: getNowStamp(),
    restrictionType,
    includedIDs,
    result
  }
  // If rescoring was not aborted:
  if (result.success) {
    // Rescore the revised report.
    scorer(report);
  }
}
