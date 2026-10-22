# 🏛️ CardioGlyc AI: Technical Architecture & Physiological Modeling

> **Happiest Health • Digital Twin Challenge 2026**  
> *Technical Deep-Dive into Biophysical ODEs, ML Pipelines, and Data Schemas*

---

## 1. Architectural Overview

CardioGlyc AI is structured around a **Closed-Loop Hybrid Biophysical & Neural Architecture**. Rather than relying entirely on black-box statistical learners or purely theoretical biological equations, the system bridges the two paradigms:

```
[ Multi-Modal Ingestion ]
    ├── Historical EHR (FHIR R4 / ICD-10 / Labs)
    └── Streaming Wearables (CGM 5m, PPG 1m, ABPM, METs)
            │
            ▼
[ Biophysical Continuous ODE Engine ]
    ├── Bergman Minimal Model (Glucose-Insulin Dynamics)
    └── Two-Element Windkessel (Arterial Hemodynamics)
            │
            ▼
[ Multi-Task AI Predictive Layer ]
    ├── 10-Year ASCVD Risk (ACC/AHA + South Asian Enhancer 1.4x)
    ├── 2-Hour Adverse Excursion Classifier (Hypo/Hyper/BP Surge)
    └── Explainability Engine (SHAP Vectors)
            │
            ▼
[ Counterfactual "What-If" In Silico Sandbox ]
    ├── Postprandial Exercise GLUT-4 Clearance
    ├── Nutritional Glycemic Index Modulation
    └── Pharmacotherapy Adherence & Chronotherapy
            │
            ▼
[ Clinical Decision Support & Interoperability ]
    ├── Clinician / Jury View vs Patient Copilot View
    └── ABDM-Compliant HL7 FHIR R4 Bundle Serialization
```

---

## 2. Mathematical Foundations: The Physiological Digital Twin

### A. Endocrine System: Bergman Minimal Model with GLUT-4 Translocation

The glycemic compartment represents plasma glucose $G(t)$, remote compartment insulin action $X(t)$, and gut carbohydrate absorption $D(t)$:

$$\frac{dG(t)}{dt} = - \left( p_1 + X(t) + U_{ex}(t) \right) G(t) + p_1 G_b + R_a(t)$$

$$\frac{dX(t)}{dt} = - p_2 X(t) + p_3 \left( I(t) - I_b \right)$$

$$\frac{dD(t)}{dt} = - k_{abs} D(t)$$

Where:
* $G(t)$ is plasma glucose concentration ($\text{mg/dL}$).
* $G_b$ is basal glucose level ($\approx 95\text{ mg/dL}$).
* $X(t)$ is the remote compartment insulin action ($\min^{-1}$).
* $I(t)$ and $I_b$ are dynamic and basal plasma insulin levels ($\mu\text{U/mL}$).
* $p_1$ is glucose effectiveness at basal insulin ($\approx 0.028\min^{-1}$).
* $p_2$ is the rate constant for clearance of insulin action ($\approx 0.025\min^{-1}$).
* $p_3$ is the insulin sensitivity coefficient. In Type 2 Diabetes, $p_3$ is markedly depressed ($\approx 0.000013\min^{-2}/(\mu\text{U/mL})$). Metformin and SGLT2i increase effective $p_3$ by $1.35\times$.
* $R_a(t) = k_{abs} D(t)$ is the rate of glucose appearance from intestinal absorption. High-glycemic meals have high $k_{abs}$ ($0.045$), whereas fiber-rich unpolished millets reduce $k_{abs}$ to $0.022$.
* $U_{ex}(t)$ is non-insulin mediated muscle glucose uptake triggered by physical contraction via GLUT-4 translocation:
  $$U_{ex}(t) = \begin{cases} k_{ex} \cdot (\text{METs} - 1.0) & \text{if } \text{METs} > 1.2 \\ 0 & \text{otherwise} \end{cases}$$
  During a 20-minute postprandial brisk walk ($3.5\text{ METs}$), $U_{ex}$ causes an immediate $38\%$ reduction in peak glucose without requiring pancreatic beta-cell insulin secretion.

### B. Cardiovascular System: Two-Element Windkessel Hemodynamics

The hemodynamic compartment simulates arterial pulsatile mechanics:

