/*
  batch.js
  Converts a target list to a batch.
  Arguments:
    0. batch ID
    1. batch description
    2. target list
*/

// ########## FUNCTIONS

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
      target => Array.isArray(target) && target.every(item => typeof item === string && item.length)
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
        id: target[0],
        what: target[1],
        acts: {
          main: [
            {
              type: 'launch'
            },
            {
              type: 'url',
              which: target[2],
              what: target[1]
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
