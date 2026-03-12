import React, { useMemo } from 'react';
import { useData } from '../context/DataContext';
import { FileWarning, Clock, AlertOctagon, CheckCircle2 } from 'lucide-react';

const DenialsView = () => {
  const { claims } = useData();

  const deniedClaims = useMemo(() => {
    return claims
      .filter(c => c.status === 'Denied')
      .map(claim => {
        let computedPriority = 'Normal';
        if (claim.denialReason?.toLowerCase().includes('duplicate')) {
          computedPriority = 'Low';
        } else if (claim.denialReason?.toLowerCase().includes('medical necessity')) {
          computedPriority = 'High';
        }
        return { ...claim, computedPriority };
      });
  }, [claims]);

  const highPriority = deniedClaims.filter(c => c.computedPriority === 'High');
  const lowPriority = deniedClaims.filter(c => c.computedPriority === 'Low');

  const totalDenials = deniedClaims.length;
  const highPercentage = totalDenials ? Math.round((highPriority.length / totalDenials) * 100) : 0;
  const lowPercentage = totalDenials ? Math.round((lowPriority.length / totalDenials) * 100) : 0;

  return (
    <div className="denials-container animate-fade-in">
      <div className="glass-panel" style={{ padding: '2rem' }}>
        <div className="dashboard-header">
          <div className="dashboard-title">
            <FileWarning size={32} strokeWidth={1.5} />
            <h2>Denial Triage Dashboard</h2>
          </div>
          <span className="sync-status">
            <Clock size={18} /> Last Sync: Just Now
          </span>
        </div>
        
        <div className="stat-cards-grid">
           <div className="stat-card">
             <h3 className="nav-label" style={{ padding: 0, marginBottom: '1rem' }}>Triage Breakdown</h3>
             {totalDenials > 0 ? (
               <div className="ratio-bar-container">
                 <div style={{ width: `${highPercentage}%` }} className="bg-accent-rosewood h-full transition-all duration-500"></div>
                 <div style={{ width: `${lowPercentage}%` }} className="bg-accent-amber h-full transition-all duration-500"></div>
               </div>
             ) : (
               <div className="ratio-bar-container"></div>
             )}
             <div className="ratio-label">
                <span className="text-accent-rosewood">{highPercentage}% Clinical</span>
                <span className="text-accent-amber">{lowPercentage}% Admin</span>
             </div>
          </div>
          
           <div className="stat-card clinical">
              <div className="stat-card-title text-accent-rosewood"><AlertOctagon size={24} strokeWidth={1.5} /> Action Required</div>
              <p className="stat-card-value">{highPriority.length}</p>
              <p className="stat-card-desc">Clinical Review (Medical Necessity)</p>
           </div>
           
           <div className="stat-card admin">
              <div className="stat-card-title text-accent-amber"><Clock size={24} strokeWidth={1.5} /> Administrative</div>
              <p className="stat-card-value">{lowPriority.length}</p>
              <p className="stat-card-desc">Low Priority (Duplicates, etc.)</p>
           </div>
        </div>

        <h3 className="section-title">High Priority - Clinical Review</h3>
        {highPriority.length === 0 ? (
          <p className="text-muted italic" style={{ marginBottom: '2.5rem' }}>No high priority denials requiring clinical review.</p>
        ) : (
          <div className="claim-list">
            {highPriority.map(claim => (
              <div key={claim.id} className="claim-card">
                 <div className="claim-info">
                    <h4 className="claim-id-row">
                       {claim.id} 
                       <span className="badge badge-inactive">Denied</span>
                    </h4>
                    <p className="claim-details">
                      <span className="claim-detail-highlight">Target:</span> {claim.patientId} &bull; 
                      <span className="claim-detail-highlight" style={{ marginLeft: '0.75rem' }}>Proc:</span> {claim.procedure} &bull; 
                      <span className="claim-detail-highlight" style={{ marginLeft: '0.75rem' }}>ICD:</span> {claim.icd}
                    </p>
                    <p className="claim-reason-label">Primary Reason</p>
                    <p className="claim-reason">{claim.denialReason}</p>
                 </div>
                 <button className="btn btn-primary" style={{ padding: '0.85rem 1.75rem', fontSize: '1rem' }}>
                   Launch Appeal
                 </button>
              </div>
            ))}
          </div>
        )}

        <h3 className="section-title" style={{ marginTop: '3rem' }}>Low Priority - Administrative</h3>
        {lowPriority.length === 0 ? (
          <p className="text-muted italic">No low priority denials.</p>
        ) : (
          <div className="claim-list">
            {lowPriority.map(claim => (
              <div key={claim.id} className="claim-card admin-row">
                 <div className="claim-info">
                    <h4 className="claim-id-row">
                       {claim.id} 
                       <span className="badge badge-pending">Admin Reject</span>
                    </h4>
                    <p className="claim-details">
                      <span className="claim-detail-highlight">Target:</span> {claim.patientId} &bull; <span className="claim-detail-highlight" style={{ marginLeft: '0.75rem' }}>Proc:</span> {claim.procedure}
                    </p>
                    <p className="claim-reason-label">Primary Reason</p>
                    <p className="claim-reason">{claim.denialReason}</p>
                 </div>
                 <button className="btn btn-ghost">
                   Auto-Resolve
                 </button>
              </div>
            ))}
          </div>
        )}
      </div>
    </div>
  );
};

export default DenialsView;
