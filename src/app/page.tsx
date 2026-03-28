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
  PieChart as PieChartIcon,
  History,
  TrendingUp,
  ShieldCheck,
  Zap,
  Activity,
  MessageSquareQuote,
  PencilLine,
  Target,
  Forward,
  Lock,
  Archive,
  ArrowUpRight,
  TrendingDown,
  Clock,
  Download,
  Calendar,
  Filter,
  FileSearch,
  ExternalLink,
  Table as TableIcon,
  UserPlus,
  Shield,
  ShieldAlert,
  UserCheck,
  Key,
  Fingerprint
} from 'lucide-react';
import {
  AreaChart, Area, XAxis, YAxis, CartesianGrid, Tooltip, ResponsiveContainer,
  BarChart, Bar, Cell, PieChart, Pie, Legend
} from 'recharts';
import { MOCK_COMPLAINTS } from '../lib/mock-data';
import { getProcessedComplaints } from '../lib/engine';
import { ExtendedComplaint, PriorityLevel, ComplaintStatus } from '../types/schema';
import { cn } from '../lib/utils';

export default function Dashboard() {
  const [complaints, setComplaints] = useState<ExtendedComplaint[]>([]);
  const [selectedId, setSelectedId] = useState<string | null>('CPG-2023-001');
  const [activeTab, setActiveTab] = useState('Active Feed');
  const [officerNote, setOfficerNote] = useState('');
  const [forwardTo, setForwardTo] = useState('MoRD Core');

  // Track which IDs have been manually processed in this session
  const [processedIds, setProcessedIds] = useState<Set<string>>(new Set());

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

      const hasManuallyProcessed = processedIds.has(c.id);
      const matchesCategory = activeTab === 'Action Archive' ? hasManuallyProcessed : !hasManuallyProcessed;

      const matchesStatus = statusFilter === 'All' || c.status === statusFilter;
      const matchesPriority = priorityFilter === 'All' || c.priority === priorityFilter;
      const matchesDept = deptFilter === 'All' || c.department === deptFilter;

      return matchesSearch && matchesCategory && matchesStatus && matchesPriority && matchesDept;
    });
  }, [complaints, searchQuery, statusFilter, priorityFilter, deptFilter, activeTab, processedIds]);

  const selectedComplaint = complaints.find(c => c.id === selectedId);
  const isArchiveMode = activeTab === 'Action Archive';

  const stats = useMemo(() => {
    const total = complaints.length || 1;
    const processedCount = processedIds.size;
    return {
      total,
      percentage: Math.round((processedCount / total) * 100),
      active: complaints.length - processedCount,
      resolved: complaints.filter(c => c.status === 'Resolved').length,
      escalated: complaints.filter(c => c.status === 'Escalated').length,
    };
  }, [complaints, processedIds]);

  const handleAction = (id: string, newStatus: ComplaintStatus) => {
    setComplaints(prev => prev.map(c =>
      c.id === id ? { ...c, status: newStatus, lastAction: `Status updated to ${newStatus}` } : c
    ));
    setProcessedIds(prev => new Set(prev).add(id));
  };

  const renderContent = () => {
    if (activeTab === 'Dashboard') return <DashboardView complaints={complaints} processedIds={processedIds} onSelect={(id: string) => { setSelectedId(id); setActiveTab('Active Feed'); }} />;
    if (activeTab === 'Analytics') return <AnalyticsView complaints={complaints} processedIds={processedIds} />;
    if (activeTab === 'User Management') return <UserManagementView />;

    return (
      <FeedModule
        activeTab={activeTab}
        deptFilter={deptFilter}
        setDeptFilter={setDeptFilter}
        statusFilter={statusFilter}
        setStatusFilter={setStatusFilter}
        priorityFilter={priorityFilter}
        setPriorityFilter={setPriorityFilter}
        stats={stats}
        filteredComplaints={filteredComplaints}
        isArchiveMode={isArchiveMode}
        selectedId={selectedId}
        setSelectedId={setSelectedId}
        selectedComplaint={selectedComplaint}
        officerNote={officerNote}
        setOfficerNote={setOfficerNote}
        forwardTo={forwardTo}
        setForwardTo={setForwardTo}
        handleAction={handleAction}
        searchQuery={searchQuery}
        setSearchQuery={setSearchQuery}
      />
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
            <SidebarItem label="Active Feed" icon={<Inbox size={16} />} active={activeTab === 'Active Feed'} onClick={() => setActiveTab('Active Feed')} />
            <SidebarItem label="Action Archive" icon={<Archive size={16} />} active={activeTab === 'Action Archive'} onClick={() => setActiveTab('Action Archive')} />
            <div className="h-px bg-white/5 my-4 mx-2" />
            <SidebarItem label="Analytics" icon={<BarChart3 size={16} />} active={activeTab === 'Analytics'} onClick={() => setActiveTab('Analytics')} />
            <SidebarItem label="User Management" icon={<Users size={16} />} active={activeTab === 'User Management'} onClick={() => setActiveTab('User Management')} />
          </nav>
        </div>
      </aside>

      <main className="flex-1 flex flex-col overflow-hidden bg-[#f8fafc] z-0 relative">
        <header className="h-20 bg-white border-b border-slate-200 flex items-center justify-between px-10 shrink-0 z-[110] relative shadow-sm">
          <div className="flex items-center gap-4">
            <div className="h-6 w-1.5 bg-accent rounded-full shadow-[0_0_12px_rgba(59,130,246,0.6)]" />
            <h2 className="text-slate-900 font-black text-xl tracking-tight uppercase italic">
              {activeTab}
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

function FeedModule({
  activeTab, deptFilter, setDeptFilter, statusFilter, setStatusFilter, priorityFilter, setPriorityFilter, stats, filteredComplaints, isArchiveMode, selectedId, setSelectedId, selectedComplaint, officerNote, setOfficerNote, forwardTo, setForwardTo, handleAction, searchQuery, setSearchQuery
}: any) {
  return (
    <>
      {/* Filters Strip */}
      <div className="px-10 py-5 flex items-center justify-between bg-white border-b border-slate-200 shadow-sm z-[100] relative">
        <div className="flex items-center gap-6">
          <div className="relative group">
            <Search size={14} className="absolute left-6 top-1/2 -translate-y-1/2 text-slate-300 group-focus-within:text-accent transition-colors" />
            <input
              value={searchQuery}
              onChange={(e) => setSearchQuery(e.target.value)}
              placeholder="Search Citizen or ID..."
              className="bg-slate-50 border-2 border-slate-100 rounded-[1.2rem] pl-12 pr-8 py-3 text-[10px] font-black uppercase placeholder:text-slate-300 focus:outline-none focus:border-accent focus:bg-white transition-all w-64"
            />
          </div>
          <FilterSelector label="View Sector" value={deptFilter} options={['All', 'MoHFW', 'MoE', 'MoRD']} onChange={setDeptFilter} />
          <FilterSelector label="Status" value={statusFilter} options={['All', 'Pending', 'Processing', 'Escalated', 'Resolved']} onChange={setStatusFilter} />
          <FilterSelector label="Priority" value={priorityFilter} options={['All', 'Critical', 'High', 'Moderate', 'Low']} onChange={setPriorityFilter} />
        </div>

        <div className="flex items-center gap-8">
        </div>
      </div>

      <div className="flex-1 flex overflow-hidden relative z-0">
        <div className="flex-1 overflow-y-auto p-10 bg-[#f8fafc]">
          {isArchiveMode && (
            <div className="mb-6 flex items-center gap-3 bg-amber-50 border border-amber-100 px-6 py-3 rounded-2xl">
              <Lock size={14} className="text-amber-600" />
              <span className="text-[10px] font-black text-amber-800 uppercase tracking-widest">Archive Vault - Read Only Access Enabled</span>
            </div>
          )}
          <div className="bg-white rounded-[2rem] shadow-xl border border-slate-200/60 overflow-hidden ring-1 ring-black/5">
            <table className="w-full text-left border-collapse text-[12px]">
              <thead>
                <tr className="bg-slate-50 border-b border-slate-100 relative z-0">
                  <th className="px-8 py-5 font-black text-slate-400 uppercase tracking-widest">Grievance ID</th>
                  <th className="px-5 py-5 font-black text-slate-400 uppercase tracking-widest">Date</th>
                  <th className="px-5 py-5 font-black text-slate-400 uppercase tracking-widest">Citizen</th>
                  <th className="px-5 py-5 font-black text-slate-400 uppercase tracking-widest w-[20%] text-center">Priority</th>
                  <th className="px-8 py-5 font-black text-slate-400 uppercase tracking-widest text-right whitespace-nowrap">Resolution Status</th>
                </tr>
              </thead>
              <tbody className="divide-y divide-slate-50 font-bold">
                {filteredComplaints.length > 0 ? (
                  filteredComplaints.map((c: any) => {
                    const rowColor =
                      c.priority === 'Critical' ? "bg-rose-100" :
                        c.priority === 'High' ? "bg-amber-100" :
                          c.priority === 'Moderate' ? "bg-yellow-50/80" : "bg-white";

                    return (
                      <tr key={c.id} onClick={() => setSelectedId(c.id)} className={cn("group cursor-pointer transition-all duration-200", isArchiveMode ? "opacity-70 hover:opacity-100 hover:bg-slate-50" : rowColor, selectedId === c.id ? "ring-2 ring-inset ring-accent z-[10] relative shadow-lg" : "hover:brightness-95", "relative")}>
                        <td className="px-8 py-6 font-black text-blue-600 flex items-center gap-3">
                          {selectedId === c.id && <div className="w-1.5 h-1.5 rounded-full bg-blue-600 animate-ping absolute left-3" />}
                          {c.id}
                        </td>
                        <td className="px-5 py-6 text-slate-500 font-medium">{c.dateFiled}</td>
                        <td className="px-5 py-6 text-slate-900">{c.citizenName}</td>
                        <td className="px-5 py-6"><div className="flex justify-center"><span className={cn("px-3 py-1.5 rounded-xl text-[10px] font-black text-white flex items-center gap-2 shadow-sm uppercase tracking-widest", c.priority === 'Critical' ? "bg-rose-500" : c.priority === 'High' ? "bg-amber-500" : c.priority === 'Moderate' ? "bg-yellow-500" : "bg-slate-400")}>{c.priority}</span></div></td>
                        <td className="px-8 py-6 text-right"><span className={cn("px-4 py-1 rounded-full border-[1.5px] text-[10px] font-black uppercase inline-block min-w-[100px] text-center", c.status === 'Resolved' ? "bg-emerald-50 text-emerald-600 border-emerald-200" : c.status === 'Escalated' ? "bg-rose-50 text-rose-600 border-rose-200" : c.status === 'Processing' ? "bg-blue-50 text-blue-600 border-blue-200" : "bg-slate-100 text-slate-600 border-slate-200")}>{c.status}</span></td>
                      </tr>
                    )
                  })
                ) : (
                  <tr><td colSpan={5} className="p-32 text-center bg-white"><div className="flex flex-col items-center gap-4 opacity-30"><Search size={48} className="text-slate-300" /><p className="text-lg font-black text-slate-400 uppercase tracking-widest">Vault Empty</p></div></td></tr>
                )}
              </tbody>
            </table>
          </div>
        </div>

        {/* Analysis Sidebar */}
        <div className={cn("w-[480px] bg-white border-l border-slate-200 overflow-y-auto p-10 flex flex-col gap-12 z-20 shadow-2xl relative transition-all duration-500", isArchiveMode && "bg-slate-50/50")}>
          {selectedComplaint ? (
            <>
              <div className="flex items-center justify-between">
                <div className="flex flex-col">
                  <h3 className="font-black text-2xl text-slate-900 tracking-tighter leading-none uppercase italic">Grievance Analysis</h3>
                  {isArchiveMode && <span className="text-[10px] font-black text-blue-600 uppercase tracking-widest mt-2 flex items-center gap-2"><ShieldCheck size={12} /> Immutable Record</span>}
                </div>
                <button onClick={() => setSelectedId(null)} className="h-10 w-10 rounded-2xl hover:bg-slate-100 flex items-center justify-center group transition-colors"><X size={24} className="text-slate-300 group-hover:text-slate-900" /></button>
              </div>
              <div className="space-y-10 animate-in pb-20">
                {/* Grievance Details Block */}
                <div className="space-y-6">
                  <div className="flex items-center justify-between px-2"><h4 className="text-[10px] font-black uppercase tracking-[0.3em] text-slate-400">Grievance Details</h4><div className="h-px flex-1 ml-6 bg-slate-100" /></div>
                  <div className="grid grid-cols-2 gap-y-6 px-2">
                    <div className="space-y-1">
                      <span className="text-[9px] font-black text-slate-300 uppercase tracking-widest">ID</span>
                      <p className="text-[13px] font-black text-blue-600">{selectedComplaint.id}</p>
                    </div>
                    <div className="space-y-1">
                      <span className="text-[9px] font-black text-slate-300 uppercase tracking-widest">Submitted</span>
                      <p className="text-[13px] font-black text-slate-900">{selectedComplaint.dateFiled}</p>
                    </div>
                    <div className="col-span-2 space-y-1">
                      <span className="text-[9px] font-black text-slate-300 uppercase tracking-widest">Subject</span>
                      <p className="text-[13px] font-bold text-slate-800 leading-tight">{selectedComplaint.subject}</p>
                    </div>
                  </div>
                </div>

                {/* Citizen Statement Block */}
                <div className="p-8 rounded-[2rem] bg-white border-2 border-slate-100 shadow-sm relative overflow-hidden group">
                  <div className="text-[9px] font-black text-slate-300 uppercase tracking-[0.3em] mb-4 flex items-center gap-3">Citizen Statement</div>
                  <p className="text-base leading-relaxed font-bold italic tracking-tight text-slate-700 relative z-10 drop-shadow-sm">"{selectedComplaint.description}"</p>
                  <MessageSquareQuote size={48} className="absolute -bottom-4 -right-4 text-slate-900/5 rotate-12" />
                </div>

                {/* AI-Powered Analysis Block */}
                <div className="p-8 rounded-[2rem] bg-blue-50/30 border-2 border-blue-100/50 space-y-8 relative overflow-hidden">
                  <div className="text-[9px] font-black text-blue-400 uppercase tracking-[0.3em] flex items-center gap-3">AI-Powered Analysis <Sparkles size={12} /></div>

                  <div className="space-y-4">
                    <span className="text-[10px] font-black text-slate-400 uppercase tracking-widest">Key Insights</span>
                    <ul className="space-y-3">
                      <li className="flex items-start gap-3">
                        <div className="h-1 w-1 rounded-full bg-blue-500 mt-1.5 shrink-0" />
                        <p className="text-[11px] font-bold text-slate-600 leading-normal">Systemic delay identified in local unit processing for {selectedComplaint.department} mandates.</p>
                      </li>
                      <li className="flex items-start gap-3">
                        <div className="h-1 w-1 rounded-full bg-blue-500 mt-1.5 shrink-0" />
                        <p className="text-[11px] font-bold text-slate-600 leading-normal">Sentiment analysis indicates high citizen distress regarding operational transparency.</p>
                      </li>
                    </ul>
                  </div>

                  <div className="space-y-4">
                    <div className="flex items-center justify-between">
                      <span className="text-[10px] font-black text-slate-400 uppercase tracking-widest">Suspicion Flags</span>
                      <span className="text-[9px] font-black text-slate-300 uppercase">2 Flags Detected</span>
                    </div>
                    <div className="flex flex-col gap-3">
                      <div className="p-4 bg-white border border-yellow-100 rounded-xl space-y-2">
                        <div className="flex items-center gap-2">
                          <div className="h-2 w-2 rounded-full bg-yellow-400" />
                          <span className="text-[9px] font-black text-yellow-600 uppercase">Moderate</span>
                        </div>
                        <p className="text-[10px] font-bold text-slate-500">Duplicate signal: Matches 82% similarity with recent UP-D4 filing.</p>
                      </div>
                      <div className="p-4 bg-white border border-rose-100 rounded-xl space-y-2 group/flag">
                        <div className="flex items-center gap-2">
                          <div className="h-2 w-2 rounded-full bg-rose-400" />
                          <span className="text-[9px] font-black text-rose-600 uppercase">Alert</span>
                        </div>
                        <p className="text-[10px] font-bold text-slate-500 italic">Unusual Semantic Pattern: Potential bot-generated syntax detected in statement.</p>
                      </div>
                    </div>
                  </div>
                  <div className="absolute top-0 right-0 p-4 opacity-5"><Zap size={120} /></div>
                </div>

                {/* Official Action Notes */}
                <div className="space-y-5">
                  <div className="flex items-center justify-between px-2"><div className="flex items-center gap-3"><h4 className="text-[10px] font-black uppercase tracking-[0.2em] text-slate-800">Official Action Notes</h4>{!isArchiveMode && <div className="p-1.5 rounded-lg bg-white border border-slate-100 text-slate-400 shadow-sm"><PencilLine size={10} /></div>}</div><div className="h-px flex-1 ml-6 bg-slate-100" /></div>
                  {isArchiveMode ? <div className="p-8 bg-slate-100/50 border-2 border-slate-100 rounded-[2rem] text-sm font-bold text-slate-600 italic font-sans">{officerNote || "No technical observations were logged for this finalized record."}</div> : <div className="relative group"><textarea placeholder="Enter technical observations or remediation logs..." value={officerNote} onChange={(e) => setOfficerNote(e.target.value)} className="w-full bg-white border-2 border-slate-100 rounded-[2rem] p-8 text-[12px] font-bold text-slate-800 placeholder:text-slate-300 focus:outline-none focus:border-accent focus:ring-[8px] focus:ring-accent/5 transition-all min-h-[140px] resize-none shadow-sm font-sans" /></div>}
                </div>

                {!isArchiveMode && (
                  <div className="space-y-5 animate-in">
                    <div className="flex items-center justify-between px-2 text-slate-400"><div className="flex items-center gap-3"><h4 className="text-[10px] font-black uppercase tracking-[0.3em] text-slate-400">Forwarding Destination</h4><Forward size={12} /></div><div className="h-px flex-1 ml-6 bg-slate-100" /></div>
                    <SidebarDepartmentSelector value={forwardTo} options={['MoRD Core', 'Public Works Dept', 'Ministry Hub', 'District Magistrate Office', 'Technical Task Force']} onChange={setForwardTo} />
                  </div>
                )}

                {!isArchiveMode && (
                  <div className="space-y-6 animate-in">
                    <div className="flex items-center justify-between px-2"><h4 className="text-[10px] font-black uppercase tracking-[0.2em] text-slate-800">Status Update</h4><div className="h-px flex-1 mx-6 bg-slate-100" /></div>
                    <div className="flex gap-4">
                      <ActionBtn icon={<CheckCircle2 size={24} />} label="Accept" active={selectedComplaint.status === 'Resolved'} color="text-emerald-500 hover:bg-emerald-50 border-emerald-200 active:bg-emerald-500" onClick={() => handleAction(selectedComplaint.id, 'Resolved')} />
                      <ActionBtn icon={<Edit2 size={24} />} label="Modify" active={selectedComplaint.status === 'Processing'} color="text-amber-500 hover:bg-amber-50 border-amber-200 active:bg-amber-500" onClick={() => handleAction(selectedComplaint.id, 'Processing')} />
                      <ActionBtn icon={<XCircle size={24} />} label="Escalate" active={selectedComplaint.status === 'Escalated'} color="text-rose-500 hover:bg-rose-50 border-rose-200 active:bg-rose-500" onClick={() => handleAction(selectedComplaint.id, 'Escalated')} />
                    </div>
                    <div className="pt-4"><button className="w-full bg-[#0f172a] text-white font-black uppercase text-[10px] tracking-[0.3em] py-6 rounded-[2rem] shadow-[0_20px_40px_-12px_rgba(15,23,42,0.4)] hover:bg-black transition-all active:scale-95 flex items-center justify-center gap-4">Seal & Synchronize <Check size={18} /></button></div>
                  </div>
                )}
              </div>
            </>
          ) : (
            <div className="flex-1 flex flex-col items-center justify-center text-center p-12 opacity-30 grayscale animate-pulse"><div className="h-32 w-32 rounded-full border-4 border-dashed border-slate-200 flex items-center justify-center mb-8"><Inbox size={64} className="text-slate-200" /></div><h3 className="font-black text-slate-400 uppercase tracking-[0.4em] text-sm mb-4">Awaiting Signal</h3></div>
          )}
        </div>
      </div>
    </>
  );
}

function AnalyticsView({ complaints, processedIds }: any) {
  const [isMounted, setIsMounted] = useState(false);

  useEffect(() => {
    setIsMounted(true);
  }, []);

  const data = useMemo(() => {
    const statusMap = complaints.reduce((acc: any, c: any) => {
      acc[c.status] = (acc[c.status] || 0) + 1;
      return acc;
    }, {});
    const pieData = Object.keys(statusMap).map(key => ({ name: key, value: statusMap[key] }));
    const depts = ['MoRD', 'MoHFW', 'MoE'];
    const barData = depts.map(d => ({
      name: d,
      Volume: complaints.filter((c: any) => c.department === d).length,
      Resolved: complaints.filter((c: any) => c.department === d && c.status === 'Resolved').length
    }));
    const areaData = [
      { day: 'Mon', value: 12 }, { day: 'Tue', value: 19 }, { day: 'Wed', value: 15 },
      { day: 'Thu', value: 22 }, { day: 'Fri', value: 30 }, { day: 'Sat', value: 25 }, { day: 'Sun', value: processedIds.size + 20 }
    ];
    return { pieData, barData, areaData };
  }, [complaints, processedIds]);

  const COLORS = ['#3b82f6', '#10b981', '#f59e0b', '#ef4444', '#6366f1'];

  return (
    <div className="flex-1 overflow-y-auto bg-[#f8fafc] p-10 space-y-10 animate-in fade-in slide-in-from-bottom-5 duration-700">
      <div className="grid grid-cols-3 gap-8">
        <KPICard title="Total Payload" value={complaints.length} trend="+12.5%" icon={<Database size={20} />} color="text-slate-900" />
        <KPICard title="Processed" value={processedIds.size} trend={`+${processedIds.size}`} icon={<ShieldCheck size={20} />} color="text-blue-600" />
        <KPICard title="Escalation Rate" value={`${Math.round((complaints.filter((c: any) => c.status === 'Escalated').length / (complaints.length || 1)) * 100)}%`} trend="-2%" icon={<AlertCircle size={20} />} color="text-rose-600" down />
      </div>
      <div className="grid grid-cols-12 gap-8 h-[500px]">
        <div className="col-span-8 bg-white rounded-[3rem] p-10 shadow-xl border border-slate-100 flex flex-col gap-8 relative overflow-hidden group">
          <div className="flex items-center justify-between relative z-10">
            <div><h3 className="text-sm font-black uppercase tracking-widest text-slate-400">System Throughput</h3><p className="text-2xl font-black text-slate-900 tracking-tighter italic uppercase">Problem Per Day</p></div>
            <div className="px-4 py-2 bg-slate-50 rounded-xl border border-slate-100 text-[10px] font-black uppercase text-slate-500">Live Telemetry</div>
          </div>
          <div className="flex-1 w-full min-h-0">
            {isMounted && (
              <ResponsiveContainer width="100%" height="100%">
                <AreaChart data={data.areaData}>
                  <defs>
                    <linearGradient id="colorVal" x1="0" y1="0" x2="0" y2="1">
                      <stop offset="5%" stopColor="#3b82f6" stopOpacity={0.3} />
                      <stop offset="95%" stopColor="#3b82f6" stopOpacity={0} />
                    </linearGradient>
                  </defs>
                  <CartesianGrid strokeDasharray="3 3" vertical={false} stroke="#f1f5f9" />
                  <XAxis dataKey="day" axisLine={false} tickLine={false} tick={{ fontSize: 10, fontWeight: 900, fill: '#94a3b8' }} dy={10} />
                  <YAxis axisLine={false} tickLine={false} tick={{ fontSize: 10, fontWeight: 900, fill: '#94a3b8' }} />
                  <Tooltip contentStyle={{ borderRadius: '1.5rem', border: 'none', boxShadow: '0 25px 50px -12px rgba(0,0,0,0.15)', fontSize: '10px', fontWeight: 900, textTransform: 'uppercase' }} />
                  <Area type="monotone" dataKey="value" stroke="#3b82f6" strokeWidth={4} fillOpacity={1} fill="url(#colorVal)" />
                </AreaChart>
              </ResponsiveContainer>
            )}
          </div>
        </div>
        <div className="col-span-4 bg-white rounded-[3rem] p-10 shadow-xl border border-slate-100 flex flex-col gap-8 relative overflow-hidden">
          <h3 className="text-sm font-black uppercase tracking-widest text-slate-400">Governance Matrix</h3><p className="text-2xl font-black text-slate-900 tracking-tighter italic uppercase">Status Spread</p>
          <div className="flex-1 w-full flex items-center justify-center min-h-0">
            {isMounted && (
              <ResponsiveContainer width="100%" height="100%">
                <PieChart>
                  <Pie data={data.pieData} innerRadius={60} outerRadius={80} paddingAngle={5} dataKey="value" stroke="none">
                    {data.pieData.map((entry, index) => (
                      <Cell key={`cell-${index}`} fill={COLORS[index % COLORS.length]} />
                    ))}
                  </Pie>
                  <Tooltip />
                  <Legend verticalAlign="bottom" height={36} iconType="circle" wrapperStyle={{ fontSize: '10px', fontWeight: 900, textTransform: 'uppercase', color: '#64748b' }} />
                </PieChart>
              </ResponsiveContainer>
            )}
          </div>
        </div>
      </div>
      <div className="h-[400px] pb-10">
        <div className="bg-white rounded-[3rem] p-10 shadow-xl border border-slate-100 flex flex-col gap-8 h-full">
          <h3 className="text-sm font-black uppercase tracking-widest text-slate-400">Cross-Ministerial Audit</h3>
          <p className="text-2xl font-black text-slate-900 tracking-tighter italic uppercase">Departmental Latency</p>
          <div className="flex-1 w-full min-h-0">
            {isMounted && (
              <ResponsiveContainer width="100%" height="100%">
                <BarChart data={data.barData}>
                  <CartesianGrid strokeDasharray="3 3" vertical={false} stroke="#f1f5f9" />
                  <XAxis dataKey="name" axisLine={false} tickLine={false} tick={{ fontSize: 10, fontWeight: 900, fill: '#94a3b8' }} />
                  <Tooltip />
                  <Bar dataKey="Resolved" fill="#10b981" radius={[10, 10, 0, 0]} barSize={32} />
                  <Bar dataKey="Volume" fill="#e2e8f0" radius={[10, 10, 0, 0]} barSize={32} />
                </BarChart>
              </ResponsiveContainer>
            )}
          </div>
        </div>
      </div>
    </div>
  )
}

function UserManagementView() {
  const [query, setQuery] = useState('');
  const users = [
    { id: 'OFC-902', name: 'Abhishek Sharma', rank: 'Joint Secretary', dept: 'MoRD Core', role: 'Super Admin', status: 'Active' },
    { id: 'OFC-881', name: 'Priya Verma', rank: 'Technical Lead', dept: 'MoRD Technical', role: 'Operator', status: 'Active' },
    { id: 'OFC-743', name: 'Rajesh Kumar', rank: 'District Magistrate', dept: 'UP-District 4', role: 'Reviewer', status: 'Locked' },
    { id: 'OFC-612', name: 'Anjali Gupta', rank: 'Audit Officer', dept: 'MoHFW Central', role: 'Auditor', status: 'Active' },
    { id: 'OFC-412', name: 'Vikram Malhotra', rank: 'Deputy Director', dept: 'MoE Planning', role: 'Operator', status: 'Inactive' },
  ];

  const filtered = useMemo(() => users.filter(u => u.name.toLowerCase().includes(query.toLowerCase()) || u.id.toLowerCase().includes(query.toLowerCase())), [query, users]);

  return (
    <div className="flex-1 flex flex-col bg-[#f8fafc] overflow-hidden animate-in fade-in slide-in-from-right-4 duration-500">
      {/* Registry Header */}
      <div className="px-10 py-8 bg-white border-b border-slate-100 flex items-center justify-between shadow-sm z-10">
        <div className="flex items-center gap-10">
          <div className="flex flex-col gap-1.5"><span className="text-[10px] font-black text-slate-300 uppercase tracking-[0.2em]">Credential Cluster</span><h3 className="text-2xl font-black text-slate-900 italic uppercase tracking-tighter">Officer Registry</h3></div>
          <div className="h-10 w-px bg-slate-100" />
          <div className="relative group">
            <Search size={14} className="absolute left-6 top-1/2 -translate-y-1/2 text-slate-300 group-focus-within:text-accent transition-colors" />
            <input
              value={query}
              onChange={(e) => setQuery(e.target.value)}
              placeholder="Search Personnel ID or Name..."
              className="bg-slate-50 border-2 border-slate-100 rounded-2xl pl-12 pr-8 py-3 text-[10px] font-black uppercase placeholder:text-slate-300 focus:outline-none focus:border-accent focus:bg-white transition-all w-80"
            />
          </div>
        </div>
        <div className="flex items-center gap-4">
          <button className="flex items-center gap-3 bg-[#0f172a] text-white px-8 py-4 rounded-3xl font-black text-[10px] uppercase tracking-widest hover:bg-black transition-all shadow-xl active:scale-95 group">
            <UserPlus size={16} /> Provision New Officer
          </button>
          <button className="p-4 rounded-full bg-slate-50 text-slate-400 hover:text-slate-900 transition-all border border-slate-100"><Shield size={20} /></button>
        </div>
      </div>

      <div className="flex-1 overflow-y-auto p-12 flex gap-12">
        <div className="flex-1 space-y-10">
          {/* Access Stats */}
          <div className="grid grid-cols-4 gap-6">
            <UserStatCard icon={<UserCheck size={18} />} label="Active Officers" value="124" />
            <UserStatCard icon={<ShieldAlert size={18} />} label="Access Denied" value="03" />
            <UserStatCard icon={<Fingerprint size={18} />} label="Auth Requests" value="19" />
            <UserStatCard icon={<Key size={18} />} label="Tokens Issued" value="482" />
          </div>

          {/* Personnel Table */}
          <div className="bg-white rounded-[3rem] shadow-2xl border border-slate-200/50 overflow-hidden ring-1 ring-black/5">
            <table className="w-full text-left text-[11px] border-collapse italic font-bold">
              <thead>
                <tr className="bg-slate-50/80 border-b border-slate-100">
                  <th className="px-10 py-6 font-black text-slate-400 uppercase tracking-widest not-italic">Officer ID</th>
                  <th className="px-6 py-6 font-black text-slate-400 uppercase tracking-widest not-italic">Credential Identity</th>
                  <th className="px-6 py-6 font-black text-slate-400 uppercase tracking-widest not-italic">Jurisdiction</th>
                  <th className="px-6 py-6 font-black text-slate-400 uppercase tracking-widest not-italic">Perm Level</th>
                  <th className="px-10 py-6 font-black text-slate-400 uppercase tracking-widest not-italic text-right">Access State</th>
                </tr>
              </thead>
              <tbody className="divide-y divide-slate-50">
                {filtered.map(u => (
                  <tr key={u.id} className="hover:bg-slate-50 transition-all group cursor-pointer">
                    <td className="px-10 py-6 text-blue-600 font-black font-sans">{u.id}</td>
                    <td className="px-6 py-6"><div className="flex flex-col"><span className="text-slate-900 text-sm font-black tracking-tight">{u.name}</span><span className="text-[9px] uppercase tracking-widest text-slate-400 not-italic">{u.rank}</span></div></td>
                    <td className="px-6 py-6 text-slate-500 uppercase text-[10px] tracking-widest">{u.dept}</td>
                    <td className="px-6 py-6"><span className="px-4 py-1.5 rounded-xl border-2 border-slate-100 bg-slate-50 text-[10px] font-black uppercase text-slate-700 shadow-sm">{u.role}</span></td>
                    <td className="px-10 py-6 text-right">
                      <div className="inline-flex items-center gap-3 px-4 py-1.5 rounded-full border-2 border-slate-100 bg-slate-50 group-hover:bg-white transition-colors">
                        <div className={cn("h-1.5 w-1.5 rounded-full", u.status === 'Active' ? "bg-emerald-500 animate-pulse" : "bg-rose-500")} />
                        <span className={cn("text-[9px] uppercase font-black tracking-widest", u.status === 'Active' ? "text-emerald-700" : "text-rose-700")}>{u.status}</span>
                      </div>
                    </td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
        </div>

        {/* Registry Options */}
        <div className="w-80 flex flex-col gap-8 shrink-0">
          <div className="p-8 rounded-[2.5rem] bg-white border-2 border-slate-100 shadow-xl space-y-8">
            <div className="flex flex-col gap-1.5">
              <span className="text-[10px] font-black text-slate-300 uppercase tracking-[0.2em]">Active Profile</span>
              <h4 className="text-lg font-black text-slate-900 tracking-tight italic uppercase underline decoration-accent decoration-4 underline-offset-4">Abhishek Sharma</h4>
            </div>
            <div className="space-y-4">
              <RegistryAction label="Secure Profile Sync" sub="Enforce 2FA Protocols" icon={<Fingerprint size={16} />} />
              <RegistryAction label="Audit My Action Log" sub="View Personnel History" icon={<History size={16} />} />
              <RegistryAction label="Registry Keys" sub="Manage Token Access" icon={<Key size={16} />} />
            </div>
            <div className="pt-4 h-px bg-slate-50" />
            <button className="w-full py-4 rounded-2xl bg-rose-50 text-rose-500 border border-rose-100 font-black text-[10px] uppercase tracking-widest hover:bg-rose-500 hover:text-white transition-all shadow-sm">Emergency Revoke Access</button>
          </div>

          <div className="p-8 rounded-[2.5rem] bg-[#232f3e] text-white shadow-2xl relative overflow-hidden group border border-white/5">
            <div className="relative z-10 space-y-6">
              <ShieldCheck size={32} className="text-blue-400" />
              <div className="space-y-2">
                <h5 className="font-black text-sm uppercase italic tracking-widest">Protocol Guard</h5>
                <p className="text-slate-400 text-[10px] font-bold leading-relaxed">System-wide encryption is active. You are currently operating with **Level 9** administrative clearance.</p>
              </div>
            </div>
            <div className="absolute -bottom-10 -right-10 w-32 h-32 bg-blue-500/10 rounded-full blur-3xl group-hover:scale-150 transition-transform duration-1000" />
          </div>
        </div>
      </div>
    </div>
  )
}

function RegistryAction({ label, sub, icon }: any) {
  return (
    <div className="p-5 rounded-2xl border-2 border-slate-50 hover:border-accent hover:bg-slate-50 transition-all group flex items-center gap-4 cursor-pointer active:scale-95 shadow-sm">
      <div className="p-3 rounded-xl bg-slate-100 text-slate-400 group-hover:bg-slate-900 group-hover:text-white transition-all">{icon}</div>
      <div className="flex flex-col">
        <span className="text-[11px] font-black text-slate-900 uppercase tracking-tight">{label}</span>
        <span className="text-[9px] font-bold text-slate-400 uppercase tracking-widest opacity-60 transition-all group-hover:opacity-100 group-hover:text-accent ">{sub}</span>
      </div>
    </div>
  )
}

function UserStatCard({ icon, label, value }: any) {
  return (
    <div className="bg-white p-6 rounded-[1.8rem] border border-slate-100 shadow-sm flex items-center justify-between group hover:shadow-xl transition-all">
      <div className="flex items-center gap-4">
        <div className="p-3 rounded-xl bg-slate-50 text-slate-400 group-hover:text-accent transition-colors">{icon}</div>
        <div className="flex flex-col">
          <span className="text-[9px] font-black text-slate-400 uppercase tracking-[0.2em]">{label}</span>
          <span className="text-xl font-black text-slate-900 italic tracking-tighter uppercase">{value}</span>
        </div>
      </div>
    </div>
  )
}

function ReportCard({ title, value, icon, detail }: any) {
  return (
    <div className="bg-white p-10 rounded-[2.5rem] border border-slate-100 shadow-lg flex flex-col gap-6 group hover:border-accent transition-all duration-500">
      <div className="flex items-center justify-between">
        <div className="p-4 rounded-2xl bg-slate-50 text-slate-400 group-hover:bg-slate-900 group-hover:text-white transition-all">{icon}</div>
        <div className="h-2 w-2 rounded-full bg-emerald-500 shadow-[0_0_10px_rgba(16,185,129,0.5)]" />
      </div>
      <div className="space-y-1">
        <h4 className="text-[10px] font-black text-slate-400 uppercase tracking-widest">{title}</h4>
        <div className="text-3xl font-black text-slate-900 italic tracking-tighter uppercase">{value}</div>
      </div>
      <div className="h-px bg-slate-50" />
      <p className="text-[9px] font-black text-slate-400 uppercase tracking-widest leading-relaxed">{detail}</p>
    </div>
  )
}

function KPICard({ title, value, trend, icon, color, down }: any) {
  return (
    <div className="bg-white rounded-[2rem] p-8 shadow-lg border border-slate-100 flex flex-col gap-6 group hover:shadow-2xl transition-all duration-500 cursor-default">
      <div className="flex items-center justify-between">
        <div className="p-3 rounded-2xl bg-slate-50 text-slate-400 group-hover:bg-slate-900 group-hover:text-white transition-all duration-500">{icon}</div>
        <div className={cn("px-3 py-1 rounded-full text-[9px] font-black tracking-widest uppercase flex items-center gap-1.5", down ? "bg-rose-50 text-rose-600" : "bg-emerald-50 text-emerald-600")}>
          {down ? <TrendingDown size={10} /> : <TrendingUp size={10} />} {trend}
        </div>
      </div>
      <div>
        <h4 className="text-[10px] font-black uppercase tracking-widest text-slate-400 mb-1">{title}</h4>
        <div className={cn("text-3xl font-black italic tracking-tighter uppercase", color)}>{value}</div>
      </div>
    </div>
  )
}

function SidebarItem({ label, icon, active, onClick, secondary }: { label: string, icon?: React.ReactNode, active?: boolean, onClick?: () => void, secondary?: boolean }) {
  return (
    <div
      onClick={onClick}
      className={cn(
        "px-5 py-4 rounded-2xl text-[11px] font-black uppercase tracking-widest cursor-pointer transition-all flex items-center gap-4 border border-transparent group",
        active ? "bg-accent text-white shadow-[0_15px_30px_-5px_rgba(59,130,246,0.4)] border-white/10" : "text-slate-300 hover:text-white hover:bg-white/5 active:scale-95",
        secondary && "py-3 text-slate-600 opacity-40 hover:opacity-100"
      )}
    >
      <span className={cn("transition-colors", active ? "text-white" : "text-slate-400 group-hover:text-accent")}>{icon}</span>
      {label}
    </div>
  )
}

function FilterSelector({ label, value, options, onChange }: { label: string, value: string, options: string[], onChange: (v: string) => void }) {
  const [isOpen, setIsOpen] = useState(false);
  return (
    <div className="relative">
      <div onClick={() => setIsOpen(!isOpen)} className={cn("flex items-center gap-4 px-6 py-3 border-[2px] rounded-[1.2rem] shadow-sm cursor-pointer transition-all hover:bg-slate-50 select-none", value !== 'All' && value !== 'MoRD' ? "border-accent bg-accent/5 ring-8 ring-accent/5" : "bg-white border-slate-100", "relative z-[150]")}>
        <span className="text-[10px] font-black text-slate-300 uppercase tracking-[0.2em]">{label}</span>
        <span className="text-[10px] font-black text-slate-900 flex items-center gap-3 uppercase tracking-tighter">{value}<ChevronRight size={14} className={cn("text-slate-400 transition-transform duration-500", isOpen ? "rotate-90" : "")} /></span>
      </div>
      {isOpen && (<><div className="fixed inset-0 bg-black/[0.05] z-[9000]" onClick={() => setIsOpen(false)} /><div className="absolute top-full left-0 mt-4 w-60 bg-white border border-slate-200 rounded-[2.5rem] shadow-[0_50px_100px_-20px_rgba(0,0,0,0.4)] py-6 z-[9999] overflow-hidden ring-1 ring-black/10 animate-in slide-in-from-top-4 duration-300">{options.map(opt => (<div key={opt} onClick={() => { onChange(opt); setIsOpen(false); }} className={cn("px-8 py-4 text-[10px] font-black cursor-pointer transition-all uppercase tracking-[0.3em]", value === opt ? "bg-accent text-white" : "text-slate-500 hover:bg-slate-50 hover:text-slate-950 hover:pl-10")}>{opt}</div>))}</div></>)}
    </div>
  )
}

function SidebarDepartmentSelector({ value, options, onChange }: { value: string, options: string[], onChange: (v: string) => void }) {
  const [isOpen, setIsOpen] = useState(false);
  return (
    <div className="relative">
      <div onClick={() => setIsOpen(!isOpen)} className={cn("flex items-center justify-between px-8 py-6 border-2 rounded-[2rem] bg-slate-50 border-slate-100 cursor-pointer transition-all hover:bg-slate-100 select-none shadow-inner group", isOpen && "ring-8 ring-accent/5 border-accent")}>
        <div className="flex flex-col gap-1"><span className="text-[12px] font-black text-slate-900">{value}</span></div>
        <ChevronRight size={18} className={cn("text-slate-300 transition-transform duration-500 group-hover:text-accent", isOpen ? "rotate-90" : "")} />
      </div>
      {isOpen && (<><div className="fixed inset-0 bg-black/[0.02] z-[50]" onClick={() => setIsOpen(false)} /><div className="absolute bottom-full left-0 mb-4 w-full bg-white border-2 border-slate-100 rounded-[2.5rem] shadow-[0_40px_100px_-20px_rgba(0,0,0,0.3)] py-6 z-[60] overflow-hidden animate-in slide-in-from-bottom-4 duration-300">{options.map(opt => (<div key={opt} onClick={() => { onChange(opt); setIsOpen(false); }} className={cn("px-8 py-4 text-[11px] font-bold cursor-pointer transition-all text-slate-600 hover:bg-slate-50 hover:text-accent hover:pl-12", value === opt && "bg-accent/5 text-accent font-black")}>{opt}</div>))}</div></>)}
    </div>
  )
}

function ActionBtn({ icon, label, color, onClick, active }: { icon: React.ReactNode, label: string, color: string, onClick?: () => void, active?: boolean }) {
  return (
    <button onClick={onClick} className={cn("flex-1 flex flex-col items-center justify-center gap-4 py-8 rounded-[2.8rem] border-2 font-black text-[11px] uppercase tracking-[0.2em] transition-all active:scale-90 shadow-lg", active ? "ring-[10px] ring-offset-2 ring-accent/10 border-accent bg-accent/5" : "hover:scale-105 border-slate-50 bg-white", color)}>
      <div className="transition-transform duration-500 group-hover:rotate-12">{icon}</div>{label}
    </button>
  )
}

function DashboardView({ complaints, processedIds, onSelect }: any) {
  const [isMounted, setIsMounted] = useState(false);
  useEffect(() => { setIsMounted(true); }, []);

  const criticalHigh = useMemo(() => complaints.filter((c: any) => (c.priority === 'Critical' || c.priority === 'High') && !processedIds.has(c.id)).slice(0, 5), [complaints, processedIds]);

  const areaData = [
    { day: 'Mon', value: 12 }, { day: 'Tue', value: 19 }, { day: 'Wed', value: 15 },
    { day: 'Thu', value: 22 }, { day: 'Fri', value: 30 }, { day: 'Sat', value: 25 }, { day: 'Sun', value: processedIds.size + 20 }
  ];

  return (
    <div className="flex-1 overflow-y-auto bg-[#f8fafc] p-10 space-y-10 animate-in fade-in zoom-in duration-500">
      {/* Top Level KPIs */}
      <div className="grid grid-cols-3 gap-8">
        <KPICard title="Operational Payload" value={complaints.length} trend="+12%" icon={<Database size={20} />} color="text-slate-900" />
        <KPICard title="High Alert Signal" value={complaints.filter((c: any) => c.priority === 'Critical').length} trend="Active" icon={<ShieldAlert size={20} />} color="text-rose-600" />
        <KPICard title="Resolution Health" value="98.4%" trend="Stable" icon={<ShieldCheck size={20} />} color="text-emerald-600" />
      </div>

      <div className="grid grid-cols-12 gap-8">
        {/* Primary Chart */}
        <div className="col-span-12 xl:col-span-7 bg-white rounded-[3rem] p-10 shadow-xl border border-slate-100 flex flex-col gap-8 relative overflow-hidden group">
          <div className="flex items-center justify-between relative z-10">
            <div><h3 className="text-[10px] font-black uppercase tracking-[0.2em] text-slate-400">Tactical Telemetry</h3><p className="text-2xl font-black text-slate-900 tracking-tighter italic uppercase">Problem Per Day</p></div>
            <div className="px-4 py-2 bg-blue-50 text-blue-600 rounded-xl text-[10px] font-black uppercase tracking-widest border border-blue-100">Live Stream</div>
          </div>
          <div className="h-[280px] w-full min-h-0">
            {isMounted && (
              <ResponsiveContainer width="100%" height="100%">
                <AreaChart data={areaData}>
                  <defs>
                    <linearGradient id="colorDash" x1="0" y1="0" x2="0" y2="1">
                      <stop offset="5%" stopColor="#3b82f6" stopOpacity={0.2} />
                      <stop offset="95%" stopColor="#3b82f6" stopOpacity={0} />
                    </linearGradient>
                  </defs>
                  <CartesianGrid strokeDasharray="3 3" vertical={false} stroke="#f1f5f9" />
                  <XAxis dataKey="day" axisLine={false} tickLine={false} tick={{ fontSize: 10, fontWeight: 900, fill: '#94a3b8' }} dy={10} />
                  <YAxis hide />
                  <Tooltip contentStyle={{ borderRadius: '1.5rem', border: 'none', boxShadow: '0 25px 50px -12px rgba(0,0,0,0.15)', fontSize: '10px', fontWeight: 900 }} />
                  <Area type="monotone" dataKey="value" stroke="#3b82f6" strokeWidth={4} fillOpacity={1} fill="url(#colorDash)" />
                </AreaChart>
              </ResponsiveContainer>
            )}
          </div>
        </div>

        {/* Tactical Grievances List */}
        <div className="col-span-12 xl:col-span-5 flex flex-col gap-8">
          <div className="flex items-center justify-between"><h3 className="text-[10px] font-black uppercase tracking-[0.2em] text-slate-400">Critical Response Queue</h3><span className="text-[9px] font-black px-3 py-1 bg-rose-50 text-rose-500 rounded-lg uppercase">Immediate Action Required</span></div>
          <div className="space-y-4">
            {criticalHigh.map((c: any) => (
              <div key={c.id} onClick={() => onSelect(c.id)} className="bg-white p-6 rounded-[2rem] shadow-lg border border-slate-100 flex items-center justify-between group hover:border-accent hover:-translate-y-1 transition-all cursor-pointer">
                <div className="flex items-center gap-6">
                  <div className={cn("h-12 w-1.5 rounded-full", c.priority === 'Critical' ? "bg-rose-500" : "bg-amber-500")} />
                  <div>
                    <h4 className="text-[11px] font-black text-blue-600 uppercase tracking-tighter">{c.id}</h4>
                    <p className="text-[13px] font-bold text-slate-900 line-clamp-1 max-w-[200px]">{c.subject}</p>
                  </div>
                </div>
                <div className="flex items-center gap-4">
                  <div className="text-right flex flex-col">
                    <span className="text-[9px] font-black text-slate-300 uppercase">{c.status}</span>
                    <span className="text-[10px] font-bold text-slate-500 uppercase">{c.dateFiled}</span>
                  </div>
                  <ChevronRight size={16} className="text-slate-200 group-hover:text-accent transition-colors" />
                </div>
              </div>
            ))}
            {criticalHigh.length === 0 && (
              <div className="py-20 text-center bg-white rounded-[2.5rem] border border-dashed border-slate-200"><p className="text-sm font-black text-slate-300 uppercase tracking-[0.3em]">No Critical Threats</p></div>
            )}
            <button onClick={() => onSelect(null)} className="w-full py-5 rounded-[1.8rem] bg-slate-900 text-white text-[10px] font-black uppercase tracking-[0.2em] shadow-xl hover:bg-black transition-all flex items-center justify-center gap-3">Enter Operations Feed <ArrowUpRight size={14} /></button>
          </div>
        </div>
      </div>
    </div>
  )
}

function ViewModule({ title, icon }: { title: string, icon: React.ReactNode }) {
  return (
    <div className="flex-1 flex flex-col items-center justify-center bg-[#f8fafc] p-20 text-center animate-in fade-in zoom-in duration-700">
      <div className="p-20 rounded-[5rem] bg-white shadow-[0_50px_150px_-30px_rgba(0,0,0,0.15)] border border-slate-100 flex flex-col items-center gap-12 max-w-xl relative overflow-hidden group">
        <div className="absolute top-0 left-0 w-full h-3 bg-accent opacity-30 shadow-2xl" />
        <div className="p-10 rounded-[3rem] bg-slate-950 text-white shadow-[0_30px_60px_-15px_rgba(0,0,0,0.5)] transition-all duration-700 group-hover:scale-110 group-hover:rotate-6">{icon}</div>
        <div className="space-y-8">
          <h3 className="text-4xl font-black text-slate-950 uppercase italic tracking-tighter">{title}</h3>
          <div className="h-2 w-16 bg-accent mx-auto rounded-full shadow-[0_0_20px_rgba(59,130,246,0.5)]" />
          <p className="text-slate-400 font-bold text-base leading-relaxed max-w-sm mx-auto">This executive module is currently undergoing security clearance and high-speed data synchronization with the CPGRAMS central cluster. Awaiting protocol handshake.</p>
        </div>
        <div className="flex items-center gap-4 bg-slate-50 px-8 py-4 rounded-full border border-slate-100 shadow-inner">
          <div className="h-3 w-3 rounded-full bg-emerald-500 animate-pulse shadow-[0_0_10px_rgba(16,185,129,0.5)]" /><span className="text-[11px] font-black text-slate-500 uppercase tracking-[0.3em]">Module Online / Encrypted</span>
        </div>
        <div className="absolute -bottom-10 -right-10 w-40 h-40 bg-accent/5 rounded-full blur-3xl" />
      </div>
    </div>
  )
}
