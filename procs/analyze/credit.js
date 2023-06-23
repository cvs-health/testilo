/*
  credit.js
  Analyzes tool coverages of issues in a set of reports.
*/

// Returns a tabulation of the instance counts of issues reported by tools in scored reports.
exports.credit = reports => {
  const tally = {
    counts: {},
    onlies: {},
    mosts: {},
    tools: {}
  };
  const {counts, onlies, mosts, tools} = tally;
  // For each report:
  reports.forEach(report => {
    // If it is valid:
    if (report.score && report.score.details && report.score.details.issue) {
      // For each issue:
      const issues = report.score.details.issue;
      Object.keys(issues).forEach(issueID => {
        // For each tool with any complaints about it:
        if (! counts[issueID]) {
          counts[issueID] = {};
        }
        const issueTools = issues[issueID].tools;
        if (issueTools) {
          Object.keys(issueTools).forEach(toolID => {
            // For each rule cited by any of those complaints:
            if (! counts[issueID][toolID]) {
              counts[issueID][toolID] = 0;
            }
            Object.keys(issueTools[toolID]).forEach(ruleID => {
              // If an instance count was recorded:
              const {complaints} = issueTools[toolID][ruleID];
              if (complaints && complaints.countTotal) {
                // Add it to the tally.
                counts[issueID][toolID] += complaints.countTotal;
              }
              // Otherwise, i.e. if no instance count was recorded:
              else {
                // Report this.
                console.log(`ERROR: Missing countTotal for ${toolID} in ${issueID}`);
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
  // For each tallied issue:
  Object.keys(counts).forEach(issueID => {
    // If only 1 tool complained about it:
    const toolIDs = Object.keys(counts[issueID])
    if (toolIDs.length === 1) {
      // Add this to the tally.
      onlies[issueID] = toolIDs[0];
    }
    // Otherwise, i.e. if multiple tools complained about it:
    else {
      // Add the tools with the maximum instance count to the tally.
      const maxCount = Object
      .values(counts[issueID])
      .reduce((max, current) => Math.max(max, current));
      Object.keys(counts[issueID]).forEach(toolID => {
        if (counts[issueID][toolID] === maxCount) {
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
