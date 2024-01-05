/*
  script.js
  Creates and returns a script to perform the tests for issues.
*/

// ########## IMPORTS

// Module to keep secrets.
require('dotenv').config();

// ########## VARIABLES

// List of presumptively needed tools.
let toolIDs = [
  'alfa', 'aslint', 'axe', 'ed11y', 'htmlcs', 'ibm', 'nuVal', 'qualWeb', 'testaro', 'wave'
];

// ########## FUNCTIONS

// Creates and returns a script.
exports.script = (id, issues = null, ... issueIDs) => {
  // Initialize data on the tools and their rules for the specified issues, if any.
  const neededTools = {};
  // If an issue classification and any issues were specified:
  if (issues && issueIDs.length) {
    // For each specified issue:
    issueIDs.forEach(issueID => {
      // If it exists in the classification:
      const issueData = issues[issueID];
      if (issueData) {
        // For each tool that tests for the issue:
        const issueToolIDs = Object.keys(issueData.tools);
        issueToolIDs.forEach(issueToolID => {
          // For each of the rules of the tool for the issue:
          if (! neededTools[issueToolID]) {
            neededTools[issueToolID] = [];
          }
          Object.keys(issueData.tools[issueToolID]).forEach(ruleID => {
            // Add data on the rule.
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
        // Remove unneeded tools from the tool list.
        toolIDs = Object.keys(neededTools);
      }
      // Otherwise, i.e. if it does not exist in the classification:
      else {
        // Report this and quit.
        console.log(`ERROR: Issue ${issueID} not in issue classification`);
        return {};
      }
    });
  }
  // If, after any issue-based pruning, any needed tools remain:
  if (toolIDs.length) {
    // Initialize a script.
    const scriptObj = {
      id,
      what: `accessibility tests`,
      strict: true,
      isolate: true,
      timeLimit: 30 + (10 * issueIDs.length || 30 * toolIDs.length),
      acts: [
        {
          "type": "placeholder",
          "which": "main",
          "launch": "webkit"
        }
      ]
    };
    // For each needed tool:
    toolIDs.forEach(toolID => {
      // Initialize a test act for it.
      const toolAct = {
        type: 'test',
        which: toolID
      };
      // If issues were specified:
      if (issues && issueIDs.length) {
        // Add a rules array as a property to the act.
        toolAct.rules = neededTools[toolID];
        // If the tool is Testaro:
        if (toolID === 'testaro') {
          // Prepend the inclusion option to the rule array.
          toolAct.rules.unshift('y');
        }
      }
      // Add any needed option defaults to the act.
      if (toolID === 'axe') {
        toolAct.detailLevel = 2;
      }
      else if (toolID === 'ibm') {
        toolAct.withItems = true;
        toolAct.withNewContent = true;
      }
      else if (toolID === 'qualWeb') {
        toolAct.withNewContent = false;
      }
      else if (toolID === 'testaro') {
        toolAct.withItems = true;
        toolAct.stopOnFail = false;
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
  // Otherwise, i.e. if no rules have been identified:
  else {
    // Report this.
    console.log(`ERROR: No rules for the specified issues found`);
    return {};
  }
};
