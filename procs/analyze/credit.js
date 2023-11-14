/*
  credit.js
  Analyzes tool coverages of issues in a set of reports.
*/

// Returns a tabulation of the instance counts of issues reported by tools in scored reports.
exports.credit = reports => {
  const tally = {
    instanceCounts: {},
    onlies: {},
    mosts: {},
    tools: {},
    issueCounts: {
      total: 0,
      nonOnlies: 0,
      onlies: 0,
      toolOnlies: {}
    }
  };
  const {instanceCounts, onlies, mosts, tools, issueCounts} = tally;
  // For each report:
  reports.forEach(report => {
    // If it is valid:
    if (report.score && report.score.details && report.score.details.issue) {
      // For each issue:
      const issues = report.score.details && report.score.details.issue;
      Object.keys(issues).forEach(issueID => {
        // For each tool with any complaints about it:
        if (! instanceCounts[issueID]) {
          instanceCounts[issueID] = {};
        }
        const issueTools = issues[issueID].tools;
        if (issueTools) {
          Object.keys(issueTools).forEach(toolID => {
            // For each rule cited by any of those complaints:
            if (! instanceCounts[issueID][toolID]) {
              instanceCounts[issueID][toolID] = {
                total: 0,
                rules: {}
              };
            }
            Object.keys(issueTools[toolID]).forEach(ruleID => {
              // If an instance count was recorded:
              const {complaints} = issueTools[toolID][ruleID];
              if (complaints && complaints.countTotal) {
                // Add it to the tally.
                instanceCounts[issueID][toolID].total += complaints.countTotal;
                // Add a rule itemization to the tally.
                if (! instanceCounts[issueID][toolID].rules[ruleID]) {
                  instanceCounts[issueID][toolID].rules[ruleID] = 0;
                }
                instanceCounts[issueID][toolID].rules[ruleID] += complaints.countTotal;
              }
              // Otherwise, i.e. if no instance count was recorded:
              else {
                // Report this.
                console.log(
                  `ERROR: Report ${report.id} missing countTotal for ${toolID} in ${issueID}`
                );
              }
            });
          });
        }
        else {
          console.log(`ERROR: Missing tools for ${issueID}`);
        }
      });
    }
    // Otherwise, i.e. if it is invalid:
    else {
      // Report this.
      console.log(`ERROR: Report ${report.id} missing score data`);
    }
  });
  // Populate the total and initial non-only issue counts.
  issueCounts.nonOnlies = issueCounts.total = Object.keys(instanceCounts).length;
  // For each tallied issue:
  Object.keys(instanceCounts).forEach(issueID => {
    // If only 1 tool complained about it:
    const toolIDs = Object.keys(instanceCounts[issueID]);
    if (toolIDs.length === 1) {
      // Add this to the tally and decrement the non-only total.
      const toolID = toolIDs[0];
      onlies[issueID] = toolID;
      issueCounts.onlies++;
      if (! issueCounts.toolOnlies[toolID]) {
        issueCounts.toolOnlies[toolID] = 0;
      }
      issueCounts.toolOnlies[toolID]++;
      issueCounts.nonOnlies--;
    }
    // Otherwise, i.e. if multiple tools complained about it:
    else {
      // Add the tools with the maximum instance count to the tally.
      const maxCount = Object
      .values(instanceCounts[issueID])
      .reduce((max, current) => Math.max(max, current ? current.total : 0), 0);
      Object.keys(instanceCounts[issueID]).forEach(toolID => {
        if (maxCount && instanceCounts[issueID][toolID].total === maxCount) {
          if (! mosts[issueID]) {
            mosts[issueID] = [];
          }
          mosts[issueID].push(toolID);
        }
      });
    }
  });
  // Add the onlies and mosts to the tool tabulation in the tally.
  [[onlies, 'onlies'], [mosts, 'mosts']].forEach(qualityPair => {
    Object.keys(qualityPair[0]).forEach(issueID => {
      const toolID = qualityPair[0][issueID];
      if (! tools[toolID]) {
        tools[toolID] = {
          onlies: [],
          mosts: []
        };
      }
      tools[toolID][qualityPair[1]].push(issueID);
    });
  });
  return tally;
};
