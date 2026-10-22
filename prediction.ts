export interface FeatureAttribution {
  featureName: string;
  source: 'EHR' | 'WEARABLE' | 'LIFESTYLE' | 'GENETICS';
  value: string;
  shapWeight: number; // -1.0 to +1.0 (positive pushes risk higher)
  clinicalRationale: string;
}

export interface AscvdRiskPrediction {
  tenYearRiskPercent: number; // e.g. 19.8%
  fiveYearRiskPercent: number; // e.g. 10.2%
  riskCategory: 'Low (<5%)' | 'Borderline (5-7.4%)' | 'Intermediate (7.5-19.9%)' | 'High (≥20%)';
  southAsianRiskMultiplier: number; // 1.4x factor based on INTERHEART / MASALA studies
  optimizedRiskWithInterventions: number; // e.g. 9.4%
  relativeRiskReduction: number; // e.g. 52% reduction
  primaryDrivers: FeatureAttribution[];
}

export interface ShortTermExcursionPrediction {
  hypoglycemiaTwoHourRisk: number; // 0 - 1.0 (<70 mg/dL)
  hyperglycemiaTwoHourRisk: number; // 0 - 1.0 (>220 mg/dL)
  nocturnalHypoRisk: number; // 0 - 1.0
  hypertensiveSurgeRisk: number; // 0 - 1.0 (SBP > 160 mmHg)
  projectedPeakGlucose: number; // mg/dL
  projectedPeakTimeMinutes: number; // minutes from now
  forecastConfidenceInterval: {
    upperBoundGlucose: number;
    lowerBoundGlucose: number;
  };
}

export interface ResilienceScore {
  compositeScore: number; // 0 - 100
  glycemicStabilityScore: number; // 0 - 100
  cardiovascularVigorScore: number; // 0 - 100
  autonomicRecoveryScore: number; // 0 - 100
  status: 'Critical Dysregulation' | 'Fragile Homeostasis' | 'Moderate Resilience' | 'Optimal Resilience';
}

export interface ClinicalRecommendation {
  id: string;
  priority: 'EMERGENCY' | 'HIGH' | 'MODERATE' | 'LIFESTYLE_OPTIMIZATION';
  category: 'DIET' | 'ACTIVITY' | 'MEDICATION' | 'MONITORING';
  title: string;
  actionText: string;
  clinicalGuidelineRef: string; // e.g. 'ADA Standards of Care 2024 (Section 10)', 'ICMR Guidelines for T2D'
  expectedOutcome: string;
}
