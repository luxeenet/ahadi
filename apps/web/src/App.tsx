import { useState, useEffect } from 'react';
import { 
  Shield, 
  Clock, 
  Award, 
  FileText, 
  Search, 
  Plus, 
  User, 
  ChevronRight,
  Sparkles,
  CheckCircle2,
  Building2,
  LogOut,
  X,
  Scale
} from 'lucide-react';

import './index.css';
import { apiClient } from './api/client';

export function App() {
  const [activeTab, setActiveTab] = useState<'dashboard' | 'commitments' | 'trust' | 'businesses' | 'disputes'>('dashboard');
  const [searchQuery, setSearchQuery] = useState('');
  const [selectedFilter, setSelectedFilter] = useState<'ALL' | 'ACTIVE' | 'VERIFIED' | 'AT_RISK'>('ALL');
  
  // Modal states
  const [showCreateModal, setShowCreateModal] = useState(false);
  const [showAuthModal, setShowAuthModal] = useState(false);
  const [showDetailsModal, setShowDetailsModal] = useState<any>(null);

  // Form states
  const [authMode, setAuthMode] = useState<'LOGIN' | 'REGISTER'>('LOGIN');
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [firstName, setFirstName] = useState('');
  const [lastName, setLastName] = useState('');
  
  // Commitment creation form state
  const [newTitle, setNewTitle] = useState('');
  const [newValue, setNewValue] = useState('');
  const [newDueDate, setNewDueDate] = useState('');

  const [commitments, setCommitments] = useState<any[]>([]);
  const [businesses, setBusinesses] = useState<any[]>([]);
  const [user, setUser] = useState<any>(null);
  const [trustProfile, setTrustProfile] = useState<any>(null);

  const fetchCommitments = async () => {
    try {
      const res = await apiClient.get('/commitments');
      const apiData = res.data.data || res.data;
      if (Array.isArray(apiData)) {
        setCommitments(apiData.map((item: any) => ({
          id: item.publicId || item.id,
          title: item.title,
          category: item.category || 'TECHNICAL_SERVICE',
          promisor: item.promisorUserId || 'Verified User',
          promisee: item.promiseeUserId || 'Counterparty',
          status: item.status || 'ACTIVE',
          dueDate: item.dueDate ? new Date(item.dueDate).toISOString().split('T')[0] : '2026-10-01',
          value: item.value ? `TZS ${Number(item.value).toLocaleString()}` : 'TZS 500,000',
          trustScore: 95.0,
          evidenceCount: item.evidenceCount || 0,
          milestones: item.milestones?.length ? item.milestones : [{ title: 'Initial Deliverable', status: 'ACTIVE' }]
        })));
      }
    } catch (err) {
      console.log('No backend commitments loaded yet.');
    }
  };

  const fetchBusinesses = async () => {
    try {
      const res = await apiClient.get('/businesses');
      const apiData = res.data.data || res.data;
      if (Array.isArray(apiData)) {
        setBusinesses(apiData);
      }
    } catch (err) {
      console.log('No backend businesses loaded yet.');
    }
  };

  const fetchTrustProfile = async (userId: string) => {
    try {
      const res = await apiClient.get(`/trust/USER/${userId}`);
      setTrustProfile(res.data.data || res.data);
    } catch (err) {
      console.log('Trust profile loading...');
    }
  };

  useEffect(() => {
    fetchBusinesses();
    const storedToken = localStorage.getItem('ahadi_access_token');
    if (storedToken) {
      apiClient.get('/auth/me')
        .then(res => {
          const userData = res.data.data || res.data;
          setUser(userData);
          fetchCommitments();
          if (userData?.id) fetchTrustProfile(userData.id);
        })
        .catch(() => localStorage.removeItem('ahadi_access_token'));
    }
  }, []);

  const handleAuthSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    try {
      if (authMode === 'LOGIN') {
        const res = await apiClient.post('/auth/login', { identifier: email, password });
        const token = res.data.data?.accessToken || res.data.accessToken;
        const userData = res.data.data?.user || res.data.user;
        localStorage.setItem('ahadi_access_token', token);
        setUser(userData);
        if (userData?.id) fetchTrustProfile(userData.id);
      } else {
        const res = await apiClient.post('/auth/register', { email, password, firstName, lastName });
        const token = res.data.data?.accessToken || res.data.accessToken;
        const userData = res.data.data?.user || res.data.user;
        localStorage.setItem('ahadi_access_token', token);
        setUser(userData);
        if (userData?.id) fetchTrustProfile(userData.id);
      }
      setShowAuthModal(false);
      fetchCommitments();
      fetchBusinesses();
    } catch (err: any) {
      alert(err.response?.data?.error?.message || err.response?.data?.message || 'Authentication failed. Please check credentials.');
    }
  };

  const handleCreateCommitment = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!user) {
      alert('Please sign in or register an account first to publish a commitment!');
      setShowAuthModal(true);
      return;
    }

    try {
      const payload = {
        title: newTitle,
        category: 'TECHNICAL_SERVICE',
        promisorType: 'USER',
        promisorUserId: user.id,
        promiseeType: 'USER',
        promiseeUserId: user.id,
        value: Number(newValue) || 500000,
        currency: 'TZS',
        dueDate: newDueDate ? new Date(newDueDate).toISOString() : new Date(Date.now() + 864000000).toISOString()
      };

      const res = await apiClient.post('/commitments', payload);
      const created = res.data.data || res.data;
      
      const newCommitmentFormatted = {
        id: created.publicId || created.id || `AH-${Math.floor(100000 + Math.random() * 900000)}`,
        title: created.title || newTitle,
        category: created.category || 'TECHNICAL_SERVICE',
        promisor: user.email || 'You',
        promisee: 'Verified Counterparty',
        status: created.status || 'ACTIVE',
        dueDate: newDueDate || '2026-10-01',
        value: `TZS ${Number(newValue || 500000).toLocaleString()}`,
        trustScore: 98.0,
        evidenceCount: 0,
        milestones: [{ title: 'Site Inspection & Setup', status: 'ACTIVE' }]
      };

      setCommitments([newCommitmentFormatted, ...commitments]);
      setShowCreateModal(false);
      setNewTitle('');
      setNewValue('');
      setNewDueDate('');
    } catch (err: any) {
      alert(err.response?.data?.error?.message || err.response?.data?.message || 'Failed to create commitment on backend.');
    }
  };

  const filteredCommitments = commitments.filter(c => {
    const matchesSearch = c.title.toLowerCase().includes(searchQuery.toLowerCase()) || c.id.toLowerCase().includes(searchQuery.toLowerCase());
    const matchesFilter = selectedFilter === 'ALL' || c.status === selectedFilter;
    return matchesSearch && matchesFilter;
  });

  return (
    <div style={{ minHeight: '100vh', display: 'flex', flexDirection: 'column' }}>
      {/* ── TOP HEADER / NAVIGATION BAR ────────────────────────────────────── */}
      <header style={{ 
        borderBottom: '1px solid var(--border-subtle)', 
        background: 'var(--bg-surface)', 
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
              borderRadius: '8px', 
              background: 'linear-gradient(135deg, #059669 0%, #047857 100%)', 
              display: 'flex', 
              alignItems: 'center', 
              justifyContent: 'center',
              border: '1px solid #10b981'
            }}>
              <Shield style={{ color: '#ffffff', width: '22px', height: '22px' }} />
            </div>
            <div>
              <h1 style={{ fontSize: '1.25rem', fontWeight: 800, letterSpacing: '-0.025em', color: '#ffffff' }}>AHADI</h1>
              <p style={{ fontSize: '0.6875rem', color: '#10b981', fontWeight: 700, letterSpacing: '0.05em' }}>VERIFIABLE TRUST NETWORK</p>
            </div>
          </div>

          {/* Navigation Links */}
          <nav style={{ display: 'flex', gap: '8px' }}>
            {[
              { id: 'dashboard', label: 'Dashboard', icon: Shield },
              { id: 'commitments', label: 'Commitments', icon: FileText },
              { id: 'trust', label: 'Trust DNA', icon: Award },
              { id: 'businesses', label: 'Businesses', icon: Building2 },
              { id: 'disputes', label: 'Disputes', icon: Scale },
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
                    borderRadius: '6px',
                    border: isActive ? '1px solid #059669' : '1px solid transparent',
                    background: isActive ? '#0f3127' : 'transparent',
                    color: isActive ? '#34d399' : '#9ca3af',
                    fontWeight: isActive ? 700 : 500,
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
            <button className="btn-crdb-primary" onClick={() => setShowCreateModal(true)}>
              <Plus style={{ width: '18px', height: '18px' }} />
              New Commitment
            </button>
            {user ? (
              <div style={{ display: 'flex', alignItems: 'center', gap: '12px' }}>
                <span style={{ fontSize: '0.875rem', color: '#e5e7eb', fontWeight: 600 }}>{user.email}</span>
                <button className="btn-crdb-secondary" style={{ padding: '6px 12px' }} onClick={() => { localStorage.removeItem('ahadi_access_token'); setUser(null); setCommitments([]); }}>
                  <LogOut style={{ width: '16px', height: '16px' }} />
                </button>
              </div>
            ) : (
              <button className="btn-crdb-secondary" onClick={() => setShowAuthModal(true)}>
                Sign In / Register
              </button>
            )}
          </div>
        </div>
      </header>


      {/* ── MAIN CONTENT AREA ────────────────────────────────────────────── */}
      <main style={{ flex: 1, maxWidth: '1280px', width: '100%', margin: '0 auto', padding: '32px 24px' }}>
        
        {/* ── DASHBOARD & COMMITMENTS TAB CONTENT ─────────────────────────── */}
        {(activeTab === 'dashboard' || activeTab === 'commitments') && (
          <>
            <div className="crdb-card" style={{ padding: '32px', marginBottom: '32px', position: 'relative', overflow: 'hidden' }}>
              <div style={{ position: 'relative', zIndex: 2, maxWidth: '720px' }}>
                <div className="badge-crdb-emerald" style={{ marginBottom: '16px' }}>
                  <Sparkles style={{ width: '14px', height: '14px' }} /> Verifiable Promise & Trust Infrastructure
                </div>
                <h2 style={{ fontSize: '2.25rem', fontWeight: 800, lineHeight: 1.2, marginBottom: '12px', color: '#ffffff' }}>
                  Make Commitments. Prove Reliability. Build Global Trust.
                </h2>
                <p style={{ color: '#9ca3af', fontSize: '1rem', marginBottom: '24px' }}>
                  AHADI tracks, verifies, and records promise fulfillment across sectors. Your reputation is immutable and auditable.
                </p>
                <div style={{ display: 'flex', gap: '16px' }}>
                  <div className="crdb-card" style={{ padding: '12px 20px', borderRadius: 'var(--radius-md)' }}>
                    <span style={{ fontSize: '0.75rem', color: '#6b7280', display: 'block' }}>Overall Score</span>
                    <span style={{ fontSize: '1.25rem', fontWeight: 800, color: '#34d399' }}>{trustProfile?.overallScore || '50.0'} / 100</span>
                  </div>
                  <div className="crdb-card" style={{ padding: '12px 20px', borderRadius: 'var(--radius-md)' }}>
                    <span style={{ fontSize: '0.75rem', color: '#6b7280', display: 'block' }}>Active Promises</span>
                    <span style={{ fontSize: '1.25rem', fontWeight: 800, color: '#10b981' }}>{commitments.length} Active</span>
                  </div>
                  <div className="crdb-card" style={{ padding: '12px 20px', borderRadius: 'var(--radius-md)' }}>
                    <span style={{ fontSize: '0.75rem', color: '#6b7280', display: 'block' }}>Timeliness Score</span>
                    <span style={{ fontSize: '1.25rem', fontWeight: 800, color: '#34d399' }}>{trustProfile?.timelinessScore || '50.0'}%</span>
                  </div>
                </div>
              </div>
            </div>

            {/* Controls */}
            <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: '24px', gap: '16px' }}>
              <div className="crdb-card" style={{ display: 'flex', alignItems: 'center', padding: '8px 16px', gap: '12px', flex: 1, maxWidth: '480px' }}>
                <Search style={{ width: '18px', height: '18px', color: '#6b7280' }} />
                <input 
                  type="text" 
                  placeholder="Search commitments by ID, promisor, or deliverable..." 
                  value={searchQuery}
                  onChange={(e) => setSearchQuery(e.target.value)}
                  style={{ background: 'transparent', border: 'none', color: '#ffffff', outline: 'none', width: '100%', fontSize: '0.9375rem' }}
                />
              </div>

              <div style={{ display: 'flex', gap: '8px' }}>
                {[
                  { id: 'ALL', label: 'All' },
                  { id: 'ACTIVE', label: 'Active' },
                  { id: 'VERIFIED', label: 'Verified' },
                  { id: 'AT_RISK', label: 'At Risk' },
                ].map((f) => (
                  <button 
                    key={f.id} 
                    onClick={() => setSelectedFilter(f.id as any)}
                    className={selectedFilter === f.id ? "btn-crdb-primary" : "btn-crdb-secondary"}
                    style={{ padding: '8px 16px', fontSize: '0.875rem' }}
                  >
                    {f.label}
                  </button>
                ))}
              </div>
            </div>

            {/* Cards Grid */}
            {filteredCommitments.length === 0 ? (
              <div className="crdb-card" style={{ padding: '48px', textAlign: 'center' }}>
                <p style={{ color: '#9ca3af', marginBottom: '16px' }}>No commitments found for your account.</p>
                <button className="btn-crdb-primary" style={{ margin: '0 auto' }} onClick={() => setShowCreateModal(true)}>
                  <Plus style={{ width: '18px', height: '18px' }} /> Create First Commitment
                </button>
              </div>
            ) : (
              <div style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fit, minmax(360px, 1fr))', gap: '24px' }}>
                {filteredCommitments.map((c) => (
                  <div key={c.id} className="crdb-card crdb-card-interactive" style={{ padding: '24px', display: 'flex', flexDirection: 'column', justifyContent: 'space-between' }}>
                    <div>
                      <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: '12px' }}>
                        <span style={{ fontFamily: 'var(--font-mono)', fontSize: '0.8125rem', color: '#34d399', fontWeight: 600 }}>{c.id}</span>
                        <span style={{
                          padding: '4px 10px',
                          borderRadius: '9999px',
                          fontSize: '0.75rem',
                          fontWeight: 700,
                          background: c.status === 'VERIFIED' ? 'rgba(16, 185, 129, 0.2)' : c.status === 'AT_RISK' ? 'rgba(239, 68, 68, 0.2)' : 'rgba(5, 150, 105, 0.2)',
                          color: c.status === 'VERIFIED' ? '#34d399' : c.status === 'AT_RISK' ? '#f87171' : '#6ee7b7',
                          border: `1px solid ${c.status === 'VERIFIED' ? 'rgba(16, 185, 129, 0.4)' : c.status === 'AT_RISK' ? 'rgba(239, 68, 68, 0.4)' : 'rgba(5, 150, 105, 0.4)'}`
                        }}>
                          {c.status}
                        </span>
                      </div>

                      <h3 style={{ fontSize: '1.125rem', fontWeight: 700, color: '#ffffff', marginBottom: '8px' }}>{c.title}</h3>
                      
                      <div style={{ display: 'flex', flexDirection: 'column', gap: '8px', marginBottom: '20px', fontSize: '0.875rem', color: '#9ca3af' }}>
                        <div style={{ display: 'flex', alignItems: 'center', gap: '8px' }}>
                          <User style={{ width: '16px', height: '16px', color: '#6b7280' }} />
                          <span>Promisor: <strong style={{ color: '#f3f4f6' }}>{c.promisor}</strong></span>
                        </div>
                        <div style={{ display: 'flex', alignItems: 'center', gap: '8px' }}>
                          <Clock style={{ width: '16px', height: '16px', color: '#6b7280' }} />
                          <span>Deadline: {c.dueDate}</span>
                        </div>
                      </div>
                    </div>

                    <div style={{ borderTop: '1px solid var(--border-subtle)', paddingTop: '16px', display: 'flex', justifyContent: 'space-between', alignItems: 'center' }}>
                      <div>
                        <span style={{ fontSize: '0.75rem', color: '#6b7280', display: 'block' }}>Commitment Value</span>
                        <span style={{ fontSize: '1rem', fontWeight: 700, color: '#ffffff' }}>{c.value}</span>
                      </div>
                      <button className="btn-crdb-secondary" style={{ padding: '6px 12px', fontSize: '0.8125rem' }} onClick={() => setShowDetailsModal(c)}>
                        View Details <ChevronRight style={{ width: '14px', height: '14px' }} />
                      </button>
                    </div>
                  </div>
                ))}
              </div>
            )}
          </>
        )}

        {/* ── TRUST DNA TAB CONTENT ────────────────────────────────────────── */}
        {activeTab === 'trust' && (
          <div className="crdb-card" style={{ padding: '32px' }}>
            <h2 style={{ fontSize: '1.75rem', fontWeight: 800, marginBottom: '16px', color: '#ffffff' }}>Trust DNA Profile & Score Breakdown</h2>
            <p style={{ color: '#9ca3af', marginBottom: '32px' }}>
              Your Trust DNA is generated by evaluating your track record across multiple verifiable dimensions.
            </p>
            <div style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fit, minmax(280px, 1fr))', gap: '20px' }}>
              <div className="crdb-card" style={{ padding: '24px' }}>
                <div style={{ display: 'flex', justifyContent: 'space-between', marginBottom: '12px' }}>
                  <span style={{ fontSize: '0.875rem', color: '#9ca3af' }}>Reliability Score</span>
                  <CheckCircle2 style={{ color: '#34d399' }} />
                </div>
                <div style={{ fontSize: '2rem', fontWeight: 800, color: '#ffffff', marginBottom: '4px' }}>{trustProfile?.reliabilityScore || '50.0'} %</div>
                <p style={{ fontSize: '0.75rem', color: '#6b7280' }}>Based on dispute-free fulfillment</p>
              </div>
              <div className="crdb-card" style={{ padding: '24px' }}>
                <div style={{ display: 'flex', justifyContent: 'space-between', marginBottom: '12px' }}>
                  <span style={{ fontSize: '0.875rem', color: '#9ca3af' }}>Completion Score</span>
                  <Award style={{ color: '#10b981' }} />
                </div>
                <div style={{ fontSize: '2rem', fontWeight: 800, color: '#ffffff', marginBottom: '4px' }}>{trustProfile?.completionScore || '50.0'} %</div>
                <p style={{ fontSize: '0.75rem', color: '#6b7280' }}>Percentage of accepted promises completed</p>
              </div>
              <div className="crdb-card" style={{ padding: '24px' }}>
                <div style={{ display: 'flex', justifyContent: 'space-between', marginBottom: '12px' }}>
                  <span style={{ fontSize: '0.875rem', color: '#9ca3af' }}>Timeliness Index</span>
                  <Clock style={{ color: '#34d399' }} />
                </div>
                <div style={{ fontSize: '2rem', fontWeight: 800, color: '#ffffff', marginBottom: '4px' }}>{trustProfile?.timelinessScore || '50.0'} %</div>
                <p style={{ fontSize: '0.75rem', color: '#6b7280' }}>Fulfillment before or on target deadline</p>
              </div>
            </div>
          </div>
        )}

        {/* ── BUSINESSES TAB CONTENT ───────────────────────────────────────── */}
        {activeTab === 'businesses' && (
          <div className="crdb-card" style={{ padding: '32px' }}>
            <h2 style={{ fontSize: '1.75rem', fontWeight: 800, marginBottom: '16px', color: '#ffffff' }}>Verified Business Directory</h2>
            <p style={{ color: '#9ca3af', marginBottom: '32px' }}>
              Explore verified companies and professionals with publicly auditable Trust DNA.
            </p>
            {businesses.length === 0 ? (
              <p style={{ color: '#9ca3af' }}>No registered business profiles found on backend database.</p>
            ) : (
              <div style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fit, minmax(320px, 1fr))', gap: '20px' }}>
                {businesses.map((b: any) => (
                  <div key={b.id} className="crdb-card" style={{ padding: '24px' }}>
                    <div style={{ display: 'flex', gap: '12px', alignItems: 'center', marginBottom: '16px' }}>
                      <Building2 style={{ color: '#10b981', width: '32px', height: '32px' }} />
                      <div>
                        <h4 style={{ color: '#fff', fontWeight: 700 }}>{b.name}</h4>
                        <span style={{ fontSize: '0.75rem', color: '#34d399' }}>{b.verificationLevel || 'Registered'}</span>
                      </div>
                    </div>
                    <p style={{ fontSize: '0.875rem', color: '#9ca3af', marginBottom: '16px' }}>{b.description || b.category}</p>
                  </div>
                ))}
              </div>
            )}
          </div>
        )}

        {/* ── DISPUTES TAB CONTENT ─────────────────────────────────────────── */}
        {activeTab === 'disputes' && (
          <div className="crdb-card" style={{ padding: '32px' }}>
            <h2 style={{ fontSize: '1.75rem', fontWeight: 800, marginBottom: '16px', color: '#ffffff' }}>Dispute Resolution & Evidence Vault</h2>
            <p style={{ color: '#9ca3af', marginBottom: '32px' }}>
              Transparent evidence submission and mediator-guided dispute resolution system.
            </p>
            <p style={{ color: '#9ca3af' }}>No active disputes reported for your commitments.</p>
          </div>
        )}


      </main>


      {/* ── CREATE COMMITMENT MODAL ───────────────────────────────────────── */}
      {showCreateModal && (
        <div style={{ position: 'fixed', inset: 0, background: 'rgba(0,0,0,0.85)', zIndex: 100, display: 'flex', alignItems: 'center', justifyContent: 'center', padding: '20px' }}>
          <div className="crdb-card" style={{ maxWidth: '520px', width: '100%', padding: '32px', position: 'relative' }}>
            <button onClick={() => setShowCreateModal(false)} style={{ position: 'absolute', top: '20px', right: '20px', background: 'transparent', border: 'none', color: '#9ca3af', cursor: 'pointer' }}>
              <X />
            </button>
            <h3 style={{ fontSize: '1.5rem', fontWeight: 800, marginBottom: '20px', color: '#ffffff' }}>Create Verifiable Commitment</h3>
            <form onSubmit={handleCreateCommitment} style={{ display: 'flex', flexDirection: 'column', gap: '16px' }}>
              <div>
                <label style={{ fontSize: '0.8125rem', color: '#9ca3af', display: 'block', marginBottom: '6px' }}>Title</label>
                <input required type="text" value={newTitle} onChange={e => setNewTitle(e.target.value)} placeholder="e.g., Solar Installation & Electrical Wiring" style={{ width: '100%', padding: '10px', borderRadius: '6px', background: '#0b251d', border: '1px solid #1e5243', color: '#fff' }} />
              </div>
              <div>
                <label style={{ fontSize: '0.8125rem', color: '#9ca3af', display: 'block', marginBottom: '6px' }}>Value (TZS)</label>
                <input required type="number" value={newValue} onChange={e => setNewValue(e.target.value)} placeholder="1200000" style={{ width: '100%', padding: '10px', borderRadius: '6px', background: '#0b251d', border: '1px solid #1e5243', color: '#fff' }} />
              </div>
              <div>
                <label style={{ fontSize: '0.8125rem', color: '#9ca3af', display: 'block', marginBottom: '6px' }}>Target Deadline</label>
                <input required type="date" value={newDueDate} onChange={e => setNewDueDate(e.target.value)} style={{ width: '100%', padding: '10px', borderRadius: '6px', background: '#0b251d', border: '1px solid #1e5243', color: '#fff' }} />
              </div>
              <button type="submit" className="btn-crdb-primary" style={{ marginTop: '12px', justifyContent: 'center' }}>
                Publish Commitment
              </button>
            </form>
          </div>
        </div>
      )}

      {/* ── AUTH MODAL ────────────────────────────────────────────────────── */}
      {showAuthModal && (
        <div style={{ position: 'fixed', inset: 0, background: 'rgba(0,0,0,0.85)', zIndex: 100, display: 'flex', alignItems: 'center', justifyContent: 'center', padding: '20px' }}>
          <div className="crdb-card" style={{ maxWidth: '420px', width: '100%', padding: '32px', position: 'relative' }}>
            <button onClick={() => setShowAuthModal(false)} style={{ position: 'absolute', top: '20px', right: '20px', background: 'transparent', border: 'none', color: '#9ca3af', cursor: 'pointer' }}>
              <X />
            </button>
            <h3 style={{ fontSize: '1.5rem', fontWeight: 800, marginBottom: '20px', color: '#ffffff' }}>
              {authMode === 'LOGIN' ? 'Sign In to AHADI' : 'Create Account'}
            </h3>
            <form onSubmit={handleAuthSubmit} style={{ display: 'flex', flexDirection: 'column', gap: '16px' }}>
              {authMode === 'REGISTER' && (
                <>
                  <div>
                    <label style={{ fontSize: '0.8125rem', color: '#9ca3af', display: 'block', marginBottom: '6px' }}>First Name</label>
                    <input required type="text" value={firstName} onChange={e => setFirstName(e.target.value)} style={{ width: '100%', padding: '10px', borderRadius: '6px', background: '#0b251d', border: '1px solid #1e5243', color: '#fff' }} />
                  </div>
                  <div>
                    <label style={{ fontSize: '0.8125rem', color: '#9ca3af', display: 'block', marginBottom: '6px' }}>Last Name</label>
                    <input required type="text" value={lastName} onChange={e => setLastName(e.target.value)} style={{ width: '100%', padding: '10px', borderRadius: '6px', background: '#0b251d', border: '1px solid #1e5243', color: '#fff' }} />
                  </div>
                </>
              )}
              <div>
                <label style={{ fontSize: '0.8125rem', color: '#9ca3af', display: 'block', marginBottom: '6px' }}>Email Address</label>
                <input required type="email" value={email} onChange={e => setEmail(e.target.value)} style={{ width: '100%', padding: '10px', borderRadius: '6px', background: '#0b251d', border: '1px solid #1e5243', color: '#fff' }} />
              </div>
              <div>
                <label style={{ fontSize: '0.8125rem', color: '#9ca3af', display: 'block', marginBottom: '6px' }}>Password</label>
                <input required type="password" value={password} onChange={e => setPassword(e.target.value)} style={{ width: '100%', padding: '10px', borderRadius: '6px', background: '#0b251d', border: '1px solid #1e5243', color: '#fff' }} />
              </div>
              <button type="submit" className="btn-crdb-primary" style={{ marginTop: '12px', justifyContent: 'center' }}>
                {authMode === 'LOGIN' ? 'Sign In' : 'Register'}
              </button>
              <button type="button" onClick={() => setAuthMode(authMode === 'LOGIN' ? 'REGISTER' : 'LOGIN')} style={{ background: 'transparent', border: 'none', color: '#34d399', cursor: 'pointer', fontSize: '0.875rem' }}>
                {authMode === 'LOGIN' ? "Don't have an account? Register" : 'Already have an account? Sign In'}
              </button>
            </form>
          </div>
        </div>
      )}

      {/* ── DETAILS MODAL ────────────────────────────────────────────────── */}
      {showDetailsModal && (
        <div style={{ position: 'fixed', inset: 0, background: 'rgba(0,0,0,0.85)', zIndex: 100, display: 'flex', alignItems: 'center', justifyContent: 'center', padding: '20px' }}>
          <div className="crdb-card" style={{ maxWidth: '560px', width: '100%', padding: '32px', position: 'relative' }}>
            <button onClick={() => setShowDetailsModal(null)} style={{ position: 'absolute', top: '20px', right: '20px', background: 'transparent', border: 'none', color: '#9ca3af', cursor: 'pointer' }}>
              <X />
            </button>
            <span style={{ fontFamily: 'var(--font-mono)', fontSize: '0.8125rem', color: '#34d399', fontWeight: 600 }}>{showDetailsModal.id}</span>
            <h3 style={{ fontSize: '1.5rem', fontWeight: 800, marginBottom: '16px', color: '#ffffff' }}>{showDetailsModal.title}</h3>
            
            <div style={{ marginBottom: '20px' }}>
              <span style={{ fontSize: '0.875rem', color: '#9ca3af', display: 'block', marginBottom: '8px' }}>Milestone Progress</span>
              {showDetailsModal.milestones?.map((m: any, idx: number) => (
                <div key={idx} style={{ padding: '8px 12px', borderRadius: '6px', background: '#0b251d', border: '1px solid #1e5243', marginBottom: '8px', display: 'flex', justifyContent: 'space-between', fontSize: '0.875rem' }}>
                  <span>{m.title}</span>
                  <span style={{ fontWeight: 600, color: m.status === 'COMPLETED' || m.status === 'VERIFIED' ? '#34d399' : '#10b981' }}>{m.status}</span>
                </div>
              ))}
            </div>

            <button className="btn-crdb-secondary" style={{ width: '100%', justifyContent: 'center' }} onClick={() => setShowDetailsModal(null)}>
              Close Audit View
            </button>
          </div>
        </div>
      )}
    </div>
  );
}

export default App;

