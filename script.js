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
exports.script = (id, issueClasses, ... issueIDs) => {
  // Initialize data on the tests for the specified issues.
  const neededTools = {};
  // For each specified issue:
  issueIDs.forEach(issueID => {
    // If it exists in the classification:
    const issueData = issueClasses[issueID];
    if (issueData) {
      // For each tool that tests for the issue:
      const issueToolIDs = Object.keys(issueData.tools);
      issueToolIDs.forEach(issueToolID => {
        // For each of the tests of the tool for the issue:
        if (! neededTools[issueToolID]) {
          neededTools[issueToolID] = [];
        }
        Object.keys(issueData.tools[issueToolID]).forEach(ruleID => {
          // Add data on the test.
          const ruleData = issueData.tools[issueToolID][ruleID];
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
    // Otherwise, i.e. if it does not exist in the classification:
    else {
      // Report this.
      console.log(`ERROR: Issue ${issueID} not in issue classification`);
      return {};
    }
  });
  // If any tests have been identified:
  const toolIDs = Object.keys(neededTools);
  if (toolIDs.length) {
    // Initialize a script.
    const scriptObj = {
      id,
      what: `accessibility tests`,
      strict: true,
      timeLimit: 30 + 2 * issueIDs.length,
      acts: [
        {
          "type": "placeholder",
          "which": "main",
          "launch": "chromium"
        }
      ]
    };
    // If Tenon is one of the identified tools:
    if (toolIDs.includes('tenon')) {
      // Add a Tenon request act to the script.
      scriptObj.acts.push({
        type: 'tenonRequest',
        id: 'a',
        withNewContent: false,
        what: 'Tenon API version 2 test request, with URL'
      });
    }
    // For each identified tool:
    toolIDs.forEach(toolID => {
      // Initialize a test act for it.
      const toolAct = {
        type: 'test',
        which: toolID,
        rules: neededTools[toolID]
      };
      // If the tool is Testaro:
      if (toolID === 'testaro') {
        // Prepend the inclusion option to the rule array.
        toolAct.rules.unshift('y');
      }
      // Add option specifications if necessary.
      if (toolID === 'axe') {
        toolAct.detailLevel = 2;
      }
      else if (toolID === 'ibm') {
        toolAct.withItems = true;
        toolAct.withNewContent = false;
      }
      else if (toolID === 'qualWeb') {
        toolAct.withNewContent = false;
      }
      else if (toolID === 'tenon') {
        toolAct.id = 'a';
      }
      else if (toolID === 'testaro') {
        toolAct.withItems = true;
      }
      else if (toolID === 'wave') {
        toolAct.reportType = 4;
      }
      // Add the act to the script.
      scriptObj.acts.push(toolAct);
    });
    // Return the script.
    return scriptObj;
  }
  // Otherwise, i.e. if no tests have been identified:
  else {
    // Report this.
    console.log(`ERROR: No tests for the specified issues found`);
    return {};
  }
};
