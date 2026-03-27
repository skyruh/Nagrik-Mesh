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
  Bell,
  PieChart,
  History,
  TrendingUp,
  ShieldCheck,
  Zap,
  Activity,
  MessageSquareQuote,
  PencilLine,
  Target
} from 'lucide-react';
import { MOCK_COMPLAINTS } from '../lib/mock-data';
import { getProcessedComplaints } from '../lib/engine';
import { ExtendedComplaint, PriorityLevel, ComplaintStatus } from '../types/schema';
import { cn } from '../lib/utils';

export default function Dashboard() {
  const [complaints, setComplaints] = useState<ExtendedComplaint[]>([]);
  const [selectedId, setSelectedId] = useState<string | null>('CPG-2023-001');
  const [activeTab, setActiveTab] = useState('My Queue');
  const [officerNote, setOfficerNote] = useState('');

  // Filtering states
  const [searchQuery, setSearchQuery] = useState('');
  const [statusFilter, setStatusFilter] = useState<string>('All');
  const [priorityFilter, setPriorityFilter] = useState<string>('All');
  const [deptFilter, setDeptFilter] = useState<string>('MoRD');

  useEffect(() => {
    const processed = getProcessedComplaints(MOCK_COMPLAINTS as any);
    setComplaints(processed);
  }, []);

  // Combined Data Logic 
  const filteredComplaints = useMemo(() => {
    return complaints.filter(c => {
      const matchesSearch =
        c.id.toLowerCase().includes(searchQuery.toLowerCase()) ||
        c.citizenName.toLowerCase().includes(searchQuery.toLowerCase()) ||
        c.subject.toLowerCase().includes(searchQuery.toLowerCase());

      const matchesStatus = statusFilter === 'All' || c.status === statusFilter;
      const matchesPriority = priorityFilter === 'All' || c.priority === priorityFilter;
      const matchesDept = deptFilter === 'All' || c.department === deptFilter;

      return matchesSearch && matchesStatus && matchesPriority && matchesDept;
    });
  }, [complaints, searchQuery, statusFilter, priorityFilter, deptFilter]);

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

  const renderContent = () => {
    if (activeTab === 'Dashboard') return <ViewModule title="System Intelligence" icon={<Zap size={48} />} />;
    if (activeTab === 'Analytics') return <ViewModule title="Visual Intelligence" icon={<BarChart3 size={48} />} />;
    if (activeTab === 'Reports') return <ViewModule title="Governance Archive" icon={<FileText size={48} />} />;
    if (activeTab === 'User Management') return <ViewModule title="Registry Access" icon={<ShieldCheck size={48} />} />;

    return (
      <>
        {/* Filters Strip */}
        <div className="px-10 py-5 flex items-center justify-between bg-white border-b border-slate-200 shadow-sm z-[100] relative">
          <div className="flex items-center gap-6">
            <FilterSelector
              label="View Sector"
              value={deptFilter}
              options={['All', 'MoHFW', 'MoE', 'MoRD']}
              onChange={setDeptFilter}
            />
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
          </div>

          <div className="flex items-center gap-8">
            <div className="flex flex-col gap-2 w-48">
              <div className="flex items-center justify-between">
                <span className="text-[10px] font-black text-emerald-600 uppercase tracking-widest flex items-center gap-1.5">
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
                placeholder="Search grievances..."
                value={searchQuery}
                onChange={(e) => setSearchQuery(e.target.value)}
                className="bg-slate-50 border border-slate-200 rounded-2xl pl-12 pr-6 py-2.5 text-xs w-64 focus:ring-4 focus:ring-accent/5 focus:border-accent outline-none font-bold text-slate-800 shadow-inner placeholder:text-slate-300"
              />
            </div>
          </div>
        </div>

        <div className="flex-1 flex overflow-hidden relative z-0">
          {/* Table Area */}
          <div className="flex-1 overflow-y-auto p-10 bg-[#f8fafc]">
            <div className="bg-white rounded-[2rem] shadow-xl border border-slate-200/60 overflow-hidden ring-1 ring-black/5">
              <table className="w-full text-left border-collapse text-[12px]">
                <thead>
                  <tr className="bg-slate-50 border-b border-slate-100 relative z-0">
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
                    filteredComplaints.map((c) => {
                      const rowColor =
                        c.priority === 'Critical' ? "bg-rose-100" :
                          c.priority === 'High' ? "bg-amber-100" :
                            c.priority === 'Moderate' ? "bg-yellow-50/80" : "bg-white";

                      return (
                        <tr
                          key={c.id}
                          onClick={() => setSelectedId(c.id)}
                          className={cn(
                            "group cursor-pointer transition-all duration-200",
                            rowColor,
                            selectedId === c.id ? "ring-2 ring-inset ring-accent z-[10] relative shadow-lg" : "hover:brightness-95",
                            "relative"
                          )}
                        >
                          <td className="px-8 py-6 font-black text-blue-600 flex items-center gap-3">
                            {selectedId === c.id && <div className="w-1.5 h-1.5 rounded-full bg-blue-600 animate-ping absolute left-3" />}
                            {c.id}
                          </td>
                          <td className="px-5 py-6 text-slate-500 font-medium">{c.dateFiled}</td>
                          <td className="px-5 py-6 text-slate-900">{c.citizenName}</td>
                          <td className="px-5 py-6 text-slate-600">{c.department}</td>
                          <td className="px-5 py-6">
                            <div className="flex justify-center">
                              <span className={cn(
                                "px-3 py-1.5 rounded-xl text-[10px] font-black text-white flex items-center gap-2 shadow-sm uppercase tracking-widest",
                                c.priority === 'Critical' ? "bg-rose-500 ring-2 ring-rose-500/20" :
                                  c.priority === 'High' ? "bg-amber-500" :
                                    c.priority === 'Moderate' ? "bg-yellow-500" : "bg-slate-400"
                              )}>
                                {c.priority}
                              </span>
                            </div>
                          </td>
                          <td className="px-8 py-6 text-right">
                            <span className={cn(
                              "px-4 py-1 rounded-full border-[1.5px] text-[10px] font-black uppercase inline-block min-w-[100px] text-center",
                              c.status === 'Resolved' ? "bg-emerald-50 text-emerald-600 border-emerald-200" :
                                c.status === 'Escalated' ? "bg-rose-50 text-rose-600 border-rose-200" :
                                  c.status === 'Processing' ? "bg-blue-50 text-blue-600 border-blue-200" : "bg-slate-100 text-slate-600 border-slate-200"
                            )}>
                              {c.status}
                            </span>
                          </td>
                        </tr>
                      )
                    })
                  ) : (
                    <tr>
                      <td colSpan={6} className="p-32 text-center bg-white">
                        <div className="flex flex-col items-center gap-4 opacity-30">
                          <Search size={48} className="text-slate-300" />
                          <p className="text-lg font-black text-slate-400 uppercase tracking-widest">No Matches</p>
                        </div>
                      </td>
                    </tr>
                  )}
                </tbody>
              </table>
            </div>
          </div>

          {/* Analysis Sidebar */}
          <div className="w-[480px] bg-white border-l border-slate-200 overflow-y-auto p-10 flex flex-col gap-12 z-20 shadow-2xl relative">
            {selectedComplaint ? (
              <>
                <div className="flex items-center justify-between">
                  <div className="flex flex-col">
                    <h3 className="font-black text-2xl text-slate-900 tracking-tighter leading-none uppercase italic">Analysis</h3>
                  </div>
                  <button onClick={() => setSelectedId(null)} className="h-10 w-10 rounded-2xl hover:bg-slate-100 flex items-center justify-center group transition-colors">
                    <X size={24} className="text-slate-300 group-hover:text-slate-900" />
                  </button>
                </div>

                <div className="space-y-12 animate-in pb-20">
                  {/* Citizen Statement - Raw Input Priority */}
                  <div className="p-10 rounded-[2.5rem] bg-slate-50/80 border-2 border-slate-100 shadow-sm relative overflow-hidden group">
                    <div className="text-[11px] font-black text-slate-400 uppercase tracking-[0.3em] mb-6 flex items-center gap-3">
                      <div className="h-1.5 w-1.5 rounded-full bg-accent" />
                      Citizen Statement
                    </div>
                    <p className="text-xl leading-relaxed font-bold italic tracking-tight text-slate-700 relative z-10 drop-shadow-sm">
                      "{selectedComplaint.description}"
                    </p>
                    <MessageSquareQuote size={64} className="absolute -bottom-4 -right-4 text-slate-900/5 rotate-12" />
                  </div>

                  {/* Official Action Notes */}
                  <div className="space-y-5">
                    <div className="flex items-center justify-between px-2">
                      <div className="flex items-center gap-3">
                        <h4 className="text-xs font-black uppercase tracking-[0.2em] text-slate-800">Official Action Notes</h4>
                        <div className="p-1.5 rounded-lg bg-slate-100 text-slate-400"><PencilLine size={12} /></div>
                      </div>
                      <div className="h-px flex-1 ml-6 bg-slate-100" />
                    </div>
                    <div className="relative group">
                      <textarea
                        placeholder="Enter technical observations or remediation logs..."
                        value={officerNote}
                        onChange={(e) => setOfficerNote(e.target.value)}
                        className="w-full bg-white border-2 border-slate-100 rounded-[2.5rem] p-8 text-sm font-bold text-slate-800 placeholder:text-slate-300 focus:outline-none focus:border-accent focus:ring-[10px] focus:ring-accent/5 transition-all min-h-[180px] resize-none shadow-sm"
                      />
                      <div className="absolute bottom-6 right-8 flex items-center gap-2 opacity-30 select-none">
                        <span className="text-[9px] font-black text-slate-400 uppercase tracking-widest italic tracking-[0.1em]">Authenticated Log: Abhishek Sharma</span>
                      </div>
                    </div>
                  </div>

                  {/* Decision Matrix */}
                  <div className="space-y-6">
                    <div className="flex items-center justify-between px-2">
                      <h4 className="text-xs font-black uppercase tracking-[0.2em] text-slate-800">Status Update</h4>
                      <div className="h-px flex-1 mx-6 bg-slate-100" />
                    </div>
                    <div className="flex gap-5">
                      <ActionBtn
                        icon={<CheckCircle2 size={26} />}
                        label="Accept"
                        active={selectedComplaint.status === 'Resolved'}
                        color="text-emerald-500 hover:bg-emerald-50 border-emerald-200 active:bg-emerald-500"
                        onClick={() => handleAction(selectedComplaint.id, 'Resolved')}
                      />
                      <ActionBtn
                        icon={<Edit2 size={26} />}
                        label="Modify"
                        active={selectedComplaint.status === 'Processing'}
                        color="text-amber-500 hover:bg-amber-50 border-amber-200 active:bg-amber-500"
                        onClick={() => handleAction(selectedComplaint.id, 'Processing')}
                      />
                      <ActionBtn
                        icon={<XCircle size={26} />}
                        label="Escalate"
                        active={selectedComplaint.status === 'Escalated'}
                        color="text-rose-500 hover:bg-rose-50 border-rose-200 active:bg-rose-500"
                        onClick={() => handleAction(selectedComplaint.id, 'Escalated')}
                      />
                    </div>

                    <div className="pt-6">
                      <button className="w-full bg-[#0f172a] text-white font-black uppercase text-[12px] tracking-[0.3em] py-7 rounded-[2rem] shadow-[0_25px_50px_-12px_rgba(15,23,42,0.4)] hover:bg-black transition-all active:scale-95 flex items-center justify-center gap-4">
                        Seal & Synchronize <Check size={20} />
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
                <p className="text-slate-400 text-xs font-bold leading-relaxed max-w-[200px]">Select a grievance from the primary feed <br />to initiate AI core processing.</p>
              </div>
            )}
          </div>
        </div>
      </>
    );
  };

  return (
    <div className="flex h-screen w-full bg-[#f3f4f6] overflow-hidden antialiased font-sans select-none">
      {/* Sidebar */}
      <aside className="w-64 bg-[#232f3e] flex flex-col p-0 z-[1000] shadow-2xl shrink-0">
        <div className="p-6">
          <div className="flex items-center gap-4 mb-10 group cursor-default">
            <div className="h-10 w-10 rounded-xl bg-white/10 flex items-center justify-center border border-white/5 shadow-inner transition-transform group-hover:scale-110">
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
            <div className="h-px bg-white/5 my-4 mx-2" />
            <SidebarItem label="Analytics" icon={<BarChart3 size={16} />} active={activeTab === 'Analytics'} onClick={() => setActiveTab('Analytics')} />
            <SidebarItem label="Reports" icon={<FileText size={16} />} active={activeTab === 'Reports'} onClick={() => setActiveTab('Reports')} />
            <SidebarItem label="User Management" icon={<Users size={16} />} active={activeTab === 'User Management'} onClick={() => setActiveTab('User Management')} />
          </nav>
        </div>
        <div className="mt-auto p-6 space-y-1 border-t border-white/5 bg-black/10 text-center">
          <SidebarItem label="Settings" icon={<Activity size={16} />} secondary />
          <SidebarItem label="Help Center" secondary />
        </div>
      </aside>

      <main className="flex-1 flex flex-col overflow-hidden bg-[#f8fafc] z-0 relative">
        <header className="h-20 bg-white border-b border-slate-200 flex items-center justify-between px-10 shrink-0 z-[110] relative shadow-sm">
          <div className="flex items-center gap-4">
            <div className="h-6 w-1.5 bg-accent rounded-full shadow-[0_0_12px_rgba(59,130,246,0.6)]" />
            <h2 className="text-slate-900 font-black text-xl tracking-tight uppercase italic">
              {activeTab} <span className="text-slate-300 font-bold text-sm ml-3 tracking-widest normal-case not-italic">/ Intelligence Core</span>
            </h2>
          </div>

          <div className="flex items-center gap-10">
            <button className="relative p-2.5 text-slate-400 hover:text-accent transition-all hover:scale-110 active:scale-95">
              <Bell size={22} />
              <span className="absolute top-2.5 right-2.5 w-2.5 h-2.5 bg-rose-500 rounded-full border-[2.5px] border-white shadow-xl animate-bounce" />
            </button>
            <div className="flex items-center gap-4 text-[12px]">
              <div className="flex flex-col text-right">
                <span className="text-slate-900 font-black tracking-tight">Abhishek Sharma</span>
                <span className="text-slate-400 font-bold text-[10px] uppercase tracking-widest opacity-60">Joint Secretary</span>
              </div>
              <div className="h-12 w-12 rounded-[1.2rem] bg-gradient-to-br from-slate-800 to-slate-950 border border-slate-800 shadow-2xl flex items-center justify-center font-black text-white transition-all hover:scale-105 hover:rotate-3 cursor-pointer ring-4 ring-white">
                AS
              </div>
            </div>
          </div>
        </header>

        {renderContent()}
      </main>
    </div>
  );
}

