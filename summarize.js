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
  summarize.js
  Returns a summary of a report.
*/

// ########## IMPORTS

// Module to keep secrets.
require('dotenv').config();

// ########## FUNCTIONS

// Returns a report summary.
exports.summarize = report => {
  const {id, jobData, score, sources, target} = report;
  const foundTarget = target || sources.target;
  const summary = {
    id: id || null,
    url: foundTarget && (foundTarget.url || foundTarget.which) || null,
    targetWhat: foundTarget.what || null,
    endTime: jobData && jobData.endTime || null,
    sources: sources || null,
    score: score && score.summary && score.summary.total || null
  };
  return summary;
};