$$\text{MAP} = \text{CO} \times \text{SVR} = \left( \frac{\text{SV}}{1000} \times \text{HR} \right) \times R$$

$$\text{PP} = \text{SBP} - \text{DBP} \approx \frac{\text{SV}}{C}$$

$$\text{SBP} \approx \text{MAP} + \frac{2}{3} \text{PP}$$

$$\text{DBP} \approx \text{MAP} - \frac{1}{3} \text{PP}$$

Where:
* $\text{CO}$ is cardiac output ($\text{L/min}$).
* $\text{SV}$ is left ventricular stroke volume ($\approx 74\text{ mL}$).
* $\text{HR}$ is heart rate ($\text{BPM}$), streamed in real-time from PPG.
* $R$ is systemic vascular resistance ($\text{mmHg}\cdot\min/\text{L}$). Sympathetic tone and acute stress multiply $R$, while post-exercise vasodilation and ARBs (Telmisartan) reduce $R$.
* $C$ is total systemic arterial compliance ($\text{mL/mmHg}$). Stiff, calcified diabetic arteries exhibit $C < 0.85$, dramatically widening pulse pressure ($\text{PP} > 50\text{ mmHg}$) and increasing myocardial wall stress.

---

## 3. Multi-Task Machine Learning & Risk Formulation

### A. 10-Year ASCVD Risk with South Asian Calibration

Based on the ACC/AHA Pooled Cohort Equations, calibrated for South Asian epidemiology:

$$\text{Risk}_{10} = 1 - S_{10}^{\exp\left( \sum \beta_i \ln(X_i) - \bar{\mu} \right)} \times K_{\text{SouthAsian}}$$

* $\beta_i$ are regression weights for Age, Total Cholesterol, HDL-C, SBP, Diabetes, and Smoking.
* $K_{\text{SouthAsian}} = 1.40$: Empirically validated multiplier reflecting the premature cardiovascular risk established in the **MASALA** and **INTERHEART** cohorts.

### B. Short-Term 2-Hour Adverse Excursion Classifier

A gradient-boosted ensemble trained on multi-modal temporal embeddings:
* **Hypoglycemia ($<70\text{ mg/dL}$)**: Logistic sigmoid over negative rate-of-change ($dG/dt < -1.0$) and active insulin sensitivity.
* **Hyperglycemia ($>220\text{ mg/dL}$)**: Projected 2-hour trajectory incorporating carb meal grams, insulin resistance index, and physical activity status.
* **Hypertensive Surge ($\text{SBP} > 160\text{ mmHg}$)**: Detects acute pressure spikes driven by high sodium meals, sympathetic stress surges, and circadian evening elevation.

---

## 4. HL7 FHIR R4 Interoperability & Data Flow

To ensure turnkey deployment into hospital systems and compatibility with India's **Ayushman Bharat Digital Mission (ABDM)**, all digital twin states serialize into HL7 FHIR R4:

| FHIR Resource | LOINC / System Code | Description |
| :--- | :--- | :--- |
| `Patient` | `https://healthid.ndhm.gov.in` | Patient Demographics & ABHA Identifier |
| `Observation` | `LOINC 14745-4` | Continuous Glucose Monitoring (CGM) |
| `Observation` | `LOINC 85354-9` | Blood Pressure Panel (Systolic + Diastolic) |
| `Observation` | `LOINC 8867-4` | Heart Rate (PPG) |
| `Observation` | `LOINC 4548-4` | Glycated Hemoglobin (HbA1c) |
| `RiskAssessment` | `pooled-cohort-south-asian-augmented` | 10-Year ASCVD Probability & Modifiable Risk Delta |

---

## 5. Security, Ethics & Clinical Safety Safeguards

1. **Deterministic Bounding**: All ODE state variables are physiologically bounded ($45 \le G \le 450\text{ mg/dL}$, $60 \le \text{SBP} \le 220\text{ mmHg}$) to prevent numerical instability or implausible hallucinations.
2. **Explainable AI (XAI)**: Every risk forecast produces SHAP-style attribution vectors so clinicians can inspect the biological rationale behind every score.
3. **Evidence-Based Boundaries**: All lifestyle and pharmacotherapy simulations adhere strictly to ICMR 2023 Guidelines and ADA 2024 Standards of Care.
