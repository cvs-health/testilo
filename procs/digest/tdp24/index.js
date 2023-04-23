/*
  index: digester for scoring procedure tsp24.
  Creator of parameters for substitution into index.html.
*/

// CONSTANTS

  // Newlines with indentations.
  const joiner = '\n      ';
  const innerJoiner = '\n        ';
  const specialMessages = {
    log: 'This is based on the amount of browser error logging and miscellaneous logging during the tests.',
    preventions: 'This is based on tests that the page did not allow to be run. That impedes accessibility progress and risks interfering with tools that users with disabilities need.',
    solos: 'This is based on issues reported by unclassified tests. Details are in the report.'
  };

// FUNCTIONS

// Makes strings HTML-safe.
const htmlEscape = textOrNumber => textOrNumber
.toString()
.replace(/&/g, '&amp;')
.replace(/</g, '&lt;');
// Gets a row of the score-summary table.
const getScoreRow = (component, score) => `<tr><th>${component}</th><td>${score}</td></tr>`;
// Gets the start of a paragraph about a special score.
const getSpecialPStart = (summary, scoreID) =>
`<p><span class="componentID">${scoreID}</span>: Score ${summary[scoreID]}.`;
// Adds parameters to a query for a digest.
exports.makeQuery = (report, query) => {
  // Add an HTML-safe copy of the report to the query to be appended to the digest.
  const {acts, sources, jobData, score} = report;
  const {target, requester} = sources;
  const reportJSON = JSON.stringify(report, null, 2);
  const reportJSONSafe = htmlEscape(reportJSON);
  query.report = reportJSONSafe;
  query.ts = 'ts24';
  query.sp = 'tsp24';
  query.dp = 'tdp24';
  // Add the job data to the query.
  query.dateISO = jobData.endTime.slice(0, 10);
  query.dateSlash = query.dateISO.replace(/-/g, '/');
  query.org = target.what;
  query.url = acts && acts.length > 1 && acts[1].which;
  query.requester = requester;
  const {issueDetails, summary} = score;
  const {total, issues} = summary;
  if (typeof total === 'number') {
    query.totalScore = total;
  }
  else {
    console.log('ERROR: missing or invalid total score');
    return;
  }
  // Add the total and any special rows of the score-summary table to the query.
  const scoreRows = [];
  const specialComponentIDs = ['log', 'preventions', 'solos'];
  ['total'].concat(specialComponentIDs).forEach(item => {
    if (summary[item]) {
      scoreRows.push(getScoreRow(item, summary[item]));
    }
  });
  // Add the group rows of the score-summary table to the query.
  issues.forEach(issue => {
    scoreRows.push(getScoreRow(`${issue.issueName}`, issue.score));
  });
  query.scoreRows = scoreRows.join(innerJoiner);
  // If the score has any special components:
  const scoredSpecialIDs = specialComponentIDs.filter(item => summary[item]);
  if (scoredSpecialIDs.length) {
    // Add paragraphs about them for the issue summary to the query.
    const specialPs = [];
    scoredSpecialIDs.forEach(id => {
      specialPs.push(`${getSpecialPStart(summary, id)} ${specialMessages[id]}`);
    });
    query.specialSummary = specialPs.join(joiner);
  }
  // Otherwise, i.e. if the score has no special components:
  else {
    // Add a paragraph stating this for the issue summary to the query.
    query.specialSummary = '<p>No special issues contributed to the score.</p>'
  }
  // If the score has any classified issues as components:
  if (issues.length) {
    // Add paragraphs about them for the group summary to the query.
    const issueSummaryItems = [];
    issues.forEach(issue => {
      const {issueName, score} = issue;
      const issueHeading = `<h4>Issue ${issueName}</h4>`;
      const wcagP = `<p>WCAG: ${issueDetails.issues[issueName].wcag || 'N/A'}</p>`;
      const scoreP = `<p>Score: ${score}</p>`;
      const issueIntroP = '<p>Issue reports in this category:</p>';
      const issueListItems = [];
      const issueData = issueDetails.issues[issueName];
      const toolIDs = Object.keys(issueData.tools);
      toolIDs.forEach(toolID => {
        const testIDs = Object.keys(issueData.tools[toolID]);
        testIDs.forEach(testID => {
          const testData = issueData.tools[toolID][testID];
          const {score, what} = testData;
          const listItem =
            `<li>Package <code>${toolID}</code>, test <code>${testID}</code>, score ${score} (${what})</li>`;
          issueListItems.push(listItem);
        });
      });
      const issueList = [
        '<ul>',
        issueListItems.join('\n  '),
        '</ul>'
      ].join(joiner);
      issueSummaryItems.push(issueHeading, wcagP, scoreP, issueIntroP, issueList);
    });
    query.issueSummary = issueSummaryItems.join(joiner);
  }
  // Otherwise, i.e. if the score has no classified issues as components:
  else {
    // Add a paragraph stating this for the issue summary to the query.
    query.issueSummary = '<p>No classified issues contributed to the score.</p>'
  }
};