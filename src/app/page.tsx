'use client';

import React, { useState, useEffect } from 'react';
import { AlertCircle, CheckCircle2, ChevronRight, Filter, Search, ShieldAlert, Sparkles, XCircle } from 'lucide-react';
import { MOCK_COMPLAINTS } from '../lib/mock-data';
import { getProcessedComplaints } from '../lib/engine';
import { Complaint, PriorityLevel } from '../types/schema';

export default function Dashboard() {
  const [complaints, setComplaints] = useState<Complaint[]>([]);
  const [selectedId, setSelectedId] = useState<string | null>(null);
  const [filter, setFilter] = useState<PriorityLevel | 'All'>('All');

  useEffect(() => {
    // Process mock complaints through logic engine
    const processed = getProcessedComplaints(MOCK_COMPLAINTS as any);
    setComplaints(processed);
  }, []);

  const selectedComplaint = complaints.find(c => c.id === selectedId);

  const filteredComplaints = filter === 'All'
    ? complaints
    : complaints.filter(c => c.priority === filter);

  return (
    <div className="p-8 max-w-7xl mx-auto animate-in flex gap-8">
      <div className="flex-1">
        {/* Header */}
        <header className="mb-8 flex items-center justify-between">
          <div>
            <h2 className="text-3xl font-bold tracking-tight">Intelligence Dashboard</h2>
            <p className="text-low mt-1">Automated decision-support for grievance redressal.</p>
          </div>

          <div className="flex items-center gap-3">
            <div className="flex items-center gap-2 glass-panel px-4 py-2 rounded-xl">
              <Search size={18} className="text-low" />
              <input
                type="text"
                placeholder="Search complaints..."
                className="bg-transparent border-none outline-none text-sm w-48"
              />
            </div>
            <button className="glass-panel p-2 rounded-xl hover:bg-white/5 transition-colors">
              <Filter size={20} className="text-low" />
            </button>
          </div>
        </header>

        {/* Priority Tabs */}
        <div className="flex gap-4 mb-6">
          {['All', 'Critical', 'High', 'Moderate'].map((p) => (
            <button
              key={p}
              onClick={() => setFilter(p as any)}
              className={`px-4 py-2 rounded-xl text-sm font-medium transition-all ${filter === p
                  ? 'bg-accent text-white shadow-lg shadow-accent/20'
                  : 'glass-panel text-low hover:bg-white/5'
                }`}
            >
              {p}
              {p !== 'All' && ` (${complaints.filter(c => c.priority === p).length})`}
            </button>
          ))}
        </div>

        {/* Complaints Table */}
        <div className="glass-panel rounded-2xl overflow-hidden overflow-x-auto">
          <table className="w-full text-left border-collapse min-w-[800px]">
            <thead>
              <tr className="border-b border-border/50 bg-slate-400/5">
                <th className="px-6 py-4 text-xs font-semibold text-low uppercase tracking-wider">ID & Priority</th>
                <th className="px-6 py-4 text-xs font-semibold text-low uppercase tracking-wider">Issue</th>
                <th className="px-6 py-4 text-xs font-semibold text-low uppercase tracking-wider">Ward & Location</th>
                <th className="px-6 py-4 text-xs font-semibold text-low uppercase tracking-wider">Flags</th>
                <th className="px-6 py-4 text-xs font-semibold text-low uppercase tracking-wider">Action</th>
              </tr>
            </thead>
            <tbody className="divide-y divide-border/30">
              {filteredComplaints.map((c) => (
                <tr
                  key={c.id}
                  onClick={() => setSelectedId(c.id)}
                  className={`hover:bg-accent/5 cursor-pointer transition-colors ${selectedId === c.id ? 'bg-accent/10' : ''}`}
                >
                  <td className="px-6 py-4">
                    <div className="flex items-center gap-3">
                      <span className={`h-2 w-2 rounded-full ${c.priority === 'Critical' ? 'bg-critical shadow-[0_0_8px_rgba(239,68,68,0.5)]' :
                          c.priority === 'High' ? 'bg-high' :
                            c.priority === 'Moderate' ? 'bg-moderate' : 'bg-low'
                        }`} />
                      <div>
                        <p className="font-mono text-xs font-bold text-low">{c.id}</p>
                        <p className={`text-xs font-semibold mt-0.5 ${c.priority === 'Critical' ? 'text-critical' :
                            c.priority === 'High' ? 'text-high' :
                              c.priority === 'Moderate' ? 'text-moderate' : 'text-low'
                          }`}>{c.priority}</p>
                      </div>
                    </div>
                  </td>
                  <td className="px-6 py-4">
                    <p className="font-medium text-sm line-clamp-1">{c.description}</p>
                    <p className="text-[10px] text-low uppercase font-bold mt-0.5">{c.category}</p>
                  </td>
                  <td className="px-6 py-4">
                    <p className="text-sm">{c.ward}</p>
                    <p className="text-xs text-low">{c.location}</p>
                  </td>
                  <td className="px-6 py-4">
                    {c.suspicionFlags.length > 0 ? (
                      <div className="flex items-center gap-1.5 px-2 py-1 rounded-lg bg-critical/10 text-critical border border-critical/20 max-w-fit">
                        <ShieldAlert size={14} />
                        <span className="text-[10px] font-bold uppercase tracking-tight">Suspected</span>
                      </div>
                    ) : (
                      <span className="text-xs text-low/50">—</span>
                    )}
                  </td>
                  <td className="px-6 py-4 text-right">
                    <ChevronRight size={18} className="text-low/30 inline" />
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
      </div>

      {/* Detail Pane */}
      <aside className={`w-[400px] flex flex-col gap-6 animate-in transition-all duration-300 ${!selectedId ? 'opacity-0 pointer-events-none' : 'opacity-100'}`}>
        {selectedComplaint ? (
          <>
            <div className="glass-panel p-6 rounded-2xl border-l-4 border-l-accent">
              <div className="flex items-center justify-between mb-4">
                <span className="text-[10px] font-bold uppercase tracking-widest text-low">Intelligence Insight</span>
                <Sparkles size={16} className="text-accent animate-pulse" />
              </div>
              <h3 className="font-bold text-lg mb-2">Problem Analysis</h3>
              <p className="text-sm text-low mb-4 ring-1 ring-border p-3 rounded-lg bg-slate-500/5 italic leading-relaxed">
                "{selectedComplaint.description}"
              </p>

              <div className="space-y-4">
                <div className="p-3 rounded-xl bg-accent/5 border border-accent/20">
                  <p className="text-xs font-bold text-accent uppercase mb-1">Suggested Resolution</p>
                  <p className="text-sm font-medium">{selectedComplaint.suggestedSolution}</p>
                  {selectedComplaint.historicalSolutionApplied && (
                    <div className="flex items-center gap-1 mt-2 text-[10px] text-emerald-500 font-bold uppercase tracking-tight">
                      <CheckCircle2 size={12} /> Applied from History
                    </div>
                  )}
                </div>

                {selectedComplaint.suspicionFlags.map((f, i) => (
                  <div key={i} className="p-3 rounded-xl bg-critical/5 border border-critical/20">
                    <div className="flex items-center gap-2 text-critical mb-1">
                      <ShieldAlert size={14} />
                      <p className="text-xs font-bold uppercase">{f.type}</p>
                    </div>
                    <p className="text-sm text-low leading-normal">{f.reason}</p>
                  </div>
                ))}
              </div>
            </div>

            <div className="glass-panel p-6 rounded-2xl">
              <h4 className="text-xs font-bold text-low uppercase tracking-widest mb-4">Officer Action</h4>
              <div className="flex flex-col gap-3">
                <button className="flex items-center justify-center gap-2 w-full py-3 bg-accent text-white rounded-xl font-bold hover:brightness-110 active:scale-[0.98] transition-all">
                  <CheckCircle2 size={20} /> Approve Solution
                </button>
                <button className="flex items-center justify-center gap-2 w-full py-3 border border-border rounded-xl font-bold hover:bg-white/5 active:scale-[0.98] transition-all">
                  Modify Suggestion
                </button>
                <button className="flex items-center justify-center gap-2 w-full py-3 text-critical border border-critical/10 hover:bg-critical/10 rounded-xl font-bold active:scale-[0.98] transition-all">
                  <XCircle size={20} /> Reject & Log Failure
                </button>
              </div>
            </div>
          </>
        ) : (
          <div className="flex-1 flex flex-col items-center justify-center text-center p-12 glass-panel rounded-2xl opacity-50">
            <AlertCircle size={48} className="text-low mb-4" />
            <p className="text-low font-medium">Select a grievance to view <br />AI analysis and resolution paths.</p>
          </div>
        )}
      </aside>
    </div>
  );
}
