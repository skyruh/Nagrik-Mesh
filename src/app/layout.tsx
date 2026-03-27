import type { Metadata } from "next";
import { Inter } from "next/font/google";
import "./globals.css";
import { clsx, type ClassValue } from "clsx";
import { twMerge } from "tailwind-merge";

const inter = Inter({ subsets: ["latin"], variable: "--font-inter" });

export function cn(...inputs: ClassValue[]) {
  return twMerge(clsx(inputs));
}

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
    <html lang="en" className="dark">
      <body className={cn(inter.variable, "antialiased font-sans flex min-h-screen bg-background")}>
        {/* Sidebar Shell */}
        <aside className="w-64 border-r border-border glass-panel hidden md:flex flex-col p-6 z-10">
          <div className="flex items-center gap-3 mb-10">
            <div className="h-8 w-8 rounded-lg bg-accent flex items-center justify-center text-white font-bold">N</div>
            <h1 className="text-xl font-bold tracking-tight">Nagrik Mesh</h1>
          </div>

          <nav className="flex-1 space-y-2">
            <div className="text-xs font-semibold text-low uppercase tracking-wider mb-2 px-2">Main Menu</div>
            <div className="p-2 rounded-lg bg-accent/10 text-accent font-medium cursor-pointer">Dashboard</div>
            <div className="p-2 rounded-lg hover:bg-white/5 cursor-pointer text-low transition-colors">Reports</div>
            <div className="p-2 rounded-lg hover:bg-white/5 cursor-pointer text-low transition-colors">Knowledge Base</div>
          </nav>

          <div className="mt-auto pt-6 border-t border-border">
            <div className="flex items-center gap-3">
              <div className="h-10 w-10 rounded-full bg-slate-800 border border-border" />
              <div>
                <p className="text-sm font-medium">Gov Officer</p>
                <p className="text-xs text-low text-balance">Department of Public Grievance</p>
              </div>
            </div>
          </div>
        </aside>

        <main className="flex-1 overflow-y-auto">
          {children}
        </main>
      </body>
    </html>
  );
}
