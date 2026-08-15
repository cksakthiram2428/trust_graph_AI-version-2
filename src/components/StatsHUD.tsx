import React, { useState } from "react";
import { PlatformStat } from "../types";
import { TiltCard } from "./TiltCard";
import { motion } from "motion/react";
import { sound } from "../utils/audio";
import { ShieldCheck, IndianRupee, Target, Network, Activity, ArrowUpRight, AlertTriangle, Radio, Sparkles, Zap } from "lucide-react";

interface StatsHUDProps {
  stats: PlatformStat[];
  systemHealth: string;
  onOpenCopilot: () => void;
  activeFilterTag?: string;
  onSelectFilterTag?: (tag: string) => void;
  isLoading?: boolean;
  lastRealtimeRefresh?: string;
  onRefreshRealtime?: () => void;
  isRefreshing?: boolean;
}

export const StatsHUD: React.FC<StatsHUDProps> = ({ 
  stats, 
  systemHealth, 
  onOpenCopilot,
  activeFilterTag = "All",
  onSelectFilterTag,
  isLoading = false,
  lastRealtimeRefresh,
  onRefreshRealtime,
  isRefreshing = false
}) => {
  const [selectedTag, setSelectedTag] = useState<string>("All");

  const tags = [
    "Compliance",
    "Liquid Assets",
    "Logistics",
    "Predictive Load",
    "GST Filings",
    "Tier 2 Contagion"
  ];

  const handleTagClick = (tag: string) => {
    sound.playClick();
    const newTag = selectedTag === tag ? "All" : tag;
    setSelectedTag(newTag);
    if (onSelectFilterTag) onSelectFilterTag(newTag);
  };

  const getIcon = (iconName: string) => {
    switch (iconName) {
      case "shield_check":
        return <ShieldCheck className="w-5 h-5 text-emerald-500 dark:text-emerald-400" />;
      case "currency_rupee":
        return <IndianRupee className="w-5 h-5 text-sky-500 dark:text-[#38BDF8]" />;
      case "target":
        return <Target className="w-5 h-5 text-indigo-500 dark:text-indigo-400" />;
      case "network":
      default:
        return <Network className="w-5 h-5 text-amber-500 dark:text-amber-400" />;
    }
  };

  return (
    <div id="stats-hud-section" className="w-full space-y-4">
      {/* Top Threat & Status Bar */}
      <div className="flex flex-col sm:flex-row items-start sm:items-center justify-between gap-3 px-4 py-3 rounded-2xl bg-white/90 dark:bg-[#0E0E12] border border-slate-200 dark:border-white/10 shadow-sm backdrop-blur-md transition-colors">
        <div className="flex items-center gap-3">
          <div className="relative flex items-center justify-center">
            <span className="w-3 h-3 rounded-full bg-sky-500 dark:bg-[#38BDF8]" />
            <span className="absolute w-3 h-3 rounded-full bg-sky-500 dark:bg-[#38BDF8] animate-ping opacity-75" />
          </div>
          <div>
            <div className="text-[10px] font-mono uppercase tracking-widest text-sky-600 dark:text-sky-400 font-bold">
              SUPPLY CHAIN KNOWLEDGE GRAPH [LIVE]
            </div>
            <div className="text-xs sm:text-sm font-semibold text-slate-800 dark:text-[#E2E8F0] flex items-center gap-2">
              <span>{systemHealth}</span>
              <span className="text-slate-400 dark:text-slate-500">•</span>
              <span className="text-sky-600 dark:text-[#38BDF8] font-mono text-xs font-bold">LATENCY: 12MS</span>
            </div>
          </div>
        </div>

        <button
          id="open-ai-copilot-hud-btn"
          onClick={() => {
            sound.playClick();
            onOpenCopilot();
          }}
          className="w-full sm:w-auto px-4 py-2 rounded-xl bg-slate-900 hover:bg-slate-800 dark:bg-sky-500/20 dark:hover:bg-sky-500/30 text-white dark:text-sky-300 border border-slate-800 dark:border-sky-500/40 text-xs font-mono font-bold tracking-wider uppercase flex items-center justify-center gap-2 transition-all cursor-pointer shadow-sm group"
        >
          <Activity className="w-3.5 h-3.5 text-sky-400 animate-pulse group-hover:scale-110 transition-transform" />
          <span className="truncate">AI Copilot</span>
          <ArrowUpRight className="w-3.5 h-3.5 flex-shrink-0" />
        </button>
      </div>

      {/* Top Banner with Risk Exposure & Critical Alert */}
      <div className="grid grid-cols-1 lg:grid-cols-3 gap-4">
        {/* Total Risk Exposure Card */}
        <div className="p-5 rounded-2xl bg-white dark:bg-[#0E0E12] border border-slate-200 dark:border-white/10 shadow-sm flex flex-col justify-between transition-colors">
          <div>
            <div className="text-[10px] font-mono uppercase tracking-wider text-slate-500 dark:text-slate-400 font-bold">
              Total Risk Exposure
            </div>
            <div className="font-mono text-2xl sm:text-4xl font-extrabold text-slate-900 dark:text-white mt-1 tracking-tight">
              ₹840 Cr
            </div>
            <div className="text-xs text-slate-600 dark:text-slate-400 mt-2">
              Active monitoring of 2,480+ MSME entities across Indian industrial hubs.
            </div>
          </div>

          {/* Neural Filter Tags with Scale Up & Loading Animation */}
          <div className="mt-4 flex flex-wrap gap-1.5">
            {tags.map((tag, i) => (
              <motion.button
                key={tag}
                initial={{ scale: 0.9, opacity: 0 }}
                animate={{ scale: 1, opacity: 1 }}
                transition={{ duration: 0.3, delay: i * 0.05 }}
                whileHover={{ scale: 1.05 }}
                whileTap={{ scale: 0.95 }}
                onClick={() => handleTagClick(tag)}
                className={`px-3 py-1 rounded-lg text-xs font-mono transition-all cursor-pointer ${
                  selectedTag === tag
                    ? "bg-sky-500 text-white font-bold shadow-md shadow-sky-500/20"
                    : "bg-slate-100 dark:bg-white/5 hover:bg-slate-200 dark:hover:bg-white/10 text-slate-700 dark:text-slate-300 border border-slate-200 dark:border-white/10"
                }`}
              >
                {tag}
              </motion.button>
            ))}
          </div>
        </div>

        {/* Critical Alert Card */}
        <div className="p-5 rounded-2xl bg-rose-50/70 dark:bg-gradient-to-br dark:from-[#0E0E12] dark:to-rose-950/20 border border-rose-200 dark:border-rose-500/30 shadow-sm flex flex-col justify-between transition-colors">
          <div>
            <div className="flex items-center justify-between">
              <span className="font-mono text-[10px] uppercase tracking-wider text-rose-600 dark:text-rose-400 font-bold flex items-center gap-1.5">
                <AlertTriangle className="w-3.5 h-3.5 text-rose-600 dark:text-rose-400 animate-pulse" />
                Critical Contagion Alert
              </span>
              <span className="px-2 py-0.5 rounded text-[9px] font-mono font-bold bg-rose-500 text-white dark:bg-rose-950/80 dark:border dark:border-rose-500/40 dark:text-rose-300">
                HIGH RISK
              </span>
            </div>
            <div className="mt-3 text-xs sm:text-sm font-semibold text-rose-900 dark:text-[#fb7185] leading-relaxed">
              Patel BioSolutions Ltd: Existential default hazard detected. Emergency dual-sourcing advised.
            </div>
          </div>

          <div className="mt-4 pt-3 border-t border-rose-200 dark:border-rose-500/20 flex items-center justify-between text-xs font-mono text-slate-600 dark:text-slate-400">
            <span>Probability: <strong className="text-rose-600 dark:text-rose-300 font-bold">92%</strong></span>
            <span>Downstream Exposure: <strong className="text-slate-900 dark:text-white font-bold">₹14.8 Cr</strong></span>
          </div>
        </div>

        {/* System Status / Explainable Trust Index Card */}
        <div className="p-5 rounded-2xl bg-white dark:bg-[#0E0E12] border border-slate-200 dark:border-white/10 shadow-sm flex flex-col justify-between transition-colors">
          <div>
            <div className="text-[10px] font-mono uppercase tracking-wider text-slate-500 dark:text-slate-400 font-bold">
              System Status
            </div>
            <h3 className="text-sm font-bold text-slate-900 dark:text-white mt-1 tracking-tight font-display">
              Real-time Contagion Risk Assessment
            </h3>
            <p className="text-xs text-slate-600 dark:text-slate-400 mt-2 leading-relaxed">
              Composite index combining Udyam filings, operational fulfillment telemetry, and payment delay benchmarks.
            </p>
          </div>

          <div className="mt-4 pt-3 border-t border-slate-100 dark:border-white/10 flex items-center justify-between text-xs font-mono">
            <div className="flex flex-col">
              <span className="text-slate-500 uppercase">Last AI Sync</span>
              <span className="text-slate-900 dark:text-slate-300 font-bold">
                {lastRealtimeRefresh ? new Date(lastRealtimeRefresh).toLocaleTimeString() : "Pending First Run"}
              </span>
            </div>
            <button
              onClick={() => onRefreshRealtime?.()}
              disabled={isRefreshing}
              className={`px-3 py-1.5 rounded-lg text-[10px] font-bold uppercase tracking-wider flex items-center gap-1.5 transition-all ${
                isRefreshing 
                  ? "bg-slate-100 dark:bg-white/5 text-slate-400 cursor-not-allowed" 
                  : "bg-sky-500 hover:bg-sky-600 text-white shadow-sm shadow-sky-500/20 cursor-pointer"
              }`}
            >
              <Zap className={`w-3 h-3 ${isRefreshing ? "animate-spin" : ""}`} />
              {isRefreshing ? "Syncing..." : "Refresh Intelligence"}
            </button>
          </div>
        </div>
      </div>

      {/* 4 Stats Metric Cards with Scale Up Animations */}
      <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-4">
        {stats.map((stat, idx) => (
          <motion.div
            key={`stat-${idx}`}
            initial={{ opacity: 0, y: 15 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.3, delay: idx * 0.08 }}
          >
            <TiltCard
              id={`stat-card-${idx}`}
              className="p-5 rounded-2xl bg-white dark:bg-[#0E0E12] border border-slate-200 dark:border-white/10 shadow-sm group hover:border-sky-400 dark:hover:border-sky-500/40 transition-colors"
            >
              <div className="flex items-center justify-between">
                <span className="text-[10px] font-mono uppercase tracking-wider text-slate-500 dark:text-slate-400 font-bold">
                  {stat.label}
                </span>
                <div className="p-2 rounded-xl bg-slate-100 dark:bg-white/5 border border-slate-200 dark:border-white/10 group-hover:border-sky-400 transition-colors">
                  {getIcon(stat.icon)}
                </div>
              </div>

              <div className="mt-3">
                <div className="font-mono text-2xl sm:text-3xl font-extrabold text-slate-900 dark:text-[#E2E8F0] tracking-tight">
                  {stat.value}
                </div>
                <div className="mt-1.5 text-xs text-slate-500 dark:text-slate-400 flex items-center gap-1.5 font-mono">
                  <span className="w-1.5 h-1.5 rounded-full bg-sky-500 dark:bg-[#38BDF8]" />
                  <span>{stat.change}</span>
                </div>
              </div>
            </TiltCard>
          </motion.div>
        ))}
      </div>
    </div>
  );
};
