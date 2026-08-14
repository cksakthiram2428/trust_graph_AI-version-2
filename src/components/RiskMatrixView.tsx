import React from "react";
import { Supplier } from "../types";
import { sound } from "../utils/audio";
import { AlertCircle, ShieldAlert, ShieldCheck, Zap } from "lucide-react";

interface RiskMatrixViewProps {
  suppliers: Supplier[];
  onSelectSupplier: (supplier: Supplier) => void;
  onSimulateCascade: (supplier: Supplier) => void;
}

export const RiskMatrixView: React.FC<RiskMatrixViewProps> = ({
  suppliers,
  onSelectSupplier,
  onSimulateCascade
}) => {
  return (
    <div
      id="risk-matrix-stage"
      className="relative w-full min-h-[620px] rounded-2xl cyber-glass border border-cyan-500/20 shadow-2xl p-6 select-none"
    >
      <div className="flex items-center justify-between pb-4 border-b border-slate-800">
        <div className="flex items-center gap-2.5">
          <span className="w-2.5 h-2.5 rounded-full bg-cyan-400 animate-pulse" />
          <h2 className="font-mono text-sm font-bold text-cyan-300 uppercase tracking-wider">
            Supply Chain Vulnerability Matrix (Criticality vs. Trust Score)
          </h2>
        </div>
        <div className="text-xs text-slate-400 font-mono">
          Quadrant 4 = High Exposure Contagion Zone
        </div>
      </div>

      {/* 2x2 Quadrant Grid */}
      <div className="mt-6 grid grid-cols-1 md:grid-cols-2 gap-4">
        {/* Quadrant 1: High Trust / High Criticality (Strategic Anchors) */}
        <div className="p-4 rounded-xl bg-slate-900/60 border border-emerald-500/30">
          <div className="flex items-center justify-between pb-2 border-b border-emerald-500/20">
            <div className="flex items-center gap-2 text-emerald-400 font-mono text-xs font-bold uppercase">
              <ShieldCheck className="w-4 h-4" />
              <span>Strategic Anchors (High Trust &gt; 75, High Volume)</span>
            </div>
            <span className="px-2 py-0.5 rounded bg-emerald-950/80 text-[10px] text-emerald-300 font-mono">
              STABLE
            </span>
          </div>

          <div className="mt-3 space-y-2">
            {suppliers
              .filter(s => s.score >= 75 && (s.criticality === "High" || s.tier === "Tier-1 Direct"))
              .map(s => (
                <div
                  key={s.id}
                  onClick={() => { sound.playTargetLock(); onSelectSupplier(s); }}
                  className="p-2.5 rounded-lg bg-slate-950/70 hover:bg-slate-850 border border-slate-800 hover:border-emerald-500/50 cursor-pointer flex items-center justify-between transition-all"
                >
                  <div>
                    <div className="font-semibold text-sm text-slate-100">{s.name}</div>
                    <div className="text-xs text-slate-400">{s.industry} • {s.city}</div>
                  </div>
                  <div className="text-right">
                    <span className="font-mono font-bold text-emerald-400 text-sm">{s.score} / 100</span>
                    <span className="block text-[10px] text-slate-500 font-mono">{s.monthlyVolumeINR}</span>
                  </div>
                </div>
              ))}
          </div>
        </div>

        {/* Quadrant 2: High Trust / Low Criticality (Reliable Standard Suppliers) */}
        <div className="p-4 rounded-xl bg-slate-900/60 border border-cyan-500/20">
          <div className="flex items-center justify-between pb-2 border-b border-cyan-500/20">
            <div className="flex items-center gap-2 text-cyan-400 font-mono text-xs font-bold uppercase">
              <ShieldCheck className="w-4 h-4" />
              <span>Standard Partners (High Trust &gt; 70, Low Risk)</span>
            </div>
            <span className="px-2 py-0.5 rounded bg-cyan-950/80 text-[10px] text-cyan-300 font-mono">
              OPTIMAL
            </span>
          </div>

          <div className="mt-3 space-y-2">
            {suppliers
              .filter(s => s.score >= 70 && s.criticality !== "High" && s.tier !== "Tier-1 Direct")
              .map(s => (
                <div
                  key={s.id}
                  onClick={() => { sound.playTargetLock(); onSelectSupplier(s); }}
                  className="p-2.5 rounded-lg bg-slate-950/70 hover:bg-slate-850 border border-slate-800 hover:border-cyan-500/50 cursor-pointer flex items-center justify-between transition-all"
                >
                  <div>
                    <div className="font-semibold text-sm text-slate-100">{s.name}</div>
                    <div className="text-xs text-slate-400">{s.industry} • {s.tier}</div>
                  </div>
                  <div className="text-right">
                    <span className="font-mono font-bold text-cyan-400 text-sm">{s.score} / 100</span>
                    <span className="block text-[10px] text-slate-500 font-mono">{s.deliveryReliability} On-time</span>
                  </div>
                </div>
              ))}
          </div>
        </div>

        {/* Quadrant 3: Moderate Risk (Close Monitoring Required) */}
        <div className="p-4 rounded-xl bg-slate-900/60 border border-amber-500/30">
          <div className="flex items-center justify-between pb-2 border-b border-amber-500/20">
            <div className="flex items-center gap-2 text-amber-400 font-mono text-xs font-bold uppercase">
              <AlertCircle className="w-4 h-4" />
              <span>Watchlist Zone (Moderate Risk 50 - 74)</span>
            </div>
            <span className="px-2 py-0.5 rounded bg-amber-950/80 text-[10px] text-amber-300 font-mono">
              MONITOR
            </span>
          </div>

          <div className="mt-3 space-y-2">
            {suppliers
              .filter(s => s.score >= 50 && s.score < 75)
              .map(s => (
                <div
                  key={s.id}
                  onClick={() => { sound.playTargetLock(); onSelectSupplier(s); }}
                  className="p-2.5 rounded-lg bg-slate-950/70 hover:bg-slate-850 border border-slate-800 hover:border-amber-500/50 cursor-pointer flex items-center justify-between transition-all"
                >
                  <div>
                    <div className="font-semibold text-sm text-slate-100">{s.name}</div>
                    <div className="text-xs text-amber-300/80">Avg Delay: {s.paymentDelay}</div>
                  </div>
                  <div className="text-right">
                    <span className="font-mono font-bold text-amber-400 text-sm">{s.score} / 100</span>
                    <span className="block text-[10px] text-slate-500 font-mono">{s.complaintCount} Grievances</span>
                  </div>
                </div>
              ))}
          </div>
        </div>

        {/* Quadrant 4: High Exposure / Critical Risk (Systemic Contagion Risk) */}
        <div className="p-4 rounded-xl bg-rose-950/40 border border-rose-500/50 shadow-lg shadow-rose-950/30">
          <div className="flex items-center justify-between pb-2 border-b border-rose-500/30">
            <div className="flex items-center gap-2 text-rose-400 font-mono text-xs font-bold uppercase">
              <ShieldAlert className="w-4 h-4 text-rose-400 animate-bounce" />
              <span>Critical Contagion Hazard (&lt; 50 Score)</span>
            </div>
            <span className="px-2 py-0.5 rounded bg-rose-900/80 text-[10px] text-rose-200 font-mono font-bold">
              URGENT INTERVENTION
            </span>
          </div>

          <div className="mt-3 space-y-2">
            {suppliers
              .filter(s => s.score < 50)
              .map(s => (
                <div
                  key={s.id}
                  className="p-3 rounded-lg bg-slate-950/80 border border-rose-500/40 flex items-center justify-between transition-all"
                >
                  <div
                    className="cursor-pointer flex-1"
                    onClick={() => { sound.playTargetLock(); onSelectSupplier(s); }}
                  >
                    <div className="font-bold text-sm text-rose-100">{s.name}</div>
                    <div className="text-xs text-rose-300/90">{s.insight}</div>
                  </div>
                  <div className="ml-3 flex flex-col items-end gap-1.5">
                    <span className="font-mono font-bold text-rose-400 text-sm">{s.score} / 100</span>
                    <button
                      onClick={(e) => {
                        e.stopPropagation();
                        sound.playShockwave();
                        onSimulateCascade(s);
                      }}
                      className="px-2.5 py-1 rounded bg-rose-600/30 hover:bg-rose-600/50 border border-rose-400/50 text-[10px] font-mono text-rose-200 flex items-center gap-1 cursor-pointer transition-colors"
                    >
                      <Zap className="w-3 h-3 text-rose-400" />
                      <span>Simulate Shock</span>
                    </button>
                  </div>
                </div>
              ))}
          </div>
        </div>
      </div>
    </div>
  );
};
