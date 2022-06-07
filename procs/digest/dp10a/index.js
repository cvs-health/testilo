/*
  index: digester for scoring procedure sp10.
  Creator of parameters for substitution into index.html.
  Usage example: node digest 35k1r-railpass dp10a
*/
exports.makeQuery = (report, query) => {
  // Makes strings HTML-safe.
  const htmlEscape = textOrNumber => textOrNumber
  .toString()
  .replace(/&/g, '&amp;')
  .replace(/</g, '&lt;');
  // Newlines with indentations.
  const joiner = '\n      ';
  const innerJoiner = '\n        ';
  // Create an HTML identification of the host report.
  const {script, host, score} = report;
  const reportJSON = JSON.stringify(report, null, 2);
  const reportJSONSafe = reportJSON
  .replace(/</g, '&lt;')
  .replace(/&/g, '&amp;');
  query.report = reportJSONSafe;
  // Creates a packaged-test success message.
  const packageSucceedText = package =>
    `<p>The page <strong>passed</strong> the <code>${package}</code> test.</p>`;
  // Creates a packaged-test failure message.
  const packageFailText = (score, package, failures) =>
    `<p>The page <strong>did not pass</strong> the <code>${package}</code> test and received a score of ${score} on <code>${package}</code>. The details are in the appended report, in the section starting with <code>"which": "${package}"</code>. There was at least one failure of:</p>${joiner}<ul>${innerJoiner}${failures}${joiner}</ul>`;
  // Creates a custom-test success message.
  const customSucceedText =
    test => `<p>The page <strong>passed</strong> the <code>${test}</code> test.</p>`;
  // Creates a custom-test failure message.
  const customFailText = (score, test) =>
    `<p>The page <strong>did not pass</strong> the <code>${test}</code> test and received a score of ${score} on <code>${test}</code>. The details are in the appended report, in the section starting with <code>"which": "${test}"</code>.</p>`;
  // Creates a test unperformability message.
  const testCrashText = (score, test) => `<p>The <code>${test}</code> test could not be performed. The page received an inferred score of ${score} on <code>${test}</code>.</p>`;
  // Creates the HTML items in a list of a custom test’s failures.
  const customFailures = failObj => Object
  .entries(failObj)
  .map(entry => `<li>${entry[0]}: ${entry[1]}</li>`)
  .join(innerJoiner);
  // Creates an HTML summary of the details of a custom test’s failures.
  const customFailMore = failures =>
    `<p>Summary of the details:</p>${joiner}<ul>${innerJoiner}${failures}${joiner}</ul>`;
  // Creates a combined HTML summary of a custom test’s failure result.
  const customResult = (score, test, failures) =>
    `${customFailText(score, test)}${joiner}${customFailMore(failures)}`;
  // Returns the act of a test.
  const actOf = testName => {
    const matches = report.acts.filter(act => act.type === 'test' && act.which === testName);
    if (matches.length) {
      return matches[0];
    }
    else {
      return null;
    }
  };
  // Add the job data to the query.
  query.dateISO = report.endTime.slice(0, 10);
  query.dateSlash = query.dateISO.replace(/-/g, '/');
  if (host) {
    query.org = host.what;
    query.url = host.which;
  }
  else {
    const firstURLCommand = script.commands.find(command => command.type === 'url');
    query.org = firstURLCommand.what;
    query.url = firstURLCommand.which;
  }
  const {inferences, scores} = score;
  query.totalScore = scores.total;
  // Create rows of an HTML table of net scores.
  const netScores = Object.assign({}, scores, inferences);
  const scoreSources = Object.keys(netScores);
  query.scoreRows = scoreSources
  .sort((a, b) => netScores[b] - netScores[a])
  .map(source => `<tr><th>${source}</th><td>${netScores[source]}</td></tr>`)
  .join(innerJoiner);
  // Get package-test result messages.
  // aatt
  if (scores.aatt) {
    const testAct = actOf('aatt');
    const aattWarnings = new Set(testAct.result.filter(item => item.type === 'warning')
    .map(item => `warning: ${item.msg}`));
    const aattErrors = new Set(testAct.result.filter(item => item.type === 'error')
    .map(item => `error: ${item.msg}`));
    const aattBoth = Array.from(aattWarnings).concat(Array.from(aattErrors));
    const aattIssues = aattBoth.map(item => `<li>${htmlEscape(item)}</li>`).join(innerJoiner);
    query.aattResult = packageFailText(scores.aatt, 'aatt', aattIssues);
  }
  else if (inferences.aatt) {
    query.aattResult = testCrashText(inferences.aatt, 'aatt');
  }
  else {
    query.aattResult = packageSucceedText('aatt');
  }
  // alfa
  if (scores.alfa) {
    const testAct = actOf('alfa');
    const alfaWarnings = new Set(testAct.result.filter(item => item.verdict === 'cantTell')
    .map(item => `warning: ${item.rule.ruleSummary}`));
    const alfaErrors = new Set(testAct.result.filter(item => item.verdict === 'failed')
    .map(item => `error: ${item.rule.ruleSummary}`));
    const alfaBoth = Array.from(alfaWarnings).concat(Array.from(alfaErrors));
    const alfaIssues = alfaBoth.map(item => `<li>${htmlEscape(item)}</li>`).join(innerJoiner);
    query.alfaResult = packageFailText(scores.alfa, 'alfa', alfaIssues);
  }
  else if (inferences.alfa) {
    query.alfaResult = testCrashText(inferences.alfa, 'alfa');
  }
  else {
    query.alfaResult = packageSucceedText('alfa');
  }
  // axe
  if (scores.axe) {
    const testAct = actOf('axe');
    const axeFailures = testAct.result.items.map(
      item => `<li>${item.rule}: ${htmlEscape(item.description)}</li>`
    ).join(innerJoiner);
    query.axeResult = packageFailText(scores.axe, 'axe', axeFailures);
  }
  else if (inferences.axe) {
    query.axeResult = testCrashText(inferences.axe, 'axe');
  }
  else {
    query.axeResult = packageSucceedText('axe');
  }
  // ibm
  if (scores.ibm) {
    const testAct = actOf('ibm');
    const {result} = testAct;
    const contentItems = result.content.items;
    const urlItems = result.url.items;
    const items = [];
    if (contentItems) {
      items.push(...contentItems);
    }
    if (urlItems) {
      items.push(...urlItems);
    }
    const ibmFailures = Array.from(new Set(items.map(
      item => `<li>${item.ruleId}: ${htmlEscape(item.message)}</li>`
    )).values()).join(innerJoiner);
    query.ibmResult = packageFailText(scores.ibm, 'ibm', ibmFailures);
  }
  else if (inferences.ibm) {
    query.ibmResult = testCrashText(inferences.ibm, 'ibm');
  }
  else {
    query.ibmResult = packageSucceedText('ibm');
  }
  // tenon
  if (scores.tenon) {
    const testAct = actOf('tenon');
    const tenonResult = testAct.result.data.resultSet;
    const tenonSet = new Set(tenonResult.map(result => result.errorTitle));
    const tenonItems = Array.from(tenonSet).map(item => `<li>${item}</li>`);
    const tenonFailures = tenonItems.join(innerJoiner);
    query.tenonResult = packageFailText(scores.tenon, 'tenon', tenonFailures);
  }
  else if (inferences.tenon) {
    query.tenonResult = testCrashText(inferences.tenon, 'tenon');
  }
  else {
    query.tenonResult = packageSucceedText('tenon');
  }
  // wave
  if (scores.wave) {
    const testAct = actOf('wave');
    const waveResult = testAct.result.categories;
    const waveItems = [];
    ['error', 'contrast', 'alert'].forEach(category => {
      waveItems.push(
        ... Object
        .entries(waveResult[category].items)
        .map(entry => `<li>${category}/${entry[0]}: ${entry[1].description}</li>`)
      );
    });
    const waveFailures = waveItems.join(innerJoiner);
    query.waveResult = packageFailText(scores.wave, 'wave', waveFailures);
  }
  else if (inferences.wave) {
    query.waveResult = testCrashText(inferences.wave, 'wave');
  }
  else {
    query.waveResult = packageSucceedText('wave');
  }
  // Get custom-test result messages.
  if (scores.bulk) {
    const testAct = actOf('bulk');
    query.bulkResult = `The page <strong>did not pass</strong> the <code>bulk</code> test. The count of visible elements in the page was ${testAct.result.visibleElements}, resulting in a score of ${scores.bulk} on <code>bulk</code>.`;
  }
  else if (inferences.bulk) {
    query.bulkResult = testCrashText(inferences.bulk, 'bulk');
  }
  else {
    query.bulkResult = customSucceedText('bulk');
  }
  if (scores.embAc) {
    const testAct = actOf('embAc');
    const failures = customFailures(testAct.result.totals);
    query.embAcResult = customResult(scores.embAc, 'embAc', failures);
  }
  else if (inferences.embAc) {
    query.embAcResult = testCrashText(inferences.ebmAc, 'ebmAc');
  }
  else {
    query.embAcResult = customSucceedText('embAc');
  }
  if (scores.focAll) {
    const testAct = actOf('focAll');
    const failures = customFailures(testAct.result);
    query.focAllResult = customResult(scores.focAll, 'focAll', failures);
  }
  else if (inferences.focAll) {
    query.focAllResult = testCrashText(inferences.focAll, 'focAll');
  }
  else {
    query.focAllResult = customSucceedText('focAll');
  }
  if (scores.focInd) {
    const testAct = actOf('focInd');
    const failSource = testAct.result.totals.types;
    const failObj = {
      indicatorMissing: failSource.indicatorMissing.total,
      nonOutlinePresent: failSource.nonOutlinePresent.total
    };
    const failures = customFailures(failObj);
    query.focIndResult = customResult(scores.focInd, 'focInd', failures);
  }
  else if (inferences.focInd) {
    query.focIndResult = testCrashText(inferences.focInd, 'focInd');
  }
  else {
    query.focIndResult = customSucceedText('focInd');
  }
  if (scores.focOp) {
    const testAct = actOf('focOp');
    const failSource = testAct.result.totals.types;
    const failObj = {
      onlyFocusable: failSource.onlyFocusable.total,
      onlyOperable: failSource.onlyOperable.total
    };
    const failures = customFailures(failObj);
    query.focOpResult = customResult(scores.focOp, 'focOp', failures);
  }
  else if (inferences.focOp) {
    query.focOpResult = testCrashText(inferences.focOp, 'focOp');
  }
  else {
    query.focOpResult = customSucceedText('focOp');
  }
  if (scores.hover) {
    const testAct = actOf('hover');
    const failures = customFailures(testAct.result.totals);
    query.hoverResult = customResult(scores.hover, 'hover', failures);
  }
  else if (inferences.hover) {
    query.hoverResult = testCrashText(inferences.hover, 'hover');
  }
  else {
    query.hoverResult = customSucceedText('hover');
  }
  if (scores.labClash) {
    const testAct = actOf('labClash');
    const {totals} = testAct.result;
    delete totals.wellLabeled;
    const failures = customFailures(totals);
    query.labClashResult = customResult(scores.labClash, 'labClash', failures);
  }
  else if (inferences.labClash) {
    query.labClashResult = testCrashText(inferences.labClash, 'labClash');
  }
  else {
    query.labClashResult = customSucceedText('labClash');
  }
  if (scores.linkUl) {
    const testAct = actOf('linkUl');
    const failures = customFailures(testAct.result.totals.inline);
    query.linkUlResult = customResult(scores.linkUl, 'linkUl', failures);
  }
  else if (inferences.linkUl) {
    query.linkUlResult = testCrashText(inferences.linkUl, 'linkUl');
  }
  else {
    query.linkUlResult = customSucceedText('linkUl');
  }
  if (scores.log) {
    const {logCount, logSize, visitRejectionCount, prohibitedCount, visitTimeoutCount} = report;
    const logData = {logCount, logSize, visitRejectionCount, prohibitedCount, visitTimeoutCount};
    const failures = customFailures(logData);
    query.logResult = customResult(scores.log, 'log', failures);
  }
  else if (inferences.log) {
    query.logResult = testCrashText(inferences.log, 'log');
  }
  else {
    query.logResult = customSucceedText('log');
  }
  if (scores.menuNav) {
    const testAct = actOf('menuNav');
    const failSource = testAct.result.totals;
    const failObj = {
      navigations: failSource.navigations.all.incorrect,
      menuItems: failSource.menuItems.incorrect,
      menus: failSource.menus.incorrect
    };
    const failures = customFailures(failObj);
    query.menuNavResult = customResult(scores.menuNav, 'menuNav', failures);
  }
  else if (inferences.menuNav) {
    query.menuNavResult = testCrashText(inferences.menuNav, 'menuNav');
  }
  else {
    query.menuNavResult = customSucceedText('menuNav');
  }
  if (scores.motion) {
    const testAct = actOf('motion');
    const {result} = testAct;
    result.bytes = result.bytes.join(', ');
    result.localRatios = result.localRatios.join(', ');
    result.pixelChanges = result.pixelChanges.join(', ');
    const failures = customFailures(result);
    query.motionResult = customResult(scores.motion, 'motion', failures);
  }
  else if (inferences.motion) {
    query.motionResult = testCrashText(inferences.motion, 'motion');
  }
  else {
    query.motionResult = customSucceedText('motion');
  }
  if (scores.radioSet) {
    const testAct = actOf('radioSet');
    const failures = customFailures(testAct.result.totals);
    query.radioSetResult = customResult(scores.radioSet, 'radioSet', failures);
  }
  else if (inferences.radioSet) {
    query.radioSetResult = testCrashText(inferences.radioSet, 'radioSet');
  }
  else {
    query.radioSetResult = customSucceedText('radioSet');
  }
  if (scores.role) {
    const testAct = actOf('role');
    const {result} = testAct;
    delete result.tagNames;
    const failures = customFailures(result);
    query.roleResult = customResult(scores.role, 'role', failures);
  }
  else if (inferences.role) {
    query.roleResult = testCrashText(inferences.role, 'role');
  }
  else {
    query.roleResult = customSucceedText('role');
  }
  if (scores.styleDiff) {
    const testAct = actOf('styleDiff');
    const {totals} = testAct.result;
    const styleCounts = {};
    Object.keys(totals).forEach(key => {
      const data = totals[key];
      const count = data.subtotals ? data.subtotals.length : 1;
      styleCounts[key] = `${count} ${count === 1 ? 'style' : 'different styles'}`;
    });
    const failures = customFailures(styleCounts);
    query.styleDiffResult = customResult(scores.styleDiff, 'styleDiff', failures);
  }
  else if (inferences.styleDiff) {
    query.styleDiffResult = testCrashText(inferences.styleDiff, 'styleDiff');
  }
  else {
    query.roleResult = customSucceedText('role');
  }
  if (scores.tabNav) {
    const testAct = actOf('tabNav');
    const failSource = testAct.result.totals;
    const failObj = {
      navigations: failSource.navigations.all.incorrect,
      tabElements: failSource.tabElements.incorrect,
      tabLists: failSource.tabLists.incorrect
    };
    const failures = customFailures(failObj);
    query.tabNavResult = customResult(scores.tabNav, 'tabNav', failures);
  }
  else if (inferences.tabNav) {
    query.tabNavResult = testCrashText(inferences.tabNav, 'tabNav');
  }
  else {
    query.tabNavResult = customSucceedText('tabNav');
  }
  if (scores.zIndex) {
    const testAct = actOf('zIndex');
    const {tagNames} = testAct.result.totals;
    const failures = customFailures(tagNames);
    query.zIndexResult = customResult(scores.zIndex, 'zIndex', failures);
  }
  else if (inferences.zIndex) {
    query.zIndexResult = testCrashText(inferences.zIndex, 'zIndex');
  }
  else {
    query.zIndexResult = customSucceedText('zIndex');
  }
};
