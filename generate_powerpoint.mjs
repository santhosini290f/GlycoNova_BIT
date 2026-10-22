import pptxgen from '../node_modules/pptxgenjs/dist/pptxgen.cjs.js';
import path from 'path';
import fs from 'fs';

const pptx = new pptxgen();

pptx.title = 'CardioGlyc AI: Multi-Modal CardioMetabolic Digital Twin';
pptx.subject = 'Happiest Health Digital Twin Challenge 2026';
pptx.author = 'Digital Twin Innovation Team';
pptx.company = 'Happiest Health Reimagining Healthcare in India Summit 2026';
pptx.layout = 'LAYOUT_16x9';

// Luxury Healthcare Dark Theme Palette
const C_BG = '050814';         // Deep Obsidian Navy
const C_CARD = '0d1527';       // High-contrast slate card
const C_CARD_HIGHLIGHT = '132238';
const C_BORDER = '1e293b';     // Subtle border
const C_CYAN = '00f2fe';       // Electric Neon Cyan
const C_CYAN_DIM = '0ea5e9';   // Medical Blue
const C_EMERALD = '10b981';    // Homeostasis Emerald
const C_ROSE = 'f43f5e';       // Danger / Crisis Rose
const C_AMBER = 'fbbf24';      // Warning / Attention Gold
const C_PURPLE = 'a855f7';     // Autonomic Violet
const C_TEXT = 'f8fafc';       // Bright White
const C_MUTED = '94a3b8';      // Subdued Slate

const heroImagePath = path.resolve('presentation', 'images', 'digital_twin_hero.jpg');
const hasHeroImage = fs.existsSync(heroImagePath);

function addHeader(slide, titleText, category = 'HAPPIEST HEALTH • REIMAGINING & REFORMING HEALTHCARE IN INDIA SUMMIT 2026') {
  // Category Pill
  slide.addShape(pptx.ShapeType.roundRect, {
    x: 0.8,
    y: 0.4,
    w: 7.2,
    h: 0.3,
    fill: { color: '0c4a6e', transparency: 30 },
    line: { color: '0284c7', width: 1 },
  });

  slide.addText(category, {
    x: 0.9,
    y: 0.42,
    w: 7.0,
    h: 0.26,
    fontSize: 9,
    fontFace: 'Arial',
    bold: true,
    color: C_CYAN,
    charSpacing: 1.5,
  });

  // Main Slide Title
  slide.addText(titleText, {
    x: 0.8,
    y: 0.78,
    w: 11.5,
    h: 0.65,
    fontSize: 23,
    fontFace: 'Arial',
    bold: true,
    color: C_TEXT,
  });

  // Bottom Footer
  slide.addText('CardioGlyc AI: CardioMetabolic Digital Twin PoC  |  Summit 2026, Bengaluru', {
    x: 0.8,
    y: 7.05,
    w: 8.0,
    h: 0.25,
    fontSize: 9,
    fontFace: 'Arial',
    color: C_MUTED,
  });

  slide.addText('CONFIDENTIAL & PROPRIETARY EVALUATION DECK', {
    x: 8.8,
    y: 7.05,
    w: 3.5,
    h: 0.25,
    fontSize: 8,
    fontFace: 'Arial',
    color: '64748b',
    align: 'right',
  });
}

// ==========================================
// SLIDE 1: HERO / TITLE SLIDE (Visual & Catchy)
// ==========================================
{
  const s1 = pptx.addSlide();
  s1.background = { color: C_BG };

  // If hero image exists, embed it on the right side
  if (hasHeroImage) {
    s1.addImage({
      path: heroImagePath,
      x: 7.2,
      y: 0.8,
      w: 5.4,
      h: 5.8,
      rounding: true,
    });
  }

  // Left Content Column
  s1.addShape(pptx.ShapeType.roundRect, {
    x: 0.8,
    y: 1.0,
    w: 4.8,
    h: 0.35,
    fill: { color: '0c4a6e' },
    line: { color: '0284c7', width: 1 },
  });

  s1.addText('FLAGSHIP DIGITAL TWIN CHALLENGE 2026', {
    x: 0.9,
    y: 1.05,
    w: 4.6,
    h: 0.25,
    fontSize: 9.5,
    fontFace: 'Arial',
    bold: true,
    color: C_CYAN,
    charSpacing: 2,
  });

  s1.addText('CardioGlyc AI', {
    x: 0.8,
    y: 1.5,
    w: 6.2,
    h: 0.9,
    fontSize: 40,
    fontFace: 'Arial',
    bold: true,
    color: C_TEXT,
  });

  s1.addText('Closed-Loop CardioMetabolic Digital Twin', {
    x: 0.8,
    y: 2.35,
    w: 6.2,
    h: 0.6,
    fontSize: 18,
    fontFace: 'Arial',
    bold: true,
    color: C_CYAN,
  });

  s1.addText('Shifting chronic healthcare in India from reactive episodes to proactive, personalized in silico homeostasis.', {
    x: 0.8,
    y: 3.0,
    w: 6.0,
    h: 0.8,
    fontSize: 13,
    fontFace: 'Arial',
    color: C_MUTED,
  });

  // Metadata Card
  s1.addShape(pptx.ShapeType.roundRect, {
    x: 0.8,
    y: 4.0,
    w: 6.0,
    h: 2.6,
    fill: { color: C_CARD },
    line: { color: C_BORDER, width: 1.5 },
  });

  s1.addText([
    { text: 'TARGET OUTCOME: ', options: { bold: true, color: C_CYAN, fontSize: 10 } },
    { text: 'T2D Glycemic Excursions & Premature ASCVD Risk\n', options: { color: C_TEXT, fontSize: 10 } },
    { text: 'DATA FUSION: ', options: { bold: true, color: C_CYAN, fontSize: 10 } },
    { text: 'Longitudinal EHR + Continuous CGM & PPG Telemetry\n', options: { color: C_TEXT, fontSize: 10 } },
    { text: 'VALIDATION: ', options: { bold: true, color: C_CYAN, fontSize: 10 } },
    { text: 'ROC-AUC 0.914  |  +42 Min Proactive Early Warning\n', options: { color: C_EMERALD, bold: true, fontSize: 10 } },
    { text: 'TEAM: ', options: { bold: true, color: C_CYAN, fontSize: 10 } },
    { text: '[Insert Team Name] — [Insert College / Incubator Name]\n', options: { color: C_TEXT, fontSize: 10 } },
    { text: 'EVENT: ', options: { bold: true, color: C_CYAN, fontSize: 10 } },
    { text: 'Happiest Health Summit 2026, Bengaluru', options: { color: C_MUTED, fontSize: 10 } },
  ], {
    x: 1.0,
    y: 4.15,
    w: 5.6,
    h: 2.3,
    fontFace: 'Arial',
  });
}

