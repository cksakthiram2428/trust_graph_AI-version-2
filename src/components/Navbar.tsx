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
  Compass,
  Settings,
  ArrowRight
} from "lucide-react";
import { motion, AnimatePresence } from "motion/react";

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

  // Close menu on click outside (only for desktop dropdown)
  useEffect(() => {
    const handleClickOutside = (event: MouseEvent) => {
      if (menuRef.current && !menuRef.current.contains(event.target as Node)) {
        setIsMenuOpen(false);
      }
    };
    if (isMenuOpen && window.innerWidth >= 640) {
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
    <header className="sticky top-0 z-50 w-full border-b border-slate-200 dark:border-white/10 bg-white/90 dark:bg-[#0A0A0C]/90 backdrop-blur-xl transition-colors duration-300">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-3 flex items-center justify-between gap-2">
        {/* Left: Brand Identity */}
        <div 
          className="flex items-center gap-2 sm:gap-3 cursor-pointer select-none group flex-shrink-0" 
          onClick={() => onShowLanding ? onShowLanding() : onSetViewMode("3D_SPACE")}
        >
          <div className="relative flex items-center justify-center w-8 h-8 sm:w-10 sm:h-10 rounded-lg sm:rounded-xl bg-gradient-to-br from-sky-400 via-sky-600 to-indigo-600 p-0.5 shadow-lg shadow-sky-500/25 group-hover:scale-105 transition-transform">
            <div className="w-full h-full bg-white dark:bg-[#0A0A0C] rounded-[6px] sm:rounded-[10px] flex items-center justify-center">
              <Network className="w-4 h-4 sm:w-5 sm:h-5 text-sky-500 dark:text-[#38BDF8]" />
            </div>
          </div>

          <div className="flex flex-col">
            <div className="design-label text-sky-600 dark:text-sky-400 font-bold text-[10px] sm:text-xs">TrustGraph AI</div>
            <div className="flex items-center gap-2">
              <span className="font-display font-bold text-xs sm:text-lg tracking-tight text-slate-900 dark:text-[#E2E8F0] whitespace-nowrap">
                <span className="hidden xs:inline">SUPPLY CHAIN</span> KNOWLEDGE GRAPH
              </span>
            </div>
          </div>
        </div>

        {/* Center/Right: Navigation & Actions */}
        <div className="flex items-center gap-1.5 sm:gap-3">
          {/* Desktop Navigation Dropdown */}
          <div ref={menuRef} className="relative hidden sm:block">
            <button
              onClick={() => {
                sound.playClick();
                setIsMenuOpen(!isMenuOpen);
              }}
              className="px-3.5 py-2 rounded-2xl bg-slate-100/90 dark:bg-white/10 hover:bg-slate-200 dark:hover:bg-white/15 border border-slate-300 dark:border-white/15 backdrop-blur-md text-xs font-mono text-slate-800 dark:text-slate-100 flex items-center gap-2.5 shadow-sm transition-all cursor-pointer group"
            >
              <div className="p-1 rounded-lg bg-sky-500/10 dark:bg-sky-400/20 text-sky-600 dark:text-cyan-300">
                <Menu className="w-3.5 h-3.5" />
              </div>
              <div className="flex items-center gap-1.5">
                <ActiveIcon className="w-3.5 h-3.5 text-sky-500 dark:text-cyan-400" />
                <span className="font-semibold">{activeViewInfo.label}</span>
              </div>
              <ChevronDown className={`w-3.5 h-3.5 text-slate-400 transition-transform duration-200 ${isMenuOpen ? "rotate-180" : ""}`} />
            </button>

            <AnimatePresence>
              {isMenuOpen && (
                <motion.div 
                  initial={{ opacity: 0, y: 10, scale: 0.95 }}
                  animate={{ opacity: 1, y: 0, scale: 1 }}
                  exit={{ opacity: 0, y: 10, scale: 0.95 }}
                  className="absolute left-1/2 -translate-x-1/2 top-full mt-2 w-80 rounded-2xl bg-white/95 dark:bg-[#0C0C10]/95 border border-slate-200 dark:border-white/15 shadow-2xl backdrop-blur-2xl p-2 z-50 overflow-hidden"
                >
                  <div className="px-3 py-2 border-b border-slate-100 dark:border-white/10 flex items-center justify-between text-[10px] font-mono uppercase tracking-wider text-slate-500 dark:text-slate-400">
                    <span className="flex items-center gap-1.5">
                      <Compass className="w-3 h-3 text-sky-500" />
                      Knowledge Graph Navigation
                    </span>
                  </div>

                  <div className="mt-1.5 space-y-1">
                    {[
                      { id: "landing", label: "Landing Page", icon: Home, desc: "Overview & architecture", active: false, action: onShowLanding },
                      { id: "3D_SPACE", label: "3D Knowledge Graph", icon: Network, desc: "Orbital mechanics", active: viewMode === "3D_SPACE", action: () => onSetViewMode("3D_SPACE") },
                      { id: "2D_TOPOLOGY", label: "2D Topological Map", icon: Layers, desc: "Vector directed plane", active: viewMode === "2D_TOPOLOGY", action: () => onSetViewMode("2D_TOPOLOGY") },
                      { id: "RISK_MATRIX", label: "Risk Matrix & Quadrants", icon: Grid3X3, desc: "Statistical clusters", active: viewMode === "RISK_MATRIX", action: () => onSetViewMode("RISK_MATRIX") },
                    ].map((item) => (
                      <button
                        key={item.id}
                        onClick={() => {
                          sound.playClick();
                          item.action?.();
                          setIsMenuOpen(false);
                        }}
                        className={`w-full p-2.5 rounded-xl flex items-center gap-3 text-left transition-all cursor-pointer group ${
                          item.active 
                            ? "bg-sky-500/10 dark:bg-sky-400/20 text-sky-700 dark:text-cyan-300 border border-sky-500/30 dark:border-sky-400/40" 
                            : "hover:bg-slate-100 dark:hover:bg-white/10 text-slate-700 dark:text-slate-200"
                        }`}
                      >
                        <div className={`p-2 rounded-xl transition-colors ${
                          item.active ? "bg-sky-500 text-white" : "bg-slate-100 dark:bg-white/5 group-hover:bg-sky-500 group-hover:text-white"
                        }`}>
                          <item.icon className="w-4 h-4" />
                        </div>
                        <div className="flex-1 min-w-0">
                          <div className="text-xs font-bold font-display flex items-center justify-between">
                            <span className="truncate">{item.label}</span>
                            {item.active && <span className="text-[8px] font-mono px-1 py-0.5 rounded bg-sky-500 text-white flex-shrink-0">ACTIVE</span>}
                          </div>
                          <div className="text-[10px] text-slate-500 dark:text-slate-400 font-mono truncate">{item.desc}</div>
                        </div>
                      </button>
                    ))}
                  </div>
                </motion.div>
              )}
            </AnimatePresence>
          </div>

          {/* Desktop Right Actions */}
          <div className="hidden sm:flex items-center gap-2 lg:gap-3">
            <button
              onClick={() => { sound.playClick(); onToggleTheme(); }}
              className="p-2 rounded-xl border border-slate-200 dark:border-white/10 bg-slate-100/80 dark:bg-white/5 text-slate-700 dark:text-slate-300 hover:text-amber-500 dark:hover:text-amber-400 transition-all cursor-pointer shadow-sm"
            >
              {theme === "dark" ? <Sun className="w-4 h-4 text-amber-400" /> : <Moon className="w-4 h-4 text-slate-700" />}
            </button>

            <button
              onClick={toggleSound}
              className={`p-2 rounded-xl border transition-all cursor-pointer shadow-sm ${
                isMuted
                  ? "bg-slate-100/80 dark:bg-white/5 border-slate-200 dark:border-white/10 text-slate-400 dark:text-slate-500"
                  : "bg-sky-500/10 border-sky-500/40 text-sky-600 dark:text-[#38BDF8]"
              }`}
            >
              {isMuted ? <VolumeX className="w-4 h-4" /> : <Volume2 className="w-4 h-4 text-sky-500 animate-pulse" />}
            </button>

            {user ? (
              <button
                onClick={() => { sound.playClick(); onOpenProfile?.(); }}
                className="flex items-center gap-2.5 p-1 px-2.5 rounded-xl bg-slate-100 dark:bg-white/5 hover:bg-slate-200 dark:hover:bg-white/10 border border-slate-200 dark:border-white/10 transition-all cursor-pointer group"
              >
                <div className="relative w-7 h-7 rounded-lg bg-gradient-to-br from-sky-500 to-indigo-600 p-0.5 shadow-sm">
                  {user.photoURL ? (
                    <img src={user.photoURL} alt={user.name} referrerPolicy="no-referrer" className="w-full h-full object-cover rounded-[6px]" />
                  ) : (
                    <div className="w-full h-full bg-white dark:bg-[#0A0A0C] rounded-[6px] flex items-center justify-center text-sky-500 font-bold text-xs font-mono">
                      {user.name.charAt(0).toUpperCase()}
                    </div>
                  )}
                </div>
                <div className="text-left hidden lg:block">
                  <div className="text-xs font-bold text-slate-900 dark:text-white line-clamp-1 font-mono leading-none">{user.name}</div>
                  <div className="text-[9px] text-sky-600 dark:text-cyan-400 font-mono line-clamp-1 mt-0.5">Operator Profile</div>
                </div>
              </button>
            ) : (
              <button
                onClick={() => { sound.playClick(); onLoginClick(); }}
                className="px-3.5 py-2 rounded-xl bg-slate-900 hover:bg-slate-800 dark:bg-sky-500/20 dark:hover:bg-sky-500/30 text-white dark:text-sky-300 border border-slate-800 dark:border-sky-500/40 text-xs font-mono font-bold flex items-center gap-1.5 cursor-pointer shadow-sm"
              >
                <LogIn className="w-3.5 h-3.5 text-sky-400" />
                <span>Login</span>
              </button>
            )}
          </div>

          {/* Mobile Hamburger Button */}
          <button
            onClick={() => {
              sound.playClick();
              setIsMenuOpen(true);
            }}
            className="sm:hidden p-2 rounded-xl bg-slate-100 dark:bg-white/10 border border-slate-200 dark:border-white/10 text-slate-700 dark:text-white"
          >
            <Menu className="w-5 h-5" />
          </button>
        </div>
      </div>

      {/* Mobile Sidebar (Drawer) */}
      <AnimatePresence>
        {isMenuOpen && window.innerWidth < 640 && (
          <>
            <motion.div
              initial={{ opacity: 0 }}
              animate={{ opacity: 1 }}
              exit={{ opacity: 0 }}
              onClick={() => setIsMenuOpen(false)}
              className="fixed inset-0 bg-black/60 backdrop-blur-sm z-[60]"
            />
            <motion.div
              initial={{ x: "100%" }}
              animate={{ x: 0 }}
              exit={{ x: "100%" }}
              transition={{ type: "spring", damping: 25, stiffness: 200 }}
              className="fixed right-0 top-0 bottom-0 w-[80vw] max-w-sm bg-white dark:bg-[#08080A] border-l border-slate-200 dark:border-white/10 z-[70] shadow-2xl flex flex-col"
            >
              <div className="p-4 border-b border-slate-100 dark:border-white/10 flex items-center justify-between">
                <div className="flex items-center gap-2">
                  <div className="w-8 h-8 rounded-lg bg-sky-500 flex items-center justify-center text-white">
                    <Compass className="w-5 h-5" />
                  </div>
                  <span className="font-display font-bold text-slate-900 dark:text-white">PLATFORM NAVIGATION</span>
                </div>
                <button 
                  onClick={() => setIsMenuOpen(false)}
                  className="p-2 rounded-lg hover:bg-slate-100 dark:hover:bg-white/5 text-slate-500 dark:text-slate-400"
                >
                  <X className="w-5 h-5" />
                </button>
              </div>

              <div className="flex-1 overflow-y-auto p-4 space-y-6">
                {/* Views Section */}
                <div>
                  <div className="text-[10px] font-mono text-slate-400 dark:text-slate-500 uppercase tracking-[0.2em] mb-3">View Modes</div>
                  <div className="space-y-2">
                    {[
                      { id: "3D_SPACE", label: "3D Knowledge Graph", icon: Network, active: viewMode === "3D_SPACE", action: () => onSetViewMode("3D_SPACE") },
                      { id: "2D_TOPOLOGY", label: "2D Topological Map", icon: Layers, active: viewMode === "2D_TOPOLOGY", action: () => onSetViewMode("2D_TOPOLOGY") },
                      { id: "RISK_MATRIX", label: "Risk Matrix & Quadrants", icon: Grid3X3, active: viewMode === "RISK_MATRIX", action: () => onSetViewMode("RISK_MATRIX") },
                    ].map((item) => (
                      <button
                        key={item.id}
                        onClick={() => {
                          sound.playClick();
                          item.action();
                          setIsMenuOpen(false);
                        }}
                        className={`w-full p-4 rounded-2xl border flex items-center gap-4 transition-all text-left ${
                          item.active 
                            ? "bg-sky-500/10 border-sky-500/40 dark:bg-sky-400/20 dark:border-sky-400/50" 
                            : "bg-slate-50 dark:bg-white/5 border-slate-200 dark:border-white/5 hover:border-sky-500/30"
                        }`}
                      >
                        <div className={`p-2.5 rounded-xl ${item.active ? "bg-sky-500 text-white" : "bg-white dark:bg-white/5 shadow-sm text-slate-600 dark:text-slate-400"}`}>
                          <item.icon className="w-5 h-5" />
                        </div>
                        <div className="flex-1">
                          <div className={`text-sm font-bold ${item.active ? "text-sky-600 dark:text-cyan-300" : "text-slate-700 dark:text-slate-200"}`}>{item.label}</div>
                          <div className="text-[10px] text-slate-500 dark:text-slate-400 font-mono mt-0.5">Select current spatial view</div>
                        </div>
                        <ArrowRight className={`w-4 h-4 transition-transform ${item.active ? "text-sky-500 translate-x-0" : "text-slate-300 dark:text-slate-600 -translate-x-2 opacity-0 group-hover:opacity-100"}`} />
                      </button>
                    ))}
                  </div>
                </div>

                {/* System Controls */}
                <div>
                  <div className="text-[10px] font-mono text-slate-400 dark:text-slate-500 uppercase tracking-[0.2em] mb-3">System Controls</div>
                  <div className="grid grid-cols-2 gap-2">
                    <button
                      onClick={() => { sound.playClick(); onToggleTheme(); }}
                      className="p-4 rounded-2xl bg-slate-50 dark:bg-white/5 border border-slate-200 dark:border-white/5 flex flex-col items-center gap-2 transition-all active:scale-95"
                    >
                      {theme === "dark" ? <Sun className="w-5 h-5 text-amber-400" /> : <Moon className="w-5 h-5 text-slate-600" />}
                      <span className="text-[10px] font-bold font-mono dark:text-slate-300">{theme === "dark" ? "LIGHT" : "DARK"} MODE</span>
                    </button>
                    <button
                      onClick={toggleSound}
                      className={`p-4 rounded-2xl border flex flex-col items-center gap-2 transition-all active:scale-95 ${
                        isMuted 
                          ? "bg-slate-50 dark:bg-white/5 border-slate-200 dark:border-white/5" 
                          : "bg-sky-500/10 border-sky-500/40 dark:bg-sky-400/20 dark:border-sky-400/50"
                      }`}
                    >
                      {isMuted ? <VolumeX className="w-5 h-5 text-slate-400" /> : <Volume2 className="w-5 h-5 text-sky-500" />}
                      <span className={`text-[10px] font-bold font-mono ${isMuted ? "text-slate-400" : "text-sky-500"}`}>{isMuted ? "MUTED" : "AUDIO ON"}</span>
                    </button>
                  </div>
                </div>

                {/* Operator Profile */}
                <div>
                  <div className="text-[10px] font-mono text-slate-400 dark:text-slate-500 uppercase tracking-[0.2em] mb-3">Operator</div>
                  {user ? (
                    <div className="p-4 rounded-2xl bg-slate-50 dark:bg-white/5 border border-slate-200 dark:border-white/5 space-y-4">
                      <div className="flex items-center gap-4">
                        <div className="w-12 h-12 rounded-xl bg-gradient-to-br from-sky-500 to-indigo-600 p-0.5 shadow-lg">
                          <div className="w-full h-full bg-white dark:bg-[#0A0A0C] rounded-[10px] flex items-center justify-center overflow-hidden">
                            {user.photoURL ? (
                              <img src={user.photoURL} alt={user.name} referrerPolicy="no-referrer" className="w-full h-full object-cover" />
                            ) : (
                              <UserIcon className="w-6 h-6 text-sky-500" />
                            )}
                          </div>
                        </div>
                        <div>
                          <div className="text-sm font-bold text-slate-900 dark:text-white leading-tight">{user.name}</div>
                          <div className="text-[11px] text-sky-600 dark:text-cyan-400 font-mono mt-1">Verified Operator</div>
                        </div>
                      </div>
                      <div className="grid grid-cols-2 gap-2 pt-2 border-t border-slate-200 dark:border-white/5">
                        <button
                          onClick={() => { sound.playClick(); onOpenProfile?.(); setIsMenuOpen(false); }}
                          className="flex items-center justify-center gap-2 py-2.5 rounded-xl bg-white dark:bg-white/5 border border-slate-200 dark:border-white/10 text-[11px] font-bold text-slate-600 dark:text-slate-300"
                        >
                          <Settings className="w-3.5 h-3.5" />
                          Settings
                        </button>
                        <button
                          onClick={() => { sound.playClick(); onLogout(); setIsMenuOpen(false); }}
                          className="flex items-center justify-center gap-2 py-2.5 rounded-xl bg-rose-50 dark:bg-rose-500/10 border border-rose-100 dark:border-rose-500/20 text-[11px] font-bold text-rose-600 dark:text-rose-400"
                        >
                          <LogOut className="w-3.5 h-3.5" />
                          Logout
                        </button>
                      </div>
                    </div>
                  ) : (
                    <button
                      onClick={() => { sound.playClick(); onLoginClick(); setIsMenuOpen(false); }}
                      className="w-full p-4 rounded-2xl bg-slate-900 dark:bg-sky-500/20 border border-slate-800 dark:border-sky-400/40 flex items-center justify-between group"
                    >
                      <div className="flex items-center gap-3">
                        <div className="p-2 rounded-xl bg-sky-500/20 dark:bg-sky-400/30 text-sky-400">
                          <LogIn className="w-5 h-5" />
                        </div>
                        <div className="text-left">
                          <div className="text-sm font-bold text-white tracking-wide">Operator Login</div>
                          <div className="text-[10px] text-slate-400 dark:text-sky-300/60 font-mono">Access secure supply hub</div>
                        </div>
                      </div>
                      <ArrowRight className="w-5 h-5 text-sky-500 group-hover:translate-x-1 transition-transform" />
                    </button>
                  )}
                </div>
              </div>

              <div className="p-4 border-t border-slate-100 dark:border-white/10 bg-slate-50/50 dark:bg-black/20">
                <div className="flex items-center justify-between">
                  <div className="text-[10px] font-mono text-slate-400">VERSION 2.4.0 [BETA]</div>
                  <div className="flex items-center gap-1.5">
                    <span className="w-1.5 h-1.5 rounded-full bg-emerald-500 animate-pulse" />
                    <span className="text-[10px] font-mono text-emerald-600 dark:text-emerald-400 uppercase font-bold">Systems Nominal</span>
                  </div>
                </div>
              </div>
            </motion.div>
          </>
        )}
      </AnimatePresence>
    </header>
  );
};



