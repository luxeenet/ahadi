import React, { useState } from 'react';
import { 
  Shield, 
  CheckCircle2, 
  Clock, 
  AlertTriangle, 
  Award, 
  FileText, 
  Search, 
  Plus, 
  User, 
  ChevronRight,
  Sparkles,
  Lock,
  Zap,
  TrendingUp,
  MapPin,
  Briefcase
} from 'lucide-react';
import './index.css';

// Mock Commitments
const SAMPLE_COMMITMENTS = [
  {
    id: 'AH-882941',
    title: 'Solar Panel Installation & Wiring',
    category: 'TECHNICAL_SERVICE',
    promisor: 'Juma Hassan (Fundi)',
    promisee: 'Amina Salum',
    status: 'ACTIVE',
    dueDate: '2026-09-25',
    value: 'TZS 1,200,000',
    trustScore: 94.8,
    evidenceCount: 3,
    milestones: '2 / 4 Completed'
  },
  {
    id: 'AH-719304',
    title: 'Monthly Chama Micro-Fund Contribution',
    category: 'SAVINGS_GROUP',
    promisor: 'Kinondoni Women Chama',
    promisee: 'Group Treasury',
    status: 'VERIFIED',
    dueDate: '2026-09-15',
    value: 'TZS 250,000',
    trustScore: 99.1,
    evidenceCount: 12,
    milestones: 'Fully Verified'
  },
  {
    id: 'AH-610294',
    title: 'Commercial Office Supply Delivery',
    category: 'BUSINESS_DELIVERY',
    promisor: 'Kibo Logistics Ltd',
    promisee: 'Azam Tech Hub',
    status: 'AT_RISK',
    dueDate: '2026-09-18',
    value: 'TZS 4,500,000',
    trustScore: 88.4,
    evidenceCount: 1,
    milestones: '1 / 3 Completed'
  }
];

