import pptxgen from '../node_modules/pptxgenjs/dist/pptxgen.cjs.js';
import path from 'path';
import fs from 'fs';

const pptx = new pptxgen();

pptx.title = 'CardioGlyc AI: System Architecture Diagram';
pptx.subject = 'Happiest Health Digital Twin Challenge 2026';
pptx.author = 'Team GlycoNova - BIT';
pptx.company = 'Happiest Health Summit 2026';
pptx.layout = 'LAYOUT_16x9';

// Dark palette
const C_BG = '050814';
const C_CARD = '0d1527';
const C_BORDER = '1e293b';
const C_CYAN = '00f2fe';
const C_EMERALD = '10b981';
const C_BLUE = '38bdf8';
const C_AMBER = 'fbbf24';
const C_TEXT = 'f8fafc';
const C_MUTED = '94a3b8';

const slide = pptx.addSlide();
slide.background = { color: C_BG };

// Header Category
slide.addShape(pptx.ShapeType.roundRect, {
  x: 0.8,
  y: 0.35,
  w: 7.2,
  h: 0.28,
  fill: { color: '0c4a6e', transparency: 30 },
  line: { color: '0284c7', width: 1 },
});

slide.addText('HAPPIEST HEALTH • DIGITAL TWIN CHALLENGE 2026 | ARCHITECTURE DIAGRAM', {
  x: 0.9,
  y: 0.37,
  w: 7.0,
  h: 0.24,
  fontSize: 8.5,
  fontFace: 'Arial',
  bold: true,
  color: C_CYAN,
});

slide.addText('CardioGlyc AI: Closed-Loop System Architecture', {
  x: 0.8,
  y: 0.7,
  w: 11.6,
  h: 0.45,
  fontSize: 20,
  fontFace: 'Arial',
  bold: true,
  color: C_TEXT,
});

const stages = [
  {
    num: 'STAGE 1',
    title: 'MULTI-MODAL DATA INGESTION & PRIVACY (DPDP ACT 2023)',
    color: C_CYAN,
    items: [
      '• Longitudinal Static EHR: ICD-10 (E11, I10, E78), Labs (HbA1c, FPG, Lipids, eGFR, hs-CRP, Albuminuria)',
      '• Streaming Dynamic Wearables: 5-min Continuous Glucose Monitor (CGM), PPG Heart Rate, HRV RMSSD, ABPM, Accelerometer METs',
      '• Privacy Layer: Synthea/MIMIC synthetic cohorts mirroring ICMR-INDIAB epidemiology, zero PHI leakage, DPDP Act 2023 compliant'
    ],
    y: 1.3
  },
  {
    num: 'STAGE 2',
    title: 'CONTINUOUS BIOPHYSICAL ODE DIGITAL TWIN CORE',
    color: C_EMERALD,
    items: [
      '• Bergman Minimal Model (Glucose-Insulin): dG/dt = -(p1 + X + U_ex)G + p1*Gb + Ra(t) [RK4 numerical solver]',
      '• Gut Absorption & Muscle Translocation: Ra(t) = kAbs * D(t) decay; U_ex(t) = kEx * (METs - 1.0) GLUT-4 clearance',
      '• Two-Element Windkessel Hemodynamics: MAP = CO * R, Pulse Pressure PP ≈ SV / C (Arterial compliance & systemic vascular resistance)'
    ],
    y: 2.7
  },
  {
    num: 'STAGE 3',
    title: 'MULTI-TASK PREDICTIVE ENGINE & EXPLAINABILITY (XAI)',
    color: C_BLUE,
    items: [
      '• 2-Hour Adverse Excursion Classifier: Gradient-boosted ensemble predicting Hypo (<70 mg/dL) & Hyper (>220 mg/dL) (ROC-AUC 0.914)',
      '• Proactive Lead Time: Calibrated +42-minute early warning window allowing pre-emptive behavioral/clinical correction',
      '• 10-Year ASCVD Risk Score: Calibrated with 1.4x South Asian Multiplier (MASALA / INTERHEART cohorts) + SHAP Feature Attribution'
    ],
    y: 4.1
  },
  {
    num: 'STAGE 4',
    title: 'IN SILICO COUNTERFACTUAL SANDBOX & ABDM HL7 FHIR INTEROPERABILITY',
    color: C_AMBER,
    items: [
      '• In Silico What-If Sandbox: Instant evaluation of 20-min post-meal walking (-38% glucose spike), high-fiber millets, chronotherapy',
      '• Clinical Cockpit & Holographic Avatar: Real-time 3D anatomical twin with glycemic, cardiovascular, and autonomic status ribbons',
      '• National Interoperability: Official Ayushman Bharat Digital Mission (ABDM) ABHA ID, LOINC 14745-4 / 85354-9, HL7 FHIR R4 JSON bundles'
    ],
    y: 5.5
  }
];

stages.forEach(s => {
  slide.addShape(pptx.ShapeType.roundRect, {
    x: 0.8,
    y: s.y,
    w: 11.6,
    h: 1.25,
    fill: { color: C_CARD },
    line: { color: C_BORDER, width: 1.5 },
  });

  slide.addText(`${s.num}: ${s.title}`, {
    x: 1.1,
    y: s.y + 0.1,
    w: 11.0,
    h: 0.28,
    fontSize: 10.5,
    fontFace: 'Arial',
    bold: true,
    color: s.color,
  });

  slide.addText(s.items.join('\n'), {
    x: 1.1,
    y: s.y + 0.4,
    w: 11.0,
    h: 0.75,
    fontSize: 9.5,
    fontFace: 'Arial',
    color: C_TEXT,
  });
});

const outPathDesktop = path.resolve('presentation', 'architecture_diagram.pptx');
await pptx.writeFile({ fileName: outPathDesktop });
console.log(`Saved Architecture PPTX: ${outPathDesktop}`);
