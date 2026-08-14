import React, { useState } from "react";
import { Supplier, CascadeShockResult } from "../types";
import { sound } from "../utils/audio";
import { 
  Zap, 
  ShieldAlert, 
  AlertTriangle, 
  Clock, 
  DollarSign, 
  Activity, 
  CheckCircle, 
  X, 
  Layers, 
  ArrowRight,
  Flame,
  FileWarning,
  TrendingDown
} from "lucide-react";

interface CascadeSimulatorModalProps {
  supplier: Supplier | null;
  allSuppliers: Supplier[];
  onClose: () => void;
  onApplyShockTo3D: (result: CascadeShockResult) => void;
}

export const CascadeSimulatorModal: React.FC<CascadeSimulatorModalProps> = ({
  supplier,
  allSuppliers,
  onClose,
  onApplyShockTo3D
}) => {
  const [selectedSupplierId, setSelectedSupplierId] = useState<string>(supplier?.id || allSuppliers[0]?.id || "B");
  const [shockScenario, setShockScenario] = useState<string>("Insolvency & Working Capital Freeze");
  const [isSimulating, setIsSimulating] = useState<boolean>(false);
  const [simulationResult, setSimulationResult] = useState<CascadeShockResult | null>(null);

  const shockScenarios = [
    { label: "Insolvency & Working Capital Freeze", icon: <TrendingDown className="w-4 h-4 text-rose-500 dark:text-rose-400" /> },
    { label: "Regulatory GMP Non-Compliance / Plant Shutdown", icon: <FileWarning className="w-4 h-4 text-amber-500 dark:text-amber-400" /> },
    { label: "Critical Component Raw Material Embargo", icon: <Flame className="w-4 h-4 text-orange-500 dark:text-orange-400" /> },
    { label: "Port Logistics Backlog & Customs Freeze", icon: <AlertTriangle className="w-4 h-4 text-yellow-500 dark:text-yellow-400" /> }
  ];

  const handleRunSimulation = async () => {
    sound.playShockwave();
    setIsSimulating(true);

    try {
      const res = await fetch("/api/ai/simulate-cascade", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({
          failedSupplierId: selectedSupplierId,
          shockType: shockScenario
        })
      });
      const data = await res.json();
      setSimulationResult(data);
      sound.playAISuccess();
      onApplyShockTo3D(data);
    } catch (err) {
      console.error(err);
    } finally {
      setIsSimulating(false);
    }
  };

  const currentSupplier = allSuppliers.find(s => s.id === selectedSupplierId) || allSuppliers[0];

  return (
    <div
      id="cascade-simulator-modal"
      className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-slate-950/80 backdrop-blur-md animate-in fade-in"
    >
      <div className="relative w-full max-w-3xl rounded-3xl bg-white dark:bg-[#0E0E12] border border-rose-200 dark:border-rose-500/40 shadow-2xl p-6 sm:p-8 max-h-[90vh] overflow-y-auto text-slate-900 dark:text-slate-100 transition-colors">
        {/* Header */}
        <div className="flex items-center justify-between pb-4 border-b border-slate-200 dark:border-slate-800">
          <div className="flex items-center gap-3">
            <div className="p-2.5 rounded-xl bg-rose-500/10 dark:bg-rose-500/20 border border-rose-500/30 dark:border-rose-500/40 text-rose-600 dark:text-rose-400 animate-pulse">
              <Zap className="w-6 h-6" />
            </div>
            <div>
              <div className="flex items-center gap-2">
                <span className="text-[11px] font-mono uppercase text-rose-600 dark:text-rose-400 tracking-wider font-bold">
                  Neural Stress Tester
                </span>
                <span className="px-2 py-0.5 rounded text-[10px] font-mono bg-rose-100 dark:bg-rose-950 border border-rose-200 dark:border-rose-500/30 text-rose-700 dark:text-rose-300 font-bold">
                  Real-Time Propagation
                </span>
              </div>
              <h2 className="text-xl font-bold text-slate-900 dark:text-white tracking-tight font-display">
                Supply Chain Contagion Cascade Simulator
              </h2>
            </div>
          </div>

          <button
            id="close-cascade-modal-btn"
            onClick={() => { sound.playClick(); onClose(); }}
            className="p-2 rounded-xl bg-slate-100 dark:bg-slate-900 hover:bg-slate-200 dark:hover:bg-slate-800 text-slate-500 dark:text-slate-400 hover:text-slate-900 dark:hover:text-white transition-colors cursor-pointer"
          >
            <X className="w-5 h-5" />
          </button>
        </div>

        {/* Configuration Selectors */}
        <div className="mt-6 grid grid-cols-1 md:grid-cols-2 gap-4">
          {/* Supplier Picker */}
          <div>
            <label className="block text-xs font-mono text-slate-600 dark:text-slate-400 uppercase font-semibold mb-1.5">
              Select Origin Failure Node
            </label>
            <select
              id="cascade-supplier-select"
              value={selectedSupplierId}
              onChange={(e) => { sound.playClick(); setSelectedSupplierId(e.target.value); }}
              className="w-full px-3.5 py-2.5 rounded-xl bg-slate-50 dark:bg-slate-950 border border-slate-300 dark:border-slate-700 text-sm text-slate-900 dark:text-slate-100 focus:outline-none focus:border-rose-500 font-sans cursor-pointer shadow-xs"
            >
              {allSuppliers.map(s => (
                <option key={s.id} value={s.id}>
                  [{s.id}] {s.name} ({s.industry} - Trust: {s.score}/100)
                </option>
              ))}
            </select>
          </div>

          {/* Shock Scenario Picker */}
          <div>
            <label className="block text-xs font-mono text-slate-600 dark:text-slate-400 uppercase font-semibold mb-1.5">
              Simulated Disruption Hazard
            </label>
            <select
              id="cascade-scenario-select"
              value={shockScenario}
              onChange={(e) => { sound.playClick(); setShockScenario(e.target.value); }}
              className="w-full px-3.5 py-2.5 rounded-xl bg-slate-50 dark:bg-slate-950 border border-slate-300 dark:border-slate-700 text-sm text-slate-900 dark:text-slate-100 focus:outline-none focus:border-rose-500 font-sans cursor-pointer shadow-xs"
            >
              {shockScenarios.map(s => (
                <option key={s.label} value={s.label}>{s.label}</option>
              ))}
            </select>
          </div>
        </div>

        {/* Action Trigger Button */}
        <div className="mt-6 flex justify-center">
          <button
            id="run-cascade-simulation-btn"
            disabled={isSimulating}
            onClick={handleRunSimulation}
            className="w-full sm:w-auto px-8 py-3.5 rounded-xl bg-gradient-to-r from-rose-600 to-amber-600 hover:from-rose-500 hover:to-amber-500 text-white font-bold font-mono text-sm flex items-center justify-center gap-2.5 shadow-lg shadow-rose-600/25 cursor-pointer transition-all disabled:opacity-50"
          >
            <Zap className={`w-4 h-4 ${isSimulating ? "animate-spin" : ""}`} />
            <span>{isSimulating ? "Modeling Neural Contagion Shockwave..." : "Trigger 3D Cascade Stress Test"}</span>
          </button>
        </div>

        {/* Real-time Shockwave Results Area */}
        {simulationResult && (
          <div className="mt-6 p-5 rounded-2xl bg-slate-50 dark:bg-slate-950/90 border border-rose-300 dark:border-rose-500/50 shadow-inner animate-in fade-in slide-in-from-top-4 space-y-4">
            <div className="flex items-center justify-between pb-3 border-b border-slate-200 dark:border-slate-800">
              <div className="flex items-center gap-2 text-rose-600 dark:text-rose-400 font-mono text-xs font-bold uppercase">
                <ShieldAlert className="w-4 h-4 animate-bounce" />
                <span>Simulated Disruption Impact Report</span>
              </div>
              <span className="px-2.5 py-0.5 rounded bg-rose-100 dark:bg-rose-950 text-rose-700 dark:text-rose-300 text-xs font-mono font-bold">
                HIGH THREAT LEVEL
              </span>
            </div>

            {/* Impact Metrics Grid */}
            <div className="grid grid-cols-1 sm:grid-cols-3 gap-3">
              <div className="p-3.5 rounded-xl bg-rose-100/70 dark:bg-rose-950/40 border border-rose-200 dark:border-rose-500/30">
                <div className="text-[10px] font-mono text-rose-700 dark:text-rose-300 uppercase font-semibold">Estimated Financial Exposure</div>
                <div className="text-xl font-extrabold text-rose-950 dark:text-white font-mono mt-0.5">
                  {simulationResult.monetaryExposureINR}
                </div>
              </div>

              <div className="p-3.5 rounded-xl bg-amber-100/70 dark:bg-amber-950/40 border border-amber-200 dark:border-amber-500/30">
                <div className="text-[10px] font-mono text-amber-700 dark:text-amber-300 uppercase font-semibold">Production Buffer Loss</div>
                <div className="text-xl font-extrabold text-amber-950 dark:text-amber-300 font-mono mt-0.5">
                  {simulationResult.estimatedDowntimeDays} Days Downtime
                </div>
              </div>

              <div className="p-3.5 rounded-xl bg-sky-100/70 dark:bg-slate-900 border border-sky-200 dark:border-cyan-500/30">
                <div className="text-[10px] font-mono text-sky-700 dark:text-cyan-300 uppercase font-semibold">Impacted Graph Nodes</div>
                <div className="text-xl font-extrabold text-sky-950 dark:text-cyan-300 font-mono mt-0.5">
                  {simulationResult.directImpactedNodeIds.length} Direct / {simulationResult.secondaryImpactedNodeIds.length} Sub-tier
                </div>
              </div>
            </div>

            {/* AI Narrative */}
            <div className="p-3.5 rounded-xl bg-white dark:bg-slate-900/80 border border-slate-200 dark:border-slate-800 text-sm text-slate-800 dark:text-slate-200 leading-relaxed font-sans shadow-xs">
              <span className="font-mono text-xs font-bold text-sky-600 dark:text-cyan-400 uppercase block mb-1">
                Gemini AI Contagion Verdict:
              </span>
              {simulationResult.cascadeNarrative}
            </div>

            {/* Mitigation Playbook */}
            <div>
              <span className="font-mono text-xs font-bold text-emerald-700 dark:text-emerald-400 uppercase block mb-2">
                Automated MSME Incident Playbook:
              </span>
              <div className="space-y-1.5 font-sans">
                {simulationResult.mitigationSteps.map((step, idx) => (
                  <div key={idx} className="flex items-start gap-2 text-xs text-slate-700 dark:text-slate-300">
                    <CheckCircle className="w-3.5 h-3.5 text-emerald-600 dark:text-emerald-400 mt-0.5 shrink-0" />
                    <span>{step}</span>
                  </div>
                ))}
              </div>
            </div>
          </div>
        )}
      </div>
    </div>
  );
};
