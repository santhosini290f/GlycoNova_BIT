import { PatientProfile } from '../types/patient';
import { MultiModalSensorSnapshot } from '../types/sensors';
import { AscvdRiskPrediction } from '../types/prediction';

/**
 * Generates an HL7 FHIR R4 Bundle (JSON format)
 * Interoperable with ABDM (Ayushman Bharat Digital Mission) and global EHR architectures (Epic, Cerner)
 */
export function generateFhirR4Bundle(
  patient: PatientProfile,
  snapshot: MultiModalSensorSnapshot,
  ascvd: AscvdRiskPrediction
) {
  const timestamp = new Date().toISOString();

  return {
    resourceType: 'Bundle',
    id: `bundle-digital-twin-${patient.id.toLowerCase()}`,
    type: 'collection',
    timestamp,
    entry: [
      // 1. FHIR Patient Resource
      {
        fullUrl: `urn:uuid:patient-${patient.id}`,
        resource: {
          resourceType: 'Patient',
          id: patient.id,
          identifier: [
            {
              system: 'https://healthid.ndhm.gov.in', // ABDM ABHA ID
              value: `ABHA-91-${patient.id}`,
            },
          ],
          active: true,
          name: [
            {
              use: 'official',
              text: patient.name,
              family: patient.name.split(' ').slice(-1)[0],
              given: patient.name.split(' ').slice(0, -1),
            },
          ],
          gender: patient.gender.toLowerCase(),
          extension: [
            {
              url: 'http://hl7.org/fhir/us/core/StructureDefinition/us-core-race',
              valueString: patient.ethnicity,
            },
          ],
          address: [
            {
              city: patient.location.split(',')[0].trim(),
              state: patient.location.split(',')[1]?.trim() || 'IN',
              country: 'IND',
            },
          ],
        },
      },

      // 2. FHIR Observation: Continuous Glucose Monitor (CGM)
      {
        fullUrl: `urn:uuid:obs-cgm-${Date.now()}`,
        resource: {
          resourceType: 'Observation',
          status: 'final',
          category: [
            {
              coding: [
                {
                  system: 'http://terminology.hl7.org/CodeSystem/observation-category',
                  code: 'vital-signs',
                  display: 'Vital Signs',
                },
              ],
            },
          ],
          code: {
            coding: [
              {
                system: 'http://loinc.org',
                code: '14745-4',
                display: 'Glucose [Mass/volume] in Body fluid',
              },
            ],
            text: 'Interstitial Continuous Glucose Monitoring (CGM)',
          },
          subject: { reference: `Patient/${patient.id}` },
          effectiveDateTime: snapshot.timestamp,
          valueQuantity: {
            value: snapshot.cgm.glucose,
            unit: 'mg/dL',
            system: 'http://unitsofmeasure.org',
            code: 'mg/dL',
          },
          interpretation: [
            {
              coding: [
                {
                  system: 'http://terminology.hl7.org/CodeSystem/v3-ObservationInterpretation',
                  code: snapshot.cgm.glucose > 180 ? 'H' : snapshot.cgm.glucose < 70 ? 'L' : 'N',
                  display: snapshot.cgm.glucose > 180 ? 'High' : snapshot.cgm.glucose < 70 ? 'Low' : 'Normal',
                },
              ],
            },
          ],
        },
      },

      // 3. FHIR Observation: Blood Pressure (Systolic + Diastolic)
      {
        fullUrl: `urn:uuid:obs-bp-${Date.now()}`,
        resource: {
          resourceType: 'Observation',
          status: 'final',
          category: [
            {
              coding: [
                {
                  system: 'http://terminology.hl7.org/CodeSystem/observation-category',
                  code: 'vital-signs',
                },
              ],
            },
          ],
          code: {
            coding: [
              {
                system: 'http://loinc.org',
                code: '85354-9',
                display: 'Blood pressure panel with all children optional',
              },
            ],
          },
          subject: { reference: `Patient/${patient.id}` },
          effectiveDateTime: snapshot.timestamp,
          component: [
            {
              code: {
                coding: [
                  {
                    system: 'http://loinc.org',
                    code: '8480-6',
                    display: 'Systolic blood pressure',
                  },
                ],
              },
              valueQuantity: {
                value: snapshot.bp.systolic,
                unit: 'mm[Hg]',
                system: 'http://unitsofmeasure.org',
                code: 'mm[Hg]',
              },
            },
            {
              code: {
                coding: [
                  {
                    system: 'http://loinc.org',
                    code: '8462-4',
                    display: 'Diastolic blood pressure',
                  },
                ],
              },
              valueQuantity: {
                value: snapshot.bp.diastolic,
                unit: 'mm[Hg]',
                system: 'http://unitsofmeasure.org',
                code: 'mm[Hg]',
              },
            },
          ],
        },
      },

      // 4. FHIR RiskAssessment: 10-Year ASCVD Risk with South Asian Calibrator
      {
        fullUrl: `urn:uuid:risk-ascvd-${Date.now()}`,
        resource: {
          resourceType: 'RiskAssessment',
          status: 'final',
          subject: { reference: `Patient/${patient.id}` },
          occurrenceDateTime: timestamp,
          method: {
            coding: [
              {
                system: 'http://hl7.org/fhir/risk-estimate-type',
                code: 'pooled-cohort-south-asian-augmented',
                display: 'ACC/AHA Pooled Cohort with South Asian Multiplier (1.4x)',
              },
            ],
          },
          prediction: [
            {
              outcome: {
                text: '10-Year Atherosclerotic Cardiovascular Event (Myocardial Infarction or Stroke)',
              },
              probabilityDecimal: ascvd.tenYearRiskPercent / 100,
              qualitativeRisk: {
                text: ascvd.riskCategory,
              },
              relativeRisk: ascvd.southAsianRiskMultiplier,
            },
          ],
          note: [
            {
              text: `Estimated modifiable risk reduction: from ${ascvd.tenYearRiskPercent}% down to ${ascvd.optimizedRiskWithInterventions}% (-${ascvd.relativeRiskReduction}%) via digital twin lifestyle & pharmacotherapy optimization.`,
            },
          ],
        },
      },
    ],
  };
}
