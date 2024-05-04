/*
  © 2024 CVS Health and/or one of its affiliates. All rights reserved.

  Permission is hereby granted, free of charge, to any person obtaining a copy
  of this software and associated documentation files (the "Software"), to deal
  in the Software without restriction, including without limitation the rights
  to use, copy, modify, merge, publish, distribute, sublicense, and/or sell
  copies of the Software, and to permit persons to whom the Software is
  furnished to do so, subject to the following conditions:

  The above copyright notice and this permission notice shall be included in all
  copies or substantial portions of the Software.

  THE SOFTWARE IS PROVIDED "AS IS", WITHOUT WARRANTY OF ANY KIND, EXPRESS OR
  IMPLIED, INCLUDING BUT NOT LIMITED TO THE WARRANTIES OF MERCHANTABILITY,
  FITNESS FOR A PARTICULAR PURPOSE AND NONINFRINGEMENT. IN NO EVENT SHALL THE
  AUTHORS OR COPYRIGHT HOLDERS BE LIABLE FOR ANY CLAIM, DAMAGES OR OTHER
  LIABILITY, WHETHER IN AN ACTION OF CONTRACT, TORT OR OTHERWISE, ARISING FROM,
  OUT OF OR IN CONNECTION WITH THE SOFTWARE OR THE USE OR OTHER DEALINGS IN THE
  SOFTWARE.
*/

/*
  credit.js
  Analyzes tool coverages of issues in an array of score properties of scored reports.
*/

// Returns a tabulation of the instance counts of issues reported by tools in scored reports.
exports.credit = (what, reportScores) => {
  const tally = {
    what,
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
  reportScores.forEach(reportScore => {
    // If it is valid:
    if (reportScore && reportScore.details && reportScore.details.issue) {
      // For each issue:
      const issues = reportScore.details && reportScore.details.issue;
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
            });
          });
        }
        else {
          console.log(`ERROR: Missing tools for ${issueID}`);
        }
      });
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