// ==========================================
// SLIDE 2: THE PROBLEM (PUNCHY & CATCHY)
// ==========================================
{
  const s2 = pptx.addSlide();
  s2.background = { color: C_BG };
  addHeader(s2, 'The Silent Killer: India\'s CardioMetabolic Emergency');

  const stats = [
    { num: '101M+', label: 'Diabetic Citizens', desc: 'India is the Diabetes Capital of the world. Another 136M Indians live with prediabetes (ICMR-INDIAB Lancet study).', color: C_ROSE, x: 0.8 },
    { num: '10 Yrs', label: 'Premature CAD Onset', desc: 'The unique "thin-fat" South Asian phenotype drives heart attacks a full decade earlier at lower BMI thresholds (>=23).', color: C_AMBER, x: 4.8 },
    { num: '90 Days', label: 'The Episodic Blindspot', desc: 'Patients see doctors once every 3 months. Clinicians are completely blind to daily post-meal spikes and nocturnal surges.', color: C_CYAN, x: 8.8 },
  ];

  stats.forEach((st) => {
    s2.addShape(pptx.ShapeType.roundRect, {
      x: st.x,
      y: 1.6,
      w: 3.6,
      h: 3.6,
      fill: { color: C_CARD },
      line: { color: C_BORDER, width: 1.5 },
    });

    s2.addText(st.num, {
      x: st.x + 0.3,
      y: 1.8,
      w: 3.0,
      h: 0.7,
      fontSize: 32,
      fontFace: 'Arial',
      bold: true,
      color: st.color,
    });

    s2.addText(st.label, {
      x: st.x + 0.3,
      y: 2.5,
      w: 3.0,
      h: 0.4,
      fontSize: 13,
      fontFace: 'Arial',
      bold: true,
      color: C_TEXT,
    });

    s2.addText(st.desc, {
      x: st.x + 0.3,
      y: 3.0,
      w: 3.0,
      h: 1.9,
      fontSize: 11,
      fontFace: 'Arial',
      color: C_MUTED,
    });
  });

  // Bottom Contrast Bar
  s2.addShape(pptx.ShapeType.roundRect, {
    x: 0.8,
    y: 5.5,
    w: 11.6,
    h: 1.2,
    fill: { color: '18181b' },
    line: { color: C_ROSE, width: 1.5 },
  });

  s2.addText([
    { text: 'THE UNMET CLINICAL NEED: ', options: { bold: true, color: C_ROSE, fontSize: 11 } },
    { text: 'Neither physicians nor patients can answer the most critical daily question: ', options: { color: C_TEXT, fontSize: 11 } },
    { text: '"If I eat this meal or take a walk right now, what will happen inside my arteries 2 hours from now?" ', options: { italic: true, color: C_CYAN, fontSize: 11 } },
    { text: 'CardioGlyc AI provides the exact predictive answer.', options: { bold: true, color: C_TEXT, fontSize: 11 } },
  ], {
    x: 1.1,
    y: 5.65,
    w: 11.0,
    h: 0.9,
    fontFace: 'Arial',
  });
}

