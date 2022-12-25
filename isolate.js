/*
  isolate.js
  Module for isolating tests.
*/

// ########## CONSTANTS

// Tests from which following tests require isolation.
const contaminantNames = new Set([
  'axe',
  'continuum',
  'focAll',
  'focInd',
  'focOp',
  'hover',
  'htmlcs',
  'ibm',
  'menuNav',
  'textNodes',
  'wave'
]);

// ########## FUNCTION

// Injects acts into an array of acts after each contaminant.
exports.inject = (acts, injector) => {
  // Initialize the expanded array of acts.
  const expandedActs = [];
  let actIndex = 0;
  // For each act:
  for (const act of acts) {
    // Append it to the expanded array.
    expandedActs.push(act);
    // If the act is not the last one and is a contaminant:
    if (actIndex++ < acts.length && act.type === 'test' && contaminantNames.includes(act.which)) {
      // Append the injector to the expanded array.
      expandedActs.push(... injector);
    }
  }
  // Return the expanded array.
  return expandedActs;
};