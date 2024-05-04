/*
  © 2024 CVS Health and/or one of its affiliates. All rights reserved.

  Permission is hereby granted, free of charge, to any person obtaining a copy
  of this software and associated documentation files (the "Software"), to deal
  in the Software without restriction, including without limitation the rights
  to use, copy, modify, merge, publish, distribute, sublicense, and/or sell
  copies of the Software, and to permit persons to whom the Software is
  furnished to do so, subject to the following conditions:

  The above copyright notice and this permission notice shall be included in all
  copies or substantial portions of the Software.

  THE SOFTWARE IS PROVIDED "AS IS", WITHOUT WARRANTY OF ANY KIND, EXPRESS OR
  IMPLIED, INCLUDING BUT NOT LIMITED TO THE WARRANTIES OF MERCHANTABILITY,
  FITNESS FOR A PARTICULAR PURPOSE AND NONINFRINGEMENT. IN NO EVENT SHALL THE
  AUTHORS OR COPYRIGHT HOLDERS BE LIABLE FOR ANY CLAIM, DAMAGES OR OTHER
  LIABILITY, WHETHER IN AN ACTION OF CONTRACT, TORT OR OTHERWISE, ARISING FROM,
  OUT OF OR IN CONNECTION WITH THE SOFTWARE OR THE USE OR OTHER DEALINGS IN THE
  SOFTWARE.
*/

/*
  tspA11yMessage
  Testilo score proc a11yMessage

  Computes scores from Testaro script tpA11yMessage and adds them to a report.
  Usage examples:
    node score spA11yMessage 35k1r
    node score spA11yMessage

  This proc computes a score that is intended to represent how accessibly a web page offers
    a user an opportunity to report an accessibility issue about that page. Scores can range
    from perfect 0 to 23.
*/

// CONSTANTS

// ID of this proc.
const scoreProcID = 'a11ymessage';

// FUNCTIONS

// Scores the contact links of a type.
const contactScorer = (result, score, linkProp, linkNameProp) => {
  score[linkProp] = 2;
  // If any of the links is named for accessibility:
  const links = result.items;
  if (links.some(
    link => link.textContent.toLowerCase().includes('accessibility')
  )) {
    score[linkNameProp] = 2;
  }
  // Otherwise, if the link context refers to accessibility:
  else if (links.some(
    link => link.parentTextContent.toLowerCase().includes('accessibility')
  )) {
    score[linkNameProp] = 1;
  }
};
// Scores a report.
exports.scorer = async report => {
  const {acts} = report;
  report.scoreProcID = scoreProcID;
  report.score = {
    pageLoad: 0,
    pageFast: 0,
    a11yLink: 0,
    a11yLinkWork: 0,
    a11yLinkFast: 0,
    a11yPageTitle: 0,
    a11yTitleGood: 0,
    a11yPageH1: 0,
    a11yH1Good: 0,
    mailLink: 0,
    mailLinkName: 0,
    telLink: 0,
    telLinkName: 0
  };
  const {score} = report;
  if (Array.isArray(acts)) {
    // Act 1: If the page loaded:
    if (acts[1].result.startsWith('http')) {
      score.pageLoad = 2;
      // If it loaded moderately fast:
      const loadTime = acts[1].endTime - acts[1].startTime;
      if (loadTime < 6000) {
        score.pageFast = 1;
      }
      // If it loaded fast:
      if (loadTime < 4000) {
        score.pageFast = 2;
      }
      // Act 2: If the page has an accessibility link:
      const {result} = acts[2];
      if (result.found) {
        score.a11yLink = 1;
        // If it works:
        if (result.success) {
          score.a11yLinkWork = 2;
          // If the resulting page loads fast:
          const loadTime = acts[2].endTime - acts[2].startTime;
          if (loadTime < 5000) {
            score.a11yLinkFast = 1;
          }
          if (loadTime < 3000) {
            score.a11yLinkFast = 2;
          }
          // Act 3: If the resulting page has a title:
          let {result} = acts[3];
          if (result && result.success) {
            score.a11yPageTitle = 1;
            // If it is an accessibility title:
            if (result.title.toLowerCase().includes('accessibility')) {
              score.a11yTitleGood = 2;
            }
          }
          // Act 4: If the resulting page has a top heading:
          result = acts[4].result;
          if (result && result.total === 1) {
            score.a11yPageH1 = 1;
            // If it is an accessibility heading:
            if (result.items[0].textContent.toLowerCase().includes('accessibility')) {
              score.a11yH1Good = 2;
            }
          }
          // Act 5: If the resulting page has an accessibility email link:
          result = acts[5].result;
          if (result.total) {
            contactScorer(result, score, 'mailLink', 'mailLinkName');
          }
          // Act 6: If the resulting page has accessibility telephone link:
          result = acts[6].result;
          if (result.total) {
            contactScorer(result, score, 'telLink', 'telLinkName');
          }
        }
      }
    }
  }
  score.total = Object.values(score).reduce((total, current) => total + current);
};
