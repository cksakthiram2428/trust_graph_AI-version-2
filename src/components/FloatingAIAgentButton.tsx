"use client";

import React, { useState } from "react";
import { motion, AnimatePresence } from "motion/react";
import { Bot, Sparkles, X, MessageSquare, Zap } from "lucide-react";
import { sound } from "../utils/audio";

interface FloatingAIAgentButtonProps {
  onClick: () => void;
  isOpen?: boolean;
}

export const FloatingAIAgentButton: React.FC<FloatingAIAgentButtonProps> = ({
  onClick,
  isOpen = false,
}) => {
  const [isHovered, setIsHovered] = useState(false);

  const handleClick = () => {
    sound.playClick();
    onClick();
  };

  return (
    <div className="fixed bottom-20 right-4 sm:bottom-6 sm:right-6 z-40 flex items-center gap-3">
      {/* Interactive Tooltip on Hover */}
      <AnimatePresence>
        {isHovered && !isOpen && (
          <motion.div
            initial={{ opacity: 0, x: 10, scale: 0.95 }}
            animate={{ opacity: 1, x: 0, scale: 1 }}
            exit={{ opacity: 0, x: 10, scale: 0.95 }}
            transition={{ duration: 0.2 }}
            className="hidden sm:flex items-center gap-2 px-3.5 py-2 rounded-2xl bg-white/90 dark:bg-[#0E0E14]/90 backdrop-blur-xl border border-sky-400/40 dark:border-cyan-400/30 text-slate-800 dark:text-slate-100 shadow-xl text-xs font-mono font-medium pointer-events-none"
          >
            <Sparkles className="w-3.5 h-3.5 text-sky-500 dark:text-cyan-400 animate-spin" />
            <span>AI Risk Copilot</span>
            <span className="px-1.5 py-0.5 rounded text-[10px] bg-sky-500/10 text-sky-600 dark:text-cyan-300 font-bold">
              Gemini Live
            </span>
          </motion.div>
        )}
      </AnimatePresence>

      {/* Floating Round Agent Button */}
      <motion.button
        id="floating-ai-agent-btn"
        onClick={handleClick}
        onMouseEnter={() => setIsHovered(true)}
        onMouseLeave={() => setIsHovered(false)}
        whileHover={{ scale: 1.08 }}
        whileTap={{ scale: 0.92 }}
        className="relative group w-14 h-14 rounded-full flex items-center justify-center bg-gradient-to-tr from-sky-500 via-cyan-400 to-indigo-500 text-slate-950 p-[2px] shadow-2xl shadow-sky-500/30 hover:shadow-cyan-400/50 transition-shadow cursor-pointer"
        title="Open Multi-Model AI Risk Copilot"
        aria-label={isOpen ? "Close AI Risk Copilot" : "Open Multi-Model AI Risk Copilot"}
        aria-expanded={isOpen}
        aria-controls="ai-copilot-drawer"
        aria-haspopup="dialog"
      >
        {/* Pulsing Aura Ring */}
        <span className="absolute inset-0 rounded-full bg-gradient-to-tr from-sky-400 to-cyan-300 animate-ping opacity-25 group-hover:opacity-40" />

        {/* Inner Glass Orb */}
        <div className="w-full h-full rounded-full bg-white dark:bg-[#07070B] backdrop-blur-md flex items-center justify-center relative overflow-hidden">
          {/* Subtle Glow Gradient background */}
          <div className="absolute inset-0 bg-gradient-to-br from-sky-500/20 via-transparent to-indigo-500/20 opacity-80" />

          {isOpen ? (
            <X className="w-6 h-6 text-slate-800 dark:text-white relative z-10 transition-transform group-hover:rotate-90" />
          ) : (
            <div className="relative z-10 flex items-center justify-center">
              <Bot className="w-6 h-6 text-sky-600 dark:text-cyan-300 transition-transform group-hover:scale-110" />
              <span className="absolute -top-1 -right-1 w-2.5 h-2.5 rounded-full bg-emerald-500 border-2 border-white dark:border-[#07070B]" />
            </div>
          )}
        </div>
      </motion.button>
    </div>
  );
};
