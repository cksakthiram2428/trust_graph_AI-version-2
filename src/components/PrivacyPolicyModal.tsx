import React from "react";
import { motion } from "motion/react";
import { Shield, X, Lock, FileText, CheckCircle2, Building, Mail, Globe } from "lucide-react";
import { sound } from "../utils/audio";

interface PrivacyPolicyModalProps {
  isOpen: boolean;
  onClose: () => void;
}

export const PrivacyPolicyModal: React.FC<PrivacyPolicyModalProps> = ({ isOpen, onClose }) => {
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
            <div className="p-2.5 rounded-2xl bg-sky-500/10 text-sky-600 dark:text-sky-400">
              <Shield className="w-5 h-5" />
            </div>
            <div>
              <div className="text-[10px] font-mono uppercase tracking-widest text-sky-600 dark:text-sky-400 font-bold">
                Compliance & Trust
              </div>
              <h2 className="text-xl font-bold font-display">Privacy & Data Governance Policy</h2>
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

        {/* Body Content */}
        <div className="p-6 overflow-y-auto space-y-6 text-sm text-slate-700 dark:text-slate-300 leading-relaxed font-sans">
          <div className="p-4 rounded-2xl bg-sky-500/5 dark:bg-sky-500/10 border border-sky-500/20 text-xs font-mono text-sky-800 dark:text-sky-200">
            Last Updated: August 17, 2026 • Valid for Indian Digital Personal Data Protection (DPDP) Act 2023 & MSMED Act 2006 Governance.
          </div>

          <section className="space-y-2">
            <h3 className="text-base font-bold text-slate-900 dark:text-white font-display flex items-center gap-2">
              <Lock className="w-4 h-4 text-sky-500" />
              1. Enterprise Data Ingestion & Scope
            </h3>
            <p>
              TrustGraph AI processes enterprise procurement records, GSTIN identification strings, and Udyam Registration numbers solely to simulate supply chain contagion, assess payment latency under the MSMED Act 2006, and generate risk mitigation scores.
            </p>
          </section>

          <section className="space-y-2">
            <h3 className="text-base font-bold text-slate-900 dark:text-white font-display flex items-center gap-2">
              <FileText className="w-4 h-4 text-indigo-500" />
              2. Government Registry Synchronization
            </h3>
            <p>
              When validating vendor credentials via data.gov.in (Udyam National Portal) or MCA21, all data requests are executed through verified server-side proxies. No proprietary commercial pricing or trade secrets are shared with third-party advertising networks.
            </p>
          </section>

          <section className="space-y-2">
            <h3 className="text-base font-bold text-slate-900 dark:text-white font-display flex items-center gap-2">
              <CheckCircle2 className="w-4 h-4 text-emerald-500" />
              3. AI Model Governance & Confidentiality
            </h3>
            <p>
              Supplier data ingested into our Google Gemini neural pipeline is processed in stateless sessions. Client enterprise datasets are not used to train global public foundational models without explicit organizational consent.
            </p>
          </section>

          <section className="space-y-3 pt-2 border-t border-slate-200 dark:border-white/10">
            <h3 className="text-base font-bold text-slate-900 dark:text-white font-display flex items-center gap-2">
              <Building className="w-4 h-4 text-slate-500" />
              4. Corporate Address & Data Grievance Officer
            </h3>
            <div className="p-4 rounded-2xl bg-slate-50 dark:bg-white/5 border border-slate-200 dark:border-white/10 space-y-2 text-xs font-mono">
              <div className="font-bold text-slate-900 dark:text-white">TrustGraph AI Technologies Private Limited</div>
              <div className="text-slate-600 dark:text-slate-400">
                T-Hub Phase 2, 5th Floor, Knowledge City, Raidurg, Hyderabad, Telangana 500081, India
              </div>
              <div className="flex flex-wrap gap-4 pt-1 text-sky-600 dark:text-sky-400">
                <span className="flex items-center gap-1"><Mail className="w-3.5 h-3.5" /> privacy@trustgraph.ai</span>
                <span className="flex items-center gap-1"><Globe className="w-3.5 h-3.5" /> CIN: U72900TG2024PTC188200</span>
              </div>
            </div>
          </section>
        </div>

        {/* Footer */}
        <div className="p-4 px-6 border-t border-slate-200 dark:border-white/10 bg-slate-50/50 dark:bg-white/5 flex items-center justify-between">
          <span className="text-xs text-slate-500 font-mono">ISO 27001 & SOC 2 Type II Aligned</span>
          <button
            onClick={() => {
              sound.playClick();
              onClose();
            }}
            className="px-5 py-2 rounded-xl bg-slate-900 hover:bg-slate-800 dark:bg-sky-500 dark:hover:bg-sky-600 text-white font-mono text-xs font-bold transition-all cursor-pointer shadow-sm"
          >
            Acknowledge & Close
          </button>
        </div>
      </motion.div>
    </div>
  );
};
