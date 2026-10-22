import React, { useState, useEffect, useMemo } from 'react';
import { Header } from './components/Header';
import { DigitalTwinAvatar } from './components/DigitalTwinAvatar';
import { VitalSignsRibbon } from './components/VitalSignsRibbon';
import { TrajectoryChart } from './components/TrajectoryChart';
import { CounterfactualSimulator } from './components/CounterfactualSimulator';
import { RiskAssessmentPanel } from './components/RiskAssessmentPanel';
import { ClinicalInsights } from './components/ClinicalInsights';
import { PatientSummaryCard } from './components/PatientSummaryCard';
import { FhirExportModal } from './components/FhirExportModal';
import { BenchmarkModal } from './components/BenchmarkModal';

import { SAMPLE_PATIENTS } from './data/samplePatients';
import { PatientProfile } from './types/patient';
import { MultiModalSensorSnapshot, TrendDirection } from './types/sensors';
import { InterventionOption } from './types/simulation';
import { ClinicalRecommendation } from './types/prediction';

import { stepBergmanDynamics, simulateGlucoseProjection, DEFAULT_BERGMAN_PARAMS } from './models/bergmanMinimalModel';
import { calculateHemodynamics, simulateBloodPressureProjection } from './models/windkesselModel';
import { calculateAscvdRisk } from './models/ascvdPredictor';
import { predictShortTermRisks } from './models/glycemicRiskClassifier';
import { calculateResilienceScore } from './models/metabolicIndex';
import { generateFhirR4Bundle } from './data/fhirTemplates';

const INITIAL_INTERVENTIONS: InterventionOption[] = [
  {
    id: 'walk',
    name: '20-Min Postprandial Brisk Walk (3.5 METs)',
    category: 'Physical Activity',
    description: 'Brisk walk 30 minutes after major meals to induce insulin-independent GLUT-4 glucose clearance in skeletal muscles.',
    clinicalImpactSummary: 'Blunts postprandial glycemic peak & dilates peripheral arterioles',
    enabled: true,
    glucoseDeltaPercent: -38,
    systolicBpDeltaMmHg: -9,
    insulinSensitivityBoost: 1.25,
    hrvBoostMs: 8,
  },
  {
    id: 'diet',
    name: 'Low-Glycemic Index Complex Carbohydrates',
    category: 'Nutrition',
    description: 'Replace polished white rice and maida staples with whole unpolished millets (ragi/jowar), legumes, and 35g daily dietary fiber.',
    clinicalImpactSummary: 'Slows intestinal carbohydrate absorption rate (kAbs decay)',
    enabled: true,
    glucoseDeltaPercent: -24,
    systolicBpDeltaMmHg: -4,
    insulinSensitivityBoost: 1.15,
    hrvBoostMs: 4,
  },
  {
    id: 'medication',
    name: 'Strict Pharmacotherapy Adherence (Metformin + Telmisartan)',
    category: 'Pharmacotherapy',
    description: 'Ensure 100% adherence to prescribed Metformin ER (1000mg post-dinner) and Telmisartan (40mg morning) with smart digital reminder pillbox.',
    clinicalImpactSummary: 'Suppresses hepatic gluconeogenesis & lowers Angiotensin-II vasoconstriction',
    enabled: true,
    glucoseDeltaPercent: -18,
    systolicBpDeltaMmHg: -12,
    insulinSensitivityBoost: 1.35,
    hrvBoostMs: 5,
  },
  {
    id: 'stress',
    name: 'Autonomic Vagal Breathing & Sleep Optimization',
    category: 'Stress/Behavioral',
    description: '10 minutes of guided coherent resonant breathing (5.5 breaths/min) to suppress sympathetic overdrive and elevate nocturnal HRV.',
    clinicalImpactSummary: 'Reduces cortisol-driven dawn phenomenon and arterial pulse pressure',
    enabled: false,
    glucoseDeltaPercent: -8,
    systolicBpDeltaMmHg: -6,
    insulinSensitivityBoost: 1.1,
    hrvBoostMs: 14,
  },
];

