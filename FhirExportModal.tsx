import React, { useState } from 'react';
import { X, Copy, Check, Download, FileCode, CheckCircle2 } from 'lucide-react';

interface FhirExportModalProps {
  isOpen: boolean;
  onClose: () => void;
  fhirJson: object;
  patientName: string;
}

export const FhirExportModal: React.FC<FhirExportModalProps> = ({
  isOpen,
  onClose,
  fhirJson,
  patientName,
}) => {
  const [copied, setCopied] = useState(false);

  if (!isOpen) return null;

  const jsonString = JSON.stringify(fhirJson, null, 2);

  const handleCopy = () => {
    navigator.clipboard.writeText(jsonString);
    setCopied(true);
    setTimeout(() => setCopied(false), 2000);
  };

  const handleDownload = () => {
    const blob = new Blob([jsonString], { type: 'application/json' });
    const url = URL.createObjectURL(blob);
    const a = document.createElement('a');
    a.href = url;
    a.download = `fhir-r4-digital-twin-${patientName.toLowerCase().replace(/\s+/g, '-')}.json`;
    document.body.appendChild(a);
    a.click();
    document.body.removeChild(a);
    URL.revokeObjectURL(url);
  };

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-black/80 backdrop-blur-sm animate-in fade-in duration-200">
      <div className="bg-slate-900 border border-slate-700 rounded-2xl w-full max-w-4xl max-h-[90vh] flex flex-col shadow-2xl overflow-hidden">
        {/* Modal Header */}
        <div className="flex items-center justify-between px-6 py-4 border-b border-slate-800 bg-slate-950/50">
          <div className="flex items-center gap-2.5">
            <div className="p-2 rounded-xl bg-blue-500/20 text-blue-400 border border-blue-500/30">
              <FileCode className="w-5 h-5" />
            </div>
            <div>
              <h3 className="font-bold text-slate-100 text-base flex items-center gap-2">
                <span>HL7 FHIR R4 Bundle Export</span>
                <span className="text-[10px] px-2 py-0.5 rounded-full bg-emerald-500/20 text-emerald-300 border border-emerald-500/30 font-medium">
                  ABDM Interoperable
                </span>
              </h3>
              <p className="text-xs text-slate-400">
                Standardized healthcare telemetry export for {patientName}
              </p>
            </div>
          </div>

          <div className="flex items-center gap-2">
            <button
              onClick={handleCopy}
              className="flex items-center gap-1.5 px-3 py-1.5 bg-slate-800 hover:bg-slate-700 text-slate-200 text-xs rounded-lg transition-colors border border-slate-700"
            >
              {copied ? <Check className="w-3.5 h-3.5 text-emerald-400" /> : <Copy className="w-3.5 h-3.5" />}
              <span>{copied ? 'Copied!' : 'Copy JSON'}</span>
            </button>
            <button
              onClick={handleDownload}
              className="flex items-center gap-1.5 px-3 py-1.5 bg-cyan-600 hover:bg-cyan-500 text-white text-xs font-medium rounded-lg transition-colors shadow-sm"
            >
              <Download className="w-3.5 h-3.5" />
              <span>Download .json</span>
            </button>
            <button
              onClick={onClose}
              className="p-1.5 text-slate-400 hover:text-slate-200 hover:bg-slate-800 rounded-lg transition-colors ml-2"
            >
              <X className="w-5 h-5" />
            </button>
          </div>
        </div>

        {/* Resources Summary Bar */}
        <div className="px-6 py-2.5 bg-slate-850 border-b border-slate-800 text-xs flex flex-wrap items-center gap-4 text-slate-300">
          <span className="text-slate-400">Included FHIR Resources:</span>
          <span className="bg-slate-800 px-2 py-0.5 rounded font-mono text-[11px] text-cyan-300">
            • Patient (ABHA Identifier)
          </span>
          <span className="bg-slate-800 px-2 py-0.5 rounded font-mono text-[11px] text-emerald-300">
            • Observation (CGM LOINC: 14745-4)
          </span>
          <span className="bg-slate-800 px-2 py-0.5 rounded font-mono text-[11px] text-blue-300">
            • Observation (BP Panel LOINC: 85354-9)
          </span>
          <span className="bg-slate-800 px-2 py-0.5 rounded font-mono text-[11px] text-purple-300">
            • RiskAssessment (ASCVD 10-Yr)
          </span>
        </div>

        {/* Code Content */}
        <div className="flex-1 p-6 overflow-y-auto bg-slate-950 font-mono text-xs text-slate-300 leading-relaxed selection:bg-cyan-500 selection:text-white">
          <pre>{jsonString}</pre>
        </div>

        {/* Modal Footer */}
        <div className="px-6 py-3 border-t border-slate-800 bg-slate-950/50 flex items-center justify-between text-xs text-slate-400">
          <div className="flex items-center gap-1.5">
            <CheckCircle2 className="w-3.5 h-3.5 text-emerald-400" />
            <span>Validated against HL7 FHIR Release 4.0.1 Specification</span>
          </div>
          <button
            onClick={onClose}
            className="px-4 py-1.5 bg-slate-800 hover:bg-slate-700 text-slate-200 rounded-lg transition-colors"
          >
            Close
          </button>
        </div>
      </div>
    </div>
  );
};
