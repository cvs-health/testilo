/*
  index: digester for scoring procedure spA11yMessage.
  Creator of parameters for substitution into index.html.
  Usage example for selected files in REPORTDIR_SCORED: node digest dpA11yMessage 35k1r
  Usage example for all files in REPORTDIR_SCORED: node digest dpA11yMessage
*/

// CONSTANTS

  // Newlines with indentations.
  const joiner = '\n      ';
  const innerJoiner = '\n        ';

// FUNCTIONS

// Makes strings HTML-safe.
const htmlEscape = textOrNumber => textOrNumber
.toString()
.replace(/&/g, '&amp;')
.replace(/</g, '&lt;');
// Gets a row of the score-summary table.
const getScoreRow = (component, score) => `<tr><th>${component}</th><td>${score}</td></tr>`;
// Adds parameters to a query for a digest.
exports.makeQuery = (report, query) => {
  // Add an HTML-safe copy of the host report to the query to be appended to the digest.
  const {script, host, score} = report;
  const reportJSON = JSON.stringify(report, null, 2);
  const reportJSONSafe = htmlEscape(reportJSON);
  query.report = reportJSONSafe;
  // Add the job data to the query.
  query.dateISO = report.endTime.slice(0, 10);
  query.dateSlash = query.dateISO.replace(/-/g, '/');
  if (host && host.what && host.which) {
    query.org = host.what;
    query.url = host.which;
  }
  else {
    const firstURLCommand = script.commands.find(command => command.type === 'url');
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
  // Add the total to the query.
  const scoreRows = [getScoreRow('total', summary(['total']))];
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