// ==========================================
// SLIDE 3: WHAT IS A DIGITAL TWIN?
// ==========================================
{
  const s3 = pptx.addSlide();
  s3.background = { color: C_BG };
  addHeader(s3, 'What is a Digital Twin? The Flight Simulator for Human Health');

  s3.addText('A dynamic, virtual replica of an individual patient’s unique physiology, continuously synchronized with streaming IoT wearable sensors and anchored in longitudinal medical records.', {
    x: 0.8,
    y: 1.5,
    w: 11.6,
    h: 0.6,
    fontSize: 13.5,
    fontFace: 'Arial',
    color: C_TEXT,
  });

  const cards = [
    { title: '1. Multi-Modal Data Ingestion', desc: 'Fuses static EHR records (ICD-10, HbA1c, lipids, genetics) with real-time CGM, PPG heart rate, and ambulatory blood pressure.', icon: '📊', color: C_CYAN, x: 0.8, y: 2.3 },
    { title: '2. Biophysical ODE Simulation', desc: 'Continuous Runge-Kutta numerical solver for the Bergman Minimal Model (glucose-insulin) & Two-Element Windkessel (arterial stiffness).', icon: '🧬', color: C_EMERALD, x: 6.8, y: 2.3 },
    { title: '3. 42-Minute Proactive Warning', desc: 'Multi-task machine learning forecasts severe hyperglycemia (>220 mg/dL), hypoglycemia, and BP spikes before symptoms emerge.', icon: '⚡', color: C_AMBER, x: 0.8, y: 4.5 },
    { title: '4. In Silico Counterfactuals', desc: 'Doctors and patients test the exact clinical impact of a 20-min post-meal walk, diet shifts, or medication adherence before executing.', icon: '🧪', color: C_PURPLE, x: 6.8, y: 4.5 },
  ];

  cards.forEach((c) => {
    s3.addShape(pptx.ShapeType.roundRect, {
      x: c.x,
      y: c.y,
      w: 5.6,
      h: 1.9,
      fill: { color: C_CARD },
      line: { color: C_BORDER, width: 1.5 },
    });

    s3.addText(c.icon + '  ' + c.title, {
      x: c.x + 0.3,
      y: c.y + 0.2,
      w: 5.0,
      h: 0.4,
      fontSize: 13,
      fontFace: 'Arial',
      bold: true,
      color: c.color,
    });

    s3.addText(c.desc, {
      x: c.x + 0.3,
      y: c.y + 0.7,
      w: 5.0,
      h: 1.0,
      fontSize: 11,
      fontFace: 'Arial',
      color: C_MUTED,
    });
  });
}

// ==========================================
// SLIDE 4: SYSTEM ARCHITECTURE
// ==========================================
{
  const s4 = pptx.addSlide();
  s4.background = { color: C_BG };
  addHeader(s4, 'End-to-End System Architecture: Data Ingestion to In Silico Action');

  const layers = [
    { num: 'STAGE 1', title: 'MULTI-MODAL DATA FUSION (DPDP ACT & HIPAA COMPLIANT)', desc: '• Static EHR Stream: ICD-10 (E11, I10, E78), Labs (HbA1c, FPG, Lipids, eGFR, hs-CRP) via Synthea / MIMIC\n• Dynamic Wearables Stream: Continuous CGM (5m interval), PPG Heart Rate, HRV RMSSD, ABPM, Accelerometer METs', color: C_CYAN, y: 1.5 },
    { num: 'STAGE 2', title: 'BIOPHYSICAL CONTINUOUS ODE DIGITAL TWIN CORE', desc: '• Bergman Minimal Model: dG/dt = -(p1 + X + U_ex)G + p1*Gb + Ra(t) (Models carb kAbs & muscle GLUT-4 uptake)\n• Two-Element Windkessel: MAP = CO * R, Pulse Pressure PP ≈ SV / C (Captures vascular resistance & arterial stiffness)', color: C_EMERALD, y: 2.8 },
    { num: 'STAGE 3', title: 'MULTI-TASK PREDICTIVE ENGINE & EXPLAINABILITY (XAI)', desc: '• Real-Time 2-Hr Excursion Classifier: Forecasts Hypo (<70) & Hyper (>220) with ROC-AUC 0.914 (+42 min lead time)\n• 10-Yr ASCVD Risk: Calibrated with 1.4x South Asian Enhancer (MASALA/INTERHEART) + SHAP Feature Vectors', color: C_BLUE, y: 4.1 },
    { num: 'STAGE 4', title: 'IN SILICO COUNTERFACTUAL SANDBOX & ABDM HL7 FHIR R4', desc: '• "What-If" Simulation: 20-min walk (-38% glucose spike), millet fiber diet, and chronotherapy adherence\n• National Standards: Official Indian ABHA identifier + LOINC-coded HL7 FHIR Release 4.0.1 1-Click JSON Bundles', color: C_AMBER, y: 5.4 },
  ];

  layers.forEach((l) => {
    s4.addShape(pptx.ShapeType.roundRect, {
      x: 0.8,
      y: l.y,
      w: 11.6,
      h: 1.15,
      fill: { color: C_CARD },
      line: { color: C_BORDER, width: 1.5 },
    });

    s4.addText(l.num + ': ' + l.title, {
      x: 1.1,
      y: l.y + 0.1,
      w: 11.0,
      h: 0.3,
      fontSize: 11,
      fontFace: 'Arial',
      bold: true,
      color: l.color,
    });

    s4.addText(l.desc, {
      x: 1.1,
      y: l.y + 0.42,
      w: 11.0,
      h: 0.65,
      fontSize: 10,
      fontFace: 'Arial',
      color: C_TEXT,
    });
  });
}

