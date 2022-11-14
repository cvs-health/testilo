/*
  index: digester for scoring procedure sp16c.
  Creator of parameters for substitution into index.html.
  Usage example for selected files in REPORTDIR_SCORED: node digest dp16b 35k1r
  Usage example for all files in REPORTDIR_SCORED: node digest dp16b
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
  // Add an HTML-safe copy of the host report to the query to be appended to the digest.
  const {job, host, score} = report;
  const reportJSON = JSON.stringify(report, null, 2);
  const reportJSONSafe = htmlEscape(reportJSON);
  query.report = reportJSONSafe;
  // Add the job data to the query.
  query.dateISO = report.jobData.endTime.slice(0, 10);
  query.dateSlash = query.dateISO.replace(/-/g, '/');
  if (host && host.what && host.which) {
    query.org = host.what;
    query.url = host.which;
  }
  else {
    const firstURLCommand = job.commands.find(command => command.type === 'url');
    if (firstURLCommand && firstURLCommand.what && firstURLCommand.which) {
      query.org = firstURLCommand.what;
      query.url = firstURLCommand.which;
    }
    else {
      console.log('ERROR: host missing or invalid');
      return;
    }
  }
  const {groupDetails, summary} = score;
  const {total, groups} = summary;
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
  groups.forEach(group => {
    scoreRows.push(getScoreRow(`${group.groupName}`, group.score));
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
  if (groups.length) {
    // Add paragraphs about them for the special summary to the query.
    const groupSummaryItems = [];
    groups.forEach(group => {
      const {groupName, score} = group;
      const groupP = `<p><span class="componentID">${groupName}</span>: Score ${score}. Issues reported by tests in this category:</p>`;
      const groupListItems = [];
      const groupData = groupDetails.groups[groupName];
      const packageIDs = Object.keys(groupData);
      packageIDs.forEach(packageID => {
        const testIDs = Object.keys(groupData[packageID]);
        testIDs.forEach(testID => {
          const testData = groupData[packageID][testID];
          const {score, what} = testData;
          const listItem = `<li>Package <code>${packageID}</code>, test <code>${testID}</code>, score ${score} (${what})</li>`;
          groupListItems.push(listItem);
        });
      });
      const groupList = [
        '<ul>',
        groupListItems.join('\n  '),
        '</ul>'
      ].join(joiner);
      groupSummaryItems.push(groupP, groupList);
    });
    query.groupSummary = groupSummaryItems.join(joiner);
  }
  // Otherwise, i.e. if the score has no classified issues as components:
  else {
    // Add a paragraph stating this for the group summary to the query.
    query.groupSummary = '<p>No classified issues contributed to the score.</p>'
  }
};
