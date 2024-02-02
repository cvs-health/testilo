/*
  index: digester for scoring procedure spA11yMessage.
  Creator of parameters for substitution into index.html.
  Usage example for selected files in REPORTDIR/scored: node digest dpA11yMessage 35k1r
  Usage example for all files in REPORTDIR/scored: node digest dpA11yMessage
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
    if (score.searchInput === 0) {
      suggestions.push(['searchInput', 'Add a search input to the page.']);
    }
    else {
      if (score.searchType === 0) {
        suggestions.push(['searchType', 'Give the search input the attribute <code>type="search"</code>.']);
      }
      if (score.searchWork === 0) {
        suggestions.push(
          ['searchWork', 'Make it possible to submit a search query by pressing the Enter key.']
        );
      }
      else {
        if (score.searchFast === 0) {
          suggestions.push(['searchFast', 'Make search queries produce results faster.']);
        }
        if (score.nameInPage === 0) {
          suggestions.push([
            'nameInPage',
            'Make the page after a product search contain the full name of the product.'
          ])
        }
        else if (score.nameInNode === 0) {
          suggestions.push([
            'nameInNode',
            'Make the text content of an element on the product page be exactly the full name of the product.'
          ]);
        }
        else if (score.nameProp === 0) {
          suggestions.push(
            [
              'nameProp',
              'Give the product-name element the attribute <code>itemprop="name"</code>.'
            ]
          );
        }
        if (score.price === 0) {
          suggestions.push(['price', 'Place a price onto the product page.']);
        }
        else if (score.priceProximity < 4) {
          suggestions.push(['priceProximity', 'Make the price element share a parent with the product-name element and give the price element the attribute <code>itemprop="price"</code>.']);
        }
      }
    }
  }
  query.suggestions = suggestions
  .map(pair => `<li><code>${pair[0]}</code>: ${pair[1]}</li>`)
  .join(innerJoiner);
};
