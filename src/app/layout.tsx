import type { Metadata } from "next";
import { Inter } from "next/font/google";
import "./globals.css";
import { cn } from "../lib/utils";

const inter = Inter({ subsets: ["latin"], variable: "--font-inter" });

export const metadata: Metadata = {
  title: "Nagrik Mesh | AI Execution Layer",
  description: "Automated decision-support for CPGRAMS grievance redressal.",
};

export default function RootLayout({
  children,
}: Readonly<{
  children: React.ReactNode;
}>) {
  return (
    <html lang="en">
      <body className={cn(inter.variable, "antialiased font-sans flex min-h-screen bg-[#f3f4f6]")}>
        {/* Sidebar matching Image 1 */}
        <aside className="w-64 bg-[#232f3e] flex flex-col p-0 z-10 shadow-xl overflow-hidden shrink-0">
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
                <p className="text-[10px] text-slate-400 font-medium">Digital India Initiative</p>
              </div>
            </div>

            <nav className="space-y-1">
              <MenuItem label="Dashboard" active />
              <MenuItem label="My Queue" />
              <MenuItem label="All Grievances" />
              <MenuItem label="Analytics" />
              <MenuItem label="Reports" />
              <MenuItem label="User Management" />
            </nav>
          </div>

          <div className="mt-auto p-6 space-y-1 border-t border-white/5 bg-slate-900/20">
            <MenuItem label="Settings" secondary />
            <MenuItem label="Help" secondary />
          </div>
        </aside>

        <main className="flex-1 overflow-y-auto flex flex-col">
          {/* Top Bar matching Image 1 */}
          <header className="h-14 bg-white border-b border-slate-200 flex items-center justify-between px-8 shrink-0">
            <div className="flex items-center gap-2">
              <h2 className="text-slate-800 font-bold text-base">Grievance Redressal Dashboard</h2>
            </div>
            <div className="flex items-center gap-4">
              <div className="h-8 w-8 rounded-full bg-slate-100 flex items-center justify-center text-slate-500 border border-slate-200">
                <span className="text-[10px] font-bold">🔔</span>
              </div>
              <div className="flex items-center gap-3 pl-4 border-l border-slate-200">
                <div className="text-right">
                  <p className="text-xs font-bold text-slate-800">A. Sharma</p>
                  <p className="text-[10px] text-slate-400">Joint Secretary</p>
                </div>
                <div className="h-8 w-8 rounded-full shadow-sm bg-gradient-to-tr from-slate-200 to-slate-300" />
              </div>
            </div>
          </header>

          <div className="flex-1 overflow-auto bg-[#fafbfc]">
            {children}
          </div>
        </main>
      </body>
    </html>
  );
}

function MenuItem({ label, active, secondary }: { label: string; active?: boolean; secondary?: boolean }) {
  return (
    <div className={cn(
      "px-3 py-2.5 rounded-lg text-xs font-medium cursor-pointer transition-all flex items-center gap-3",
      active
        ? "bg-[#34445c] text-white shadow-sm shadow-black/20"
        : "text-slate-400 hover:text-white hover:bg-white/5",
      secondary && "text-slate-500 py-2"
    )}>
      {label}
    </div>
  )
}
