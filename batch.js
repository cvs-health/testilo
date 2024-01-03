/*
  batch.js
  Converts a target list to a batch.
*/

// IMPORTS

const {alphaNumOf} = require('./procs/util');

// FUNCTIONS

// Converts a target list to a batch and returns the batch.
exports.batch = (what, targetList) => {
  // If the arguments are valid:
  if (
    typeof id === 'string'
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
        id: ,
        which: target[1],
        what: target[0],
        acts: {
          main: [
            {
              type: 'launch',
              url: target[1],
              what: target[0]
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
    return null;
  }
};
