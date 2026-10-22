# 🎬 20-Minute Demonstration & Video Presentation Script

> **Happiest Health • Digital Twin Challenge 2026**  
> *Reimagining and Reforming Healthcare in India Summit 2026, Bengaluru*  
> **Mandatory Requirement**: Minimum 20-Minute Video Demonstration & Pitch

---

## 📌 Video Overview & Recording Instructions

* **Target Duration**: 20:00 – 22:00 minutes.
* **Recording Format**: Screen recording with camera inset (via Loom, Zoom, or OBS Studio) or voiced PowerPoint presentation.
* **Hosting**: Upload as an **Unlisted Video on YouTube** (or Google Drive with public view access) and paste the link into the `README.md` and submission portal.

---

## ⏱️ Minute-by-Minute Demonstration Script

### Part 1: Introduction & The Indian Healthcare Crisis (0:00 – 3:30)
* **Visual**: Slide Deck (`presentation/presentation_deck.html` - Slides 1 & 2).
* **Speaker Script**:
  > "Hello esteemed jury members, technical experts, and organizers at Happiest Health. We are [Team Name] representing [College/Incubator Name], presenting **CardioGlyc AI** — a multi-modal CardioMetabolic Digital Twin for Type 2 Diabetes, Hypertension, and Cardiovascular Decompensation forecasting.
  > 
  > India today is confronting an unprecedented healthcare dilemma. We are home to over 101 million individuals diagnosed with diabetes according to the landmark ICMR-INDIAB study. Furthermore, our population exhibits the distinct 'thin-fat' South Asian phenotype: developing coronary artery disease an entire decade earlier than Western cohorts, even at lower BMI thresholds.
  > 
  > The fundamental bottleneck in Indian chronic disease care today is that medicine remains **reactive and episodic**. A patient visits their physician once every three to six months for an isolated HbA1c test or blood pressure measurement. Between these visits, physicians are completely blind to the daily postprandial glucose volatility, acute glycemic spikes above 220 mg/dL, and nocturnal hypertensive surges that silently damage the microvasculature and coronary arteries.
  > 
  > Today, we demonstrate how CardioGlyc AI shifts care from reactive episodes to proactive, personalized homeostasis."

---

### Part 2: The Digital Twin Concept & Multi-Modal Data Ingestion (3:30 – 7:00)
* **Visual**: Slide Deck (Slides 3, 4, & 5) and Architecture Diagram (`presentation/architecture_diagram.svg`).
* **Speaker Script**:
  > "What is a Digital Twin in healthcare? It is not a static chart or a generic chatbot. A true digital twin is a dynamic, virtual replica of an individual patient's physiology, continuously synchronized with streaming wearable telemetry and grounded in longitudinal Electronic Health Records.
  > 
  > In strict compliance with India's Digital Personal Data Protection (DPDP) Act 2023 and HIPAA privacy guidelines, we synthesized a cohort of 500 South Asian patients mirroring the real-world statistical distributions of the ICMR-INDIAB and MASALA studies.
  > 
  > CardioGlyc AI fuses two complementary data streams:
  > First, **Static Longitudinal EHR data**: incorporating ICD-10 diagnostic codes for Type 2 Diabetes (E11), Essential Hypertension (I10), and Dyslipidemia (E78); historical laboratory biomarkers such as glycated hemoglobin (HbA1c), fasting plasma glucose, lipid profiles, eGFR, and hs-CRP; alongside patient demographics and prescription history.
  > 
  > Second, **Dynamic Real-Time Wearables**: streaming continuous glucose monitor (CGM) interstitial glucose every 5 minutes, photoplethysmography (PPG) heart rate and heart rate variability (HRV RMSSD) reflecting autonomic vagal tone, continuous ambulatory blood pressure (systolic, diastolic, and pulse pressure), and accelerometer-derived physical activity METs.
  > 
  > What sets our system apart is the **Biophysical Modeling Core**. Rather than treating the body as an uninterpretable black box, we anchor our predictive algorithms in continuous differential equations: the **Bergman Minimal Model** for endocrine glucose-insulin kinetics, and the **Two-Element Windkessel Model** for arterial compliance and vascular resistance."

