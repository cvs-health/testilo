/*
  sp16a
  Testilo score proc hover

  Computes scores from Testaro script hover and adds them to a report.
  Usage examples:
    node score spHover 35k1r
    node score spHover

  This proc applies specified weights to the component scores before summing them. An issue reported
  by a test is given a score. That score is determined by:
    Whether the issue is reported as an error or a warning.
    How important the issue is, if the test package is pre-weighted (axe, tenon, and testaro)
    Whether the test belongs to a group or is a solo test.
    How heavily the group is weighted, if the test package is not pre-weighted and the test belongs
      to a group

  The scores of solo tests are added together, multiplied by the soloWeight multiplier, and
    contributed to the total score.

  The scores of grouped tests are aggregated into a group score before being contributed to the
    total score. The group score is the sum of (1) an absolute score, assigned because the group has
    at least one test with a non-zero score, (2) the largest score among the tests of the group
    multiplied by a multiplier, and (3) the sum of the scores from the other tests of the group
    multiplied by a smaller multiplier. These three amounts are given by the groupWeights object.

  Browser logging and navigation statistics produce a log score, and the prevention of tests
  produces a prevention score. They, too, are added to the total score.

  Each grouped test has a quality property, typically set to 1. The value of this property can be
  modified when the test is found to be higher or lower in quality than usual.
*/

// CONSTANTS

// ID of this proc.
const scoreProcID = 'spHover';
// Configuration disclosures.
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
// How much each solo issue adds to the score.
const soloWeight = 2;
// How much grouped issues add to the score.
const groupWeights = {
  // Added per issue group.
  absolute: 2,
  // Added per issue reported by the package with the largest count in the group.
  largest: 1,
  // Added per issue in the group reported by each other package.
  smaller: 0.4
};
// How much each prevention adds to the score.
const preventionWeights = {
  testaro: 50,
  other: 100
};
// Test groups.
const groups = {
  hoverSurprise: {
    weight: 1,
    packages: {
      testaro: {
        hover: {
          variable: false,
          quality: 1,
          what: 'Hovering is mis-indicated or changes content'
        }
      }
    }
  }
};

// VARIABLES

let packageDetails = {};
let groupDetails = {};
let summary = {};
let preventionScores = {};

// FUNCTIONS

// Initialize the variables.
const init = () => {
  packageDetails = {};
  groupDetails = {
    groups: {},
    solos: {}
  };
  summary = {
    total: 0,
    log: 0,
    preventions: 0,
    solos: 0,
    groups: []
  };
  preventionScores = {};
};

