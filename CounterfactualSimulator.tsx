import React from 'react';
import { Sliders, Sparkles, Footprints, Utensils, Pill, Moon, CheckCircle2, RotateCcw } from 'lucide-react';
import { InterventionOption } from '../types/simulation';

interface CounterfactualSimulatorProps {
  interventions: InterventionOption[];
  onToggleIntervention: (id: string) => void;
  onResetAll: () => void;
  onActivateOptimalProtocol: () => void;
}

export const CounterfactualSimulator: React.FC<CounterfactualSimulatorProps> = ({
  interventions,
  onToggleIntervention,
  onResetAll,
  onActivateOptimalProtocol,
}) => {
  const activeCount = interventions.filter((i) => i.enabled).length;

  const getCategoryIcon = (category: InterventionOption['category']) => {
    switch (category) {
      case 'Physical Activity':
        return <Footprints className="w-4 h-4 text-emerald-400" />;
      case 'Nutrition':
        return <Utensils className="w-4 h-4 text-amber-400" />;
      case 'Pharmacotherapy':
        return <Pill className="w-4 h-4 text-blue-400" />;
      case 'Stress/Behavioral':
        return <Moon className="w-4 h-4 text-purple-400" />;
      default:
        return <Sliders className="w-4 h-4 text-cyan-400" />;
    }
  };

  return (
    <div className="bg-slate-900/90 border border-slate-800 rounded-2xl p-5 shadow-xl">
      {/* Sandbox Header */}
      <div className="flex flex-col sm:flex-row items-start sm:items-center justify-between gap-3 mb-4 pb-3 border-b border-slate-800">
        <div>
          <div className="flex items-center gap-2">
            <h3 className="font-bold text-slate-100 text-sm tracking-wide uppercase flex items-center gap-1.5">
              <Sliders className="w-4 h-4 text-cyan-400" />
              <span>"What-If" Counterfactual Simulation Sandbox</span>
            </h3>
            <span className="text-[10px] px-2 py-0.5 rounded-full bg-cyan-500/10 text-cyan-400 border border-cyan-500/30 font-medium">
              In Silico Twin Experimentation
            </span>
          </div>
          <p className="text-xs text-slate-400">
            Simulate lifestyle & pharmacological interventions before clinical recommendation
          </p>
        </div>

        {/* Quick Action Presets */}
        <div className="flex items-center gap-2">
          <button
            onClick={onResetAll}
            className="flex items-center gap-1 px-2.5 py-1.5 bg-slate-800 hover:bg-slate-700 text-slate-300 text-xs rounded-lg transition-colors border border-slate-700"
          >
            <RotateCcw className="w-3.5 h-3.5" />
            <span>Reset</span>
          </button>
          <button
            onClick={onActivateOptimalProtocol}
            className="flex items-center gap-1.5 px-3 py-1.5 bg-gradient-to-r from-emerald-600 to-cyan-600 hover:from-emerald-500 hover:to-cyan-500 text-white text-xs font-semibold rounded-lg shadow-md transition-all shadow-emerald-900/30"
          >
            <Sparkles className="w-3.5 h-3.5" />
            <span>Apply Optimal Care</span>
          </button>
        </div>
      </div>

      {/* Intervention Toggle Cards Grid */}
      <div className="grid grid-cols-1 md:grid-cols-2 gap-3">
        {interventions.map((item) => (
          <div
            key={item.id}
            onClick={() => onToggleIntervention(item.id)}
            className={`cursor-pointer rounded-xl p-3.5 border transition-all select-none flex flex-col justify-between ${
              item.enabled
                ? 'bg-gradient-to-br from-slate-800 to-slate-850 border-cyan-500/60 shadow-md shadow-cyan-950/40 ring-1 ring-cyan-500/30'
                : 'bg-slate-900/60 border-slate-800 hover:border-slate-700/80 opacity-75 hover:opacity-100'
            }`}
          >
            <div className="flex items-start justify-between gap-3">
              <div className="flex items-start gap-2.5">
                <div
                  className={`p-2 rounded-lg mt-0.5 ${
                    item.enabled ? 'bg-cyan-500/20 text-cyan-300' : 'bg-slate-800 text-slate-400'
                  }`}
                >
                  {getCategoryIcon(item.category)}
                </div>
                <div>
                  <div className="flex items-center gap-2">
                    <h4 className="text-xs font-bold text-slate-100">{item.name}</h4>
                    <span className="text-[10px] text-slate-400 bg-slate-800 px-1.5 py-0.5 rounded">
                      {item.category}
                    </span>
                  </div>
                  <p className="text-[11px] text-slate-400 mt-1 leading-snug">{item.description}</p>
                </div>
              </div>

              {/* Toggle Indicator */}
              <div
                className={`w-5 h-5 rounded-md flex items-center justify-center shrink-0 transition-colors ${
                  item.enabled ? 'bg-cyan-500 text-white' : 'border border-slate-700 bg-slate-800/80'
                }`}
              >
                {item.enabled && <CheckCircle2 className="w-3.5 h-3.5" />}
              </div>
            </div>

            {/* Simulated Physiological Impact Delta */}
            <div className="mt-3 pt-2.5 border-t border-slate-800 flex items-center justify-between text-[11px]">
              <span className="text-slate-400 italic">{item.clinicalImpactSummary}</span>
              <div className="flex items-center gap-2 font-mono font-semibold">
                {item.glucoseDeltaPercent !== 0 && (
                  <span className="text-emerald-400">{item.glucoseDeltaPercent}% Peak Glucose</span>
                )}
                {item.systolicBpDeltaMmHg !== 0 && (
                  <span className="text-cyan-400">{item.systolicBpDeltaMmHg} mmHg SBP</span>
                )}
              </div>
            </div>
          </div>
        ))}
      </div>

      {/* Counterfactual Summary Bar */}
      <div className="mt-4 pt-3 border-t border-slate-800 flex items-center justify-between text-xs text-slate-400">
        <div>
          Active in twin simulation:{' '}
          <strong className="text-cyan-300 font-semibold">{activeCount} of {interventions.length} interventions</strong>
        </div>
        <div className="text-[11px] text-slate-500">
          Powered by Closed-Loop Counterfactual ODE Engine
        </div>
      </div>
    </div>
  );
};