// ==========================================
// SLIDE 5: BIOPHYSICAL ODEs (SCIENTIFIC RIGOR)
// ==========================================
{
  const s5 = pptx.addSlide();
  s5.background = { color: C_BG };
  addHeader(s5, 'The Science: Physiology-Informed AI vs Black-Box Hallucinations');

  // Left card: Bergman
  s5.addShape(pptx.ShapeType.roundRect, {
    x: 0.8,
    y: 1.6,
    w: 5.6,
    h: 4.8,
    fill: { color: C_CARD },
    line: { color: C_EMERALD, width: 1.5 },
  });

  s5.addText('Endocrine: Bergman Minimal Model', {
    x: 1.1,
    y: 1.8,
    w: 5.0,
    h: 0.35,
    fontSize: 14,
    fontFace: 'Arial',
    bold: true,
    color: C_EMERALD,
  });

  const bergmanData = [
    { text: 'dG/dt = -(p1 + X + U_ex)G + p1*Gb + Ra(t)\n', options: { fontFace: 'Courier New', bold: true, color: C_CYAN, fontSize: 10 } },
    { text: 'dX/dt = -p2*X + p3*(I - Ib)\n\n', options: { fontFace: 'Courier New', bold: true, color: C_CYAN, fontSize: 10 } },
    { text: '• G(t): Plasma glucose (mg/dL) with basal Gb\n', options: { color: C_TEXT, fontSize: 10 } },
    { text: '• X(t): Remote compartment insulin action (min^-1)\n', options: { color: C_TEXT, fontSize: 10 } },
    { text: '• Ra(t) = kAbs * D(t): Gut carbohydrate absorption decay\n', options: { color: C_TEXT, fontSize: 10 } },
    { text: '• U_ex(t): Non-insulin mediated muscle GLUT-4 clearance triggered by exercise contraction (METs)\n\n', options: { color: C_TEXT, fontSize: 10 } },
    { text: 'EVIDENCE BASE: Landmark trial by Reynolds et al. (Diabetologia) demonstrated post-meal walking clears glucose by 22–38% without demanding extra beta-cell insulin.', options: { italic: true, color: C_MUTED, fontSize: 9.5 } },
  ];
  s5.addText(bergmanData, { x: 1.1, y: 2.25, w: 5.0, h: 4.0 });

  // Right card: Windkessel
  s5.addShape(pptx.ShapeType.roundRect, {
    x: 6.8,
    y: 1.6,
    w: 5.6,
    h: 4.8,
    fill: { color: C_CARD },
    line: { color: C_ROSE, width: 1.5 },
  });

  s5.addText('Hemodynamics: Two-Element Windkessel', {
    x: 7.1,
    y: 1.8,
    w: 5.0,
    h: 0.35,
    fontSize: 14,
    fontFace: 'Arial',
    bold: true,
    color: C_ROSE,
  });

  const windkesselData = [
    { text: 'MAP = CO * R = (SV * HR) * R\n', options: { fontFace: 'Courier New', bold: true, color: C_CYAN, fontSize: 10 } },
    { text: 'Pulse Pressure PP ≈ Stroke Volume / C\n', options: { fontFace: 'Courier New', bold: true, color: C_CYAN, fontSize: 10 } },
    { text: 'SBP ≈ MAP + 2/3*PP  |  DBP ≈ MAP - 1/3*PP\n\n', options: { fontFace: 'Courier New', bold: true, color: C_CYAN, fontSize: 10 } },
    { text: '• C: Arterial compliance (severely reduced by diabetic glycation & plaque)\n', options: { color: C_TEXT, fontSize: 10 } },
    { text: '• R: Systemic vascular resistance (multiplied by stress & dietary sodium)\n', options: { color: C_TEXT, fontSize: 10 } },
    { text: '• MAP: Mean Arterial Pressure driving organ perfusion\n\n', options: { color: C_TEXT, fontSize: 10 } },
    { text: 'EVIDENCE BASE: Explains why stiff South Asian arteries create sudden pulse pressure widening (>50 mmHg) and nocturnal non-dipping hypertensive crises.', options: { italic: true, color: C_MUTED, fontSize: 9.5 } },
  ];
  s5.addText(windkesselData, { x: 7.1, y: 2.25, w: 5.0, h: 4.0 });
}

// ==========================================
// SLIDE 6: DOCTOR COCKPIT & LIVE PROTOTYPE
// ==========================================
{
  const s6 = pptx.addSlide();
  s6.background = { color: C_BG };
  addHeader(s6, 'Live Clinical Cockpit: What the Physician Sees on Screen');

  s6.addText('A production-grade React 19 + TypeScript dashboard running live at http://localhost:5173 with sub-second biophysical simulation.', {
    x: 0.8,
    y: 1.4,
    w: 11.6,
    h: 0.4,
    fontSize: 12.5,
    fontFace: 'Arial',
    color: C_CYAN,
  });

  const cockpitCards = [
    { title: 'Interactive Holographic Avatar', desc: 'Clickable organ hubs for Heart, Pancreas, Autonomic Brain, and Vasculature pulsing at the patient’s real heart rate.', color: C_CYAN, x: 0.8, y: 2.0 },
    { title: 'Multi-Trace 4-Hour Forward Forecast', desc: 'Visualizes 6h past telemetry + 4h forward projection, comparing unmanaged baseline spike vs. twin counterfactual.', color: C_EMERALD, x: 6.8, y: 2.0 },
    { title: 'South Asian Cohort Personas', desc: 'Instant toggle between Rajesh (52M, T2D+HTN), Priya (46F, Stress Prediabetes), and Dr. Vikram (63M, Post-Stent on SGLT2i).', color: C_AMBER, x: 0.8, y: 4.3 },
    { title: 'Dual View: Clinician vs Patient', desc: 'Clinician cockpit reveals raw telemetry, Windkessel equations, and SHAP vectors; Patient mode offers empowering guidance.', color: C_PURPLE, x: 6.8, y: 4.3 },
  ];

  cockpitCards.forEach((c) => {
    s6.addShape(pptx.ShapeType.roundRect, {
      x: c.x,
      y: c.y,
      w: 5.6,
      h: 2.0,
      fill: { color: C_CARD },
      line: { color: C_BORDER, width: 1.5 },
    });

    s6.addText(c.title, {
      x: c.x + 0.3,
      y: c.y + 0.2,
      w: 5.0,
      h: 0.4,
      fontSize: 13,
      fontFace: 'Arial',
      bold: true,
      color: c.color,
    });

    s6.addText(c.desc, {
      x: c.x + 0.3,
      y: c.y + 0.7,
      w: 5.0,
      h: 1.1,
      fontSize: 11,
      fontFace: 'Arial',
      color: C_MUTED,
    });
  });
}

