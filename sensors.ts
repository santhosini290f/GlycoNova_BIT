export type TrendDirection = 'FLAT' | 'UP_SLOW' | 'UP_FAST' | 'DOWN_SLOW' | 'DOWN_FAST';

export interface CgmReading {
  glucose: number; // mg/dL
  timestamp: string;
  trend: TrendDirection;
  rateOfChange: number; // mg/dL per minute
  sensorStatus: 'OK' | 'CALIBRATING' | 'SENSOR_EXPIRING';
  timeInRange: number; // % (70-180 mg/dL)
  timeAboveRange: number; // % (>180 mg/dL)
  timeBelowRange: number; // % (<70 mg/dL)
  glycemicVariabilityCV: number; // Coefficient of Variation %
}

export interface BloodPressureReading {
  systolic: number; // mmHg
  diastolic: number; // mmHg
  meanArterialPressure: number; // mmHg = (SBP + 2*DBP)/3
  pulsePressure: number; // SBP - DBP
  hypertensionStage: 'Normal' | 'Elevated' | 'Stage 1' | 'Stage 2' | 'Hypertensive Crisis';
  measurementMethod: 'ABPM (24h Oscillometric)' | 'Continuous Photoplethysmography Estimator';
  timestamp: string;
}

export interface AutonomicVitals {
  heartRate: number; // BPM
  restingHeartRate: number; // BPM
  hrvRmssd: number; // ms (Autonomic vagal tone)
  respiratoryRate: number; // breaths/min
  spo2: number; // %
  perfusionIndex: number;
}

export interface ActivityVitals {
  stepsToday: number;
  currentMets: number; // Metabolic Equivalent of Task (1.0 = resting, 3.5 = walking)
  activeEnergyBurnedKcal: number;
  sedentaryMinutes: number;
  sleepHours: number;
  sleepEfficiencyPercent: number;
  stressScore: number; // 0 - 100
}

export interface MultiModalSensorSnapshot {
  timestamp: string;
  minuteOffset: number;
  cgm: CgmReading;
  bp: BloodPressureReading;
  autonomic: AutonomicVitals;
  activity: ActivityVitals;
}
