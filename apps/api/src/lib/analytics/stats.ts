export function calculateAbStats(
  controlExposures: number,
  controlConversions: number,
  variantExposures: number,
  variantConversions: number
) {
  const p1 = controlConversions / controlExposures;
  const p2 = variantConversions / variantExposures;

  if (controlExposures < 10 || variantExposures < 10) {
    return { significance: 0, lift: 0 };
  }

  const lift = ((p2 - p1) / p1) * 100;

  // Pooled probability
  const pPooled =
    (controlConversions + variantConversions) /
    (controlExposures + variantExposures);

  // Standard Error
  const se = Math.sqrt(
    pPooled * (1 - pPooled) * (1 / controlExposures + 1 / variantExposures)
  );

  // Z-Score
  const zScore = (p2 - p1) / se;

  // Simple approximation of P-Value from Z-Score
  const significance = 1 - 1 / (1 + Math.exp(1.658 * zScore));

  return {
    lift: Number(lift.toFixed(2)),
    significance: Number(significance.toFixed(4)),
    zScore,
  };
}