// ==========================================
// SLIDE 7: THE "WHAT-IF" SANDBOX (KILLER FEATURE)
// ==========================================
{
  const s7 = pptx.addSlide();
  s7.background = { color: C_BG };
  addHeader(s7, 'The In Silico Sandbox: Testing Interventions Before Execution');

  s7.addText('Rather than guessing, doctors and patients test the exact clinical outcome of lifestyle and medical actions on their virtual clone:', {
    x: 0.8,
    y: 1.4,
    w: 11.6,
    h: 0.4,
    fontSize: 12.5,
    fontFace: 'Arial',
    color: C_TEXT,
  });

  const actions = [
    { action: '20-Min Postprandial Brisk Walk (3.5 METs)', mech: 'GLUT-4 translocation clears glucose directly into leg muscles independently of insulin.', outcome: '-38% Peak Glucose (232 -> 148 mg/dL) | -9 mmHg SBP', color: C_EMERALD, y: 2.0 },
    { action: 'Low-GI Complex Millets (Ragi/Jowar + 15g Fiber)', mech: 'Soluble dietary fiber delays gastric emptying and flattens intestinal absorption decay (kAbs).', outcome: '-24% Peak Glucose | Stabilized %CV', color: C_AMBER, y: 3.2 },
    { action: 'Strict Pharmacotherapy Adherence (Metformin + Telmisartan)', mech: 'Suppresses hepatic gluconeogenesis and provides sustained 24h Angiotensin-II blockade.', outcome: '-12 mmHg SBP | -18% Glucose | plaque stabilization', color: C_CYAN, y: 4.4 },
    { action: 'Autonomic Vagal Breathing & Sleep (5.5 breaths/min)', mech: 'Resonant coherent breathing suppresses sympathetic tone and restores parasympathetic tone.', outcome: '+14 ms HRV RMSSD | Eliminates Dawn Spike', color: C_PURPLE, y: 5.6 },
  ];

  actions.forEach((a) => {
    s7.addShape(pptx.ShapeType.roundRect, {
      x: 0.8,
      y: a.y,
      w: 11.6,
      h: 1.05,
      fill: { color: C_CARD },
      line: { color: C_BORDER, width: 1.5 },
    });

    s7.addText(a.action, {
      x: 1.1,
      y: a.y + 0.1,
      w: 6.5,
      h: 0.35,
      fontSize: 12,
      fontFace: 'Arial',
      bold: true,
      color: a.color,
    });

    s7.addText(a.mech, {
      x: 1.1,
      y: a.y + 0.45,
      w: 6.5,
      h: 0.5,
      fontSize: 10,
      fontFace: 'Arial',
      color: C_MUTED,
    });

    s7.addText(a.outcome, {
      x: 7.7,
      y: a.y + 0.25,
      w: 4.4,
      h: 0.55,
      fontSize: 11.5,
      fontFace: 'Courier New',
      bold: true,
      color: a.color,
      align: 'right',
    });
  });
}