function SidebarItem({ label, icon, active, onClick, secondary }: { label: string, icon?: React.ReactNode, active?: boolean, onClick?: () => void, secondary?: boolean }) {
  return (
    <div
      onClick={onClick}
      className={cn(
        "px-5 py-4 rounded-2xl text-[11px] font-black uppercase tracking-widest cursor-pointer transition-all flex items-center gap-4 border border-transparent group",
        active
          ? "bg-accent text-white shadow-[0_15px_30px_-5px_rgba(59,130,246,0.4)] border-white/10"
          : "text-slate-500 hover:text-white hover:bg-white/5 active:scale-95",
        secondary && "py-3 text-slate-600 opacity-40 hover:opacity-100"
      )}
    >
      <span className={cn("transition-colors", active ? "text-white" : "text-slate-600 group-hover:text-accent")}>{icon}</span>
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
          "flex items-center gap-4 px-6 py-3 border-[2px] rounded-[1.2rem] shadow-sm cursor-pointer transition-all hover:bg-slate-50 select-none",
          value !== 'All' && value !== 'MoRD' ? "border-accent bg-accent/5 ring-8 ring-accent/5" : "bg-white border-slate-100",
          "relative z-[150]"
        )}
      >
        <span className="text-[10px] font-black text-slate-300 uppercase tracking-[0.2em]">{label}</span>
        <span className="text-[10px] font-black text-slate-900 flex items-center gap-3 uppercase tracking-tighter">
          {value}
          <ChevronRight size={14} className={cn("text-slate-400 transition-transform duration-500", isOpen ? "rotate-90" : "")} />
        </span>
      </div>

      {isOpen && (
        <>
          <div className="fixed inset-0 bg-black/[0.05] z-[9000]" onClick={() => setIsOpen(false)} />
          <div className="absolute top-full left-0 mt-4 w-60 bg-white border border-slate-200 rounded-[2.5rem] shadow-[0_50px_100px_-20px_rgba(0,0,0,0.4)] py-6 z-[9999] overflow-hidden ring-1 ring-black/10 animate-in slide-in-from-top-4 duration-300">
            {options.map(opt => (
              <div
                key={opt}
                onClick={() => {
                  onChange(opt);
                  setIsOpen(false);
                }}
                className={cn(
                  "px-8 py-4 text-[10px] font-black cursor-pointer transition-all uppercase tracking-[0.3em]",
                  value === opt ? "bg-accent text-white" : "text-slate-500 hover:bg-slate-50 hover:text-slate-950 hover:pl-10"
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
    <div className="p-6 rounded-[1.8rem] bg-white border border-slate-100 shadow-sm flex flex-col gap-2 transition-all hover:shadow-xl hover:translate-y-[-2px] group">
      <p className="text-[9px] font-black text-slate-300 uppercase tracking-widest group-hover:text-accent transition-colors">{label}</p>
      <p className={cn(
        "text-xs font-black uppercase tracking-tight",
        urgent ? "text-rose-600" : "text-slate-900"
      )}>{value}</p>
    </div>
  )
}

function ActionBtn({ icon, label, color, onClick, active }: { icon: React.ReactNode, label: string, color: string, onClick?: () => void, active?: boolean }) {
  return (
    <button
      onClick={onClick}
      className={cn(
        "flex-1 flex flex-col items-center justify-center gap-4 py-8 rounded-[2.8rem] border-2 font-black text-[11px] uppercase tracking-[0.2em] transition-all active:scale-90 shadow-lg",
        active ? "ring-[10px] ring-offset-2 ring-accent/10 border-accent bg-accent/5" : "hover:scale-105 border-slate-50 bg-white",
        color
      )}
    >
      <div className="transition-transform duration-500 group-hover:rotate-12">{icon}</div>
      {label}
    </button>
  )
}

function ViewModule({ title, icon }: { title: string, icon: React.ReactNode }) {
  return (
    <div className="flex-1 flex flex-col items-center justify-center bg-[#f8fafc] p-20 text-center animate-in fade-in zoom-in duration-700">
      <div className="p-20 rounded-[5rem] bg-white shadow-[0_50px_150px_-30px_rgba(0,0,0,0.15)] border border-slate-100 flex flex-col items-center gap-12 max-w-xl relative overflow-hidden group">
        <div className="absolute top-0 left-0 w-full h-3 bg-accent opacity-30 shadow-2xl" />
        <div className="p-10 rounded-[3rem] bg-slate-950 text-white shadow-[0_30px_60px_-15px_rgba(0,0,0,0.5)] transition-all duration-700 group-hover:scale-110 group-hover:rotate-6">
          {icon}
        </div>
        <div className="space-y-8">
          <h3 className="text-4xl font-black text-slate-950 uppercase italic tracking-tighter">{title}</h3>
          <div className="h-2 w-16 bg-accent mx-auto rounded-full shadow-[0_0_20px_rgba(59,130,246,0.5)]" />
          <p className="text-slate-400 font-bold text-base leading-relaxed max-w-sm mx-auto">
            This executive module is currently undergoing security clearance and high-speed data synchronization with the CPGRAMS central cluster. Awaiting protocol handshake.
          </p>
        </div>
        <div className="flex items-center gap-4 bg-slate-50 px-8 py-4 rounded-full border border-slate-100 shadow-inner">
          <div className="h-3 w-3 rounded-full bg-emerald-500 animate-pulse shadow-[0_0_10px_rgba(16,185,129,0.5)]" />
          <span className="text-[11px] font-black text-slate-500 uppercase tracking-[0.3em]">Module Online / Encrypted</span>
        </div>
        {/* Decorative Elements */}
        <div className="absolute -bottom-10 -right-10 w-40 h-40 bg-accent/5 rounded-full blur-3xl" />
      </div>
    </div>
  )
}