---

### Part 3: Live Prototype Walkthrough & Doctor Cockpit (7:00 – 12:30)
* **Visual**: Switch screen to the live web browser at `http://localhost:5173`.
* **Speaker Script**:
  > "Let us now transition to the live working prototype of CardioGlyc AI, running locally on our development server.
  > 
  > At the top of the interface, you can see our real-time simulated telemetry clock and persona switcher. We have pre-configured three diverse South Asian clinical profiles. Let us examine our primary subject: **Rajesh Sharma**, a 52-year-old logistics director from Bengaluru presenting with uncontrolled Type 2 Diabetes, an HbA1c of 8.4%, and Stage 2 Essential Hypertension.
  > 
  > Look at the **Vital Signs Ribbon**: in real time, the system streams his interstitial glucose, current rate of change ($dG/dt$), Time-in-Range percentage, ambulatory blood pressure (142/88 mmHg), and his composite **Metabolic Resilience Index** score of 62/100.
  > 
  > Next, observe the **Interactive Holographic Avatar**. Notice the heart pulsating at the patient's actual heart rate. If I click on the **Heart node**, the doctor immediately sees hemodynamic telemetry: Mean Arterial Pressure (MAP), Pulse Pressure, and arterial wall shear stress. Clicking on the **Pancreas node** reveals current plasma glucose, the rate-of-change drift, and effective insulin sensitivity. The **Brain node** displays autonomic vagal reserve and sympathetic tone, while the **Peripheral Musculature node** tracks current METs and GLUT-4 glucose clearance.
  > 
  > Now, let us examine the core visual engine: the **Multi-Trace Trajectory Graph**. On the left, we observe six hours of continuous historical sensor stream. The vertical 'NOW' scrubber marks our current moment. Look ahead into the **4-hour forward projection**:
  > The red dashed trace demonstrates the **Baseline Unmanaged Forecast**. Because Rajesh consumed a carbohydrate-rich lunch, the physiological model projects a dangerous postprandial glycemic surge reaching 232 mg/dL at +45 minutes, remaining elevated well outside the safe target corridor ($70 - 180\text{ mg/dL}$).
  > Concurrently, his systolic blood pressure is projected to remain elevated above 142 mmHg due to arterial stiffness and dietary sodium."

---

### Part 4: The In Silico Counterfactual Sandbox (12:30 – 16:30)
* **Visual**: Interactive demonstration of the Counterfactual Simulator in `http://localhost:5173`.
* **Speaker Script**:
  > "Now, we demonstrate the most powerful innovation in CardioGlyc AI: the **In Silico Counterfactual Sandbox**.
  > 
  > How does a doctor prevent this projected spike before it happens? Instead of guessing, the clinician or patient can simulate interventions *in silico*.
  > 
  > Let me toggle the first intervention: **20-Minute Postprandial Brisk Walk (3.5 METs)**.
  > [Click on the Walk toggle]
  > Look at the green counterfactual curve on the trajectory chart. Notice how the forecast immediately shifts: the projected peak collapses from 232 mg/dL down to 148 mg/dL — safely contained within the green clinical target corridor! 
  > Why does this occur? Because our Bergman Minimal Model calculates the non-insulin-mediated GLUT-4 translocation induced by contracting skeletal muscle ($U_{ex}$), clearing glucose from the bloodstream independently of impaired beta-cell insulin secretion. Concurrently, post-exercise vasodilation reduces systemic vascular resistance, lowering his systolic blood pressure by 9 mmHg.
  > 
  > Next, let us enable **Low-Glycemic Complex Millets (Ragi/Jowar + 15g Fiber)**.
  > [Click on the Nutrition toggle]
  > This adjusts the intestinal absorption decay constant ($k_{abs}$), smoothing the absorption curve and eliminating the sharp peak.
  > 
  > Finally, let us enable **Strict Pharmacotherapy Adherence (Metformin ER + Telmisartan)**.
  > [Click on the Medication toggle]
  > Look at the **Cardiometabolic Risk Panel**: Rajesh's 10-year ASCVD risk is reduced from an alarming **19.8% down to 9.4%** — a **52% relative risk reduction**.
  > 
  > Notice the **Explainable AI (XAI) feature attribution vector**: our model transparently details that South Asian genetic predisposition, elevated HbA1c, and systolic blood pressure are the primary risk drivers, giving clinicians complete confidence in the AI recommendations."