export function App() {
  const [activeTab, setActiveTab] = useState<'dashboard' | 'commitments' | 'trust' | 'create'>('dashboard');
  const [searchQuery, setSearchQuery] = useState('');

  return (
    <div style={{ minHeight: '100vh', display: 'flex', flexDirection: 'column' }}>
      {/* ── TOP HEADER / NAVIGATION BAR ────────────────────────────────────── */}
      <header style={{ 
        borderBottom: '1px solid var(--border-subtle)', 
        background: 'rgba(9, 13, 22, 0.8)', 
        backdropFilter: 'blur(20px)',
        position: 'sticky',
        top: 0,
        zIndex: 50
      }}>
        <div style={{ maxWidth: '1280px', margin: '0 auto', padding: '16px 24px', display: 'flex', alignItems: 'center', justifyContent: 'space-between' }}>
          {/* Logo */}
          <div style={{ display: 'flex', alignItems: 'center', gap: '12px', cursor: 'pointer' }} onClick={() => setActiveTab('dashboard')}>
            <div style={{ 
              width: '40px', 
              height: '40px', 
              borderRadius: '12px', 
              background: 'linear-gradient(135deg, #6366f1 0%, #06b6d4 100%)', 
              display: 'flex', 
              alignItems: 'center', 
              justifyContent: 'center',
              boxShadow: '0 0 20px rgba(99, 102, 241, 0.4)'
            }}>
              <Shield style={{ color: '#ffffff', width: '22px', height: '22px' }} />
            </div>
            <div>
              <h1 style={{ fontSize: '1.25rem', fontWeight: 800, letterSpacing: '-0.025em', color: '#ffffff' }}>AHADI</h1>
              <p style={{ fontSize: '0.6875rem', color: 'var(--text-muted)', fontWeight: 500, letterSpacing: '0.05em' }}>TRUST NETWORK</p>
            </div>
          </div>

          {/* Navigation Links */}
          <nav style={{ display: 'flex', gap: '8px' }}>
            {[
              { id: 'dashboard', label: 'Dashboard', icon: Shield },
              { id: 'commitments', label: 'Commitments', icon: FileText },
              { id: 'trust', label: 'Trust DNA', icon: Award },
            ].map((tab) => {
              const Icon = tab.icon;
              const isActive = activeTab === tab.id;
              return (
                <button
                  key={tab.id}
                  onClick={() => setActiveTab(tab.id as any)}
                  style={{
                    display: 'flex',
                    alignItems: 'center',
                    gap: '8px',
                    padding: '8px 16px',
                    borderRadius: 'var(--radius-md)',
                    border: 'none',
                    background: isActive ? 'rgba(99, 102, 241, 0.15)' : 'transparent',
                    color: isActive ? '#818cf8' : 'var(--text-muted)',
                    fontWeight: isActive ? 600 : 500,
                    cursor: 'pointer',
                    transition: 'all 0.2s'
                  }}
                >
                  <Icon style={{ width: '18px', height: '18px' }} />
                  {tab.label}
                </button>
              );
            })}
          </nav>

          {/* Right Action */}
          <div style={{ display: 'flex', alignItems: 'center', gap: '16px' }}>
            <button className="btn-primary" onClick={() => setActiveTab('create')}>
              <Plus style={{ width: '18px', height: '18px' }} />
              New Commitment
            </button>
            <div style={{ 
              width: '38px', 
              height: '38px', 
              borderRadius: '50%', 
              background: 'rgba(255, 255, 255, 0.1)', 
              display: 'flex', 
              alignItems: 'center', 
              justifyContent: 'center',
              border: '1px solid var(--border-subtle)',
              cursor: 'pointer'
            }}>
              <User style={{ width: '18px', height: '18px', color: '#e5e7eb' }} />
            </div>
          </div>
        </div>
      </header>

      {/* ── MAIN CONTENT CONTAINER ────────────────────────────────────────── */}
      <main style={{ flex: 1, maxWidth: '1280px', width: '100%', margin: '0 auto', padding: '32px 24px' }}>
        
        {/* ── HERO BANNER ─────────────────────────────────────────────────── */}
        <div className="glass-panel" style={{ padding: '32px', marginBottom: '32px', position: 'relative', overflow: 'hidden' }}>
          <div style={{ position: 'relative', zIndex: 2, maxWidth: '720px' }}>
            <div className="badge-trust" style={{ marginBottom: '16px' }}>
              <Sparkles style={{ width: '14px', height: '14px' }} /> Verifiable Promise & Trust Infrastructure
            </div>
            <h2 className="text-gradient" style={{ fontSize: '2.25rem', fontWeight: 800, lineHeight: 1.2, marginBottom: '12px' }}>
              Make Commitments. Prove Reliability. Build Global Trust.
            </h2>
            <p style={{ color: 'var(--text-muted)', fontSize: '1rem', marginBottom: '24px' }}>
              AHADI tracks, verifies, and records promise fulfillment across sectors — from technical service delivery to micro-finance. Your reputation is immutable and auditable.
            </p>
            <div style={{ display: 'flex', gap: '16px' }}>
              <div className="glass-panel" style={{ padding: '12px 20px', borderRadius: 'var(--radius-md)' }}>
                <span style={{ fontSize: '0.75rem', color: 'var(--text-subtle)', display: 'block' }}>Verified Score</span>
                <span style={{ fontSize: '1.25rem', fontWeight: 800, color: '#34d399' }}>98.4 / 100</span>
              </div>
              <div className="glass-panel" style={{ padding: '12px 20px', borderRadius: 'var(--radius-md)' }}>
                <span style={{ fontSize: '0.75rem', color: 'var(--text-subtle)', display: 'block' }}>Active Promises</span>
                <span style={{ fontSize: '1.25rem', fontWeight: 800, color: '#818cf8' }}>14 Active</span>
              </div>
              <div className="glass-panel" style={{ padding: '12px 20px', borderRadius: 'var(--radius-md)' }}>
                <span style={{ fontSize: '0.75rem', color: 'var(--text-subtle)', display: 'block' }}>On-Time Rate</span>
                <span style={{ fontSize: '1.25rem', fontWeight: 800, color: '#38bdf8' }}>99.2%</span>
              </div>
            </div>
          </div>
        </div>

        {/* ── SEARCH & FILTER ROW ─────────────────────────────────────────── */}
        <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: '24px', gap: '16px' }}>
          <div className="glass-panel" style={{ display: 'flex', alignItems: 'center', padding: '8px 16px', gap: '12px', flex: 1, maxWidth: '480px' }}>
            <Search style={{ width: '18px', height: '18px', color: 'var(--text-subtle)' }} />
            <input 
              type="text" 
              placeholder="Search commitments by ID, promisor, or deliverable..." 
              value={searchQuery}
              onChange={(e) => setSearchQuery(e.target.value)}
              style={{
                background: 'transparent',
                border: 'none',
                color: '#ffffff',
                outline: 'none',
                width: '100%',
                fontSize: '0.9375rem'
              }}
            />
          </div>

          <div style={{ display: 'flex', gap: '8px' }}>
            {['All', 'Active', 'Verified', 'At Risk'].map((filter, i) => (
              <button 
                key={filter} 
                className={i === 0 ? "btn-primary" : "btn-secondary"}
                style={{ padding: '8px 16px', fontSize: '0.875rem' }}
              >
                {filter}
              </button>
            ))}
          </div>
        </div>

        {/* ── COMMITMENT CARDS GRID ───────────────────────────────────────── */}
        <div style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fit, minmax(360px, 1fr))', gap: '24px' }}>
          {SAMPLE_COMMITMENTS.map((c) => (
            <div key={c.id} className="glass-panel glass-panel-interactive" style={{ padding: '24px', display: 'flex', flexDirection: 'column', justifyContent: 'space-between' }}>
              <div>
                {/* Top Badge Row */}
                <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: '12px' }}>
                  <span style={{ fontFamily: 'var(--font-mono)', fontSize: '0.8125rem', color: '#818cf8', fontWeight: 600 }}>{c.id}</span>
                  <span style={{
                    padding: '4px 10px',
                    borderRadius: '9999px',
                    fontSize: '0.75rem',
                    fontWeight: 700,
                    background: c.status === 'VERIFIED' ? 'rgba(16, 185, 129, 0.15)' : c.status === 'AT_RISK' ? 'rgba(244, 63, 94, 0.15)' : 'rgba(99, 102, 241, 0.15)',
                    color: c.status === 'VERIFIED' ? '#34d399' : c.status === 'AT_RISK' ? '#fb7185' : '#a5b4fc',
                    border: `1px solid ${c.status === 'VERIFIED' ? 'rgba(16, 185, 129, 0.3)' : c.status === 'AT_RISK' ? 'rgba(244, 63, 94, 0.3)' : 'rgba(99, 102, 241, 0.3)'}`
                  }}>
                    {c.status}
                  </span>
                </div>

                <h3 style={{ fontSize: '1.125rem', fontWeight: 700, color: '#ffffff', marginBottom: '8px' }}>{c.title}</h3>
                
                <div style={{ display: 'flex', flexDirection: 'column', gap: '8px', marginBottom: '20px', fontSize: '0.875rem', color: 'var(--text-muted)' }}>
                  <div style={{ display: 'flex', alignItems: 'center', gap: '8px' }}>
                    <User style={{ width: '16px', height: '16px', color: 'var(--text-subtle)' }} />
                    <span>Promisor: <strong style={{ color: '#f3f4f6' }}>{c.promisor}</strong></span>
                  </div>
                  <div style={{ display: 'flex', alignItems: 'center', gap: '8px' }}>
                    <Clock style={{ width: '16px', height: '16px', color: 'var(--text-subtle)' }} />
                    <span>Deadline: {c.dueDate}</span>
                  </div>
                </div>
              </div>

              {/* Card Footer Info */}
              <div style={{ borderTop: '1px solid var(--border-subtle)', paddingTop: '16px', display: 'flex', justifyContent: 'space-between', alignItems: 'center' }}>
                <div>
                  <span style={{ fontSize: '0.75rem', color: 'var(--text-subtle)', display: 'block' }}>Commitment Value</span>
                  <span style={{ fontSize: '1rem', fontWeight: 700, color: '#ffffff' }}>{c.value}</span>
                </div>
                <button className="btn-secondary" style={{ padding: '6px 12px', fontSize: '0.8125rem' }}>
                  View Details <ChevronRight style={{ width: '14px', height: '14px' }} />
                </button>
              </div>
            </div>
          ))}
        </div>
      </main>
    </div>
  );
}
export default App;
