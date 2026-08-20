import React from "react";
import { sound } from "../utils/audio";
import { 
  TrendingUp, 
  ShieldCheck, 
  Layers, 
  Cpu, 
  PieChart, 
  Award, 
  AlertCircle, 
  ExternalLink,
  Activity
} from "lucide-react";

export const ResearchHub: React.FC = () => {
  const researchItems = [
    {
      title: "Semiconductor Sourcing Vulnerabilities in Indian MSMEs",
      tag: "Electronics",
      date: "Q3 2026",
      summary: "Tier-2 and Tier-3 component assemblers in Karnataka and Tamil Nadu face 18-day average port customs clearance variations during monsoon quarter. TrustGraph AI reduces buffer overstocking by 34% through predictive lot tracking.",
      impact: "₹4.2 Cr Saved"
    },
    {
      title: "WHO-GMP Certificate Audit Lapses in Active Pharma Ingredients",
      tag: "Pharma",
      date: "Q3 2026",
      summary: "Regulatory inspections triggered 14 vendor quality hold notices across Gujarat and Telangana chemical corridors. Real-time dual-sourcing triggers protected 48 MSME formulation plants from assembly line stalls.",
      impact: "Zero Line Shutdowns"
    },
    {
      title: "MSME SAMADHAAN Delayed Payments Recovery Optimization",
      tag: "Policy & Finance",
      date: "Q2 2026",
      summary: "Leveraging Section 15-24 of the MSMED Act, TrustGraph AI flags payment delays exceeding 45-day statutory thresholds before non-performing asset classification occurs.",
      impact: "18-Day Faster Settlement"
    }
  ];

  return (
    <div id="research-hub-section" className="w-full space-y-6">
      {/* Top Banner */}
      <div className="p-6 rounded-2xl bg-white dark:bg-[#0E0E12] border border-slate-200 dark:border-cyan-500/30 shadow-sm flex flex-col md:flex-row items-start md:items-center justify-between gap-4 transition-colors">
        <div>
          <div className="flex items-center gap-2">
            <span className="w-2 h-2 rounded-full bg-sky-500 dark:bg-cyan-400 animate-ping" />
            <span className="text-xs font-mono text-sky-700 dark:text-cyan-400 uppercase tracking-wider font-bold">
              MSME Intelligence &amp; Neural Scoring Framework
            </span>
          </div>
          <h2 className="mt-1 text-lg sm:text-2xl font-bold text-slate-900 dark:text-white tracking-tight font-display">
            How TrustGraph AI Evaluates &amp; Protects Supply Chains
          </h2>
          <p className="text-xs text-slate-700 dark:text-slate-300 mt-1 max-w-2xl font-sans leading-relaxed">
            Our multi-layer graph model combines operational fulfillment telemetry, payment delay metrics, and quality control audits into an explainable 0–100 composite trust index.
          </p>
        </div>

        <div className="p-4 rounded-xl bg-slate-900 text-white dark:bg-slate-900/90 border border-slate-800 dark:border-slate-700/80 text-right shadow-md shrink-0">
          <div className="text-xs text-slate-300 dark:text-slate-400 font-mono">Model Calibration</div>
          <div className="text-xl font-mono font-extrabold text-cyan-300">94.2% Accuracy</div>
          <div className="text-[10px] text-slate-300 dark:text-slate-400">Validated against 12-month default histories</div>
        </div>
      </div>

      {/* KPI Weightage & Mathematical Architecture */}
      <div className="grid grid-cols-1 md:grid-cols-4 gap-4">
        <div className="p-4 rounded-2xl bg-white dark:bg-[#0E0E12] border border-sky-200 dark:border-cyan-500/20 shadow-sm transition-colors">
          <div className="flex items-center justify-between">
            <span className="font-mono text-xs font-bold text-sky-700 dark:text-cyan-400 uppercase tracking-wider">Weight: 40%</span>
            <Activity className="w-4 h-4 text-sky-600 dark:text-cyan-400" />
          </div>
          <h3 className="mt-2 font-bold text-sm text-slate-900 dark:text-white font-display">Delivery Reliability</h3>
          <p className="mt-1 text-xs text-slate-600 dark:text-slate-400 font-sans leading-relaxed">
            Percentage of purchase order shipments delivered within the contractual agreed lead time window.
          </p>
        </div>

        <div className="p-4 rounded-2xl bg-white dark:bg-[#0E0E12] border border-emerald-200 dark:border-emerald-500/20 shadow-sm transition-colors">
          <div className="flex items-center justify-between">
            <span className="font-mono text-xs font-bold text-emerald-700 dark:text-emerald-400 uppercase tracking-wider">Weight: 35%</span>
            <ShieldCheck className="w-4 h-4 text-emerald-600 dark:text-emerald-400" />
          </div>
          <h3 className="mt-2 font-bold text-sm text-slate-900 dark:text-white font-display">Quality Acceptance</h3>
          <p className="mt-1 text-xs text-slate-600 dark:text-slate-400 font-sans leading-relaxed">
            Batch inspection pass rate, defect return ratios, and statutory certificate compliance.
          </p>
        </div>

        <div className="p-4 rounded-2xl bg-white dark:bg-[#0E0E12] border border-amber-200 dark:border-amber-500/20 shadow-sm transition-colors">
          <div className="flex items-center justify-between">
            <span className="font-mono text-xs font-bold text-amber-700 dark:text-amber-400 uppercase tracking-wider">Weight: High Penalty</span>
            <AlertCircle className="w-4 h-4 text-amber-600 dark:text-amber-400" />
          </div>
          <h3 className="mt-2 font-bold text-sm text-slate-900 dark:text-white font-display">Payment Settlement Lag</h3>
          <p className="mt-1 text-xs text-slate-600 dark:text-slate-400 font-sans leading-relaxed">
            Average days beyond due date taken to settle sub-tier supplier invoices.
          </p>
        </div>

        <div className="p-4 rounded-2xl bg-white dark:bg-[#0E0E12] border border-rose-200 dark:border-rose-500/20 shadow-sm transition-colors">
          <div className="flex items-center justify-between">
            <span className="font-mono text-xs font-bold text-rose-700 dark:text-rose-400 uppercase tracking-wider">Weight: High Penalty</span>
            <AlertCircle className="w-4 h-4 text-rose-600 dark:text-rose-400" />
          </div>
          <h3 className="mt-2 font-bold text-sm text-slate-900 dark:text-white font-display">Unresolved Grievances</h3>
          <p className="mt-1 text-xs text-slate-600 dark:text-slate-400 font-sans leading-relaxed">
            Escalated commercial disputes, quality non-conformances, and statutory notices.
          </p>
        </div>
      </div>

      {/* Industry Research Deep Dives */}
      <div className="space-y-4">
        <h3 className="font-mono text-sm font-bold text-slate-900 dark:text-slate-200 uppercase tracking-wider">
          Supply Chain Intelligence Briefings
        </h3>

        <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
          {researchItems.map((item, idx) => (
            <div
              key={idx}
              className="p-5 rounded-2xl bg-white dark:bg-[#0E0E12] border border-slate-200 dark:border-white/10 hover:border-sky-400 dark:hover:border-cyan-500/40 shadow-sm hover:shadow-md transition-all flex flex-col justify-between"
            >
              <div>
                <div className="flex items-center justify-between">
                  <span className="px-2.5 py-1 rounded-lg text-[10px] font-mono font-bold bg-slate-900 text-cyan-300 dark:bg-cyan-950/80 dark:border dark:border-cyan-500/30">
                    {item.tag}
                  </span>
                  <span className="text-[10px] font-mono text-slate-500 dark:text-slate-400">{item.date}</span>
                </div>

                <h4 className="mt-3 font-bold text-sm text-slate-900 dark:text-white leading-snug font-display">
                  {item.title}
                </h4>
                <p className="mt-2 text-xs text-slate-600 dark:text-slate-300 leading-relaxed font-sans">
                  {item.summary}
                </p>
              </div>

              <div className="mt-4 pt-3 border-t border-slate-100 dark:border-slate-800/80 flex items-center justify-between text-xs font-mono">
                <span className="text-[11px] text-emerald-700 dark:text-emerald-400 font-bold">
                  {item.impact}
                </span>
                <span className="text-[10px] text-slate-600 dark:text-slate-400">Verified Case</span>
              </div>
            </div>
          ))}
        </div>
      </div>
    </div>
  );
};
