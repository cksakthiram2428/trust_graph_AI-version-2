import React from "react";
import { motion } from "motion/react";
import { CheckCircle, Download, ArrowRight, X, ShieldCheck, Sparkles, Building, ExternalLink } from "lucide-react";
import { sound } from "../utils/audio";

interface ThankYouModalProps {
  isOpen: boolean;
  onClose: () => void;
  title?: string;
  message?: string;
  referenceId?: string;
  onNavigateToGraph?: () => void;
}

export const ThankYouModal: React.FC<ThankYouModalProps> = ({
  isOpen,
  onClose,
  title = "MSME Audit Assessment Generated",
  message = "Your supply chain risk intelligence request has been processed and synchronized with Udyam and MSMED Act statutory databases.",
  referenceId = `TG-AUDIT-${Math.floor(100000 + Math.random() * 900000)}`,
  onNavigateToGraph
}) => {
  if (!isOpen) return null;

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-black/75 backdrop-blur-md">
      <motion.div
        initial={{ opacity: 0, scale: 0.92, y: 20 }}
        animate={{ opacity: 1, scale: 1, y: 0 }}
        exit={{ opacity: 0, scale: 0.92, y: 20 }}
        className="w-full max-w-lg rounded-3xl bg-white dark:bg-[#0C0C14] border border-slate-200 dark:border-white/10 shadow-2xl p-6 sm:p-8 text-slate-900 dark:text-white space-y-6 relative overflow-hidden"
      >
        {/* Ambient Top Glow */}
        <div className="absolute top-0 left-1/2 -translate-x-1/2 w-64 h-32 bg-emerald-500/15 rounded-full blur-3xl pointer-events-none" />

        <div className="flex items-start justify-between">
          <div className="w-14 h-14 rounded-2xl bg-emerald-500/10 dark:bg-emerald-500/20 text-emerald-600 dark:text-emerald-400 flex items-center justify-center border border-emerald-500/30">
            <CheckCircle className="w-8 h-8 animate-bounce" />
          </div>
          <button
            onClick={() => {
              sound.playClick();
              onClose();
            }}
            className="p-2 rounded-xl text-slate-400 hover:text-slate-900 dark:hover:text-white hover:bg-slate-100 dark:hover:bg-white/10 transition-colors cursor-pointer"
          >
            <X className="w-5 h-5" />
          </button>
        </div>

        <div className="space-y-2">
          <div className="text-[10px] font-mono uppercase tracking-widest text-emerald-600 dark:text-emerald-400 font-bold flex items-center gap-1.5">
            <ShieldCheck className="w-3.5 h-3.5" />
            Verification Successful
          </div>
          <h2 className="text-2xl font-bold font-display">{title}</h2>
          <p className="text-xs sm:text-sm text-slate-600 dark:text-slate-300 leading-relaxed">
            {message}
          </p>
        </div>

        {/* Reference Box */}
        <div className="p-4 rounded-2xl bg-slate-50 dark:bg-white/5 border border-slate-200 dark:border-white/10 space-y-2 font-mono text-xs">
          <div className="flex items-center justify-between text-slate-500 dark:text-slate-400 text-[10px] uppercase">
            <span>Reference Tracking ID</span>
            <span>Status: Active In Knowledge Graph</span>
          </div>
          <div className="text-sm font-bold text-sky-600 dark:text-sky-400 tracking-wider">
            {referenceId}
          </div>
          <div className="text-[11px] text-slate-500">
            Timestamp: {new Date().toUTCString()}
          </div>
        </div>

        {/* Action Buttons */}
        <div className="flex flex-col sm:flex-row items-center gap-3 pt-2">
          {onNavigateToGraph && (
            <button
              onClick={() => {
                sound.playClick();
                onClose();
                onNavigateToGraph();
              }}
              className="w-full sm:flex-1 py-3 rounded-xl bg-sky-500 hover:bg-sky-600 text-white font-mono text-xs font-bold uppercase tracking-wider flex items-center justify-center gap-2 transition-all shadow-md shadow-sky-500/25 cursor-pointer"
            >
              <span>Explore In 3D Graph</span>
              <ArrowRight className="w-4 h-4" />
            </button>
          )}
          <button
            onClick={() => {
              sound.playClick();
              onClose();
            }}
            className="w-full sm:w-auto px-5 py-3 rounded-xl bg-slate-100 hover:bg-slate-200 dark:bg-white/10 dark:hover:bg-white/15 border border-slate-200 dark:border-white/10 text-slate-700 dark:text-slate-200 font-mono text-xs font-semibold transition-all cursor-pointer"
          >
            Done
          </button>
        </div>
      </motion.div>
    </div>
  );
};
