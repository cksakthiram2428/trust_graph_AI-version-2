import React from "react";
import { motion } from "motion/react";
import { Network, Home, ArrowLeft, RefreshCw, AlertTriangle, Compass, ShieldAlert } from "lucide-react";
import { sound } from "../utils/audio";
import { VideoBackground } from "./ui/VideoBackground";

interface NotFoundPageProps {
  onReturnHome?: () => void;
  onGoHome?: () => void;
  onEnterWorkspace?: () => void;
  onGo3DGraph?: () => void;
  onOpenCopilot?: () => void;
}

export const NotFoundPage: React.FC<NotFoundPageProps> = ({ 
  onReturnHome, 
  onGoHome, 
  onEnterWorkspace, 
  onGo3DGraph,
  onOpenCopilot 
}) => {
  const handleHome = onReturnHome || onGoHome || (() => {});
  const handle3D = onEnterWorkspace || onGo3DGraph;

  return (
    <VideoBackground className="min-h-screen text-slate-100 flex flex-col items-center justify-center p-4 selection:bg-cyan-500/30 selection:text-cyan-200 relative overflow-hidden">
      {/* Background Orbital Rings */}
      <div className="absolute inset-0 flex items-center justify-center pointer-events-none opacity-20">
        <div className="w-[600px] h-[600px] rounded-full border border-sky-500/40 animate-spin" style={{ animationDuration: "40s" }} />
        <div className="absolute w-[420px] h-[420px] rounded-full border border-dashed border-indigo-500/40 animate-spin" style={{ animationDuration: "25s", animationDirection: "reverse" }} />
        <div className="absolute w-[240px] h-[240px] rounded-full border border-cyan-500/40" />
      </div>

      <motion.div
        initial={{ opacity: 0, y: 25 }}
        animate={{ opacity: 1, y: 0 }}
        className="max-w-md w-full text-center space-y-6 z-10 p-8 rounded-3xl bg-slate-900/80 border border-white/10 shadow-2xl backdrop-blur-2xl"
      >
        {/* Radar Icon */}
        <div className="mx-auto w-20 h-20 rounded-3xl bg-sky-500/10 border border-sky-500/30 text-sky-400 flex items-center justify-center relative shadow-lg shadow-sky-500/20">
          <Network className="w-10 h-10 animate-pulse" />
          <div className="absolute -top-1.5 -right-1.5 w-6 h-6 rounded-full bg-rose-500 text-white flex items-center justify-center text-[10px] font-mono font-bold shadow-md">
            !
          </div>
        </div>

        <div className="space-y-2">
          <div className="text-[11px] font-mono uppercase tracking-widest text-sky-400 font-bold">
            Telemetry Error: 404
          </div>
          <h1 className="text-3xl sm:text-4xl font-extrabold font-display tracking-tight text-white">
            Node Coordinate Not Found
          </h1>
          <p className="text-xs sm:text-sm text-slate-400 leading-relaxed font-sans">
            The supply chain node or orbital route you attempted to access does not exist in the active MSME knowledge graph topology.
          </p>
        </div>

        {/* Telemetry Trace Box */}
        <div className="p-3.5 rounded-xl bg-black/40 border border-white/5 font-mono text-[11px] text-slate-400 text-left space-y-1">
          <div className="text-rose-400 flex items-center gap-1.5">
            <AlertTriangle className="w-3.5 h-3.5" />
            ERR_NODE_ORBIT_NOT_FOUND
          </div>
          <div className="text-slate-500 truncate">Target: {typeof window !== "undefined" ? window.location.pathname : "/unknown"}</div>
          <div className="text-slate-500">Trace: GraphRouter.resolvePath() returned null</div>
        </div>

        {/* Actions */}
        <div className="flex flex-col sm:flex-row items-center gap-3 pt-2">
          <button
            onClick={() => {
              sound.playClick();
              handleHome();
            }}
            className="w-full sm:flex-1 py-3 rounded-xl bg-sky-500 hover:bg-sky-600 text-white font-mono text-xs font-bold uppercase tracking-wider flex items-center justify-center gap-2 transition-all shadow-md shadow-sky-500/20 cursor-pointer"
          >
            <Home className="w-4 h-4" />
            <span>Return to Hub</span>
          </button>

          {handle3D && (
            <button
              onClick={() => {
                sound.playClick();
                handle3D();
              }}
              className="w-full sm:flex-1 py-3 rounded-xl bg-white/10 hover:bg-white/15 border border-white/10 text-white font-mono text-xs font-semibold flex items-center justify-center gap-2 transition-all cursor-pointer"
            >
              <Compass className="w-4 h-4 text-cyan-400" />
              <span>3D Graph</span>
            </button>
          )}
        </div>
      </motion.div>
    </VideoBackground>
  );
};
