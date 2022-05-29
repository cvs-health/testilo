  // If logs are to be scored, do so.
  const scoreTables = report.acts.filter(act => act.type === 'score');
  if (scoreTables.length) {
    const scoreTable = scoreTables[0];
    const {result} = scoreTable;
    if (result) {
      const {logWeights, scores} = result;
      if (logWeights && scores) {
        scores.log = Math.floor(
          logWeights.count * logCount
          + logWeights.size * logSize
          + logWeights.prohibited * prohibitedCount
          + logWeights.visitTimeout * visitTimeoutCount
          + logWeights.visitRejection * visitRejectionCount
        );
        scores.total += scores.log;
      }
    }
  }
