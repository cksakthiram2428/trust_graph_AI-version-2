import React, { useState } from "react";
import { ViewMode, User } from "../types";
import { sound } from "../utils/audio";
import { 
  Network, 
  Layers, 
  Grid3X3, 
  Volume2, 
  VolumeX, 
  Bot, 
  Sparkles, 
  Plus,
  LogIn,
  LogOut,
  Zap
} from "lucide-react";

interface NavbarProps {
  viewMode: ViewMode;
  onSetViewMode: (mode: ViewMode) => void;
  onOpenCopilot: () => void;
  onAddSupplier: () => void;
  user: User | null;
  onLoginClick: () => void;
  onLogout: () => void;
}

export const Navbar: React.FC<NavbarProps> = ({
  viewMode,
  onSetViewMode,
  onOpenCopilot,
  onAddSupplier,
  user,
  onLoginClick,
  onLogout
}) => {
  const [isMuted, setIsMuted] = useState(sound.isMuted);

  const toggleSound = () => {
    sound.isMuted = !sound.isMuted;
    setIsMuted(sound.isMuted);
    if (!sound.isMuted) sound.playClick();
  };

  return (
    <header className="sticky top-0 z-40 w-full border-b border-white/10 bg-[#0A0A0C]/90 backdrop-blur-xl">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-3 flex flex-col md:flex-row items-stretch md:items-center justify-between gap-4">
        {/* Left: Brand Identity with Design Label */}
        <div className="flex items-center gap-3 cursor-pointer" onClick={() => onSetViewMode("3D_SPACE")}>
          <div className="relative flex items-center justify-center w-10 h-10 rounded-xl bg-gradient-to-br from-sky-400 via-sky-600 to-indigo-600 p-0.5 shadow-lg shadow-sky-500/25">
            <div className="w-full h-full bg-[#0A0A0C] rounded-[10px] flex items-center justify-center">
              <Network className="w-5 h-5 text-[#38BDF8] animate-pulse" />
            </div>
          </div>

          <div>
            <div className="design-label">TrustGraph AI</div>
            <div className="flex items-center gap-2">
              <span className="font-display font-bold text-lg sm:text-xl tracking-tight text-[#E2E8F0]">
                SUPPLY CHAIN KNOWLEDGE GRAPH
              </span>
              <span className="px-1.5 py-0.5 rounded text-[9px] font-mono font-semibold bg-sky-950/60 border border-sky-400/40 text-sky-300">
                LIVE
              </span>
            </div>
          </div>
        </div>

        {/* Center: View Mode Tabs */}
        <nav className="flex items-center justify-center p-1 rounded-xl bg-white/[0.03] border border-white/10 text-xs font-mono">
          <button
            id="tab-3d-space-btn"
            onClick={() => { sound.playClick(); onSetViewMode("3D_SPACE"); }}
            className={`px-3.5 py-1.5 rounded-lg flex items-center gap-1.5 transition-all cursor-pointer ${
              viewMode === "3D_SPACE"
                ? "bg-[#38BDF8]/20 text-[#38BDF8] border border-[#38BDF8]/50 shadow-sm font-semibold"
                : "text-slate-400 hover:text-slate-200"
            }`}
          >
            <Network className="w-3.5 h-3.5" />
            <span>3D Knowledge Graph</span>
          </button>

          <button
            id="tab-2d-topology-btn"
            onClick={() => { sound.playClick(); onSetViewMode("2D_TOPOLOGY"); }}
            className={`px-3.5 py-1.5 rounded-lg flex items-center gap-1.5 transition-all cursor-pointer ${
              viewMode === "2D_TOPOLOGY"
                ? "bg-[#38BDF8]/20 text-[#38BDF8] border border-[#38BDF8]/50 shadow-sm font-semibold"
                : "text-slate-400 hover:text-slate-200"
            }`}
          >
            <Layers className="w-3.5 h-3.5" />
            <span>2D Topological</span>
          </button>

          <button
            id="tab-risk-matrix-btn"
            onClick={() => { sound.playClick(); onSetViewMode("RISK_MATRIX"); }}
            className={`px-3.5 py-1.5 rounded-lg flex items-center gap-1.5 transition-all cursor-pointer ${
              viewMode === "RISK_MATRIX"
                ? "bg-[#38BDF8]/20 text-[#38BDF8] border border-[#38BDF8]/50 shadow-sm font-semibold"
                : "text-slate-400 hover:text-slate-200"
            }`}
          >
            <Grid3X3 className="w-3.5 h-3.5" />
            <span>Risk Matrix</span>
          </button>
        </nav>

        {/* Right: Actions & Simulation Control */}
        <div className="flex items-center justify-end gap-2 sm:gap-3">
          {/* Audio Synthesizer Mute Toggle */}
          <button
            id="toggle-audio-btn"
            onClick={toggleSound}
            className={`p-2 rounded-lg border transition-all text-xs cursor-pointer ${
              isMuted
                ? "bg-white/[0.02] border-white/10 text-slate-500 hover:text-slate-300"
                : "bg-[#38BDF8]/10 border-[#38BDF8]/40 text-[#38BDF8]"
            }`}
            title={isMuted ? "Unmute Audio Synthesizer" : "Mute Audio Synthesizer"}
          >
            {isMuted ? <VolumeX className="w-4 h-4" /> : <Volume2 className="w-4 h-4 animate-pulse" />}
          </button>

          {/* Initialize Simulation / AI Copilot */}
          <button
            id="navbar-open-copilot-btn"
            onClick={() => { sound.playClick(); onOpenCopilot(); }}
            className="btn-cyber flex items-center gap-2 rounded"
          >
            <Zap className="w-3.5 h-3.5 text-[#38BDF8]" />
            <span>INITIALIZE SIMULATION</span>
          </button>

          {/* User / Login Button */}
          {user ? (
            <div className="flex items-center gap-2 pl-2 border-l border-white/10">
              <div className="hidden sm:block text-right font-mono">
                <div className="text-xs font-semibold text-white">{user.name}</div>
                <div className="text-[10px] text-[#38BDF8]">{user.role}</div>
              </div>
              <button
                id="logout-btn"
                onClick={() => { sound.playClick(); onLogout(); }}
                className="p-2 rounded-lg bg-white/[0.03] hover:bg-white/[0.08] border border-white/10 text-slate-400 hover:text-rose-400 transition-colors cursor-pointer"
                title="Sign Out"
              >
                <LogOut className="w-4 h-4" />
              </button>
            </div>
          ) : (
            <button
              id="login-modal-btn"
              onClick={() => { sound.playClick(); onLoginClick(); }}
              className="px-3 py-2 rounded-lg bg-white/[0.03] hover:bg-white/[0.08] border border-white/10 text-xs font-mono text-slate-200 flex items-center gap-1.5 cursor-pointer transition-all"
            >
              <LogIn className="w-3.5 h-3.5 text-[#38BDF8]" />
              <span>Admin Login</span>
            </button>
          )}
        </div>
      </div>
    </header>
  );
};
