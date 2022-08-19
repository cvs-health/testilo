/*
  spA11yMessage
  Testilo score proc a11yMessage

  Computes scores from Testaro script a11yMessage and adds them to a report.
  Usage examples:
    node score a11yMessage 35k1r
    node score a11yMessage

  This proc computes a score that is intended to represent how accessibly a web page offers
    a user an opportunity to report an accessibility issue about that page.
*/

// CONSTANTS

// ID of this proc.
const scoreProcID = 'a11ymessage';

// FUNCTIONS

// Scores a report.
exports.scorer = async report => {
  const {acts} = report;
  report.score = {
    scoreProcID,
    total: 0
  };
  const {score} = report;
  if (Array.isArray(acts)) {
    // Act 1: page load.
    if (acts[1].result.startsWith('http')) {
      score.total += 2;
      // Act 2: click an accessibility link.
      if (acts[2].result.move === 'clicked') {
        score.total += 2;
        // Act 4: next page has an accessibility title.
        const act4Result = acts[4].result;
        if (act4Result && act4Result.toLowerCase().includes('accessibility')) {
          score.total += 2;
          // Act 5: page has exactly 1 h1 heading.
          const act5Result = acts[5].result;
          if (act5Result && act5Result.total === 1) {
            score.total += 2;
            // Act 5: h1 is an accessibility heading.
            if (act5Result.items[0].textContent.toLowerCase().includes('accessibility')) {
              score.total += 2;
            }
          }
        }
        // Act 6: page has accessibility email and telephone links.
        const act6Result = acts[6].result;
        if (act6Result.total) {
          const mailLinks = act6Result.items.filter(item => item.attributes.some(
            attribute => attribute.name === 'href' && attribute.value.startsWith('mailto:')
          ));
          const telLinks = act6Result.items.filter(item => item.attributes.some(
            attribute => attribute.name === 'href' && attribute.value.startsWith('tel:')
          ));
          [mailLinks, telLinks].forEach(linkArray => {
            if (linkArray.length) {
              score.total += 2;
              if (linkArray.some(link => link.textContent.toLowerCase().includes('accessibility'))) {
                score.total += 2;
              }
              else if (
                linkArray.some(
                  link => ['before', 'after'].some(
                    side => link.siblings[side].some(
                      sib => sib.text.toLowerCase().includes('accessibility')
                    )
                  )
                )
              ) {
                score.total += 1;
              }
            }
          });
        }
      }
    }
  }
};
