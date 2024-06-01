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

// script: sorts issue summary.

const sortButton = document.getElementById('sortButton');
const sortBasisSpan = document.getElementById('sortBasis');
const sumBody = document.getElementById('sumBody');
const rows = Array.from(sumBody.children);
const sortRowsBy = basis => {
  if (basis === 'wcag') {
    rows.sort((a, b) => {
      const sorters = [a, b].map(row => {
        const wcagParts = row.children[1].textContent.split('.');
        const wcagNums = wcagParts.map(part => Number.parseInt(part, 10));
        return 100 * (wcagNums[0] || 0) + 20 * (wcagNums[1] || 0) + (wcag[2] || 0);
      });
      return sorters[0] - sorters[1];
    });
  }
  else if (basis === 'score') {
    rows.sort((a, b) => {
      const sorters = [a, b].map(row => Number.parseInt(row.children[2].textContent));
      return sorters[0] - sorters[1];
    });
  }
  sumBody.textContent = '';
  rows.forEach(row => {
    sumBody.appendChild(row);
  });
};
sortButton.addEventListener('click', event => {
  // Determine the current sorting basis.
  const oldBasis = sortBasisSpan.textContent;
  sortRowsBy(oldBasis === 'wcag' ? 'score' : 'wcag');
});
