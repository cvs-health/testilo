/*
  tsp21
  Testilo score proc 21

  Computes scores from Testilo script ts21 and adds them to a report.
*/

// IMPORTS

const {issues} = require('./tic21');

// CONSTANTS

// ID of this proc.
const scoreProcID = 'tsp21';
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
// How much each unclassified failure adds to the score.
const soloWeight = 2;
// How much classified issues add to the score.
const issueWeights = {
  // Added per issue.
  absolute: 2,
  // Added per instance reported by the tool with the largest count.
  largest: 1,
  // Added per instance reported by each other package.
  smaller: 0.4
};
// How much each prevention adds to the score.
const preventionWeights = {
  testaro: 50,
  other: 100
};
// Non-Testaro packages.
const otherPackages = [
  'alfa',
  'axe',
  'continuum',
  'htmlcs',
  'ibm',
  'nuVal',
  'qualWeb',
  'tenon',
  'wave'
];

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
    issues: []
  };
  preventionScores = {};
};

// Adds a score to the tool details.
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
        if (which === 'alfa') {
          const issues = test.result && test.result.items;
          if (issues && Array.isArray(issues)) {
            issues.forEach(issue => {
              const {verdict, rule} = issue;
              if (verdict && rule) {
                const {ruleID} = rule;
                if (ruleID) {
                  // Add 4 per failure, 1 per warning (cantTell).
                  addDetail(which, ruleID, verdict === 'failed' ? 4 : 1);
                }
              }
            });
          }
        }
        else if (which === 'axe') {
          const impactScores = {
            minor: 1,
            moderate: 2,
            serious: 3,
            critical: 4
          };
          const tests = test.result && test.result.details;
          if (tests) {
            const warnings = tests.incomplete;
            const {violations} = tests;
            [[warnings, 0.25], [violations, 1]].forEach(issueSeverity => {
              if (issueSeverity[0] && Array.isArray(issueSeverity[0])) {
                issueSeverity[0].forEach(issueType => {
                  const {id, nodes} = issueType;
                  if (id && nodes && Array.isArray(nodes)) {
                    nodes.forEach(node => {
                      const {impact} = node;
                      if (impact) {
                        // Add the impact score for a violation or 25% of it for a warning.
                        addDetail(which, id, issueSeverity[1] * impactScores[impact]);
                      }
                    });
                  }
                });
              }
            });
          }
        }
        else if (which === 'continuum') {
          const issues = test.result;
          if (issues && Array.isArray(issues)) {
            issues.forEach(issue => {
              // Add 4 per violation.
              addDetail(which, issue.engineTestId, 4);
            });
          }
        }
        else if (which === 'htmlcs') {
          const issues = test.result;
          if (issues) {
            ['Error', 'Warning'].forEach(issueSeverityName => {
              const severityData = issues[issueSeverityName];
              if (severityData) {
                const issueTypes = Object.keys(severityData);
                issueTypes.forEach(issueTypeName => {
                  const issueArrays = Object.values(severityData[issueTypeName]);
                  const issueCount = issueArrays.reduce((count, array) => count + array.length, 0);
                  const severityCode = issueSeverityName[0].toLowerCase();
                  const code = `${severityCode}:${issueTypeName}`;
                  // Add 4 per error, 1 per warning.
                  const weight = severityCode === 'e' ? 4 : 1;
                  addDetail(which, code, weight * issueCount);
                });
              }
            });
          }
        }
        else if (which === 'ibm') {
          const {result} = test;
          const {content, url} = result;
          if (content && url) {
            let preferredMode = 'content';
            if (
              content.error ||
              (content.totals &&
                content.totals.violation &&
                url.totals &&
                url.totals.violation &&
                url.totals.violation > content.totals.violation)
            ) {
              preferredMode = 'url';
            }
            const {items} = result[preferredMode];
            if (items && Array.isArray(items)) {
              items.forEach(issue => {
                const {ruleId, level} = issue;
                if (ruleId && level) {
                  // Add 4 per violation, 1 per warning (recommendation).
                  addDetail(which, ruleId, level === 'violation' ? 4 : 1);
                }
              });
            }
          }
        }
        else if (which === 'nuVal') {
          const issues = test.result && test.result.messages;
          if (issues) {
            issues.forEach(issue => {
              // Add 4 per error, 1 per warning.
              const weight = issue.type === 'error' ? 4 : 1;
              addDetail(which, issue.message, weight);
            });
          }
        }
        else if (which === 'qualWeb') {
          const issueTypes = test.result
          && test.result.customHtml
          && test.result.customHtml.modules;
          if (issueTypes) {
            ['act-rules', 'wcag-techniques', 'best-practices'].forEach(type => {
              const {assertions} = issueTypes[type];
              if (assertions){
                const issueIDs = Object.keys(assertions);
                issueIDs.forEach(issueID=> {
                  const {results} = assertions[issueID];
                  results.forEach(result => {
                    // Add 4 error, 1 per warning.
                    const weight = result.verdict === 'error' ? 4 : 1;
                    addDetail(which, )
                  })
                });
              }
            });
            issues.forEach(issue => {
              // Add 4 per error, 1 per warning.
              const weight = issue.type === 'error' ? 4 : 1;
              addDetail(which, issue.message, weight);
            });
          }
        }
        else if (which === 'tenon') {
          const issues =
            test.result && test.result.data && test.result.data.resultSet;
          if (issues && Array.isArray(issues)) {
            issues.forEach(issue => {
              const {tID, priority, certainty} = issue;
              if (tID && priority && certainty) {
                // Add 4 per issue if certainty and priority 100, less if less.
                addDetail(which, tID, certainty * priority / 2500);
              }
            });
          }
        }
        else if (which === 'wave') {
          const severityScores = {
            error: 4,
            contrast: 3,
            alert: 1
          };
          const issueSeverities = test.result && test.result.categories;
          if (issueSeverities) {
            ['error', 'contrast', 'alert'].forEach(issueSeverity => {
              const {items} = issueSeverities[issueSeverity];
              if (items) {
                const testIDs = Object.keys(items);
                if (testIDs.length) {
                  testIDs.forEach(testID => {
                    const {count} = items[testID];
                    if (count) {
                      // Add 4 per error, 3 per contrast error, 1 per warning (alert).
                      addDetail(
                        which, `${issueSeverity[0]}:${testID}`, count * severityScores[issueSeverity]
                      );
                    }
                  });
                }
              }
            });
          }
        }
        else if (which === 'allHidden') {
          const {result} = test;
          if (
            result
            && ['hidden', 'reallyHidden', 'visHidden', 'ariaHidden'].every(
              key => result[key]
              && ['document', 'body', 'main'].every(
                element => typeof result[key][element] === 'boolean'
              )
            )
          ) {
            // Get a score for the test.
            const score = 8 * result.hidden.document
            + 8 * result.hidden.body
            + 6 * result.hidden.main
            + 10 * result.reallyHidden.document
            + 10 * result.reallyHidden.body
            + 8 * result.reallyHidden.main
            + 8 * result.visHidden.document
            + 8 * result.visHidden.body
            + 6 * result.visHidden.main
            + 10 * result.ariaHidden.document
            + 10 * result.ariaHidden.body
            + 8 * result.ariaHidden.main;
            // Add the score.
            addDetail('testaro', which, score);
          }
        }
        else if (which === 'bulk') {
          const count = test.result && test.result.visibleElements;
          if (typeof count === 'number') {
            // Add 1 per 300 visible elements beyond 300.
            addDetail('testaro', which, Math.max(0, count / 300 - 1));
          }
        }
        else if (which === 'docType') {
          // If document has no or invalid doctype:
          const hasType = test.result && test.result.docHasType;
          if (typeof hasType === 'boolean' && ! hasType) {
            // Add 10.
            addDetail('testaro', which, 10);
          }
        }
        else if (which === 'embAc') {
          const issueCounts = test.result && test.result.totals;
          if (issueCounts) {
            const counts = Object.values(issueCounts);
            const total = counts.reduce((sum, current) => sum + current);
            // Add 3 per embedded element.
            addDetail('testaro', which, 3 * total);
          }
        }
        else if (which === 'filter') {
          const totals = test.result && test.result.totals;
          if (totals) {
            // Add 2 per filter-styled element, 1 per filter-impacted element.
            addDetail('testaro', which, 2 * totals.elements + totals.impact);
          }
        }
        else if (which === 'focAll') {
          const discrepancy = test.result && test.result.discrepancy;
          if (discrepancy) {
            // Add 2 per discrepancy.
            addDetail('testaro', which, 2 * Math.abs(discrepancy));
          }
        }
        else if (which === 'focInd') {
          const issueTypes =
            test.result && test.result.totals && test.result.totals.types;
          if (issueTypes) {
            const missingCount = issueTypes.indicatorMissing
            && issueTypes.indicatorMissing.total
            || 0;
            const badCount = issueTypes.nonOutlinePresent
            && issueTypes.nonOutlinePresent.total
            || 0;
            // Add 3 per missing, 1 per non-outline focus indicator.
            addDetail('testaro', which, badCount + 3 * missingCount);
          }
        }
        else if (which === 'focOp') {
          const issueTypes =
            test.result && test.result.totals && test.result.totals.types;
          if (issueTypes) {
            const noOpCount = issueTypes.onlyFocusable && issueTypes.onlyFocusable.total || 0;
            const noFocCount = issueTypes.onlyOperable && issueTypes.onlyOperable.total || 0;
            // Add 2 per unfocusable, 0.5 per inoperable element.
            addDetail('testaro', which, 2 * noFocCount + 0.5 * noOpCount);
          }
        }
        else if (which === 'focVis') {
          const count = test.result && test.result.total;
          if (count) {
            // Add 1 per link outside the viewport.
            addDetail('testaro', which, count);
          }
        }
        else if (which === 'hover') {
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
        else if (which === 'labClash') {
          const mislabeledCount = test.result
          && test.result.totals
          && test.result.totals.mislabeled
          || 0;
          // Add 1 per element with conflicting labels (ignoring unlabeled elements).
          addDetail('testaro', which, mislabeledCount);
        }
        else if (which === 'linkTo') {
          const count = test.result && test.result.total;
          if (count) {
            // Add 2 per link with no destination.
            addDetail('testaro', which, count);
          }
        }
        else if (which === 'linkUl') {
          const totals = test.result && test.result.totals && test.result.totals.adjacent;
          if (totals) {
            const nonUl = totals.total - totals.underlined || 0;
            // Add 2 per non-underlined adjacent link.
            addDetail('testaro', which, 2 * nonUl);
          }
        }
        else if (which === 'menuNav') {
          const issueCount = test.result
          && test.result.totals
          && test.result.totals.navigations
          && test.result.totals.navigations.all
          && test.result.totals.navigations.all.incorrect
          || 0;
          // Add 2 per defect.
          addDetail('testaro', which, 2 * issueCount);
        }
        else if (which === 'miniText') {
          const items = test.result && test.result.items;
          if (items && items.length) {
            // Add 1 per 100 characters of small-text.
            const totalLength = items.reduce((total, item) => total + item.length, 0);
            addDetail('testaro', which, Math.floor(totalLength / 100));
          }
        }
        else if (which === 'motion') {
          const data = test.result;
          if (data) {
            const {
              meanLocalRatio,
              maxLocalRatio,
              globalRatio,
              meanPixelChange,
              maxPixelChange,
              changeFrequency
            } = data;
            const score = 2 * (meanLocalRatio - 1)
            + (maxLocalRatio - 1)
            + globalRatio - 1
            + meanPixelChange / 10000
            + maxPixelChange / 25000
            + 3 * changeFrequency
            || 0;
            addDetail('testaro', which, score);
          }
        }
        else if (which === 'nonTable') {
          const total = test.result && test.result.total;
          if (total) {
            // Add 2 per pseudotable.
            addDetail('testaro', which, 2 * total);
          }
        }
        else if (which === 'radioSet') {
          const totals = test.result && test.result.totals;
          if (totals) {
            const {total, inSet} = totals;
            const score = total - inSet || 0;
            // Add 1 per misgrouped radio button.
            addDetail('testaro', which, score);
          }
        }
        else if (which === 'role') {
          const badCount = test.result && test.result.badRoleElements || 0;
          const redundantCount = test.result && test.result.redundantRoleElements || 0;
          // Add 2 per bad role and 1 per redundant role.
          addDetail('testaro', which, 2 * badCount + redundantCount);
        }
        else if (which === 'styleDiff') {
          const totals = test.result && test.result.totals;
          if (totals) {
            let score = 0;
            // For each element type that has any style diversity:
            Object.values(totals).forEach(typeData => {
              const {total, subtotals} = typeData;
              if (subtotals) {
                const styleCount = subtotals.length;
                const plurality = subtotals[0];
                const minorities = total - plurality;
                // Add 1 per style, 0.2 per element with any nonplurality style.
                score += styleCount + 0.2 * minorities;
              }
            });
            addDetail('testaro', which, score);
          }
        }
        else if (which === 'tabNav') {
          const issueCount = test.result
          && test.result.totals
          && test.result.totals.navigations
          && test.result.totals.navigations.all
          && test.result.totals.navigations.all.incorrect
          || 0;
          // Add 2 per defect.
          addDetail('testaro', which, 2 * issueCount);
        }
        else if (which === 'titledEl') {
          const total = test.result && test.result.total;
          if (total) {
            const score = 4 * total;
            // Add 4 per mistitled element.
            addDetail('testaro', which, score);
          }
        }
        else if (which === 'zIndex') {
          const issueCount = test.result && test.result.totals && test.result.totals.total || 0;
          // Add 1 per non-auto zIndex.
          addDetail('testaro', which, issueCount);
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
        testaro: {},
        alfa: {},
        axe: {},
        continuum: {},
        htmlcs: {},
        ibm: {},
        nuVal: {},
        tenon: {},
        wave: {}
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
              groupDetails.groups[groupName] = {
                wcag: groups[groupName].wcag,
                packages: {}
              };
            }
            if (! groupDetails.groups[groupName].packages[packageName]) {
              groupDetails.groups[groupName].packages[packageName] = {};
            }
            let weightedScore = packageDetails[packageName][testMessage];
            // Weight that by the group weight and normalize it to a 1–4 scale per instance.
            weightedScore *= groups[groupName].weight / 4;
            // Adjust the score for the quality of the test.
            weightedScore *= groups[groupName].packages[packageName][testID].quality;
            // Round the score, but not to less than 1.
            const roundedScore = Math.max(Math.round(weightedScore), 1);
            // Add the rounded score and the test description to the group details.
            groupDetails.groups[groupName].packages[packageName][testID] = {
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
        const groupPackageData = Object.values(groupDetails.groups[groupName].packages);
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
  const {jobData} = report;
  const logScore = logWeights.logCount * jobData.logCount
  + logWeights.logSize * jobData.logSize +
  + logWeights.errorLogCount * jobData.errorLogCount
  + logWeights.errorLogSize * jobData.errorLogSize
  + logWeights.prohibitedCount * jobData.prohibitedCount +
  + logWeights.visitTimeoutCount * jobData.visitTimeoutCount +
  + logWeights.visitRejectionCount * jobData.visitRejectionCount
  + logWeights.visitLatency * (jobData.visitLatency - normalLatency);
  const roundedLogScore = Math.max(0, Math.round(logScore));
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
exports.groups = groups;