// Adds a score to the package details.
const addDetail = (actWhich, testID, addition = 1) => {
  if (addition) {
    if (!packageDetails[actWhich]) {
      packageDetails[actWhich] = {};
    }
    if (!packageDetails[actWhich][testID]) {
      packageDetails[actWhich][testID] = 0;
    }
    packageDetails[actWhich][testID] += Math.round(addition);
  }
};
// Scores a report.
exports.scorer = async report => {
  // Initialize the variables.
  init();
  // If there are any acts in the report:
  const {acts} = report;
  if (Array.isArray(acts)) {
    // If any of them are test acts:
    const testActs = acts.filter(act => act.type === 'test');
    if (testActs.length) {
      // For each test act:
      testActs.forEach(test => {
        const {which} = test;
        // Add scores to the package details.
        if (which === 'hover') {
          const issues = test.result && test.result.totals;
          if (issues) {
            const {
              impactTriggers,
              additions,
              removals,
              opacityChanges,
              opacityImpact,
              unhoverables,
              noCursors,
              badCursors,
              noIndicators,
              badIndicators
            } = issues;
            // Add score with weights on hover-impact types.
            const score = 2 * impactTriggers
            + 0.3 * additions
            + removals
            + 0.2 * opacityChanges
            + 0.1 * opacityImpact
            + unhoverables
            + 3 * noCursors
            + 2 * badCursors
            + noIndicators
            + badIndicators;
            if (score) {
              addDetail('testaro', which, score);
            }
          }
        }
      });
      // Get the prevention scores and add them to the summary.
      const actsPrevented = testActs.filter(test => test.result.prevented);
      actsPrevented.forEach(act => {
        if (otherPackages.includes(act.which)) {
          preventionScores[act.which] = preventionWeights.other;
        }
        else {
          preventionScores[`testaro-${act.which}`] = preventionWeights.testaro;
        }
      });
      const preventionScore = Object.values(preventionScores).reduce(
        (sum, current) => sum + current,
        0
      );
      const roundedPreventionScore = Math.round(preventionScore);
      summary.preventions = roundedPreventionScore;
      summary.total += roundedPreventionScore;
      // Initialize a table of the groups to which tests belong.
      const testGroups = {
        testaro: {}
      };
      // Initialize a table of the regular expressions of variably named tests of packages.
      const testMatchers = {};
      Object.keys(groups).forEach(groupName => {
        Object.keys(groups[groupName].packages).forEach(packageName => {
          Object.keys(groups[groupName].packages[packageName]).forEach(testID => {
            // Update the group table.
            testGroups[packageName][testID] = groupName;
            // If the test is variably named:
            if (groups[groupName].packages[packageName][testID].variable) {
              // Add its regular expression, as multiline, to the variably-named-test table.
              if (! testMatchers[packageName]) {
                testMatchers[packageName] = [];
              }
              testMatchers[packageName].push(new RegExp(testID, 's'));
            }
          });
        });
      });
      // For each package with any scores:
      Object.keys(packageDetails).forEach(packageName => {
        const matchers = testMatchers[packageName];
        // For each test with any scores in the package:
        Object.keys(packageDetails[packageName]).forEach(testMessage => {
          // Initialize the test ID as the reported test message.
          let testID = testMessage;
          // Get the group of the test, if it has a fixed name and is in a group.
          let groupName = testGroups[packageName][testMessage];
          // If the test has a variable name or is a solo test:
          if (! groupName) {
            // Determine whether the package has variably named tests and the test is among them.
            testRegExp = matchers && matchers.find(matcher => matcher.test(testMessage));
            // If so:
            if (testRegExp) {
              // Make the matching regular expression the test ID.
              testID = testRegExp.source;
              // Get the group of the test.
              groupName = testGroups[packageName][testID];
            }
          }
          // If the test is in a group:
          if (groupName) {
            // Initialize its score as its score in the package details.
            if (! groupDetails.groups[groupName]) {
              groupDetails.groups[groupName] = {};
            }
            if (! groupDetails.groups[groupName][packageName]) {
              groupDetails.groups[groupName][packageName] = {};
            }
            let weightedScore = packageDetails[packageName][testMessage];
            // Weight that by the group weight and normalize it to a 1–4 scale per instance.
            weightedScore *= groups[groupName].weight / 4;
            // Adjust the score for the quality of the test.
            weightedScore *= groups[groupName].packages[packageName][testID].quality;
            // Round the score, but not to less than 1.
            const roundedScore = Math.max(Math.round(weightedScore), 1);
            // Add the rounded score and the test description to the group details.
            groupDetails.groups[groupName][packageName][testID] = {
              score: roundedScore,
              what: groups[groupName].packages[packageName][testID].what
            };
          }
          // Otherwise, i.e. if the test is solo:
          else {
            if (! groupDetails.solos[packageName]) {
              groupDetails.solos[packageName] = {};
            }
            const roundedScore = Math.round(packageDetails[packageName][testID]);
            groupDetails.solos[packageName][testID] = roundedScore;
          }
        });
      });
      // Determine the group scores and add them to the summary.
      const groupNames = Object.keys(groupDetails.groups);
      const {absolute, largest, smaller} = groupWeights;
      // For each group with any scores:
      groupNames.forEach(groupName => {
        const scores = [];
        // For each package with any scores in the group:
        const groupPackageData = Object.values(groupDetails.groups[groupName]);
        groupPackageData.forEach(packageObj => {
          // Get the sum of the scores of the tests of the package in the group.
          const scoreSum = Object.values(packageObj).reduce(
            (sum, current) => sum + current.score,
            0
          );
          // Add the sum to the list of package scores in the group.
          scores.push(scoreSum);
        });
        // Sort the scores in descending order.
        scores.sort((a, b) => b - a);
        // Compute the sum of the absolute score and the weighted largest and other scores.
        const groupScore = absolute
        + largest * scores[0]
        + smaller * scores.slice(1).reduce((sum, current) => sum + current, 0);
        const roundedGroupScore = Math.round(groupScore);
        summary.groups.push({
          groupName,
          score: roundedGroupScore
        });
        summary.total += roundedGroupScore;
      });
      summary.groups.sort((a, b) => b.score - a.score);
      // Determine the solo score and add it to the summary.
      const soloPackageNames = Object.keys(groupDetails.solos);
      soloPackageNames.forEach(packageName => {
        const testIDs = Object.keys(groupDetails.solos[packageName]);
        testIDs.forEach(testID => {
          const score = soloWeight * groupDetails.solos[packageName][testID];
          summary.solos += score;
          summary.total += score;
        });
      });
      summary.solos = Math.round(summary.solos);
      summary.total = Math.round(summary.total);
    }
  }
  // Get the log score.
  const logScore = logWeights.logCount * report.logCount
  + logWeights.logSize * report.logSize +
  + logWeights.errorLogCount * report.errorLogCount
  + logWeights.errorLogSize * report.errorLogSize
  + logWeights.prohibitedCount * report.prohibitedCount +
  + logWeights.visitTimeoutCount * report.visitTimeoutCount +
  + logWeights.visitRejectionCount * report.visitRejectionCount
  + logWeights.visitLatency * (report.visitLatency - normalLatency);
  const roundedLogScore = Math.round(logScore);
  summary.log = roundedLogScore;
  summary.total += roundedLogScore;
  // Add the score facts to the report.
  report.score = {
    scoreProcID,
    logWeights,
    soloWeight,
    groupWeights,
    preventionWeights,
    packageDetails,
    groupDetails,
    preventionScores,
    summary
  };
};