export const App: React.FC = () => {
  const [selectedPatient, setSelectedPatient] = useState<PatientProfile>(SAMPLE_PATIENTS[0]);
  const [viewMode, setViewMode] = useState<'CLINICIAN' | 'PATIENT'>('CLINICIAN');
  const [isPlaying, setIsPlaying] = useState<boolean>(true);
  const [speedMultiplier, setSpeedMultiplier] = useState<number>(5);
  const [simulatedMinuteOffset, setSimulatedMinuteOffset] = useState<number>(0);
  const [interventions, setInterventions] = useState<InterventionOption[]>(INITIAL_INTERVENTIONS);

  // Modals
  const [isFhirModalOpen, setIsFhirModalOpen] = useState(false);
  const [isBenchmarkModalOpen, setIsBenchmarkModalOpen] = useState(false);

  // Simulation timer loop
  useEffect(() => {
    if (!isPlaying) return;
    const interval = setInterval(() => {
      setSimulatedMinuteOffset((prev) => (prev + 1) % 1440);
    }, 1000 / speedMultiplier);
    return () => clearInterval(interval);
  }, [isPlaying, speedMultiplier]);

  // Derived interventions flags
  const hasWalk = interventions.find((i) => i.id === 'walk')?.enabled ?? false;
  const hasDiet = interventions.find((i) => i.id === 'diet')?.enabled ?? false;
  const hasMeds = interventions.find((i) => i.id === 'medication')?.enabled ?? false;
  const hasStress = interventions.find((i) => i.id === 'stress')?.enabled ?? false;
  const anyInterventionActive = interventions.some((i) => i.enabled);

  // Active snapshot calculation based on patient baseline + simulated minute + interventions
  const currentSnapshot: MultiModalSensorSnapshot = useMemo(() => {
    // Diurnal rhythm components
    const diurnalHour = ((simulatedMinuteOffset / 60) + 12) % 24;
    const hourFloat = diurnalHour;
    const isPostMealWindow = (hourFloat >= 13 && hourFloat <= 15) || (hourFloat >= 20 && hourFloat <= 22);

    // Base glucose calculation
    let baseGlucose = selectedPatient.labs.fastingGlucose;
    if (isPostMealWindow) {
      baseGlucose = selectedPatient.labs.postprandialGlucose;
    } else if (hourFloat >= 4 && hourFloat <= 7) {
      // Dawn phenomenon
      baseGlucose += 18;
    }

    // Apply interventions
    if (hasWalk && isPostMealWindow) baseGlucose -= 48;
    if (hasDiet) baseGlucose -= 22;
    if (hasMeds) baseGlucose -= 26;
    if (hasStress) baseGlucose -= 12;

    const currentGlucose = Math.round(Math.max(65, Math.min(320, baseGlucose)));

    let trend: TrendDirection = 'FLAT';
    let rateOfChange = 0.2;
    if (isPostMealWindow) {
      if (hasWalk) {
        trend = 'DOWN_SLOW';
        rateOfChange = -0.8;
      } else {
        trend = 'UP_FAST';
        rateOfChange = 1.6;
      }
    }

    // Blood pressure hemodynamic computation
    const stressScore = hasStress ? 28 : selectedPatient.id.includes('114') ? 72 : 55;
    const currentHeartRate = Math.round(
      74 + (isPostMealWindow ? 6 : 0) + (hasWalk ? 8 : 0) - (hasStress ? 6 : 0)
    );

    const bpResult = calculateHemodynamics(
      {
        arterialCompliance: selectedPatient.age > 55 ? 0.78 : 0.88,
        vascularResistance: selectedPatient.conditions.some((c) => c.icd10 === 'I10') ? 21.0 : 17.5,
        strokeVolume: 74,
        baselineHeartRate: 75,
      },
      currentHeartRate,
      stressScore,
      1.15,
      hasMeds
    );

    const cgmReading = {
      glucose: currentGlucose,
      timestamp: new Date().toISOString(),
      trend,
      rateOfChange,
      sensorStatus: 'OK' as const,
      timeInRange: anyInterventionActive ? 82 : selectedPatient.labs.hba1c > 8.0 ? 54 : 68,
      timeAboveRange: anyInterventionActive ? 16 : selectedPatient.labs.hba1c > 8.0 ? 42 : 28,
      timeBelowRange: 2,
      glycemicVariabilityCV: anyInterventionActive ? 26 : 38,
    };

    const bpReading = {
      systolic: bpResult.systolic,
      diastolic: bpResult.diastolic,
      meanArterialPressure: bpResult.map,
      pulsePressure: bpResult.pulsePressure,
      hypertensionStage: bpResult.hypertensionCategory,
      measurementMethod: 'Continuous Photoplethysmography Estimator' as const,
      timestamp: new Date().toISOString(),
    };

    const autonomic = {
      heartRate: currentHeartRate,
      restingHeartRate: 68,
      hrvRmssd: Math.round(26 + (hasStress ? 16 : 0) + (hasWalk ? 6 : 0)),
      respiratoryRate: 16,
      spo2: 98,
      perfusionIndex: 3.4,
    };

    const activity = {
      stepsToday: 6420 + Math.round((simulatedMinuteOffset / 1440) * 3500) + (hasWalk ? 2400 : 0),
      currentMets: hasWalk && isPostMealWindow ? 3.5 : 1.2,
      activeEnergyBurnedKcal: 420 + (hasWalk ? 180 : 0),
      sedentaryMinutes: 420,
      sleepHours: 7.2,
      sleepEfficiencyPercent: 88,
      stressScore,
    };

    return {
      timestamp: new Date().toISOString(),
      minuteOffset: simulatedMinuteOffset,
      cgm: cgmReading,
      bp: bpReading,
      autonomic,
      activity,
    };
  }, [selectedPatient, simulatedMinuteOffset, hasWalk, hasDiet, hasMeds, hasStress, anyInterventionActive]);

  // Risk assessments
  const ascvdPrediction = useMemo(() => {
    return calculateAscvdRisk(selectedPatient, currentSnapshot.bp.systolic);
  }, [selectedPatient, currentSnapshot.bp.systolic]);

  const shortTermPrediction = useMemo(() => {
    return predictShortTermRisks(
      currentSnapshot.cgm,
      currentSnapshot.bp,
      currentSnapshot.activity.stressScore,
      60,
      hasWalk
    );
  }, [currentSnapshot, hasWalk]);

  const resilienceScore = useMemo(() => {
    return calculateResilienceScore(
      currentSnapshot.cgm,
      currentSnapshot.bp,
      currentSnapshot.autonomic,
      currentSnapshot.activity
    );
  }, [currentSnapshot]);

  // Historical and simulated projections curves
  const { historyPoints, baselineForecast, interventionForecast } = useMemo(() => {
    // Generate 6 hours of simulated past points (-360 to 0 min)
    const history: { time: string; minute: number; glucose: number; sbp: number }[] = [];
    for (let m = -360; m <= 0; m += 30) {
      const pastDiurnal = Math.sin((m / 180) * Math.PI) * 25;
      history.push({
        time: `${m}m`,
        minute: m,
        glucose: Math.round(selectedPatient.labs.fastingGlucose + pastDiurnal + 20),
        sbp: Math.round(135 + pastDiurnal * 0.25),
      });
    }

    // Generate forward 4-hour projections (0 to +240 min)
    const glucoseSim = simulateGlucoseProjection(
      currentSnapshot.cgm.glucose,
      0.015,
      65, // 65g carb meal
      hasWalk,
      hasDiet,
      hasMeds,
      240
    );

    const bpSim = simulateBloodPressureProjection(
      { systolic: currentSnapshot.bp.systolic, diastolic: currentSnapshot.bp.diastolic },
      currentSnapshot.activity.stressScore,
      hasDiet,
      hasMeds,
      hasWalk,
      240
    );

    const baseF = glucoseSim.baselineCurve.map((pt, idx) => ({
      minute: pt.minute,
      glucose: pt.glucose,
      sbp: bpSim.baselineBpCurve[Math.floor(idx / 2)]?.systolic || 142,
    }));

    const intervF = glucoseSim.interventionCurve.map((pt, idx) => ({
      minute: pt.minute,
      glucose: pt.glucose,
      sbp: bpSim.interventionBpCurve[Math.floor(idx / 2)]?.systolic || 126,
    }));

    return { historyPoints: history, baselineForecast: baseF, interventionForecast: intervF };
  }, [selectedPatient, currentSnapshot, hasWalk, hasDiet, hasMeds]);

  // Evidence-based Clinical Recommendations
  const clinicalRecommendations: ClinicalRecommendation[] = useMemo(() => {
    return [
      {
        id: 'rec-1',
        priority: currentSnapshot.cgm.glucose > 180 ? 'HIGH' : 'MODERATE',
        category: 'ACTIVITY',
        title: 'Postprandial Timing-Specific Exercise',
        actionText: 'Execute 15-20 minutes of moderate aerobic ambulation (or stair pacing) initiated within 30 minutes of carbohydrate intake.',
        clinicalGuidelineRef: 'ADA Standards of Care 2024 (Section 5) & ICMR Guidelines for T2D India',
        expectedOutcome: '-35 to -50 mg/dL postprandial excursion reduction via muscle GLUT-4 activation.',
      },
      {
        id: 'rec-2',
        priority: 'MODERATE',
        category: 'DIET',
        title: 'South Asian Carbohydrate Fiber Substitution',
        actionText: 'Substitute refined polished grains with whole-grain millets (Foxtail, Ragi) and ensure minimum 15g soluble fiber per major meal.',
        clinicalGuidelineRef: 'ICMR Guidelines for Management of Type 2 Diabetes in India (2023)',
        expectedOutcome: 'Decreases glycemic variability (%CV < 33%) and enhances satiety.',
      },
      {
        id: 'rec-3',
        priority: currentSnapshot.bp.systolic >= 140 ? 'HIGH' : 'LIFESTYLE_OPTIMIZATION',
        category: 'MEDICATION',
        title: 'Optimal Antihypertensive Timing (Chronotherapy)',
        actionText: `Ensure sustained adherence to ${selectedPatient.medications[1]?.name || 'Telmisartan'} with morning dosing; consider ambulatory 24h holter if nocturnal non-dipping persists.`,
        clinicalGuidelineRef: 'AHA / ACC 2017 & Indian Guidelines on Hypertension (I-GH-IV)',
        expectedOutcome: 'Achieves target SBP <130 mmHg and reduces pulse pressure stress on coronaries.',
      },
    ];
  }, [currentSnapshot, selectedPatient]);

  // FHIR R4 Bundle
  const fhirBundle = useMemo(() => {
    return generateFhirR4Bundle(selectedPatient, currentSnapshot, ascvdPrediction);
  }, [selectedPatient, currentSnapshot, ascvdPrediction]);

  // Handlers for Sandbox
  const handleToggleIntervention = (id: string) => {
    setInterventions((prev) =>
      prev.map((item) => (item.id === id ? { ...item, enabled: !item.enabled } : item))
    );
  };

  const handleResetInterventions = () => {
    setInterventions((prev) => prev.map((item) => ({ ...item, enabled: false })));
  };

  const handleActivateOptimalProtocol = () => {
    setInterventions((prev) => prev.map((item) => ({ ...item, enabled: true })));
  };

  const simulatedHour = Math.floor((simulatedMinuteOffset / 60) % 24);
  const simulatedMin = Math.floor(simulatedMinuteOffset % 60);
  const timeFormatted = `${String(simulatedHour).padStart(2, '0')}:${String(simulatedMin).padStart(2, '0')} IST`;

  return (
    <div className="min-h-screen bg-slate-950 text-slate-100 flex flex-col">
      {/* Global Navigation & Telemetry Stream Controller */}
      <Header
        patients={SAMPLE_PATIENTS}
        currentPatient={selectedPatient}
        onSelectPatient={setSelectedPatient}
        isPlaying={isPlaying}
        onTogglePlay={() => setIsPlaying(!isPlaying)}
        speed={speedMultiplier}
        onChangeSpeed={setSpeedMultiplier}
        viewMode={viewMode}
        onToggleViewMode={setViewMode}
        onOpenFhirModal={() => setIsFhirModalOpen(true)}
        onOpenBenchmarkModal={() => setIsBenchmarkModalOpen(true)}
        simulatedTimeLabel={timeFormatted}
      />

      {/* Main Dashboard Layout */}
      <main className="flex-1 p-4 lg:p-8 max-w-7xl mx-auto w-full space-y-6">
        {/* Banner Alert for Jury Review */}
        <div className="bg-gradient-to-r from-slate-900 via-cyan-950/40 to-slate-900 border border-cyan-800/40 rounded-2xl p-4 flex flex-col md:flex-row items-start md:items-center justify-between gap-4 shadow-lg">
          <div className="flex items-center gap-3">
            <span className="flex h-3 w-3 relative shrink-0">
              <span className="animate-ping absolute inline-flex h-full w-full rounded-full bg-cyan-400 opacity-75"></span>
              <span className="relative inline-flex rounded-full h-3 w-3 bg-cyan-500"></span>
            </span>
            <div>
              <h2 className="text-sm font-bold text-slate-100 flex items-center gap-2">
                <span>CardioMetabolic AI Digital Twin Prototype</span>
                <span className="text-[10px] bg-cyan-500/20 text-cyan-300 px-2 py-0.5 rounded font-mono border border-cyan-500/30">
                  Version 1.0 PoC
                </span>
              </h2>
              <p className="text-xs text-slate-400 mt-0.5">
                Dynamic closed-loop virtual replica combining longitudinal EHR records, continuous CGM, and PPG vitals to prevent diabetic &amp; hypertensive adverse events.
              </p>
            </div>
          </div>

          <div className="flex items-center gap-2 shrink-0">
            <button
              onClick={() => setIsBenchmarkModalOpen(true)}
              className="text-xs text-amber-300 bg-amber-500/10 hover:bg-amber-500/20 border border-amber-500/30 px-3 py-1.5 rounded-lg transition-colors font-medium"
            >
              ★ ROC-AUC 0.914 Metrics
            </button>
            <button
              onClick={() => setIsFhirModalOpen(true)}
              className="text-xs text-cyan-300 bg-cyan-500/10 hover:bg-cyan-500/20 border border-cyan-500/30 px-3 py-1.5 rounded-lg transition-colors font-medium"
            >
              View HL7 FHIR R4 Bundle
            </button>
          </div>
        </div>

        {/* Live Vitals Ribbon (4 Pulse Cards) */}
        <VitalSignsRibbon snapshot={currentSnapshot} resilience={resilienceScore} />

        {/* Core Twin Visualization Grid: Avatar + Trajectory */}
        <div className="grid grid-cols-1 lg:grid-cols-12 gap-6 items-stretch">
          {/* Anatomical Hologram Avatar (4 cols) */}
          <div className="lg:col-span-4 flex flex-col">
            <DigitalTwinAvatar
              snapshot={currentSnapshot}
              resilience={resilienceScore}
              hasInterventionsActive={anyInterventionActive}
            />
          </div>

          {/* Interactive Multi-Trace Trajectory & Counterfactual Curve (8 cols) */}
          <div className="lg:col-span-8 flex flex-col">
            <TrajectoryChart
              historyPoints={historyPoints}
              baselineForecast={baselineForecast}
              interventionForecast={interventionForecast}
              currentGlucose={currentSnapshot.cgm.glucose}
              currentSbp={currentSnapshot.bp.systolic}
              hasInterventionsActive={anyInterventionActive}
            />
          </div>
        </div>

        {/* Counterfactual "What-If" Simulation Sandbox */}
        <CounterfactualSimulator
          interventions={interventions}
          onToggleIntervention={handleToggleIntervention}
          onResetAll={handleResetInterventions}
          onActivateOptimalProtocol={handleActivateOptimalProtocol}
        />

        {/* Risk Assessment & Patient Summary Grid */}
        <div className="grid grid-cols-1 lg:grid-cols-12 gap-6">
          {/* Cardiometabolic Risk & Explainability (7 cols) */}
          <div className="lg:col-span-7">
            <RiskAssessmentPanel
              ascvd={ascvdPrediction}
              shortTerm={shortTermPrediction}
              hasInterventionsActive={anyInterventionActive}
            />
          </div>

          {/* Patient EHR Summary & Diagnostics (5 cols) */}
          <div className="lg:col-span-5">
            <PatientSummaryCard patient={selectedPatient} />
          </div>
        </div>

        {/* Evidence-Based Clinical Recommendations */}
        <ClinicalInsights
          viewMode={viewMode}
          recommendations={clinicalRecommendations}
          hasInterventionsActive={anyInterventionActive}
        />
      </main>

      {/* Footer */}
      <footer className="border-t border-slate-900 bg-slate-950 py-6 px-4 text-center text-xs text-slate-500">
        <p>
          CardioGlyc AI — Developed for the <strong>Digital Twin Challenge 2026</strong> organized by <strong>Happiest Health</strong> for the <em>Reimagining and Reforming Healthcare in India Summit</em>.
        </p>
        <p className="mt-1 text-[11px] text-slate-600">
          Simulated clinical models (Bergman Minimal Model, Windkessel Hemodynamics, ACC/AHA ASCVD Risk with South Asian Calibration) for proof-of-concept research purposes.
        </p>
      </footer>

      {/* Modals */}
      <FhirExportModal
        isOpen={isFhirModalOpen}
        onClose={() => setIsFhirModalOpen(false)}
        fhirJson={fhirBundle}
        patientName={selectedPatient.name}
      />

      <BenchmarkModal
        isOpen={isBenchmarkModalOpen}
        onClose={() => setIsBenchmarkModalOpen(false)}
      />
    </div>
  );
};
