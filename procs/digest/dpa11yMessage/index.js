/*
  index: digester for scoring procedure spA11yMessage.
  Creator of parameters for substitution into index.html.
  Usage example for selected files in REPORTDIR/scored: node digest dpA11yMessage 35k1r
  Usage example for all files in REPORTDIR/scored: node digest dpA11yMessage
*/

// CONSTANTS

  // Newlines with indentations.
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
  // Add the score data to the query.
  const scoreRows = [];
  Object.keys(score).forEach(scoreName => {
    scoreRows.push(getScoreRow(scoreName, score[scoreName]));
  });
  query.totalScore = score.total;
  query.scoreRows = scoreRows.join(innerJoiner);
  // Add suggestions to the query.
  const suggestions = [];
  if (score.pageLoad === 0) {
    suggestions.push(['pageLoad', 'Make it possible to visit the page.']);
  }
  else {
    if (score.pageFast < 2) {
      suggestions.push(['pageFast', 'Make the page load faster.']);
    }
    if (score.a11yLink === 0) {
      suggestions.push(['a11yLink', 'Add a link named Accessibility to the page.']);
    }
    else {
      if (score.a11yLinkWork === 0) {
        suggestions.push(['a11yLinkWork', 'Make the Accessibility link open a new page.']);
      }
      else {
        if (score.a11yLinkFast < 2) {
          suggestions.push(
            ['a11yLinkFast', 'Make the page opened by the Accessibility link load faster.']
          );
        }
        if (score.a11yPageTitle === 0) {
          suggestions.push(['a11yPageTitle', 'Give the accessibility page a title.']);
        }
        else if (score.a11yTitleGood === 0) {
          suggestions.push(
            ['a11yTitleGood', 'Include accessibility in the title of the accessibility page.']
          )
        }
        if (score.a11yPageH1 === 0) {
          suggestions.push(['a11yPageH1', 'Give the accessibility page a single h1 heading.']);
        }
        else if (score.a11yH1Good === 0) {
          suggestions.push(
            [
              'a11yH1Good',
              'Include accessibility in the text of the h1 heading of the accessibility page.'
            ]
          );
        }
        if (score.mailLink === 0) {
          suggestions.push(['mailLink', 'Add an email (mailto:) link to the accessibility page.']);
        }
        else if (score.mailLinkName === 1) {
          suggestions.push(
            [
              'mailLinkName',
              'Include accessibility not only around, but within, an email link on the accessibility page.'
            ]
          );
        }
        else if (score.mailLinkName === 0) {
          suggestions.push(
            [
              'mailLinkName',
              'Include accessibility in the name of an email link on the accessibility page.'
            ]
          );
        }
        if (score.telLink === 0) {
          suggestions.push(['telLink', 'Add a telephone (tel:) link to the accessibility page.']);
        }
        else if (score.telLinkName === 1) {
          suggestions.push(
            [
              'telLinkName',
              'Include accessibility not only around, but within, a telephone link on the accessibility page.'
            ]
          );
        }
        else if (score.telLinkName === 0) {
          suggestions.push(
            [
              'telLinkName',
              'Include accessibility in the name of a telephone link on the accessibility page.'
            ]
          );
        }
      }
    }
  }
  query.suggestions = suggestions
  .map(pair => `<li><code>${pair[0]}</code>: ${pair[1]}</li>`)
  .join(innerJoiner);
};