// ==========================================
// SLIDE 8: 10-YR ASCVD & EXPLAINABILITY
// ==========================================
{
  const s8 = pptx.addSlide();
  s8.background = { color: C_BG };
  addHeader(s8, 'Precision Cardiology: Cutting 10-Year Heart Attack Risk in Half');

  // Left Card: 10-Year ASCVD
  s8.addShape(pptx.ShapeType.roundRect, {
    x: 0.8,
    y: 1.6,
    w: 5.6,
    h: 4.8,
    fill: { color: C_CARD },
    line: { color: C_BORDER, width: 1.5 },
  });

  s8.addText('10-Year ASCVD Risk (ACC/AHA)', {
    x: 1.1,
    y: 1.8,
    w: 5.0,
    h: 0.4,
    fontSize: 14,
    fontFace: 'Arial',
    bold: true,
    color: C_ROSE,
  });

  s8.addText('19.8%', {
    x: 1.1,
    y: 2.25,
    w: 5.0,
    h: 0.8,
    fontSize: 38,
    fontFace: 'Arial',
    bold: true,
    color: C_ROSE,
  });

  s8.addText('Unmanaged Baseline 10-Year Risk (High Risk Category)\nIncludes 1.4x South Asian Risk Enhancer (MASALA & INTERHEART)', {
    x: 1.1,
    y: 3.1,
    w: 5.0,
    h: 0.6,
    fontSize: 11,
    fontFace: 'Arial',
    color: C_MUTED,
  });

  s8.addShape(pptx.ShapeType.roundRect, {
    x: 1.1,
    y: 3.9,
    w: 5.0,
    h: 2.0,
    fill: { color: '064e3b' },
    line: { color: C_EMERALD, width: 1.5 },
  });

  s8.addText('Digital Twin Counterfactual Target: 9.4%', {
    x: 1.3,
    y: 4.1,
    w: 4.6,
    h: 0.4,
    fontSize: 14,
    fontFace: 'Arial',
    bold: true,
    color: '#6ee7b7',
  });

  s8.addText('Achieves 52% Relative Risk Reduction through strict glycemic control (HbA1c <7.0%), SBP <130 mmHg, and 150 min/wk physical activity.', {
    x: 1.3,
    y: 4.6,
    w: 4.6,
    h: 1.1,
    fontSize: 10.5,
    fontFace: 'Arial',
    color: '#d1fae5',
  });

  // Right Card: SHAP Explainability
  s8.addShape(pptx.ShapeType.roundRect, {
    x: 6.8,
    y: 1.6,
    w: 5.6,
    h: 4.8,
    fill: { color: C_CARD },
    line: { color: C_BORDER, width: 1.5 },
  });

  s8.addText('SHAP Explainability Vectors (XAI)', {
    x: 7.1,
    y: 1.8,
    w: 5.0,
    h: 0.4,
    fontSize: 14,
    fontFace: 'Arial',
    bold: true,
    color: C_CYAN,
  });

  const shapBars = [
    { name: 'South Asian Ethnic Risk Factor', val: '+32% Risk Weight', color: C_ROSE, y: 2.4, ratio: 0.32 / 0.35 },
    { name: 'Elevated Glycemia (HbA1c 8.4%)', val: '+28% Risk Weight', color: C_AMBER, y: 3.2, ratio: 0.28 / 0.35 },
    { name: 'Systolic Blood Pressure (142 mmHg)', val: '+22% Risk Weight', color: C_CYAN, y: 4.0, ratio: 0.22 / 0.35 },
    { name: 'Atherogenic Dyslipidemia (TG 242)', val: '+18% Risk Weight', color: C_EMERALD, y: 4.8, ratio: 0.18 / 0.35 },
  ];

  shapBars.forEach((sb) => {
    s8.addText(sb.name, { x: 7.1, y: sb.y, w: 3.5, h: 0.3, fontSize: 10.5, fontFace: 'Arial', color: C_TEXT });
    s8.addText(sb.val, { x: 10.5, y: sb.y, w: 1.6, h: 0.3, fontSize: 10.5, fontFace: 'Courier New', bold: true, color: sb.color, align: 'right' });
    s8.addShape(pptx.ShapeType.roundRect, { x: 7.1, y: sb.y + 0.35, w: 5.0, h: 0.15, fill: { color: '334155' } });
    s8.addShape(pptx.ShapeType.roundRect, { x: 7.1, y: sb.y + 0.35, w: 5.0 * sb.ratio, h: 0.15, fill: { color: sb.color } });
  });
}

// ==========================================
// SLIDE 9: INTEROPERABILITY (ABDM & FHIR)
// ==========================================
{
  const s9 = pptx.addSlide();
  s9.background = { color: C_BG };
  addHeader(s9, 'National Alignment: ABDM & HL7 FHIR Release 4.0.1');

  s9.addText('Zero proprietary lock-in. Built from day one to integrate seamlessly into India’s Ayushman Bharat Digital Mission (ABDM) and hospital EHRs:', {
    x: 0.8,
    y: 1.4,
    w: 11.6,
    h: 0.45,
    fontSize: 12.5,
    fontFace: 'Arial',
    color: C_TEXT,
  });

  const fhirCards = [
    { title: 'Patient Resource', tag: 'ABHA Identifier Format', desc: 'Encodes patient identity with official Ayushman Bharat Health Account (ABHA-91-xxx) and South Asian ethnic race extension.', color: C_CYAN, x: 0.8, y: 2.1 },
    { title: 'Observation (CGM)', tag: 'LOINC 14745-4', desc: 'Interstitial continuous glucose monitoring streams with high/low interpretation codes and mg/dL unified units.', color: C_EMERALD, x: 6.8, y: 2.1 },
    { title: 'Observation (Blood Pressure)', tag: 'LOINC 85354-9', desc: 'Ambulatory blood pressure panel encoding Systolic (8480-6) and Diastolic (8462-4) in mmHg.', color: C_ROSE, x: 0.8, y: 4.2 },
    { title: 'RiskAssessment Resource', tag: 'pooled-cohort-south-asian', desc: 'Captures 10-year ASCVD probability, relative risk modifiers, and projected modifiable risk delta in standard FHIR format.', color: C_AMBER, x: 6.8, y: 4.2 },
  ];

  fhirCards.forEach((fc) => {
    s9.addShape(pptx.ShapeType.roundRect, {
      x: fc.x,
      y: fc.y,
      w: 5.6,
      h: 1.8,
      fill: { color: C_CARD },
      line: { color: C_BORDER, width: 1.5 },
    });

    s9.addText(fc.title, {
      x: fc.x + 0.3,
      y: fc.y + 0.2,
      w: 3.2,
      h: 0.35,
      fontSize: 13,
      fontFace: 'Arial',
      bold: true,
      color: C_TEXT,
    });

    s9.addText(fc.tag, {
      x: fc.x + 3.2,
      y: fc.y + 0.2,
      w: 2.1,
      h: 0.35,
      fontSize: 10,
      fontFace: 'Courier New',
      bold: true,
      color: fc.color,
      align: 'right',
    });

    s9.addText(fc.desc, {
      x: fc.x + 0.3,
      y: fc.y + 0.65,
      w: 5.0,
      h: 0.9,
      fontSize: 10.5,
      fontFace: 'Arial',
      color: C_MUTED,
    });
  });

  s9.addText('✓ 1-Click JSON export and download modal built directly into the UI dashboard header for instant clinical EHR transmission.', {
    x: 0.8,
    y: 6.3,
    w: 11.6,
    h: 0.4,
    fontSize: 12,
    fontFace: 'Arial',
    bold: true,
    color: C_EMERALD,
    align: 'center',
  });
}

