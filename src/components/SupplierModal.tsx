import React, { useState, useEffect } from "react";
import { Supplier } from "../types";
import { sound } from "../utils/audio";
import { X, Sparkles, Plus, Save, Building, ShieldCheck } from "lucide-react";

interface SupplierModalProps {
  supplier?: Supplier | null; // If present, edit mode; else create mode
  isOpen: boolean;
  onClose: () => void;
  onSave: (supplierData: Partial<Supplier>) => Promise<void>;
}

export const SupplierModal: React.FC<SupplierModalProps> = ({
  supplier,
  isOpen,
  onClose,
  onSave
}) => {
  const isEdit = !!supplier;

  const [name, setName] = useState("");
  const [industry, setIndustry] = useState("Electronics & Microchips");
  const [tier, setTier] = useState<Supplier["tier"]>("Tier-1 Direct");
  const [city, setCity] = useState("Bengaluru, Karnataka");
  const [gstin, setGstin] = useState("29AAAAA0000A1Z5");
  const [deliveryReliability, setDeliveryReliability] = useState("92");
  const [qualityRate, setQualityRate] = useState("95");
  const [paymentDelay, setPaymentDelay] = useState("4");
  const [complaintCount, setComplaintCount] = useState("1");
  const [criticality, setCriticality] = useState<Supplier["criticality"]>("Medium");
  const [monthlyVolumeINR, setMonthlyVolumeINR] = useState("₹45.0 L");
  const [insight, setInsight] = useState("");
  const [isSaving, setIsSaving] = useState(false);

  useEffect(() => {
    if (supplier) {
      setName(supplier.name);
      setIndustry(supplier.industry);
      setTier(supplier.tier);
      setCity(supplier.city);
      setGstin(supplier.gstin);
      setDeliveryReliability(supplier.deliveryReliability.replace("%", ""));
      setQualityRate(supplier.qualityRate.replace("%", ""));
      setPaymentDelay(supplier.paymentDelay.replace(/[^0-9]/g, "") || "4");
      setComplaintCount(String(supplier.complaintCount));
      setCriticality(supplier.criticality);
      setMonthlyVolumeINR(supplier.monthlyVolumeINR);
      setInsight(supplier.insight);
    } else {
      setName("");
      setIndustry("Electronics & Microchips");
      setTier("Tier-1 Direct");
      setCity("Bengaluru, Karnataka");
      setGstin("29AAAAA0000A1Z5");
      setDeliveryReliability("92");
      setQualityRate("95");
      setPaymentDelay("4");
      setComplaintCount("1");
      setCriticality("Medium");
      setMonthlyVolumeINR("₹45.0 L");
      setInsight("");
    }
  }, [supplier, isOpen]);

  // Live Composite Trust Score Preview
  const deliveryNum = parseFloat(deliveryReliability) || 80;
  const qualityNum = parseFloat(qualityRate) || 85;
  const delayNum = parseInt(paymentDelay, 10) || 5;
  const complaints = parseInt(complaintCount, 10) || 0;

  let liveScore = Math.round(
    (deliveryNum * 0.4) +
    (qualityNum * 0.35) -
    (Math.min(delayNum, 40) * 0.6) -
    (Math.min(complaints, 20) * 1.2)
  );
  liveScore = Math.max(10, Math.min(99, liveScore));

  if (!isOpen) return null;

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!name.trim()) return;

    sound.playClick();
    setIsSaving(true);
    try {
      await onSave({
        name,
        industry,
        tier,
        city,
        gstin,
        deliveryReliability: `${deliveryReliability}%`,
        qualityRate: `${qualityRate}%`,
        paymentDelay: `${paymentDelay} days avg`,
        complaintCount: parseInt(complaintCount, 10) || 0,
        criticality,
        monthlyVolumeINR,
        insight: insight.trim() || `Operational performance validated with ${liveScore}/100 trust rating across core MSME parameters.`,
        score: liveScore
      });
      onClose();
    } catch (err) {
      console.error(err);
    } finally {
      setIsSaving(false);
    }
  };

  return (
    <div
      id="supplier-modal-backdrop"
      className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-slate-950/85 backdrop-blur-md animate-in fade-in"
    >
      <div className="relative w-full max-w-2xl rounded-3xl cyber-glass border border-cyan-500/30 shadow-2xl p-6 sm:p-8 max-h-[90vh] overflow-y-auto">
        {/* Header */}
        <div className="flex items-center justify-between pb-4 border-b border-slate-800">
          <div className="flex items-center gap-3">
            <div className="p-2.5 rounded-xl bg-cyan-500/20 border border-cyan-400/40 text-cyan-400">
              <Building className="w-5 h-5" />
            </div>
            <div>
              <h2 className="text-xl font-bold text-white tracking-tight font-mono">
                {isEdit ? "Update Supplier Parameters" : "Register New Supply Chain Partner"}
              </h2>
              <p className="text-xs text-slate-400">
                Neural trust score adjusts dynamically in real time
              </p>
            </div>
          </div>

          <button
            id="close-supplier-modal-btn"
            onClick={() => { sound.playClick(); onClose(); }}
            className="p-2 rounded-xl bg-slate-900 hover:bg-slate-800 text-slate-400 hover:text-white transition-colors"
          >
            <X className="w-5 h-5" />
          </button>
        </div>

        {/* Form */}
        <form onSubmit={handleSubmit} className="mt-6 space-y-4">
          {/* Live Trust Preview Banner */}
          <div className="p-3.5 rounded-xl bg-slate-900/90 border border-cyan-500/30 flex items-center justify-between">
            <div className="flex items-center gap-2">
              <Sparkles className="w-4 h-4 text-cyan-400" />
              <span className="text-xs font-mono text-cyan-300 font-semibold">
                Live Calculated Trust Rating
              </span>
            </div>
            <span className="text-lg font-mono font-extrabold text-white">
              {liveScore} / 100
            </span>
          </div>

          <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
            <div>
              <label className="block text-xs font-mono text-slate-300 uppercase mb-1">
                Supplier / Company Name *
              </label>
              <input
                type="text"
                required
                value={name}
                onChange={(e) => setName(e.target.value)}
                placeholder="e.g. Apex Semiconductors Ltd"
                className="w-full px-3.5 py-2.5 rounded-xl bg-slate-950 border border-slate-700 text-sm text-slate-100 focus:border-cyan-400 focus:outline-none"
              />
            </div>

            <div>
              <label className="block text-xs font-mono text-slate-300 uppercase mb-1">
                Industry Domain
              </label>
              <select
                value={industry}
                onChange={(e) => setIndustry(e.target.value)}
                className="w-full px-3.5 py-2.5 rounded-xl bg-slate-950 border border-slate-700 text-sm text-slate-100 focus:border-cyan-400 focus:outline-none font-sans cursor-pointer"
              >
                <option value="Electronics & Microchips">Electronics & Microchips</option>
                <option value="Pharmaceuticals & APIs">Pharmaceuticals & APIs</option>
                <option value="Medical Electronics">Medical Electronics</option>
                <option value="Industrial Engineering & Alloys">Industrial Engineering & Alloys</option>
                <option value="Optoelectronics & Sensors">Optoelectronics & Sensors</option>
                <option value="Raw Chemical Minerals">Raw Chemical Minerals</option>
              </select>
            </div>

            <div>
              <label className="block text-xs font-mono text-slate-300 uppercase mb-1">
                Supply Chain Hierarchy Tier
              </label>
              <select
                value={tier}
                onChange={(e) => setTier(e.target.value as Supplier["tier"])}
                className="w-full px-3.5 py-2.5 rounded-xl bg-slate-950 border border-slate-700 text-sm text-slate-100 focus:border-cyan-400 focus:outline-none font-sans cursor-pointer"
              >
                <option value="Tier-1 Direct">Tier-1 Direct</option>
                <option value="Tier-2 Sub-assembly">Tier-2 Sub-assembly</option>
                <option value="Tier-3 Raw Material">Tier-3 Raw Material</option>
              </select>
            </div>

            <div>
              <label className="block text-xs font-mono text-slate-300 uppercase mb-1">
                City / State
              </label>
              <input
                type="text"
                value={city}
                onChange={(e) => setCity(e.target.value)}
                placeholder="e.g. Pune, Maharashtra"
                className="w-full px-3.5 py-2.5 rounded-xl bg-slate-950 border border-slate-700 text-sm text-slate-100 focus:border-cyan-400 focus:outline-none"
              />
            </div>
          </div>

          {/* Operational Metrics Sliders / Inputs */}
          <div className="grid grid-cols-2 sm:grid-cols-4 gap-3 pt-2">
            <div>
              <label className="block text-[11px] font-mono text-slate-400 uppercase mb-1">
                On-Time Delivery (%)
              </label>
              <input
                type="number"
                min="10"
                max="100"
                value={deliveryReliability}
                onChange={(e) => setDeliveryReliability(e.target.value)}
                className="w-full px-3 py-2 rounded-xl bg-slate-950 border border-slate-700 text-sm text-slate-100 font-mono text-center"
              />
            </div>

            <div>
              <label className="block text-[11px] font-mono text-slate-400 uppercase mb-1">
                Quality Rate (%)
              </label>
              <input
                type="number"
                min="10"
                max="100"
                value={qualityRate}
                onChange={(e) => setQualityRate(e.target.value)}
                className="w-full px-3 py-2 rounded-xl bg-slate-950 border border-slate-700 text-sm text-slate-100 font-mono text-center"
              />
            </div>

            <div>
              <label className="block text-[11px] font-mono text-slate-400 uppercase mb-1">
                Payment Delay (Days)
              </label>
              <input
                type="number"
                min="0"
                max="90"
                value={paymentDelay}
                onChange={(e) => setPaymentDelay(e.target.value)}
                className="w-full px-3 py-2 rounded-xl bg-slate-950 border border-slate-700 text-sm text-slate-100 font-mono text-center"
              />
            </div>

            <div>
              <label className="block text-[11px] font-mono text-slate-400 uppercase mb-1">
                Open Grievances
              </label>
              <input
                type="number"
                min="0"
                max="50"
                value={complaintCount}
                onChange={(e) => setComplaintCount(e.target.value)}
                className="w-full px-3 py-2 rounded-xl bg-slate-950 border border-slate-700 text-sm text-slate-100 font-mono text-center"
              />
            </div>
          </div>

          {/* Qualitative AI Insight / Notes */}
          <div>
            <label className="block text-xs font-mono text-slate-300 uppercase mb-1">
              Operational Intelligence & Notes
            </label>
            <textarea
              rows={2}
              value={insight}
              onChange={(e) => setInsight(e.target.value)}
              placeholder="e.g. ISO 9001 certified. Dual fab lines in Chennai. Strong balance sheet."
              className="w-full px-3.5 py-2.5 rounded-xl bg-slate-950 border border-slate-700 text-sm text-slate-100 focus:border-cyan-400 focus:outline-none font-sans resize-none"
            />
          </div>

          {/* Footer Submit */}
          <div className="mt-6 pt-4 border-t border-slate-800 flex justify-end gap-3">
            <button
              type="button"
              onClick={() => { sound.playClick(); onClose(); }}
              className="px-4 py-2.5 rounded-xl bg-slate-900 hover:bg-slate-850 text-xs font-mono text-slate-300 transition-colors cursor-pointer"
            >
              Cancel
            </button>

            <button
              id="submit-supplier-btn"
              type="submit"
              disabled={isSaving}
              className="px-6 py-2.5 rounded-xl bg-gradient-to-r from-cyan-500 to-blue-600 hover:from-cyan-400 hover:to-blue-500 text-slate-950 font-bold font-mono text-xs flex items-center gap-2 shadow-lg shadow-cyan-500/25 cursor-pointer disabled:opacity-50"
            >
              <Save className="w-4 h-4" />
              <span>{isSaving ? "Saving to Knowledge Graph..." : isEdit ? "Update Supplier" : "Register Supplier"}</span>
            </button>
          </div>
        </form>
      </div>
    </div>
  );
};
