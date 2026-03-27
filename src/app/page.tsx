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
  Users
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

  // Stats for the status bars
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
    // Provide some visual feedback? Maybe auto-select next?
  };

  return (
    <div className="flex h-screen w-full bg-[#f3f4f6] overflow-hidden">
      {/* Sidebar - Interactive */}
      <aside className="w-64 bg-[#232f3e] flex flex-col p-0 z-10 shadow-xl shrink-0">
        <div className="p-6">
          <div className="flex items-center gap-3 mb-8">
            <div className="h-9 w-9 rounded-lg bg-white/10 flex items-center justify-center">
              <img
                src="https://upload.wikimedia.org/wikipedia/commons/5/55/Emblem_of_India.svg"
                alt="Gov of India"
                className="h-6 invert opacity-80"
              />
            </div>
            <div>
              <h1 className="text-white font-bold text-sm leading-tight tracking-wide">Nagrik Mesh</h1>
              <p className="text-[10px] text-slate-400 font-medium uppercase tracking-tighter">AI Execution Layer</p>
            </div>
          </div>

          <nav className="space-y-1">
            <SidebarItem label="Dashboard" icon={<LayoutDashboard size={14} />} active={activeTab === 'Dashboard'} onClick={() => setActiveTab('Dashboard')} />
            <SidebarItem label="My Queue" icon={<Inbox size={14} />} active={activeTab === 'My Queue'} onClick={() => setActiveTab('My Queue')} />
            <SidebarItem label="All Grievances" icon={<Database size={14} />} active={activeTab === 'All Grievances'} onClick={() => setActiveTab('All Grievances')} />
            <SidebarItem label="Analytics" icon={<BarChart3 size={14} />} active={activeTab === 'Analytics'} onClick={() => setActiveTab('Analytics')} />
            <SidebarItem label="Reports" icon={<FileText size={14} />} active={activeTab === 'Reports'} onClick={() => setActiveTab('Reports')} />
            <SidebarItem label="User Management" icon={<Users size={14} />} active={activeTab === 'User Management'} onClick={() => setActiveTab('User Management')} />
          </nav>
        </div>
        <div className="mt-auto p-6 space-y-1 border-t border-white/5 bg-slate-900/20">
          <div className="text-[10px] text-slate-500 font-bold uppercase mb-2">System</div>
          <SidebarItem label="Settings" />
          <SidebarItem label="Help Center" />
        </div>
      </aside>

      <main className="flex-1 flex flex-col overflow-hidden">
        {/* Top Header */}
        <header className="h-14 bg-white border-b border-slate-200 flex items-center justify-between px-8 shrink-0">
          <h2 className="text-slate-800 font-bold text-base flex items-center gap-2">
            <span className="w-1.5 h-1.5 rounded-full bg-accent animate-pulse" />
            {activeTab} Overview
          </h2>
          <div className="flex items-center gap-4 text-[11px] font-bold">
            <div className="flex flex-col text-right">
              <span className="text-slate-800">A. Sharma</span>
              <span className="text-slate-400 text-[9px]">Joint Secretary</span>
            </div>
            <div className="h-8 w-8 rounded-full bg-slate-200 border border-slate-300" />
          </div>
        </header>

        {/* Filters Strip */}
        <div className="px-8 py-3.5 flex items-center justify-between border-b border-slate-200 bg-white/80 backdrop-blur-sm z-10 shadow-sm">
          <div className="flex items-center gap-5">
            <h3 className="font-black text-xs text-slate-800 uppercase tracking-widest mr-2">Grievance Feed</h3>
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

          <div className="flex items-center gap-6">
            <div className="flex flex-col gap-1 w-28">
              <div className="flex items-center justify-between">
                <span className="text-[9px] font-black text-slate-400 uppercase tracking-tighter flex items-center gap-1"><Check size={8} /> Resolution Rate</span>
                <span className="text-[9px] font-black text-accent">{stats.percentage}%</span>
              </div>
              <div className="status-bar"><div className="status-bar-fill transition-all duration-500" style={{ width: `${stats.percentage}%` }} /></div>
            </div>
            <div className="relative">
              <Search className="absolute left-3 top-1/2 -translate-y-1/2 text-slate-400" size={14} />
              <input
                type="text"
                placeholder="Search ID, Citizen, Subject..."
                value={searchQuery}
                onChange={(e) => setSearchQuery(e.target.value)}
                className="bg-slate-50 border border-slate-200 rounded-lg pl-9 pr-4 py-1.5 text-xs w-56 focus:ring-2 focus:ring-accent/20 focus:border-accent outline-none font-medium transition-all"
              />
            </div>
          </div>
        </div>

        <div className="flex-1 flex overflow-hidden">
          {/* Table Area */}
          <div className="flex-1 overflow-y-auto p-6 scroll">
            <div className="bg-white rounded-xl shadow-lg border border-slate-200 overflow-hidden">
              <table className="w-full text-left border-collapse text-[11px]">
                <thead className="sticky top-0 bg-slate-50 z-10 border-b border-slate-200 shadow-sm">
                  <tr>
                    <th className="px-5 py-4 font-black text-slate-400 uppercase tracking-widest">ID</th>
                    <th className="px-5 py-4 font-black text-slate-400 uppercase tracking-widest text-nowrap">Submitted</th>
                    <th className="px-5 py-4 font-black text-slate-400 uppercase tracking-widest">Citizen</th>
                    <th className="px-5 py-4 font-black text-slate-400 uppercase tracking-widest">Dept</th>
                    <th className="px-5 py-4 font-black text-slate-400 uppercase tracking-widest">Subject</th>
                    <th className="px-5 py-4 font-black text-slate-400 uppercase tracking-widest text-center">Priority</th>
                    <th className="px-5 py-4 font-black text-slate-400 uppercase tracking-widest text-center">Status</th>
                  </tr>
                </thead>
                <tbody className="divide-y divide-slate-100">
                  {filteredComplaints.length > 0 ? (
                    filteredComplaints.map((c) => (
                      <tr
                        key={c.id}
                        onClick={() => setSelectedId(c.id)}
                        className={cn(
                          "cursor-pointer transition-all duration-150 hover:brightness-95",
                          selectedId === c.id ? "ring-2 ring-accent ring-inset shadow-md z-10 relative" : "",
                          c.priority === 'Critical' ? "table-row-critical" :
                            c.priority === 'High' ? "table-row-high" :
                              c.priority === 'Moderate' ? "table-row-moderate" : "bg-white"
                        )}
                      >
                        <td className="px-5 py-4 font-black text-accent">{c.id}</td>
                        <td className="px-5 py-4 text-slate-500 font-medium">{c.dateFiled}</td>
                        <td className="px-5 py-4 text-slate-800 font-bold">{c.citizenName}</td>
                        <td className="px-5 py-4 text-slate-600 font-medium">{c.department}</td>
                        <td className="px-5 py-4 text-slate-700 font-bold max-w-[200px] truncate">{c.subject}</td>
                        <td className="px-5 py-4 flex justify-center">
                          <span className={cn(
                            "px-2 py-1 rounded-md text-[9px] font-black text-white flex items-center gap-1.5 shadow-sm uppercase tracking-tighter",
                            c.priority === 'Critical' ? "bg-rose-600 animate-pulse-slow" :
                              c.priority === 'High' ? "bg-amber-600" :
                                c.priority === 'Moderate' ? "bg-yellow-500" : "bg-slate-400"
                          )}>
                            {c.priority}
                          </span>
                        </td>
                        <td className="px-5 py-4 text-center">
                          <span className={cn(
                            "px-2 py-0.5 rounded-full border text-[9px] font-black uppercase text-nowrap",
                            c.status === 'Resolved' ? "bg-emerald-50 text-emerald-600 border-emerald-200" :
                              c.status === 'Escalated' ? "bg-rose-50 text-rose-600 border-rose-200" :
                                c.status === 'Processing' ? "bg-blue-50 text-blue-600 border-blue-200" : "bg-slate-50 text-slate-600 border-slate-200"
                          )}>
                            {c.status}
                          </span>
                        </td>
                      </tr>
                    ))
                  ) : (
                    <tr>
                      <td colSpan={7} className="p-20 text-center text-slate-400 font-bold italic h-96">
                        No matches found for current filters.
                      </td>
                    </tr>
                  )}
                </tbody>
              </table>
            </div>
          </div>

          {/* Analysis Sidebar */}
          <div className="w-[420px] bg-white border-l border-slate-200 overflow-y-auto p-6 flex flex-col gap-6 scroll shadow-2xl z-10">
            {selectedComplaint ? (
              <>
                <div className="flex items-center justify-between">
                  <h3 className="font-extrabold text-lg text-slate-800 tracking-tight">Grievance Analysis</h3>
                  <button onClick={() => setSelectedId(null)} className="p-1.5 rounded-full hover:bg-slate-100 transition-colors">
                    <X size={18} className="text-slate-400" />
                  </button>
                </div>

                <div className="analysis-mesh p-7 rounded-3xl relative shadow-xl overflow-hidden border border-white/30 group">
                  <div className="relative z-10 text-white">
                    <span className="text-[10px] font-black uppercase tracking-[0.2em] opacity-80 mb-6 block">Target Intelligence</span>

                    <div className="space-y-4">
                      <div className="grid grid-cols-[100px_1fr] items-baseline">
                        <span className="text-[11px] font-bold opacity-60 uppercase">Identifier</span>
                        <span className="font-mono font-black text-base">{selectedComplaint.id}</span>
                      </div>
                      <div className="grid grid-cols-[100px_1fr] items-baseline">
                        <span className="text-[11px] font-bold opacity-60 uppercase">Topic</span>
                        <span className="font-black text-lg leading-tight">{selectedComplaint.subject}</span>
                      </div>
                    </div>

                    <div className="mt-8 pt-6 border-t border-white/20">
                      <p className="font-black opacity-60 text-[10px] mb-3 uppercase tracking-wider">Raw Input Analysis</p>
                      <p className="text-sm leading-relaxed font-bold">
                        "{selectedComplaint.description}"
                      </p>
                    </div>
                  </div>
                </div>

                <div className="space-y-5 animate-in">
                  <div className="p-6 rounded-3xl bg-slate-50 border border-slate-200/60 shadow-sm relative overflow-hidden">
                    <div className="flex items-center justify-between mb-5">
                      <div className="flex items-center gap-2">
                        <div className="p-1.5 rounded-lg bg-indigo-100 text-indigo-600"><Sparkles size={16} /></div>
                        <h4 className="text-xs font-black uppercase tracking-widest text-slate-800">AI Intelligence</h4>
                      </div>
                      <div className="px-2 py-0.5 rounded bg-indigo-600 text-[9px] font-bold text-white uppercase tracking-tighter">Confidence 94%</div>
                    </div>

                    <div className="space-y-5">
                      <div>
                        <p className="text-[10px] font-black text-slate-400 uppercase mb-2 tracking-wider">Key Insights</p>
                        <ul className="text-xs text-slate-700 font-bold space-y-2 list-none">
                          <li className="flex gap-2"><span className="text-accent">●</span> {selectedComplaint.aiAnalysis.rootCause}</li>
                          <li className="flex gap-2"><span className="text-accent">●</span> Potential resource misallocation detected in Ward.</li>
                        </ul>
                      </div>

                      <div className="grid grid-cols-2 gap-4 pt-2">
                        <div className="p-3 rounded-2xl bg-white border border-slate-200">
                          <p className="text-[9px] font-black text-slate-400 uppercase mb-1">Sentiment</p>
                          <p className={cn(
                            "text-xs font-black uppercase",
                            selectedComplaint.aiAnalysis.sentiment === 'Urgent' ? "text-rose-600" : "text-slate-800"
                          )}>{selectedComplaint.aiAnalysis.sentiment}</p>
                        </div>
                        <div className="p-3 rounded-2xl bg-white border border-slate-200">
                          <p className="text-[9px] font-black text-slate-400 uppercase mb-1">Impact Level</p>
                          <p className="text-xs font-black text-slate-800 italic uppercase">Community</p>
                        </div>
                      </div>

                      {selectedComplaint.suspicionFlags.length > 0 && (
                        <div className="pt-4 border-t border-slate-200">
                          <p className="text-[10px] font-black text-rose-500 uppercase mb-3 flex items-center gap-2">
                            <AlertCircle size={10} /> Suspicion Matrix
                          </p>
                          <div className="space-y-2">
                            {selectedComplaint.suspicionFlags.map((f, i) => (
                              <div key={i} className="p-3 rounded-2xl bg-rose-50/50 border border-rose-100 flex gap-3 items-center">
                                <div className="w-1.5 h-1.5 rounded-full bg-rose-500 shrink-0" />
                                <div>
                                  <p className="text-[10px] font-black text-slate-800 uppercase tracking-tighter">{f.type}</p>
                                  <p className="text-[10px] font-medium text-slate-600 leading-tight">{f.reason}</p>
                                </div>
                              </div>
                            ))}
                          </div>
                        </div>
                      )}
                    </div>
                  </div>

                  <div className="space-y-4">
                    <h4 className="text-xs font-extrabold tracking-[0.1em] text-slate-400 uppercase ml-1">Decision Interface</h4>
                    <div className="grid grid-cols-3 gap-3">
                      <DecisionBtn
                        icon={<CheckCircle2 size={18} />}
                        label="Accept"
                        isActive={selectedComplaint.status === 'Resolved'}
                        color="text-emerald-600 bg-emerald-50 border-emerald-200 active:bg-emerald-600 active:text-white"
                        onClick={() => handleAction(selectedComplaint.id, 'Resolved')}
                      />
                      <DecisionBtn
                        icon={<Edit2 size={18} />}
                        label="Modify"
                        isActive={selectedComplaint.status === 'Processing'}
                        color="text-amber-600 bg-amber-50 border-amber-200 active:bg-amber-600 active:text-white"
                        onClick={() => handleAction(selectedComplaint.id, 'Processing')}
                      />
                      <DecisionBtn
                        icon={<XCircle size={18} />}
                        label="Reject"
                        isActive={selectedComplaint.status === 'Escalated'}
                        color="text-rose-600 bg-rose-50 border-rose-200 active:bg-rose-600 active:text-white"
                        onClick={() => handleAction(selectedComplaint.id, 'Escalated')}
                      />
                    </div>

                    <div className="space-y-4 pt-2">
                      <div className="space-y-2">
                        <p className="text-[11px] font-black text-slate-500 uppercase tracking-wide flex items-center gap-1.5 ml-1">
                          Forward Logic
                        </p>
                        <select className="w-full text-xs font-bold p-3 rounded-2xl border border-slate-200 bg-slate-50 outline-none focus:ring-2 focus:ring-accent/20 shadow-sm transition-all h-12 appearance-none">
                          <option>{selectedComplaint.department} Primary</option>
                          <option>Strategic Oversight Committee</option>
                          <option>Regional Commissioner</option>
                          <option>Field Technical Team</option>
                        </select>
                      </div>
                      <div className="space-y-2">
                        <p className="text-[11px] font-black text-slate-500 uppercase tracking-wide flex items-center gap-1.5 ml-1">
                          Official Notes
                        </p>
                        <textarea
                          placeholder="Document justification for action..."
                          className="w-full text-xs font-bold p-4 rounded-2xl border border-slate-200 bg-slate-50 outline-none focus:ring-2 focus:ring-accent/20 min-h-[100px] resize-none shadow-sm transition-all"
                        />
                      </div>
                    </div>
                  </div>
                </div>
              </>
            ) : (
              <div className="flex-1 flex flex-col items-center justify-center text-center p-12 opacity-40 grayscale animate-pulse">
                <Inbox size={64} className="text-slate-300 mb-6" />
                <h3 className="font-black text-slate-400 uppercase tracking-widest text-sm mb-2">Queue Selection Pending</h3>
                <p className="text-slate-400 text-[11px] font-bold leading-relaxed">System awaiting grievance identification <br />Select a record from the primary feed.</p>
              </div>
            )}
          </div>
        </div>
      </main>
    </div>
  );
}

