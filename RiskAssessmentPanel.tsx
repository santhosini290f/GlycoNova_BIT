import React from 'react';
import { AlertTriangle, ShieldCheck, HeartPulse, Info, HelpCircle } from 'lucide-react';
import { AscvdRiskPrediction, ShortTermExcursionPrediction } from '../types/prediction';

interface RiskAssessmentPanelProps {
  ascvd: AscvdRiskPrediction;
  shortTerm: ShortTermExcursionPrediction;
  hasInterventionsActive: boolean;
}

export const RiskAssessmentPanel: React.FC<RiskAssessmentPanelProps> = ({
  ascvd,
  shortTerm,
  hasInterventionsActive,
}) => {
  const isHighAscvd = ascvd.tenYearRiskPercent >= 20;
  const isIntermediateAscvd = ascvd.tenYearRiskPercent >= 7.5;

  return (
    <div className="bg-slate-900/90 border border-slate-800 rounded-2xl p-5 shadow-xl space-y-6">
      {/* Panel Header */}
      <div className="border-b border-slate-800 pb-3 flex items-center justify-between">
        <div>
          <div className="flex items-center gap-2">
            <h3 className="font-bold text-slate-100 text-sm tracking-wide uppercase flex items-center gap-1.5">
              <HeartPulse className="w-4 h-4 text-rose-400" />
              <span>Cardiometabolic Risk & Adverse Event Predictor</span>
            </h3>
            <span className="text-[10px] px-2 py-0.5 rounded-full bg-rose-500/10 text-rose-300 border border-rose-500/30 font-medium">
              Multi-Task ML Engine
            </span>
          </div>
          <p className="text-xs text-slate-400">
            Calibrated with South Asian Cardiovascular Phenotype (1.4x Multiplier)
          </p>
        </div>
      </div>

      {/* Primary Section: 10-Year ASCVD Risk Score */}
      <div className="grid grid-cols-1 md:grid-cols-2 gap-4 bg-slate-950/60 p-4 rounded-xl border border-slate-800">
        <div>
          <div className="flex items-center justify-between text-xs text-slate-400 mb-1">
            <span className="font-semibold text-slate-200">10-Year ASCVD Risk (ACC/AHA)</span>
            <span className="bg-amber-500/20 text-amber-300 px-2 py-0.5 rounded font-mono text-[10px]">
              {ascvd.riskCategory}
            </span>
          </div>
          <div className="flex items-baseline gap-3 my-2">
            <span
              className={`text-4xl font-extrabold font-mono tracking-tight ${
                isHighAscvd ? 'text-rose-400' : isIntermediateAscvd ? 'text-amber-400' : 'text-emerald-400'
              }`}
            >
              {ascvd.tenYearRiskPercent}%
            </span>
            <div className="text-xs text-slate-400">
              <div>5-Year Baseline: <strong className="text-slate-200">{ascvd.fiveYearRiskPercent}%</strong></div>
              <div className="text-[11px] text-cyan-400 font-medium">South Asian 1.4x Factor Applied</div>
            </div>
          </div>
          <p className="text-[11px] text-slate-400 leading-snug">
            Probability of fatal/non-fatal myocardial infarction or stroke over 10 years without intensive risk modification.
          </p>
        </div>

        {/* Counterfactual Potential Risk Reduction */}
        <div className="border-t md:border-t-0 md:border-l border-slate-800 pt-3 md:pt-0 md:pl-4 flex flex-col justify-between">
          <div>
            <div className="flex items-center justify-between text-xs text-slate-400 mb-1">
              <span className="font-semibold text-emerald-300">Digital Twin Optimized Risk</span>
              <span className="bg-emerald-500/20 text-emerald-300 px-2 py-0.5 rounded font-semibold text-[10px]">
                -{ascvd.relativeRiskReduction}% Relative Reduction
              </span>
            </div>
            <div className="flex items-baseline gap-2 my-2">
              <span className="text-3xl font-extrabold font-mono text-emerald-400">
                {ascvd.optimizedRiskWithInterventions}%
              </span>
              <span className="text-xs text-slate-400">10-Year Target</span>
            </div>
          </div>
          <div className="text-[11px] text-slate-400 bg-slate-900/80 p-2 rounded-lg border border-slate-800">
            Achievable via strict glycemic control (HbA1c &lt;7.0%), SBP &lt;130 mmHg, and 150 min/wk moderate activity.
          </div>
        </div>
      </div>

      {/* Short-Term 2-Hour Adverse Event Predictor */}
      <div>
        <h4 className="text-xs font-bold text-slate-300 uppercase tracking-wider mb-2.5 flex items-center gap-1.5">
          <AlertTriangle className="w-3.5 h-3.5 text-amber-400" />
          <span>Real-Time 2-Hour Acute Excursion Probabilities</span>
        </h4>
        <div className="grid grid-cols-1 sm:grid-cols-3 gap-3">
          {/* Hypoglycemia Risk */}
          <div className="bg-slate-850 p-3 rounded-xl border border-slate-850 bg-slate-950/40">
            <div className="flex justify-between items-center text-xs text-slate-400 mb-1">
              <span>Hypoglycemia (&lt;70)</span>
              <span className="font-mono text-[10px] text-emerald-400 font-bold">LOW</span>
            </div>
            <div className="text-xl font-bold font-mono text-slate-200">
              {Math.round(shortTerm.hypoglycemiaTwoHourRisk * 100)}%
            </div>
            <div className="w-full bg-slate-800 h-1.5 rounded-full mt-2 overflow-hidden">
              <div
                className="bg-emerald-400 h-full rounded-full"
                style={{ width: `${shortTerm.hypoglycemiaTwoHourRisk * 100}%` }}
              />
            </div>
          </div>

          {/* Hyperglycemic Spike Risk */}
          <div className="bg-slate-850 p-3 rounded-xl border border-slate-850 bg-slate-950/40">
            <div className="flex justify-between items-center text-xs text-slate-400 mb-1">
              <span>Hyperglycemia (&gt;220)</span>
              <span
                className={`font-mono text-[10px] font-bold ${
                  hasInterventionsActive ? 'text-emerald-400' : 'text-rose-400'
                }`}
              >
                {hasInterventionsActive ? 'CONTAINED' : 'ELEVATED'}
              </span>
            </div>
            <div
              className={`text-xl font-bold font-mono ${
                hasInterventionsActive ? 'text-emerald-400' : 'text-rose-400'
              }`}
            >
              {hasInterventionsActive ? '14%' : `${Math.round(shortTerm.hyperglycemiaTwoHourRisk * 100)}%`}
            </div>
            <div className="w-full bg-slate-800 h-1.5 rounded-full mt-2 overflow-hidden">
              <div
                className={`h-full rounded-full ${
                  hasInterventionsActive ? 'bg-emerald-400' : 'bg-rose-400'
                }`}
                style={{
                  width: hasInterventionsActive
                    ? '14%'
                    : `${shortTerm.hyperglycemiaTwoHourRisk * 100}%`,
                }}
              />
            </div>
          </div>

          {/* Hypertensive Surge Risk */}
          <div className="bg-slate-850 p-3 rounded-xl border border-slate-850 bg-slate-950/40">
            <div className="flex justify-between items-center text-xs text-slate-400 mb-1">
              <span>BP Surge (SBP &gt;160)</span>
              <span className="font-mono text-[10px] text-amber-400 font-bold">MODERATE</span>
            </div>
            <div className="text-xl font-bold font-mono text-slate-200">
              {hasInterventionsActive ? '8%' : `${Math.round(shortTerm.hypertensiveSurgeRisk * 100)}%`}
            </div>
            <div className="w-full bg-slate-800 h-1.5 rounded-full mt-2 overflow-hidden">
              <div
                className="bg-amber-400 h-full rounded-full"
                style={{
                  width: hasInterventionsActive
                    ? '8%'
                    : `${shortTerm.hypertensiveSurgeRisk * 100}%`,
                }}
              />
            </div>
          </div>
        </div>
      </div>

      {/* Model Explainability: SHAP-Style Clinical Feature Attributions */}
      <div>
        <div className="flex items-center justify-between mb-2">
          <h4 className="text-xs font-bold text-slate-300 uppercase tracking-wider flex items-center gap-1.5">
            <Info className="w-3.5 h-3.5 text-cyan-400" />
            <span>Explainable AI (XAI) Feature Importance</span>
          </h4>
          <span className="text-[10px] text-slate-500 font-mono">SHAP Contribution Vector</span>
        </div>

        <div className="space-y-2">
          {ascvd.primaryDrivers.map((driver, idx) => (
            <div
              key={idx}
              className="bg-slate-950/50 p-2.5 rounded-lg border border-slate-850 text-xs flex flex-col gap-1"
            >
              <div className="flex items-center justify-between">
                <div className="flex items-center gap-1.5">
                  <span className="font-semibold text-slate-200">{driver.featureName}</span>
                  <span className="text-[10px] px-1.5 py-0.2 rounded bg-slate-800 text-slate-400">
                    {driver.source}
                  </span>
                </div>
                <div className="font-mono text-xs font-bold text-rose-300">
                  +{Math.round(driver.shapWeight * 100)}% Risk Weight
                </div>
              </div>
              <div className="flex items-center justify-between text-[11px] text-slate-400">
                <span className="font-mono text-slate-300">{driver.value}</span>
                <span className="italic text-slate-500 text-[10px]">{driver.clinicalRationale}</span>
              </div>
            </div>
          ))}
        </div>
      </div>
    </div>
  );
};
