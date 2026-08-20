import React from "react";
import { Supplier } from "../types";
import { sound } from "../utils/audio";
import { AlertCircle, ShieldAlert, ShieldCheck, Zap } from "lucide-react";

interface RiskMatrixViewProps {
  suppliers: Supplier[];
  onSelectSupplier: (supplier: Supplier) => void;
  onSimulateCascade: (supplier: Supplier) => void;
  onRectifyHighRisks?: () => void;
  isRectifying?: boolean;
}

export const RiskMatrixView: React.FC<RiskMatrixViewProps> = ({
  suppliers,
  onSelectSupplier,
  onSimulateCascade,
  onRectifyHighRisks,
  isRectifying = false
}) => {
  const criticalSuppliers = suppliers.filter(s => s.score < 50);

  return (
    <div
      id="risk-matrix-stage"
      className="relative w-full min-h-[620px] rounded-2xl bg-white dark:bg-[#0E0E12] border border-slate-200 dark:border-cyan-500/20 shadow-sm dark:shadow-2xl p-6 select-none transition-colors"
    >
      <div className="flex flex-col sm:flex-row sm:items-center justify-between pb-4 border-b border-slate-200 dark:border-slate-800 gap-3">
        <div className="flex items-center gap-2.5">
          <span className="w-2.5 h-2.5 rounded-full bg-sky-500 dark:bg-cyan-400 animate-pulse" />
          <h2 className="font-mono text-sm font-bold text-slate-900 dark:text-cyan-300 uppercase tracking-wider">
            Supply Chain Vulnerability Matrix (Criticality vs. Trust Score)
          </h2>
        </div>
        <div className="flex items-center gap-3">
          {criticalSuppliers.length > 0 && onRectifyHighRisks && (
            <button
              id="matrix-rectify-btn"
              onClick={() => {
                sound.playClick();
                onRectifyHighRisks();
              }}
              disabled={isRectifying}
              className="px-3 py-1 rounded-lg text-xs font-mono font-bold uppercase tracking-wider bg-emerald-600 hover:bg-emerald-500 text-white flex items-center gap-1.5 cursor-pointer shadow-sm transition-all"
            >
              <ShieldCheck className="w-3.5 h-3.5" />
              {isRectifying ? "Rectifying..." : "Rectify All Risks"}
            </button>
          )}
          <span className="text-xs text-slate-500 dark:text-slate-400 font-mono">
            Quadrant 4 = High Exposure Contagion Zone
          </span>
        </div>
      </div>

      {/* 2x2 Quadrant Grid */}
      <div className="mt-6 grid grid-cols-1 md:grid-cols-2 gap-4">
        {/* Quadrant 1: High Trust / High Criticality (Strategic Anchors) */}
        <div className="p-4 rounded-2xl bg-emerald-50/70 dark:bg-slate-900/60 border border-emerald-200 dark:border-emerald-500/30">
          <div className="flex items-center justify-between pb-2 border-b border-emerald-200 dark:border-emerald-500/20">
            <div className="flex items-center gap-2 text-emerald-700 dark:text-emerald-400 font-mono text-xs font-bold uppercase">
              <ShieldCheck className="w-4 h-4 text-emerald-600 dark:text-emerald-400" />
              <span>Strategic Anchors (High Trust &gt; 75, High Volume)</span>
            </div>
            <span className="px-2 py-0.5 rounded bg-emerald-100 dark:bg-emerald-950/80 text-[10px] text-emerald-800 dark:text-emerald-300 font-mono font-bold">
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
                  className="p-2.5 rounded-xl bg-white dark:bg-slate-950/70 hover:bg-slate-50 dark:hover:bg-slate-800/80 border border-slate-200 dark:border-slate-800 hover:border-emerald-500/50 cursor-pointer flex items-center justify-between transition-all shadow-xs"
                >
                  <div>
                    <div className="font-semibold text-sm text-slate-900 dark:text-slate-100">{s.name}</div>
                    <div className="text-xs text-slate-500 dark:text-slate-400">{s.industry} • {s.city}</div>
                  </div>
                  <div className="text-right">
                    <span className="font-mono font-bold text-emerald-600 dark:text-emerald-400 text-sm">{s.score} / 100</span>
                    <span className="block text-[10px] text-slate-500 font-mono">{s.monthlyVolumeINR}</span>
                  </div>
                </div>
              ))}
          </div>
        </div>

        {/* Quadrant 2: High Trust / Low Criticality (Reliable Standard Suppliers) */}
        <div className="p-4 rounded-2xl bg-sky-50/70 dark:bg-slate-900/60 border border-sky-200 dark:border-cyan-500/20">
          <div className="flex items-center justify-between pb-2 border-b border-sky-200 dark:border-cyan-500/20">
            <div className="flex items-center gap-2 text-sky-700 dark:text-cyan-400 font-mono text-xs font-bold uppercase">
              <ShieldCheck className="w-4 h-4 text-sky-600 dark:text-cyan-400" />
              <span>Standard Partners (High Trust &gt; 70, Low Risk)</span>
            </div>
            <span className="px-2 py-0.5 rounded bg-sky-100 dark:bg-cyan-950/80 text-[10px] text-sky-800 dark:text-cyan-300 font-mono font-bold">
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
                  className="p-2.5 rounded-xl bg-white dark:bg-slate-950/70 hover:bg-slate-50 dark:hover:bg-slate-800/80 border border-slate-200 dark:border-slate-800 hover:border-sky-500/50 cursor-pointer flex items-center justify-between transition-all shadow-xs"
                >
                  <div>
                    <div className="font-semibold text-sm text-slate-900 dark:text-slate-100">{s.name}</div>
                    <div className="text-xs text-slate-500 dark:text-slate-400">{s.industry} • {s.tier}</div>
                  </div>
                  <div className="text-right">
                    <span className="font-mono font-bold text-sky-600 dark:text-cyan-400 text-sm">{s.score} / 100</span>
                    <span className="block text-[10px] text-slate-500 font-mono">{s.deliveryReliability} On-time</span>
                  </div>
                </div>
              ))}
          </div>
        </div>

        {/* Quadrant 3: Moderate Risk (Close Monitoring Required) */}
        <div className="p-4 rounded-2xl bg-amber-50/70 dark:bg-slate-900/60 border border-amber-200 dark:border-amber-500/30">
          <div className="flex items-center justify-between pb-2 border-b border-amber-200 dark:border-amber-500/20">
            <div className="flex items-center gap-2 text-amber-700 dark:text-amber-400 font-mono text-xs font-bold uppercase">
              <AlertCircle className="w-4 h-4 text-amber-600 dark:text-amber-400" />
              <span>Watchlist Zone (Moderate Risk 50 - 74)</span>
            </div>
            <span className="px-2 py-0.5 rounded bg-amber-100 dark:bg-amber-950/80 text-[10px] text-amber-800 dark:text-amber-300 font-mono font-bold">
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
                  className="p-2.5 rounded-xl bg-white dark:bg-slate-950/70 hover:bg-slate-50 dark:hover:bg-slate-800/80 border border-slate-200 dark:border-slate-800 hover:border-amber-500/50 cursor-pointer flex items-center justify-between transition-all shadow-xs"
                >
                  <div>
                    <div className="font-semibold text-sm text-slate-900 dark:text-slate-100">{s.name}</div>
                    <div className="text-xs text-amber-700 dark:text-amber-300/80">Avg Delay: {s.paymentDelay}</div>
                  </div>
                  <div className="text-right">
                    <span className="font-mono font-bold text-amber-600 dark:text-amber-400 text-sm">{s.score} / 100</span>
                    <span className="block text-[10px] text-slate-500 font-mono">{s.complaintCount} Grievances</span>
                  </div>
                </div>
              ))}
          </div>
        </div>

        {/* Quadrant 4: High Exposure / Critical Risk (Systemic Contagion Risk) */}
        {criticalSuppliers.length > 0 ? (
          <div className="p-4 rounded-2xl bg-rose-50/70 dark:bg-rose-950/40 border border-rose-200 dark:border-rose-500/50 shadow-sm dark:shadow-lg dark:shadow-rose-950/30">
            <div className="flex items-center justify-between pb-2 border-b border-rose-200 dark:border-rose-500/30">
              <div className="flex items-center gap-2 text-rose-700 dark:text-rose-400 font-mono text-xs font-bold uppercase">
                <ShieldAlert className="w-4 h-4 text-rose-600 dark:text-rose-400 animate-bounce" />
                <span>Critical Contagion Hazard (&lt; 50 Score)</span>
              </div>
              <span className="px-2 py-0.5 rounded bg-rose-100 dark:bg-rose-900/80 text-[10px] text-rose-800 dark:text-rose-200 font-mono font-bold">
                URGENT INTERVENTION
              </span>
            </div>

            <div className="mt-3 space-y-2">
              {criticalSuppliers.map(s => (
                <div
                  key={s.id}
                  className="p-3 rounded-xl bg-white dark:bg-slate-950/80 border border-rose-200 dark:border-rose-500/40 flex items-center justify-between transition-all shadow-xs"
                >
                  <div
                    className="cursor-pointer flex-1"
                    onClick={() => { sound.playTargetLock(); onSelectSupplier(s); }}
                  >
                    <div className="font-bold text-sm text-rose-900 dark:text-rose-100">{s.name}</div>
                    <div className="text-xs text-rose-700 dark:text-rose-300/90">{s.insight}</div>
                  </div>
                  <div className="ml-3 flex flex-col items-end gap-1.5">
                    <span className="font-mono font-bold text-rose-600 dark:text-rose-400 text-sm">{s.score} / 100</span>
                    <button
                      onClick={(e) => {
                        e.stopPropagation();
                        sound.playShockwave();
                        onSimulateCascade(s);
                      }}
                      className="px-2.5 py-1 rounded-lg bg-rose-500/15 hover:bg-rose-500/25 border border-rose-400/40 text-[10px] font-mono text-rose-700 dark:text-rose-200 flex items-center gap-1 cursor-pointer transition-colors font-bold"
                    >
                      <Zap className="w-3 h-3 text-rose-600 dark:text-rose-400" />
                      <span>Simulate Shock</span>
                    </button>
                  </div>
                </div>
              ))}
            </div>
          </div>
        ) : (
          <div className="p-4 rounded-2xl bg-emerald-50/70 dark:bg-emerald-950/30 border border-emerald-300 dark:border-emerald-500/40 shadow-sm flex flex-col justify-between">
            <div>
              <div className="flex items-center justify-between pb-2 border-b border-emerald-200 dark:border-emerald-500/30">
                <div className="flex items-center gap-2 text-emerald-700 dark:text-emerald-400 font-mono text-xs font-bold uppercase">
                  <ShieldCheck className="w-4 h-4 text-emerald-600 dark:text-emerald-400" />
                  <span>Critical Contagion Hazard</span>
                </div>
                <span className="px-2 py-0.5 rounded bg-emerald-100 dark:bg-emerald-900/80 text-[10px] text-emerald-800 dark:text-emerald-200 font-mono font-bold">
                  ZERO VULNERABILITIES
                </span>
              </div>
              <div className="mt-4 p-4 rounded-xl bg-white/60 dark:bg-slate-950/60 border border-emerald-200/60 dark:border-emerald-500/20 text-center space-y-2">
                <ShieldCheck className="w-8 h-8 text-emerald-500 mx-auto" />
                <h4 className="font-bold text-sm text-emerald-900 dark:text-emerald-200">
                  All High-Risk MSMEs Remediated
                </h4>
                <p className="text-xs text-slate-600 dark:text-slate-400 max-w-sm mx-auto">
                  Every supplier in the ecosystem is operating above standard trust thresholds (&gt;75) with zero active contagion vectors.
                </p>
              </div>
            </div>
          </div>
        )}
      </div>
    </div>
  );
};
