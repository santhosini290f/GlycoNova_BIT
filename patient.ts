export interface LabBiomarkers {
  hba1c: number; // % (e.g. 7.8%)
  fastingGlucose: number; // mg/dL
  postprandialGlucose: number; // mg/dL
  totalCholesterol: number; // mg/dL
  ldlCholesterol: number; // mg/dL
  hdlCholesterol: number; // mg/dL
  triglycerides: number; // mg/dL
  serumCreatinine: number; // mg/dL
  egfr: number; // mL/min/1.73m2
  hsCrp: number; // mg/L (inflammatory marker)
  microalbuminuria: number; // mg/g
  lastUpdated: string;
}

export interface Medication {
  id: string;
  name: string;
  category: 'Metabolic/Anti-diabetic' | 'Antihypertensive' | 'Lipid-lowering' | 'Antiplatelet';
  dosage: string;
  frequency: string;
  adherenceRate: number; // 0 - 100%
  impactDescription: string;
}

export interface MedicalCondition {
  code: string; // ICD-10
  name: string;
  diagnosedYear: number;
  severity: 'Mild' | 'Moderate' | 'Severe' | 'Elevated';
  icd10: string;
}

export interface PatientProfile {
  id: string;
  name: string;
  age: number;
  gender: 'Male' | 'Female' | 'Other';
  ethnicity: string;
  occupation: string;
  location: string;
  heightCm: number;
  weightKg: number;
  bmi: number;
  smokingStatus: 'Never' | 'Former' | 'Current';
  familyHistoryCvd: boolean;
  familyHistoryDiabetes: boolean;
  phenotype: string;
  clinicalSummary: string;
  conditions: MedicalCondition[];
  medications: Medication[];
  labs: LabBiomarkers;
  avatarSeed: string;
}
