import React, { createContext, useContext, useState } from 'react';

const DataContext = createContext();

export const useData = () => useContext(DataContext);

const initialPatients = [
  {
    id: 'BH-10042',
    name: 'Eleanor Vance',
    dob: '1962-04-15',
    diagnosis: 'C50.912 - Malignant neoplasm of unspecified site of left female breast',
    insurance: 'BlueHealth',
    status: 'Active',
    insurancePrefix: 'BH'
  },
  {
    id: 'GS-88219',
    name: 'Marcus Thorne',
    dob: '1958-11-03',
    diagnosis: 'C34.90 - Malignant neoplasm of unsp part of unsp bronchus or lung',
    insurance: 'GlobalShield',
    status: 'Active',
    insurancePrefix: 'GS'
  },
  {
    id: 'XX-55412',
    name: 'Sarah Jenkins',
    dob: '1975-08-22',
    diagnosis: 'C18.9 - Malignant neoplasm of colon, unspecified',
    insurance: 'Unknown',
    status: 'Inactive',
    insurancePrefix: 'XX'
  },
  {
    id: 'BH-99123',
    name: 'David Chen',
    dob: '1968-01-30',
    diagnosis: 'C61 - Malignant neoplasm of prostate',
    insurance: 'BlueHealth',
    status: 'Active',
    insurancePrefix: 'BH'
  },
  {
    id: 'GS-11234',
    name: 'Maria Garcia',
    dob: '1982-05-14',
    diagnosis: 'C56.9 - Malignant neoplasm of unspecified ovary',
    insurance: 'GlobalShield',
    status: 'Active',
    insurancePrefix: 'GS'
  }
];

const initialClaims = [
  { id: 'CLM-001', patientId: 'BH-10042', procedure: '96413', icd: 'C50.912', npi: '1234567890', status: 'Authorized', priority: 'Normal', date: '2026-03-01' },
  { id: 'CLM-002', patientId: 'GS-88219', procedure: '85025', icd: 'C34.90', npi: '0987654321', status: 'Paid', priority: 'Normal', date: '2026-03-05' },
  { id: 'CLM-003', patientId: 'BH-99123', procedure: '96413', icd: 'C61', npi: '1122334455', status: 'Denied', denialReason: 'Duplicate Claim', priority: 'Low', date: '2026-03-08' },
  { id: 'CLM-004', patientId: 'GS-11234', procedure: '96413', icd: 'C56.9', npi: '5544332211', status: 'Denied', denialReason: 'Medical Necessity Documentation Missing', priority: 'High', date: '2026-03-09' }
];

export const DataProvider = ({ children }) => {
  const [patients] = useState(initialPatients);
  const [claims, setClaims] = useState(initialClaims);
  const [currentPatient, setCurrentPatient] = useState(null);

  // Eligibility Check
  const checkEligibility = (patientId, provider) => {
    const patient = patients.find(p => p.id === patientId && p.insurance === provider);
    if (patient && (patientId.startsWith('BH') || patientId.startsWith('GS'))) {
      setCurrentPatient(patient);
      return { success: true, message: `${provider} - Active`, patient };
    }
    setCurrentPatient(null);
    return { success: false, message: 'Inactive/Error: Invalid ID or Provider mismatch', patient: null };
  };

  // Submit Claim (Scrubber & Prior Auth Logic)
  const submitClaim = (claimData) => {
    // 1. Scrubber Logic
    const missingFields = [];
    if (!claimData.icd) missingFields.push('Diagnosis Code (ICD-10)');
    if (!claimData.npi) missingFields.push('Provider NPI');
    
    if (missingFields.length > 0) {
      return { success: false, type: 'validation', missingFields, message: 'Missing required fields.' };
    }

    // 2. Prior Auth Logic
    let status = 'Submitted';
    let message = 'Claim successfully submitted.';
    
    if (claimData.procedure === '96413') {
      status = 'Authorization Required';
      message = 'Authorization Required. Request automatically sent.';
    } else {
       status = 'Paid'; // Simulating immediate auto-adjudication for clean simple claims
    }

    const newClaim = {
      id: `CLM-${Math.floor(Math.random() * 10000)}`,
      patientId: currentPatient ? currentPatient.id : 'UNKNOWN',
      ...claimData,
      status,
      priority: 'Normal',
      date: new Date().toISOString().split('T')[0]
    };

    setClaims(prev => [newClaim, ...prev]);

    return { success: true, status, message, claim: newClaim };
  };

  return (
    <DataContext.Provider value={{
      patients,
      claims,
      currentPatient,
      checkEligibility,
      submitClaim
    }}>
      {children}
    </DataContext.Provider>
  );
};
