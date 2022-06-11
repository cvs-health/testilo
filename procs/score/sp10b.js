/*
  sp10b
  Testilo score proc 10b
  Computes scores from Testaro script tp10 and adds them to a report.
  Usage example: node score 35k1r sp10b
*/

// CONSTANTS

const {acts} = report;
// Define the configuration disclosures.
const logWeights = {
  count: 0.5,
  size: 0.01,
  prohibited: 15,
  visitTimeout: 10,
  visitRejection: 10
};
const faultWeights = {
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
  metaBansZoom: 3,
  objNoText: 2,
  parentMissing: 3,
  roleBad: 3,
  roleBadAttr: 3,
  roleMissingAttr: 3,
  selectNoText: 3,
  svgImgNoText: 4,
  title: 3,
  ungrouped: 1
};
const countWeights = {
  first: 2,
  more: 1,
  dup: 0.4
};
const diffStyles = [
  'borderStyle',
  'borderWidth',
  'fontStyle',
  'fontWeight',
  'lineHeight',
  'maxHeight',
  'maxWidth',
  'minHeight',
  'minWidth',
  'opacity',
  'outlineOffset',
  'outlineStyle',
  'outlineWidth',
  'textDecorationLine',
  'textDecorationStyle',
  'textDecorationThickness'
];
const details = {};
const summary = {
  total: 0,
  log: null
};

// Adds to the count of issues of a kind discovered by a test package.
const addDetail = (actWhich, testID, addition = 1) => {
  if (! details[actWhich]) {
    details[actWhich] = {};
  }
  if (! details[actWhich][testID]) {
    details[actWhich][testID] = 0;
  }
  details[actWhich][testID] += addition;
};

exports.scorer = report => {
  // If there are any acts:
  if (Array.isArray(acts)) {
    // If any of them are test acts:
    const tests = acts.filter(act => act.type === 'test');
    if (tests.length) {
      // For each test act:
      tests.forEach(test => {
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
          facts = test.result && test.result.totals;
          facts = facts ? facts.inline : null;
          if (facts) {
            rules.linkUl = 'multiply nonunderlined inline links by 3';
            scores.linkUl = 3 * (facts.total - facts.underlined);
          }
          else {
            inferences.linkUl = 150;
          }
          increment('linkUl');
        }
        else if (which === 'menuNav') {
          facts = test.result && test.result.totals && test.result.totals.navigations;
          if (facts) {
            rules.menuNav = 'multiply Home and End errors by 1 and other key-navigation errors by 3; sum';
            scores.menuNav
              = 3 * facts.all.incorrect
              - 2 * (facts.specific.home.incorrect + facts.specific.end.incorrect);
          }
          else {
            inferences.menuNav = 150;
          }
          increment('menuNav');
        }
        else if (which === 'motion') {
          facts = test.result;
          if (facts && facts.bytes) {
            rules.motion = 'get PNG screenshot sizes (sss); get differing-pixel counts between adjacent PNG screenshots (pd); “sssd” = sss difference ÷ smaller sss - 1; multiply mean adjacent sssd by 5, maximum adjacent sssd by 2, maximum over-all ssd by 1; divide mean pd by 10,000, maximum pd by 25,000; multiply count of non-0 pd by 30; sum';
            scores.motion = Math.floor(
              5 * (facts.meanLocalRatio - 1)
              + 2 * (facts.maxLocalRatio - 1)
              + facts.globalRatio - 1
              + facts.meanPixelChange / 10000
              + facts.maxPixelChange / 25000
              + 30 * facts.changeFrequency
            );
          }
          else {
            inferences.motion = 150;
          }
          increment('motion');
        }
        else if (which === 'radioSet') {
          facts = test.result && test.result.totals;
          if (facts) {
            rules.radioSet = 'multiply radio buttons not in fieldsets with legends and no other-name radio buttons by 2';
            // Defects discounted.
            scores.radioSet = 2 * (facts.total - facts.inSet);
          }
          else {
            inferences.radioSet = 100;
          }
          increment('radioSet');
        }
        else if (which === 'role') {
          facts = test.result && test.result.badRoleElements;
          if (typeof facts === 'number') {
            rules.role = 'multiple role attributes with invalid or native-HTML-equivalent values by 2';
            // Defects discounted.
            scores.role = 2 * facts;
          }
          else {
            inferences.role = 100;
          }
          increment('role');
        }
        else if (which === 'styleDiff') {
          facts = test.result && test.result.totals;
          if (facts) {
            rules.styleDiff = 'for each of element classes block a, inline a, button, h1, h2, h3, h4, h5, and h6, get diffStyles-distinct styles; multiply their count minus 1 by 2; multiply count of elements with non-plurality styles by 0.2; sum';
            // Identify objects having the tag-name totals and style distributions as properties.
            const tagNameCounts = Object.values(facts);
            // Identify an array of pairs of counts of excess styles and nonplurality elements.
            const deficits = tagNameCounts.map(
              item => {
                const subtotals = item.subtotals ? item.subtotals : [item.total];
                return [subtotals.length - 1, item.total - subtotals[0]];
              }
            );
            // Deficit: 2 per excess style + 0.2 per nonplurality element.
            scores.styleDiff = Math.floor(deficits.reduce(
              (total, currentPair) => total + 2 * currentPair[0] + 0.2 * currentPair[1], 0
            ));
          }
          else {
            inferences.styleDiff = 100;
          }
          increment('styleDiff');
        }
        else if (which === 'tabNav') {
          facts = test.result && test.result.totals && test.result.totals.navigations;
          if (facts) {
            rules.tabNav = 'multiply Home and End errors by 1 and other key-navigation errors by 3; sum';
            scores.tabNav
              = 3 * facts.all.incorrect
              - 2 * (facts.specific.home.incorrect + facts.specific.end.incorrect);
          }
          else {
            inferences.tabNav = 150;
          }
          increment('tabNav');
        }
        else if (which === 'zIndex') {
          facts = test.result && test.result.totals;
          if (facts) {
            rules.zIndex = 'multiply non-auto z indexes by 3';
            scores.zIndex = 3 * facts.total;
          }
          else {
            inferences.zIndex = 100;
          }
          increment('zIndex');
        }
      });
      // Compute the inferred scores of prevented package tests and adjust the total score.
      const estimate = (tests, penalty) => {
        const packageScores = tests.map(test => scores[test]).filter(score => score !== null);
        const scoreCount = packageScores.length;
        let meanScore;
        if (scoreCount) {
          meanScore = Math.floor(
            packageScores.reduce((sum, current) => sum + current) / packageScores.length
          );
        }
        else {
          meanScore = 100;
        }
        tests.forEach(test => {
          if (scores[test] === null) {
            inferences[test] = meanScore + penalty;
            scores.total += inferences[test];
          }
        });
      };
      estimate(['alfa', 'aatt', 'axe', 'ibm', 'tenon', 'wave'], 100);
    }
  }
  logScore = Math.floor(
    logWeights.count * report.logCount
    + logWeights.size * report.logSize
    + logWeights.prohibited * report.prohibitedCount
    + logWeights.visitTimeout * report.visitTimeoutCount
    + logWeights.visitRejection * report.visitRejectionCount
  );
  scores.log = logScore;
  scores.total += logScore;
  // Add the score facts to the report.
  report.score = {
    scoreProcID: '',
    duplications,
    rules,
    diffStyles,
    logWeights,
    inferences,
    scores
  };
};
