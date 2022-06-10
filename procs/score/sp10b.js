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
  buttonNoText: 4,
  childMissing: 3,
  contrast: 3,
  dupID: 2,
  eventKbd: 3,
  fieldSetMissing: 2,
  h1Missing: 1,
  headingEmpty: 2,
  headingStruc: 2,
  htmlLang: 3,
  htmlLangBad: 3,
  iframeNoText: 3,
  imgNoText: 4,
  imgAltRedundant: 1,
  imgInputNoText: 4,
  imgMapAreaNoText: 3,
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
          facts = test.result && test.result.visibleElements;
          if (typeof facts === 'number') {
            rules.bulk = 'subtract 250 from visible elements; make 0 if negative; raise to 0.9th power; multiply by 0.15';
            // Deficit: 15% of the excess, to the 0.9th power, of the element count over 250.
            scores.bulk = Math.floor(0.15 * Math.pow(Math.max(0, facts - 250), 0.9));
          }
          else {
            inferences.bulk = 100;
          }
          increment('bulk');
        }
        else if (which === 'embAc') {
          facts = test.result && test.result.totals;
          if (facts) {
            rules.embAc = 'multiply link- or button-contained links, buttons, inputs, and selects by 3 (discounted)';
            scores.embAc = 3 * (facts.links + facts.buttons + facts.inputs + facts.selects);
          }
          else {
            inferences.embAc = 150;
          }
          increment('embAc');
        }
        else if (which === 'focAll') {
          facts = test.result;
          if (facts && typeof facts === 'object') {
            rules.focAll= 'multiply discrepancy between focusable and focused element counts by 3';
            scores.focAll = 3 * Math.abs(facts.discrepancy);
          }
          else {
            inferences.focAll = 150;
          }
          increment('focAll');
        }
        else if (which === 'focInd') {
          facts = test.result && test.result.totals;
          facts = facts ? facts.types : null;
          if (facts) {
            rules.focInd = 'multiply indicatorless-when-focused elements by 5';
            scores.focInd = 5 * facts.indicatorMissing.total + 3 * facts.nonOutlinePresent.total;
          }
          else {
            inferences.focInd = 150;
          }
          increment('focInd');
        }
        else if (which === 'focOl') {
          facts = test.result && test.result.totals;
          facts = facts ? facts.types : null;
          facts = facts ? facts.outlineMissing : null;
          if (facts) {
            rules.focOl = 'multiply non-outline focus indicators by 3, missing focus indicators by 5; sum';
            scores.focOl = 3 * facts.total;
          }
          else {
            inferences.focOl = 100;
          }
          increment('focOl');
        }
        else if (which === 'focOp') {
          facts = test.result && test.result.totals;
          if (facts) {
            rules.focOp = 'multiply nonfocusable operable elements by 4, nonoperable focusable by 1; sum';
            scores.focOp
              = 4 * facts.types.onlyOperable.total + 1 * facts.types.onlyFocusable.total;
          }
          else {
            inferences.focOp = 150;
          }
          increment('focOp');
        }
        else if (which === 'hover') {
          facts = test.result && test.result.totals;
          if (facts) {
            rules.hover = 'multiply elements changing page on hover by 4, made visible by 2, with directly changed opacity by 0.1, with indirectly changed opacity by 0.2, unhoverable by 2; sum';
            scores.hover
              = 4 * facts.triggers
              + 2 * facts.madeVisible
              + Math.floor(0.1 * facts.opacityChanged)
              + Math.floor(0.2 * facts.opacityAffected)
              + 2 * facts.unhoverables;
          }
          else {
            inferences.hover = 150;
          }
          increment('hover');
        }
        else if (which === 'labClash') {
          facts = test.result && test.result.totals;
          if (facts) {
            rules.labClash = 'multiply conflictually labeled elements by 2, unlabeled elements by 2; sum';
            // Unlabeled elements discounted.
            scores.labClash = 2 * facts.mislabeled + 2 * facts.unlabeled;
          }
          else {
            inferences.labClash = 100;
          }
          increment('labClash');
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