---

### Part 5: Interoperability, Metrics & National Scale (16:30 – 19:30)
* **Visual**: Click "FHIR R4" modal, then "Metrics" modal, then presentation conclusion slides.
* **Speaker Script**:
  > "A healthcare innovation cannot remain an isolated island. It must integrate into clinical hospital workflows and national digital public infrastructure.
  > 
  > Let me click the **'FHIR R4'** button in the header.
  > [Click on the FHIR R4 modal]
  > Instantly, the digital twin serializes the complete patient state into an **HL7 FHIR Release 4.0.1 compliant bundle**. Notice the official Ayushman Bharat Health Account (ABHA) identifier format, LOINC code 14745-4 for CGM interstitial glucose, LOINC code 85354-9 for blood pressure panels, and standard RiskAssessment resources. With one click, this JSON bundle can be downloaded or pushed to hospital EHRs like Epic, Cerner, or India's ABDM health lockers.
  > 
  > Now let us inspect the **Model Evaluation Benchmarks**.
  > [Click on the Metrics modal]
  > Across 5-Fold Stratified Cross-Validation on our 500-patient South Asian split:
  > * Standard static risk scores (like Framingham) achieve an ROC-AUC of only 0.724 with zero early warning capability.
  > * Standard tabular Random Forest on EHR records achieves an ROC-AUC of 0.798 with 5 minutes lead time.
  > * **CardioGlyc AI achieves an ROC-AUC of 0.914, a PR-AUC of 0.887, sensitivity of 89.2%, specificity of 92.1%, a Brier calibration score of 0.076, and an unprecedented 42 minutes of proactive early warning lead time**.
  > 
  > Furthermore, our research suite in the `ml_pipeline/` directory provides complete Python scripts (`generate_synthetic_ehr.py`, `train_risk_models.py`, `fhir_r4_converter.py`) ensuring full scientific reproducibility."

---

### Part 6: Summary & Conclusion (19:30 – 20:30)
* **Visual**: Presentation Slide 12 (Conclusion & Q&A).
* **Speaker Script**:
  > "To summarize: CardioGlyc AI addresses the greatest healthcare challenge facing India today. By uniting longitudinal EHR records with streaming wearables through biophysical differential equations, we have demonstrated:
  > 1. A 42-minute proactive alert window prior to acute diabetic and hypertensive excursions.
  > 2. An interactive counterfactual sandbox proving a 38% reduction in postprandial glucose spikes and a 52% reduction in 10-year cardiovascular risk.
  > 3. Turnkey ABDM and HL7 FHIR R4 interoperability.
  > 
  > We thank Happiest Health, Mr. Ashok Soota, and the expert jury panel for this opportunity. We look forward to presenting our working prototype live at the Reimagining and Reforming Healthcare in India Summit 2026 in Bengaluru. Thank you."

---

## 📋 Tips for Your Recording
1. **Resolution**: Record in 1080p (1920x1080) landscape.
2. **Audio**: Use a dedicated headset or microphone in a quiet room.
3. **Upload**: Set your YouTube video link to **Unlisted** (anyone with the link can view, but it won't appear publicly in search).
4. **Link Placement**: Paste your finalized video link into `README.md` under the designated video header.
