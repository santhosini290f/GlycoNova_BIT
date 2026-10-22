import { MultiModalSensorSnapshot } from './sensors';

export interface InterventionOption {
  id: string;
  name: string;
  category: 'Physical Activity' | 'Nutrition' | 'Pharmacotherapy' | 'Stress/Behavioral';
  description: string;
  clinicalImpactSummary: string;
  enabled: boolean;
  glucoseDeltaPercent: number; // e.g. -25%
  systolicBpDeltaMmHg: number; // e.g. -12 mmHg
  insulinSensitivityBoost: number; // multiplier e.g. 1.25x
  hrvBoostMs: number; // +8 ms
}

export interface PhysiologicalInternalState {
  plasmaGlucose: number; // mg/dL
  insulinRemoteAction: number; // X(t) in Bergman model (min^-1)
  mealAbsorptionRate: number; // D(t) mg/(dL*min)
  arterialCompliance: number; // C in Windkessel model (mL/mmHg)
  systemicVascularResistance: number; // SVR in Windkessel model (dyn*s/cm5)
  sympatheticTone: number; // 0 - 1.0 (Stress / Autonomic arousal)
}

export interface TrajectoryPoint {
  timeLabel: string;
  minuteOffset: number;
  actualOrSimulated: 'HISTORICAL' | 'CURRENT' | 'BASELINE_FORECAST' | 'TWIN_INTERVENTION_FORECAST';
  glucose: number;
  systolicBp: number;
  diastolicBp: number;
  heartRate: number;
  targetGlucoseMax: number;
  targetGlucoseMin: number;
  targetBpMax: number;
}

export interface SimulationState {
  isPlaying: boolean;
  speedMultiplier: number; // 1, 5, 15, 60
  currentMinuteIndex: number; // 0 - 1440 (24h stream)
  currentSnapshot: MultiModalSensorSnapshot;
  historyTimeline: MultiModalSensorSnapshot[];
  forecastTimeline: TrajectoryPoint[];
  interventions: InterventionOption[];
}
