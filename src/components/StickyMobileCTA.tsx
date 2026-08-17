import React from "react";
import { Network, Bot, Plus, Zap, Activity, FileSpreadsheet } from "lucide-react";
import { sound } from "../utils/audio";

interface StickyMobileCTAProps {
  onOpenCopilot: () => void;
  onAddSupplier: () => void;
  onSimulate?: () => void;
  onOpenCsv?: () => void;
  isLanding?: boolean;
  onEnterWorkspace?: () => void;
}

export const StickyMobileCTA: React.FC<StickyMobileCTAProps> = ({
  onOpenCopilot,
  onAddSupplier,
  onSimulate,
  onOpenCsv,
  isLanding = false,
  onEnterWorkspace
}) => {
  return (
    <div 
      role="toolbar" 
      aria-label="Mobile quick action controls"
      className="sticky-mobile-cta sm:hidden fixed bottom-0 left-0 right-0 z-40 p-3 px-4 bg-slate-900/95 dark:bg-[#07070A]/95 border-t border-slate-700/50 dark:border-white/10 backdrop-blur-xl shadow-2xl flex items-center justify-between gap-2.5"
    >
      {isLanding ? (
        <>
          <button
            aria-label="Enter 3D supply chain knowledge graph"
            onClick={() => {
              sound.playClick();
              onEnterWorkspace?.();
            }}
            className="flex-1 min-h-[44px] py-3 px-3.5 rounded-xl bg-sky-500 hover:bg-sky-600 text-white font-mono text-xs font-bold uppercase tracking-wider flex items-center justify-center gap-2 shadow-md shadow-sky-500/20 active:scale-95 transition-transform cursor-pointer"
          >
            <Network className="w-4 h-4" />
            <span>Enter 3D Graph</span>
          </button>
          <button
            aria-label="Open AI Copilot"
            onClick={() => {
              sound.playClick();
              onOpenCopilot();
            }}
            className="min-h-[44px] py-3 px-3.5 rounded-xl bg-white/10 hover:bg-white/15 text-sky-400 font-mono text-xs font-bold flex items-center justify-center gap-1.5 border border-white/10 active:scale-95 transition-transform cursor-pointer"
          >
            <Bot className="w-4 h-4" />
            <span>AI Copilot</span>
          </button>
        </>
      ) : (
        <>
          <button
            aria-label="Open AI Copilot drawer"
            onClick={() => {
              sound.playClick();
              onOpenCopilot();
            }}
            className="flex-1 min-h-[44px] py-3 px-3 rounded-xl bg-sky-500/15 text-sky-400 border border-sky-500/30 font-mono text-xs font-bold flex items-center justify-center gap-1.5 active:scale-95 transition-transform cursor-pointer"
          >
            <Bot className="w-4 h-4" />
            <span>AI Copilot</span>
          </button>

          {onSimulate && (
            <button
              aria-label="Trigger systemic contagion cascade simulation"
              onClick={() => {
                sound.playClick();
                onSimulate();
              }}
              className="min-h-[44px] py-3 px-3 rounded-xl bg-rose-500/15 text-rose-400 border border-rose-500/30 font-mono text-xs font-bold flex items-center justify-center gap-1.5 active:scale-95 transition-transform cursor-pointer"
            >
              <Activity className="w-4 h-4" />
              <span>Simulate</span>
            </button>
          )}

          <button
            aria-label="Register new MSME supplier"
            onClick={() => {
              sound.playClick();
              onAddSupplier();
            }}
            className="min-h-[44px] py-3 px-4 rounded-xl bg-sky-500 hover:bg-sky-600 text-white font-mono text-xs font-bold flex items-center justify-center gap-1.5 shadow-sm active:scale-95 transition-transform cursor-pointer"
          >
            <Plus className="w-4 h-4" />
            <span>Add MSME</span>
          </button>
        </>
      )}
    </div>
  );
};
