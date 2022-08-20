/*
  spA11yMessage
  Testilo score proc a11yMessage

  Computes scores from Testaro script a11yMessage and adds them to a report.
  Usage examples:
    node score a11yMessage 35k1r
    node score a11yMessage

  This proc computes a score that is intended to represent how accessibly a web page offers
    a user an opportunity to report an accessibility issue about that page. Scores can range
    from 0 to 16.
*/

// CONSTANTS

// ID of this proc.
const scoreProcID = 'a11ymessage';

// FUNCTIONS

// Scores the contact links of a type.
const contactScorer = (result, score, type) => {
  const links = result.items;
  score[type] += 1;
  if (
    links.some(
      link => link.textContent.toLowerCase().includes('accessibility')
    )
  ) {
    score[type] += 2;
  }
  else if (
    links.some(
      link => link.parentTextContent.toLowerCase().includes('accessibility')
    )
  ) {
    score[type] += 1;
  }
};
// Scores a report.
exports.scorer = async report => {
  const {acts} = report;
  report.score = {
    page: 0,
    a11yLink: 0,
    title: 0,
    heading: 0,
    mailLink: 0,
    telLink: 0,
    total: 0
  };
  const {score} = report;
  if (Array.isArray(acts)) {
    // Act 1: page loads.
    if (acts[1].result.startsWith('http')) {
      score.page = 2;
      // Act 2: accessibility link exists and loads promptly.
      if (acts[2].result.move === 'clicked') {
        score.a11yLink = 2;
        const loadScore = ['incomplete', 'loaded', 'idle'].indexOf(acts[2].result.loadState);
        if (loadScore > -1) {
          score.a11yLink += loadScore;
        }
        // Act 3: next page has an accessibility title.
        const act3Result = acts[3].result;
        if (act3Result && act3Result.toLowerCase().includes('accessibility')) {
          score.title = 2;
          // Act 4: page has exactly 1 h1 heading.
          const act4Result = acts[4].result;
          if (act4Result && act4Result.total === 1) {
            score.heading = 1;
            // Act 4: h1 is an accessibility heading.
            if (act4Result.items[0].textContent.toLowerCase().includes('accessibility')) {
              score.heading += 1;
            }
          }
        }
        // Act 5: page has accessibility email and telephone links.
        const act5Result = acts[5].result;
        if (act5Result.total) {
          contactScorer(act5Result, score, 'mailLink');
        }
        // Act 6: page has accessibility email and telephone links.
        const act6Result = acts[6].result;
        if (act6Result.total) {
          contactScorer(act6Result, score, 'telLink');
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
