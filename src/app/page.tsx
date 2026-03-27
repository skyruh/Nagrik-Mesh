'use client';

import React, { useState, useEffect, useMemo } from 'react';
import {
  AlertCircle,
  CheckCircle2,
  ChevronLeft,
  ChevronRight,
  Search,
  Sparkles,
  X,
  XCircle,
  Edit2,
  Check,
  LayoutDashboard,
  Inbox,
  Database,
  BarChart3,
  FileText,
  Users,
  Bell
} from 'lucide-react';
import { MOCK_COMPLAINTS } from '../lib/mock-data';
import { getProcessedComplaints } from '../lib/engine';
import { ExtendedComplaint, PriorityLevel, ComplaintStatus } from '../types/schema';
import { cn } from '../lib/utils';

export default function Dashboard() {
  const [complaints, setComplaints] = useState<ExtendedComplaint[]>([]);
  const [selectedId, setSelectedId] = useState<string | null>('CPG-2023-001');
  const [activeTab, setActiveTab] = useState('Dashboard');

  // Filtering states
  const [searchQuery, setSearchQuery] = useState('');
  const [statusFilter, setStatusFilter] = useState<string>('All');
  const [priorityFilter, setPriorityFilter] = useState<string>('All');
  const [deptFilter, setDeptFilter] = useState<string>('All');

  useEffect(() => {
    const processed = getProcessedComplaints(MOCK_COMPLAINTS as any);
    setComplaints(processed);
  }, []);

  // Derived filtered data
  const filteredComplaints = useMemo(() => {
    return complaints.filter(c => {
      const matchesSearch =
        c.id.toLowerCase().includes(searchQuery.toLowerCase()) ||
        c.citizenName.toLowerCase().includes(searchQuery.toLowerCase()) ||
        c.subject.toLowerCase().includes(searchQuery.toLowerCase());

      const matchesStatus = statusFilter === 'All' || c.status === statusFilter;
      const matchesPriority = priorityFilter === 'All' || c.priority === priorityFilter;
      const matchesDept = deptFilter === 'All' || c.department === deptFilter;

      // Tab specific logic
      const matchesTab = activeTab === 'My Queue' ? (c.status === 'Pending' || c.status === 'Processing') : true;

      return matchesSearch && matchesStatus && matchesPriority && matchesDept && matchesTab;
    });
  }, [complaints, searchQuery, statusFilter, priorityFilter, deptFilter, activeTab]);

  const selectedComplaint = complaints.find(c => c.id === selectedId);

  const stats = useMemo(() => {
    const total = 50;
    const processed = complaints.filter(c => c.status === 'Resolved').length;
    return {
      percentage: Math.round((processed / total) * 100),
      active: complaints.filter(c => c.status !== 'Resolved').length
    };
  }, [complaints]);

  const handleAction = (id: string, newStatus: ComplaintStatus) => {
    setComplaints(prev => prev.map(c =>
      c.id === id ? { ...c, status: newStatus, lastAction: `Marked as ${newStatus}` } : c
    ));
  };

  return (
    <div className="flex h-screen w-full bg-[#f3f4f6] overflow-hidden antialiased">
      {/* Sidebar matching high-fidelity design */}
      <aside className="w-64 bg-[#232f3e] flex flex-col p-0 z-20 shadow-2xl shrink-0">
        <div className="p-6">
          <div className="flex items-center gap-3 mb-10">
            <div className="h-10 w-10 rounded-xl bg-white/10 flex items-center justify-center border border-white/5 shadow-inner">
              <img
                src="https://upload.wikimedia.org/wikipedia/commons/5/55/Emblem_of_India.svg"
                alt="Gov of India"
                className="h-7 invert opacity-90"
              />
            </div>
            <div>
              <h1 className="text-white font-black text-sm leading-tight tracking-wider uppercase">Nagrik Mesh</h1>
              <p className="text-[10px] text-slate-400 font-bold uppercase tracking-widest opacity-60">Digital India</p>
            </div>
          </div>

          <nav className="space-y-1">
            <SidebarItem label="Dashboard" icon={<LayoutDashboard size={16} />} active={activeTab === 'Dashboard'} onClick={() => setActiveTab('Dashboard')} />
            <SidebarItem label="My Queue" icon={<Inbox size={16} />} active={activeTab === 'My Queue'} onClick={() => setActiveTab('My Queue')} />
            <SidebarItem label="All Grievances" icon={<Database size={16} />} active={activeTab === 'All Grievances'} onClick={() => setActiveTab('All Grievances')} />
            <div className="h-px bg-white/5 my-4" />
            <SidebarItem label="Analytics" icon={<BarChart3 size={16} />} active={activeTab === 'Analytics'} onClick={() => setActiveTab('Analytics')} />
            <SidebarItem label="Reports" icon={<FileText size={16} />} active={activeTab === 'Reports'} onClick={() => setActiveTab('Reports')} />
            <SidebarItem label="User Management" icon={<Users size={16} />} active={activeTab === 'User Management'} onClick={() => setActiveTab('User Management')} />
          </nav>
        </div>
        <div className="mt-auto p-6 space-y-1 border-t border-white/5 bg-black/10">
          <SidebarItem label="Settings" secondary />
          <SidebarItem label="Help Center" secondary />
        </div>
      </aside>

      <main className="flex-1 flex flex-col overflow-hidden bg-[#f8fafc]">
        {/* Top Header - Singular and Clean */}
        <header className="h-16 bg-white border-b border-slate-200 flex items-center justify-between px-10 shrink-0 z-10 transition-all duration-300">
          <div className="flex items-center gap-4">
            <div className="h-5 w-1 bg-accent rounded-full" />
            <h2 className="text-slate-800 font-extrabold text-lg tracking-tight">
              {activeTab} <span className="text-slate-400 font-medium text-sm ml-2">/ Control Center</span>
            </h2>
          </div>

          <div className="flex items-center gap-8">
            <button className="relative p-2 text-slate-400 hover:text-accent transition-colors">
              <Bell size={20} />
              <span className="absolute top-1.5 right-1.5 w-2 h-2 bg-rose-500 rounded-full border-2 border-white" />
            </button>
            <div className="flex items-center gap-4 text-[12px]">
              <div className="flex flex-col text-right">
                <span className="text-slate-900 font-black">A. Sharma</span>
                <span className="text-slate-400 font-bold text-[10px] uppercase">Joint Secretary</span>
              </div>
              <div className="h-10 w-10 rounded-2xl bg-gradient-to-br from-slate-100 to-slate-300 border border-slate-200 shadow-sm transition-transform hover:scale-105 cursor-pointer flex items-center justify-center font-black text-slate-500">
                AS
              </div>
            </div>
          </div>
        </header>

        {/* Filters Strip - Premium Spacing */}
        <div className="px-10 py-5 flex items-center justify-between bg-white border-b border-slate-100 shadow-sm z-10">
          <div className="flex items-center gap-6">
            <FilterSelector
              label="Status"
              value={statusFilter}
              options={['All', 'Pending', 'Processing', 'Escalated', 'Resolved']}
              onChange={setStatusFilter}
            />
            <FilterSelector
              label="Priority"
              value={priorityFilter}
              options={['All', 'Critical', 'High', 'Moderate', 'Low']}
              onChange={setPriorityFilter}
            />
            <FilterSelector
              label="Dept"
              value={deptFilter}
              options={['All', 'MoHFW', 'MoE', 'MoRD']}
              onChange={setDeptFilter}
            />
          </div>

          <div className="flex items-center gap-8">
            <div className="flex flex-col gap-2 w-40">
              <div className="flex items-center justify-between">
                <span className="text-[10px] font-black text-emerald-600 uppercase tracking-widest flex items-center gap-1.5 animate-pulse">
                  <Check size={10} /> Live Resolution
                </span>
                <span className="text-[10px] font-black text-slate-800">{stats.percentage}%</span>
              </div>
              <div className="h-1.5 w-full bg-slate-100 rounded-full overflow-hidden">
                <div className="h-full bg-emerald-500 transition-all duration-1000 ease-out" style={{ width: `${stats.percentage}%` }} />
              </div>
            </div>
            <div className="relative">
              <Search className="absolute left-4 top-1/2 -translate-y-1/2 text-slate-400" size={16} />
              <input
                type="text"
                placeholder="Search IDs, citizens or keyword..."
                value={searchQuery}
                onChange={(e) => setSearchQuery(e.target.value)}
                className="bg-slate-50 border border-slate-200 rounded-2xl pl-12 pr-6 py-2.5 text-xs w-64 focus:ring-4 focus:ring-accent/5 focus:border-accent outline-none font-bold text-slate-800 transition-all placeholder:text-slate-300 shadow-inner"
              />
            </div>
          </div>
        </div>

        <div className="flex-1 flex overflow-hidden">
          {/* Table Area - Clean White Styling */}
          <div className="flex-1 overflow-y-auto p-10 bg-slate-50/50">
            <div className="bg-white rounded-[2rem] shadow-xl border border-slate-200/60 overflow-hidden ring-1 ring-black/5">
              <table className="w-full text-left border-collapse text-[12px]">
                <thead>
                  <tr className="bg-slate-50/80 border-b border-slate-100 shadow-sm">
                    <th className="px-8 py-5 font-black text-slate-400 uppercase tracking-widest">Grievance ID</th>
                    <th className="px-5 py-5 font-black text-slate-400 uppercase tracking-widest">Date</th>
                    <th className="px-5 py-5 font-black text-slate-400 uppercase tracking-widest">Citizen</th>
                    <th className="px-5 py-5 font-black text-slate-400 uppercase tracking-widest">Ministry</th>
                    <th className="px-5 py-5 font-black text-slate-400 uppercase tracking-widest w-[20%] text-center">Priority</th>
                    <th className="px-8 py-5 font-black text-slate-400 uppercase tracking-widest text-right whitespace-nowrap">Current Status</th>
                  </tr>
                </thead>
                <tbody className="divide-y divide-slate-50 font-bold">
                  {filteredComplaints.length > 0 ? (
                    filteredComplaints.map((c) => (
                      <tr
                        key={c.id}
                        onClick={() => setSelectedId(c.id)}
                        className={cn(
                          "group cursor-pointer transition-all duration-300 hover:bg-slate-50 relative",
                          selectedId === c.id ? "bg-accent/5 z-10" : "bg-white"
                        )}
                      >
                        <td className="px-8 py-6 font-black text-accent flex items-center gap-3">
                          {selectedId === c.id && <div className="w-1.5 h-1.5 rounded-full bg-accent animate-ping absolute left-3" />}
                          {c.id}
                        </td>
                        <td className="px-5 py-6 text-slate-400 font-medium">{c.dateFiled}</td>
                        <td className="px-5 py-6 text-slate-800">{c.citizenName}</td>
                        <td className="px-5 py-6 text-slate-500">{c.department}</td>
                        <td className="px-5 py-6">
                          <div className="flex justify-center">
                            <span className={cn(
                              "px-3 py-1.5 rounded-xl text-[10px] font-black text-white flex items-center gap-2 shadow-sm uppercase tracking-widest",
                              c.priority === 'Critical' ? "bg-rose-500 animate-pulse-slow ring-4 ring-rose-500/10" :
                                c.priority === 'High' ? "bg-amber-500 shadow-amber-200" :
                                  c.priority === 'Moderate' ? "bg-yellow-400" : "bg-slate-300"
                            )}>
                              <span className="w-1 h-1 rounded-full bg-white/40" />
                              {c.priority}
                            </span>
                          </div>
                        </td>
                        <td className="px-8 py-6 text-right">
                          <span className={cn(
                            "px-4 py-1 rounded-full border-[1.5px] text-[10px] font-black uppercase inline-block min-w-[100px] text-center transition-colors",
                            c.status === 'Resolved' ? "bg-emerald-50 text-emerald-600 border-emerald-200" :
                              c.status === 'Escalated' ? "bg-rose-50 text-rose-600 border-rose-200 shadow-sm shadow-rose-100" :
                                c.status === 'Processing' ? "bg-blue-50 text-blue-600 border-blue-200" : "bg-slate-100 text-slate-600 border-slate-200"
                          )}>
                            {c.status}
                          </span>
                        </td>
                      </tr>
                    ))
                  ) : (
                    <tr>
                      <td colSpan={6} className="p-32 text-center">
                        <div className="flex flex-col items-center gap-4 opacity-30">
                          <Search size={48} className="text-slate-300" />
                          <p className="text-lg font-black text-slate-400 uppercase tracking-widest">No Matches Identified</p>
                        </div>
                      </td>
                    </tr>
                  )}
                </tbody>
              </table>

              {/* Pagination - Pure Design Placeholder */}
              <div className="bg-slate-50/50 border-t border-slate-100 px-8 py-4 flex items-center justify-between text-[11px] font-black uppercase text-slate-400 tracking-tighter">
                <div>Displaying {filteredComplaints.length} Records</div>
                <div className="flex items-center gap-4">
                  <button className="h-8 w-8 rounded-lg bg-white border border-slate-200 flex items-center justify-center opacity-50"><ChevronLeft size={14} /></button>
                  <span className="text-slate-800 px-2">Page 1</span>
                  <button className="h-8 w-8 rounded-lg bg-white border border-slate-200 flex items-center justify-center"><ChevronRight size={14} /></button>
                </div>
              </div>
            </div>
          </div>

          {/* Analysis Sidebar - High Contrast */}
          <div className="w-[480px] bg-white border-l border-slate-200 overflow-y-auto p-10 flex flex-col gap-10 z-20 shadow-[0_-30px_60px_-15px_rgba(0,0,0,0.1)] relative">
            {selectedComplaint ? (
              <>
                <div className="flex items-center justify-between">
                  <div className="flex flex-col">
                    <h3 className="font-black text-2xl text-slate-900 tracking-tighter leading-none">Analysis</h3>
                    <span className="text-[10px] font-bold text-slate-400 uppercase tracking-[0.3em] mt-1">Intelligence Module</span>
                  </div>
                  <button onClick={() => setSelectedId(null)} className="h-10 w-10 rounded-2xl hover:bg-slate-100 flex items-center justify-center transition-colors group">
                    <X size={24} className="text-slate-300 group-hover:text-slate-900" />
                  </button>
                </div>

                <div className="analysis-mesh p-8 rounded-[2.5rem] relative shadow-2xl overflow-hidden border border-white/20 group">
                  <div className="relative z-10 text-white space-y-8">
                    <div>
                      <span className="text-[10px] font-black uppercase tracking-[0.2em] opacity-60 mb-6 block ring-1 ring-white/20 w-fit px-3 py-1 rounded-full">Primary Target</span>
                      <h4 className="font-black text-3xl tracking-tighter mb-2 italic">"{selectedComplaint.subject}"</h4>
                      <span className="font-mono text-xs opacity-80 uppercase tracking-widest">ID: {selectedComplaint.id}</span>
                    </div>

                    <div className="p-6 rounded-3xl bg-black/10 backdrop-blur-sm border border-white/10">
                      <p className="font-black text-[11px] mb-3 uppercase tracking-tighter opacity-50 underline">Raw Statement</p>
                      <p className="text-base leading-relaxed font-bold italic tracking-tight">
                        "{selectedComplaint.description}"
                      </p>
                    </div>
                  </div>
                </div>

                <div className="space-y-8 animate-in">
                  <div className="space-y-4">
                    <div className="flex items-center justify-between px-2">
                      <div className="flex items-center gap-2">
                        <div className="p-2 rounded-xl bg-indigo-600 text-white shadow-lg shadow-indigo-100"><Sparkles size={18} /></div>
                        <h4 className="text-sm font-black uppercase tracking-widest text-slate-800">AI Context Engine</h4>
                      </div>
                      <span className="text-[11px] font-black text-indigo-600 bg-indigo-50 px-3 py-1 rounded-full border border-indigo-100 tracking-tighter italic">94% Confidence</span>
                    </div>

                    <div className="grid grid-cols-2 gap-4">
                      <AnalysisCard
                        label="Sentiment Mapping"
                        value={selectedComplaint.aiAnalysis.sentiment}
                        urgent={selectedComplaint.aiAnalysis.sentiment === 'Urgent'}
                      />
                      <AnalysisCard label="Scope" value="Municipal / District" />
                    </div>

                    <div className="p-8 rounded-[2rem] bg-slate-50 border border-slate-200/50 shadow-inner">
                      <p className="text-[11px] font-black text-slate-400 uppercase mb-4 tracking-widest flex items-center gap-2">
                        <div className="w-1.5 h-1.5 rounded-full bg-accent" /> Pattern Match Insight
                      </p>
                      <p className="text-sm text-slate-800 font-bold leading-relaxed">
                        {selectedComplaint.aiAnalysis.rootCause}. Automated detection suggests prioritizing this for ward field inspection.
                      </p>
                    </div>

                    {selectedComplaint.suspicionFlags.length > 0 && (
                      <div className="pt-2">
                        <p className="text-[11px] font-black text-rose-500 uppercase mb-4 tracking-widest flex items-center gap-2.5 ml-2">
                          <AlertCircle size={14} /> Risk Vectors Identified
                        </p>
                        <div className="space-y-3">
                          {selectedComplaint.suspicionFlags.map((f, i) => (
                            <div key={i} className="p-5 rounded-[1.5rem] bg-rose-50 border border-rose-100/50 flex gap-4 items-start shadow-sm transition-transform hover:translate-x-1">
                              <div className="h-6 w-6 rounded-full bg-rose-500 flex items-center justify-center shrink-0 mt-1 shadow-rose-200 shadow-lg">
                                <AlertCircle size={12} className="text-white" />
                              </div>
                              <div>
                                <p className="text-xs font-black text-rose-900 uppercase tracking-tighter">{f.type}</p>
                                <p className="text-[12px] font-bold text-rose-700/80 mt-1 leading-snug">{f.reason}</p>
                              </div>
                            </div>
                          ))}
                        </div>
                      </div>
                    )}
                  </div>

                  <div className="space-y-5 pt-4">
                    <div className="flex items-center justify-between px-2">
                      <h4 className="text-sm font-black uppercase tracking-widest text-slate-800">Officer Action</h4>
                      <div className="h-px flex-1 mx-6 bg-slate-100" />
                    </div>
                    <div className="flex gap-4">
                      <ActionBtn
                        icon={<CheckCircle2 size={24} />}
                        label="Accept"
                        active={selectedComplaint.status === 'Resolved'}
                        color="text-emerald-500 hover:bg-emerald-50 border-emerald-200 active:bg-emerald-500 active:text-white"
                        onClick={() => handleAction(selectedComplaint.id, 'Resolved')}
                      />
                      <ActionBtn
                        icon={<Edit2 size={24} />}
                        label="Modify"
                        active={selectedComplaint.status === 'Processing'}
                        color="text-amber-500 hover:bg-amber-50 border-amber-200 active:bg-amber-500 active:text-white"
                        onClick={() => handleAction(selectedComplaint.id, 'Processing')}
                      />
                      <ActionBtn
                        icon={<XCircle size={24} />}
                        label="Escalate"
                        active={selectedComplaint.status === 'Escalated'}
                        color="text-rose-500 hover:bg-rose-50 border-rose-200 active:bg-rose-500 active:text-white"
                        onClick={() => handleAction(selectedComplaint.id, 'Escalated')}
                      />
                    </div>

                    <div className="space-y-6 pt-2">
                      <div className="space-y-2.5">
                        <label className="text-[11px] font-black text-slate-400 uppercase tracking-[0.2em] ml-2">Channel Assignment</label>
                        <div className="relative group">
                          <Database className="absolute left-4 top-1/2 -translate-y-1/2 text-slate-300 group-hover:text-accent transition-colors" size={16} />
                          <select className="w-full text-xs font-black p-4 pl-12 rounded-[1.25rem] border border-slate-200 bg-slate-50 outline-none focus:ring-4 focus:ring-accent/10 focus:border-accent shadow-sm transition-all h-14 appearance-none cursor-pointer">
                            <option>{selectedComplaint.department} Primary Field Office</option>
                            <option>Cabinet Oversight Committee</option>
                            <option>Regional Technical Commissioner</option>
                            <option>Public Works Emergency Squad</option>
                          </select>
                          <ChevronRight className="absolute right-4 top-1/2 -translate-y-1/2 text-slate-300 rotate-90 pointer-events-none" size={16} />
                        </div>
                      </div>
                      <div className="space-y-2.5">
                        <label className="text-[11px] font-black text-slate-400 uppercase tracking-[0.2em] ml-2">Audit Memo</label>
                        <textarea
                          placeholder="Specify justification for this action..."
                          className="w-full text-sm font-bold p-6 rounded-[1.5rem] border border-slate-200 bg-slate-50 outline-none focus:ring-4 focus:ring-accent/10 focus:border-accent min-h-[140px] resize-none shadow-inner transition-all placeholder:text-slate-200"
                        />
                      </div>
                      <button className="w-full bg-slate-900 text-white font-black uppercase text-xs tracking-widest py-5 rounded-[1.5rem] shadow-xl hover:bg-black transition-all active:scale-95 flex items-center justify-center gap-3">
                        Seal & Push to CPGRAMS <Check size={16} />
                      </button>
                    </div>
                  </div>
                </div>
              </>
            ) : (
              <div className="flex-1 flex flex-col items-center justify-center text-center p-12 opacity-30 grayscale animate-pulse">
                <div className="h-32 w-32 rounded-full border-4 border-dashed border-slate-200 flex items-center justify-center mb-8">
                  <Inbox size={64} className="text-slate-200" />
                </div>
                <h3 className="font-black text-slate-400 uppercase tracking-[0.4em] text-sm mb-4">Awaiting Signal</h3>
                <p className="text-slate-400 text-xs font-bold leading-relaxed max-w-[200px]">Identify a grievance from the primary feed <br />to initiate AI core processing.</p>
              </div>
            )}
          </div>
        </div>
      </main>
    </div>
  );
}

