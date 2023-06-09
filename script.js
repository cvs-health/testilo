/*
  script.js
  Creates and returns a script for specified issues.
  Arguments:
    0. issue classification
    1. issue IDs
*/

// ########## IMPORTS

// Module to keep secrets.
require('dotenv').config();

// ########## FUNCTIONS

// Creates and returns a script.
exports.script = (issueClasses, ... issueIDs) => {
  const neededTools = {};
  issueIDs.forEach(issueID => {
    const issueData = issueClasses[issueID];
    if (issueData) {
      const issueToolIDs = Object.keys(issueData);
      issueToolIDs.forEach(issueToolID => {
        if (! neededTools[issueToolID]) {
          neededTools[issueToolID] = [];
        }
        Object.keys(issueData[issueToolID]).forEach(ruleID => {
          const ruleData = issueData[issueToolID][ruleID];
          if (issueToolID === 'nuVal') {
            if (ruleData.variable) {
              neededTools[issueToolID].push(`~${ruleID}`);
            }
            else {
              neededTools[issueToolID].push(`=${ruleID}`);
            }
          }
          else {
            neededTools[issueToolID].push(ruleID);
          }
        });
      });
    }
    else {
      console.log(`ERROR: Issue ${issueID} not in issue classification`);
      return {};
    }
  })
};
