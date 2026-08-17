"use client";

import React from "react";
import { sound } from "../utils/audio";
import { VideoBackground } from "./ui/VideoBackground";
import { 
  Network, 
  Layers, 
  Bot, 
  FileSpreadsheet, 
  ArrowRight, 
  ShieldCheck, 
  Activity, 
  Terminal, 
  Radio, 
  AlertTriangle, 
  FileText, 
  Scale, 
  Building2, 
  MapPin, 
  Mail, 
  Phone, 
  HelpCircle, 
  CheckCircle2,
  Cpu
} from "lucide-react";
import { Supplier, PlatformStat, User } from "../types";

interface LandingPageProps {
  onEnterWorkspace: (initialView?: "3D_SPACE" | "2D_TOPOLOGY" | "RISK_MATRIX") => void;
  onOpenCopilot: () => void;
  onOpenCsvModal: () => void;
  onOpenLogin: () => void;
  user: User | null;
  onOpenProfile?: () => void;
  theme: "dark" | "light";
  onToggleTheme: () => void;
  isMuted: boolean;
  onToggleSound: () => void;
  suppliers: Supplier[];
  stats: PlatformStat[];
  onOpenPrivacy?: () => void;
  onOpenTerms?: () => void;
  onOpenContact?: () => void;
  onTest404?: () => void;
}

