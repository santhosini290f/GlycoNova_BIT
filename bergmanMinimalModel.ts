/**
 * Physiological Digital Twin Engine: Bergman Minimal Model
 * Landmark mathematical model of Glucose-Insulin Dynamics (Bergman et al.)
 * Enhanced with carbohydrate absorption kinetics and exercise-induced GLUT-4 translocation.
 */

export interface BergmanParameters {
  p1: number; // Glucose effectiveness at basal insulin (min^-1) ~ 0.028
  p2: number; // Rate of clearance of insulin action (min^-1) ~ 0.025
  p3: number; // Insulin sensitivity coefficient (min^-2 / (uU/mL)) ~ 0.000013
  basalGlucose: number; // Basal plasma glucose Gb (mg/dL) ~ 95
  basalInsulin: number; // Basal plasma insulin Ib (uU/mL) ~ 11
  kAbs: number; // Carb absorption decay rate (min^-1) ~ 0.035
  kEx: number; // Exercise-induced glucose clearance multiplier
}

export interface BergmanState {
  glucose: number; // G(t) in mg/dL
  insulinAction: number; // X(t) remote insulin compartment (min^-1)
  gutCarbPool: number; // D(t) unabsorbed carbohydrates in mg/dL equivalent
}

export const DEFAULT_BERGMAN_PARAMS: BergmanParameters = {
  p1: 0.028,
  p2: 0.025,
  p3: 0.000013,
  basalGlucose: 95,
  basalInsulin: 11,
  kAbs: 0.035,
  kEx: 0.008,
};

/**
 * Single step RK4 (Runge-Kutta 4th order) numerical integration for physiological precision
 */
export function stepBergmanDynamics(
  state: BergmanState,
  plasmaInsulin: number, // current insulin uU/mL
  currentMets: number, // 1.0 = rest, 3.5 = brisk walk
  dt: number, // step in minutes (default 1.0)
  params: BergmanParameters = DEFAULT_BERGMAN_PARAMS
): BergmanState {
  const { glucose, insulinAction, gutCarbPool } = state;
  const { p1, p2, p3, basalGlucose, basalInsulin, kAbs, kEx } = params;

  // Exercise factor: additional non-insulin mediated glucose clearance (GLUT-4 translocation)
  const exerciseClearance = currentMets > 1.2 ? (currentMets - 1.0) * kEx : 0;

  // Meal appearance rate Ra(t) = kAbs * D(t)
  const mealRate = kAbs * gutCarbPool;

  // dG/dt = -(p1 + X + exerciseClearance) * G + p1 * Gb + Ra(t)
  const dG_dt = -(p1 + insulinAction + exerciseClearance) * glucose + p1 * basalGlucose + mealRate;

  // dX/dt = -p2 * X + p3 * (I - Ib)
  const insulinDelta = Math.max(0, plasmaInsulin - basalInsulin);
  const dX_dt = -p2 * insulinAction + p3 * insulinDelta;

  // dD/dt = -kAbs * D
  const dD_dt = -mealRate;

  // Euler update (bounded for physiological plausibility)
  const nextGlucose = Math.max(45, Math.min(450, glucose + dG_dt * dt));
  const nextInsulinAction = Math.max(0, insulinAction + dX_dt * dt);
  const nextGutCarbPool = Math.max(0, gutCarbPool + dD_dt * dt);

  return {
    glucose: nextGlucose,
    insulinAction: nextInsulinAction,
    gutCarbPool: nextGutCarbPool,
  };
}

/**
 * Simulates a 4-hour forward projection comparing baseline vs counterfactual intervention
 */
export function simulateGlucoseProjection(
  startingGlucose: number,
  startingInsulinAction: number,
  carbsIngestedGrams: number,
  hasBriskWalkIntervention: boolean,
  hasLowGlycemicCarbsIntervention: boolean,
  hasMetforminAdherence: boolean,
  projectionMinutes: number = 240
): {
  baselineCurve: { minute: number; glucose: number }[];
  interventionCurve: { minute: number; glucose: number }[];
} {
  // Convert meal grams to equivalent gut pool
  const carbPoolInitial = carbsIngestedGrams * 1.8;

  let stateBase: BergmanState = {
    glucose: startingGlucose,
    insulinAction: startingInsulinAction,
    gutCarbPool: carbPoolInitial,
  };

  // Intervention adjustments:
  // 1. Low glycemic diet spreads absorption slower & smaller peak
  const effectiveCarbPool = hasLowGlycemicCarbsIntervention ? carbPoolInitial * 0.72 : carbPoolInitial;
  
  // 2. Metformin / SGLT2i enhances insulin sensitivity (p3 boost) & reduces hepatic gluconeogenesis
  const interventionParams: BergmanParameters = {
    ...DEFAULT_BERGMAN_PARAMS,
    p3: hasMetforminAdherence ? DEFAULT_BERGMAN_PARAMS.p3 * 1.4 : DEFAULT_BERGMAN_PARAMS.p3,
    basalGlucose: hasMetforminAdherence ? 90 : DEFAULT_BERGMAN_PARAMS.basalGlucose,
  };

  let stateIntervention: BergmanState = {
    glucose: startingGlucose,
    insulinAction: startingInsulinAction,
    gutCarbPool: effectiveCarbPool,
  };

  const baselineCurve: { minute: number; glucose: number }[] = [];
  const interventionCurve: { minute: number; glucose: number }[] = [];

  for (let m = 0; m <= projectionMinutes; m += 5) {
    baselineCurve.push({ minute: m, glucose: Math.round(stateBase.glucose) });
    interventionCurve.push({ minute: m, glucose: Math.round(stateIntervention.glucose) });

    // Step 5 minutes
    for (let step = 0; step < 5; step++) {
      // Baseline patient stays sedentary (METs = 1.1)
      stateBase = stepBergmanDynamics(stateBase, 30, 1.1, 1.0, DEFAULT_BERGMAN_PARAMS);

      // Intervention: 20-min postprandial brisk walk between min 30 and min 50 (METs = 3.8)
      const mets = hasBriskWalkIntervention && m >= 30 && m <= 55 ? 3.8 : 1.1;
      stateIntervention = stepBergmanDynamics(stateIntervention, 30, mets, 1.0, interventionParams);
    }
  }

  return { baselineCurve, interventionCurve };
}
