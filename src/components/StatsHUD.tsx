import React, { useState } from "react";
import { PlatformStat } from "../types";
import { TiltCard } from "./TiltCard";
import { ShieldCheck, IndianRupee, Target, Network, Activity, ArrowUpRight, AlertTriangle, Radio } from "lucide-react";

interface StatsHUDProps {
  stats: PlatformStat[];
  systemHealth: string;
  onOpenCopilot: () => void;
  activeFilterTag?: string;
  onSelectFilterTag?: (tag: string) => void;
}

export const StatsHUD: React.FC<StatsHUDProps> = ({ 
  stats, 
  systemHealth, 
  onOpenCopilot,
  activeFilterTag = "All",
  onSelectFilterTag
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
    const newTag = selectedTag === tag ? "All" : tag;
    setSelectedTag(newTag);
    if (onSelectFilterTag) onSelectFilterTag(newTag);
  };

  const getIcon = (iconName: string) => {
    switch (iconName) {
      case "shield_check":
        return <ShieldCheck className="w-6 h-6 text-emerald-400" />;
      case "currency_rupee":
        return <IndianRupee className="w-6 h-6 text-[#38BDF8]" />;
      case "target":
        return <Target className="w-6 h-6 text-indigo-400" />;
      case "network":
      default:
        return <Network className="w-6 h-6 text-amber-400" />;
    }
  };

  return (
    <div id="stats-hud-section" className="w-full space-y-4">
      {/* Top Threat & Status Bar */}
      <div className="flex flex-col sm:flex-row items-start sm:items-center justify-between gap-3 px-4 py-3 rounded-xl neural-card">
        <div className="flex items-center gap-3">
          <div className="relative flex items-center justify-center">
            <span className="w-3 h-3 rounded-full bg-[#38BDF8]" />
            <span className="absolute w-3 h-3 rounded-full bg-[#38BDF8] animate-ping opacity-75" />
          </div>
          <div>
            <div className="design-label">
              SUPPLY CHAIN KNOWLEDGE GRAPH [LIVE]
            </div>
            <div className="text-xs sm:text-sm font-semibold text-[#E2E8F0] flex items-center gap-2">
              <span>{systemHealth}</span>
              <span className="text-slate-500">•</span>
              <span className="text-[#38BDF8] font-mono text-xs">LATENCY: 12MS</span>
            </div>
          </div>
        </div>

        <button
          id="open-ai-copilot-hud-btn"
          onClick={onOpenCopilot}
          className="btn-cyber flex items-center gap-2 rounded"
        >
          <Activity className="w-3.5 h-3.5 animate-pulse" />
          <span>Launch AI Copilot</span>
          <ArrowUpRight className="w-3.5 h-3.5" />
        </button>
      </div>

      {/* Top Banner with Risk Exposure & Critical Alert */}
      <div className="grid grid-cols-1 lg:grid-cols-3 gap-4">
        {/* Total Risk Exposure Card */}
        <div className="neural-card p-5 flex flex-col justify-between">
          <div>
            <div className="design-label">
              Total Risk Exposure
            </div>
            <div className="font-mono text-3xl sm:text-4xl font-bold text-[#E2E8F0] mt-1 tracking-tight">
              ₹840 Cr
            </div>
            <div className="text-xs text-slate-400 mt-2">
              Active monitoring of 2,480+ MSME entities across Indian manufacturing hubs.
            </div>
          </div>

          {/* Neural Filter Tags */}
          <div className="mt-4 flex flex-wrap gap-1.5">
            {tags.map((tag) => (
              <button
                key={tag}
                onClick={() => handleTagClick(tag)}
                className={`neural-tag ${selectedTag === tag ? "active" : ""}`}
              >
                {tag}
              </button>
            ))}
          </div>
        </div>

        {/* Critical Alert Card */}
        <div className="neural-card p-5 flex flex-col justify-between border-rose-500/30 hover:border-rose-400 bg-gradient-to-br from-[#0A0A0C] to-rose-950/20">
          <div>
            <div className="flex items-center justify-between">
              <span className="font-mono text-[10px] uppercase tracking-[0.15em] text-rose-400 flex items-center gap-1.5">
                <AlertTriangle className="w-3.5 h-3.5 text-rose-400 animate-pulse" />
                Critical Alert
              </span>
              <span className="px-2 py-0.5 rounded text-[9px] font-mono font-bold bg-rose-950/80 border border-rose-500/40 text-rose-300">
                HIGH RISK
              </span>
            </div>
            <div className="mt-3 text-xs sm:text-sm font-medium text-[#fb7185] leading-relaxed">
              Patel BioSolutions Ltd: Existential default hazard detected. Emergency sourcing recommended.
            </div>
          </div>

          <div className="mt-4 pt-3 border-t border-rose-500/20 flex items-center justify-between text-xs font-mono text-slate-400">
            <span>Probability: <strong className="text-rose-300">92%</strong></span>
            <span>Downstream Exposure: <strong className="text-white">₹14.8 Cr</strong></span>
          </div>
        </div>

        {/* System Status / Explainable Trust Index Card */}
        <div className="neural-card p-5 flex flex-col justify-between">
          <div>
            <div className="design-label">
              System Status
            </div>
            <h3 className="text-sm font-bold text-white mt-1 tracking-tight font-display">
              Real-time Contagion Risk Assessment
            </h3>
            <p className="text-xs text-slate-400 mt-2 leading-relaxed">
              Our multi-layer graph model combines operational fulfillment telemetry, payment delay metrics, and quality control audits into an explainable composite trust index.
            </p>
          </div>

          <div className="mt-4 pt-3 border-t border-white/10 flex items-center justify-between text-xs font-mono">
            <span className="text-slate-500">[01] OPERATIONAL</span>
            <span className="text-[#38BDF8] flex items-center gap-1">
              <Radio className="w-3 h-3 animate-ping" />
              SYNCHRONIZED
            </span>
          </div>
        </div>
      </div>

      {/* 4 Stats Metric Cards */}
      <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-4">
        {stats.map((stat, idx) => (
          <TiltCard
            key={`stat-${idx}`}
            id={`stat-card-${idx}`}
            className="p-5 neural-card group"
          >
            <div className="flex items-center justify-between">
              <span className="design-label">
                {stat.label}
              </span>
              <div className="p-2 rounded-xl bg-white/[0.04] border border-white/10 group-hover:border-[#38BDF8]/40 transition-colors">
                {getIcon(stat.icon)}
              </div>
            </div>

            <div className="mt-3">
              <div className="font-mono text-2xl sm:text-3xl font-bold text-[#E2E8F0] tracking-tight">
                {stat.value}
              </div>
              <div className="mt-1.5 text-xs text-slate-400 flex items-center gap-1.5 font-mono">
                <span className="w-1.5 h-1.5 rounded-full bg-[#38BDF8]" />
                <span>{stat.change}</span>
              </div>
            </div>
          </TiltCard>
        ))}
      </div>
    </div>
  );
};
