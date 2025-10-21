// Entropy Weight Method for 2 criteria: urgences (cost) and coverage (benefit)
// Inputs: array of { taux_urgences, taux_couverture }
// Returns: { weights: { urg: w1, cov: w2 }, scores: number[] } in [0,1]

function minMax(arr) {
  const min = Math.min(...arr);
  const max = Math.max(...arr);
  if (max === min) return arr.map(() => 0.5);
  return arr.map((v) => (v - min) / (max - min));
}

function entropyWeights(columns) {
  // columns: array of arrays (each is a criterion, normalized to [0,1])
  // Convert to positive distributions and compute entropy for each
  const n = columns[0].length;
  const k = 1 / Math.log(n);
  const entropies = columns.map((col) => {
    const sum = col.reduce((a, b) => a + (b <= 0 ? 0 : b), 0) || 1;
    const p = col.map((v) => (v <= 0 ? 0 : v / sum));
    const H = -k * p.reduce((acc, pi) => (pi > 0 ? acc + pi * Math.log(pi) : acc), 0);
    // bound entropy [0,1]
    return Math.min(1, Math.max(0, H));
  });
  const d = entropies.map((H) => 1 - H);
  const dsum = d.reduce((a, b) => a + b, 0) || 1;
  const weights = d.map((x) => x / dsum);
  return { entropies, weights };
}

export function computeEWM(data) {
  // cost criterion: urgences high is worse → use normalized urgences directly
  const urg = data.map((d) => Number(d.taux_urgences) || 0);
  const cov = data.map((d) => Number(d.taux_couverture) || 0);

  const urgN = minMax(urg); // [0..1]
  const covN = minMax(cov); // [0..1]
  const covGap = covN.map((v) => 1 - v); // lack of coverage as cost

  const { weights } = entropyWeights([urgN, covGap]);
  const wUrg = weights[0];
  const wCovGap = weights[1];

  const scores = urgN.map((u, i) => wUrg * u + wCovGap * covGap[i]);
  return {
    weights: { urg: wUrg, cov_gap: wCovGap },
    scores,
  };
}

export function withCoverageDelta(data, deltaPct) {
  // deltaPct (e.g., +10) increases coverage by absolute points capped 0..100
  return data.map((d) => ({
    ...d,
    taux_couverture: Math.max(0, Math.min(100, (Number(d.taux_couverture) || 0) + (deltaPct || 0))),
  }));
}

