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
  script.js
  Creates and returns a script to perform the tests for issues.
*/

// IMPORTS

// Module to handle secrets.
require('dotenv').config();
// Devices recognized by Playwright.
const {devices} = require('playwright');
// Utility module.
const {isToolID, toolIDs} = require('./procs/util');

// ########## FUNCTIONS

// Returns whether a device ID is recognized by Playwright.
const isDeviceID = deviceID => deviceID === 'default' || !! devices[deviceID];
// Returns options for a new browser context (window).
const getWindowOptions = (deviceID, motion) => {
  // If the arguments are valid:
  if (isDeviceID(deviceID) && ['no-preference', 'reduced-motion'].includes(motion)) {
    // Set the reduceMotion option.
    const options = {
      reduceMotion: motion
    };
    // If the default device was specified:
    if (deviceID === 'default') {
      // Return the reduce-motion option.
      return options;
    }
    // Otherwise, i.e. if a non-default device was specified:
    else {
      // Get its properties.
      const deviceProperties = devices[deviceID];
      // Return the reduce-motion and device options.
      return {
        ... options,
        ... deviceProperties
      };
    }
  }
  // Otherwise, i.e. if the arguments are not valid:
  else {
    // Return this.
    return null;
  }
};
// Creates and returns a script.
exports.script = (id, what, deviceID, options = {}) => {
  // If the arguments are valid:
  if (id && what && isDeviceID(deviceID)) {
    const toolsRulesData = {};
    // If options are specified:
    const {type, specs} = options;
    if (type && specs) {
      // If the option type is tools and is valid:
      if (
        type === 'tools'
        && Array.isArray(specs)
        && specs.length
        && specs.every(spec => isToolID(spec))
      ) {
        // Initialize the data on tools and rules.
        specs.forEach(spec => {
          toolsRulesData[spec] = [];
        });
      }
      // Otherwise, if the option type is issues and is valid:
      else if (
        type === 'issues'
        && typeof specs === 'object'
        && specs.issues
        && specs.issueIDs
        && typeof specs.issues === 'object'
        && Array.isArray(specs.issueIDs)
        && specs.issueIDs.length
      ) {
        const {issueIDs, issues} = specs;
        // For each specified issue:
        issueIDs.forEach(issueID => {
          const issueData = issues[issueID];
          // If it exists in the classification:
          if (issueData) {
            const issueToolIDs = Object.keys(issueData.tools);
            // For each tool that tests for the issue:
            issueToolIDs.forEach(issueToolID => {
              toolsRulesData[issueToolID] ??= [];
              const toolRuleIDs = toolsRulesData[issueToolID];
              const toolData = issueData.tools[issueToolID];
              // For each of the rules of the tool for the issue:
              Object.keys(toolData).forEach(ruleID => {
                // Add the rule to the data on tools and rules.
                let rulePrefix = '';
                if (issueToolID === 'nuVal') {
                  rulePrefix = toolData[ruleID].variable ? '~' : '=';
                }
                const fullRuleID = `${rulePrefix}${ruleID}`;
                if (! toolRuleIDs.includes(fullRuleID)) {
                  toolRuleIDs.push(fullRuleID);
                }
              });
            });
          }
          // Otherwise, i.e. if it does not exist in the classification:
          else {
            // Report this and quit.
            console.log(`ERROR: Issue ${issueID} not in issue classification`);
            return null;
          }
        });
      }
      // Otherwise, i.e. if the option specification is invalid:
      else {
        // Report this and quit.
        console.log(`ERROR: Options invalid`);
        return null;
      }
    }
    // Otherwise, i.e. if options are not specified:
    else {
      // Populate the data on tools and rules.
      toolIDs.forEach(toolID => {
        toolsRulesData[toolID] = [];
      });
    }
    // Initialize a script.
    const scriptObj = {
      id,
      what,
      strict: false,
      isolate: true,
      standard: 'only',
      observe: false,
      device: {
        id: deviceID,
        windowOptions: {}
      },
      browserID: 'webkit',
      timeLimit: Math.round(50 + 30 * Object.keys(toolsRulesData).length),
      creationTimeStamp: '',
      executionTimeStamp: '',
      sendReportTo: process.env.SEND_REPORT_TO || '',
      target: {
        what: '',
        url: ''
      },
      sources: {
        script: id,
        batch: '',
        mergeID: '',
        requester: process.env.REQUESTER || ''
      },
        acts: [
        {
          type: 'placeholder',
          which: 'main'
        }
      ]
    };
    // Add the window options to the script.
    scriptObj.device.windowOptions = getWindowOptions(deviceID, 'no-preference');
    // For each tool used:
    Object.keys(toolsRulesData).forEach(toolID => {
      // Initialize a test act for it.
      const toolAct = {
        type: 'test',
        which: toolID
      };
      // If rules were specified:
      const ruleIDs = toolsRulesData[toolID];
      if (ruleIDs.length) {
        // Add a rules array as a property to the act.
        toolAct.rules = ruleIDs;
        // If the tool is QualWeb:
        if (toolID === 'qualWeb') {
          // For each QualWeb module:
          const specs = [];
          const prefixes = {
            act: 'QW-ACT-R',
            wcag: 'QW-WCAG-T',
            best: 'QW-BP'
          };
          Object.keys(prefixes).forEach(prefix => {
            // Specify the rules of that module to be tested for.
            const ids = toolAct.rules.filter(id => id.startsWith(prefixes[prefix]));
            const integers = ids.map(id => id.slice(prefixes[prefix].length));
            specs.push(`${prefix}:${integers.join(',')}`);
          });
          // Replace the generic rule list with the QualWeb-format list.
          toolAct.rules = specs;
        }
        // Otherwise, if the tool is Testaro:
        else if (toolID === 'testaro') {
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
        toolAct.withNewContent = false;
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
  // Otherwise, i.e. if the arguments are not valid:
  else {
    // Report this and quit.
    console.log(`ERROR: Arguments invalid`);
    return null;
  }
}
