import React, { useState, useRef, useEffect } from "react";
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
  Zap,
  Sun,
  Moon,
  Home,
  Menu,
  X,
  ChevronDown,
  User as UserIcon,
  ShieldCheck,
  Compass
} from "lucide-react";

interface NavbarProps {
  viewMode: ViewMode;
  onSetViewMode: (mode: ViewMode) => void;
  onOpenCopilot: () => void;
  onAddSupplier: () => void;
  user: User | null;
  onLoginClick: () => void;
  onLogout: () => void;
  onOpenProfile?: () => void;
  theme: "dark" | "light";
  onToggleTheme: () => void;
  onShowLanding?: () => void;
}

export const Navbar: React.FC<NavbarProps> = ({
  viewMode,
  onSetViewMode,
  onOpenCopilot,
  onAddSupplier,
  user,
  onLoginClick,
  onLogout,
  onOpenProfile,
  theme,
  onToggleTheme,
  onShowLanding
}) => {
  const [isMuted, setIsMuted] = useState(sound.isMuted);
  const [isMenuOpen, setIsMenuOpen] = useState(false);
  const menuRef = useRef<HTMLDivElement>(null);

  const toggleSound = () => {
    sound.isMuted = !sound.isMuted;
    setIsMuted(sound.isMuted);
    if (!sound.isMuted) sound.playClick();
  };

  // Close menu on click outside
  useEffect(() => {
    const handleClickOutside = (event: MouseEvent) => {
      if (menuRef.current && !menuRef.current.contains(event.target as Node)) {
        setIsMenuOpen(false);
      }
    };
    if (isMenuOpen) {
      document.addEventListener("mousedown", handleClickOutside);
    }
    return () => {
      document.removeEventListener("mousedown", handleClickOutside);
    };
  }, [isMenuOpen]);

  const getViewDetails = (mode: ViewMode) => {
    switch (mode) {
      case "3D_SPACE":
        return { label: "3D Knowledge Graph", desc: "Interactive concentric orbital space", icon: Network, color: "text-sky-500" };
      case "2D_TOPOLOGY":
        return { label: "2D Topological Map", desc: "Force-directed graph & supply vectors", icon: Layers, color: "text-cyan-500" };
      case "RISK_MATRIX":
        return { label: "Supplier Risk Matrix", desc: "Quadrant analysis & risk distribution", icon: Grid3X3, color: "text-indigo-500" };
    }
  };

  const activeViewInfo = getViewDetails(viewMode);
  const ActiveIcon = activeViewInfo.icon;

  return (
    <header className="sticky top-0 z-40 w-full border-b border-slate-200 dark:border-white/10 bg-white/90 dark:bg-[#0A0A0C]/90 backdrop-blur-xl transition-colors duration-300">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-3 flex items-center justify-between gap-4">
        {/* Left: Brand Identity with Design Label */}
        <div 
          className="flex items-center gap-3 cursor-pointer select-none group" 
          onClick={() => onShowLanding ? onShowLanding() : onSetViewMode("3D_SPACE")}
        >
          <div className="relative flex items-center justify-center w-10 h-10 rounded-xl bg-gradient-to-br from-sky-400 via-sky-600 to-indigo-600 p-0.5 shadow-lg shadow-sky-500/25 group-hover:scale-105 transition-transform">
            <div className="w-full h-full bg-white dark:bg-[#0A0A0C] rounded-[10px] flex items-center justify-center">
              <Network className="w-5 h-5 text-sky-500 dark:text-[#38BDF8] animate-pulse" />
            </div>
          </div>

          <div>
            <div className="design-label text-sky-600 dark:text-sky-400 font-bold">TrustGraph AI</div>
            <div className="flex items-center gap-2">
              <span className="font-display font-bold text-base sm:text-lg tracking-tight text-slate-900 dark:text-[#E2E8F0]">
                SUPPLY CHAIN KNOWLEDGE GRAPH
              </span>
              <span className="px-1.5 py-0.5 rounded text-[9px] font-mono font-semibold bg-sky-100 dark:bg-sky-950/60 border border-sky-300 dark:border-sky-400/40 text-sky-700 dark:text-sky-300">
                LIVE
              </span>
            </div>
          </div>
        </div>

        {/* Center: Top-Center Hamburger Navigation Menu */}
        <div ref={menuRef} className="relative">
          <button
            id="center-hamburger-menu-btn"
            onClick={() => {
              sound.playClick();
              setIsMenuOpen(!isMenuOpen);
            }}
            className="px-3.5 py-2 rounded-2xl bg-slate-100/90 dark:bg-white/10 hover:bg-slate-200 dark:hover:bg-white/15 border border-slate-300 dark:border-white/15 backdrop-blur-md text-xs font-mono text-slate-800 dark:text-slate-100 flex items-center gap-2.5 shadow-sm transition-all cursor-pointer group"
          >
            <div className="p-1 rounded-lg bg-sky-500/10 dark:bg-sky-400/20 text-sky-600 dark:text-cyan-300 group-hover:scale-110 transition-transform">
              {isMenuOpen ? <X className="w-3.5 h-3.5" /> : <Menu className="w-3.5 h-3.5" />}
            </div>
            <div className="flex items-center gap-1.5">
              <ActiveIcon className="w-3.5 h-3.5 text-sky-500 dark:text-cyan-400" />
              <span className="font-semibold hidden sm:inline">{activeViewInfo.label}</span>
              <span className="font-semibold sm:hidden">Views</span>
            </div>
            <ChevronDown className={`w-3.5 h-3.5 text-slate-400 transition-transform duration-200 ${isMenuOpen ? "rotate-180" : ""}`} />
          </button>

          {/* Centered Glassmorphic Dropdown Drawer */}
          {isMenuOpen && (
            <div className="absolute left-1/2 -translate-x-1/2 top-full mt-2 w-72 sm:w-80 rounded-2xl bg-white/95 dark:bg-[#0C0C10]/95 border border-slate-200 dark:border-white/15 shadow-2xl backdrop-blur-2xl p-2 z-50 animate-in fade-in slide-in-from-top-2 duration-200">
              <div className="px-3 py-2 border-b border-slate-100 dark:border-white/10 flex items-center justify-between text-[10px] font-mono uppercase tracking-wider text-slate-500 dark:text-slate-400">
                <span className="flex items-center gap-1.5">
                  <Compass className="w-3 h-3 text-sky-500" />
                  Knowledge Graph Navigation
                </span>
                <span className="text-sky-600 dark:text-cyan-400 font-bold">Fast Switch</span>
              </div>

              <div className="mt-1.5 space-y-1">
                {onShowLanding && (
                  <button
                    onClick={() => {
                      sound.playClick();
                      setIsMenuOpen(false);
                      onShowLanding();
                    }}
                    className="w-full p-2.5 rounded-xl flex items-center gap-3 text-left hover:bg-slate-100 dark:hover:bg-white/10 transition-colors cursor-pointer text-slate-700 dark:text-slate-200 group"
                  >
                    <div className="p-2 rounded-xl bg-slate-100 dark:bg-white/5 group-hover:bg-sky-500 group-hover:text-white transition-colors">
                      <Home className="w-4 h-4" />
                    </div>
                    <div>
                      <div className="text-xs font-bold font-display">Landing Page</div>
                      <div className="text-[10px] text-slate-500 dark:text-slate-400 font-mono">Overview &amp; architectural pillars</div>
                    </div>
                  </button>
                )}

                <button
                  onClick={() => {
                    sound.playClick();
                    onSetViewMode("3D_SPACE");
                    setIsMenuOpen(false);
                  }}
                  className={`w-full p-2.5 rounded-xl flex items-center gap-3 text-left transition-colors cursor-pointer group ${
                    viewMode === "3D_SPACE"
                      ? "bg-sky-500/10 dark:bg-sky-400/20 text-sky-700 dark:text-cyan-300 border border-sky-500/30 dark:border-sky-400/40"
                      : "hover:bg-slate-100 dark:hover:bg-white/10 text-slate-700 dark:text-slate-200"
                  }`}
                >
                  <div className={`p-2 rounded-xl transition-colors ${
                    viewMode === "3D_SPACE" ? "bg-sky-500 text-white" : "bg-slate-100 dark:bg-white/5 group-hover:bg-sky-500 group-hover:text-white"
                  }`}>
                    <Network className="w-4 h-4" />
                  </div>
                  <div className="flex-1">
                    <div className="text-xs font-bold font-display flex items-center justify-between">
                      <span>3D Knowledge Graph</span>
                      {viewMode === "3D_SPACE" && <span className="text-[9px] font-mono px-1.5 py-0.5 rounded bg-sky-500 text-white">ACTIVE</span>}
                    </div>
                    <div className="text-[10px] text-slate-500 dark:text-slate-400 font-mono">Orbital mechanics &amp; shockwaves</div>
                  </div>
                </button>

                <button
                  onClick={() => {
                    sound.playClick();
                    onSetViewMode("2D_TOPOLOGY");
                    setIsMenuOpen(false);
                  }}
                  className={`w-full p-2.5 rounded-xl flex items-center gap-3 text-left transition-colors cursor-pointer group ${
                    viewMode === "2D_TOPOLOGY"
                      ? "bg-sky-500/10 dark:bg-sky-400/20 text-sky-700 dark:text-cyan-300 border border-sky-500/30 dark:border-sky-400/40"
                      : "hover:bg-slate-100 dark:hover:bg-white/10 text-slate-700 dark:text-slate-200"
                  }`}
                >
                  <div className={`p-2 rounded-xl transition-colors ${
                    viewMode === "2D_TOPOLOGY" ? "bg-sky-500 text-white" : "bg-slate-100 dark:bg-white/5 group-hover:bg-sky-500 group-hover:text-white"
                  }`}>
                    <Layers className="w-4 h-4" />
                  </div>
                  <div className="flex-1">
                    <div className="text-xs font-bold font-display flex items-center justify-between">
                      <span>2D Topological Map</span>
                      {viewMode === "2D_TOPOLOGY" && <span className="text-[9px] font-mono px-1.5 py-0.5 rounded bg-sky-500 text-white">ACTIVE</span>}
                    </div>
                    <div className="text-[10px] text-slate-500 dark:text-slate-400 font-mono">Force-directed supply vector plane</div>
                  </div>
                </button>

                <button
                  onClick={() => {
                    sound.playClick();
                    onSetViewMode("RISK_MATRIX");
                    setIsMenuOpen(false);
                  }}
                  className={`w-full p-2.5 rounded-xl flex items-center gap-3 text-left transition-colors cursor-pointer group ${
                    viewMode === "RISK_MATRIX"
                      ? "bg-sky-500/10 dark:bg-sky-400/20 text-sky-700 dark:text-cyan-300 border border-sky-500/30 dark:border-sky-400/40"
                      : "hover:bg-slate-100 dark:hover:bg-white/10 text-slate-700 dark:text-slate-200"
                  }`}
                >
                  <div className={`p-2 rounded-xl transition-colors ${
                    viewMode === "RISK_MATRIX" ? "bg-sky-500 text-white" : "bg-slate-100 dark:bg-white/5 group-hover:bg-sky-500 group-hover:text-white"
                  }`}>
                    <Grid3X3 className="w-4 h-4" />
                  </div>
                  <div className="flex-1">
                    <div className="text-xs font-bold font-display flex items-center justify-between">
                      <span>Risk Matrix &amp; Quadrants</span>
                      {viewMode === "RISK_MATRIX" && <span className="text-[9px] font-mono px-1.5 py-0.5 rounded bg-sky-500 text-white">ACTIVE</span>}
                    </div>
                    <div className="text-[10px] text-slate-500 dark:text-slate-400 font-mono">Statistical risk scatter &amp; clusters</div>
                  </div>
                </button>
              </div>
            </div>
          )}
        </div>

        {/* Right: Actions, Theme, Sound & Operator Profile */}
        <div className="flex items-center justify-end gap-2 sm:gap-3">
          {/* Theme Toggle Button */}
          <button
            id="navbar-theme-toggle-btn"
            onClick={() => {
              sound.playClick();
              onToggleTheme();
            }}
            className="p-2 rounded-xl border border-slate-200 dark:border-white/10 bg-slate-100/80 dark:bg-white/5 text-slate-700 dark:text-slate-300 hover:text-amber-500 dark:hover:text-amber-400 transition-all text-xs cursor-pointer shadow-sm"
            title={`Switch to ${theme === "dark" ? "Light" : "Dark"} Mode`}
          >
            {theme === "dark" ? <Sun className="w-4 h-4 text-amber-400" /> : <Moon className="w-4 h-4 text-slate-700" />}
          </button>

          {/* Audio Synthesizer Mute Toggle */}
          <button
            id="toggle-audio-btn"
            onClick={toggleSound}
            className={`p-2 rounded-xl border transition-all text-xs cursor-pointer shadow-sm ${
              isMuted
                ? "bg-slate-100/80 dark:bg-white/5 border-slate-200 dark:border-white/10 text-slate-400 dark:text-slate-500 hover:text-slate-700 dark:hover:text-slate-300"
                : "bg-sky-500/10 border-sky-500/40 text-sky-600 dark:text-[#38BDF8]"
            }`}
            title={isMuted ? "Unmute Audio Synthesizer" : "Mute Audio Synthesizer"}
          >
            {isMuted ? <VolumeX className="w-4 h-4" /> : <Volume2 className="w-4 h-4 text-sky-500 animate-pulse" />}
          </button>

          {/* User Profile & Session Controls */}
          {user ? (
            <div className="flex items-center gap-2 pl-2 border-l border-slate-200 dark:border-white/10">
              {/* Profile Avatar Trigger Button */}
              <button
                id="user-profile-trigger-btn"
                onClick={() => {
                  sound.playClick();
                  onOpenProfile?.();
                }}
                className="flex items-center gap-2 p-1 sm:px-2.5 sm:py-1 rounded-xl bg-slate-100 dark:bg-white/5 hover:bg-slate-200 dark:hover:bg-white/10 border border-slate-200 dark:border-white/10 transition-all cursor-pointer group"
                title="Edit Operator Profile Settings"
              >
                <div className="relative w-7 h-7 rounded-lg bg-gradient-to-br from-sky-500 to-indigo-600 p-0.5 shadow-sm">
                  {user.photoURL ? (
                    <img
                      src={user.photoURL}
                      alt={user.name}
                      referrerPolicy="no-referrer"
                      className="w-full h-full object-cover rounded-[6px]"
                    />
                  ) : (
                    <div className="w-full h-full bg-white dark:bg-[#0A0A0C] rounded-[6px] flex items-center justify-center text-sky-500 font-bold text-xs font-mono">
                      {user.name.charAt(0).toUpperCase()}
                    </div>
                  )}
                </div>
                <div className="hidden sm:block text-left">
                  <div className="text-xs font-bold text-slate-900 dark:text-white line-clamp-1 font-mono leading-none group-hover:text-sky-500 transition-colors">
                    {user.name}
                  </div>
                  <div className="text-[9px] text-sky-600 dark:text-cyan-400 font-mono line-clamp-1 mt-0.5">
                    Profile Settings
                  </div>
                </div>
              </button>

              <button
                id="logout-btn"
                onClick={() => { sound.playClick(); onLogout(); }}
                className="p-2 rounded-xl bg-slate-100 dark:bg-white/5 hover:bg-rose-50 dark:hover:bg-rose-950/40 border border-slate-200 dark:border-white/10 text-slate-500 dark:text-slate-400 hover:text-rose-600 dark:hover:text-rose-400 transition-colors cursor-pointer"
                title="Sign Out to Landing Page"
              >
                <LogOut className="w-4 h-4" />
              </button>
            </div>
          ) : (
            <button
              id="login-modal-btn"
              onClick={() => { sound.playClick(); onLoginClick(); }}
              className="px-3.5 py-2 rounded-xl bg-slate-900 hover:bg-slate-800 dark:bg-sky-500/20 dark:hover:bg-sky-500/30 text-white dark:text-sky-300 border border-slate-800 dark:border-sky-500/40 text-xs font-mono font-bold flex items-center gap-1.5 cursor-pointer transition-all shadow-sm"
            >
              <LogIn className="w-3.5 h-3.5 text-sky-400" />
              <span>Login</span>
            </button>
          )}
        </div>
      </div>
    </header>
  );
};


