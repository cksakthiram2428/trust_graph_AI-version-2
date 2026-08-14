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
      <div className="p-6 rounded-2xl cyber-glass border border-cyan-500/30 flex flex-col md:flex-row items-start md:items-center justify-between gap-4">
        <div>
          <div className="flex items-center gap-2">
            <span className="w-2 h-2 rounded-full bg-cyan-400 animate-ping" />
            <span className="text-xs font-mono text-cyan-300 uppercase tracking-wider font-semibold">
              MSME Intelligence & Neural Scoring Framework
            </span>
          </div>
          <h2 className="mt-1 text-2xl font-bold text-white tracking-tight font-mono">
            How TrustGraph AI Evaluates &amp; Protects Supply Chains
          </h2>
          <p className="text-xs text-slate-300 mt-1 max-w-2xl">
            Our multi-layer graph model combines operational fulfillment telemetry, payment delay metrics, and quality control audits into an explainable 0–100 composite trust index.
          </p>
        </div>

        <div className="p-4 rounded-xl bg-slate-900/80 border border-slate-700/80 text-right">
          <div className="text-xs text-slate-400 font-mono">Model Calibration</div>
          <div className="text-xl font-mono font-extrabold text-cyan-300">94.2% Accuracy</div>
          <div className="text-[10px] text-slate-400">Validated against 12-month default histories</div>
        </div>
      </div>

      {/* KPI Weightage & Mathematical Architecture */}
      <div className="grid grid-cols-1 md:grid-cols-4 gap-4">
        <div className="p-4 rounded-xl cyber-glass border border-cyan-500/20">
          <div className="flex items-center justify-between">
            <span className="font-mono text-xs font-bold text-cyan-400 uppercase">Weight: 40%</span>
            <Activity className="w-4 h-4 text-cyan-400" />
          </div>
          <h3 className="mt-2 font-bold text-sm text-white">Delivery Reliability</h3>
          <p className="mt-1 text-xs text-slate-400">
            Percentage of purchase order shipments delivered within the contractual agreed lead time window.
          </p>
        </div>

        <div className="p-4 rounded-xl cyber-glass border border-emerald-500/20">
          <div className="flex items-center justify-between">
            <span className="font-mono text-xs font-bold text-emerald-400 uppercase">Weight: 35%</span>
            <ShieldCheck className="w-4 h-4 text-emerald-400" />
          </div>
          <h3 className="mt-2 font-bold text-sm text-white">Quality Acceptance</h3>
          <p className="mt-1 text-xs text-slate-400">
            Batch inspection pass rate, defect return ratios, and statutory certificate compliance.
          </p>
        </div>

        <div className="p-4 rounded-xl cyber-glass border border-amber-500/20">
          <div className="flex items-center justify-between">
            <span className="font-mono text-xs font-bold text-amber-400 uppercase">Weight: High Penalty</span>
            <AlertCircle className="w-4 h-4 text-amber-400" />
          </div>
          <h3 className="mt-2 font-bold text-sm text-white">Payment Settlement Lag</h3>
          <p className="mt-1 text-xs text-slate-400">
            Average days beyond due date taken to settle sub-tier supplier invoices.
          </p>
        </div>

        <div className="p-4 rounded-xl cyber-glass border border-rose-500/20">
          <div className="flex items-center justify-between">
            <span className="font-mono text-xs font-bold text-rose-400 uppercase">Weight: High Penalty</span>
            <AlertCircle className="w-4 h-4 text-rose-400" />
          </div>
          <h3 className="mt-2 font-bold text-sm text-white">Unresolved Grievances</h3>
          <p className="mt-1 text-xs text-slate-400">
            Escalated commercial disputes, quality non-conformances, and statutory notices.
          </p>
        </div>
      </div>

      {/* Industry Research Deep Dives */}
      <div className="space-y-4">
        <h3 className="font-mono text-sm font-bold text-slate-200 uppercase tracking-wider">
          Supply Chain Intelligence Briefings
        </h3>

        <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
          {researchItems.map((item, idx) => (
            <div
              key={idx}
              className="p-5 rounded-2xl cyber-glass border border-slate-800 hover:border-cyan-500/40 transition-all flex flex-col justify-between"
            >
              <div>
                <div className="flex items-center justify-between">
                  <span className="px-2 py-0.5 rounded text-[10px] font-mono bg-cyan-950/80 border border-cyan-500/30 text-cyan-300">
                    {item.tag}
                  </span>
                  <span className="text-[10px] font-mono text-slate-400">{item.date}</span>
                </div>

                <h4 className="mt-3 font-bold text-sm text-white leading-snug">
                  {item.title}
                </h4>
                <p className="mt-2 text-xs text-slate-300 leading-relaxed">
                  {item.summary}
                </p>
              </div>

              <div className="mt-4 pt-3 border-t border-slate-800/80 flex items-center justify-between text-xs">
                <span className="font-mono text-[11px] text-emerald-400 font-semibold">
                  {item.impact}
                </span>
                <span className="text-[10px] text-slate-400 font-mono">Verified Case</span>
              </div>
            </div>
          ))}
        </div>
      </div>
    </div>
  );
};
