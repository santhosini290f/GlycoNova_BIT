import React from 'react';
import { Activity, Play, Pause, FastForward, FileCode2, Award, User, Stethoscope } from 'lucide-react';
import { PatientProfile } from '../types/patient';

interface HeaderProps {
  patients: PatientProfile[];
  currentPatient: PatientProfile;
  onSelectPatient: (patient: PatientProfile) => void;
  isPlaying: boolean;
  onTogglePlay: () => void;
  speed: number;
  onChangeSpeed: (speed: number) => void;
  viewMode: 'CLINICIAN' | 'PATIENT';
  onToggleViewMode: (mode: 'CLINICIAN' | 'PATIENT') => void;
  onOpenFhirModal: () => void;
  onOpenBenchmarkModal: () => void;
  simulatedTimeLabel: string;
}

export const Header: React.FC<HeaderProps> = ({
  patients,
  currentPatient,
  onSelectPatient,
  isPlaying,
  onTogglePlay,
  speed,
  onChangeSpeed,
  viewMode,
  onToggleViewMode,
  onOpenFhirModal,
  onOpenBenchmarkModal,
  simulatedTimeLabel,
}) => {
  return (
    <header className="border-b border-slate-800 bg-slate-900/80 backdrop-blur-md sticky top-0 z-40 px-4 lg:px-8 py-3">
      <div className="flex flex-col md:flex-row items-start md:items-center justify-between gap-4">
        {/* Brand & Subtitle */}
        <div className="flex items-center gap-3">
          <div className="relative flex items-center justify-center w-10 h-10 rounded-xl bg-gradient-to-br from-cyan-500 to-blue-600 text-white shadow-lg shadow-cyan-500/20">
            <Activity className="w-5 h-5 animate-pulse" />
            <span className="absolute -top-1 -right-1 flex h-3 w-3">
              <span className="animate-ping absolute inline-flex h-full w-full rounded-full bg-cyan-400 opacity-75"></span>
              <span className="relative inline-flex rounded-full h-3 w-3 bg-cyan-500"></span>
            </span>
          </div>
          <div>
            <div className="flex items-center gap-2">
              <h1 className="text-lg font-bold text-white tracking-tight flex items-center gap-1.5">
                <span>CardioGlyc AI</span>
                <span className="text-xs px-2 py-0.5 rounded-full bg-cyan-500/10 text-cyan-400 border border-cyan-500/30 font-medium">
                  Digital Twin PoC
                </span>
              </h1>
            </div>
            <p className="text-xs text-slate-400">
              Happiest Health Summit 2026 • Reimagining Chronic Care in India
            </p>
          </div>
        </div>

        {/* Central Controls: Patient Switcher & Simulation Stream */}
        <div className="flex flex-wrap items-center gap-3 w-full md:w-auto">
          {/* Patient Selector */}
          <div className="flex items-center gap-1.5 bg-slate-800/80 border border-slate-700/60 rounded-lg px-2.5 py-1.5 text-xs text-slate-300">
            <User className="w-3.5 h-3.5 text-cyan-400" />
            <span className="text-slate-400 hidden sm:inline">Cohort Persona:</span>
            <select
              value={currentPatient.id}
              onChange={(e) => {
                const found = patients.find((p) => p.id === e.target.value);
                if (found) onSelectPatient(found);
              }}
              className="bg-transparent text-white font-medium focus:outline-none cursor-pointer"
            >
              {patients.map((p) => (
                <option key={p.id} value={p.id} className="bg-slate-900 text-slate-200">
                  {p.name} ({p.age}y, {p.conditions[0]?.name.split(' ')[0]})
                </option>
              ))}
            </select>
          </div>

          {/* Time & Telemetry Stream Controls */}
          <div className="flex items-center gap-2 bg-slate-800/80 border border-slate-700/60 rounded-lg px-2.5 py-1.5 text-xs text-slate-300">
            <span className="font-mono text-cyan-300 text-xs font-semibold">
              ⏱ {simulatedTimeLabel}
            </span>
            <div className="h-4 w-px bg-slate-700 mx-1" />
            <button
              onClick={onTogglePlay}
              className={`p-1 rounded transition-colors ${
                isPlaying ? 'text-amber-400 hover:bg-slate-700' : 'text-emerald-400 hover:bg-slate-700'
              }`}
              title={isPlaying ? 'Pause Simulation' : 'Play Live Stream'}
            >
              {isPlaying ? <Pause className="w-3.5 h-3.5" /> : <Play className="w-3.5 h-3.5" />}
            </button>
            <div className="flex items-center gap-1">
              {[1, 5, 30].map((s) => (
                <button
                  key={s}
                  onClick={() => onChangeSpeed(s)}
                  className={`px-1.5 py-0.5 rounded text-[10px] font-mono transition-colors ${
                    speed === s
                      ? 'bg-cyan-500/20 text-cyan-300 border border-cyan-500/40 font-bold'
                      : 'text-slate-400 hover:text-slate-200'
                  }`}
                >
                  {s}x
                </button>
              ))}
            </div>
          </div>
        </div>

        {/* Right Controls: View Switcher, FHIR Export, Benchmark */}
        <div className="flex items-center gap-2 w-full md:w-auto justify-end">
          {/* Persona View Mode (Clinician vs Patient) */}
          <div className="flex bg-slate-800/90 p-0.5 rounded-lg border border-slate-700/70 text-xs">
            <button
              onClick={() => onToggleViewMode('CLINICIAN')}
              className={`flex items-center gap-1 px-2.5 py-1 rounded-md transition-all ${
                viewMode === 'CLINICIAN'
                  ? 'bg-cyan-600 text-white font-medium shadow-sm'
                  : 'text-slate-400 hover:text-slate-200'
              }`}
            >
              <Stethoscope className="w-3.5 h-3.5" />
              <span>Clinician / Jury</span>
            </button>
            <button
              onClick={() => onToggleViewMode('PATIENT')}
              className={`flex items-center gap-1 px-2.5 py-1 rounded-md transition-all ${
                viewMode === 'PATIENT'
                  ? 'bg-cyan-600 text-white font-medium shadow-sm'
                  : 'text-slate-400 hover:text-slate-200'
              }`}
            >
              <User className="w-3.5 h-3.5" />
              <span>Patient Mode</span>
            </button>
          </div>

          {/* HL7 FHIR Export Button */}
          <button
            onClick={onOpenFhirModal}
            className="flex items-center gap-1.5 px-2.5 py-1.5 bg-slate-800 hover:bg-slate-700 border border-slate-700 hover:border-slate-600 text-slate-200 rounded-lg text-xs transition-colors"
            title="Export HL7 FHIR R4 standard JSON resources"
          >
            <FileCode2 className="w-3.5 h-3.5 text-blue-400" />
            <span className="hidden sm:inline">FHIR R4</span>
          </button>

          {/* Model Benchmarks Modal */}
          <button
            onClick={onOpenBenchmarkModal}
            className="flex items-center gap-1.5 px-2.5 py-1.5 bg-amber-500/10 hover:bg-amber-500/20 border border-amber-500/30 text-amber-300 rounded-lg text-xs transition-colors"
            title="View ML evaluation metrics and ROC-AUC benchmarks"
          >
            <Award className="w-3.5 h-3.5" />
            <span className="hidden sm:inline">Metrics</span>
          </button>
        </div>
      </div>
    </header>
  );
};
