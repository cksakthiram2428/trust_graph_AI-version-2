import React from "react";
import { motion } from "motion/react";
import { Scale, X, ShieldAlert, FileText, CheckCircle2, Building, Mail } from "lucide-react";
import { sound } from "../utils/audio";

interface TermsPageModalProps {
  isOpen: boolean;
  onClose: () => void;
}

export const TermsPageModal: React.FC<TermsPageModalProps> = ({ isOpen, onClose }) => {
  if (!isOpen) return null;

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-black/70 backdrop-blur-md">
      <motion.div
        initial={{ opacity: 0, scale: 0.95, y: 15 }}
        animate={{ opacity: 1, scale: 1, y: 0 }}
        exit={{ opacity: 0, scale: 0.95, y: 15 }}
        className="w-full max-w-3xl max-h-[85vh] flex flex-col rounded-3xl bg-white dark:bg-[#0C0C12] border border-slate-200 dark:border-white/10 shadow-2xl text-slate-900 dark:text-slate-100 overflow-hidden"
      >
        {/* Header */}
        <div className="p-6 border-b border-slate-200 dark:border-white/10 flex items-center justify-between bg-slate-50/50 dark:bg-white/5">
          <div className="flex items-center gap-3">
            <div className="p-2.5 rounded-2xl bg-indigo-500/10 text-indigo-600 dark:text-indigo-400">
              <Scale className="w-5 h-5" />
            </div>
            <div>
              <div className="text-[10px] font-mono uppercase tracking-widest text-indigo-600 dark:text-indigo-400 font-bold">
                Statutory Agreement
              </div>
              <h2 className="text-xl font-bold font-display">Terms of Service & Analytics Disclosure</h2>
            </div>
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

        {/* Body */}
        <div className="p-6 overflow-y-auto space-y-6 text-sm text-slate-700 dark:text-slate-300 leading-relaxed font-sans">
          <div className="p-4 rounded-2xl bg-indigo-500/5 dark:bg-indigo-500/10 border border-indigo-500/20 text-xs font-mono text-indigo-800 dark:text-indigo-200">
            Governed by the laws of India. Jurisdiction: Hyderabad, Telangana.
          </div>

          <section className="space-y-2">
            <h3 className="text-base font-bold text-slate-900 dark:text-white font-display flex items-center gap-2">
              <FileText className="w-4 h-4 text-indigo-500" />
              1. MSME Risk Intelligence Platform Usage
            </h3>
            <p>
              TrustGraph AI provides predictive analytics, contagion graph simulations, and MSMED Act 2006 compliance heuristics. The scores and simulations provided are decision-support estimates and do not constitute formal legal or financial audits.
            </p>
          </section>

          <section className="space-y-2">
            <h3 className="text-base font-bold text-slate-900 dark:text-white font-display flex items-center gap-2">
              <ShieldAlert className="w-4 h-4 text-amber-500" />
              2. Data Ingestion & Invariant GSTIN Verification
            </h3>
            <p>
              Users are solely responsible for the authenticity of CSV uploads and proprietary records ingested. Users agree not to input unauthorized personal identification data without consent from respective legal entities.
            </p>
          </section>

          <section className="space-y-2">
            <h3 className="text-base font-bold text-slate-900 dark:text-white font-display flex items-center gap-2">
              <CheckCircle2 className="w-4 h-4 text-emerald-500" />
              3. Limitation of Liability
            </h3>
            <p>
              Under no circumstances shall TrustGraph AI Technologies Pvt. Ltd. be liable for indirect, consequential, or operational delays arising from third-party vendor defaults or natural climate disruptions identified by the real-time radar.
            </p>
          </section>

          <section className="space-y-3 pt-2 border-t border-slate-200 dark:border-white/10">
            <h3 className="text-base font-bold text-slate-900 dark:text-white font-display flex items-center gap-2">
              <Building className="w-4 h-4 text-slate-500" />
              4. Corporate Address & Legal Enquiries
            </h3>
            <div className="p-4 rounded-2xl bg-slate-50 dark:bg-white/5 border border-slate-200 dark:border-white/10 space-y-2 text-xs font-mono">
              <div className="font-bold text-slate-900 dark:text-white">TrustGraph AI Technologies Private Limited</div>
              <div className="text-slate-600 dark:text-slate-400">
                T-Hub Phase 2, 5th Floor, Knowledge City, Raidurg, Hyderabad, Telangana 500081, India
              </div>
              <div className="text-indigo-600 dark:text-indigo-400 flex items-center gap-1.5 pt-1">
                <Mail className="w-3.5 h-3.5" /> legal@trustgraph.ai
              </div>
            </div>
          </section>
        </div>

        {/* Footer */}
        <div className="p-4 px-6 border-t border-slate-200 dark:border-white/10 bg-slate-50/50 dark:bg-white/5 flex items-center justify-between">
          <span className="text-xs text-slate-500 font-mono">Indian Arbitration & Conciliation Act 1996</span>
          <button
            onClick={() => {
              sound.playClick();
              onClose();
            }}
            className="px-5 py-2 rounded-xl bg-slate-900 hover:bg-slate-800 dark:bg-indigo-600 dark:hover:bg-indigo-700 text-white font-mono text-xs font-bold transition-all cursor-pointer shadow-sm"
          >
            Accept & Agree
          </button>
        </div>
      </motion.div>
    </div>
  );
};
