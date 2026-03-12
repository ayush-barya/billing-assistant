import React, { useState } from 'react';
import { useData } from '../context/DataContext';
import { ClipboardList, AlertTriangle, FileCheck, Info, Clock } from 'lucide-react';

const PriorAuthTracker = () => {
  const { claims } = useData();
  const authClaims = claims.filter(c => c.status === 'Authorization Required');
  
  return (
    <div className="glass-panel" style={{ padding: '1.5rem' }}>
      <div className="tracker-header">
        <div className="tracker-title">
          <Clock size={28} strokeWidth={2} />
          <h2>Prior Auth Tracker</h2>
        </div>
        <span className="badge badge-pending px-3 py-1">{authClaims.length} Pending</span>
      </div>
      <p className="tracker-desc">
         Automated tracker for high-scrutiny oncology procedures (e.g., Chemotherapy).
      </p>

      {authClaims.length === 0 ? (
         <p className="text-muted italic" style={{ fontSize: '0.9rem' }}>No pending authorizations.</p>
      ) : (
        <div className="tracker-list">
          {authClaims.map(claim => (
            <div key={claim.id} className="tracker-card">
               <div className="tracker-card-header">
                 <span className="tracker-id">{claim.id} <span className="text-muted" style={{ fontWeight: 'normal', fontSize: '0.85rem', marginLeft: '0.5rem' }}>({claim.patientId})</span></span>
                 <span className="badge badge-pending">Auth Requested</span>
               </div>
               
               {/* Timeline Stepper */}
               <div className="tracker-stepper">
                 <div className="stepper-item">
                    <div className="stepper-dot"><div className="stepper-dot-inner"></div></div>
                    <span>Data Scanned</span>
                 </div>
                 <div className="stepper-item">
                    <div className="stepper-dot"><div className="stepper-dot-inner"></div></div>
                    <span>Scrubbed & Validated</span>
                 </div>
                 <div className="stepper-item active">
                    <div className="stepper-dot active"><div className="stepper-dot-inner active"></div></div>
                    <span>Auth Requested (Payer)</span>
                 </div>
               </div>
            </div>
          ))}
        </div>
      )}
    </div>
  );
};

const ClaimsView = () => {
  const { currentPatient, submitClaim } = useData();
  
  const [claimForm, setClaimForm] = useState({
    procedure: '',
    icd: '',
    npi: ''
  });
  
  const [submissionResult, setSubmissionResult] = useState(null);

  const handleInputChange = (e) => {
    const { name, value } = e.target;
    setClaimForm(prev => ({ ...prev, [name]: value }));
  };

  const handleSubmit = (e) => {
    e.preventDefault();
    if (!currentPatient) {
       setSubmissionResult({ success: false, message: 'No active patient. Go to Eligibility first.', type: 'error' });
       return;
    }
    
    // Scrubber happens in context
    const result = submitClaim(claimForm);
    setSubmissionResult(result);
  };

  const isScrubberError = submissionResult && submissionResult.type === 'validation';

  return (
    <div className="claims-container animate-fade-in">
      {/* Claims Form */}
      <div className="glass-panel claims-form-panel">
        <div className="claims-header">
          <ClipboardList size={32} strokeWidth={1.5} />
          <h2>Submit Oncology Claim</h2>
        </div>

        {!currentPatient ? (
          <div className="alert-error" style={{ marginBottom: '2rem' }}>
            <Info size={24} /> Please verify a patient in the Front Door to submit a claim.
          </div>
        ) : (
          <div className="context-card animate-fade-in">
             <div>
               <h4 className="context-label">Active Context</h4>
               <p className="context-value">{currentPatient.name} <span className="context-id">{currentPatient.id}</span></p>
             </div>
          </div>
        )}
        
        <form onSubmit={handleSubmit} className="flex-col-gap" style={{ gap: '1.5rem' }}>
          <div className="form-group animate-fade-in" style={{ animationDelay: '0.1s' }}>
            <label className="form-label">Procedure Code (CPT/HCPCS)</label>
            <select 
              className="form-select" 
              name="procedure"
              value={claimForm.procedure}
              onChange={handleInputChange}
              required
            >
              <option value="" disabled>Select Procedure</option>
              <option value="96413">96413 - Chemotherapy Administration (Requires Auth)</option>
              <option value="85025">85025 - Complete Blood Count (Standard)</option>
              <option value="99214">99214 - Office Visit, Established Patient</option>
            </select>
          </div>

          <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: '1rem' }}>
             {/* Scrubber validation fields */}
             <div className="form-group animate-fade-in" style={{ animationDelay: '0.2s' }}>
              <label className="form-label">Diagnosis Code (ICD-10)</label>
              <input 
                type="text" 
                className={`form-input ${isScrubberError && submissionResult.missingFields.includes('Diagnosis Code (ICD-10)') ? 'error' : ''}`} 
                placeholder="e.g. C50.912" 
                name="icd"
                value={claimForm.icd}
                onChange={handleInputChange}
              />
              {isScrubberError && submissionResult.missingFields.includes('Diagnosis Code (ICD-10)') && (
                 <span className="error-text">Required field</span>
              )}
            </div>

            <div className="form-group animate-fade-in" style={{ animationDelay: '0.3s' }}>
              <label className="form-label">Provider NPI</label>
              <input 
                type="text" 
                className={`form-input ${isScrubberError && submissionResult.missingFields.includes('Provider NPI') ? 'error' : ''}`} 
                placeholder="10-digit NPI" 
                name="npi"
                value={claimForm.npi}
                onChange={handleInputChange}
              />
               {isScrubberError && submissionResult.missingFields.includes('Provider NPI') && (
                 <span className="error-text">Required field</span>
              )}
            </div>
          </div>

          <button 
            type="submit" 
            className="btn btn-primary animate-fade-in"
            style={{ width: '100%', marginTop: '1.5rem', padding: '1rem', fontSize: '1.1rem', animationDelay: '0.4s' }}
            disabled={!currentPatient}
          >
            Submit Process
          </button>
        </form>

        {submissionResult && submissionResult.success && (
          <div className="alert-success animate-fade-in">
             <div className="alert-success-title">
                <FileCheck size={28} />
                <span>Claim Successfully Processed</span>
             </div>
             <p style={{ fontSize: '1.1rem', marginBottom: '0.5rem' }}>Status: <span className={submissionResult.status === 'Paid' ? 'badge badge-active' : 'badge badge-pending'}>{submissionResult.status}</span></p>
             <p className="text-secondary" style={{ fontSize: '0.95rem' }}>{submissionResult.message}</p>
          </div>
        )}

        {submissionResult && !submissionResult.success && submissionResult.type === 'validation' && (
           <div className="alert-error animate-fade-in" style={{ marginTop: '2rem', alignItems: 'flex-start', flexDirection: 'column' }}>
              <h4 style={{ margin: 0, display: 'flex', alignItems: 'center', gap: '0.5rem', fontSize: '1.1rem' }}><AlertTriangle size={24} /> Claim Scrubber Alert</h4>
              <p style={{ margin: 0, fontSize: '0.95rem', opacity: 0.9 }}>{submissionResult.message} Highlighted fields must be corrected before submission to clearinghouse.</p>
           </div>
        )}
      </div>

      {/* Prior Auth Tracker Sidebar */}
      <PriorAuthTracker />
    </div>
  );
};

export default ClaimsView;
