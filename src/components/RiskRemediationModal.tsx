import React from "react";
import { motion, AnimatePresence } from "motion/react";
import { 
  ShieldCheck, 
  CheckCircle2, 
  ArrowRight, 
  TrendingUp, 
  Sparkles, 
  X, 
  AlertTriangle, 
  Building2, 
  FileCheck2, 
  DollarSign, 
  Zap, 
  RefreshCw 
} from "lucide-react";
import { sound } from "../utils/audio";

interface RemediationVendor {
  id: string;
  name: string;
  oldScore: number;
  newScore: number;
  actions: string[];
}

interface RiskRemediationModalProps {
  isOpen: boolean;
  onClose: () => void;
  remediatedVendors: RemediationVendor[];
  totalShieldedCapital: string;
  systemHealth: string;
  durationMs?: number;
  onResetRisks?: () => void;
}

export const RiskRemediationModal: React.FC<RiskRemediationModalProps> = ({
  isOpen,
  onClose,
  remediatedVendors,
  totalShieldedCapital,
  systemHealth,
  durationMs,
  onResetRisks
}) => {
  if (!isOpen) return null;

  return (
    <AnimatePresence>
      <div 
        id="risk-remediation-modal-overlay" 
        className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-black/80 backdrop-blur-md"
      >
        <motion.div
          id="risk-remediation-modal-card"
          initial={{ opacity: 0, scale: 0.95, y: 15 }}
          animate={{ opacity: 1, scale: 1, y: 0 }}
          exit={{ opacity: 0, scale: 0.95, y: 15 }}
          transition={{ duration: 0.25, ease: "easeOut" }}
          className="w-full max-w-3xl max-h-[90vh] bg-white dark:bg-[#0E0E12] border border-emerald-500/30 rounded-2xl shadow-2xl overflow-hidden flex flex-col"
        >
          {/* Header Banner */}
          <div className="px-6 py-5 bg-gradient-to-r from-emerald-600 to-teal-700 text-white flex items-center justify-between">
            <div className="flex items-center gap-3">
              <div className="p-2.5 rounded-xl bg-white/10 backdrop-blur-sm border border-white/20">
                <ShieldCheck className="w-6 h-6 text-white animate-pulse" />
              </div>
              <div>
                <span className="text-[10px] font-mono uppercase tracking-widest text-emerald-100 font-bold">
                  HIGH-LEVEL STATUTORY & OPERATIONAL RISK RECTIFICATION
                </span>
                <h2 className="text-xl font-bold font-display tracking-tight flex items-center gap-2">
                  All Critical Supply Chain Vulnerabilities Neutralized
                </h2>
              </div>
            </div>
            <button
              id="close-remediation-modal-btn"
              onClick={() => {
                sound.playClick();
                onClose();
              }}
              className="p-2 rounded-xl bg-white/10 hover:bg-white/20 text-white transition-colors cursor-pointer"
            >
              <X className="w-5 h-5" />
            </button>
          </div>

          {/* Body Content */}
          <div className="p-6 overflow-y-auto space-y-6 flex-1 text-slate-800 dark:text-slate-200">
            {/* Impact Metric Bar */}
            <div className="grid grid-cols-1 sm:grid-cols-3 gap-3">
              <div className="p-4 rounded-xl bg-emerald-50 dark:bg-emerald-950/30 border border-emerald-200 dark:border-emerald-500/30 flex flex-col justify-between">
                <span className="text-[10px] font-mono uppercase tracking-wider text-emerald-700 dark:text-emerald-400 font-bold">
                  Suppliers Rectified
                </span>
                <div className="text-2xl sm:text-3xl font-mono font-extrabold text-emerald-900 dark:text-emerald-300 mt-1">
                  {remediatedVendors.length} MSMEs
                </div>
                <span className="text-xs text-emerald-600 dark:text-emerald-400 mt-1">
                  Elevated to Very Low Risk
                </span>
              </div>

              <div className="p-4 rounded-xl bg-sky-50 dark:bg-sky-950/30 border border-sky-200 dark:border-sky-500/30 flex flex-col justify-between">
                <span className="text-[10px] font-mono uppercase tracking-wider text-sky-700 dark:text-sky-400 font-bold">
                  Capital Insulated
                </span>
                <div className="text-2xl sm:text-3xl font-mono font-extrabold text-sky-900 dark:text-sky-300 mt-1">
                  {totalShieldedCapital || "₹184.2 L"}
                </div>
                <span className="text-xs text-sky-600 dark:text-sky-400 mt-1">
                  Across Active Purchase Orders
                </span>
              </div>

              <div className="p-4 rounded-xl bg-indigo-50 dark:bg-indigo-950/30 border border-indigo-200 dark:border-indigo-500/30 flex flex-col justify-between">
                <span className="text-[10px] font-mono uppercase tracking-wider text-indigo-700 dark:text-indigo-400 font-bold">
                  Network Resilience Status
                </span>
                <div className="text-xl sm:text-2xl font-bold text-indigo-900 dark:text-indigo-300 mt-1">
                  100% Healthy
                </div>
                <span className="text-xs text-indigo-600 dark:text-indigo-400 mt-1">
                  Zero Contagion Bottlenecks
                </span>
              </div>
            </div>

            {/* Statutory Remediation Breakdown */}
            <div>
              <h3 className="text-sm font-mono uppercase tracking-wider font-bold text-slate-900 dark:text-white mb-3 flex items-center gap-2">
                <FileCheck2 className="w-4 h-4 text-emerald-500" />
                Executed Statutory & Operational Interventions
              </h3>

              <div className="space-y-3">
                {remediatedVendors.map((vendor) => (
                  <div
                    key={vendor.id}
                    className="p-4 rounded-xl bg-slate-50 dark:bg-white/5 border border-slate-200 dark:border-white/10 hover:border-emerald-500/40 transition-colors"
                  >
                    <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-2">
                      <div className="flex items-center gap-2.5">
                        <span className="w-7 h-7 rounded-lg bg-emerald-500/10 text-emerald-600 dark:text-emerald-400 font-mono font-bold text-xs flex items-center justify-center border border-emerald-500/20">
                          {vendor.id}
                        </span>
                        <div>
                          <h4 className="text-sm font-bold text-slate-900 dark:text-white">
                            {vendor.name}
                          </h4>
                          <span className="text-[11px] text-slate-500 font-mono">
                            High-Risk Contagion Vector Remediated
                          </span>
                        </div>
                      </div>

                      {/* Score Shift Pill */}
                      <div className="flex items-center gap-2">
                        <span className="px-2.5 py-1 rounded-md text-xs font-mono font-bold bg-rose-100 dark:bg-rose-950/40 text-rose-700 dark:text-rose-400 line-through">
                          {vendor.oldScore}/100
                        </span>
                        <ArrowRight className="w-3.5 h-3.5 text-slate-400" />
                        <span className="px-2.5 py-1 rounded-md text-xs font-mono font-bold bg-emerald-100 dark:bg-emerald-950/60 text-emerald-800 dark:text-emerald-300 border border-emerald-500/30 flex items-center gap-1">
                          <CheckCircle2 className="w-3.5 h-3.5 text-emerald-500" />
                          {vendor.newScore}/100
                        </span>
                      </div>
                    </div>

                    {/* Action Items */}
                    <div className="mt-3 pt-3 border-t border-slate-200 dark:border-white/10 space-y-1.5">
                      {vendor.actions.map((act, i) => (
                        <div key={i} className="text-xs text-slate-600 dark:text-slate-300 flex items-start gap-2">
                          <CheckCircle2 className="w-3.5 h-3.5 text-emerald-500 shrink-0 mt-0.5" />
                          <span>{act}</span>
                        </div>
                      ))}
                    </div>
                  </div>
                ))}
              </div>
            </div>

            {/* Compliance Guarantee Footnote */}
            <div className="p-4 rounded-xl bg-slate-100 dark:bg-white/5 border border-slate-200 dark:border-white/10 text-xs text-slate-600 dark:text-slate-400 leading-relaxed">
              <strong className="text-slate-900 dark:text-white">MSMED Act 2006 Statutory Shield:</strong> All trade credit lag under Sections 15 & 16 has been resolved to within the statutory 15-day safe threshold using TReDS factoring integration. 3D topology nodes and interconnected supply lines have been stabilized to healthy states.
            </div>
          </div>

          {/* Footer Controls */}
          <div className="px-6 py-4 bg-slate-50 dark:bg-[#14141A] border-t border-slate-200 dark:border-white/10 flex flex-col sm:flex-row items-center justify-between gap-3">
            {onResetRisks && (
              <button
                id="reset-risks-btn"
                onClick={() => {
                  sound.playClick();
                  onResetRisks();
                }}
                className="text-xs font-mono text-slate-500 hover:text-slate-700 dark:hover:text-slate-300 flex items-center gap-1.5 cursor-pointer transition-colors"
              >
                <RefreshCw className="w-3.5 h-3.5" />
                Reset to Stress-Test Baseline
              </button>
            )}

            <button
              id="confirm-remediation-close-btn"
              onClick={() => {
                sound.playAISuccess();
                onClose();
              }}
              className="w-full sm:w-auto px-6 py-2.5 rounded-xl bg-emerald-600 hover:bg-emerald-500 text-white font-mono font-bold text-xs tracking-wider uppercase flex items-center justify-center gap-2 shadow-lg shadow-emerald-600/20 cursor-pointer transition-all"
            >
              <CheckCircle2 className="w-4 h-4" />
              Apply & Close
            </button>
          </div>
        </motion.div>
      </div>
    </AnimatePresence>
  );
};
