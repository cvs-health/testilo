/*
  spA11yMessage
  Testilo score proc a11yMessage

  Computes scores from Testaro script a11yMessage and adds them to a report.
  Usage examples:
    node score a11yMessage 35k1r
    node score a11yMessage

  This proc computes a score that is intended to represent how accessibly a web page offers
    a user an opportunity to report an accessibility issue about that page. Scores can range
    from perfect 0 to 16.
*/

// CONSTANTS

// ID of this proc.
const scoreProcID = 'a11ymessage';

// FUNCTIONS

// Scores the contact links of a type.
const contactScorer = (result, score, type) => {
  const links = result.items;
  if (links.some(
    link => link.textContent.toLowerCase().includes('accessibility')
  )) {
    score[type] -= 3;
  }
  else if (links.some(
    link => link.parentTextContent.toLowerCase().includes('accessibility')
  )) {
    score[type] -= 2;
  }
};
// Scores a report.
exports.scorer = async report => {
  const {acts} = report;
  report.scoreProcID = scoreProcID;
  report.score = {
    page: 3,
    a11yLink: 4,
    title: 3,
    heading: 3,
    mailLink: 3,
    telLink: 3
  };
  const {score} = report;
  if (Array.isArray(acts)) {
    // Act 1: page loads.
    if (acts[1].result.startsWith('http')) {
      score.page -= 2;
      if (acts[1].endTime - acts[1].startTime < 2500) {
        score.page -= 1;
      }
      // Act 2: accessibility link exists and loads promptly.
      const {result} = acts[2];
        // If a link with text content including accessibility was found:
        if (result.found) {
        score.a11yLink -= 2;
        // If it was clickable and the resulting load finished:
        if (result.success) {
          score.a11yLink -= 1;
          // If the navigation and load took less than 1.5 seconds:
          if (acts[2].endTime - acts[2].startTime < 1500) {
            score.a11yLink -= 1;
          }
          // Act 3: next page has an accessibility title.
          let {result} = acts[3];
          if (result && result.toLowerCase().includes('accessibility')) {
            score.title -= 3;
          }
          // Act 4: page has 1 h1 heading, and it is about accessibility.
          result = acts[4].result;
          if (result && result.total === 1) {
            score.heading -= 1;
            if (result.items[0].textContent.toLowerCase().includes('accessibility')) {
              score.heading -= 2;
            }
          }
          // Act 5: page has an accessibility email link.
          result = acts[5].result;
          if (result.total) {
            contactScorer(result, score, 'mailLink');
          }
          // Act 6: page has accessibility telephone link.
          result = acts[6].result;
          if (result.total) {
            contactScorer(result, score, 'telLink');
          }
        }
      }
    }
  }
  score.total = score.page
  + score.a11yLink
  + score.title
  + score.heading
  + score.mailLink
  + score.telLink;
};
