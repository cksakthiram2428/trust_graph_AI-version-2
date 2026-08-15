"use client";

import React from "react";
import { motion } from "motion/react";
import { AuroraBackground } from "./ui/aurora-background";
import { sound } from "../utils/audio";
import { 
  Network, 
  Zap, 
  ShieldCheck, 
  Layers, 
  Bot, 
  Search, 
  FileSpreadsheet, 
  ArrowRight, 
  Sparkles, 
  Sun, 
  Moon, 
  Volume2, 
  VolumeX, 
  Activity, 
  Cpu, 
  Lock, 
  Database,
  ExternalLink,
  ChevronRight,
  TrendingDown,
  Building2,
  Scale,
  LogIn,
  User as UserIcon
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
  stats
}) => {
  const highRiskCount = suppliers.filter(s => s.score < 50).length;
  const avgScore = suppliers.length > 0 
    ? Math.round(suppliers.reduce((acc, s) => acc + s.score, 0) / suppliers.length) 
    : 78;

  // Requirement: All buttons navigating to the hero/workspace section require login if not already done
  const handleProtectedNavigate = (initialView?: "3D_SPACE" | "2D_TOPOLOGY" | "RISK_MATRIX") => {
    sound.playClick();
    if (!user) {
      onOpenLogin();
      return;
    }
    onEnterWorkspace(initialView);
  };

  return (
    <div className="min-h-screen bg-slate-50 dark:bg-[#070709] text-slate-900 dark:text-slate-100 transition-colors duration-500 flex flex-col selection:bg-cyan-500/30 selection:text-cyan-600 dark:selection:text-cyan-200 relative">
      {/* Aurora Ambient Hero Container */}
      <AuroraBackground className="min-h-[85vh] md:min-h-[92vh] pt-6 pb-16 justify-between">
        {/* Landing Top Header */}
        <header className="w-full max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 flex items-center justify-between gap-4">
          <div className="flex items-center gap-3">
            <div className="relative flex items-center justify-center w-11 h-11 rounded-2xl bg-gradient-to-br from-sky-400 via-sky-500 to-indigo-600 p-0.5 shadow-lg shadow-sky-500/20">
              <div className="w-full h-full bg-white dark:bg-[#0A0A0C] rounded-[14px] flex items-center justify-center">
                <Network className="w-6 h-6 text-sky-500 dark:text-[#38BDF8] animate-pulse" />
              </div>
            </div>
            <div>
              <div className="font-mono text-[10px] uppercase tracking-widest text-sky-600 dark:text-sky-400 font-bold">
                MSME Resilience OS
              </div>
              <span className="font-display font-extrabold text-xl sm:text-2xl tracking-tight text-slate-900 dark:text-white">
                TrustGraph <span className="text-sky-500 dark:text-cyan-400">AI</span>
              </span>
            </div>
          </div>

          {/* Header Controls */}
          <div className="flex items-center gap-2 sm:gap-3">
            {/* Audio Toggle */}
            <button
              id="landing-toggle-sound-btn"
              onClick={() => {
                onToggleSound();
                if (isMuted) sound.playClick();
              }}
              className="p-2.5 rounded-xl border border-slate-200 dark:border-white/10 bg-white/70 dark:bg-white/5 text-slate-700 dark:text-slate-300 hover:text-sky-500 dark:hover:text-sky-400 backdrop-blur-md transition-all cursor-pointer shadow-sm"
              title={isMuted ? "Unmute Audio FX" : "Mute Audio FX"}
            >
              {isMuted ? <VolumeX className="w-4 h-4" /> : <Volume2 className="w-4 h-4 text-sky-500 animate-pulse" />}
            </button>

            {/* Theme Toggle */}
            <button
              id="landing-theme-toggle-btn"
              onClick={() => {
                sound.playClick();
                onToggleTheme();
              }}
              className="p-2.5 rounded-xl border border-slate-200 dark:border-white/10 bg-white/70 dark:bg-white/5 text-slate-700 dark:text-slate-300 hover:text-amber-500 dark:hover:text-amber-400 backdrop-blur-md transition-all cursor-pointer shadow-sm"
              title={`Switch to ${theme === "dark" ? "Light" : "Dark"} Mode`}
            >
              {theme === "dark" ? <Sun className="w-4 h-4 text-amber-400" /> : <Moon className="w-4 h-4 text-slate-700" />}
            </button>

            {/* User Profile Trigger or Login Button */}
            {user ? (
              <button
                id="landing-profile-btn"
                onClick={() => {
                  sound.playClick();
                  onOpenProfile?.();
                }}
                className="flex items-center gap-2 px-3 py-1.5 rounded-xl bg-white/80 dark:bg-white/10 hover:bg-white dark:hover:bg-white/15 border border-slate-200 dark:border-white/10 text-slate-700 dark:text-slate-200 text-xs font-mono transition-all cursor-pointer shadow-sm"
                title="Edit Operator Profile"
              >
                <div className="relative w-6 h-6 rounded-lg bg-gradient-to-br from-sky-500 to-indigo-600 p-0.5">
                  {user.photoURL ? (
                    <img
                      src={user.photoURL}
                      alt={user.name}
                      referrerPolicy="no-referrer"
                      className="w-full h-full object-cover rounded-[5px]"
                    />
                  ) : (
                    <div className="w-full h-full bg-white dark:bg-[#0A0A0C] rounded-[5px] flex items-center justify-center text-sky-500 font-bold text-[10px]">
                      {user.name.charAt(0).toUpperCase()}
                    </div>
                  )}
                </div>
                <span className="hidden sm:inline font-semibold">{user.name.split(" ")[0]}</span>
              </button>
            ) : (
              <button
                id="landing-login-btn"
                onClick={() => {
                  sound.playClick();
                  onOpenLogin();
                }}
                className="flex items-center gap-1.5 px-3 py-2 rounded-xl bg-white/80 dark:bg-white/5 hover:bg-white dark:hover:bg-white/10 border border-slate-200 dark:border-white/10 text-slate-700 dark:text-slate-200 text-xs font-mono transition-all cursor-pointer shadow-sm font-semibold"
              >
                <LogIn className="w-3.5 h-3.5 text-sky-500" />
                <span>Login</span>
              </button>
            )}

            {/* Primary Action Button */}
            <button
              id="landing-enter-workspace-header-btn"
              onClick={() => handleProtectedNavigate("3D_SPACE")}
              className="hidden sm:flex items-center gap-2 px-4 py-2.5 rounded-xl bg-slate-900 hover:bg-slate-800 dark:bg-cyan-500/20 dark:hover:bg-cyan-500/30 text-white dark:text-cyan-300 border border-slate-800 dark:border-cyan-500/40 text-xs font-mono font-bold tracking-wider uppercase transition-all shadow-md cursor-pointer"
            >
              <Zap className="w-3.5 h-3.5 text-cyan-400" />
              <span>Launch 3D Command</span>
            </button>
          </div>
        </header>

        {/* Hero Content Section */}
        <div className="w-full max-w-5xl mx-auto px-4 sm:px-6 lg:px-8 py-10 md:py-16 text-center flex flex-col items-center">
          <motion.div
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.6 }}
            className="inline-flex items-center gap-2 px-3.5 py-1.5 rounded-full bg-sky-500/10 dark:bg-sky-400/10 border border-sky-500/30 dark:border-sky-400/20 text-sky-700 dark:text-sky-300 font-mono text-xs mb-6 shadow-sm"
          >
            <Sparkles className="w-3.5 h-3.5 text-sky-500 dark:text-cyan-400 animate-spin" />
            <span>Next-Generation Contagion Defense for Indian MSMEs</span>
          </motion.div>

          <motion.h1
            initial={{ opacity: 0, y: 30 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.8, delay: 0.1 }}
            className="text-3xl sm:text-5xl md:text-6xl lg:text-7xl font-extrabold tracking-tight text-slate-950 dark:text-white leading-[1.1] max-w-4xl"
          >
            3D Supply Chain <span className="text-transparent bg-clip-text bg-gradient-to-r from-sky-500 via-cyan-400 to-indigo-500">Knowledge Graph</span> &amp; Contagion Shockwave Engine
          </motion.h1>

          <motion.p
            initial={{ opacity: 0, y: 30 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.8, delay: 0.2 }}
            className="mt-6 text-base sm:text-lg md:text-xl text-slate-600 dark:text-slate-300 max-w-3xl leading-relaxed font-normal"
          >
            Shield your enterprise against multi-tier supplier defaults, liquidity freezes, and cascading supply line halts. Powered by <strong>Multi-Model Gemini Intelligence</strong>, <strong>data.gov.in Udyam verification</strong>, and real-time <strong>MSMED Act 2006</strong> statutory compliance.
          </motion.p>

          {/* Action CTAs */}
          <motion.div
            initial={{ opacity: 0, y: 30 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.8, delay: 0.3 }}
            className="mt-8 sm:mt-10 flex flex-wrap items-center justify-center gap-4 w-full"
          >
            {/* Launch Button with Protected Auth Guard */}
            <button
              id="landing-main-cta-btn"
              onClick={() => handleProtectedNavigate("3D_SPACE")}
              className="px-6 py-3.5 rounded-2xl bg-gradient-to-r from-sky-500 to-cyan-500 hover:from-sky-400 hover:to-cyan-400 text-slate-950 font-mono font-bold text-sm tracking-wider uppercase flex items-center gap-2 shadow-xl shadow-cyan-500/25 hover:shadow-cyan-500/40 transition-all transform hover:-translate-y-0.5 cursor-pointer"
            >
              <Network className="w-4 h-4" />
              <span>Launch 3D Command Center</span>
              <ArrowRight className="w-4 h-4" />
            </button>

            <button
              id="landing-ingest-csv-btn"
              onClick={() => {
                sound.playClick();
                onOpenCsvModal();
              }}
              className="px-5 py-3.5 rounded-2xl bg-white/80 dark:bg-white/10 hover:bg-white dark:hover:bg-white/15 border border-slate-300 dark:border-white/20 text-slate-800 dark:text-slate-100 font-mono text-sm font-semibold flex items-center gap-2 backdrop-blur-md transition-all cursor-pointer shadow-sm"
            >
              <FileSpreadsheet className="w-4 h-4 text-emerald-500" />
              <span>Ingest Udyam CSV</span>
            </button>
          </motion.div>

          {/* Real-time Status Badges */}
          <motion.div
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            transition={{ duration: 1, delay: 0.4 }}
            className="mt-12 flex flex-wrap items-center justify-center gap-3 sm:gap-6 text-xs font-mono text-slate-500 dark:text-slate-400"
          >
            <div className="flex items-center gap-2 px-3 py-1.5 rounded-xl bg-white/60 dark:bg-white/5 border border-slate-200 dark:border-white/10 shadow-sm backdrop-blur-sm">
              <span className="w-2 h-2 rounded-full bg-emerald-500 animate-pulse" />
              <span>Active Network: <strong className="text-slate-800 dark:text-white">{suppliers.length} MSMEs</strong></span>
            </div>
            <div className="flex items-center gap-2 px-3 py-1.5 rounded-xl bg-white/60 dark:bg-white/5 border border-slate-200 dark:border-white/10 shadow-sm backdrop-blur-sm">
              <ShieldCheck className="w-3.5 h-3.5 text-sky-500" />
              <span>Avg Trust Score: <strong className="text-slate-800 dark:text-white">{avgScore}/100</strong></span>
            </div>
            <div className="flex items-center gap-2 px-3 py-1.5 rounded-xl bg-white/60 dark:bg-white/5 border border-slate-200 dark:border-white/10 shadow-sm backdrop-blur-sm">
              <Activity className="w-3.5 h-3.5 text-amber-500" />
              <span>Flagged Bottlenecks: <strong className="text-amber-500 dark:text-amber-400">{highRiskCount} Vendors</strong></span>
            </div>
          </motion.div>
        </div>
      </AuroraBackground>

      {/* Feature Pillar Showcase Section */}
      <section className="w-full max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-16 sm:py-24 space-y-16">
        <div className="text-center max-w-3xl mx-auto space-y-4">
          <div className="font-mono text-xs uppercase tracking-widest text-sky-600 dark:text-sky-400 font-bold">
            Architectural Capabilities
          </div>
          <h2 className="text-2xl sm:text-4xl font-extrabold text-slate-900 dark:text-white">
            Built from the ground up for systemic MSME resilience
          </h2>
          <p className="text-slate-600 dark:text-slate-400 text-sm sm:text-base">
            From 3D particle contagion propagation to real statutory government filings, TrustGraph AI provides continuous, real-time protection.
          </p>
        </div>

        {/* Feature Grid with Protected Auth Handlers */}
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6">
          {/* Card 1: 3D Topology */}
          <div 
            onClick={() => handleProtectedNavigate("3D_SPACE")}
            className="p-6 rounded-2xl bg-white dark:bg-[#0E0E12] border border-slate-200 dark:border-white/10 shadow-lg shadow-slate-200/50 dark:shadow-none hover:border-sky-500 dark:hover:border-sky-400 transition-all duration-300 cursor-pointer group flex flex-col justify-between"
          >
            <div className="space-y-4">
              <div className="w-12 h-12 rounded-xl bg-sky-500/10 text-sky-600 dark:text-sky-400 flex items-center justify-center group-hover:scale-110 transition-transform">
                <Network className="w-6 h-6" />
              </div>
              <h3 className="text-lg font-bold text-slate-900 dark:text-white font-display">
                3D Concentric Orbit Graph
              </h3>
              <p className="text-xs text-slate-600 dark:text-slate-400 leading-relaxed">
                Multi-tier orbital mechanics visualizing Tier-0 Core Assembly to Tier-3 Raw Material dependencies with Three.js webgl particle flows.
              </p>
            </div>
            <div className="mt-6 pt-4 border-t border-slate-100 dark:border-white/5 flex items-center justify-between text-xs font-mono text-sky-600 dark:text-sky-400 font-semibold">
              <span>Enter 3D Space</span>
              <ChevronRight className="w-4 h-4 group-hover:translate-x-1 transition-transform" />
            </div>
          </div>

          {/* Card 2: Contagion Shockwave */}
          <div 
            onClick={() => handleProtectedNavigate("3D_SPACE")}
            className="p-6 rounded-2xl bg-white dark:bg-[#0E0E12] border border-slate-200 dark:border-white/10 shadow-lg shadow-slate-200/50 dark:shadow-none hover:border-rose-500 dark:hover:border-rose-400 transition-all duration-300 cursor-pointer group flex flex-col justify-between"
          >
            <div className="space-y-4">
              <div className="w-12 h-12 rounded-xl bg-rose-500/10 text-rose-600 dark:text-rose-400 flex items-center justify-center group-hover:scale-110 transition-transform">
                <Zap className="w-6 h-6" />
              </div>
              <h3 className="text-lg font-bold text-slate-900 dark:text-white font-display">
                Contagion Shockwave Engine
              </h3>
              <p className="text-xs text-slate-600 dark:text-slate-400 leading-relaxed">
                Simulate abrupt insolvency, liquidity defaults, and port strikes. Calculates INR exposure and production line downtime in real-time.
              </p>
            </div>
            <div className="mt-6 pt-4 border-t border-slate-100 dark:border-white/5 flex items-center justify-between text-xs font-mono text-rose-600 dark:text-rose-400 font-semibold">
              <span>Run Shock Simulation</span>
              <ChevronRight className="w-4 h-4 group-hover:translate-x-1 transition-transform" />
            </div>
          </div>

          {/* Card 3: Multi-Model Gemini AI */}
          <div 
            onClick={() => {
              sound.playClick();
              onOpenCopilot();
            }}
            className="p-6 rounded-2xl bg-white dark:bg-[#0E0E12] border border-slate-200 dark:border-white/10 shadow-lg shadow-slate-200/50 dark:shadow-none hover:border-indigo-500 dark:hover:border-indigo-400 transition-all duration-300 cursor-pointer group flex flex-col justify-between"
          >
            <div className="space-y-4">
              <div className="w-12 h-12 rounded-xl bg-indigo-500/10 text-indigo-600 dark:text-indigo-400 flex items-center justify-center group-hover:scale-110 transition-transform">
                <Bot className="w-6 h-6" />
              </div>
              <h3 className="text-lg font-bold text-slate-900 dark:text-white font-display">
                Gemini Multi-Model Copilot
              </h3>
              <p className="text-xs text-slate-600 dark:text-slate-400 leading-relaxed">
                Dynamic switching between Flash and Pro reasoners with Google Search &amp; Maps grounding, document OCR, and real-time voice interaction.
              </p>
            </div>
            <div className="mt-6 pt-4 border-t border-slate-100 dark:border-white/5 flex items-center justify-between text-xs font-mono text-indigo-600 dark:text-indigo-400 font-semibold">
              <span>Open AI Copilot</span>
              <ChevronRight className="w-4 h-4 group-hover:translate-x-1 transition-transform" />
            </div>
          </div>

          {/* Card 4: Udyam & MSMED Act */}
          <div 
            onClick={() => {
              sound.playClick();
              onOpenCsvModal();
            }}
            className="p-6 rounded-2xl bg-white dark:bg-[#0E0E12] border border-slate-200 dark:border-white/10 shadow-lg shadow-slate-200/50 dark:shadow-none hover:border-emerald-500 dark:hover:border-emerald-400 transition-all duration-300 cursor-pointer group flex flex-col justify-between"
          >
            <div className="space-y-4">
              <div className="w-12 h-12 rounded-xl bg-emerald-500/10 text-emerald-600 dark:text-emerald-400 flex items-center justify-center group-hover:scale-110 transition-transform">
                <FileSpreadsheet className="w-6 h-6" />
              </div>
              <h3 className="text-lg font-bold text-slate-900 dark:text-white font-display">
                Public MSME Ingestion
              </h3>
              <p className="text-xs text-slate-600 dark:text-slate-400 leading-relaxed">
                Ingest real government datasets (data.gov.in Udyam / MCA21) with automatic 15-digit GSTIN regex validation and statutory labeling.
              </p>
            </div>
            <div className="mt-6 pt-4 border-t border-slate-100 dark:border-white/5 flex items-center justify-between text-xs font-mono text-emerald-600 dark:text-emerald-400 font-semibold">
              <span>Import Dataset</span>
              <ChevronRight className="w-4 h-4 group-hover:translate-x-1 transition-transform" />
            </div>
          </div>
        </div>
      </section>

      {/* Interactive Quick-Start Navigation Bar */}
      <section className="w-full max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-10">
        <div className="p-8 rounded-3xl bg-gradient-to-br from-sky-500/10 via-indigo-500/5 to-cyan-500/10 border border-sky-500/20 dark:border-sky-400/20 flex flex-col md:flex-row items-center justify-between gap-6 shadow-xl">
          <div className="space-y-2 text-center md:text-left">
            <h3 className="text-xl sm:text-2xl font-bold text-slate-900 dark:text-white font-display">
              Ready to safeguard your procurement network?
            </h3>
            <p className="text-xs sm:text-sm text-slate-600 dark:text-slate-300">
              Access the live 3D knowledge graph, monitor vendor trust metrics, or trigger an AI systemic audit.
            </p>
          </div>
          <div className="flex flex-wrap items-center gap-3">
            <button
              onClick={() => handleProtectedNavigate("3D_SPACE")}
              className="px-5 py-3 rounded-xl bg-slate-900 hover:bg-slate-800 dark:bg-white dark:hover:bg-slate-100 text-white dark:text-slate-950 font-mono text-xs font-bold uppercase tracking-wider transition-all shadow-md cursor-pointer"
            >
              Enter 3D Graph
            </button>
            <button
              onClick={() => handleProtectedNavigate("2D_TOPOLOGY")}
              className="px-5 py-3 rounded-xl bg-white dark:bg-white/10 hover:bg-slate-50 dark:hover:bg-white/20 border border-slate-200 dark:border-white/10 text-slate-900 dark:text-white font-mono text-xs font-semibold transition-all cursor-pointer"
            >
              2D Topological View
            </button>
            <button
              onClick={() => handleProtectedNavigate("RISK_MATRIX")}
              className="px-5 py-3 rounded-xl bg-white dark:bg-white/10 hover:bg-slate-50 dark:hover:bg-white/20 border border-slate-200 dark:border-white/10 text-slate-900 dark:text-white font-mono text-xs font-semibold transition-all cursor-pointer"
            >
              Risk Matrix
            </button>
          </div>
        </div>
      </section>

      {/* Statutory Footer */}
      <footer className="mt-auto border-t border-slate-200 dark:border-white/10 bg-white/80 dark:bg-[#070709] py-8 text-xs font-mono text-slate-500 dark:text-slate-400">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 flex flex-col md:flex-row items-center justify-between gap-4">
          <div className="flex items-center gap-2">
            <span className="w-2 h-2 rounded-full bg-sky-500 animate-pulse" />
            <span className="font-semibold text-slate-800 dark:text-slate-300">TrustGraph AI • Indian MSME Supply Chain Knowledge Graph</span>
          </div>
          <div className="flex flex-wrap items-center justify-center gap-4 sm:gap-6 text-[11px] uppercase tracking-wider text-slate-500">
            <span>Udyam Statutory Integration</span>
            <span>•</span>
            <span>MSMED Act 2006</span>
            <span>•</span>
            <span>Gemini Multi-Model Core</span>
          </div>
        </div>
      </footer>
    </div>
  );
};