function SidebarItem({ label, icon, active, onClick }: { label: string, icon?: React.ReactNode, active?: boolean, onClick?: () => void }) {
  return (
    <div
      onClick={onClick}
      className={cn(
        "px-4 py-3 rounded-xl text-[11px] font-bold cursor-pointer transition-all flex items-center gap-3 border border-transparent",
        active
          ? "bg-[#34445c] text-white shadow-lg border-white/5"
          : "text-slate-400 hover:text-white hover:bg-white/5 active:scale-95"
      )}
    >
      {icon}
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
          "flex items-center gap-2 px-3 py-1.5 border border-slate-200 rounded-xl shadow-sm cursor-pointer transition-all hover:bg-slate-50 select-none",
          value !== 'All' ? "border-accent/40 bg-accent/5 ring-1 ring-accent/10" : "bg-white"
        )}
      >
        <span className="text-[10px] font-bold text-slate-400">{label}</span>
        <span className="text-[10px] font-black text-slate-800 flex items-center gap-1">
          {value}
          <ChevronRight size={10} className={cn("text-slate-400 transition-transform duration-300", isOpen ? "rotate-90" : "")} />
        </span>
      </div>

      {isOpen && (
        <>
          <div className="fixed inset-0 z-10" onClick={() => setIsOpen(false)} />
          <div className="absolute top- كامل mt-2 w-40 bg-white border border-slate-200 rounded-2xl shadow-2xl py-2 z-20 animate-in overflow-hidden">
            {options.map(opt => (
              <div
                key={opt}
                onClick={() => {
                  onChange(opt);
                  setIsOpen(false);
                }}
                className={cn(
                  "px-4 py-2.5 text-[11px] font-bold cursor-pointer hover:bg-slate-50 transition-colors uppercase tracking-widest",
                  value === opt ? "bg-accent/10 text-accent" : "text-slate-600"
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

function DecisionBtn({ icon, label, color, onClick, isActive }: { icon: React.ReactNode, label: string, color: string, onClick?: () => void, isActive?: boolean }) {
  return (
    <button
      onClick={onClick}
      className={cn(
        "flex flex-col items-center justify-center gap-2 py-4 rounded-3xl border font-black text-[10px] uppercase tracking-widest transition-all active:scale-90 shadow-md",
        isActive ? "ring-2 ring-offset-1 ring-accent" : "hover:shadow-lg hover:-translate-y-0.5",
        color
      )}
    >
      {icon}
      {label}
    </button>
  )
}
