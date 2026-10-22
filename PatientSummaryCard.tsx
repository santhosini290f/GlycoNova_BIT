import React from 'react';
import { User, FileText, Pill, FlaskConical, AlertCircle, MapPin, Briefcase } from 'lucide-react';
import { PatientProfile } from '../types/patient';

interface PatientSummaryCardProps {
  patient: PatientProfile;
}

export const PatientSummaryCard: React.FC<PatientSummaryCardProps> = ({ patient }) => {
  const { labs } = patient;

  return (
    <div className="bg-slate-900/90 border border-slate-800 rounded-2xl p-5 shadow-xl space-y-5">
      {/* Patient Header */}
      <div className="flex items-start justify-between border-b border-slate-800 pb-4">
        <div className="flex items-start gap-3">
          <div className="w-12 h-12 rounded-xl bg-gradient-to-br from-blue-600 to-indigo-700 flex items-center justify-center text-white font-bold text-lg shadow-md">
            {patient.name.split(' ').map((n) => n[0]).join('')}
          </div>
          <div>
            <div className="flex items-center gap-2">
              <h3 className="font-bold text-slate-100 text-base">{patient.name}</h3>
              <span className="text-[11px] px-2 py-0.5 rounded-full bg-slate-800 text-slate-300 font-mono">
                {patient.id}
              </span>
            </div>
            <div className="flex flex-wrap items-center gap-2 text-xs text-slate-400 mt-1">
              <span>{patient.age} yrs • {patient.gender}</span>
              <span>•</span>
              <span className="flex items-center gap-1">
                <MapPin className="w-3 h-3 text-cyan-400" />
                {patient.location}
              </span>
              <span>•</span>
              <span className="flex items-center gap-1">
                <Briefcase className="w-3 h-3 text-slate-400" />
                {patient.occupation}
              </span>
            </div>
          </div>
        </div>

        <div className="text-right">
          <div className="text-xs text-slate-400">BMI (Asian Criteria)</div>
          <div className="text-sm font-bold font-mono text-amber-300">
            {patient.bmi} kg/m² <span className="text-[10px] font-normal text-amber-400">(&ge;27.5 Obese)</span>
          </div>
        </div>
      </div>

      {/* Clinical Phenotype Summary */}
      <div className="bg-slate-950/60 p-3 rounded-xl border border-slate-850 text-xs">
        <div className="font-semibold text-slate-300 mb-1 flex items-center gap-1.5">
          <FileText className="w-3.5 h-3.5 text-cyan-400" />
          <span>Clinical Phenotype</span>
        </div>
        <p className="text-slate-400 leading-relaxed text-[11px]">
          {patient.clinicalSummary}
        </p>
      </div>

      {/* Conditions (ICD-10) */}
      <div>
        <div className="text-xs font-bold text-slate-400 uppercase tracking-wider mb-2">
          Documented Conditions (EHR)
        </div>
        <div className="flex flex-wrap gap-2">
          {patient.conditions.map((c) => (
            <div
              key={c.code}
              className="bg-slate-800/80 border border-slate-700/70 px-2.5 py-1.5 rounded-lg text-xs flex items-center gap-2"
            >
              <span className="font-mono text-[10px] bg-slate-900 text-cyan-300 px-1.5 py-0.5 rounded font-bold">
                {c.icd10}
              </span>
              <span className="text-slate-200">{c.name}</span>
            </div>
          ))}
        </div>
      </div>

      {/* Active Medications & Adherence */}
      <div>
        <div className="text-xs font-bold text-slate-400 uppercase tracking-wider mb-2 flex items-center justify-between">
          <span>Current Pharmacotherapy</span>
          <span className="text-[10px] text-slate-500 font-normal">Adherence Tracking</span>
        </div>
        <div className="space-y-2">
          {patient.medications.map((m) => (
            <div
              key={m.id}
              className="bg-slate-950/50 p-2.5 rounded-lg border border-slate-850 flex items-center justify-between text-xs"
            >
              <div>
                <div className="font-semibold text-slate-200 flex items-center gap-1.5">
                  <Pill className="w-3 h-3 text-cyan-400" />
                  <span>{m.name}</span>
                  <span className="text-slate-400 font-mono text-[11px]">({m.dosage})</span>
                </div>
                <div className="text-[11px] text-slate-500 mt-0.5">{m.frequency}</div>
              </div>
              <div className="text-right">
                <span
                  className={`font-mono font-bold text-xs ${
                    m.adherenceRate >= 90
                      ? 'text-emerald-400'
                      : m.adherenceRate >= 75
                      ? 'text-amber-400'
                      : 'text-rose-400'
                  }`}
                >
                  {m.adherenceRate}%
                </span>
                <div className="text-[10px] text-slate-500">Adherence</div>
              </div>
            </div>
          ))}
        </div>
      </div>

      {/* Laboratory Biomarkers Table */}
      <div>
        <div className="text-xs font-bold text-slate-400 uppercase tracking-wider mb-2 flex items-center gap-1.5">
          <FlaskConical className="w-3.5 h-3.5 text-cyan-400" />
          <span>Diagnostic Laboratory Panel (Last: {labs.lastUpdated})</span>
        </div>
        <div className="grid grid-cols-2 sm:grid-cols-4 gap-2 text-xs">
          <div className="bg-slate-950/60 p-2 rounded-lg border border-slate-850">
            <span className="text-slate-500 text-[10px] block">HbA1c</span>
            <span
              className={`font-mono font-bold text-sm ${
                labs.hba1c >= 8.0 ? 'text-rose-400' : labs.hba1c >= 7.0 ? 'text-amber-400' : 'text-emerald-400'
              }`}
            >
              {labs.hba1c}%
            </span>
          </div>

          <div className="bg-slate-950/60 p-2 rounded-lg border border-slate-850">
            <span className="text-slate-500 text-[10px] block">Fasting Glucose</span>
            <span className="font-mono font-bold text-sm text-slate-200">
              {labs.fastingGlucose} <span className="text-[10px] font-normal text-slate-500">mg/dL</span>
            </span>
          </div>

          <div className="bg-slate-950/60 p-2 rounded-lg border border-slate-850">
            <span className="text-slate-500 text-[10px] block">LDL-C</span>
            <span
              className={`font-mono font-bold text-sm ${
                labs.ldlCholesterol >= 130 ? 'text-rose-400' : 'text-slate-200'
              }`}
            >
              {labs.ldlCholesterol} <span className="text-[10px] font-normal text-slate-500">mg/dL</span>
            </span>
          </div>

          <div className="bg-slate-950/60 p-2 rounded-lg border border-slate-850">
            <span className="text-slate-500 text-[10px] block">Triglycerides</span>
            <span
              className={`font-mono font-bold text-sm ${
                labs.triglycerides >= 200 ? 'text-amber-400' : 'text-slate-200'
              }`}
            >
              {labs.triglycerides} <span className="text-[10px] font-normal text-slate-500">mg/dL</span>
            </span>
          </div>

          <div className="bg-slate-950/60 p-2 rounded-lg border border-slate-850">
            <span className="text-slate-500 text-[10px] block">HDL-C (Cardioprotective)</span>
            <span className="font-mono font-bold text-sm text-slate-200">
              {labs.hdlCholesterol} <span className="text-[10px] font-normal text-slate-500">mg/dL</span>
            </span>
          </div>

          <div className="bg-slate-950/60 p-2 rounded-lg border border-slate-850">
            <span className="text-slate-500 text-[10px] block">eGFR</span>
            <span className="font-mono font-bold text-sm text-slate-200">
              {labs.egfr} <span className="text-[10px] font-normal text-slate-500">mL/min</span>
            </span>
          </div>

          <div className="bg-slate-950/60 p-2 rounded-lg border border-slate-850">
            <span className="text-slate-500 text-[10px] block">hs-CRP</span>
            <span
              className={`font-mono font-bold text-sm ${
                labs.hsCrp >= 3.0 ? 'text-rose-400' : 'text-slate-200'
              }`}
            >
              {labs.hsCrp} <span className="text-[10px] font-normal text-slate-500">mg/L</span>
            </span>
          </div>

          <div className="bg-slate-950/60 p-2 rounded-lg border border-slate-850">
            <span className="text-slate-500 text-[10px] block">Microalbuminuria</span>
            <span className="font-mono font-bold text-sm text-slate-200">
              {labs.microalbuminuria} <span className="text-[10px] font-normal text-slate-500">mg/g</span>
            </span>
          </div>
        </div>
      </div>
    </div>
  );
};
