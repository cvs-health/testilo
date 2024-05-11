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
  batch.js
  Converts a target list to a batch.
*/

// FUNCTIONS

// Converts a target list to a batch and returns the batch.
exports.batch = (id, what, targetList) => {
  // If the arguments are valid:
  if (
    typeof id === 'string'
    && id.length
    && typeof what === 'string'
    && what.length
    && Array.isArray(targetList)
    && targetList.length
    && targetList.every(
      target => Array.isArray(target)
      && target.length === 2
      && target.every(item => typeof item === 'string')
    )
  ) {
    // Initialize the batch.
    const batch = {
      id,
      what,
      targets: []
    };
    // For each target:
    targetList.forEach(target => {
      // Add it to the batch.
      batch.targets.push({
        what: target[0],
        url: target[1],
        actGroups: {
          main: [
            {
              type: 'launch'
            }
          ]
        }
      });
    });
    // Return the batch.
    return batch;
  }
  // Otherwise, i.e. if the arguments are invalid:
  else {
    // Return this.
    console.log(`ERROR: Information for ${id || 'ID-less'} batch creation missing or invalid`);
    return null;
  }
};
