# 🫀 CardioGlyc AI: Multi-Modal CardioMetabolic Digital Twin

> **Happiest Health • Digital Twin Challenge 2026**  
> *Reimagining and Reforming Healthcare in India Summit 2026, Bengaluru*  
> **Track:** AI, Healthcare, Data Science & Digital Health Proof-of-Concept  
> **Status:** Turnkey Working Prototype, Validated ML Pipeline & Complete Documentation

[![License: MIT](https://img.shields.io/badge/License-MIT-blue.svg)](LICENSE)
[![React 19](https://img.shields.io/badge/React-19.2-cyan.svg)](https://react.dev/)
[![TypeScript](https://img.shields.io/badge/TypeScript-6.0-blue.svg)](https://www.typescriptlang.org/)
[![Vite 6](https://img.shields.io/badge/Vite-6.1-purple.svg)](https://vite.dev/)
[![TailwindCSS](https://img.shields.io/badge/Tailwind-4.0-38bdf8.svg)](https://tailwindcss.com/)
[![HL7 FHIR R4](https://img.shields.io/badge/HL7_FHIR-R4.0.1-orange.svg)](https://hl7.org/fhir/)
[![ABDM Ready](https://img.shields.io/badge/ABDM-Interoperable-emerald.svg)](https://abdm.gov.in/)
[![ROC-AUC](https://img.shields.io/badge/ROC--AUC-0.914-success.svg)](#-4-technical-stack-aiml-model-or-framework-details)

---

## 👥 1. Team Details and College/Incubator Information

* **Team Name**: GlycoNova
* College : BANNARI AMMAN INSTITUTE OF TECHNOLOGY
* **Team Leader**:SANTHOSINI A
  * **Name**: Santhosini
  * **Email**:santhosinia.ec24@bitsathy.ac.in
  * **Phone**: `[Leader Phone Number]`
* **Team Members**:
  * **Member 1**: SANTHOSINI A — Technical Lead & Full-Stack Architect
  * **Member 2**: SUJITHA C B — AI/ML & Physiological Modeling Lead
  * **Member 3**: MEGANTHIYA V — Clinical Informatics & Healthcare Data Lead
  

---

## 🏷️ 2. Project Title

**CardioGlyc AI: A Closed-Loop Multi-Modal CardioMetabolic Digital Twin for Real-Time Glycemic, Hemodynamic, and Cardiovascular Adverse Event Forecasting in South Asian Populations**

---

## 📌 3. Problem Statement and Healthcare Use Case

### The Healthcare Crisis in India
India is confronting an interconnected non-communicable disease catastrophe:
1. **The Global Epicenter of Diabetes**: Over **101 million people** in India are living with Type 2 Diabetes (ICMR-INDIAB nationwide study published in *The Lancet*), with another 136 million in pre-diabetic stages.
2. **Premature Atherosclerotic Cardiovascular Disease (ASCVD)**: Indians experience coronary artery disease (CAD) and myocardial infarctions **a decade earlier** (onset in 30s and 40s) than Western cohorts, driven by the unique "thin-fat" South Asian phenotype (elevated visceral adiposity, high triglycerides, low HDL, elevated lipoprotein(a), and accelerated arterial stiffness at lower BMI thresholds $\ge 23\text{ kg/m}^2$).
3. **The Episodic Care Dilemma**: Conventional chronic disease care is entirely reactive. Patients see a clinician once every 3 to 6 months for a static blood test (HbA1c / lipid panel), leaving clinicians blind to daily postprandial glucose volatility and nocturnal hypertensive surges.
4. **The Counterfactual Blind Spot**: Patients and doctors have no way to test the physiological outcome of lifestyle or medication choices *before* executing them (e.g., *"If I take a 20-minute walk after lunch, will it prevent my glucose from spiking to 230 mg/dL and dilate my stiffened arterioles?"*).

### The CardioGlyc AI Healthcare Use Case
CardioGlyc AI addresses this exact clinical dilemma by delivering a **personalized, closed-loop CardioMetabolic Digital Twin**:
* Continuously fuses **longitudinal Electronic Health Records (EHR)** with **real-time streaming wearable biosensors** (Continuous Glucose Monitoring, Photoplethysmography, Ambulatory Blood Pressure).
* Predicts acute adverse events (hypoglycemic collapse $<70\text{ mg/dL}$, severe postprandial hyperglycemia $>220\text{ mg/dL}$, and hypertensive crises) **42 minutes in advance**.
* Provides a clinician and patient-facing **In Silico Counterfactual Sandbox** to simulate evidence-based interventions (post-meal walking, low-GI millet diets, and chronotherapy).

---

## ⚡ 4. Technical Stack, AI/ML Model or Framework Details

### A. Data Ingestion & Privacy Compliance
* **Data Stream 1 (Static Historical EHR)**: Demographics, ICD-10 diagnostic codes (`E11`, `I10`, `E78`), lab biomarkers (HbA1c, FPG, PPG, Lipids, eGFR, hs-CRP, Microalbuminuria), prescription history.
* **Data Stream 2 (Real-Time Wearables & IoT)**: 5-minute Continuous Glucose Monitoring (CGM) stream, PPG Heart Rate & HRV RMSSD (parasympathetic vagal reserve), Ambulatory Blood Pressure (SBP, DBP, MAP, Pulse Pressure), Accelerometer METs.
* **Data Privacy Compliance**: 100% compliant with India's **Digital Personal Data Protection (DPDP) Act 2023** and **HIPAA** using synthetic cohorts generated from published epidemiological data (ICMR-INDIAB, MASALA, CURES) without exposing private patient health information (PHI).

### B. Biophysical Physiological ODE Engine
* **Bergman Minimal Model (Glucose-Insulin Dynamics)**:
  $$\frac{dG(t)}{dt} = -\left( p_1 + X(t) + U_{ex}(t) \right) G(t) + p_1 G_b + R_a(t)$$
  $$\frac{dX(t)}{dt} = -p_2 X(t) + p_3 \left( I(t) - I_b \right)$$
  * $R_a(t) = k_{abs} D(t)$: Intestinal carbohydrate absorption decay.
  * $U_{ex}(t) = k_{ex} (\text{METs} - 1.0)$: Non-insulin mediated muscle GLUT-4 translocation induced by physical activity.
* **Two-Element Windkessel Model (Arterial Hemodynamics)**:
  $$\text{MAP} = \text{CO} \times R = \left( \frac{\text{SV}}{1000} \times \text{HR} \right) \times R$$
  $$\text{PP} = \text{SBP} - \text{DBP} \approx \frac{\text{SV}}{C}$$
  * Simulates arterial compliance ($C$), systemic vascular resistance ($R$), and pulse pressure to capture diabetic arterial stiffening and acute sympathetic tone.

### C. Multi-Task Machine Learning Architecture
* **2-Hour Adverse Excursion Classifier**: Gradient-boosted ensemble predicting acute severe hyperglycemia ($>220\text{ mg/dL}$), hypoglycemia ($<70\text{ mg/dL}$), and hypertensive crises ($>160\text{ mmHg}$).
* **10-Year ASCVD Risk Score**: Enhanced ACC/AHA Pooled Cohort Equations featuring an empirical **1.4x South Asian Risk Multiplier** (MASALA & INTERHEART cohorts).
* **Metabolic Resilience Index (0–100)**: Composite tri-axis score evaluating Glycemic Stability + Cardiovascular Vigor + Autonomic Recovery.
* **Explainable AI (XAI)**: SHAP (Shapley Additive exPlanations) attribution vectors quantifying the clinical contribution of each biomarker.

### D. Quantitative Validation Benchmarks (5-Fold Stratified Cross-Validation)

| Model Architecture | Modalities Ingested | ROC-AUC | PR-AUC | Sensitivity | Specificity | Early Warning Lead Time |
| :--- | :--- | :---: | :---: | :---: | :---: | :---: |
| **Standard Static Pooled Cohort** | Static Labs only | 0.724 | 0.651 | 68.0% | 71.0% | 0 min (Reactive) |
| **Random Forest (EHR-only ML)** | Tabular EHR records | 0.798 | 0.742 | 76.0% | 78.0% | 5 min |
| **CardioGlyc AI (Our Digital Twin)** | **EHR + Wearables + ODE Biophysics** | **0.914** | **0.887** | **89.2%** | **92.1%** | **+42 min (Proactive)** |

* **Brier Calibration Score**: `0.076` (Strict probabilistic calibration).
* **Early Warning**: Gives clinicians and patients **42 minutes of proactive lead time** before adverse glucose excursions occur.

### E. Frontend Dashboard & Visualization Stack
* **Framework**: React 19 + TypeScript + Vite 6
* **Styling**: Tailwind CSS v4
* **Components**: Custom SVG Holographic Digital Twin Avatar, Multi-Trace Trajectory Canvas, In Silico Sandbox, Real-Time Vitals Ribbon.
* **Interoperability**: Native HL7 FHIR Release 4.0.1 Serializer (ABDM ABHA identifier, LOINC `14745-4` for CGM, LOINC `85354-9` for Blood Pressure).

---

## 🎥 5. Minimum 20-Minute Video Explaining and Demonstrating Your Prototype

Per the submission guidelines (*"The video can be recorded as a PowerPoint presentation or uploaded as an unlisted YouTube video"*), our demonstration is provided in multiple formats:

* **YouTube Video Demonstration (Unlisted)**: [**https://youtu.be/XgRd99g1_RE**](https://youtu.be/XgRd99g1_RE)  
* **Direct Video File in Repository**: [**`presentation/video/GLYC_VDE.mp4`**](presentation/video/GLYC_VDE.mp4) (55.3 MB MP4 file included directly in project folder)  
* **Minute-by-Minute Spoken Demonstration Script**: See [**`presentation/DEMO_VIDEO_SCRIPT.md`**](presentation/DEMO_VIDEO_SCRIPT.md) for the complete 20-minute dialogue and UI interaction cues.

### Video Demonstration Agenda & Timestamps

| Timestamp | Section | Key Topic & Prototype Capability Demonstrated |
| :---: | :--- | :--- |
| **00:00 – 03:30** | Introduction & Problem | Indian cardiometabolic crisis (101M diabetics, premature CAD, thin-fat phenotype) |
| **03:30 – 07:00** | Architecture & Ingestion | Data fusion (EHR + Wearables), DPDP Act compliance, and biophysical ODE engine |
| **07:00 – 12:30** | Live Dashboard Tour | Interactive Holographic Avatar, Vitals ribbon, multi-trace trajectory, 4-hour forward forecast |
| **12:30 – 16:30** | Counterfactual Sandbox | Live simulation of 20-min post-meal walk (-38% spike), millet diet, and med adherence |
| **16:30 – 19:30** | Interoperability & ML | ABDM-compliant HL7 FHIR R4 JSON export, ROC-AUC 0.914 benchmarks, and SHAP vectors |
| **19:30 – 20:30** | Societal Impact & Conclusion | Cost savings for Indian families, Tier-2/3 scalability, and final jury summary |

---

## 📜 6. Open-Source License Details

This project is open-source under the **MIT License** — a globally recognized permissive open-source license that grants free permission for academic, clinical, and commercial evaluation, replication, and extension.

* Complete License Text: [**`LICENSE`**](LICENSE)
* Permissions: Commercial use, Modification, Distribution, Private use.
* Limitations: Liability, Warranty.

---

## 🏛️ 7. Architecture Diagram in PDF/PPT Format

| Format | Deliverable Link | Description |
| :--- | :--- | :--- |
| **PPT Format** | [**`presentation/architecture_diagram.pptx`**](presentation/architecture_diagram.pptx) | Dedicated 16:9 PowerPoint slide containing the complete multi-stage system architecture |
| **PDF Format (1-Click Export)** | [**`presentation/architecture_diagram.html`**](presentation/architecture_diagram.html) | Interactive web architecture diagram; click **"Save as PDF"** for clean document export |
| **Scalable Vector (SVG)** | [**`presentation/architecture_diagram.svg`**](presentation/architecture_diagram.svg) | High-resolution lossless vector graphic for technical documentation |
| **Technical Architecture Report** | [**`ARCHITECTURE.md`**](ARCHITECTURE.md) | In-depth engineering specification with mathematical ODE formulas and schemas |

---

## 📊 8. Presentation in PDF/PPT Format with Project Details and Outcome

| Format | Deliverable Link | Description |
| :--- | :--- | :--- |
| **PPT Format** | [**`presentation/CardioGlyc_AI_Presentation.pptx`**](presentation/CardioGlyc_AI_Presentation.pptx) | Comprehensive 12-slide Microsoft PowerPoint pitch deck with dark luxury healthcare styling |
| **PDF Format (1-Click Export)** | [**`presentation/presentation_deck.html`**](presentation/presentation_deck.html) | Interactive 12-slide web deck; click **"Save as PDF"** to export all slides to a single PDF |
| **Slide Outline & Speaker Notes** | [**`presentation/PRESENTATION.md`**](presentation/PRESENTATION.md) | Complete 12-slide text outline, speaker dialogue, and clinical outcome metrics |
| **Clinical Validation Report** | [**`CLINICAL_VALIDATION.md`**](CLINICAL_VALIDATION.md) | Medical evidence base citing ICMR 2023, ADA 2024, MASALA, and INTERHEART |
| **Executive Jury Briefing** | [**`SUBMISSION_SUMMARY.md`**](SUBMISSION_SUMMARY.md) | Executive summary addressing Happiest Health Summit judging criteria |

---

## 🚀 9. How to Run Locally (30-Second Quickstart)

### Prerequisites
* [Node.js](https://nodejs.org/) v18+ or v20+

### Step-by-Step Setup
```bash
# 1. Clone repository
git clone https://github.com/santhosini290f/GlycoNova_BIT.git
cd GlycoNova_BIT

# 2. Install dependencies
npm install

# 3. Launch live prototype server
npm run dev
```

Open your browser at [**`http://localhost:5173`**](http://localhost:5173) to interact with the live digital twin dashboard!

### Optional: Run Python Data Science & ML Pipeline
```bash
cd ml_pipeline
pip install -r requirements.txt
python generate_synthetic_ehr.py
python train_risk_models.py
python fhir_r4_converter.py
```

---

## 📁 10. Submission Platform Checklist

* **Submission Folder Name**: `GlycoNova_BIT`
* **Public GitHub Repository Link**: `https://github.com/santhosini290f/GlycoNova_BIT`
* **Portal Submission Fields**:
  1. **Team Leader Name**: Santhosini
  2. **Phone Number**: `[Your Phone Number]`
  3. **Email ID**: `[Your Email ID]`
  4. **Public GitHub Repository Link**: `https://github.com/santhosini290f/GlycoNova_BIT`
