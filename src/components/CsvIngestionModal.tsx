import React, { useState, useRef } from "react";
import { sound } from "../utils/audio";
import { 
  X, 
  UploadCloud, 
  FileText, 
  CheckCircle2, 
  AlertTriangle, 
  ShieldCheck, 
  RefreshCw, 
  ArrowRight,
  Database,
  Building
} from "lucide-react";

interface CsvIngestionModalProps {
  isOpen: boolean;
  onClose: () => void;
  onImportSuccess: (count: number) => void;
}

export const CsvIngestionModal: React.FC<CsvIngestionModalProps> = ({
  isOpen,
  onClose,
  onImportSuccess
}) => {
  const [csvText, setCsvText] = useState("");
  const [isUploading, setIsUploading] = useState(false);
  const [statusMessage, setStatusMessage] = useState<string | null>(null);
  const [validationReport, setValidationReport] = useState<any | null>(null);
  const fileInputRef = useRef<HTMLInputElement>(null);

  if (!isOpen) return null;

  const sampleCsvTemplate = `enterprise_name,udyam_registration_number,enterprise_type,major_activity,nic_5_digit_code,district,state,gstin,cin
"Apex Micro-Motors India Pvt Ltd","UDYAM-KR-03-0019284","Small","Precision Micro Motors & Actuators","27104 - Electric motors and generators","Bengaluru Urban","Karnataka","29AAACA1111A1Z1","U31100KA2018PTC112345"
"Gujarat Electro-Polymers Corp","UDYAM-GJ-01-0048192","Medium","Specialty Polymer Insulation & Resins","20131 - Polymers and resins","Vadodara","Gujarat","24AABCG2222B1Z8","U24100GJ2015PLC089123"
"TamilNadu Fasteners & Forgings","UDYAM-TN-02-0081734","Micro","High-Tensile Industrial Fasteners","25991 - Fasteners, rivets, screws","Coimbatore","Tamil Nadu","33AAACT3333C1Z5",""
"Hyderabad Bio-Reagents Works","UDYAM-TS-09-0034182","Small","API Chemical Reagents","21002 - Medicaments and chemicals","Medchal-Malkajgiri","Telangana","36AABCH4444D1Z2",""`;

  const handleLoadSample = () => {
    sound.playClick();
    setCsvText(sampleCsvTemplate);
    setStatusMessage("Loaded standard data.gov.in Udyam Registration CSV sample.");
    setValidationReport(null);
  };

  const handleFileUpload = (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0];
    if (!file) return;

    sound.playClick();
    const reader = new FileReader();
    reader.onload = (event) => {
      const content = event.target?.result as string;
      setCsvText(content);
      setStatusMessage(`Loaded file: ${file.name} (${(file.size / 1024).toFixed(1)} KB)`);
      setValidationReport(null);
    };
    reader.readAsText(file);
  };

  const handleExecuteImport = async () => {
    if (!csvText.trim() || isUploading) return;

    sound.playClick();
    setIsUploading(true);
    setStatusMessage(null);
    setValidationReport(null);

    try {
      const res = await fetch("/api/admin/import-msme-csv", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ csvContent: csvText })
      });

      const data = await res.json();

      if (res.ok) {
        sound.playAISuccess();
        setValidationReport(data.report);
        setStatusMessage(data.message || `Ingested ${data.report?.validRows} entities.`);
        onImportSuccess(data.report?.validRows || 0);
      } else {
        setStatusMessage(`Import failed: ${data.error || "Check file structure"}`);
      }
    } catch (err: any) {
      setStatusMessage(`Network error during ingestion: ${err.message}`);
    } finally {
      setIsUploading(false);
    }
  };

  return (
    <div
      id="csv-ingestion-modal"
      role="dialog"
      aria-modal="true"
      aria-label="Ingest Real-World MSME Datasets"
      className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-slate-950/80 backdrop-blur-md animate-in fade-in"
    >
      <div className="relative w-full max-w-2xl rounded-3xl bg-white dark:bg-[#0E0E12] border border-slate-200 dark:border-cyan-500/30 shadow-2xl p-6 sm:p-8 max-h-[90vh] flex flex-col text-slate-900 dark:text-slate-100 transition-colors">
        {/* Header */}
        <div className="flex items-center justify-between pb-4 border-b border-slate-200 dark:border-white/10 shrink-0">
          <div className="flex items-center gap-3">
            <div className="p-2.5 rounded-xl bg-sky-500/10 dark:bg-[#38BDF8]/20 border border-sky-500/30 dark:border-[#38BDF8]/40 text-sky-600 dark:text-[#38BDF8]">
              <Database className="w-5 h-5" />
            </div>
            <div>
              <div className="flex items-center gap-2">
                <span className="text-[10px] font-mono text-sky-600 dark:text-[#38BDF8] uppercase tracking-wider font-bold">
                  Public MSME Registry Ingestion
                </span>
                <span className="px-1.5 py-0.5 rounded bg-emerald-500/10 dark:bg-emerald-500/20 text-emerald-700 dark:text-emerald-300 font-mono text-[9px] font-bold">
                  data.gov.in / Udyam / MCA
                </span>
              </div>
              <h2 className="text-lg font-bold text-slate-900 dark:text-white font-display">
                Ingest Real-World MSME Datasets
              </h2>
            </div>
          </div>

          <button
            onClick={() => { sound.playClick(); onClose(); }}
            aria-label="Close MSME ingestion modal"
            title="Close MSME ingestion modal"
            className="p-2 rounded-xl bg-slate-100 dark:bg-white/5 hover:bg-slate-200 dark:hover:bg-white/10 text-slate-500 dark:text-slate-400 hover:text-slate-900 dark:hover:text-white transition-colors cursor-pointer"
          >
            <X className="w-5 h-5" />
          </button>
        </div>

        {/* Scrollable Content */}
        <div className="flex-1 overflow-y-auto py-4 space-y-4 pr-1 text-xs">
          {/* Transparency & Regulatory Notice */}
          <div className="p-3.5 rounded-2xl bg-sky-50 dark:bg-cyan-950/40 border border-sky-200 dark:border-cyan-500/30 text-slate-700 dark:text-cyan-200 leading-relaxed font-sans shadow-xs">
            <div className="flex items-center gap-2 font-bold font-mono text-[11px] text-sky-700 dark:text-[#38BDF8] mb-1">
              <ShieldCheck className="w-4 h-4" />
              <span>Data Source &amp; Compliance Transparency</span>
            </div>
            <span>
              Real government registration fields (Enterprise Name, Udyam No., District/State, NIC Code, GSTIN, CIN) are extracted directly. Operational trust scores &amp; delay metrics are labeled as <strong>simulated_metrics</strong> to protect compliance integrity.
            </span>
          </div>

          {/* Action Bar */}
          <div className="flex flex-wrap items-center justify-between gap-2">
            <div className="flex items-center gap-2">
              <button
                onClick={() => fileInputRef.current?.click()}
                aria-label="Choose CSV File to upload"
                className="px-3 py-1.5 rounded-xl bg-slate-100 dark:bg-white/5 hover:bg-slate-200 dark:hover:bg-white/10 border border-slate-200 dark:border-white/10 text-slate-800 dark:text-slate-200 font-mono text-xs flex items-center gap-2 cursor-pointer transition-colors"
              >
                <UploadCloud className="w-3.5 h-3.5 text-sky-600 dark:text-[#38BDF8]" />
                <span>Choose CSV File</span>
              </button>
              <input
                type="file"
                ref={fileInputRef}
                onChange={handleFileUpload}
                accept=".csv,text/csv"
                aria-label="Upload CSV File"
                className="hidden"
              />

              <button
                onClick={handleLoadSample}
                aria-label="Load official data.gov.in sample dataset"
                className="px-3 py-1.5 rounded-xl bg-slate-100 dark:bg-white/5 hover:bg-slate-200 dark:hover:bg-white/10 border border-slate-200 dark:border-white/10 text-slate-700 dark:text-slate-300 font-mono text-xs cursor-pointer transition-colors"
              >
                Load data.gov.in Sample
              </button>
            </div>

            <span className="text-[10px] font-mono text-slate-500 dark:text-slate-400">
              Headers: enterprise_name, udyam_registration_number, district, state, gstin
            </span>
          </div>

          {/* Textarea for CSV */}
          <div className="space-y-1">
            <label htmlFor="csv-content-textarea" className="block text-[11px] font-mono text-slate-700 dark:text-slate-300 uppercase font-semibold">
              CSV Content or Raw Input:
            </label>
            <textarea
              id="csv-content-textarea"
              aria-label="CSV Content or raw data input"
              rows={7}
              value={csvText}
              onChange={(e) => setCsvText(e.target.value)}
              placeholder="Paste comma-separated rows with headers here..."
              className="w-full p-3 rounded-xl bg-slate-50 dark:bg-[#0A0A0C] border border-slate-300 dark:border-white/10 font-mono text-xs text-slate-900 dark:text-slate-200 focus:outline-none focus:border-sky-500 dark:focus:border-[#38BDF8] resize-none"
            />
          </div>

          {/* Status Message */}
          {statusMessage && (
            <div className={`p-3 rounded-xl text-xs font-mono font-semibold ${statusMessage.includes("failed") ? "bg-rose-50 dark:bg-rose-950/80 border border-rose-200 dark:border-rose-500/40 text-rose-700 dark:text-rose-200" : "bg-emerald-50 dark:bg-emerald-950/60 border border-emerald-200 dark:border-emerald-500/40 text-emerald-700 dark:text-emerald-200"}`}>
              {statusMessage}
            </div>
          )}

          {/* Validation Report */}
          {validationReport && (
            <div className="p-4 rounded-2xl bg-slate-50 dark:bg-white/[0.03] border border-slate-200 dark:border-white/10 space-y-2">
              <div className="flex items-center justify-between text-xs font-mono">
                <span className="text-slate-600 dark:text-slate-400 font-semibold">Validation Breakdown:</span>
                <div className="flex items-center gap-3">
                  <span className="text-emerald-600 dark:text-emerald-400 font-bold">
                    ✓ {validationReport.validRows} Valid
                  </span>
                  <span className={`${validationReport.invalidRows > 0 ? "text-rose-600 dark:text-rose-400" : "text-slate-500"} font-bold`}>
                    ✕ {validationReport.invalidRows} Flagged
                  </span>
                </div>
              </div>

              {validationReport.errors && validationReport.errors.length > 0 && (
                <div className="mt-2 p-2.5 rounded-xl bg-rose-50 dark:bg-rose-950/50 border border-rose-200 dark:border-rose-500/30 text-[11px] font-mono text-rose-700 dark:text-rose-200 max-h-28 overflow-y-auto space-y-1">
                  <span className="font-bold block text-rose-800 dark:text-rose-300">Flagged Malformed Rows:</span>
                  {validationReport.errors.map((err: any, idx: number) => (
                    <div key={idx} className="flex items-start gap-2">
                      <AlertTriangle className="w-3.5 h-3.5 text-rose-500 dark:text-rose-400 shrink-0 mt-0.5" />
                      <span>Row {err.row}: {err.reason}</span>
                    </div>
                  ))}
                </div>
              )}
            </div>
          )}
        </div>

        {/* Footer */}
        <div className="pt-4 border-t border-slate-200 dark:border-white/10 flex items-center justify-end gap-3 shrink-0">
          <button
            onClick={() => { sound.playClick(); onClose(); }}
            className="px-4 py-2 rounded-xl bg-slate-100 dark:bg-white/5 hover:bg-slate-200 dark:hover:bg-white/10 text-slate-700 dark:text-slate-300 font-mono text-xs cursor-pointer transition-colors"
          >
            Cancel
          </button>

          <button
            disabled={!csvText.trim() || isUploading}
            onClick={handleExecuteImport}
            aria-label="Validate and Ingest Dataset"
            className="px-5 py-2.5 rounded-xl bg-gradient-to-r from-sky-500 to-blue-600 hover:from-sky-400 hover:to-blue-500 text-slate-950 font-bold font-mono text-xs flex items-center gap-2 cursor-pointer disabled:opacity-40 shadow-sm"
          >
            {isUploading ? (
              <>
                <RefreshCw className="w-4 h-4 animate-spin" />
                <span>Validating &amp; Ingesting...</span>
              </>
            ) : (
              <>
                <span>Validate &amp; Ingest Dataset</span>
                <ArrowRight className="w-4 h-4" />
              </>
            )}
          </button>
        </div>
      </div>
    </div>
  );
};
