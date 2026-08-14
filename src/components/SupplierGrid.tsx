import React, { useState } from "react";
import { Supplier } from "../types";
import { TiltCard } from "./TiltCard";
import { sound } from "../utils/audio";
import { 
  Search, 
  Filter, 
  Sparkles, 
  Zap, 
  Eye, 
  Edit3, 
  Trash2, 
  Plus, 
  Clock, 
  CheckCircle2, 
  AlertCircle, 
  ShieldAlert,
  Download,
  Share2
} from "lucide-react";

interface SupplierGridProps {
  suppliers: Supplier[];
  onSelectSupplier: (supplier: Supplier) => void;
  onSimulateCascade: (supplier: Supplier) => void;
  onEditSupplier: (supplier: Supplier) => void;
  onDeleteSupplier: (supplierId: string) => void;
  onAddSupplier: () => void;
  onAddCsv?: () => void;
  onFocusIn3D: (supplierId: string) => void;
}

export const SupplierGrid: React.FC<SupplierGridProps> = ({
  suppliers,
  onSelectSupplier,
  onSimulateCascade,
  onEditSupplier,
  onDeleteSupplier,
  onAddSupplier,
  onAddCsv,
  onFocusIn3D
}) => {
  const [searchTerm, setSearchTerm] = useState("");
  const [selectedIndustry, setSelectedIndustry] = useState("All");
  const [selectedRisk, setSelectedRisk] = useState("All");

  const industries = ["All", "Electronics & Microchips", "Pharmaceuticals & APIs", "Medical Electronics", "Industrial Engineering & Alloys"];
  const risks = ["All", "Very Low Risk", "Low Risk", "Medium Risk", "High Risk", "Critical Risk"];

  const filteredSuppliers = suppliers.filter(s => {
    const matchSearch =
      s.name.toLowerCase().includes(searchTerm.toLowerCase()) ||
      s.industry.toLowerCase().includes(searchTerm.toLowerCase()) ||
      s.city.toLowerCase().includes(searchTerm.toLowerCase()) ||
      s.gstin.toLowerCase().includes(searchTerm.toLowerCase());

    const matchIndustry = selectedIndustry === "All" || s.industry.includes(selectedIndustry);
    const matchRisk = selectedRisk === "All" || s.risk === selectedRisk;

    return matchSearch && matchIndustry && matchRisk;
  });

  const getScoreColor = (score: number) => {
    if (score >= 85) return { text: "text-emerald-400", border: "border-emerald-500/40", stroke: "#10b981", bg: "bg-emerald-950/60" };
    if (score >= 70) return { text: "text-green-400", border: "border-green-500/40", stroke: "#22c55e", bg: "bg-green-950/60" };
    if (score >= 50) return { text: "text-amber-400", border: "border-amber-500/40", stroke: "#eab308", bg: "bg-amber-950/60" };
    if (score >= 35) return { text: "text-orange-400", border: "border-orange-500/40", stroke: "#f97316", bg: "bg-orange-950/60" };
    return { text: "text-rose-400", border: "border-rose-500/50", stroke: "#ef4444", bg: "bg-rose-950/60" };
  };

  const handleDownloadReport = async (supplierId: string, e: React.MouseEvent) => {
    e.stopPropagation();
    sound.playClick();
    window.location.href = `/api/supplier/report/${supplierId}`;
  };

  return (
    <div id="supplier-grid-section" className="w-full space-y-6">
      {/* Header & Filter Controls Bar */}
      <div className="flex flex-col md:flex-row items-stretch md:items-center justify-between gap-4 p-4 rounded-2xl neural-card">
        {/* Search */}
        <div className="relative flex-1">
          <Search className="absolute left-3.5 top-1/2 -translate-y-1/2 w-4 h-4 text-slate-400" />
          <input
            id="supplier-search-input"
            type="text"
            placeholder="Search suppliers by name, industry, GSTIN, city..."
            value={searchTerm}
            onChange={(e) => setSearchTerm(e.target.value)}
            className="w-full pl-10 pr-4 py-2 rounded-xl bg-[#0A0A0C] border border-white/10 text-sm text-[#E2E8F0] placeholder-slate-500 focus:outline-none focus:border-[#38BDF8] transition-colors font-display"
          />
        </div>

        {/* Industry Filter */}
        <div className="flex items-center gap-2">
          <select
            id="industry-filter-select"
            value={selectedIndustry}
            onChange={(e) => { sound.playClick(); setSelectedIndustry(e.target.value); }}
            className="px-3 py-2 rounded-xl bg-[#0A0A0C] border border-white/10 text-xs text-slate-200 focus:outline-none focus:border-[#38BDF8] cursor-pointer font-mono"
          >
            {industries.map(ind => (
              <option key={ind} value={ind}>{ind === "All" ? "All Industries" : ind}</option>
            ))}
          </select>

          <select
            id="risk-filter-select"
            value={selectedRisk}
            onChange={(e) => { sound.playClick(); setSelectedRisk(e.target.value); }}
            className="px-3 py-2 rounded-xl bg-[#0A0A0C] border border-white/10 text-xs text-slate-200 focus:outline-none focus:border-[#38BDF8] cursor-pointer font-mono"
          >
            {risks.map(r => (
              <option key={r} value={r}>{r === "All" ? "All Risk Levels" : r}</option>
            ))}
          </select>

          <button
            id="ingest-csv-btn"
            onClick={() => { sound.playClick(); onAddCsv?.(); }}
            className="px-3 py-2 rounded-xl bg-white/5 hover:bg-white/10 border border-cyan-500/30 hover:border-cyan-400 text-cyan-300 font-mono text-xs flex items-center gap-1.5 cursor-pointer transition-colors"
          >
            <Download className="w-3.5 h-3.5" />
            <span>Ingest Udyam CSV</span>
          </button>

          <button
            id="add-supplier-btn"
            onClick={() => { sound.playClick(); onAddSupplier(); }}
            className="btn-cyber flex items-center gap-1.5 rounded-xl"
          >
            <Plus className="w-4 h-4" />
            <span>Add Supplier</span>
          </button>
        </div>
      </div>

      {/* Supplier 3D Cards Grid */}
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
        {filteredSuppliers.map((supplier) => {
          const color = getScoreColor(supplier.score);
          const circumference = 2 * Math.PI * 26;
          const strokeDashoffset = circumference - (supplier.score / 100) * circumference;

          return (
            <TiltCard
              key={supplier.id}
              id={`supplier-card-${supplier.id}`}
              onClick={() => {
                sound.playTargetLock();
                onSelectSupplier(supplier);
              }}
              className={`p-6 rounded-2xl neural-card hover:border-[#22D3EE] transition-all group`}
            >
              {/* Top Row: Title, Tier & 3D Gauge */}
              <div className="flex items-start justify-between gap-3">
                <div className="flex-1">
                  <div className="flex items-center gap-2">
                    <span className="px-2 py-0.5 rounded text-[10px] font-mono uppercase bg-white/5 border border-white/10 text-[#22D3EE] font-bold">
                      {supplier.tier}
                    </span>
                    {supplier.dataSource === "real_registration" ? (
                      <span className="px-2 py-0.5 rounded text-[9px] font-mono uppercase bg-emerald-500/20 border border-emerald-500/40 text-emerald-300 font-bold" title={`Udyam: ${supplier.udyamNumber || "Verified"}`}>
                        Govt Udyam / MCA
                      </span>
                    ) : (
                      <span className="px-1.5 py-0.5 rounded text-[9px] font-mono uppercase bg-cyan-500/10 border border-cyan-500/20 text-cyan-400">
                        Simulated Model
                      </span>
                    )}
                    <span className="text-[10px] font-mono text-zinc-400">
                      ID: {supplier.id}
                    </span>
                  </div>
                  <h3 className="mt-1.5 font-bold text-base text-white group-hover:text-[#22D3EE] transition-colors">
                    {supplier.name}
                  </h3>
                  <p className="text-xs text-zinc-400 line-clamp-1">
                    {supplier.industry} • {supplier.city}
                  </p>
                </div>

                {/* Circular Score Gauge */}
                <div className="relative w-16 h-16 flex items-center justify-center shrink-0">
                  <svg className="w-16 h-16 -rotate-90">
                    <circle
                      cx="32"
                      cy="32"
                      r="26"
                      stroke="rgba(255,255,255,0.08)"
                      strokeWidth="4.5"
                      fill="transparent"
                    />
                    <circle
                      cx="32"
                      cy="32"
                      r="26"
                      stroke={color.stroke}
                      strokeWidth="4.5"
                      strokeDasharray={circumference}
                      strokeDashoffset={strokeDashoffset}
                      strokeLinecap="round"
                      fill="transparent"
                      className="transition-all duration-1000 ease-out"
                    />
                  </svg>
                  <div className="absolute flex flex-col items-center justify-center">
                    <span className={`text-sm font-bold font-mono ${color.text}`}>
                      {supplier.score}
                    </span>
                    <span className="text-[8px] font-mono text-zinc-400 uppercase">
                      Score
                    </span>
                  </div>
                </div>
              </div>

              {/* AI Diagnostic Preview Quote */}
              <div className="mt-3.5 p-2.5 rounded-xl bg-black/40 border border-white/5 text-xs text-zinc-300 italic line-clamp-2">
                "{supplier.insight}"
              </div>

              {/* Key Metrics Grid */}
              <div className="mt-4 grid grid-cols-2 gap-2 text-xs">
                <div className="p-2 rounded-lg bg-white/[0.02] border border-white/5">
                  <span className="text-[10px] text-zinc-400 font-mono block">Payment Delay</span>
                  <span className="font-semibold text-zinc-200 font-mono">{supplier.paymentDelay}</span>
                </div>
                <div className="p-2 rounded-lg bg-white/[0.02] border border-white/5">
                  <span className="text-[10px] text-zinc-400 font-mono block">On-Time Fulfillment</span>
                  <span className="font-semibold text-emerald-400 font-mono">{supplier.deliveryReliability}</span>
                </div>
                <div className="p-2 rounded-lg bg-white/[0.02] border border-white/5">
                  <span className="text-[10px] text-zinc-400 font-mono block">Quality Rate</span>
                  <span className="font-semibold text-cyan-300 font-mono">{supplier.qualityRate}</span>
                </div>
                <div className="p-2 rounded-lg bg-white/[0.02] border border-white/5">
                  <span className="text-[10px] text-zinc-400 font-mono block">Open Complaints</span>
                  <span className={`font-semibold font-mono ${supplier.complaintCount > 5 ? "text-rose-400" : "text-zinc-200"}`}>
                    {supplier.complaintCount} flagged
                  </span>
                </div>
              </div>

              {/* Action Buttons Bar */}
              <div className="mt-4 pt-3.5 border-t border-white/10 flex items-center justify-between gap-1.5">
                <div className="flex items-center gap-1">
                  <button
                    id={`focus-3d-${supplier.id}`}
                    onClick={(e) => {
                      e.stopPropagation();
                      sound.playTargetLock();
                      onFocusIn3D(supplier.id);
                    }}
                    className="p-1.5 rounded-lg bg-white/5 hover:bg-white/10 text-zinc-300 hover:text-[#22D3EE] text-xs transition-colors cursor-pointer"
                    title="Focus Node in 3D Spatial Knowledge Graph"
                  >
                    <Eye className="w-3.5 h-3.5" />
                  </button>

                  <button
                    id={`download-report-${supplier.id}`}
                    onClick={(e) => handleDownloadReport(supplier.id, e)}
                    className="p-1.5 rounded-lg bg-white/5 hover:bg-white/10 text-zinc-300 hover:text-[#22D3EE] text-xs transition-colors cursor-pointer"
                    title="Download Official Audit Report JSON"
                  >
                    <Download className="w-3.5 h-3.5" />
                  </button>

                  <button
                    id={`edit-supplier-${supplier.id}`}
                    onClick={(e) => {
                      e.stopPropagation();
                      sound.playClick();
                      onEditSupplier(supplier);
                    }}
                    className="p-1.5 rounded-lg bg-white/5 hover:bg-white/10 text-zinc-300 hover:text-white text-xs transition-colors cursor-pointer"
                    title="Edit Supplier Parameters"
                  >
                    <Edit3 className="w-3.5 h-3.5" />
                  </button>

                  <button
                    id={`delete-supplier-${supplier.id}`}
                    onClick={(e) => {
                      e.stopPropagation();
                      sound.playClick();
                      onDeleteSupplier(supplier.id);
                    }}
                    className="p-1.5 rounded-lg bg-white/5 hover:bg-rose-950/50 text-zinc-300 hover:text-rose-400 text-xs transition-colors cursor-pointer"
                    title="Remove Supplier from Monitored Chain"
                  >
                    <Trash2 className="w-3.5 h-3.5" />
                  </button>
                </div>

                <div className="flex items-center gap-2">
                  <button
                    id={`shockwave-btn-${supplier.id}`}
                    onClick={(e) => {
                      e.stopPropagation();
                      sound.playShockwave();
                      onSimulateCascade(supplier);
                    }}
                    className="px-2.5 py-1.5 rounded-lg bg-rose-500/10 hover:bg-rose-500/20 border border-rose-500/30 text-[11px] font-mono text-rose-300 flex items-center gap-1 cursor-pointer transition-colors"
                  >
                    <Zap className="w-3 h-3 text-rose-400" />
                    <span>Cascade</span>
                  </button>

                  <button
                    id={`audit-btn-${supplier.id}`}
                    onClick={() => {
                      sound.playTargetLock();
                      onSelectSupplier(supplier);
                    }}
                    className="px-3 py-1.5 rounded-lg bg-[#22D3EE]/10 hover:bg-[#22D3EE]/20 border border-[#22D3EE]/40 text-[11px] font-mono text-[#22D3EE] flex items-center gap-1 cursor-pointer transition-colors"
                  >
                    <Sparkles className="w-3 h-3 text-[#22D3EE]" />
                    <span>AI Audit</span>
                  </button>
                </div>
              </div>
            </TiltCard>
          );
        })}
      </div>
    </div>
  );
};
