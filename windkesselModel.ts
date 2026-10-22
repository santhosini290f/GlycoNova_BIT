/**
 * Physiological Digital Twin Engine: Two-Element Windkessel Cardiovascular Model
 * Simulates arterial compliance (C), systemic vascular resistance (R), stroke volume, and heart rate
 * to dynamically forecast Blood Pressure (Systolic / Diastolic / MAP) and pulse pressure.
 */

export interface HemodynamicParameters {
  arterialCompliance: number; // C in mL/mmHg (healthy ~ 1.2 - 1.5, stiff/atherosclerotic ~ 0.7 - 0.9)
  vascularResistance: number; // R in mmHg*min/L (peripheral resistance)
  strokeVolume: number; // SV in mL (typically 70-85 mL)
  baselineHeartRate: number; // BPM
}

export interface BloodPressureResult {
  systolic: number; // mmHg
  diastolic: number; // mmHg
  map: number; // Mean Arterial Pressure
  pulsePressure: number; // SBP - DBP
  hypertensionCategory: 'Normal' | 'Elevated' | 'Stage 1' | 'Stage 2' | 'Hypertensive Crisis';
}

/**
 * Calculates instantaneous arterial blood pressure components
 */
export function calculateHemodynamics(
  params: HemodynamicParameters,
  currentHeartRate: number,
  stressLevel: number, // 0 - 100
  sodiumExcessFactor: number = 1.0, // 1.0 = normal, 1.3 = high salt meal
  hasAceInhibitor: boolean = false
): BloodPressureResult {
  const { strokeVolume, baselineHeartRate } = params;
  let { arterialCompliance, vascularResistance } = params;

  // Stress elevates sympathetic tone -> vasoconstriction (raises R)
  const stressMultiplier = 1.0 + (stressLevel / 100) * 0.25;
  vascularResistance = vascularResistance * stressMultiplier * sodiumExcessFactor;

  // ACEi / ARB medication reduces peripheral vasoconstriction
  if (hasAceInhibitor) {
    vascularResistance *= 0.82;
  }

  // Cardiac Output CO (L/min) = (SV in mL / 1000) * HR
  const cardiacOutput = (strokeVolume / 1000.0) * currentHeartRate;

  // Mean Arterial Pressure MAP = CO * R (mmHg)
  const map = Math.max(65, Math.min(180, cardiacOutput * vascularResistance));

  // Pulse Pressure PP ≈ Stroke Volume / Arterial Compliance
  const pulsePressure = Math.max(30, Math.min(100, strokeVolume / arterialCompliance));

  // Systolic BP ≈ MAP + (2/3) * PP  or  SBP ≈ MAP + 0.6 * PP
  // Diastolic BP ≈ MAP - (1/3) * PP
  const systolic = Math.round(map + (2.0 / 3.0) * pulsePressure);
  const diastolic = Math.round(map - (1.0 / 3.0) * pulsePressure);

  let hypertensionCategory: BloodPressureResult['hypertensionCategory'] = 'Normal';
  if (systolic >= 180 || diastolic >= 120) {
    hypertensionCategory = 'Hypertensive Crisis';
  } else if (systolic >= 140 || diastolic >= 90) {
    hypertensionCategory = 'Stage 2';
  } else if (systolic >= 130 || diastolic >= 80) {
    hypertensionCategory = 'Stage 1';
  } else if (systolic >= 120 && diastolic < 80) {
    hypertensionCategory = 'Elevated';
  }

  return {
    systolic,
    diastolic,
    map: Math.round(map),
    pulsePressure: Math.round(pulsePressure),
    hypertensionCategory,
  };
}

/**
 * Projects 4-hour forward blood pressure trajectory under baseline vs lifestyle/medical interventions
 */
export function simulateBloodPressureProjection(
  baselineBp: { systolic: number; diastolic: number },
  currentStress: number,
  hasSodiumReduction: boolean,
  hasMedicationAdherence: boolean,
  hasPostMealWalking: boolean,
  projectionMinutes: number = 240
): {
  baselineBpCurve: { minute: number; systolic: number; diastolic: number }[];
  interventionBpCurve: { minute: number; systolic: number; diastolic: number }[];
} {
  const baselineBpCurve: { minute: number; systolic: number; diastolic: number }[] = [];
  const interventionBpCurve: { minute: number; systolic: number; diastolic: number }[] = [];

  const baseParams: HemodynamicParameters = {
    arterialCompliance: 0.85, // Typical stiffened diabetic artery
    vascularResistance: 19.5,
    strokeVolume: 74,
    baselineHeartRate: 78,
  };

  for (let m = 0; m <= projectionMinutes; m += 10) {
    // Circadian and post-meal modest variation
    const circadianSbpDrift = Math.sin((m / 240) * Math.PI) * 4;

    const baseResult = calculateHemodynamics(
      baseParams,
      76 + Math.round(circadianSbpDrift),
      currentStress,
      1.15, // standard high-sodium baseline
      false
    );

    // Intervention reduces sodium, adds ACEi adherence, and walking lowers post-exercise vascular resistance
    const walkingBonus = hasPostMealWalking && m >= 30 ? 0.90 : 1.0;
    const interventionParams: HemodynamicParameters = {
      ...baseParams,
      arterialCompliance: hasMedicationAdherence ? 0.98 : 0.85,
      vascularResistance: baseParams.vascularResistance * walkingBonus,
    };

    const interventionResult = calculateHemodynamics(
      interventionParams,
      72,
      hasPostMealWalking ? Math.max(15, currentStress - 20) : currentStress,
      hasSodiumReduction ? 0.95 : 1.15,
      hasMedicationAdherence
    );

    baselineBpCurve.push({
      minute: m,
      systolic: baseResult.systolic,
      diastolic: baseResult.diastolic,
    });

    interventionBpCurve.push({
      minute: m,
      systolic: interventionResult.systolic,
      diastolic: interventionResult.diastolic,
    });
  }

  return { baselineBpCurve, interventionBpCurve };
}
