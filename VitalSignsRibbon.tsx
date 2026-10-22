import React from 'react';
import {
  Activity,
  Heart,
  TrendingUp,
  TrendingDown,
  Minus,
  AlertCircle,
  ShieldCheck,
  Zap,
} from 'lucide-react';
import { MultiModalSensorSnapshot } from '../types/sensors';
import { ResilienceScore } from '../types/prediction';

interface VitalSignsRibbonProps {
  snapshot: MultiModalSensorSnapshot;
  resilience: ResilienceScore;
}

export const VitalSignsRibbon: React.FC<VitalSignsRibbonProps> = ({ snapshot, resilience }) => {
  const { cgm, bp, autonomic, activity } = snapshot;

  // Glucose status color
  const isGlucoseHigh = cgm.glucose > 180;
  const isGlucoseLow = cgm.glucose < 70;
  const glucoseColor = isGlucoseHigh
    ? 'text-amber-400'
    : isGlucoseLow
    ? 'text-rose-400'
    : 'text-emerald-400';

  // Blood Pressure color
  const isBpStage2 = bp.systolic >= 140 || bp.diastolic >= 90;
  const bpColor = isBpStage2 ? 'text-rose-400' : bp.systolic >= 130 ? 'text-amber-400' : 'text-cyan-400';

  const renderTrendIcon = () => {
    switch (cgm.trend) {
      case 'UP_FAST':
        return <TrendingUp className="w-4 h-4 text-rose-400" />;
      case 'UP_SLOW':
        return <TrendingUp className="w-4 h-4 text-amber-400" />;
      case 'DOWN_FAST':
        return <TrendingDown className="w-4 h-4 text-rose-400" />;
      case 'DOWN_SLOW':
        return <TrendingDown className="w-4 h-4 text-cyan-400" />;
      default:
        return <Minus className="w-4 h-4 text-slate-400" />;
    }
  };

  return (
    <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-4">
      {/* 1. CGM Glucose Card */}
      <div className="bg-slate-900/80 border border-slate-800 hover:border-slate-700/80 rounded-2xl p-4 shadow-lg transition-all relative overflow-hidden">
        <div className="flex items-center justify-between text-xs text-slate-400 mb-1">
          <span className="flex items-center gap-1.5 font-medium">
            <Zap className="w-3.5 h-3.5 text-amber-400" />
            CGM Glucose (mg/dL)
          </span>
          <span className="flex items-center gap-1 text-[11px] font-mono bg-slate-800/80 px-2 py-0.5 rounded">
            {renderTrendIcon()}
            {cgm.rateOfChange > 0 ? `+${cgm.rateOfChange}` : cgm.rateOfChange} mg/dL/m
          </span>
        </div>
        <div className="flex items-baseline justify-between mt-2">
          <div className="flex items-baseline gap-2">
            <span className={`text-3xl font-extrabold font-mono tracking-tight ${glucoseColor}`}>
              {cgm.glucose}
            </span>
            <span className="text-xs text-slate-400">mg/dL</span>
          </div>
          <span
            className={`text-xs px-2 py-0.5 rounded-full font-semibold ${
              isGlucoseHigh
                ? 'bg-amber-500/10 text-amber-300 border border-amber-500/30'
                : isGlucoseLow
                ? 'bg-rose-500/10 text-rose-300 border border-rose-500/30'
                : 'bg-emerald-500/10 text-emerald-300 border border-emerald-500/30'
            }`}
          >
            {isGlucoseHigh ? 'High (Hyper)' : isGlucoseLow ? 'Low (Hypo)' : 'In Target'}
          </span>
        </div>
        <div className="mt-3 pt-2.5 border-t border-slate-800/80 flex items-center justify-between text-[11px] text-slate-400">
          <div>
            Time in Range: <span className="font-semibold text-slate-200">{cgm.timeInRange}%</span>
          </div>
          <div>
            %CV: <span className="font-semibold text-slate-200">{cgm.glycemicVariabilityCV}%</span>
          </div>
        </div>
      </div>

      {/* 2. Ambulatory Blood Pressure Card */}
      <div className="bg-slate-900/80 border border-slate-800 hover:border-slate-700/80 rounded-2xl p-4 shadow-lg transition-all relative overflow-hidden">
        <div className="flex items-center justify-between text-xs text-slate-400 mb-1">
          <span className="flex items-center gap-1.5 font-medium">
            <Heart className="w-3.5 h-3.5 text-rose-400" />
            Ambulatory Blood Pressure
          </span>
          <span className="text-[10px] font-mono bg-slate-800/80 px-1.5 py-0.5 rounded text-slate-300">
            MAP {bp.meanArterialPressure} mmHg
          </span>
        </div>
        <div className="flex items-baseline justify-between mt-2">
          <div className="flex items-baseline gap-1.5">
            <span className={`text-3xl font-extrabold font-mono tracking-tight ${bpColor}`}>
              {bp.systolic}
            </span>
            <span className="text-slate-500 text-xl font-light">/</span>
            <span className="text-2xl font-bold font-mono text-slate-300">{bp.diastolic}</span>
            <span className="text-xs text-slate-400 ml-1">mmHg</span>
          </div>
          <span
            className={`text-xs px-2 py-0.5 rounded-full font-semibold ${
              isBpStage2
                ? 'bg-rose-500/10 text-rose-300 border border-rose-500/30'
                : bp.systolic >= 130
                ? 'bg-amber-500/10 text-amber-300 border border-amber-500/30'
                : 'bg-cyan-500/10 text-cyan-300 border border-cyan-500/30'
            }`}
          >
            {bp.hypertensionStage}
          </span>
        </div>
        <div className="mt-3 pt-2.5 border-t border-slate-800/80 flex items-center justify-between text-[11px] text-slate-400">
          <div>
            Pulse Pressure: <span className="font-semibold text-slate-200">{bp.pulsePressure} mmHg</span>
          </div>
          <div className="text-[10px] text-slate-500">ABPM Real-Time</div>
        </div>
      </div>

      {/* 3. Autonomic Tone & Heart Rate */}
      <div className="bg-slate-900/80 border border-slate-800 hover:border-slate-700/80 rounded-2xl p-4 shadow-lg transition-all relative overflow-hidden">
        <div className="flex items-center justify-between text-xs text-slate-400 mb-1">
          <span className="flex items-center gap-1.5 font-medium">
            <Activity className="w-3.5 h-3.5 text-cyan-400" />
            Autonomic & Vitals
          </span>
          <span className="text-[11px] font-mono text-slate-300">
            SpO₂ <strong className="text-emerald-400">{autonomic.spo2}%</strong>
          </span>
        </div>
        <div className="flex items-baseline justify-between mt-2">
          <div className="flex items-baseline gap-2">
            <span className="text-3xl font-extrabold font-mono tracking-tight text-slate-100">
              {autonomic.heartRate}
            </span>
            <span className="text-xs text-slate-400">BPM</span>
          </div>
          <span className="text-xs px-2 py-0.5 rounded-full font-semibold bg-slate-800 text-slate-300 border border-slate-700">
            Resting {autonomic.restingHeartRate}
          </span>
        </div>
        <div className="mt-3 pt-2.5 border-t border-slate-800/80 flex items-center justify-between text-[11px] text-slate-400">
          <div>
            HRV RMSSD:{' '}
            <span className={`font-semibold ${autonomic.hrvRmssd < 25 ? 'text-amber-400' : 'text-slate-200'}`}>
              {autonomic.hrvRmssd} ms
            </span>
          </div>
          <div>
            Stress: <span className="font-semibold text-slate-200">{activity.stressScore}/100</span>
          </div>
        </div>
      </div>

      {/* 4. Metabolic Resilience Index */}
      <div className="bg-slate-900/80 border border-slate-800 hover:border-slate-700/80 rounded-2xl p-4 shadow-lg transition-all relative overflow-hidden">
        <div className="flex items-center justify-between text-xs text-slate-400 mb-1">
          <span className="flex items-center gap-1.5 font-medium">
            <ShieldCheck className="w-3.5 h-3.5 text-purple-400" />
            Metabolic Resilience
          </span>
          <span className="text-[10px] text-purple-300 font-semibold uppercase tracking-wider">
            Twin Score
          </span>
        </div>
        <div className="flex items-baseline justify-between mt-2">
          <div className="flex items-baseline gap-2">
            <span
              className={`text-3xl font-extrabold font-mono tracking-tight ${
                resilience.compositeScore >= 75
                  ? 'text-emerald-400'
                  : resilience.compositeScore >= 50
                  ? 'text-amber-400'
                  : 'text-rose-400'
              }`}
            >
              {resilience.compositeScore}
            </span>
            <span className="text-xs text-slate-400">/ 100</span>
          </div>
          <span
            className={`text-xs px-2 py-0.5 rounded-full font-semibold ${
              resilience.compositeScore >= 75
                ? 'bg-emerald-500/10 text-emerald-300 border border-emerald-500/30'
                : resilience.compositeScore >= 50
                ? 'bg-amber-500/10 text-amber-300 border border-amber-500/30'
                : 'bg-rose-500/10 text-rose-300 border border-rose-500/30'
            }`}
          >
            {resilience.status.split(' ')[0]}
          </span>
        </div>
        {/* Tri-bar component */}
        <div className="mt-3 pt-2.5 border-t border-slate-800/80 space-y-1">
          <div className="w-full bg-slate-800 rounded-full h-1.5 overflow-hidden flex">
            <div
              className="bg-emerald-400 h-full"
              style={{ width: `${resilience.glycemicStabilityScore * 0.35}%` }}
              title="Glycemic Stability"
            />
            <div
              className="bg-cyan-400 h-full"
              style={{ width: `${resilience.cardiovascularVigorScore * 0.35}%` }}
              title="Cardiovascular Vigor"
            />
            <div
              className="bg-purple-400 h-full"
              style={{ width: `${resilience.autonomicRecoveryScore * 0.3}%` }}
              title="Autonomic Recovery"
            />
          </div>
          <div className="flex justify-between text-[9px] text-slate-500">
            <span>Glycemic</span>
            <span>Cardiovascular</span>
            <span>Autonomic</span>
          </div>
        </div>
      </div>
    </div>
  );
};
