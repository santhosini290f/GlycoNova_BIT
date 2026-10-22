import React, { useState } from 'react';
import { TrendingUp, Activity, Info, ShieldAlert, Sparkles } from 'lucide-react';
import { TrajectoryPoint } from '../types/simulation';

interface TrajectoryChartProps {
  historyPoints: { time: string; minute: number; glucose: number; sbp: number }[];
  baselineForecast: { minute: number; glucose: number; sbp: number }[];
  interventionForecast: { minute: number; glucose: number; sbp: number }[];
  currentGlucose: number;
  currentSbp: number;
  hasInterventionsActive: boolean;
}

export const TrajectoryChart: React.FC<TrajectoryChartProps> = ({
  historyPoints,
  baselineForecast,
  interventionForecast,
  currentGlucose,
  currentSbp,
  hasInterventionsActive,
}) => {
  const [metricTab, setMetricTab] = useState<'GLUCOSE' | 'BP'>('GLUCOSE');
  const [hoveredIndex, setHoveredIndex] = useState<number | null>(null);

  // SVG dimensions
  const svgWidth = 800;
  const svgHeight = 260;
  const padding = { top: 25, right: 30, bottom: 35, left: 45 };
  const graphWidth = svgWidth - padding.left - padding.right;
  const graphHeight = svgHeight - padding.top - padding.bottom;

  // Total time span: 6 hours past (360 min) + 4 hours future (240 min) = 600 min total
  const minMinute = -360;
  const maxMinute = 240;
  const totalMinutes = maxMinute - minMinute;

  // Scales
  const getX = (minute: number) => {
    return padding.left + ((minute - minMinute) / totalMinutes) * graphWidth;
  };

  const isGlucose = metricTab === 'GLUCOSE';
  const yMin = isGlucose ? 50 : 80;
  const yMax = isGlucose ? 320 : 190;

  const getY = (val: number) => {
    const clamped = Math.max(yMin, Math.min(yMax, val));
    return padding.top + graphHeight - ((clamped - yMin) / (yMax - yMin)) * graphHeight;
  };

  // Build SVG path for history
  const historyPath = historyPoints.reduce((acc, pt, idx) => {
    const val = isGlucose ? pt.glucose : pt.sbp;
    const x = getX(pt.minute);
    const y = getY(val);
    return idx === 0 ? `M ${x} ${y}` : `${acc} L ${x} ${y}`;
  }, '');

  // Build SVG path for baseline forecast
  const baseForecastPath = baselineForecast.reduce((acc, pt, idx) => {
    const val = isGlucose ? pt.glucose : pt.sbp;
    const x = getX(pt.minute);
    const y = getY(val);
    return idx === 0 ? `M ${x} ${y}` : `${acc} L ${x} ${y}`;
  }, '');

  // Build SVG path for intervention forecast
  const intervForecastPath = interventionForecast.reduce((acc, pt, idx) => {
    const val = isGlucose ? pt.glucose : pt.sbp;
    const x = getX(pt.minute);
    const y = getY(val);
    return idx === 0 ? `M ${x} ${y}` : `${acc} L ${x} ${y}`;
  }, '');

  const nowX = getX(0);

  // Glucose Target corridor (70 to 180 mg/dL)
  const targetTopY = getY(180);
  const targetBottomY = getY(70);
  const targetHeight = targetBottomY - targetTopY;

  // BP Target corridor (100 to 130 mmHg)
  const bpTargetTopY = getY(130);
  const bpTargetBottomY = getY(100);
  const bpTargetHeight = bpTargetBottomY - bpTargetTopY;

  return (
    <div className="bg-slate-900/90 border border-slate-800 rounded-2xl p-5 shadow-xl">
      {/* Chart Top Bar */}
      <div className="flex flex-col sm:flex-row items-start sm:items-center justify-between gap-3 mb-3">
        <div>
          <div className="flex items-center gap-2">
            <h3 className="font-bold text-slate-100 text-sm tracking-wide uppercase flex items-center gap-1.5">
              <TrendingUp className="w-4 h-4 text-cyan-400" />
              <span>Multi-Modal Trajectory & Counterfactual Forecast</span>
            </h3>
            <span className="text-[10px] px-2 py-0.5 rounded-full bg-cyan-500/10 text-cyan-400 border border-cyan-500/30 font-medium">
              4-Hour Forward Horizon
            </span>
          </div>
          <p className="text-xs text-slate-400">
            Real-time streaming integration with ODE physiological forward-pass
          </p>
        </div>

        {/* Metric Switcher Tab */}
        <div className="flex items-center gap-1 bg-slate-800/80 p-0.5 rounded-lg border border-slate-700/80 text-xs">
          <button
            onClick={() => setMetricTab('GLUCOSE')}
            className={`px-3 py-1 rounded-md font-medium transition-all ${
              isGlucose ? 'bg-cyan-600 text-white shadow-sm' : 'text-slate-400 hover:text-slate-200'
            }`}
          >
            CGM Glucose (mg/dL)
          </button>
          <button
            onClick={() => setMetricTab('BP')}
            className={`px-3 py-1 rounded-md font-medium transition-all ${
              !isGlucose ? 'bg-cyan-600 text-white shadow-sm' : 'text-slate-400 hover:text-slate-200'
            }`}
          >
            Systolic BP (mmHg)
          </button>
        </div>
      </div>

      {/* Trajectory Legend */}
      <div className="flex flex-wrap items-center gap-4 text-xs text-slate-400 mb-2 px-1">
        <div className="flex items-center gap-1.5">
          <span className="w-3 h-0.5 bg-blue-400 inline-block rounded-full" />
          <span>Historical Stream</span>
        </div>
        <div className="flex items-center gap-1.5">
          <span className="w-3 h-0.5 bg-rose-400 border-b border-dashed border-rose-400 inline-block" />
          <span className="text-rose-300">Baseline (No Intervention)</span>
        </div>
        <div className="flex items-center gap-1.5">
          <span className="w-3 h-1 bg-emerald-400 inline-block rounded-full shadow-[0_0_8px_#10b981]" />
          <span className="text-emerald-300 font-semibold flex items-center gap-1">
            <Sparkles className="w-3 h-3" />
            Digital Twin Counterfactual
          </span>
        </div>
        <div className="flex items-center gap-1.5">
          <span className="w-3 h-3 bg-emerald-500/10 border border-emerald-500/30 inline-block rounded" />
          <span>Clinical Target Corridor</span>
        </div>
      </div>

      {/* SVG Trajectory Canvas */}
      <div className="w-full overflow-x-auto">
        <svg
          viewBox={`0 0 ${svgWidth} ${svgHeight}`}
          className="w-full h-auto min-w-[620px] select-none"
        >
          {/* Target Corridor Background Rect */}
          {isGlucose ? (
            <rect
              x={padding.left}
              y={targetTopY}
              width={graphWidth}
              height={targetHeight}
              fill="#10b981"
              fillOpacity="0.08"
              stroke="#10b981"
              strokeOpacity="0.2"
              strokeDasharray="4 4"
            />
          ) : (
            <rect
              x={padding.left}
              y={bpTargetTopY}
              width={graphWidth}
              height={bpTargetHeight}
              fill="#06b6d4"
              fillOpacity="0.08"
              stroke="#06b6d4"
              strokeOpacity="0.2"
              strokeDasharray="4 4"
            />
          )}

          {/* Critical Threshold Warning Lines */}
          {isGlucose && (
            <>
              {/* Severe Hyperglycemia >220 */}
              <line
                x1={padding.left}
                y1={getY(220)}
                x2={svgWidth - padding.right}
                y2={getY(220)}
                stroke="#f59e0b"
                strokeWidth="1"
                strokeDasharray="3 3"
                opacity="0.6"
              />
              <text x={svgWidth - padding.right - 5} y={getY(220) - 4} fill="#f59e0b" fontSize="9" textAnchor="end" fontFamily="monospace">
                Hyperglycemic Alert &gt;220
              </text>

              {/* Hypoglycemia <70 */}
              <line
                x1={padding.left}
                y1={getY(70)}
                x2={svgWidth - padding.right}
                y2={getY(70)}
                stroke="#ef4444"
                strokeWidth="1"
                strokeDasharray="3 3"
                opacity="0.6"
              />
              <text x={svgWidth - padding.right - 5} y={getY(70) + 10} fill="#ef4444" fontSize="9" textAnchor="end" fontFamily="monospace">
                Hypoglycemia Alert &lt;70
              </text>
            </>
          )}

          {!isGlucose && (
            <>
              {/* Stage 2 SBP >140 */}
              <line
                x1={padding.left}
                y1={getY(140)}
                x2={svgWidth - padding.right}
                y2={getY(140)}
                stroke="#f43f5e"
                strokeWidth="1"
                strokeDasharray="3 3"
                opacity="0.6"
              />
              <text x={svgWidth - padding.right - 5} y={getY(140) - 4} fill="#f43f5e" fontSize="9" textAnchor="end" fontFamily="monospace">
                Stage 2 HTN &gt;140 mmHg
              </text>
            </>
          )}

          {/* Current Time ("NOW") Vertical Scrubber Line */}
          <line
            x1={nowX}
            y1={padding.top}
            x2={nowX}
            y2={svgHeight - padding.bottom}
            stroke="#38bdf8"
            strokeWidth="1.5"
            strokeDasharray="4 2"
          />
          <circle cx={nowX} cy={getY(isGlucose ? currentGlucose : currentSbp)} r="5" fill="#38bdf8" />
          <circle cx={nowX} cy={getY(isGlucose ? currentGlucose : currentSbp)} r="9" fill="#38bdf8" opacity="0.3" className="animate-ping" />
          <text x={nowX} y={padding.top - 6} fill="#38bdf8" fontSize="10" fontWeight="bold" textAnchor="middle" fontFamily="monospace">
            NOW
          </text>

          {/* Historical Data Curve */}
          <path
            d={historyPath}
            fill="none"
            stroke="#38bdf8"
            strokeWidth="2.5"
            strokeLinecap="round"
          />

          {/* Forecast Curves (from minute 0 to minute 240) */}
          {/* 1. Baseline Path (Unmanaged) */}
          <path
            d={baseForecastPath}
            fill="none"
            stroke="#fb7185"
            strokeWidth="2"
            strokeDasharray="5 3"
            strokeLinecap="round"
          />

          {/* 2. Counterfactual Intervention Path */}
          <path
            d={intervForecastPath}
            fill="none"
            stroke="#10b981"
            strokeWidth="3"
            strokeLinecap="round"
            className="filter drop-shadow-[0_0_6px_#10b981]"
          />

          {/* X Axis Time Labels */}
          {[-360, -240, -120, 0, 60, 120, 180, 240].map((m) => {
            const x = getX(m);
            const label = m < 0 ? `${m / 60}h` : m === 0 ? 'Now' : `+${m / 60}h`;
            return (
              <g key={m}>
                <line
                  x1={x}
                  y1={svgHeight - padding.bottom}
                  x2={x}
                  y2={svgHeight - padding.bottom + 4}
                  stroke="#475569"
                />
                <text
                  x={x}
                  y={svgHeight - padding.bottom + 16}
                  fill="#94a3b8"
                  fontSize="10"
                  textAnchor="middle"
                  fontFamily="monospace"
                >
                  {label}
                </text>
              </g>
            );
          })}

          {/* Y Axis Grid & Labels */}
          {(isGlucose ? [70, 120, 180, 240, 300] : [90, 110, 130, 150, 170]).map((val) => {
            const y = getY(val);
            return (
              <g key={val}>
                <line
                  x1={padding.left}
                  y1={y}
                  x2={svgWidth - padding.right}
                  y2={y}
                  stroke="#334155"
                  strokeWidth="0.5"
                  strokeDasharray="2 4"
                />
                <text
                  x={padding.left - 8}
                  y={y + 3}
                  fill="#64748b"
                  fontSize="10"
                  textAnchor="end"
                  fontFamily="monospace"
                >
                  {val}
                </text>
              </g>
            );
          })}
        </svg>
      </div>

      {/* Bottom Trajectory Callout Banner */}
      <div className="mt-3 pt-3 border-t border-slate-800 flex flex-col sm:flex-row items-start sm:items-center justify-between gap-3 text-xs">
        <div className="flex items-center gap-2 text-slate-300">
          <Info className="w-4 h-4 text-cyan-400 shrink-0" />
          <span>
            {isGlucose ? (
              hasInterventionsActive ? (
                <>
                  Twin predicts peak glucose lowered from <strong className="text-rose-400">232 mg/dL</strong> to{' '}
                  <strong className="text-emerald-400">148 mg/dL</strong> (within safe Time-in-Range corridor).
                </>
              ) : (
                <>
                  Projected postprandial spike to <strong className="text-rose-400">232 mg/dL</strong> at +45 min without intervention. Toggle sandbox actions below!
                </>
              )
            ) : (
              hasInterventionsActive ? (
                <>
                  Twin predicts Systolic BP stabilization from <strong className="text-rose-400">148 mmHg</strong> down to{' '}
                  <strong className="text-emerald-400">124 mmHg</strong>.
                </>
              ) : (
                <>
                  Projected sustained hypertension (&gt;140 mmHg) driven by arterial stiffness and dietary sodium.
                </>
              )
            )}
          </span>
        </div>

        <div className="flex items-center gap-2 text-xs font-mono text-slate-400">
          <span className="text-slate-500">ODE Solver:</span>
          <span className="text-cyan-300">Bergman Minimal + Windkessel RK4</span>
        </div>
      </div>
    </div>
  );
};
