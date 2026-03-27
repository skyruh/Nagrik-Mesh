'use client';

import React, { useState, useEffect } from 'react';
import {
  AlertCircle,
  CheckCircle2,
  ChevronLeft,
  ChevronRight,
  Filter,
  Search,
  ShieldAlert,
  Sparkles,
  X,
  XCircle,
  Edit2,
  Share2,
  Check
} from 'lucide-react';
import { MOCK_COMPLAINTS } from '../lib/mock-data';
import { getProcessedComplaints } from '../lib/engine';
import { ExtendedComplaint, PriorityLevel } from '../types/schema';
import { cn } from '../lib/utils';

export default function Dashboard() {
  const [complaints, setComplaints] = useState<ExtendedComplaint[]>([]);
  const [selectedId, setSelectedId] = useState<string | null>('CPG-2023-A01'); // Default select first
  const [filter, setFilter] = useState<PriorityLevel | 'All'>('All');

  useEffect(() => {
    const processed = getProcessedComplaints(MOCK_COMPLAINTS as any);
    setComplaints(processed);
  }, []);

  const selectedComplaint = complaints.find(c => c.id === selectedId);

  const filteredComplaints = filter === 'All'
    ? complaints
    : complaints.filter(c => c.priority === filter);

  return (
    <div className="flex flex-col h-full bg-[#f8fafc]/50">
      {/* Horizontal Stats Strip matching Image 1 */}
      <div className="px-8 py-4 flex items-center justify-between border-b border-slate-200 bg-white shadow-sm">
        <div className="flex items-center gap-6">
          <div className="flex items-center gap-2">
            <h1 className="font-bold text-lg text-slate-800 tracking-tight">Priority Queue</h1>
            <span className="px-2 py-0.5 rounded-full bg-slate-100 text-slate-500 text-[10px] font-bold tracking-wide">328 active</span>
          </div>

          <div className="flex items-center gap-4">
            <FilterSelector label="Status" value="All" />
            <FilterSelector label="Priority" value="High/Crit" />
            <FilterSelector label="Dept" value="All" />
            <FilterSelector label="Date" value="Oct 2023" />
          </div>
        </div>

        <div className="flex items-center gap-6">
          <div className="flex flex-col gap-1 w-32">
            <div className="flex items-center justify-between">
              <span className="text-[9px] font-bold text-slate-400 uppercase tracking-tighter flex items-center gap-1"><Check size={8} /> Status Bars</span>
            </div>
            <div className="status-bar"><div className="status-bar-fill w-[70%]" /></div>
          </div>
          <div className="relative">
            <div className="absolute left-3 top-1/2 -translate-y-1/2 text-slate-400"><Search size={14} /></div>
            <input
              type="text"
              placeholder="Search"
              className="bg-slate-50 border border-slate-200 rounded-lg pl-9 pr-4 py-1.5 text-xs w-48 focus:ring-1 focus:ring-accent outline-none"
            />
          </div>
        </div>
      </div>

      <div className="flex-1 flex overflow-hidden">
        {/* Main Table section */}
        <div className="flex-1 overflow-auto p-4">
          <div className="bg-white rounded-xl shadow-sm border border-slate-200 overflow-hidden">
            <table className="w-full text-left border-collapse text-[11px]">
              <thead>
                <tr className="bg-slate-50 border-b border-slate-200">
                  <th className="px-4 py-3 font-bold text-slate-500">Grievance ID</th>
                  <th className="px-4 py-3 font-bold text-slate-500">Date Filed</th>
                  <th className="px-4 py-3 font-bold text-slate-500">Citizen Name</th>
                  <th className="px-4 py-3 font-bold text-slate-500">Dept/Ministry</th>
                  <th className="px-4 py-3 font-bold text-slate-500 text-balance">Subject</th>
                  <th className="px-4 py-3 font-bold text-slate-500">Priority</th>
                  <th className="px-4 py-3 font-bold text-slate-500">Status</th>
                  <th className="px-4 py-3 font-bold text-slate-500">Last Action</th>
                </tr>
              </thead>
              <tbody className="divide-y divide-slate-200/50">
                {filteredComplaints.map((c) => (
                  <tr
                    key={c.id}
                    onClick={() => setSelectedId(c.id)}
                    className={cn(
                      "cursor-pointer transition-all duration-200 hover:brightness-95",
                      selectedId === c.id ? "ring-2 ring-accent ring-inset" : "",
                      c.priority === 'Critical' ? "table-row-critical" :
                        c.priority === 'High' ? "table-row-high" :
                          c.priority === 'Moderate' ? "table-row-moderate" :
                            "table-row-low"
                    )}
                  >
                    <td className="px-4 py-3 font-bold text-accent">{c.id}</td>
                    <td className="px-4 py-3 text-slate-600">{c.dateFiled}</td>
                    <td className="px-4 py-3 text-slate-800 font-medium">{c.citizenName}</td>
                    <td className="px-4 py-3 text-slate-800 font-medium">{c.department}</td>
                    <td className="px-4 py-3 text-slate-700 font-medium line-clamp-1">{c.subject}</td>
                    <td className="px-4 py-3">
                      <span className={cn(
                        "px-2 py-0.5 rounded text-[9px] font-bold text-white flex items-center gap-1.5 w-fit",
                        c.priority === 'Critical' ? "bg-[#e11d48]" :
                          c.priority === 'High' ? "bg-amber-500" :
                            c.priority === 'Moderate' ? "bg-amber-400 shadow-sm" :
                              "bg-slate-400"
                      )}>
                        {c.priority}
                        {c.priority === 'Critical' && <span className="bg-black/20 px-1 rounded-sm">4</span>}
                        {c.priority === 'High' && <span className="bg-black/20 px-1 rounded-sm">6</span>}
                      </span>
                    </td>
                    <td className="px-4 py-3 font-medium">{c.status}</td>
                    <td className="px-4 py-3 text-slate-600 font-medium italic">{c.lastAction}</td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>

          {/* Pagination placeholder matching Image 1 */}
          <div className="mt-4 flex items-center justify-center gap-4 text-[10px] font-bold text-slate-400 uppercase tracking-widest">
            <ChevronLeft size={16} />
            <div className="h-6 w-6 flex items-center justify-center rounded-lg bg-white border border-slate-200 text-slate-800 shadow-sm">1</div>
            <ChevronRight size={16} />
          </div>
        </div>

        {/* Sidebar Analysis matching Image 1 */}
        <div className="w-[380px] bg-white border-l border-slate-200 overflow-y-auto p-6 flex flex-col gap-6 scroll">
          {selectedComplaint ? (
            <>
              <div className="flex items-center justify-between">
                <h3 className="font-bold text-base text-slate-800">Grievance Analysis</h3>
                <X size={18} className="text-slate-400 cursor-pointer" />
              </div>

              <div className="analysis-mesh p-6 rounded-2xl relative shadow-lg overflow-hidden border border-white/20">
                <div className="relative z-10 text-white">
                  <h4 className="text-xs font-bold uppercase tracking-widest opacity-80 mb-6">Grievance Details</h4>

                  <div className="grid grid-cols-[80px_1fr] gap-y-3 text-[11px] items-start">
                    <span className="font-bold opacity-70">ID</span>
                    <span className="font-mono font-bold tracking-wider">{selectedComplaint.id}</span>

                    <span className="font-bold opacity-70">Subject</span>
                    <span className="font-bold text-sm leading-tight">{selectedComplaint.subject}</span>

                    <span className="font-bold opacity-70 text-nowrap">Submitted</span>
                    <span className="font-bold">{selectedComplaint.dateFiled}</span>
                  </div>

                  <div className="mt-6">
                    <p className="font-bold opacity-70 text-[11px] mb-2 uppercase">Description</p>
                    <p className="text-[11px] leading-relaxed font-bold line-clamp-3">
                      {selectedComplaint.description}
                    </p>
                  </div>
                </div>
              </div>

              {/* AI Insights Card */}
              <div className="space-y-4">
                <div className="p-5 rounded-2xl bg-slate-50 border border-slate-200 shadow-sm">
                  <div className="flex items-center gap-2 mb-4">
                    <Sparkles size={16} className="text-purple-600" />
                    <h4 className="text-[11px] font-black uppercase tracking-wider text-slate-800">AI-Powered Analysis</h4>
                  </div>

                  <div className="space-y-4">
                    <div>
                      <p className="text-[10px] font-bold text-slate-500 uppercase mb-1">Key Insights</p>
                      <ul className="text-[11px] text-slate-700 font-bold space-y-1 list-disc pl-4 leading-normal">
                        <li>{selectedComplaint.aiAnalysis.rootCause}</li>
                        <li>Automation identified probable fake closure in neighboring ward</li>
                      </ul>
                    </div>

                    <div className="grid grid-cols-2 gap-4">
                      <div>
                        <p className="text-[10px] font-bold text-slate-500 uppercase mb-1">Sentiment</p>
                        <p className="text-[11px] font-bold text-rose-600">{selectedComplaint.aiAnalysis.sentiment}</p>
                      </div>
                      <div>
                        <p className="text-[10px] font-bold text-slate-500 uppercase mb-1">Key Entities</p>
                        <p className="text-[11px] font-bold text-slate-800 truncate">{selectedComplaint.department}, District, Admin...</p>
                      </div>
                    </div>

                    <div className="pt-3 border-t border-slate-200">
                      <div className="flex items-center justify-between mb-2">
                        <p className="text-[10px] font-bold text-slate-800 uppercase tracking-wide">Suspicion Flags</p>
                        <span className="text-[10px] font-bold text-slate-400 uppercase tracking-widest">{selectedComplaint.suspicionFlags.length} Flags</span>
                      </div>
                      <div className="flex gap-2 flex-wrap">
                        {selectedComplaint.suspicionFlags.map((f, i) => (
                          <div key={i} className="flex-1 p-2 rounded-lg bg-amber-50 border border-amber-200">
                            <p className="text-[9px] font-black text-amber-700 uppercase mb-1">{f.severity}</p>
                            <ul className="text-[9px] font-black text-slate-700 space-y-1 leading-tight list-disc pl-3">
                              <li>{f.type}</li>
                              <li>{f.reason}</li>
                            </ul>
                          </div>
                        ))}
                      </div>
                    </div>
                  </div>
                </div>

                {/* Actions Panel */}
                <div className="space-y-4">
                  <h4 className="text-[11px] font-black tracking-widest text-slate-800 uppercase">Action Interface</h4>
                  <div className="grid grid-cols-3 gap-3">
                    <ActionButton icon={<CheckCircle2 size={16} />} label="Accept" color="bg-emerald-50 text-emerald-600 border-emerald-200" />
                    <ActionButton icon={<Edit2 size={16} />} label="Modify" color="bg-yellow-50 text-yellow-600 border-yellow-200" />
                    <ActionButton icon={<XCircle size={16} />} label="Reject" color="bg-rose-50 text-rose-600 border-rose-200" />
                  </div>

                  <div className="space-y-3">
                    <div>
                      <p className="text-[10px] font-bold text-slate-500 uppercase mb-1.5 tracking-tight">Forward to Department</p>
                      <select className="w-full text-[11px] font-bold p-2.5 rounded-xl border border-slate-200 bg-slate-50 outline-none shadow-sm h-10">
                        <option>{selectedComplaint.department}, Admin</option>
                        <option>Chief Engineer's Office</option>
                        <option>Local Ward Authority</option>
                      </select>
                    </div>
                    <div>
                      <p className="text-[10px] font-bold text-slate-500 uppercase mb-1.5 tracking-tight">Add Comments</p>
                      <textarea
                        placeholder="Add Internal Note..."
                        className="w-full text-[11px] font-bold p-3 rounded-xl border border-slate-200 bg-slate-50 outline-none h-20 resize-none shadow-sm"
                      />
                    </div>
                  </div>
                </div>
              </div>
            </>
          ) : (
            <div className="flex-1 flex flex-col items-center justify-center text-center p-12 opacity-50">
              <AlertCircle size={48} className="text-slate-300 mb-4" />
              <p className="text-slate-500 text-sm font-medium">Select a grievance to view <br />AI analysis and resolution paths.</p>
            </div>
          )}
        </div>
      </div>
    </div>
  );
}

function FilterSelector({ label, value }: { label: string, value: string }) {
  return (
    <div className="flex items-center gap-1.5 px-3 py-1 bg-white border border-slate-200 rounded-lg shadow-sm cursor-pointer hover:bg-slate-50 transition-colors">
      <span className="text-[10px] font-bold text-slate-400 capitalize">{label}</span>
      <span className="text-[10px] font-black text-slate-800">{value}</span>
      <ChevronRight size={12} className="text-slate-400 rotate-90 ml-1" />
    </div>
  )
}

function ActionButton({ icon, label, color }: { icon: React.ReactNode, label: string, color: string }) {
  return (
    <button className={cn(
      "flex flex-col items-center justify-center gap-1 py-3 rounded-xl border font-black text-[10px] uppercase tracking-tighter transition-all active:scale-95 shadow-sm",
      color
    )}>
      {icon}
      {label}
    </button>
  )
}
