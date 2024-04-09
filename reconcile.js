/*
  reconcile.js
  Creates a reconciliation report from a scored report.
  Arguments:
    0. Reconciling function.
    1. Scored report.
*/

// ########## FUNCTIONS

// Reconciles the tools in the scored report and returns a reconciliation report.
exports.reconcile = async (reconciler, report) => {
  // Create a reconciliation report.
  const reconciliation = await reconciler(report);
  console.log(`Report ${report.id} tools reconciled`);
  // Return the reconciliation report.
  return reconciliation;
};
