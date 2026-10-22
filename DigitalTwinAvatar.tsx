import React, { useState } from 'react';
import { Heart, Brain, Flame, Activity, ShieldCheck, AlertTriangle } from 'lucide-react';
import { MultiModalSensorSnapshot } from '../types/sensors';
import { ResilienceScore } from '../types/prediction';

interface DigitalTwinAvatarProps {
  snapshot: MultiModalSensorSnapshot;
  resilience: ResilienceScore;
  hasInterventionsActive: boolean;
}

export const DigitalTwinAvatar: React.FC<DigitalTwinAvatarProps> = ({
  snapshot,
  resilience,
  hasInterventionsActive,
}) => {
  const [activeOrgan, setActiveOrgan] = useState<'HEART' | 'PANCREAS' | 'BRAIN' | 'PERIPHERAL' | null>('HEART');

  const { cgm, bp, autonomic, activity } = snapshot;

  // Heart pulse animation rate computed from current heart rate
  const pulseDurationSec = Math.max(0.4, 60 / autonomic.heartRate);

  return (
    <div className="bg-slate-900/90 border border-slate-800 rounded-2xl p-5 flex flex-col justify-between shadow-xl relative overflow-hidden">
      {/* Background ambient physiological glow */}
      <div className={`absolute -right-16 -top-16 w-56 h-56 rounded-full blur-3xl opacity-20 pointer-events-none transition-colors ${
        cgm.glucose > 180 || bp.systolic > 140 ? 'bg-rose-500' : 'bg-cyan-500'
      }`} />
      
      {/* Header */}
      <div className="flex items-center justify-between border-b border-slate-800 pb-3 mb-4">
        <div>
          <div className="flex items-center gap-2">
            <h3 className="font-bold text-slate-100 text-sm tracking-wide uppercase flex items-center gap-1.5">
              <Activity className="w-4 h-4 text-cyan-400" />
              <span>Physiological Twin Core</span>
            </h3>
            {hasInterventionsActive && (
              <span className="text-[10px] px-2 py-0.5 rounded-full bg-emerald-500/20 text-emerald-300 border border-emerald-500/40 font-semibold animate-pulse">
                Twin In Silico Active
              </span>
            )}
          </div>
          <p className="text-xs text-slate-400">Dynamic closed-loop virtual replica</p>
        </div>
        <div className="flex items-center gap-1.5 text-xs bg-slate-800/80 px-2.5 py-1 rounded-lg border border-slate-700">
          <span className="text-slate-400">Homeostasis:</span>
          <span className={`font-semibold ${
            resilience.compositeScore >= 75 ? 'text-emerald-400' : resilience.compositeScore >= 50 ? 'text-amber-400' : 'text-rose-400'
          }`}>
            {resilience.compositeScore}/100
          </span>
        </div>
      </div>

      {/* Interactive Anatomical Silhouette */}
      <div className="relative flex items-center justify-center py-2 min-h-[300px]">
        {/* SVG Human Silhouette with Holographic Vascular Grid */}
        <svg viewBox="0 0 240 380" className="w-48 h-72 drop-shadow-2xl">
          <defs>
            <linearGradient id="bodyGlow" x1="0%" y1="0%" x2="100%" y2="100%">
              <stop offset="0%" stopColor="#0284c7" stopOpacity="0.4" />
              <stop offset="100%" stopColor="#0369a1" stopOpacity="0.1" />
            </linearGradient>
            <linearGradient id="arterialStream" x1="0%" y1="0%" x2="0%" y2="100%">
              <stop offset="0%" stopColor="#ef4444" stopOpacity="0.8" />
              <stop offset="100%" stopColor="#3b82f6" stopOpacity="0.8" />
            </linearGradient>
            <filter id="neonBlur" x="-20%" y="-20%" width="140%" height="140%">
              <feGaussianBlur stdDeviation="3" result="blur" />
              <feMerge>
                <feMergeNode in="blur" />
                <feMergeNode in="SourceGraphic" />
              </feMerge>
            </filter>
          </defs>

          {/* Stylized Body Outline */}
          {/* Head */}
          <circle cx="120" cy="40" r="26" fill="url(#bodyGlow)" stroke="#38bdf8" strokeWidth="1.5" strokeDasharray="3 3" />
          {/* Neck */}
          <path d="M112,66 L112,80 L128,80 L128,66 Z" fill="url(#bodyGlow)" stroke="#38bdf8" strokeWidth="1" />
          {/* Torso */}
          <path d="M78,80 C78,80 60,110 60,160 C60,190 75,220 95,230 L95,260 L145,260 L145,230 C165,220 180,190 180,160 C180,110 162,80 162,80 Z" 
                fill="url(#bodyGlow)" stroke="#38bdf8" strokeWidth="1.5" />
          {/* Arms */}
          <path d="M60,110 C50,140 45,180 40,225" stroke="#38bdf8" strokeWidth="2" strokeLinecap="round" fill="none" opacity="0.6" />
          <path d="M180,110 C190,140 195,180 200,225" stroke="#38bdf8" strokeWidth="2" strokeLinecap="round" fill="none" opacity="0.6" />
          {/* Legs */}
          <path d="M98,260 L90,360" stroke="#38bdf8" strokeWidth="2.5" strokeLinecap="round" fill="none" opacity="0.6" />
          <path d="M142,260 L150,360" stroke="#38bdf8" strokeWidth="2.5" strokeLinecap="round" fill="none" opacity="0.6" />

          {/* Major Vascular Pathways (Aorta & Femoral System) */}
          <path d="M120,120 L120,240 M120,240 L102,340 M120,240 L138,340" 
                stroke="url(#arterialStream)" strokeWidth="2" strokeDasharray="4 2" className="animate-pulse" />

          {/* Organ Interactive Nodes */}
          {/* 1. BRAIN NODE */}
          <g className="cursor-pointer" onClick={() => setActiveOrgan('BRAIN')}>
            <circle cx="120" cy="40" r="14" fill="#0f172a" stroke={activeOrgan === 'BRAIN' ? '#38bdf8' : '#0284c7'} strokeWidth="2" filter="url(#neonBlur)" />
            <circle cx="120" cy="40" r="6" fill="#38bdf8" className="animate-ping opacity-75" />
          </g>

          {/* 2. HEART NODE (Pulsing at heart rate) */}
          <g className="cursor-pointer" onClick={() => setActiveOrgan('HEART')} style={{ transformOrigin: '128px 125px' }}>
            <circle cx="128" cy="125" r="18" fill="#1e1b4b" stroke={bp.systolic > 140 ? '#f43f5e' : '#ec4899'} strokeWidth="2" filter="url(#neonBlur)" />
            <circle cx="128" cy="125" r="8" fill={bp.systolic > 140 ? '#ef4444' : '#f43f5e'} 
                    style={{ animation: `pulse-subtle ${pulseDurationSec}s infinite ease-in-out` }} />
          </g>

          {/* 3. PANCREAS / LIVER NODE */}
          <g className="cursor-pointer" onClick={() => setActiveOrgan('PANCREAS')}>
            <circle cx="114" cy="175" r="16" fill="#1e293b" stroke={cgm.glucose > 180 ? '#f59e0b' : '#10b981'} strokeWidth="2" filter="url(#neonBlur)" />
            <circle cx="114" cy="175" r="7" fill={cgm.glucose > 180 ? '#fbbf24' : '#34d399'} className="animate-pulse" />
          </g>

          {/* 4. PERIPHERAL / SKELETAL MUSCLE NODE */}
          <g className="cursor-pointer" onClick={() => setActiveOrgan('PERIPHERAL')}>
            <circle cx="94" cy="300" r="12" fill="#0f172a" stroke={activeOrgan === 'PERIPHERAL' ? '#a855f7' : '#6366f1'} strokeWidth="1.5" />
            <circle cx="94" cy="300" r="5" fill="#a855f7" />
          </g>
        </svg>

        {/* Dynamic Tooltip callouts based on activeOrgan */}
        <div className="absolute top-2 right-2 max-w-[200px] bg-slate-800/95 border border-slate-700/80 rounded-xl p-3 shadow-xl backdrop-blur-md text-xs">
          {activeOrgan === 'HEART' && (
            <div>
              <div className="flex items-center gap-1.5 text-rose-400 font-semibold mb-1">
                <Heart className="w-3.5 h-3.5 fill-rose-500" />
                <span>Myocardial Core</span>
              </div>
              <div className="space-y-1 text-slate-300 text-[11px]">
                <div className="flex justify-between">
                  <span className="text-slate-400">Heart Rate:</span>
                  <span className="font-mono font-bold">{autonomic.heartRate} BPM</span>
                </div>
                <div className="flex justify-between">
                  <span className="text-slate-400">Arterial BP:</span>
                  <span className="font-mono font-bold">{bp.systolic}/{bp.diastolic}</span>
                </div>
                <div className="flex justify-between">
                  <span className="text-slate-400">Windkessel MAP:</span>
                  <span className="font-mono">{bp.meanArterialPressure} mmHg</span>
                </div>
                <div className="flex justify-between">
                  <span className="text-slate-400">Pulse Pressure:</span>
                  <span className="font-mono">{bp.pulsePressure} mmHg</span>
                </div>
              </div>
            </div>
          )}

          {activeOrgan === 'PANCREAS' && (
            <div>
              <div className="flex items-center gap-1.5 text-emerald-400 font-semibold mb-1">
                <Flame className="w-3.5 h-3.5 fill-emerald-500" />
                <span>Endocrine Pancreas</span>
              </div>
              <div className="space-y-1 text-slate-300 text-[11px]">
                <div className="flex justify-between">
                  <span className="text-slate-400">Plasma Glucose:</span>
                  <span className="font-mono font-bold text-amber-300">{cgm.glucose} mg/dL</span>
                </div>
                <div className="flex justify-between">
                  <span className="text-slate-400">dG/dt Drift:</span>
                  <span className="font-mono">{cgm.rateOfChange > 0 ? `+${cgm.rateOfChange}` : cgm.rateOfChange} mg/dL/m</span>
                </div>
                <div className="flex justify-between">
                  <span className="text-slate-400">Bergman SI:</span>
                  <span className="font-mono text-cyan-300">Reduced (T2D)</span>
                </div>
                <div className="flex justify-between">
                  <span className="text-slate-400">Glycemic CV:</span>
                  <span className="font-mono">{cgm.glycemicVariabilityCV}%</span>
                </div>
              </div>
            </div>
          )}

          {activeOrgan === 'BRAIN' && (
            <div>
              <div className="flex items-center gap-1.5 text-cyan-400 font-semibold mb-1">
                <Brain className="w-3.5 h-3.5 text-cyan-400" />
                <span>Autonomic Nervous System</span>
              </div>
              <div className="space-y-1 text-slate-300 text-[11px]">
                <div className="flex justify-between">
                  <span className="text-slate-400">HRV RMSSD:</span>
                  <span className="font-mono font-bold">{autonomic.hrvRmssd} ms</span>
                </div>
                <div className="flex justify-between">
                  <span className="text-slate-400">Vagal Reserve:</span>
                  <span className="font-mono">{autonomic.hrvRmssd > 35 ? 'Moderate' : 'Suppressed'}</span>
                </div>
                <div className="flex justify-between">
                  <span className="text-slate-400">Stress Index:</span>
                  <span className="font-mono">{activity.stressScore}/100</span>
                </div>
                <div className="flex justify-between">
                  <span className="text-slate-400">Sympathetic:</span>
                  <span className="font-mono text-amber-300">{activity.stressScore > 50 ? 'Hyperactive' : 'Balanced'}</span>
                </div>
              </div>
            </div>
          )}

          {activeOrgan === 'PERIPHERAL' && (
            <div>
              <div className="flex items-center gap-1.5 text-purple-400 font-semibold mb-1">
                <Activity className="w-3.5 h-3.5" />
                <span>Peripheral Vasculature</span>
              </div>
              <div className="space-y-1 text-slate-300 text-[11px]">
                <div className="flex justify-between">
                  <span className="text-slate-400">Current METs:</span>
                  <span className="font-mono font-bold">{activity.currentMets} METs</span>
                </div>
                <div className="flex justify-between">
                  <span className="text-slate-400">GLUT-4 Uptake:</span>
                  <span className="font-mono">{activity.currentMets > 2.0 ? 'Active (Exercise)' : 'Basal'}</span>
                </div>
                <div className="flex justify-between">
                  <span className="text-slate-400">SVR (Resistance):</span>
                  <span className="font-mono">Elevated</span>
                </div>
              </div>
            </div>
          )}
        </div>
      </div>

      {/* Organ Switcher Badges */}
      <div className="grid grid-cols-4 gap-1.5 pt-2 border-t border-slate-800 text-[11px]">
        <button
          onClick={() => setActiveOrgan('HEART')}
          className={`py-1.5 px-1 rounded-lg flex flex-col items-center justify-center transition-all ${
            activeOrgan === 'HEART' ? 'bg-rose-500/20 text-rose-300 border border-rose-500/40' : 'bg-slate-800/60 text-slate-400 hover:text-slate-200'
          }`}
        >
          <Heart className="w-3.5 h-3.5 mb-0.5" />
          <span>Heart</span>
        </button>
        <button
          onClick={() => setActiveOrgan('PANCREAS')}
          className={`py-1.5 px-1 rounded-lg flex flex-col items-center justify-center transition-all ${
            activeOrgan === 'PANCREAS' ? 'bg-emerald-500/20 text-emerald-300 border border-emerald-500/40' : 'bg-slate-800/60 text-slate-400 hover:text-slate-200'
          }`}
        >
          <Flame className="w-3.5 h-3.5 mb-0.5" />
          <span>Pancreas</span>
        </button>
        <button
          onClick={() => setActiveOrgan('BRAIN')}
          className={`py-1.5 px-1 rounded-lg flex flex-col items-center justify-center transition-all ${
            activeOrgan === 'BRAIN' ? 'bg-cyan-500/20 text-cyan-300 border border-cyan-500/40' : 'bg-slate-800/60 text-slate-400 hover:text-slate-200'
          }`}
        >
          <Brain className="w-3.5 h-3.5 mb-0.5" />
          <span>Brain</span>
        </button>
        <button
          onClick={() => setActiveOrgan('PERIPHERAL')}
          className={`py-1.5 px-1 rounded-lg flex flex-col items-center justify-center transition-all ${
            activeOrgan === 'PERIPHERAL' ? 'bg-purple-500/20 text-purple-300 border border-purple-500/40' : 'bg-slate-800/60 text-slate-400 hover:text-slate-200'
          }`}
        >
          <Activity className="w-3.5 h-3.5 mb-0.5" />
          <span>Muscles</span>
        </button>
      </div>
    </div>
  );
};