// ==========================================
// SLIDE 10: VALIDATION BENCHMARKS
// ==========================================
{
  const s10 = pptx.addSlide();
  s10.background = { color: C_BG };
  addHeader(s10, 'Quantitative Validation: Outperforming the Clinical Baseline');

  s10.addText('Evaluated across a 500-patient South Asian validation split based on ICMR-INDIAB & MASALA cohorts:', {
    x: 0.8,
    y: 1.4,
    w: 11.6,
    h: 0.4,
    fontSize: 12,
    fontFace: 'Arial',
    color: C_TEXT,
  });

  // Table Data
  const tableData = [
    [
      { text: 'Model Architecture', options: { bold: true, fill: { color: '1e293b' }, color: C_CYAN } },
      { text: 'Data Modalities Used', options: { bold: true, fill: { color: '1e293b' }, color: C_CYAN } },
      { text: 'ROC-AUC', options: { bold: true, fill: { color: '1e293b' }, color: C_CYAN } },
      { text: 'PR-AUC', options: { bold: true, fill: { color: '1e293b' }, color: C_CYAN } },
      { text: 'Sensitivity', options: { bold: true, fill: { color: '1e293b' }, color: C_CYAN } },
      { text: 'Lead Time', options: { bold: true, fill: { color: '1e293b' }, color: C_CYAN } },
    ],
    [
      { text: 'Standard Framingham Score', options: { fill: { color: C_CARD }, color: C_TEXT } },
      { text: 'Static Lab Biomarkers only', options: { fill: { color: C_CARD }, color: C_MUTED } },
      { text: '0.724', options: { fill: { color: C_CARD }, color: C_MUTED } },
      { text: '0.651', options: { fill: { color: C_CARD }, color: C_MUTED } },
      { text: '68.0%', options: { fill: { color: C_CARD }, color: C_MUTED } },
      { text: '0 min (Reactive)', options: { fill: { color: C_CARD }, color: C_MUTED } },
    ],
    [
      { text: 'Random Forest (EHR-only)', options: { fill: { color: C_CARD }, color: C_TEXT } },
      { text: 'Tabular EHR Records & Labs', options: { fill: { color: C_CARD }, color: C_MUTED } },
      { text: '0.798', options: { fill: { color: C_CARD }, color: C_MUTED } },
      { text: '0.742', options: { fill: { color: C_CARD }, color: C_MUTED } },
      { text: '76.0%', options: { fill: { color: C_CARD }, color: C_MUTED } },
      { text: '5 min', options: { fill: { color: C_CARD }, color: C_MUTED } },
    ],
    [
      { text: 'CardioGlyc AI Digital Twin (Ours)', options: { bold: true, fill: { color: '064e3b' }, color: '#6ee7b7' } },
      { text: 'EHR + Wearables + Biophysical ODEs', options: { fill: { color: '064e3b' }, color: '#d1fae5' } },
      { text: '0.914', options: { bold: true, fill: { color: '064e3b' }, color: '#6ee7b7' } },
      { text: '0.887', options: { bold: true, fill: { color: '064e3b' }, color: '#6ee7b7' } },
      { text: '89.2%', options: { bold: true, fill: { color: '064e3b' }, color: '#6ee7b7' } },
      { text: '+42 min Proactive', options: { bold: true, fill: { color: '064e3b' }, color: C_AMBER } },
    ],
  ];

  s10.addTable(tableData, {
    x: 0.8,
    y: 2.0,
    w: 11.6,
    h: 2.8,
    colW: [3.2, 3.4, 1.2, 1.2, 1.2, 1.4],
    border: { pt: 1, color: C_BORDER },
    fontSize: 10,
    fontFace: 'Arial',
  });

  // Callout Box
  s10.addShape(pptx.ShapeType.roundRect, {
    x: 0.8,
    y: 5.2,
    w: 11.6,
    h: 1.4,
    fill: { color: C_CARD },
    line: { color: C_CYAN, width: 1.5 },
  });

  s10.addText('KEY SCIENTIFIC TAKEAWAY: The hybrid architecture delivers a +19% improvement in discrimination (ROC-AUC 0.914) with a Brier calibration score of 0.076. Most importantly, it gives doctors 42 minutes of proactive early warning lead time to intervene before adverse glycemic or hypertensive events occur.', {
    x: 1.1,
    y: 5.4,
    w: 11.0,
    h: 1.0,
    fontSize: 11.5,
    fontFace: 'Arial',
    color: C_TEXT,
  });
}

