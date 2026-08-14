import React, { useState } from "react";
import { Supplier } from "../types";
import { TiltCard } from "./TiltCard";
import { sound } from "../utils/audio";
import { motion } from "motion/react";
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
    if (score >= 85) return { text: "text-emerald-600 dark:text-emerald-400", border: "border-emerald-500/40", stroke: "#10b981", bg: "bg-emerald-500/10" };
    if (score >= 70) return { text: "text-green-600 dark:text-green-400", border: "border-green-500/40", stroke: "#22c55e", bg: "bg-green-500/10" };
    if (score >= 50) return { text: "text-amber-600 dark:text-amber-400", border: "border-amber-500/40", stroke: "#eab308", bg: "bg-amber-500/10" };
    if (score >= 35) return { text: "text-orange-600 dark:text-orange-400", border: "border-orange-500/40", stroke: "#f97316", bg: "bg-orange-500/10" };
    return { text: "text-rose-600 dark:text-rose-400", border: "border-rose-500/50", stroke: "#ef4444", bg: "bg-rose-500/10" };
  };

  const handleDownloadReport = async (supplierId: string, e: React.MouseEvent) => {
    e.stopPropagation();
    sound.playClick();
    window.location.href = `/api/supplier/report/${supplierId}`;
  };

  return (
    <div id="supplier-grid-section" className="w-full space-y-6">
      {/* Header & Filter Controls Bar */}
      <div className="flex flex-col md:flex-row items-stretch md:items-center justify-between gap-4 p-4 rounded-2xl bg-white dark:bg-[#0E0E12] border border-slate-200 dark:border-white/10 shadow-sm transition-colors">
        {/* Search */}
        <div className="relative flex-1">
          <Search className="absolute left-3.5 top-1/2 -translate-y-1/2 w-4 h-4 text-slate-400" />
          <input
            id="supplier-search-input"
            type="text"
            placeholder="Search suppliers by name, industry, GSTIN, city..."
            value={searchTerm}
            onChange={(e) => setSearchTerm(e.target.value)}
            className="w-full pl-10 pr-4 py-2 rounded-xl bg-slate-50 dark:bg-[#0A0A0C] border border-slate-200 dark:border-white/10 text-sm text-slate-900 dark:text-[#E2E8F0] placeholder-slate-400 dark:placeholder-slate-500 focus:outline-none focus:border-sky-500 transition-colors font-sans"
          />
        </div>

        {/* Industry Filter */}
        <div className="flex flex-wrap items-center gap-2">
          <select
            id="industry-filter-select"
            value={selectedIndustry}
            onChange={(e) => { sound.playClick(); setSelectedIndustry(e.target.value); }}
            className="px-3 py-2 rounded-xl bg-slate-50 dark:bg-[#0A0A0C] border border-slate-200 dark:border-white/10 text-xs text-slate-800 dark:text-slate-200 focus:outline-none focus:border-sky-500 cursor-pointer font-mono"
          >
            {industries.map(ind => (
              <option key={ind} value={ind}>{ind === "All" ? "All Industries" : ind}</option>
            ))}
          </select>

          <select
            id="risk-filter-select"
            value={selectedRisk}
            onChange={(e) => { sound.playClick(); setSelectedRisk(e.target.value); }}
            className="px-3 py-2 rounded-xl bg-slate-50 dark:bg-[#0A0A0C] border border-slate-200 dark:border-white/10 text-xs text-slate-800 dark:text-slate-200 focus:outline-none focus:border-sky-500 cursor-pointer font-mono"
          >
            {risks.map(r => (
              <option key={r} value={r}>{r === "All" ? "All Risk Levels" : r}</option>
            ))}
          </select>

          <button
            id="ingest-csv-btn"
            onClick={() => { sound.playClick(); onAddCsv?.(); }}
            className="px-3.5 py-2 rounded-xl bg-slate-100 dark:bg-white/5 hover:bg-slate-200 dark:hover:bg-white/10 border border-slate-200 dark:border-sky-500/30 text-sky-700 dark:text-cyan-300 font-mono text-xs font-semibold flex items-center gap-1.5 cursor-pointer transition-colors shadow-xs"
          >
            <Download className="w-3.5 h-3.5" />
            <span>Ingest Udyam CSV</span>
          </button>

          <button
            id="add-supplier-btn"
            onClick={() => { sound.playClick(); onAddSupplier(); }}
            className="px-4 py-2 rounded-xl bg-slate-900 hover:bg-slate-800 dark:bg-sky-500/20 dark:hover:bg-sky-500/30 text-white dark:text-sky-300 border border-slate-800 dark:border-sky-500/40 text-xs font-mono font-bold tracking-wider uppercase flex items-center gap-1.5 transition-all cursor-pointer shadow-sm"
          >
            <Plus className="w-4 h-4" />
            <span>Add Supplier</span>
          </button>
        </div>
      </div>

      {/* Supplier 3D Cards Grid with Scale Up Animations */}
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
        {filteredSuppliers.map((supplier, idx) => {
          const color = getScoreColor(supplier.score);
          const circumference = 2 * Math.PI * 26;
          const strokeDashoffset = circumference - (supplier.score / 100) * circumference;

          return (
            <motion.div
              key={supplier.id}
              initial={{ scale: 0.92, opacity: 0 }}
              animate={{ scale: 1, opacity: 1 }}
              transition={{ duration: 0.35, delay: idx * 0.04 }}
            >
              <TiltCard
                id={`supplier-card-${supplier.id}`}
                onClick={() => {
                  sound.playTargetLock();
                  onSelectSupplier(supplier);
                }}
                className="p-6 rounded-2xl bg-white dark:bg-[#0E0E12] border border-slate-200 dark:border-white/10 hover:border-sky-400 dark:hover:border-[#22D3EE] shadow-sm hover:shadow-md transition-all group cursor-pointer flex flex-col justify-between"
              >
                {/* Top Row: Title, Tier & 3D Gauge */}
                <div>
                  <div className="flex items-start justify-between gap-3">
                    <div className="flex-1">
                      {/* Scale-Up Animated Tag Badges */}
                      <div className="flex flex-wrap items-center gap-1.5">
                        <motion.span 
                          whileHover={{ scale: 1.1 }}
                          className="px-2 py-0.5 rounded-md text-[10px] font-mono uppercase bg-sky-500/10 border border-sky-500/20 text-sky-700 dark:text-[#22D3EE] font-bold shadow-xs inline-block"
                        >
                          {supplier.tier}
                        </motion.span>
                        {supplier.dataSource === "real_registration" ? (
                          <motion.span 
                            whileHover={{ scale: 1.1 }}
                            className="px-2 py-0.5 rounded-md text-[9px] font-mono uppercase bg-emerald-500/10 dark:bg-emerald-500/20 border border-emerald-500/30 text-emerald-700 dark:text-emerald-300 font-bold shadow-xs inline-block" 
                            title={`Udyam: ${supplier.udyamNumber || "Verified"}`}
                          >
                            Govt Udyam / MCA
                          </motion.span>
                        ) : (
                          <motion.span 
                            whileHover={{ scale: 1.1 }}
                            className="px-1.5 py-0.5 rounded-md text-[9px] font-mono uppercase bg-slate-100 dark:bg-white/5 border border-slate-200 dark:border-white/10 text-slate-600 dark:text-slate-400 inline-block"
                          >
                            Simulated
                          </motion.span>
                        )}
                        <span className="text-[10px] font-mono text-slate-400">
                          {supplier.id}
                        </span>
                      </div>

                      <h3 className="mt-2 font-bold text-base text-slate-900 dark:text-white group-hover:text-sky-600 dark:group-hover:text-[#22D3EE] transition-colors font-display">
                        {supplier.name}
                      </h3>
                      <p className="text-xs text-slate-500 dark:text-zinc-400 line-clamp-1 font-sans">
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
                          stroke="currentColor"
                          className="text-slate-200 dark:text-white/10"
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
                        <span className="text-[8px] font-mono text-slate-400 uppercase">
                          Score
                        </span>
                      </div>
                    </div>
                  </div>

                  {/* AI Diagnostic Preview Quote */}
                  <div className="mt-3.5 p-2.5 rounded-xl bg-slate-50 dark:bg-black/40 border border-slate-200 dark:border-white/5 text-xs text-slate-700 dark:text-zinc-300 italic line-clamp-2">
                    "{supplier.insight}"
                  </div>

                  {/* Key Metrics Grid */}
                  <div className="mt-4 grid grid-cols-2 gap-2 text-xs">
                    <div className="p-2 rounded-xl bg-slate-50 dark:bg-white/[0.02] border border-slate-200 dark:border-white/5">
                      <span className="text-[10px] text-slate-400 font-mono block">Payment Delay</span>
                      <span className="font-semibold text-slate-800 dark:text-zinc-200 font-mono">{supplier.paymentDelay}</span>
                    </div>
                    <div className="p-2 rounded-xl bg-slate-50 dark:bg-white/[0.02] border border-slate-200 dark:border-white/5">
                      <span className="text-[10px] text-slate-400 font-mono block">Fulfillment</span>
                      <span className="font-semibold text-emerald-600 dark:text-emerald-400 font-mono">{supplier.deliveryReliability}</span>
                    </div>
                    <div className="p-2 rounded-xl bg-slate-50 dark:bg-white/[0.02] border border-slate-200 dark:border-white/5">
                      <span className="text-[10px] text-slate-400 font-mono block">Quality Rate</span>
                      <span className="font-semibold text-sky-600 dark:text-cyan-300 font-mono">{supplier.qualityRate}</span>
                    </div>
                    <div className="p-2 rounded-xl bg-slate-50 dark:bg-white/[0.02] border border-slate-200 dark:border-white/5">
                      <span className="text-[10px] text-slate-400 font-mono block">Complaints</span>
                      <span className={`font-semibold font-mono ${supplier.complaintCount > 5 ? "text-rose-600 dark:text-rose-400" : "text-slate-800 dark:text-zinc-200"}`}>
                        {supplier.complaintCount} flagged
                      </span>
                    </div>
                  </div>
                </div>

                {/* Action Buttons Bar */}
                <div className="mt-4 pt-3.5 border-t border-slate-100 dark:border-white/10 flex items-center justify-between gap-1.5">
                  <div className="flex items-center gap-1">
                    <button
                      id={`focus-3d-${supplier.id}`}
                      onClick={(e) => {
                        e.stopPropagation();
                        sound.playTargetLock();
                        onFocusIn3D(supplier.id);
                      }}
                      className="p-1.5 rounded-lg bg-slate-100 dark:bg-white/5 hover:bg-slate-200 dark:hover:bg-white/10 text-slate-600 dark:text-zinc-300 hover:text-sky-600 dark:hover:text-[#22D3EE] text-xs transition-colors cursor-pointer"
                      title="Focus Node in 3D Spatial Knowledge Graph"
                    >
                      <Eye className="w-3.5 h-3.5" />
                    </button>

                    <button
                      id={`download-report-${supplier.id}`}
                      onClick={(e) => handleDownloadReport(supplier.id, e)}
                      className="p-1.5 rounded-lg bg-slate-100 dark:bg-white/5 hover:bg-slate-200 dark:hover:bg-white/10 text-slate-600 dark:text-zinc-300 hover:text-sky-600 dark:hover:text-[#22D3EE] text-xs transition-colors cursor-pointer"
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
                      className="p-1.5 rounded-lg bg-slate-100 dark:bg-white/5 hover:bg-slate-200 dark:hover:bg-white/10 text-slate-600 dark:text-zinc-300 hover:text-slate-900 dark:hover:text-white text-xs transition-colors cursor-pointer"
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
                      className="p-1.5 rounded-lg bg-slate-100 dark:bg-white/5 hover:bg-rose-50 dark:hover:bg-rose-950/50 text-slate-600 dark:text-zinc-300 hover:text-rose-600 dark:hover:text-rose-400 text-xs transition-colors cursor-pointer"
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
                      className="px-2.5 py-1.5 rounded-xl bg-rose-500/10 hover:bg-rose-500/20 border border-rose-500/30 text-[11px] font-mono text-rose-600 dark:text-rose-300 flex items-center gap-1 cursor-pointer transition-colors font-semibold"
                    >
                      <Zap className="w-3 h-3 text-rose-500" />
                      <span>Cascade</span>
                    </button>

                    <button
                      id={`audit-btn-${supplier.id}`}
                      onClick={() => {
                        sound.playTargetLock();
                        onSelectSupplier(supplier);
                      }}
                      className="px-3 py-1.5 rounded-xl bg-sky-500/10 hover:bg-sky-500/20 border border-sky-500/30 text-[11px] font-mono text-sky-700 dark:text-[#22D3EE] flex items-center gap-1 cursor-pointer transition-colors font-bold"
                    >
                      <Sparkles className="w-3 h-3 text-sky-500 dark:text-[#22D3EE]" />
                      <span>AI Audit</span>
                    </button>
                  </div>
                </div>
              </TiltCard>
            </motion.div>
          );
        })}
      </div>
    </div>
  );
};
