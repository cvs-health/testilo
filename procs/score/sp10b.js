/*
  sp10b
  Testilo score proc 10b
  Computes scores from Testaro script tp10 and adds them to a report.
  Usage example: node score 35k1r sp10b
*/
exports.scorer = report => {
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
  // Initialize the score.
  let scores = {
    total: 0,
    log: null
  };
  // VARIABLES
  let facts;
  // If there are any acts:
  if (Array.isArray(acts)) {
    // If any of them are tests:
    const tests = acts.filter(act => act.type === 'test');
    if (tests.length) {
      // OPERATION
      // For each test:
      tests.forEach(test => {
        const {which} = test;
        // Compute its score.
        if (which === 'alfa') {
          facts = test.result;
          if (facts && Array.isArray(facts)) {
            rules.alfa = 'multiply cantTell by 2*, failed by 4* (*discounted); sum';
            scores.alfa = Math.round(facts.reduce((total, issue) => {
              const rawScore = [4, 2][['failed', 'cantTell'].indexOf(issue.verdict)] || 0;
              const divisor = duplications.alfa[issue.rule.ruleID] + 1 || 1;
              return total + rawScore / divisor;
            }, 0));
            scores.total += scores.alfa;
          }
        }
        else if (which === 'aatt') {
          facts = test.result;
          if (facts && Array.isArray(facts)) {
            rules.aatt = 'multiply warning by 2*, error by 4* (*discounted); sum';
            const issues = facts.filter(fact => fact.type);
            scores.aatt = Math.round(issues.reduce((total, issue) => {
              const rawScore = [4, 2][['error', 'warning'].indexOf(issue.type)] || 0;
              const divisor = duplications.aatt[`${issue.type.slice(0, 1)}:${issue.id}`] + 1 || 1;
              return total + rawScore / divisor;
            }, 0));
            scores.total += scores.aatt;
          }
        }
        else if (which === 'axe') {
          facts = test.result && test.result.items;
          if (facts) {
            rules.axe = 'multiply minor by 2*, moderate by 3*, serious by 4*, critical by 5* (*discounted); sum';
            scores.axe = Math.round(facts.reduce((total, item) => {
              const rawScore = item.elements.length * (
                [5, 4, 3, 2][['critical', 'serious', 'moderate', 'minor'].indexOf(item.impact)] || 0
              );
              const divisor = duplications.axe[item.rule] + 1 || 1;
              return total + rawScore / divisor;
            }, 0));
            scores.total += scores.axe;
          }
        }
        else if (which === 'ibm') {
          facts = test.result;
          if (facts && facts.content && facts.url && (facts.content.totals || facts.url.totals)) {
            rules.ibm = 'multiply violations by 4*, recommendations by 2* (*discounted); sum';
            const ibmScores = {
              content: null,
              url: null
            };
            ['content', 'url'].forEach(type => {
              const totals = facts[type].totals;
              if (totals) {
                const items = facts[type].items || [];
                ibmScores[type] = Math.round(items.reduce((total, item) => {
                  const {ruleId, level} = item;
                  const rawScore = [4, 2][['violation', 'recommendation'].indexOf(level)] || 0;
                  const divisor = duplications.ibm[`${level.slice(0, 1)}:${ruleId}`] + 1 || 1;
                  return total + rawScore / divisor;
                }, 0));
              }
            });
            if (ibmScores.content !== null || ibmScores.url !== null) {
              scores.ibm = Math.max(ibmScores.content || 0, ibmScores.url || 0);
              scores.total += scores.ibm;
            }
          }
        }
        else if (which === 'tenon') {
          facts = test.result
          && test.result.data
          && test.result.data.resultSummary
          && test.result.data.resultSummary.issues;
          if (facts) {
            rules.tenon
              = 'multiply warnings by 1, errors by 3; sum';
            const weights = {
              totalErrors: 3,
              totalWarnings: 1
            };
            const tenonScores = {
              totalErrors: 0,
              totalWarnings: 0
            };
            ['totalErrors', 'totalWarnings'].forEach(level => {
              tenonScores[level] = weights[level] * facts[level];
            });
            scores.tenon = tenonScores.totalErrors + tenonScores.totalWarnings;
            scores.total += scores.tenon;
          }
        }
        else if (which === 'wave') {
          facts = test.result && test.result.categories;
          if (facts) {
            rules.wave
              = 'multiply alerts by 2*, contrast errors by 3*, errors by 4* (*discounted); sum';
            const weights = {
              error: 4,
              contrast: 3,
              alert: 2
            };
            const waveScores = {
              error: 0,
              contrast: 0,
              alert: 0
            };
            ['error', 'contrast', 'alert'].forEach(level => {
              const {items} = facts[level];
              waveScores[level] = Math.round(Object.keys(items).reduce((total, ruleID) => {
                const rawScore = items[ruleID].count * weights[level];
                const divisor = duplications.wave[`${level.slice(0, 1)}:${ruleID}`] + 1 || 1;
                return total + rawScore / divisor;
              }, 0));
            });
            scores.wave = waveScores.error + waveScores.contrast + waveScores.alert;
            scores.total += scores.wave;
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
