/*
  scorer
  score validation
*/

// Scores a report.
exports.scorer = report => {
  // If there are any acts in the report:
  const {acts} = report;
  if (Array.isArray(acts)) {
    // Add a score, consisting of the test count.
    const testActs = acts.filter(act => act.type === 'test');
    report.score = {
      testCount: testActs.length
    };
  }
};
