import React, { useState } from 'react';
import { useData } from '../context/DataContext';
import { ShieldCheck, UserCheck, AlertCircle, XCircle, ScanLine } from 'lucide-react';

const EligibilityView = () => {
  const { checkEligibility } = useData();
  const [patientId, setPatientId] = useState('');
  const [provider, setProvider] = useState('');
  const [result, setResult] = useState(null);

  const handleCheck = (e) => {
    e.preventDefault();
    if (!patientId || !provider) return;

    // Simulate API call delay
    setResult({ loading: true });
    setTimeout(() => {
      const res = checkEligibility(patientId.trim().toUpperCase(), provider);
      setResult({ loading: false, ...res });
    }, 800);
  };

  return (
    <div className="elig-container animate-fade-in">
      <div className="elig-header">
         <h2>Front Door Eligibility</h2>
         <p>Verify patient active coverage across multiple payer networks.</p>
      </div>
      
      <div className="grid-2-cols" style={{ display: 'grid', gridTemplateColumns: 'repeat(2, 1fr)', gap: '2rem' }}>
        {/* Front Door Form */}
        <div className="glass-panel" style={{ padding: '2rem', position: 'relative', overflow: 'hidden' }}>
          {result?.loading && (
             <div className="scan-line"></div>
          )}
          <div style={{ display: 'flex', alignItems: 'center', gap: '0.75rem', marginBottom: '1.5rem', color: 'var(--accent-cyan)' }}>
            <ShieldCheck size={28} />
            <h3 style={{ margin: 0, fontSize: '1.5rem', color: 'var(--text-primary)' }}>Quick Coverage Check</h3>
          </div>
          
          <form onSubmit={handleCheck} className="elig-form">
            <div className="form-group animate-fade-in" style={{ animationDelay: '0.1s' }}>
              <label className="form-label">Patient ID</label>
              <input 
                type="text" 
                className="form-input" 
                placeholder="e.g. BH-10042 or GS-88219" 
                value={patientId}
                onChange={(e) => setPatientId(e.target.value)}
                required
              />
            </div>

            <div className="form-group animate-fade-in" style={{ animationDelay: '0.2s' }}>
              <label className="form-label">Insurance Provider</label>
              <select 
                className="form-select" 
                value={provider}
                onChange={(e) => setProvider(e.target.value)}
                required
              >
                <option value="" disabled>Select Provider</option>
                <option value="BlueHealth">BlueHealth</option>
                <option value="GlobalShield">GlobalShield</option>
              </select>
            </div>

            <button 
              type="submit" 
              className="btn btn-primary animate-fade-in"
              style={{ width: '100%', marginTop: '1rem', padding: '1rem', fontSize: '1.1rem', display: 'flex', justifyContent: 'center', gap: '0.5rem', animationDelay: '0.3s' }}
              disabled={result?.loading}
            >
              {result?.loading ? <><ScanLine className="animate-pulse" /> Scanning Network...</> : 'Verify Eligibility'}
            </button>
          </form>
        </div>

        {/* Result Panel */}
        <div className="glass-panel" style={{ padding: '2rem', display: 'flex', flexDirection: 'column', justifyContent: 'center' }}>
          {!result ? (
            <div style={{ textAlign: 'center', color: 'var(--text-muted)' }}>
              <UserCheck size={64} style={{ margin: '0 auto 1.5rem auto', opacity: 0.5 }} />
              <p style={{ fontSize: '1.1rem' }}>Enter a Patient ID and Provider to scan active coverage status.</p>
              <p style={{ fontSize: '0.9rem', marginTop: '1.5rem', opacity: 0.8 }}>Try <strong style={{ color: 'var(--accent-cyan)' }}>BH-10042</strong> for BlueHealth or <strong style={{ color: 'var(--accent-rosewood)' }}>XX-55412</strong> for Inactive.</p>
            </div>
          ) : result.loading ? (
            <div style={{ display: 'flex', flexDirection: 'column', alignItems: 'center', justifyContent: 'center' }}>
               <div style={{ width: '48px', height: '48px', border: '4px solid var(--border-subtle)', borderTopColor: 'var(--accent-cyan)', borderRadius: '50%' }} className="animate-spin"></div>
               <p className="animate-pulse" style={{ marginTop: '1.5rem', color: 'var(--accent-cyan)', fontWeight: 600, fontSize: '1.1rem' }}>Running Neural Scrubber...</p>
            </div>
          ) : result.success ? (
            <div className="animate-fade-in" style={{ display: 'flex', flexDirection: 'column', height: '100%', justifyContent: 'center' }}>
              <div className="elig-result success">
                <div className="elig-result-title">
                  <ShieldCheck size={28} />
                  <span>Coverage Active</span>
                </div>
                <div style={{ padding: '1.5rem', background: 'var(--bg-surface)', borderRadius: '8px', border: '1px solid var(--border-subtle)', marginTop: '1.5rem' }}>
                  <p style={{ marginBottom: '0.5rem', fontSize: '1.05rem' }}><span style={{ color: 'var(--text-secondary)', width: '80px', display: 'inline-block' }}>Patient:</span> <strong style={{ color: 'var(--text-primary)' }}>{result.patient.name}</strong></p>
                  <p style={{ marginBottom: '0.5rem', fontSize: '1.05rem' }}><span style={{ color: 'var(--text-secondary)', width: '80px', display: 'inline-block' }}>DOB:</span> <strong style={{ color: 'var(--text-primary)' }}>{result.patient.dob}</strong></p>
                  <p style={{ marginBottom: '0.5rem', fontSize: '1.05rem', display: 'flex', alignItems: 'center' }}><span style={{ color: 'var(--text-secondary)', width: '80px', display: 'inline-block' }}>Provider:</span> <span className="badge badge-active">{result.message}</span></p>
                  <p style={{ marginTop: '1.5rem', paddingTop: '1.5rem', borderTop: '1px solid var(--border-subtle)', fontSize: '0.95rem' }}>
                    <span style={{ color: 'var(--text-secondary)', fontWeight: 600 }}>Clinical Dx:</span> {result.patient.diagnosis}
                  </p>
                </div>
              </div>
              <p style={{ textAlign: 'center', fontSize: '0.9rem', color: 'var(--text-muted)', marginTop: '1.5rem' }}>Proceed to Middle Man (Claims) to submit a procedure.</p>
            </div>
          ) : (
            <div className="animate-fade-in" style={{ display: 'flex', flexDirection: 'column', height: '100%', justifyContent: 'center' }}>
               <div className="elig-result error">
                  <div className="elig-result-title">
                    <XCircle size={28} />
                    <span>Coverage Denied</span>
                  </div>
                  <div style={{ marginTop: '1.5rem', padding: '1rem', background: '#fff1f2', border: '1px solid #fecdd3', borderRadius: '8px' }}>
                    <p style={{ color: 'var(--accent-rosewood)', fontWeight: 'bold', fontSize: '1.1rem', marginBottom: '0.5rem' }}>{result.message}</p>
                    <p style={{ fontSize: '0.9rem', color: 'var(--text-secondary)', lineHeight: 1.5 }}>Please verify the ID format and Provider selection. The ID must match the provider prefix.</p>
                  </div>
               </div>
            </div>
          )}
        </div>
      </div>
    </div>
  );
};

export default EligibilityView;
