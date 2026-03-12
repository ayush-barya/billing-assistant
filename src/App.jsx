import React from 'react';
import { DataProvider, useData } from './context/DataContext';
import { Activity, ShieldCheck, FileCheck2, BarChart2, User, FileWarning, ClipboardList } from 'lucide-react';
import './index.css';

import EligibilityView from './pages/EligibilityView';

import ClaimsView from './pages/ClaimsView';
import DenialsView from './pages/DenialsView';

const MainLayout = () => {
  const [activeTab, setActiveTab] = React.useState('eligibility');
  
  return (
    <div className="app-container">
      {/* Sidebar */}
      <aside className="sidebar">
        <div className="sidebar-header">
          <div className="sidebar-logo">
             <Activity size={24} strokeWidth={2.5} />
          </div>
          <h1 className="text-2xl font-extrabold tracking-tight text-[#0f172a]">OncoAssist</h1>
        </div>
        
        <nav className="sidebar-nav">
          <div className="nav-label">Modules</div>
          <button 
            className={`btn btn-nav ${activeTab === 'eligibility' ? 'active' : ''}`}
            onClick={() => setActiveTab('eligibility')}
          >
            <ShieldCheck size={20} className={activeTab === 'eligibility' ? 'text-accent-cyan' : 'text-text-muted'} strokeWidth={2} /> Front Door (Eligibility)
          </button>
          
          <button 
            className={`btn btn-nav ${activeTab === 'claims' ? 'active' : ''}`}
            onClick={() => setActiveTab('claims')}
          >
            <FileCheck2 size={20} className={activeTab === 'claims' ? 'text-accent-cyan' : 'text-text-muted'} strokeWidth={2} /> Middle Man (Claims)
          </button>
          
          <button 
            className={`btn btn-nav ${activeTab === 'denials' ? 'active' : ''}`}
            onClick={() => setActiveTab('denials')}
          >
            <BarChart2 size={20} className={activeTab === 'denials' ? 'text-accent-cyan' : 'text-text-muted'} strokeWidth={2} /> Back Office (Denials)
          </button>
        </nav>

        <div className="sidebar-footer">
           <div className="user-avatar">
             <User size={20} strokeWidth={2} />
           </div>
           <div className="user-info">
             <p className="user-name">Dr. S. Jenkins</p>
             <p className="user-dept">Oncology</p>
           </div>
        </div>
      </aside>

      {/* Main Content Area */}
      <main className="main-content">
        <header className="header">
           <h2>
             {activeTab === 'eligibility' && 'Eligibility & Benefits'}
             {activeTab === 'claims' && 'Automated Claim Scrubber & Prior Auth'}
             {activeTab === 'denials' && 'Denial Triage Dashboard'}
           </h2>
           <div>
             <span className="badge badge-active animate-fade-in">System Online</span>
           </div>
        </header>
        
        <div className="page-content animate-fade-in">
           {activeTab === 'eligibility' && <EligibilityView />}
           {activeTab === 'claims' && <ClaimsView />}
           {activeTab === 'denials' && <DenialsView />}
        </div>
      </main>
    </div>
  );
};

function App() {
  return (
    <DataProvider>
      <MainLayout />
    </DataProvider>
  );
}

export default App;
