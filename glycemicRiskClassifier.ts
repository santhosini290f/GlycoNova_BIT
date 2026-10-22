import { CgmReading, BloodPressureReading } from '../types/sensors';
import { ShortTermExcursionPrediction } from '../types/prediction';

/**
 * AI/ML Predictor for Real-Time 2-Hour Adverse Excursions:
 * - Hypoglycemia Risk (<70 mg/dL)
 * - Hyperglycemic Excursion Risk (>220 mg/dL)
 * - Nocturnal Hypoglycemia Risk
 * - Acute Hypertensive Surge (SBP > 160 mmHg)
 */
export function predictShortTermRisks(
  cgm: CgmReading,
  bp: BloodPressureReading,
  stressLevel: number,
  recentCarbsGrams: number,
  hasActiveWalk: boolean
): ShortTermExcursionPrediction {
  const currentGlucose = cgm.glucose;
  const roc = cgm.rateOfChange; // mg/dL per minute

  // Linear + momentum extrapolated 2-hour projection
  const projectedSlope = roc * 60; // 1-hour projected change
  const carbImpact = (recentCarbsGrams * 1.5) * (hasActiveWalk ? 0.6 : 1.0);
  const exerciseClearance = hasActiveWalk ? -35 : 0;

  const estimatedTwoHourGlucose = Math.max(
    50,
    Math.min(400, currentGlucose + projectedSlope * 1.4 + carbImpact + exerciseClearance)
  );

  // Hypoglycemia risk probability model (logistic approximation)
  // High risk if glucose is falling rapidly and currently < 90 mg/dL
  let hypoLogit = -3.5;
  if (currentGlucose < 90) hypoLogit += 2.0;
  if (currentGlucose < 80) hypoLogit += 2.8;
  if (roc < -1.0) hypoLogit += 2.2;
  if (roc < -2.0) hypoLogit += 3.5;
  if (hasActiveWalk && currentGlucose < 100) hypoLogit += 1.2;
  const hypoRisk = Number((1 / (1 + Math.exp(-hypoLogit))).toFixed(2));

  // Hyperglycemia risk (>220 mg/dL)
  let hyperLogit = -2.8;
  if (currentGlucose > 160) hyperLogit += 1.8;
  if (currentGlucose > 190) hyperLogit += 2.9;
  if (roc > 1.2) hyperLogit += 2.0;
  if (recentCarbsGrams > 45 && !hasActiveWalk) hyperLogit += 2.5;
  const hyperRisk = Number((1 / (1 + Math.exp(-hyperLogit))).toFixed(2));

  // Hypertensive surge risk (SBP > 160)
  let bpLogit = -3.2;
  if (bp.systolic >= 145) bpLogit += 2.6;
  if (bp.systolic >= 155) bpLogit += 3.8;
  if (stressLevel > 65) bpLogit += 1.8;
  const bpSurgeRisk = Number((1 / (1 + Math.exp(-bpLogit))).toFixed(2));

  // Projected peak
  const peakTimeMinutes = roc > 0.5 ? 45 : 30;
  const peakGlucose = Math.round(
    roc > 0 ? Math.max(currentGlucose, currentGlucose + carbImpact * 0.8) : currentGlucose
  );

  return {
    hypoglycemiaTwoHourRisk: hypoRisk,
    hyperglycemiaTwoHourRisk: hyperRisk,
    nocturnalHypoRisk: Number((hypoRisk * 0.75).toFixed(2)),
    hypertensiveSurgeRisk: bpSurgeRisk,
    projectedPeakGlucose: peakGlucose,
    projectedPeakTimeMinutes: peakTimeMinutes,
    forecastConfidenceInterval: {
      upperBoundGlucose: Math.round(estimatedTwoHourGlucose * 1.12),
      lowerBoundGlucose: Math.round(estimatedTwoHourGlucose * 0.88),
    },
  };
}