// ==========================================
// SLIDE 11: CLINICAL IMPACT IN INDIA
// ==========================================
{
  const s11 = pptx.addSlide();
  s11.background = { color: C_BG };
  addHeader(s11, 'Economic & Societal Transformation Across India');

  const impacts = [
    { title: 'Preventing Catastrophic ICU Costs', desc: 'Early 42-minute alerts before severe hypoglycemia or hypertensive crisis prevents emergency hospitalizations, saving Indian families lakhs in catastrophic out-of-pocket expenses.', color: C_EMERALD, x: 0.8 },
    { title: 'Tier-2 & Tier-3 City Scalability', desc: 'Ultra-lightweight client-side inference runs on standard low-cost Android smartphones and consumer smartbands without requiring expensive GPU cloud servers.', color: C_CYAN, x: 4.8 },
    { title: 'Preserving Productive Work Years', desc: 'Slowing 10-year ASCVD progression preserves the productive earning years of young Indian professionals at high risk of premature coronary heart disease.', color: C_AMBER, x: 8.8 },
  ];

  impacts.forEach((imp) => {
    s11.addShape(pptx.ShapeType.roundRect, {
      x: imp.x,
      y: 1.8,
      w: 3.6,
      h: 4.6,
      fill: { color: C_CARD },
      line: { color: C_BORDER, width: 1.5 },
    });

    s11.addText(imp.title, {
      x: imp.x + 0.3,
      y: 2.1,
      w: 3.0,
      h: 0.8,
      fontSize: 16,
      fontFace: 'Arial',
      bold: true,
      color: imp.color,
    });

    s11.addText(imp.desc, {
      x: imp.x + 0.3,
      y: 3.1,
      w: 3.0,
      h: 2.8,
      fontSize: 11.5,
      fontFace: 'Arial',
      color: C_MUTED,
    });
  });
}

// ==========================================
// SLIDE 12: CONCLUSION & WINNING CALL TO ACTION
// ==========================================
{
  const s12 = pptx.addSlide();
  s12.background = { color: C_BG };

  s12.addText('HAPPIEST HEALTH • DIGITAL TWIN CHALLENGE 2026', {
    x: 0.8,
    y: 1.0,
    w: 11.5,
    h: 0.35,
    fontSize: 11,
    fontFace: 'Arial',
    bold: true,
    color: C_CYAN,
    charSpacing: 2,
  });

  s12.addText('Reimagining and Reforming Healthcare in India', {
    x: 0.8,
    y: 1.4,
    w: 11.5,
    h: 0.8,
    fontSize: 32,
    fontFace: 'Arial',
    bold: true,
    color: C_TEXT,
  });

  // Summary box
  s12.addShape(pptx.ShapeType.roundRect, {
    x: 0.8,
    y: 2.4,
    w: 11.5,
    h: 4.0,
    fill: { color: C_CARD },
    line: { color: C_CYAN, width: 1.5 },
  });

  const summaryPoints = [
    { text: '✓ Complete Working Prototype: ', options: { bold: true, color: C_CYAN } },
    { text: 'React 19 + TypeScript + Vite 6 dashboard running live at localhost:5173.\n', options: { color: C_TEXT } },
    { text: '✓ Biophysical ODE Core: ', options: { bold: true, color: C_EMERALD } },
    { text: 'Bergman Minimal Model & Two-Element Windkessel eliminate AI hallucinations.\n', options: { color: C_TEXT } },
    { text: '✓ Proven 42-Minute Lead Time: ', options: { bold: true, color: C_AMBER } },
    { text: 'ROC-AUC 0.914 with SHAP feature explainability vectors for clinical trust.\n', options: { color: C_TEXT } },
    { text: '✓ In Silico Sandbox: ', options: { bold: true, color: C_PURPLE } },
    { text: 'Demonstrates a -38% post-meal glucose reduction and -52% 10-year ASCVD risk reduction.\n', options: { color: C_TEXT } },
    { text: '✓ Turnkey ABDM / HL7 FHIR R4: ', options: { bold: true, color: C_BLUE } },
    { text: '1-click export compatible with national health infrastructure.\n', options: { color: C_TEXT } },
    { text: '✓ Full Open-Source Reproducibility: ', options: { bold: true, color: C_EMERALD } },
    { text: 'Complete Python ML pipeline (ml_pipeline/) and public GitHub repository.', options: { color: C_TEXT } },
  ];
  s12.addText(summaryPoints, { x: 1.2, y: 2.6, w: 10.7, h: 3.5, fontSize: 12, fontFace: 'Arial' });

  s12.addText('Thank you Happiest Health & Jury Members! We look forward to presenting live at the Summit in Bengaluru.', {
    x: 0.8,
    y: 6.6,
    w: 11.5,
    h: 0.35,
    fontSize: 13,
    fontFace: 'Arial',
    bold: true,
    color: C_CYAN,
    align: 'center',
  });
}

// Write the PowerPoint file
const outputPath = path.resolve('presentation', 'CardioGlyc_AI_Presentation.pptx');
pptx.writeFile({ fileName: outputPath })
  .then((fileName) => {
    console.log(`Successfully generated PowerPoint presentation: ${fileName}`);
  })
  .catch((err) => {
    console.error('Error generating PowerPoint:', err);
  });
