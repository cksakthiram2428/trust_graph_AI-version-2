import React, { useState, useEffect } from "react";
import { Supplier, AIAnalysisResult } from "../types";
import { sound } from "../utils/audio";
import { 
  X, 
  Sparkles, 
  ShieldAlert, 
  ShieldCheck, 
  TrendingUp, 
  AlertTriangle, 
  Clock, 
  Download, 
  Share2, 
  Building, 
  FileCheck, 
  CheckCircle,
  ExternalLink,
  ChevronRight
} from "lucide-react";

interface SupplierDetailDrawerProps {
  supplier: Supplier | null;
  onClose: () => void;
  onSimulateCascade: (supplier: Supplier) => void;
}

export const SupplierDetailDrawer: React.FC<SupplierDetailDrawerProps> = ({
  supplier,
  onClose,
  onSimulateCascade
}) => {
  const [aiData, setAiData] = useState<AIAnalysisResult | null>(null);
  const [loadingAI, setLoadingAI] = useState<boolean>(false);
  const [shareCopied, setShareCopied] = useState<boolean>(false);

  useEffect(() => {
    if (!supplier) return;
    fetchAIDiagnostics(supplier.id);
  }, [supplier]);

  const fetchAIDiagnostics = async (supplierId: string) => {
    setLoadingAI(true);
    try {
      const res = await fetch("/api/ai/analyze-supplier", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ supplierId })
      });
      const data = await res.json();
      setAiData(data);
      sound.playAISuccess();
    } catch (e) {
      console.error(e);
    } finally {
      setLoadingAI(false);
    }
  };

  if (!supplier) return null;

  const handleShare = async () => {
    sound.playClick();
    if (navigator.share) {
      try {
        await navigator.share({
          title: `TrustGraph AI Forensic Audit: ${supplier.name}`,
          text: `Supplier ${supplier.name} has a Trust Score of ${supplier.score}/100 with ${supplier.risk}. Verified by TrustGraph AI.`,
          url: window.location.href
        });
      } catch (err) {
        // Share cancelled
      }
    } else {
      navigator.clipboard.writeText(
        `TrustGraph AI Audit for ${supplier.name}: Trust Score ${supplier.score}/100 (${supplier.risk}). Delivery: ${supplier.deliveryReliability}, Quality: ${supplier.qualityRate}.`
      );
      setShareCopied(true);
      setTimeout(() => setShareCopied(false), 2500);
    }
  };

  const circumference = 2 * Math.PI * 40;
  const strokeDashoffset = circumference - (supplier.score / 100) * circumference;

  return (
    <div
      id="supplier-detail-drawer"
      className="fixed inset-y-0 right-0 z-50 w-full max-w-xl bg-slate-950/95 backdrop-blur-2xl border-l border-cyan-500/30 shadow-2xl overflow-y-auto p-6 sm:p-8 animate-in slide-in-from-right duration-300"
    >
      {/* Drawer Header */}
      <div className="flex items-start justify-between pb-4 border-b border-slate-800">
        <div>
          <div className="flex items-center gap-2">
            <span className="px-2 py-0.5 rounded text-[10px] font-mono uppercase bg-slate-800 text-cyan-300 font-bold">
              {supplier.tier}
            </span>
            {supplier.dataSource === "real_registration" ? (
              <span className="px-2 py-0.5 rounded text-[9px] font-mono uppercase bg-emerald-500/20 border border-emerald-500/40 text-emerald-300 font-bold">
                ✓ Govt Udyam / MCA Verified
              </span>
            ) : (
              <span className="px-2 py-0.5 rounded text-[9px] font-mono uppercase bg-cyan-500/10 border border-cyan-500/20 text-cyan-300 font-bold">
                Algorithmically Simulated Baseline
              </span>
            )}
            <span className="text-xs font-mono text-slate-400">
              GSTIN: {supplier.gstin}
            </span>
          </div>
          <h2 className="mt-1.5 text-2xl font-bold text-white tracking-tight font-mono">
            {supplier.name}
          </h2>
          <p className="text-xs text-slate-400">
            {supplier.industry} • {supplier.city}
          </p>
          {supplier.udyamNumber && (
            <div className="mt-1 flex items-center gap-3 text-[11px] font-mono text-emerald-400">
              <span>Udyam: {supplier.udyamNumber}</span>
              {supplier.nicCode && <span>NIC: {supplier.nicCode}</span>}
              {supplier.mcaCin && <span>CIN: {supplier.mcaCin}</span>}
            </div>
          )}
        </div>

        <button
          id="close-drawer-btn"
          onClick={() => { sound.playClick(); onClose(); }}
          className="p-2 rounded-xl bg-slate-900 hover:bg-slate-800 text-slate-400 hover:text-white transition-colors cursor-pointer"
        >
          <X className="w-5 h-5" />
        </button>
      </div>

      {/* Holographic Trust Score & KPI Breakdown */}
      <div className="mt-6 p-5 rounded-2xl cyber-glass border border-cyan-500/30 flex flex-col sm:flex-row items-center justify-between gap-6">
        {/* Holographic Circular Meter */}
        <div className="relative w-28 h-28 flex items-center justify-center shrink-0">
          <svg className="w-28 h-28 -rotate-90">
            <circle cx="56" cy="56" r="40" stroke="#1e293b" strokeWidth="6" fill="transparent" />
            <circle
              cx="56"
              cy="56"
              r="40"
              stroke={supplier.score >= 75 ? "#10b981" : supplier.score >= 50 ? "#eab308" : "#ef4444"}
              strokeWidth="6"
              strokeDasharray={circumference}
              strokeDashoffset={strokeDashoffset}
              strokeLinecap="round"
              fill="transparent"
              className="transition-all duration-1000 ease-out"
            />
          </svg>
          <div className="absolute flex flex-col items-center justify-center">
            <span className="text-2xl font-extrabold font-mono text-white">
              {supplier.score}
            </span>
            <span className="text-[10px] font-mono text-cyan-300 uppercase">
              Trust Rating
            </span>
          </div>
        </div>

        {/* Operational Stats Grid */}
        <div className="grid grid-cols-2 gap-2.5 w-full text-xs">
          <div className="p-2 rounded-lg bg-slate-900/80 border border-slate-800">
            <span className="text-[10px] text-slate-400 font-mono block">Payment Lag</span>
            <span className="font-semibold text-slate-100">{supplier.paymentDelay}</span>
          </div>
          <div className="p-2 rounded-lg bg-slate-900/80 border border-slate-800">
            <span className="text-[10px] text-slate-400 font-mono block">Fulfillment Reliability</span>
            <span className="font-semibold text-emerald-400">{supplier.deliveryReliability}</span>
          </div>
          <div className="p-2 rounded-lg bg-slate-900/80 border border-slate-800">
            <span className="text-[10px] text-slate-400 font-mono block">Quality Acceptance</span>
            <span className="font-semibold text-cyan-300">{supplier.qualityRate}</span>
          </div>
          <div className="p-2 rounded-lg bg-slate-900/80 border border-slate-800">
            <span className="text-[10px] text-slate-400 font-mono block">Monthly Volume</span>
            <span className="font-semibold text-indigo-300">{supplier.monthlyVolumeINR}</span>
          </div>
        </div>
      </div>

      {/* Gemini AI Deep Forensic Analysis Section */}
      <div className="mt-6 space-y-4">
        <div className="flex items-center justify-between">
          <div className="flex items-center gap-2">
            <Sparkles className="w-4 h-4 text-cyan-400 animate-pulse" />
            <span className="font-mono text-xs font-bold text-cyan-300 uppercase tracking-wider">
              Gemini AI Neural Risk Diagnostic
            </span>
          </div>
          {loadingAI && (
            <span className="text-[10px] font-mono text-cyan-400 animate-pulse">
              Running neural audit...
            </span>
          )}
        </div>

        {aiData ? (
          <div className="space-y-4">
            {/* Executive AI Summary */}
            <div className="p-4 rounded-xl bg-slate-900/90 border border-cyan-500/30 text-sm text-slate-200 leading-relaxed font-sans shadow-lg">
              <span className="text-xs font-bold font-mono text-cyan-400 uppercase block mb-1">
                Risk Analysis & Audit Findings
              </span>
              {aiData.executiveSummary || aiData.analysis}
            </div>

            {/* Contagion Potential Box */}
            <div className="p-3.5 rounded-xl bg-slate-900/70 border border-slate-800 text-xs">
              <span className="font-mono text-[10px] font-bold text-amber-400 uppercase block mb-1">
                Systemic Contagion Ripple Effect
              </span>
              <p className="text-slate-300">{aiData.contagionPotential}</p>
            </div>

            {/* Key Bottlenecks */}
            {aiData.keyBottlenecks && aiData.keyBottlenecks.length > 0 && (
              <div className="p-3.5 rounded-xl bg-slate-900/70 border border-slate-800 text-xs">
                <span className="font-mono text-[10px] font-bold text-rose-400 uppercase block mb-2">
                  Identified Critical Bottlenecks
                </span>
                <ul className="space-y-1.5">
                  {aiData.keyBottlenecks.map((b, idx) => (
                    <li key={idx} className="flex items-start gap-2 text-slate-300">
                      <AlertTriangle className="w-3.5 h-3.5 text-rose-400 shrink-0 mt-0.5" />
                      <span>{b}</span>
                    </li>
                  ))}
                </ul>
              </div>
            )}

            {/* AI Action Playbook */}
            {aiData.aiActionPlan && aiData.aiActionPlan.length > 0 && (
              <div className="p-3.5 rounded-xl bg-slate-900/70 border border-slate-800 text-xs">
                <span className="font-mono text-[10px] font-bold text-emerald-400 uppercase block mb-2">
                  Strategic Dual-Sourcing & Mitigation Actions
                </span>
                <ul className="space-y-1.5">
                  {aiData.aiActionPlan.map((action, idx) => (
                    <li key={idx} className="flex items-start gap-2 text-slate-300">
                      <CheckCircle className="w-3.5 h-3.5 text-emerald-400 shrink-0 mt-0.5" />
                      <span>{action}</span>
                    </li>
                  ))}
                </ul>
              </div>
            )}

            {/* Recommended Alternative Suppliers */}
            {aiData.recommendedAlternatives && aiData.recommendedAlternatives.length > 0 && (
              <div className="p-3.5 rounded-xl bg-slate-900/70 border border-slate-800 text-xs">
                <span className="font-mono text-[10px] font-bold text-cyan-400 uppercase block mb-2">
                  Pre-Vetted Alternate Vendor Recommendations
                </span>
                <div className="grid grid-cols-1 sm:grid-cols-2 gap-2">
                  {aiData.recommendedAlternatives.map((alt, idx) => (
                    <div key={idx} className="p-2.5 rounded-lg bg-slate-950 border border-slate-800">
                      <div className="font-bold text-slate-200">{alt.name}</div>
                      <div className="text-[11px] text-slate-400 mt-0.5">{alt.location} • Lead: {alt.leadTime}</div>
                      <div className="mt-1 text-[11px] font-mono text-emerald-400 font-bold">
                        {alt.score}/100 Trust Score
                      </div>
                    </div>
                  ))}
                </div>
              </div>
            )}
          </div>
        ) : (
          <div className="p-8 rounded-xl bg-slate-900/40 border border-slate-800 text-center text-xs text-slate-400">
            Fetching forensic AI telemetry...
          </div>
        )}
      </div>

      {/* Action Footer Bar */}
      <div className="mt-8 pt-4 border-t border-slate-800 flex flex-wrap items-center justify-between gap-3">
        <div className="flex items-center gap-2">
          <a
            href={`/api/supplier/report/${supplier.id}`}
            download
            className="px-3.5 py-2 rounded-xl bg-slate-900 hover:bg-slate-850 border border-slate-700 text-xs font-mono text-slate-200 flex items-center gap-2 transition-colors cursor-pointer"
          >
            <Download className="w-3.5 h-3.5 text-cyan-400" />
            <span>Export Audit JSON</span>
          </a>

          <button
            id="share-supplier-audit-btn"
            onClick={handleShare}
            className="px-3.5 py-2 rounded-xl bg-slate-900 hover:bg-slate-850 border border-slate-700 text-xs font-mono text-slate-200 flex items-center gap-2 transition-colors cursor-pointer"
          >
            <Share2 className="w-3.5 h-3.5 text-cyan-400" />
            <span>{shareCopied ? "Copied!" : "Share Audit"}</span>
          </button>
        </div>

        <button
          id="simulate-drawer-shock-btn"
          onClick={() => {
            sound.playShockwave();
            onSimulateCascade(supplier);
          }}
          className="px-4 py-2 rounded-xl bg-gradient-to-r from-rose-600 to-amber-600 hover:from-rose-500 hover:to-amber-500 text-white font-bold font-mono text-xs flex items-center gap-1.5 shadow-lg shadow-rose-600/20 cursor-pointer transition-all"
        >
          <ShieldAlert className="w-3.5 h-3.5" />
          <span>Cascade Stress Test</span>
        </button>
      </div>
    </div>
  );
};
