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
  issues.js
  Analyzes issue scores in an array of score properties of scored reports.
*/

// Returns a tabulation of the total scores of issues reported by tools in scored reports.
exports.issues = (what, reportScores) => {
  const tally = {};
  reportScores.forEach(reportScore => {
    Object.keys(reportScore.details.issue).forEach(issueName => {
      tally[issueName] ??= 0;
      tally[issueName] += reportScore.details.issue[issueName].score;
    });
  });
  const scores = [];
  Object.keys(tally).forEach(issueName => {
    scores.push([issueName, tally[issueName]]);
  });
  scores.sort((a, b) => b[1] - a[1]);
  return {
    what,
    scores
  };
};