function SidebarItem({ label, icon, active, onClick, secondary }: { label: string, icon?: React.ReactNode, active?: boolean, onClick?: () => void, secondary?: boolean }) {
  return (
    <div
      onClick={onClick}
      className={cn(
        "px-5 py-4 rounded-2xl text-[11px] font-black uppercase tracking-widest cursor-pointer transition-all flex items-center gap-4 border border-transparent",
        active
          ? "bg-accent/10 text-white shadow-[inset_0_0_12px_rgba(59,130,246,0.3)] border-accent/20"
          : "text-slate-500 hover:text-white hover:bg-white/5 active:scale-95",
        secondary && "py-3 text-slate-600 opacity-60"
      )}
    >
      <span className={cn("transition-colors", active ? "text-accent" : "text-slate-600")}>{icon}</span>
      {label}
    </div>
  )
}

function FilterSelector({ label, value, options, onChange }: { label: string, value: string, options: string[], onChange: (v: string) => void }) {
  const [isOpen, setIsOpen] = useState(false);

  return (
    <div className="relative">
      <div
        onClick={() => setIsOpen(!isOpen)}
        className={cn(
          "flex items-center gap-3 px-5 py-2.5 border-[1.5px] rounded-2xl shadow-sm cursor-pointer transition-all hover:bg-slate-50 select-none",
          value !== 'All' ? "border-accent/40 bg-accent/5 ring-4 ring-accent/5" : "bg-white border-slate-100"
        )}
      >
        <span className="text-[10px] font-black text-slate-300 uppercase tracking-widest">{label}</span>
        <span className="text-[10px] font-black text-slate-800 flex items-center gap-2 uppercase tracking-tighter">
          {value}
          <ChevronRight size={12} className={cn("text-slate-400 transition-transform duration-300", isOpen ? "rotate-90" : "")} />
        </span>
      </div>

      {isOpen && (
        <>
          <div className="fixed inset-0 z-30" onClick={() => setIsOpen(false)} />
          <div className="absolute top-full left-0 mt-3 w-48 bg-white border border-slate-200 rounded-[2rem] shadow-2xl py-3 z-40 animate-in overflow-hidden ring-1 ring-black/5">
            {options.map(opt => (
              <div
                key={opt}
                onClick={() => {
                  onChange(opt);
                  setIsOpen(false);
                }}
                className={cn(
                  "px-6 py-3 text-[10px] font-black cursor-pointer hover:bg-slate-50 transition-colors uppercase tracking-[0.2em]",
                  value === opt ? "bg-accent/10 text-accent font-black" : "text-slate-500"
                )}
              >
                {opt}
              </div>
            ))}
          </div>
        </>
      )}
    </div>
  )
}

function AnalysisCard({ label, value, urgent }: { label: string, value: string, urgent?: boolean }) {
  return (
    <div className="p-5 rounded-3xl bg-white border border-slate-100 shadow-sm flex flex-col gap-1 transition-all hover:shadow-md hover:border-slate-200">
      <p className="text-[9px] font-black text-slate-300 uppercase tracking-widest">{label}</p>
      <p className={cn(
        "text-xs font-black uppercase tracking-tight",
        urgent ? "text-rose-600" : "text-slate-800"
      )}>{value}</p>
    </div>
  )
}

function ActionBtn({ icon, label, color, onClick, active }: { icon: React.ReactNode, label: string, color: string, onClick?: () => void, active?: boolean }) {
  return (
    <button
      onClick={onClick}
      className={cn(
        "flex-1 flex flex-col items-center justify-center gap-3 py-6 rounded-[2.5rem] border-2 font-black text-[11px] uppercase tracking-[0.2em] transition-all active:scale-90 shadow-md",
        active ? "ring-4 ring-offset-2 ring-accent border-accent" : "hover:shadow-xl hover:-translate-y-1 border-slate-100",
        color
      )}
    >
      {icon}
      {label}
    </button>
  )
}
