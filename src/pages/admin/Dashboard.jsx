import React, { useEffect, useState } from 'react';
// eslint-disable-next-line no-unused-vars
import { motion, AnimatePresence } from 'framer-motion';
import { useNavigate } from 'react-router-dom';
import { supabase } from '../../lib/supabase';
import { Icon } from '@iconify/react';

const SERVICE_LABELS = {
  web_dev: 'Web Dev',
  mobile_app: 'Mobile App',
  ui_ux: 'UI/UX',
  backend: 'Backend',
};

const Dashboard = () => {
  const [requests, setRequests] = useState([]);
  const [isLoading, setIsLoading] = useState(true);
  const [selectedRequest, setSelectedRequest] = useState(null);
  const [searchQuery, setSearchQuery] = useState('');
  const [stats, setStats] = useState({ total: 0, thisWeek: 0, pending: 0 });
  const navigate = useNavigate();

  useEffect(() => { fetchRequests(); }, []);

  const fetchRequests = async () => {
    setIsLoading(true);
    try {
      const { data, error } = await supabase
        .from('project_requests')
        .select('*')
        .order('created_at', { ascending: false });
      if (error) throw error;
      const all = data || [];
      const weekAgo = new Date(Date.now() - 7 * 24 * 60 * 60 * 1000);
      const thisWeek = all.filter(r => new Date(r.created_at) >= weekAgo).length;
      setRequests(all);
      setStats({ total: all.length, thisWeek, pending: all.length });
    } catch (e) {
      console.error(e.message);
    } finally {
      setIsLoading(false);
    }
  };

  const handleLogout = async () => {
    await supabase.auth.signOut();
    navigate('/admin/login');
  };

  const fmt = (d) => new Date(d).toLocaleDateString('en-US', { month: 'short', day: 'numeric', year: 'numeric' });

  const filtered = requests.filter(r =>
    !searchQuery ||
    r.full_name?.toLowerCase().includes(searchQuery.toLowerCase()) ||
    r.email?.toLowerCase().includes(searchQuery.toLowerCase())
  );

  return (
    <div style={{ fontFamily: "'Inter', sans-serif" }} className="flex h-screen bg-[#0a0a0a] text-white overflow-hidden">

      {/* ─────────────────────────────────────────
          SIDEBAR
      ───────────────────────────────────────── */}
      <aside className="w-60 shrink-0 bg-[#0f0f0f] border-r border-[#1a1a1a] flex flex-col h-full">

        {/* Logo */}
        <div className="flex items-center gap-2.5 px-5 h-14 border-b border-[#1a1a1a]">
          <div className="w-7 h-7 bg-[#a1ebd4] rounded-md flex items-center justify-center">
            <Icon icon="lucide:zap" className="w-4 h-4 text-black" />
          </div>
          <span className="font-semibold text-[14px] text-white tracking-tight">RiadhVision</span>
        </div>

        {/* Nav */}
        <nav className="flex flex-col gap-0.5 p-3 flex-1">
          <p className="text-[10px] font-semibold text-[#444] uppercase tracking-widest px-2 py-2 mt-1">Overview</p>
          {[
            { label: 'Dashboard', icon: 'lucide:layout-dashboard', active: true },
            { label: 'Requests', icon: 'lucide:inbox' },
            { label: 'Analytics', icon: 'lucide:bar-chart-2' },
          ].map(item => (
            <button
              key={item.label}
              className={`flex items-center gap-2.5 px-3 py-2 rounded-lg text-[13px] font-medium w-full text-left transition-colors
                ${item.active ? 'bg-[#1a1a1a] text-white' : 'text-[#666] hover:text-[#999] hover:bg-[#151515]'}`}
            >
              <Icon icon={item.icon} className="w-4 h-4" />
              {item.label}
            </button>
          ))}
          <p className="text-[10px] font-semibold text-[#444] uppercase tracking-widest px-2 py-2 mt-4">Site</p>
          {[
            { label: 'Live Portfolio', icon: 'lucide:external-link' },
            { label: 'Settings', icon: 'lucide:settings' },
          ].map(item => (
            <button
              key={item.label}
              onClick={item.label === 'Live Portfolio' ? () => navigate('/') : undefined}
              className="flex items-center gap-2.5 px-3 py-2 rounded-lg text-[13px] font-medium w-full text-left text-[#666] hover:text-[#999] hover:bg-[#151515] transition-colors"
            >
              <Icon icon={item.icon} className="w-4 h-4" />
              {item.label}
            </button>
          ))}
        </nav>

        {/* User + Logout */}
        <div className="border-t border-[#1a1a1a] p-3">
          <div className="flex items-center gap-2.5 px-2 py-2">
            <div className="w-7 h-7 rounded-full bg-[#1f1f1f] border border-[#2a2a2a] flex items-center justify-center text-xs font-bold text-[#a1ebd4]">R</div>
            <div className="flex-1 min-w-0">
              <p className="text-[13px] font-medium text-white truncate">Riadh</p>
              <p className="text-[11px] text-[#555] truncate">Administrator</p>
            </div>
            <button onClick={handleLogout} title="Sign out" className="text-[#555] hover:text-[#999] transition-colors">
              <Icon icon="lucide:log-out" className="w-4 h-4" />
            </button>
          </div>
        </div>
      </aside>

      {/* ─────────────────────────────────────────
          MAIN CONTENT
      ───────────────────────────────────────── */}
      <main className="flex-1 flex flex-col overflow-hidden">

        {/* Top bar */}
        <header className="h-14 border-b border-[#1a1a1a] flex items-center justify-between px-6 shrink-0 bg-[#0a0a0a]">
          <div>
            <h1 className="text-[14px] font-semibold text-white">Dashboard</h1>
          </div>
          <div className="flex items-center gap-3">
            <div className="flex items-center gap-2 bg-[#111] border border-[#1f1f1f] rounded-lg px-3 py-1.5 w-52">
              <Icon icon="lucide:search" className="w-3.5 h-3.5 text-[#555]" />
              <input
                type="text"
                placeholder="Search..."
                value={searchQuery}
                onChange={e => setSearchQuery(e.target.value)}
                className="bg-transparent text-[13px] text-white placeholder-[#555] focus:outline-none w-full"
              />
            </div>
            <button
              onClick={fetchRequests}
              className="flex items-center gap-1.5 px-3 py-1.5 bg-[#111] border border-[#1f1f1f] rounded-lg text-[#888] hover:text-white hover:border-[#333] text-[13px] font-medium transition-all"
            >
              <Icon icon="lucide:refresh-cw" className="w-3.5 h-3.5" />
              Refresh
            </button>
          </div>
        </header>

        {/* Scrollable body */}
        <div className="flex-1 overflow-y-auto p-6 flex flex-col gap-6">

          {/* STAT CARDS */}
          <div className="grid grid-cols-3 gap-4">
            {[
              { label: 'Total Requests', value: stats.total, delta: null, icon: 'lucide:users' },
              { label: 'New This Week', value: stats.thisWeek, delta: null, icon: 'lucide:trending-up' },
              { label: 'Pending Review', value: stats.pending, delta: null, icon: 'lucide:clock' },
            ].map((s) => (
              <div key={s.label} className="bg-[#0f0f0f] border border-[#1a1a1a] rounded-xl p-5">
                <div className="flex items-start justify-between mb-4">
                  <p className="text-[12px] font-medium text-[#666]">{s.label}</p>
                  <div className="w-8 h-8 bg-[#161616] border border-[#222] rounded-lg flex items-center justify-center">
                    <Icon icon={s.icon} className="w-4 h-4 text-[#555]" />
                  </div>
                </div>
                <p className="text-3xl font-semibold text-white">{s.value}</p>
              </div>
            ))}
          </div>

          {/* MAIN TABLE + DETAIL PANEL */}
          <div className="flex gap-4 flex-1 min-h-0">

            {/* Table */}
            <div className="flex-1 bg-[#0f0f0f] border border-[#1a1a1a] rounded-xl overflow-hidden flex flex-col min-h-0">
              <div className="flex items-center justify-between px-5 py-3.5 border-b border-[#1a1a1a] shrink-0">
                <p className="text-[13px] font-semibold text-white">Project Requests</p>
                <p className="text-[12px] text-[#555]">{filtered.length} records</p>
              </div>

              {/* Table Head */}
              <div className="grid text-[11px] font-semibold uppercase tracking-wider text-[#555] px-5 py-2.5 border-b border-[#1a1a1a] shrink-0"
                style={{ gridTemplateColumns: '1.5fr 1.8fr 1fr 1fr 0.9fr 80px' }}>
                <span>Client</span>
                <span>Email</span>
                <span>Service</span>
                <span>Budget</span>
                <span>Timeline</span>
                <span className="text-right">Date</span>
              </div>

              {/* Table Body */}
              <div className="overflow-y-auto flex-1">
                {isLoading ? (
                  <div className="flex flex-col items-center justify-center h-full py-20 gap-3">
                    <Icon icon="lucide:loader-2" className="w-5 h-5 text-[#555] animate-spin" />
                    <p className="text-[13px] text-[#555]">Loading...</p>
                  </div>
                ) : filtered.length === 0 ? (
                  <div className="flex flex-col items-center justify-center h-full py-20 gap-3">
                    <Icon icon="lucide:inbox" className="w-8 h-8 text-[#2a2a2a]" />
                    <p className="text-[13px] text-[#555]">No requests yet</p>
                  </div>
                ) : (
                  filtered.map((req) => (
                    <button
                      key={req.id}
                      onClick={() => setSelectedRequest(s => s?.id === req.id ? null : req)}
                      className={`w-full grid text-left px-5 py-3.5 border-b border-[#141414] text-[13px] transition-colors
                        ${selectedRequest?.id === req.id ? 'bg-[#151515]' : 'hover:bg-[#111]'}`}
                      style={{ gridTemplateColumns: '1.5fr 1.8fr 1fr 1fr 0.9fr 80px' }}
                    >
                      <span className="font-medium text-white truncate pr-3">{req.full_name || '—'}</span>
                      <span className="text-[#888] truncate pr-3">{req.email || '—'}</span>
                      <span>
                        <span className="inline-flex items-center px-2 py-0.5 rounded-md bg-[#1a1a1a] border border-[#252525] text-[11px] font-medium text-[#999]">
                          {SERVICE_LABELS[req.service_type] || req.service_type || '—'}
                        </span>
                      </span>
                      <span className="text-[#a1ebd4] font-medium truncate pr-3">{req.budget?.replace(' DA', ' DA') || '—'}</span>
                      <span className="text-[#888] truncate">{req.timeline || '—'}</span>
                      <span className="text-[#555] text-right">{fmt(req.created_at)}</span>
                    </button>
                  ))
                )}
              </div>
            </div>

            {/* Detail Panel */}
            <div className="w-72 shrink-0">
              <AnimatePresence mode="wait">
                {selectedRequest ? (
                  <motion.div
                    key={selectedRequest.id}
                    initial={{ opacity: 0, y: 8 }}
                    animate={{ opacity: 1, y: 0 }}
                    exit={{ opacity: 0, y: 8 }}
                    transition={{ duration: 0.15 }}
                    className="bg-[#0f0f0f] border border-[#1a1a1a] rounded-xl overflow-hidden flex flex-col h-full"
                  >
                    {/* Panel Header */}
                    <div className="flex items-center justify-between px-5 py-3.5 border-b border-[#1a1a1a]">
                      <p className="text-[13px] font-semibold text-white">Request Detail</p>
                      <button onClick={() => setSelectedRequest(null)} className="text-[#555] hover:text-[#999] transition-colors">
                        <Icon icon="lucide:x" className="w-4 h-4" />
                      </button>
                    </div>

                    <div className="p-5 flex flex-col gap-5 overflow-y-auto flex-1">
                      {/* Client */}
                      <div className="flex items-center gap-3">
                        <div className="w-9 h-9 rounded-full bg-[#1a1a1a] border border-[#252525] flex items-center justify-center text-[13px] font-bold text-[#a1ebd4]">
                          {selectedRequest.full_name?.charAt(0).toUpperCase() || '?'}
                        </div>
                        <div>
                          <p className="text-[14px] font-semibold text-white">{selectedRequest.full_name}</p>
                          <p className="text-[12px] text-[#666]">Client</p>
                        </div>
                      </div>

                      {/* Contact */}
                      <div className="flex flex-col gap-2">
                        <p className="text-[11px] font-semibold text-[#444] uppercase tracking-widest">Contact</p>
                        <a href={`mailto:${selectedRequest.email}`} className="flex items-center gap-2 text-[13px] text-[#888] hover:text-white transition-colors">
                          <Icon icon="lucide:mail" className="w-3.5 h-3.5 text-[#555]" />
                          {selectedRequest.email}
                        </a>
                        {selectedRequest.whatsapp && (
                          <p className="flex items-center gap-2 text-[13px] text-[#888]">
                            <Icon icon="lucide:phone" className="w-3.5 h-3.5 text-[#555]" />
                            {selectedRequest.whatsapp}
                          </p>
                        )}
                      </div>

                      {/* Project Info */}
                      <div className="flex flex-col gap-2">
                        <p className="text-[11px] font-semibold text-[#444] uppercase tracking-widest">Project</p>
                        <div className="grid grid-cols-2 gap-2">
                          {[
                            { label: 'Service', value: SERVICE_LABELS[selectedRequest.service_type] || selectedRequest.service_type },
                            { label: 'Type', value: selectedRequest.project_type },
                            { label: 'Budget', value: selectedRequest.budget },
                            { label: 'Timeline', value: selectedRequest.timeline },
                            { label: 'Has Design', value: selectedRequest.has_design ? 'Yes' : 'No' },
                            { label: 'Submitted', value: fmt(selectedRequest.created_at) },
                          ].map(f => (
                            <div key={f.label} className="bg-[#111] border border-[#1a1a1a] rounded-lg p-3">
                              <p className="text-[10px] text-[#555] mb-1">{f.label}</p>
                              <p className="text-[12px] font-medium text-[#ccc] truncate">{f.value || '—'}</p>
                            </div>
                          ))}
                        </div>
                      </div>

                      {/* Description */}
                      {selectedRequest.project_description && (
                        <div className="flex flex-col gap-2">
                          <p className="text-[11px] font-semibold text-[#444] uppercase tracking-widest">Description</p>
                          <p className="text-[13px] text-[#888] leading-relaxed bg-[#111] border border-[#1a1a1a] rounded-lg p-3">
                            {selectedRequest.project_description}
                          </p>
                        </div>
                      )}

                      {/* Features */}
                      {selectedRequest.features?.length > 0 && (
                        <div className="flex flex-col gap-2">
                          <p className="text-[11px] font-semibold text-[#444] uppercase tracking-widest">Features</p>
                          <div className="flex flex-wrap gap-1.5">
                            {selectedRequest.features.map(f => (
                              <span key={f} className="inline-flex items-center px-2 py-1 rounded-md bg-[#1a1a1a] border border-[#252525] text-[11px] font-medium text-[#999]">
                                {f}
                              </span>
                            ))}
                          </div>
                        </div>
                      )}

                      {/* CTA */}
                      <a
                        href={`mailto:${selectedRequest.email}?subject=Re: Your Project Request — RiadhVision`}
                        className="flex items-center justify-center gap-2 w-full py-2.5 bg-[#a1ebd4] hover:bg-white text-black text-[13px] font-semibold rounded-lg transition-colors mt-auto"
                      >
                        <Icon icon="lucide:send" className="w-4 h-4" />
                        Reply to Client
                      </a>
                    </div>
                  </motion.div>
                ) : (
                  <div className="bg-[#0f0f0f] border border-[#1a1a1a] rounded-xl h-full flex flex-col items-center justify-center text-center gap-3 p-8 min-h-[300px]">
                    <div className="w-10 h-10 bg-[#141414] border border-[#1f1f1f] rounded-xl flex items-center justify-center">
                      <Icon icon="lucide:mouse-pointer-click" className="w-5 h-5 text-[#444]" />
                    </div>
                    <p className="text-[13px] text-[#555] max-w-[160px] leading-relaxed">Select a row to view full request details</p>
                  </div>
                )}
              </AnimatePresence>
            </div>

          </div>
        </div>
      </main>

    </div>
  );
};

export default Dashboard;
