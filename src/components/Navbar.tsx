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
  LogIn,
  LogOut,
  Sun,
  Moon,
  Home,
  Menu,
  X,
  ChevronDown,
  Terminal,
  Activity,
  ShieldCheck,
  Settings,
  Mail,
  FileText,
  Scale,
  Building2,
  HelpCircle,
  Radio
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
  onOpenRealtimeOps?: () => void;
  onlineUsersCount?: number;
  theme: "dark" | "light";
  onToggleTheme: () => void;
  onShowLanding?: () => void;
  onOpenPrivacy?: () => void;
  onOpenTerms?: () => void;
  onOpenContact?: () => void;
  onTest404?: () => void;
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
  onOpenRealtimeOps,
  onlineUsersCount = 3,
  theme,
  onToggleTheme,
  onShowLanding,
  onOpenPrivacy,
  onOpenTerms,
  onOpenContact,
  onTest404
}) => {
  const [isMuted, setIsMuted] = useState(sound.isMuted);
  const [isMenuOpen, setIsMenuOpen] = useState(false);
  const [isUserMenuOpen, setIsUserMenuOpen] = useState(false);
  const menuRef = useRef<HTMLDivElement>(null);
  const userMenuRef = useRef<HTMLDivElement>(null);

  const toggleSound = () => {
    sound.isMuted = !sound.isMuted;
    setIsMuted(sound.isMuted);
    if (!sound.isMuted) sound.playClick();
  };

  useEffect(() => {
    const handleClickOutside = (event: MouseEvent) => {
      if (menuRef.current && !menuRef.current.contains(event.target as Node)) {
        setIsMenuOpen(false);
      }
      if (userMenuRef.current && !userMenuRef.current.contains(event.target as Node)) {
        setIsUserMenuOpen(false);
      }
    };
    document.addEventListener("mousedown", handleClickOutside);
    return () => {
      document.removeEventListener("mousedown", handleClickOutside);
    };
  }, []);

  return (
    <header className="sticky top-0 z-50 w-full bg-[#FFFFFF] dark:bg-[#0B0E14] border-b border-slate-200 dark:border-[#1C2433] transition-colors duration-200 font-mono">
      {/* Terminal Command Bar Header Container */}
      <div className="w-full px-3 sm:px-6 py-2.5 flex items-center justify-between gap-3 text-xs">
        
        {/* Left: Terminal Masthead & Live Telemetry Pill */}
        <div className="flex items-center gap-3 sm:gap-4 flex-shrink-0">
          <div 
            onClick={() => onShowLanding ? onShowLanding() : onSetViewMode("3D_SPACE")}
            className="flex items-center gap-2.5 cursor-pointer select-none group"
          >
            <div className="w-7 h-7 rounded border border-cyan-500/40 bg-cyan-500/10 flex items-center justify-center text-cyan-500 group-hover:border-cyan-400 transition-colors">
              <Terminal className="w-4 h-4" />
            </div>
            <div className="flex flex-col">
              <span className="font-display font-bold text-sm tracking-tight text-slate-900 dark:text-white leading-none">
                TRUSTGRAPH<span className="text-cyan-700 dark:text-cyan-400">.AI</span>
              </span>
              <span className="text-[9px] text-slate-600 dark:text-slate-400 uppercase tracking-widest leading-tight mt-0.5">
                CONTAGION DEFENSE OS
              </span>
            </div>
          </div>

          {/* Fixed Telemetry Status Chip & Real-Time Ops Trigger */}
          <button
            onClick={() => {
              sound.playClick();
              if (onOpenRealtimeOps) onOpenRealtimeOps();
            }}
            className="hidden md:flex items-center gap-2 px-2.5 py-1 rounded border border-cyan-500/30 bg-cyan-500/10 hover:bg-cyan-500/20 text-[10px] text-slate-700 dark:text-slate-300 transition-colors cursor-pointer"
            title="View Real-Time Operations Intelligence & Multi-User Presence Matrix"
          >
            <span className="w-1.5 h-1.5 rounded-full bg-emerald-500 animate-pulse" />
            <span className="text-cyan-600 dark:text-cyan-400 font-bold">{onlineUsersCount} LIVE ADM</span>
            <span className="text-slate-300 dark:text-slate-700">|</span>
            <span className="text-emerald-600 dark:text-emerald-400 font-semibold">STABLE</span>
            <span className="text-slate-300 dark:text-slate-700">|</span>
            <Radio className="w-3 h-3 text-cyan-500" />
          </button>
        </div>

        {/* Center: Command Mode Selector (Desktop) */}
        <div className="hidden lg:flex items-center gap-1 p-1 rounded-md border border-slate-200 dark:border-[#1F293D] bg-slate-50 dark:bg-[#101520]">
          <button
            onClick={() => {
              sound.playClick();
              if (onShowLanding) onShowLanding();
            }}
            className="px-3 py-1.5 rounded text-[11px] font-mono text-slate-600 dark:text-slate-400 hover:text-cyan-500 dark:hover:text-cyan-300 transition-colors cursor-pointer"
          >
            [00 // ARCHITECTURE]
          </button>
          
          <button
            onClick={() => {
              sound.playClick();
              onSetViewMode("3D_SPACE");
            }}
            className={`px-3 py-1.5 rounded text-[11px] font-mono transition-all cursor-pointer flex items-center gap-1.5 ${
              viewMode === "3D_SPACE"
                ? "bg-cyan-500 text-slate-950 font-bold shadow-sm"
                : "text-slate-600 dark:text-slate-400 hover:text-cyan-500 dark:hover:text-cyan-300"
            }`}
          >
            <Network className="w-3 h-3" />
            <span>01: 3D SPACE</span>
          </button>

          <button
            onClick={() => {
              sound.playClick();
              onSetViewMode("2D_TOPOLOGY");
            }}
            className={`px-3 py-1.5 rounded text-[11px] font-mono transition-all cursor-pointer flex items-center gap-1.5 ${
              viewMode === "2D_TOPOLOGY"
                ? "bg-cyan-500 text-slate-950 font-bold shadow-sm"
                : "text-slate-600 dark:text-slate-400 hover:text-cyan-500 dark:hover:text-cyan-300"
            }`}
          >
            <Layers className="w-3 h-3" />
            <span>02: 2D TOPOLOGY</span>
          </button>

          <button
            onClick={() => {
              sound.playClick();
              onSetViewMode("RISK_MATRIX");
            }}
            className={`px-3 py-1.5 rounded text-[11px] font-mono transition-all cursor-pointer flex items-center gap-1.5 ${
              viewMode === "RISK_MATRIX"
                ? "bg-cyan-500 text-slate-950 font-bold shadow-sm"
                : "text-slate-600 dark:text-slate-400 hover:text-cyan-500 dark:hover:text-cyan-300"
            }`}
          >
            <Grid3X3 className="w-3 h-3" />
            <span>03: RISK MATRIX</span>
          </button>
        </div>

        {/* Right: Edge Command Actions */}
        <div className="flex items-center gap-2">
          {/* Real-Time Ops Intelligence Trigger */}
          <button
            onClick={() => {
              sound.playClick();
              if (onOpenRealtimeOps) onOpenRealtimeOps();
            }}
            className="hidden sm:flex items-center gap-1.5 px-2.5 py-1.5 rounded border border-emerald-500/40 bg-emerald-500/10 text-emerald-700 dark:text-emerald-300 hover:bg-emerald-500/20 text-xs font-bold transition-all cursor-pointer"
            title="Real-Time Operations & Admin Intelligence (Gemini AI + Live Multi-User)"
          >
            <Radio className="w-3.5 h-3.5 text-emerald-500 animate-pulse" />
            <span>OPS [{onlineUsersCount}]</span>
          </button>

          {/* AI Copilot Trigger */}
          <button
            onClick={() => {
              sound.playClick();
              onOpenCopilot();
            }}
            className="hidden sm:flex items-center gap-1.5 px-3 py-1.5 rounded border border-cyan-600/40 bg-cyan-600/10 text-cyan-700 dark:text-cyan-300 hover:bg-cyan-600/20 text-xs font-bold transition-all cursor-pointer"
            title="Open Gemini AI Forensic Copilot (⌘K)"
          >
            <Bot className="w-3.5 h-3.5" />
            <span>COPILOT [⌘K]</span>
          </button>

          {/* Sound Mute Toggle */}
          <button
            onClick={toggleSound}
            className="p-2 rounded border border-slate-200 dark:border-[#1F293D] bg-slate-50 dark:bg-[#101520] text-slate-600 dark:text-slate-400 hover:text-cyan-500 dark:hover:text-cyan-400 transition-colors cursor-pointer"
            title={isMuted ? "Unmute Audio FX" : "Mute Audio FX"}
          >
            {isMuted ? <VolumeX className="w-3.5 h-3.5" /> : <Volume2 className="w-3.5 h-3.5 text-cyan-500" />}
          </button>

          {/* Theme Toggle */}
          <button
            onClick={() => {
              sound.playClick();
              onToggleTheme();
            }}
            className="p-2 rounded border border-slate-200 dark:border-[#1F293D] bg-slate-50 dark:bg-[#101520] text-slate-600 dark:text-slate-400 hover:text-amber-500 dark:hover:text-amber-400 transition-colors cursor-pointer"
            title={`Switch to ${theme === "dark" ? "Light" : "Dark"} Mode`}
          >
            {theme === "dark" ? <Sun className="w-3.5 h-3.5 text-amber-400" /> : <Moon className="w-3.5 h-3.5 text-slate-700" />}
          </button>

          {/* Operator Profile / Session State */}
          {user ? (
            <div ref={userMenuRef} className="relative flex items-center gap-2">
              <button
                onClick={() => {
                  sound.playClick();
                  setIsUserMenuOpen(!isUserMenuOpen);
                }}
                className="flex items-center gap-2 px-2.5 py-1.5 rounded border border-slate-200 dark:border-[#1F293D] bg-slate-50 dark:bg-[#101520] hover:border-cyan-500/40 text-slate-700 dark:text-slate-300 text-xs font-mono transition-all cursor-pointer"
              >
                <div className="w-2 h-2 rounded-full bg-cyan-400" />
                <span className="hidden sm:inline font-semibold">{user.name.split(" ")[0]}</span>
                <ChevronDown className={`w-3 h-3 text-slate-400 transition-transform ${isUserMenuOpen ? "rotate-180" : ""}`} />
              </button>

              {/* Direct Desktop Logout */}
              <button
                onClick={() => {
                  sound.playClick();
                  onLogout();
                }}
                className="hidden xl:flex items-center gap-1 px-2.5 py-1.5 rounded border border-rose-500/30 bg-rose-500/10 text-rose-700 dark:text-rose-400 hover:bg-rose-500/20 text-xs font-bold transition-colors cursor-pointer"
                title="Sign out of command session"
              >
                <LogOut className="w-3 h-3" />
                <span>EXIT</span>
              </button>

              {/* User Dropdown */}
              <AnimatePresence>
                {isUserMenuOpen && (
                  <motion.div
                    initial={{ opacity: 0, y: 6 }}
                    animate={{ opacity: 1, y: 0 }}
                    exit={{ opacity: 0, y: 6 }}
                    className="absolute right-0 top-full mt-1.5 w-60 rounded border border-slate-200 dark:border-[#1F293D] bg-white dark:bg-[#0D1017] shadow-xl p-1.5 z-50 text-xs"
                  >
                    <div className="p-2 border-b border-slate-100 dark:border-[#1C2433] space-y-0.5">
                      <div className="font-bold text-slate-900 dark:text-white truncate">{user.name}</div>
                      <div className="text-[10px] text-slate-600 dark:text-slate-400 truncate">{user.email}</div>
                      <div className="text-[9px] text-cyan-700 dark:text-cyan-400 font-bold">{user.role}</div>
                    </div>

                    <div className="mt-1 space-y-0.5">
                      <button
                        onClick={() => {
                          sound.playClick();
                          setIsUserMenuOpen(false);
                          onOpenRealtimeOps?.();
                        }}
                        className="w-full px-2.5 py-2 rounded text-left bg-emerald-500/10 hover:bg-emerald-500/20 text-emerald-700 dark:text-emerald-300 flex items-center gap-2 border border-emerald-500/20 font-bold"
                      >
                        <Radio className="w-3.5 h-3.5 text-emerald-500 animate-pulse" />
                        <span>Real-Time Operations Deck</span>
                      </button>

                      <button
                        onClick={() => {
                          sound.playClick();
                          setIsUserMenuOpen(false);
                          onOpenProfile?.();
                        }}
                        className="w-full px-2.5 py-2 rounded text-left hover:bg-slate-100 dark:hover:bg-[#161B26] text-slate-700 dark:text-slate-300 flex items-center gap-2"
                      >
                        <Settings className="w-3.5 h-3.5 text-cyan-500" />
                        <span>Operator Settings</span>
                      </button>

                      <button
                        onClick={() => {
                          sound.playClick();
                          setIsUserMenuOpen(false);
                          onOpenContact?.();
                        }}
                        className="w-full px-2.5 py-2 rounded text-left hover:bg-slate-100 dark:hover:bg-[#161B26] text-slate-700 dark:text-slate-300 flex items-center gap-2"
                      >
                        <Building2 className="w-3.5 h-3.5 text-emerald-500" />
                        <span>Contact HQ</span>
                      </button>

                      <button
                        onClick={() => {
                          sound.playClick();
                          setIsUserMenuOpen(false);
                          onLogout();
                        }}
                        className="w-full px-2.5 py-2 rounded text-left bg-rose-500/10 hover:bg-rose-500/20 text-rose-700 dark:text-rose-400 flex items-center gap-2 font-bold border border-rose-500/20"
                      >
                        <LogOut className="w-3.5 h-3.5" />
                        <span>Terminate Session [Logout]</span>
                      </button>
                    </div>
                  </motion.div>
                )}
              </AnimatePresence>
            </div>
          ) : (
            <button
              onClick={() => {
                sound.playClick();
                onLoginClick();
              }}
              className="flex items-center gap-1.5 px-3 py-1.5 rounded border border-cyan-500 bg-cyan-500 text-slate-950 font-bold text-xs hover:bg-cyan-400 transition-colors cursor-pointer"
            >
              <LogIn className="w-3.5 h-3.5" />
              <span>AUTH // LOGIN</span>
            </button>
          )}

          {/* Mobile Menu Trigger */}
          <button
            onClick={() => {
              sound.playClick();
              setIsMenuOpen(true);
            }}
            className="lg:hidden p-2 rounded border border-slate-200 dark:border-[#1F293D] bg-slate-50 dark:bg-[#101520] text-slate-700 dark:text-slate-300 cursor-pointer"
          >
            <Menu className="w-4 h-4" />
          </button>
        </div>
      </div>

      {/* Mobile Drawer */}
      <AnimatePresence>
        {isMenuOpen && (
          <div className="lg:hidden">
            <motion.div
              initial={{ opacity: 0 }}
              animate={{ opacity: 1 }}
              exit={{ opacity: 0 }}
              onClick={() => setIsMenuOpen(false)}
              className="fixed inset-0 bg-black/70 backdrop-blur-xs z-[60]"
            />
            <motion.div
              initial={{ x: "100%" }}
              animate={{ x: 0 }}
              exit={{ x: "100%" }}
              transition={{ type: "tween", duration: 0.2 }}
              className="fixed right-0 top-0 bottom-0 w-80 max-w-[85vw] bg-white dark:bg-[#0A0C12] border-l border-slate-200 dark:border-[#1C2433] z-[70] shadow-2xl flex flex-col p-4 font-mono text-xs overflow-y-auto"
            >
              <div className="flex items-center justify-between pb-3 border-b border-slate-200 dark:border-[#1C2433]">
                <div className="flex items-center gap-2">
                  <Terminal className="w-4 h-4 text-cyan-500" />
                  <span className="font-display font-bold text-slate-900 dark:text-white">COMMAND CONSOLE</span>
                </div>
                <button
                  onClick={() => setIsMenuOpen(false)}
                  className="p-1 rounded text-slate-400 hover:text-slate-200"
                >
                  <X className="w-4 h-4" />
                </button>
              </div>

              <div className="mt-4 space-y-4 flex-1">
                <div>
                  <div className="text-[10px] text-slate-400 uppercase tracking-widest mb-2">Command Modes</div>
                  <div className="space-y-1.5">
                    {[
                      { id: "landing", label: "[00 // ARCHITECTURE]", icon: Home, action: onShowLanding },
                      { id: "3D_SPACE", label: "[01 // 3D KNOWLEDGE GRAPH]", icon: Network, action: () => onSetViewMode("3D_SPACE"), active: viewMode === "3D_SPACE" },
                      { id: "2D_TOPOLOGY", label: "[02 // 2D TOPOLOGY]", icon: Layers, action: () => onSetViewMode("2D_TOPOLOGY"), active: viewMode === "2D_TOPOLOGY" },
                      { id: "RISK_MATRIX", label: "[03 // RISK MATRIX]", icon: Grid3X3, action: () => onSetViewMode("RISK_MATRIX"), active: viewMode === "RISK_MATRIX" },
                    ].map((item) => (
                      <button
                        key={item.id}
                        onClick={() => {
                          sound.playClick();
                          item.action?.();
                          setIsMenuOpen(false);
                        }}
                        className={`w-full p-2.5 rounded border text-left flex items-center justify-between transition-colors ${
                          item.active
                            ? "border-cyan-500 bg-cyan-500/10 text-cyan-500 font-bold"
                            : "border-slate-200 dark:border-[#1C2433] bg-slate-50 dark:bg-[#10141E] text-slate-700 dark:text-slate-300"
                        }`}
                      >
                        <span className="flex items-center gap-2">
                          <item.icon className="w-3.5 h-3.5" />
                          {item.label}
                        </span>
                        {item.active && <span className="w-1.5 h-1.5 rounded-full bg-cyan-400" />}
                      </button>
                    ))}
                  </div>
                </div>

                <div>
                  <div className="text-[10px] text-slate-400 uppercase tracking-widest mb-2">AI Copilot & Tools</div>
                  <button
                    onClick={() => {
                      sound.playClick();
                      setIsMenuOpen(false);
                      onOpenCopilot();
                    }}
                    className="w-full p-2.5 rounded border border-cyan-500/40 bg-cyan-500/10 text-cyan-600 dark:text-cyan-400 font-bold text-left flex items-center gap-2"
                  >
                    <Bot className="w-4 h-4" />
                    <span>Launch Gemini AI Copilot</span>
                  </button>
                </div>

                {/* Operator Actions */}
                <div>
                  <div className="text-[10px] text-slate-400 uppercase tracking-widest mb-2">Operator Session</div>
                  {user ? (
                    <div className="space-y-2 p-3 rounded border border-slate-200 dark:border-[#1C2433] bg-slate-50 dark:bg-[#10141E]">
                      <div className="font-bold text-slate-900 dark:text-white truncate">{user.name}</div>
                      <div className="text-[10px] text-cyan-600 dark:text-cyan-400">{user.role}</div>
                      <div className="grid grid-cols-2 gap-2 pt-2 border-t border-slate-200 dark:border-[#1C2433]">
                        <button
                          onClick={() => {
                            sound.playClick();
                            setIsMenuOpen(false);
                            onOpenProfile?.();
                          }}
                          className="py-1.5 rounded border border-slate-300 dark:border-[#222B3D] text-center"
                        >
                          Settings
                        </button>
                        <button
                          onClick={() => {
                            sound.playClick();
                            setIsMenuOpen(false);
                            onLogout();
                          }}
                          className="py-1.5 rounded border border-rose-500/30 bg-rose-500/10 text-rose-600 dark:text-rose-400 text-center font-bold"
                        >
                          Logout
                        </button>
                      </div>
                    </div>
                  ) : (
                    <button
                      onClick={() => {
                        sound.playClick();
                        setIsMenuOpen(false);
                        onLoginClick();
                      }}
                      className="w-full p-2.5 rounded border border-cyan-500 bg-cyan-500 text-slate-950 font-bold text-center"
                    >
                      Authenticate Operator
                    </button>
                  )}
                </div>

                <div>
                  <div className="text-[10px] text-slate-400 uppercase tracking-widest mb-2">Statutory & Legal</div>
                  <div className="space-y-1 text-slate-500">
                    <button onClick={() => { sound.playClick(); setIsMenuOpen(false); onOpenPrivacy?.(); }} className="block py-1 hover:text-cyan-400">
                      • Privacy (DPDP Act 2023)
                    </button>
                    <button onClick={() => { sound.playClick(); setIsMenuOpen(false); onOpenTerms?.(); }} className="block py-1 hover:text-cyan-400">
                      • Terms of Service
                    </button>
                    <button onClick={() => { sound.playClick(); setIsMenuOpen(false); onOpenContact?.(); }} className="block py-1 hover:text-cyan-400">
                      • Contact HQ (Hyderabad)
                    </button>
                  </div>
                </div>
              </div>
            </motion.div>
          </div>
        )}
      </AnimatePresence>
    </header>
  );
};
