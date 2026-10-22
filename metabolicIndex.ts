import { CgmReading, BloodPressureReading, AutonomicVitals, ActivityVitals } from '../types/sensors';
import { ResilienceScore } from '../types/prediction';

/**
 * Calculates a composite Metabolic Resilience Score (0 - 100)
 * Evaluates physiological homeostatic reserve across 3 functional axes:
 * 1. Glycemic Stability (Time-in-Range %, Glycemic Variability CV %)
 * 2. Cardiovascular Vigor (Mean Arterial Pressure, Pulse Pressure, Resting Heart Rate)
 * 3. Autonomic Tone (HRV RMSSD, Sleep Quality, Physical METs)
 */
export function calculateResilienceScore(
  cgm: CgmReading,
  bp: BloodPressureReading,
  autonomic: AutonomicVitals,
  activity: ActivityVitals
): ResilienceScore {
  // Axis 1: Glycemic Stability (Weight: 35%)
  // Ideal: TIR > 70%, CV < 33%, current glucose 70-140 mg/dL
  let glycemicScore = 0;
  glycemicScore += Math.min(50, (cgm.timeInRange / 100) * 50);
  glycemicScore += Math.max(0, 30 - Math.max(0, cgm.glycemicVariabilityCV - 28) * 1.5);
  if (cgm.glucose >= 80 && cgm.glucose <= 140) {
    glycemicScore += 20;
  } else if (cgm.glucose >= 70 && cgm.glucose <= 180) {
    glycemicScore += 12;
  } else {
    glycemicScore += 4;
  }
  const glycemicStabilityScore = Math.min(100, Math.max(10, Math.round(glycemicScore)));

  // Axis 2: Cardiovascular Vigor (Weight: 35%)
  // Ideal: SBP 110-120, DBP 70-80, PP 35-45 mmHg, Resting HR 60-70 bpm
  let cvScore = 100;
  if (bp.systolic > 120) cvScore -= (bp.systolic - 120) * 1.2;
  if (bp.systolic < 95) cvScore -= (95 - bp.systolic) * 1.5;
  if (bp.diastolic > 80) cvScore -= (bp.diastolic - 80) * 1.0;
  if (bp.pulsePressure > 50) cvScore -= (bp.pulsePressure - 50) * 0.8;
  if (autonomic.heartRate > 85) cvScore -= (autonomic.heartRate - 85) * 0.7;
  const cardiovascularVigorScore = Math.min(100, Math.max(15, Math.round(cvScore)));

  // Axis 3: Autonomic Recovery (Weight: 30%)
  // Ideal: HRV RMSSD > 45 ms, Sleep > 7h, Steps > 6000
  let autonomicScore = 0;
  autonomicScore += Math.min(45, (autonomic.hrvRmssd / 50) * 45);
  autonomicScore += Math.min(30, (activity.sleepHours / 7.5) * 30);
  autonomicScore += Math.min(25, (activity.stepsToday / 8000) * 25);
  const autonomicRecoveryScore = Math.min(100, Math.max(15, Math.round(autonomicScore)));

  // Composite Weighted Sum
  const composite = Math.round(
    glycemicStabilityScore * 0.35 +
    cardiovascularVigorScore * 0.35 +
    autonomicRecoveryScore * 0.30
  );

  let status: ResilienceScore['status'] = 'Optimal Resilience';
  if (composite < 40) {
    status = 'Critical Dysregulation';
  } else if (composite < 60) {
    status = 'Fragile Homeostasis';
  } else if (composite < 80) {
    status = 'Moderate Resilience';
  }

  return {
    compositeScore: composite,
    glycemicStabilityScore,
    cardiovascularVigorScore,
    autonomicRecoveryScore,
    status,
  };
}
