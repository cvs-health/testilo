/*
  sp18a
  Testilo score proc 19a

  Computes scores from Testaro script tp19 and adds them to a report.
  Usage examples:
    node score sp19a 35k1r
    node score sp19a
*/

// Scores a report.
exports.scorer = async report => {
  // If there are any acts in the report:
  const {acts} = report;
  if (Array.isArray(acts)) {
    // If any of them are test acts:
    const testActs = acts.filter(act => act.type === 'test');
    if (testActs.length) {
      report.scoreProcID = 'sp19a';
      report.score = 0;
      // For each test act:
      testActs.forEach(test => {
        const {which} = test;
        if (which === 'bulk') {
          const count = test.result && test.result.visibleElements;
          if (typeof count === 'number') {
            // Add 1 to the score per 300 visible elements beyond 300.
            report.score += Math.max(0, count / 300 - 1);
          }
        }
      });
    }
  }
};
