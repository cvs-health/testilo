/*
  batch.js
  Converts a target list to a batch.
*/

// IMPORTS

const {alphaNumOf} = require('./procs/util');

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
    targetList.forEach((target, index) => {
      // Add it to the batch.
      batch.targets.push({
        id: alphaNumOf(index),
        what: target[0],
        which: target[1],
        acts: {
          main: [
            {
              type: 'launch',
              what: target[0],
              url: target[1]
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
    console.log('ERROR: Information for batch creation missing or invalid');
    return null;
  }
};
