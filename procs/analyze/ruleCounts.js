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
  ruleCounts.js
  Tabulates tool rules from an issue classification.
*/

const {issues} = require('../score/tic45');

const counts = {
  total: 0
};
// For each issue other than ignorable:
Object.keys(issues).filter(issueName => issueName !== 'ignorable').forEach(issueName => {
  // For each tool with any rules of the issue:
  const issue = issues[issueName];
  Object.keys(issue.tools).forEach(toolName => {
    if (! counts[toolName]) {
      counts[toolName] = 0;
    }
    const increment = Object.keys(issue.tools[toolName]).length;
    counts[toolName] += increment;
    counts.total += increment;
  });
});
console.log(JSON.stringify(counts, null, 2));