export const LandingPage: React.FC<LandingPageProps> = ({
  onEnterWorkspace,
  onOpenCopilot,
  onOpenCsvModal,
  onOpenLogin,
  user,
  onOpenProfile,
  theme,
  onToggleTheme,
  isMuted,
  onToggleSound,
  suppliers,
  stats,
  onOpenPrivacy,
  onOpenTerms,
  onOpenContact,
  onTest404
}) => {
  const highRiskCount = suppliers.filter(s => s.score < 50).length;
  const avgScore = suppliers.length > 0 
    ? Math.round(suppliers.reduce((acc, s) => acc + s.score, 0) / suppliers.length) 
    : 78;

  const handleProtectedNavigate = (initialView?: "3D_SPACE" | "2D_TOPOLOGY" | "RISK_MATRIX") => {
    sound.playClick();
    if (!user) {
      onOpenLogin();
      return;
    }
    onEnterWorkspace(initialView);
  };

  return (
    <VideoBackground className="min-h-screen text-slate-900 dark:text-[#E2E8F0] transition-colors duration-200 flex flex-col font-body selection:bg-cyan-500 selection:text-slate-950">
      
      {/* SECTION 1: BIASED ASYMMETRIC HERO (WIDE LEFT MARGIN, NARROW RIGHT TELEMETRY) */}
      <section className="w-full border-b border-slate-200/80 dark:border-[#1A2232]/80 bg-[#FFFFFF]/85 dark:bg-[#0C0E15]/85 backdrop-blur-md py-12 lg:py-20">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          
          {/* Top Status Strip */}
          <div className="flex items-center gap-2 mb-8 text-xs font-mono">
            <span className="inline-flex items-center gap-1.5 px-2.5 py-1 rounded border border-cyan-500/30 bg-cyan-500/10 text-cyan-600 dark:text-cyan-400 font-bold uppercase tracking-wider">
              <span className="w-2 h-2 rounded-full bg-cyan-500 animate-pulse" />
              MSMED ACT 2006 // SEC 15 &amp; 16 ENFORCED
            </span>
            <span className="hidden sm:inline text-slate-400 dark:text-slate-600">/</span>
            <span className="hidden sm:inline text-slate-500 dark:text-slate-400 font-mono">
              UDYAM DATA.GOV.IN REGISTRY SYNCHRONIZED
            </span>
          </div>

          {/* Asymmetric 8:4 Grid Layout (Wide Left Intent, Dense Right Console) */}
          <div className="grid grid-cols-1 lg:grid-cols-12 gap-8 lg:gap-12 items-start">
            
            {/* Left Dominant Command Column (8 cols) */}
            <div className="lg:col-span-8 space-y-6">
              <h1 className="font-display font-extrabold text-3xl sm:text-5xl lg:text-6xl text-slate-950 dark:text-white leading-[1.05] tracking-tight">
                Systemic contagion defense for <span className="text-cyan-600 dark:text-cyan-400">multi-tier MSME</span> supply chains.
              </h1>

              <p className="text-base sm:text-lg text-slate-600 dark:text-[#8E9BAE] font-body leading-relaxed max-w-2xl font-normal">
                Audits multi-tier supplier defaults, liquidity freezes, and cascading supply line halts in an interactive 3D physics space. Evaluates compounding exposure via statutory Udyam verification and Section 15/16 interest liability algorithms.
              </p>

              {/* Direct Execution Action Cluster */}
              <div className="pt-2 flex flex-wrap items-center gap-3 font-mono">
                <button
                  id="landing-launch-command-btn"
                  onClick={() => handleProtectedNavigate("3D_SPACE")}
                  className="btn-command text-xs py-3 px-6"
                >
                  <Network className="w-4 h-4" />
                  <span>Launch 3D Knowledge Graph</span>
                  <ArrowRight className="w-4 h-4" />
                </button>

                <button
                  id="landing-ingest-csv-btn"
                  onClick={() => {
                    sound.playClick();
                    onOpenCsvModal();
                  }}
                  className="btn-command-secondary text-xs py-3 px-5"
                >
                  <FileSpreadsheet className="w-4 h-4 text-cyan-500" />
                  <span>Ingest Udyam CSV</span>
                </button>

                <button
                  id="landing-copilot-btn"
                  onClick={() => {
                    sound.playClick();
                    onOpenCopilot();
                  }}
                  className="btn-command-secondary text-xs py-3 px-5 text-cyan-600 dark:text-cyan-400"
                >
                  <Bot className="w-4 h-4" />
                  <span>Ask AI Copilot</span>
                </button>
              </div>

              {/* Statutory Metric Readout Ticker */}
              <div className="pt-6 border-t border-slate-200/80 dark:border-[#1A2232]/80 grid grid-cols-2 sm:grid-cols-3 gap-4 font-mono text-xs">
                <div>
                  <div className="text-slate-400 dark:text-slate-500 text-[10px] uppercase tracking-wider">Active MSME Nodes</div>
                  <div className="text-xl font-bold font-display text-slate-900 dark:text-white mt-0.5">
                    {suppliers.length} <span className="text-[10px] text-cyan-500 font-mono">VERIFIED</span>
                  </div>
                </div>

                <div>
                  <div className="text-slate-400 dark:text-slate-500 text-[10px] uppercase tracking-wider">Network Trust Index</div>
                  <div className="text-xl font-bold font-display text-slate-900 dark:text-white mt-0.5">
                    {avgScore}/100 <span className="text-[10px] text-amber-500 font-mono">WEIGHTED</span>
                  </div>
                </div>

                <div className="col-span-2 sm:col-span-1">
                  <div className="text-slate-400 dark:text-slate-500 text-[10px] uppercase tracking-wider">Choke Point Quadrants</div>
                  <div className="text-xl font-bold font-display text-rose-600 dark:text-rose-400 mt-0.5">
                    {highRiskCount} <span className="text-[10px] text-slate-400 font-mono">CRITICAL</span>
                  </div>
                </div>
              </div>
            </div>

            {/* Right Narrow Diagnostic Terminal Console (4 cols) */}
            <div className="lg:col-span-4 rounded border border-slate-200/80 dark:border-[#1C2433]/80 bg-slate-50/90 dark:bg-[#0E121A]/90 backdrop-blur-md p-4 font-mono text-xs space-y-4 shadow-lg">
              <div className="flex items-center justify-between border-b border-slate-200 dark:border-[#1C2433] pb-2 text-[10px] uppercase text-slate-500">
                <span className="flex items-center gap-1.5 text-cyan-500 font-bold">
                  <Terminal className="w-3.5 h-3.5" />
                  TELEMETRY_RADAR // LIVE
                </span>
                <span className="text-amber-500 font-bold">RUN: ACTIVE</span>
              </div>

              {/* Radar Graphic Simulation Box */}
              <div className="relative h-36 rounded bg-slate-950/90 border border-cyan-500/20 flex items-center justify-center overflow-hidden">
                <div className="absolute inset-0 tactical-grid opacity-30" />
                <div className="w-24 h-24 rounded-full border border-cyan-500/30 flex items-center justify-center">
                  <div className="w-12 h-12 rounded-full border border-cyan-500/40" />
                </div>
                {/* Radar Line */}
                <div className="absolute w-24 h-0.5 bg-gradient-to-r from-transparent via-cyan-400 to-transparent animate-radar origin-center" />
                <div className="absolute bottom-2 left-2 text-[9px] text-cyan-400 font-mono bg-black/60 px-1 rounded">
                  SCAN: 3D CONCENTRIC MATRIX
                </div>
              </div>

              {/* Monospace Telemetry Feed */}
              <div className="space-y-1.5 text-[11px]">
                <div className="flex items-center justify-between text-slate-600 dark:text-slate-400">
                  <span>UDYAM_REGISTRY_SYNC:</span>
                  <span className="text-emerald-500 font-bold">NOMINAL</span>
                </div>
                <div className="flex items-center justify-between text-slate-600 dark:text-slate-400">
                  <span>PAYMENT_LAG_AUDIT:</span>
                  <span className="text-amber-500 font-bold">45-DAY COMPOUND</span>
                </div>
                <div className="flex items-center justify-between text-slate-600 dark:text-slate-400">
                  <span>SHOCKWAVE_ENGINE:</span>
                  <span className="text-cyan-500 font-bold">READY</span>
                </div>
              </div>

              <div className="pt-2 border-t border-slate-200 dark:border-[#1C2433]">
                <button
                  onClick={() => handleProtectedNavigate("3D_SPACE")}
                  className="w-full py-2 rounded bg-cyan-500/10 hover:bg-cyan-500/20 border border-cyan-500/30 text-cyan-600 dark:text-cyan-400 text-xs font-bold transition-colors cursor-pointer text-center"
                >
                  ENTER LIVE 3D ORBIT →
                </button>
              </div>
            </div>

          </div>
        </div>
      </section>

      {/* SECTION 2: ASYMMETRIC MODULAR ARCHITECTURE (VARIED SIZES, TYPE-FIRST HEADERS, INLINE ICONS) */}
      <section className="w-full max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-16 space-y-8">
        
        {/* Section Header */}
        <div className="border-b border-slate-200/80 dark:border-[#1A2232]/80 pb-4 flex flex-col sm:flex-row sm:items-end justify-between gap-2">
          <div>
            <div className="text-[10px] font-mono uppercase tracking-widest text-cyan-600 dark:text-cyan-400 font-bold">
              ARCHITECTURE &amp; FORENSICS
            </div>
            <h2 className="font-display font-bold text-2xl sm:text-3xl text-slate-950 dark:text-white mt-1">
              Deterministic Risk Intelligence
            </h2>
          </div>
          <div className="text-xs font-mono text-slate-500">
            [4 CORE SUBSYSTEMS • GEMINI AI]
          </div>
        </div>

        {/* Asymmetric Bento Architecture Grid */}
        <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
          
          {/* Card 1: Dominant 2-Column Wide Card (3D Concentric Orbit) */}
          <div 
            onClick={() => handleProtectedNavigate("3D_SPACE")}
            className="md:col-span-2 rounded border border-slate-200/80 dark:border-[#1C2433]/80 bg-[#FFFFFF]/85 dark:bg-[#0D1017]/85 backdrop-blur-md p-6 space-y-4 hover:border-cyan-500 transition-all cursor-pointer group flex flex-col justify-between shadow-sm"
          >
            <div className="space-y-3">
              <div className="flex items-center justify-between">
                <span className="font-mono text-xs text-cyan-600 dark:text-cyan-400 font-bold">
                  01 // TOPOLOGICAL ENGINE
                </span>
                <span className="text-[10px] font-mono px-2 py-0.5 rounded border border-cyan-500/30 bg-cyan-500/10 text-cyan-500">
                  THREE.JS WEBGL
                </span>
              </div>

              <h3 className="font-display font-bold text-xl text-slate-900 dark:text-white flex items-center gap-2">
                <Network className="w-5 h-5 text-cyan-500 inline" />
                <span>3D Concentric Orbital Knowledge Graph</span>
              </h3>

              <p className="text-xs sm:text-sm text-slate-600 dark:text-[#8E9BAE] leading-relaxed font-body">
                Visualizes Tier-1, Tier-2, and Tier-3 vendors on concentric radial orbits calculated by dependency weight and payment lag. Pinpoint single-point-of-failure clusters before ripple effects take down downstream assembly lines.
              </p>
            </div>

            <div className="pt-4 border-t border-slate-100 dark:border-[#1C2433] flex items-center justify-between text-xs font-mono text-cyan-600 dark:text-cyan-400 font-bold">
              <span>EXPLORE 3D ORBITAL SIMULATION</span>
              <ArrowRight className="w-4 h-4 group-hover:translate-x-1 transition-transform" />
            </div>
          </div>

          {/* Card 2: Vertical Tall Card (Contagion Simulator) */}
          <div 
            onClick={() => handleProtectedNavigate("3D_SPACE")}
            className="rounded border border-slate-200/80 dark:border-[#1C2433]/80 bg-[#FFFFFF]/85 dark:bg-[#0D1017]/85 backdrop-blur-md p-6 space-y-4 hover:border-amber-500 transition-all cursor-pointer group flex flex-col justify-between shadow-sm"
          >
            <div className="space-y-3">
              <div className="flex items-center justify-between">
                <span className="font-mono text-xs text-amber-600 dark:text-amber-400 font-bold">
                  02 // SHOCK SIMULATION
                </span>
                <AlertTriangle className="w-4 h-4 text-amber-500" />
              </div>

              <h3 className="font-display font-bold text-xl text-slate-900 dark:text-white flex items-center gap-2">
                <Activity className="w-5 h-5 text-amber-500 inline" />
                <span>Contagion Shockwave</span>
              </h3>

              <p className="text-xs text-slate-600 dark:text-[#8E9BAE] leading-relaxed font-body">
                Simulate insolvencies, natural disasters, or working-capital freezes to project downstream financial exposure in Crores.
              </p>
            </div>

            <div className="pt-4 border-t border-slate-100 dark:border-[#1C2433] flex items-center justify-between text-xs font-mono text-amber-600 dark:text-amber-400 font-bold">
              <span>RUN SHOCKWAVE</span>
              <ArrowRight className="w-4 h-4 group-hover:translate-x-1 transition-transform" />
            </div>
          </div>

          {/* Card 3: Statutory MSMED Act Card (Type-First, Statutory Section Tags) */}
          <div 
            onClick={() => {
              sound.playClick();
              onOpenCsvModal();
            }}
            className="rounded border border-slate-200/80 dark:border-[#1C2433]/80 bg-[#FFFFFF]/85 dark:bg-[#0D1017]/85 backdrop-blur-md p-6 space-y-4 hover:border-cyan-500 transition-all cursor-pointer group flex flex-col justify-between shadow-sm"
          >
            <div className="space-y-3">
              <div className="font-mono text-xs text-slate-400 dark:text-slate-500 font-bold">
                03 // REGULATORY COMPLIANCE
              </div>

              <h3 className="font-display font-bold text-lg text-slate-900 dark:text-white flex items-center gap-2">
                <Scale className="w-4 h-4 text-cyan-500 inline" />
                <span>MSMED Act 2006 (Sec 15/16)</span>
              </h3>

              <p className="text-xs text-slate-600 dark:text-[#8E9BAE] leading-relaxed font-body">
                Ingest Udyam CSVs with automatic 15-digit GSTIN regex auditing and statutory compound interest rate calculators (3x RBI bank rate).
              </p>
            </div>

            <div className="pt-4 border-t border-slate-100 dark:border-[#1C2433] flex items-center justify-between text-xs font-mono text-cyan-600 dark:text-cyan-400 font-bold">
              <span>INGEST DATASET</span>
              <ArrowRight className="w-4 h-4 group-hover:translate-x-1 transition-transform" />
            </div>
          </div>

          {/* Card 4: Dominant 2-Column Wide AI Reasoning Card */}
          <div 
            onClick={() => {
              sound.playClick();
              onOpenCopilot();
            }}
            className="md:col-span-2 rounded border border-slate-200/80 dark:border-[#1C2433]/80 bg-[#FFFFFF]/85 dark:bg-[#0D1017]/85 backdrop-blur-md p-6 space-y-4 hover:border-cyan-500 transition-all cursor-pointer group flex flex-col justify-between shadow-sm"
          >
            <div className="space-y-3">
              <div className="flex items-center justify-between">
                <span className="font-mono text-xs text-cyan-600 dark:text-cyan-400 font-bold">
                  04 // AI FORENSICS
                </span>
                <span className="text-[10px] font-mono px-2 py-0.5 rounded border border-cyan-500/30 bg-cyan-500/10 text-cyan-500">
                  GEMINI 3.7 MULTI-MODEL
                </span>
              </div>

              <h3 className="font-display font-bold text-xl text-slate-900 dark:text-white flex items-center gap-2">
                <Bot className="w-5 h-5 text-cyan-500 inline" />
                <span>Multi-Model AI Forensic Copilot</span>
              </h3>

              <p className="text-xs sm:text-sm text-slate-600 dark:text-[#8E9BAE] leading-relaxed font-body">
                Cross-references OpenWeather anomaly reports, NewsAPI insolvency headlines, and World Bank macro indicators to generate deterministic audit matrices in structured JSON format.
              </p>
            </div>

            <div className="pt-4 border-t border-slate-100 dark:border-[#1C2433] flex items-center justify-between text-xs font-mono text-cyan-600 dark:text-cyan-400 font-bold">
              <span>OPEN AI FORENSIC COPILOT [⌘K]</span>
              <ArrowRight className="w-4 h-4 group-hover:translate-x-1 transition-transform" />
            </div>
          </div>

        </div>
      </section>

      {/* SECTION 3: BOTTOM EDGE-ALIGNED STATUTORY MASTHEAD FOOTER */}
      <footer className="mt-auto border-t border-slate-200/80 dark:border-[#1C2433]/80 bg-[#FFFFFF]/90 dark:bg-[#0A0C12]/90 backdrop-blur-md py-10 font-mono text-xs text-slate-500 dark:text-slate-400">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 space-y-8">
          
          <div className="grid grid-cols-1 md:grid-cols-3 gap-8 pb-6 border-b border-slate-200 dark:border-[#1A2232]">
            {/* Column 1: Organization */}
            <div className="space-y-2">
              <div className="font-display font-bold text-base text-slate-900 dark:text-white">
                TRUSTGRAPH AI
              </div>
              <p className="text-xs font-body text-slate-500 leading-relaxed">
                Enterprise MSME supply chain knowledge graph, systemic contagion shockwave simulator, and Section 15/16 statutory compliance engine.
              </p>
              <div className="text-[10px] text-slate-400">CIN: U72900TG2024PTC188200</div>
            </div>

            {/* Column 2: Physical HQ */}
            <div className="space-y-1.5">
              <div className="font-bold text-slate-900 dark:text-white uppercase tracking-wider text-[11px] flex items-center gap-1.5">
                <MapPin className="w-3.5 h-3.5 text-cyan-500" />
                <span>Headquarters &amp; R&amp;D</span>
              </div>
              <div className="text-xs text-slate-600 dark:text-slate-400 font-body leading-relaxed">
                TrustGraph AI Technologies Pvt. Ltd.<br />
                T-Hub Phase 2, 5th Floor, Knowledge City, Raidurg,<br />
                Hyderabad, Telangana 500081, India
              </div>
              <div className="text-[11px] text-cyan-600 dark:text-cyan-400 pt-1">
                support@trustgraph.ai • +91 (040) 6828-4400
              </div>
            </div>

            {/* Column 3: Legal & Regulatory */}
            <div className="space-y-1.5">
              <div className="font-bold text-slate-900 dark:text-white uppercase tracking-wider text-[11px] flex items-center gap-1.5">
                <Scale className="w-3.5 h-3.5 text-amber-500" />
                <span>Statutory Compliance</span>
              </div>
              <ul className="space-y-1 text-xs">
                <li>
                  <button onClick={() => { sound.playClick(); onOpenPrivacy?.(); }} className="hover:text-cyan-400 cursor-pointer">
                    • Privacy Policy (DPDP Act 2023)
                  </button>
                </li>
                <li>
                  <button onClick={() => { sound.playClick(); onOpenTerms?.(); }} className="hover:text-cyan-400 cursor-pointer">
                    • Terms of Service &amp; SLA
                  </button>
                </li>
                <li>
                  <button onClick={() => { sound.playClick(); onOpenContact?.(); }} className="hover:text-cyan-400 cursor-pointer">
                    • Contact Grievance Officer
                  </button>
                </li>
                <li>
                  <button onClick={() => { sound.playClick(); onTest404?.(); }} className="hover:text-amber-400 cursor-pointer">
                    • Telemetry 404 Diagnostics
                  </button>
                </li>
              </ul>
            </div>
          </div>

          <div className="flex flex-col sm:flex-row items-center justify-between gap-4 text-[11px]">
            <div className="flex items-center gap-2">
              <span className="w-2 h-2 rounded-full bg-cyan-500" />
              <span>© {new Date().getFullYear()} TrustGraph AI Technologies Pvt. Ltd. All rights reserved.</span>
            </div>
            <div className="flex items-center gap-4 uppercase tracking-widest text-[10px] text-slate-400">
              <span>UDYAM VERIFIED</span>
              <span>•</span>
              <span>MSMED ACT 2006</span>
              <span>•</span>
              <span>GEMINI AI CORE</span>
            </div>
          </div>

        </div>
      </footer>

    </VideoBackground>
  );
};
