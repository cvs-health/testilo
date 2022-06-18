/*
  index: digester for scoring procedure sp10b.
  Creator of parameters for substitution into index.html.
  Usage example: node digest 35k1r-railpass dp10b
  Arguments:
    0. report. Scored report.
    1. query. Object to which this module will add properties.
*/

// CONSTANTS

  // Newlines with indentations.
  const joiner = '\n      ';
  const innerJoiner = '\n        ';
  const specialMessages = {
    log: 'This is based on the amount of browser logging during the tests. Browsers usually log messages only when pages contain erroneous code.',
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
  if (typeof summary.total === 'number') {
    query.totalScore = summary.total;
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
  const {groups} = summary;
  const groupIDs = Object.keys(groups);
  groupIDs.sort((a, b) => groups[b] - groups[a]);
  groupIDs.forEach(groupID => {
    scoreRows.push(getScoreRow(`${groupID}`, groups[groupID]));
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
  if (groupIDs.length) {
    // Add paragraphs about them for the special summary to the query.
    const groupSummaryItems = [];
    groupIDs.forEach(id => {
      const groupP = `<p><span class="componentID">${id}</span>: Score ${summary.groups[id]}. Issues reported by tests in this category:</p>`;
      const groupListItems = [];
      const groupData = groupDetails.groups[id];
      const packageIDs = Object.keys(groupData);
      packageIDs.forEach(packageID => {
        const testIDs = Object.keys(groupData[packageID]);
        testIDs.forEach(testID => {
          const testData = groupData[packageID][testID];
          const {issueCount} = testData;
          const issueNoun = issueCount !== 1 ? 'issues' : 'issue';
          const listItem = `<li>${issueCount} ${issueNoun} reported by package <code>${packageID}</code>, test <code>${testID}</code> (${testData.what})</li>`;
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
