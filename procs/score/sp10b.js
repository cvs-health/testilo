/*
  sp10b
  Testilo score proc 10b
  Computes scores from Testaro script tp10 and adds them to a report.
  Usage example: node score 35k1r sp10b
*/

// ########## IMPORTS

// Module to read and write files.
const fs = require('fs/promises');

// CONSTANTS

const scoreProcID = 'sp10b';
// Define the configuration disclosures.
const logWeights = {
  count: 0.5,
  size: 0.01,
  prohibited: 15,
  visitTimeout: 10,
  visitRejection: 10
};
const groupWeights = {
  accessKeyDup: 3,
  ariaRefBad: 4,
  autocompleteBad: 2,
  bulk: 1,
  buttonNoText: 4,
  childMissing: 3,
  contrast: 3,
  dupID: 2,
  embAc: 2,
  eventKbd: 3,
  fieldSetMissing: 2,
  focAll: 3,
  focInd: 3,
  focOp: 3,
  h1Missing: 1,
  headingEmpty: 2,
  headingStruc: 2,
  hover: 1,
  htmlLang: 3,
  htmlLangBad: 3,
  iframeNoText: 3,
  imgNoText: 4,
  imgAltRedundant: 1,
  imgInputNoText: 4,
  imgMapAreaNoText: 3,
  labClash: 2,
  labelForBadID: 4,
  langChange: 2,
  leadingFrozen: 3,
  linkNoText: 4,
  linkUl: 2,
  menuNav: 2,
  metaBansZoom: 3,
  motion: 2,
  objNoText: 2,
  parentMissing: 3,
  roleBad: 3,
  roleBadAttr: 3,
  roleMissingAttr: 3,
  selectNoText: 3,
  styleDiff: 1,
  svgImgNoText: 4,
  tabNav: 2,
  title: 3,
  zIndex: 1
};
const soloWeight = 1;
const countWeights = {
  absolute: 2,
  largest: 1,
  smaller: 0.4
};
const preventionWeights = {
  testaro: 50,
  other: 100
};
const packageDetails = {};
const groupDetails = {
  groups: {},
  solos: {}
};
const summary = {
  total: 0,
  log: 0,
  preventions: 0,
  solos: 0,
  groups: {}
};
const otherPackages = ['aatt', 'alfa', 'axe', 'ibm', 'tenon', 'wave'];
const preventionScores = {};

// FUNCTIONS

// Adds to the count of issues of a kind discovered by a test package.
const addDetail = (actWhich, testID, addition = 1) => {
  if (! packageDetails[actWhich]) {
    packageDetails[actWhich] = {};
  }
  if (! packageDetails[actWhich][testID]) {
    packageDetails[actWhich][testID] = 0;
  }
  packageDetails[actWhich][testID] += addition;
};
exports.scorer = async report => {
  // If there are any acts:
  const {acts} = report;
  if (Array.isArray(acts)) {
    // If any of them are test acts:
    const testActs = acts.filter(act => act.type === 'test');
    if (testActs.length) {
      // For each test act:
      testActs.forEach(test => {
        const {which} = test;
        // Get the issue tally.
        if (which === 'aatt') {
          const issues = test.result;
          if (issues && Array.isArray(issues)) {
            issues.forEach(issue => {
              const {type, id} = issue;
              if (type && id) {
                const typedID = `${type[0]}:${id}`;
                addDetail(which, typedID);
              }
            });
          }
        }
        else if (which === 'alfa') {
          const issues = test.result;
          if (issues && Array.isArray(issues)) {
            issues.forEach(issue => {
              const {rule} = issue;
              if (rule) {
                const {ruleID} = rule;
                if (ruleID) {
                  addDetail(which, ruleID);
                }
              }
            });
          }
        }
        else if (which === 'axe') {
          const tests = test.result && test.result.items;
          if (tests && Array.isArray(tests)) {
            tests.forEach(test => {
              const {rule, elements} = test;
              if (rule && Array.isArray(elements) && elements.length) {
                addDetail(which, rule, elements.length);
              }
            });
          }
        }
        else if (which === 'ibm') {
          const envs = test.result;
          const {content, url} = envs;
          if (content && url) {
            let preferredEnv = 'content';
            if (
              content.error
              || content.totals
              && content.totals.violation
              && url.totals
              && url.totals.violation
              && url.totals.violation > content.totals.violation
            ) {
              preferredEnv = 'url';
            }
            const {items} = envs[preferredEnv];
            if (items && Array.isArray(items) && items.length) {
              items.forEach(issue => {
                const {ruleID} = issue;
                if (ruleID) {
                  addDetail(which, ruleID);
                }
              });
            }
          }
        }
        else if (which === 'tenon') {
          const issues = test.result && test.result.data && test.result.data.resultSet;
          if (issues && Array.isArray(issues) && issues.length) {
            issues.forEach(issue => {
              const {tID} = issue;
              if (tID) {
                addDetail(which, tID);
              }
            })
          }
        }
        else if (which === 'wave') {
          const issueClasses = test.result && test.result.categories;
          if (issueClasses) {
            ['error', 'contrast', 'alert'].forEach(issueClass => {
              const {items} = issueClasses[issueClass];
              if (items) {
                const testIDs = Object.keys(items);
                if (testIDs.length) {
                  testIDs.forEach(testID => {
                    const {count} = items[testID];
                    if (count) {
                      addDetail(which, `${issueClass[0]}:${testID}`, count);
                    }
                  });
                }
              }
            });
          }
        }
        else if (which === 'bulk') {
          const count = test.result && test.result.visibleElements;
          if (typeof count === 'number') {
            const faultCount = Math.round(count / 300);
            addDetail('testaro', which, faultCount);
          }
        }
        else if (which === 'embAc') {
          const issueCounts = test.result && test.result.totals;
          if (issueCounts) {
            const counts = Object.values(issueCounts);
            const total = counts.reduce((sum, current) => sum + current);
            addDetail('testaro', which, total);
          }
        }
        else if (which === 'focAll') {
          const discrepancy = test.result && test.result.discrepancy;
          if (discrepancy) {
            addDetail('testaro', which, Math.abs(discrepancy));
          }
        }
        else if (which === 'focInd') {
          const issueTypes = test.result && test.result.totals && test.result.totals.types;
          if (issueTypes) {
            const missingCount = issueTypes.indicatorMissing && issueTypes.indicatorMissing.total;
            const badCount = issueTypes.nonOutlinePresent && issueTypes.nonOutlinePresent.total;
            const faultCount = Math.round(missingCount + badCount / 2);
            if (faultCount) {
              addDetail('testaro', which, faultCount);
            }
          }
        }
        else if (which === 'focOp') {
          const issueTypes = test.result && test.result.totals && test.result.totals.types;
          if (issueTypes) {
            const noOpCount = issueTypes.onlyFocusable && issueTypes.onlyFocusable.total;
            const noFocCount = issueTypes.onlyOperable && issueTypes.onlyOperable.total;
            const faultCount = Math.round(noFocCount + noOpCount / 2);
            if (faultCount) {
              addDetail('testaro', which, faultCount);
            }
          }
        }
        else if (which === 'hover') {
          const issues = test.result && test.result.totals;
          if (issues) {
            const {triggers, madeVisible, opacityChanged, opacityAffected, unhoverables} = issues;
            const faultCount = Math.round(
              1 * triggers
              + 0.5 * madeVisible
              + 0.2 * opacityChanged
              + 0.2 * opacityAffected
              + 1 * unhoverables
            );
            if (faultCount) {
              addDetail('testaro', which, faultCount);
            }
          }
        }
        else if (which === 'labClash') {
          const mislabeledCount = test.result
          && test.result.totals
          && test.result.totals.mislabeled;
          if (mislabeledCount) {
            addDetail('testaro', which, mislabeledCount);
          }
        }
        else if (which === 'linkUl') {
          const issues = test.result && test.result.items && test.result.items.notUnderlined;
          if (issues && issues.length) {
            addDetail('testaro', which, issues.length);
          }
        }
        else if (which === 'menuNav') {
          const issueCount = test.result
          && test.result.totals
          && test.result.totals.navigations
          && test.result.totals.navigations.all
          && test.result.totals.navigations.all.incorrect;
          if (issueCount && typeof issueCount === 'number') {
            addDetail('testaro', which, issueCount);
          }
        }
        else if (which === 'motion') {
          const data = test.result;
          if (data && data.bytes) {
            const faultCount = Math.floor(
              5 * (data.meanLocalRatio - 1)
              + 2 * (data.maxLocalRatio - 1)
              + data.globalRatio - 1
              + data.meanPixelChange / 10000
              + data.maxPixelChange / 25000
              + 30 * data.changeFrequency
            );
            addDetail('testaro', which, faultCount);
          }
        }
        else if (which === 'radioSet') {
          const counts = test.result && test.result.totals;
          const {total, inSet} = counts;
          if (total && typeof inSet === 'number' && total >= inSet) {
            addDetail('testaro', which, total - inSet);
          }
        }
        else if (which === 'role') {
          const issueCount = test.result && test.result.badRoleElements;
          if (issueCount && typeof issueCount === 'number') {
            addDetail('testaro', which, issueCount);
          }
        }
        else if (which === 'styleDiff') {
          const counts = test.result && test.result.totals;
          if (counts) {
            // Identify objects having the tag-name totals and style distributions as properties.
            const tagNameCounts = Object.values(counts);
            // Identify an array of pairs of counts of excess styles and of nonplurality elements.
            const faults = tagNameCounts.map(
              item => {
                const subtotals = item.subtotals ? item.subtotals : [item.total];
                return [subtotals.length - 1, item.total - subtotals[0]];
              }
            );
            // Fault count: 2 per excess style + 0.2 per nonplurality element.
            const faultCount = Math.floor(faults.reduce(
              (total, currentPair) => total + 2 * currentPair[0] + 0.2 * currentPair[1], 0
            ));
            addDetail('testaro', which, faultCount);
          }
        }
        else if (which === 'tabNav') {
          const issueCount = test.result
          && test.result.totals
          && test.result.totals.navigations
          && test.result.totals.navigations.all
          && test.result.totals.navigations.all.incorrect;
          if (issueCount && typeof issueCount === 'number') {
            addDetail('testaro', which, issueCount);
          }
        }
        else if (which === 'zIndex') {
          const issueCount = test.result && test.result.totals;
          if (issueCount && typeof issueCount === 'number') {
            addDetail('testaro', which, issueCount);
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
      const preventionScore = Object
      .values(preventionScores)
      .reduce((sum, current) => sum + current, 0);
      summary.preventions = preventionScore;
      summary.total += preventionScore;
      // Get data on test groups.
      const testGroupsJSON = await fs.readFile('scoring/data/testGroups.json', 'utf8');
      const testGroups = JSON.parse(testGroupsJSON);
      const {tests} = testGroups;
      // Get the IDs of the packages whose tests report any issues.
      const issuePackageIDs = Object.keys(packageDetails);
      // For each such package:
      issuePackageIDs.forEach(packageID => {
        // Get the IDs of the tests in the package that report issues.
        const issueTestIDs = Object.keys(tests[packageID]);
        // For each such test:
        issueTestIDs.forEach(testID => {
          // Get its group data, if any.
          const testGroupData = tests[packageID][testID];
          // If it is in a group:
          if (testGroupData) {
            // Add the issue count and test description to the group details.
            const {groupID, what} = testGroupData;
            if (! groupDetails.groups[groupID]) {
              groupDetails.groups[groupID] = {};
            }
            if (! groupDetails.groups[groupID][packageID]) {
              groupDetails.groups[groupID][packageID] = {};
            }
            groupDetails.groups[groupID][packageID][testID] = {
              issueCount: packageDetails[packageID][testID],
              what
            };
          }
          // Otherwise, i.e. if the test is solo:
          else {
            // Add the issue count to the solo details.
            if (! groupDetails.solos[packageID]) {
              groupDetails.solos[packageID] = {};
            }
            groupDetails.solos[packageID][testID] = packageDetails[packageID][testID];
          }
        });
      });
      // Get the group scores and add them to the summary.
      const issueGroupIDs = Object.keys(groupDetails.groups);
      const {absolute, largest, smaller} = countWeights;
      issueGroupIDs.forEach(groupID => {
        const issueCounts = [];
        const groupPackageIDs = Object.keys(groupDetails.groups[groupID]);
        groupPackageIDs.forEach(packageID => {
          const testIDs = Object.keys(groupDetails.groups[groupID][packageID]);
          const issueCountSum = testIDs.reduce((sum, current) => sum + current.issueCount, 0);
          issueCounts.push(issueCountSum);
        });
        issueCounts.sort((a, b) => b - a);
        const groupScore = groupWeights[groupID] * (
          absolute + largest * issueCounts[0] + smaller * issueCounts.slice(1).reduce(
            (sum, current) => sum + current, 0
          )
        );
        summary.groups[groupID] = groupScore;
        summary.total += groupScore;
      });
      // Get the solo scores and add them to the summary.
      const issueSoloPackageIDs = Object.keys(groupDetails.solos);
      issueSoloPackageIDs.forEach(packageID => {
        const testIDs = Object.keys(groupDetails.solos[packageID]);
        testIDs.forEach(testID => {
          const issueCount = groupDetails.solos[packageID][testID];
          const issueScore = soloWeight * issueCount;
          summary.solos += issueScore;
          summary.total += issueScore;
        });
      });
    }
  }
  // Get the log score.
  logScore = Math.floor(
    logWeights.count * report.logCount
    + logWeights.size * report.logSize
    + logWeights.prohibited * report.prohibitedCount
    + logWeights.visitTimeout * report.visitTimeoutCount
    + logWeights.visitRejection * report.visitRejectionCount
  );
  summary.log = logScore;
  summary.total += logScore;
  // Add the score facts to the report.
  report.score = {
    scoreProcID,
    logWeights,
    groupWeights,
    soloWeight,
    countWeights,
    preventionWeights,
    packageDetails,
    groupDetails,
    preventionScores,
    summary
  };
};
