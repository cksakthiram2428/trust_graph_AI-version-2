import React, { useState, useEffect } from "react";
import { motion, AnimatePresence } from "motion/react";
import { Shield, Cookie, Check, X, ChevronRight } from "lucide-react";
import { analytics } from "../utils/analytics";
import { sound } from "../utils/audio";

interface CookieBannerProps {
  onOpenPrivacy?: () => void;
}

export const CookieBanner: React.FC<CookieBannerProps> = ({ onOpenPrivacy }) => {
  const [isVisible, setIsVisible] = useState<boolean>(false);
  const [showPreferences, setShowPreferences] = useState<boolean>(false);
  const [analyticsEnabled, setAnalyticsEnabled] = useState<boolean>(true);

  useEffect(() => {
    const saved = localStorage.getItem("tg_cookie_consent");
    if (!saved) {
      const timer = setTimeout(() => setIsVisible(true), 1200);
      return () => clearTimeout(timer);
    }
  }, []);

  const handleAcceptAll = () => {
    sound.playClick();
    localStorage.setItem("tg_cookie_consent", "all");
    analytics.setConsent(true);
    analytics.track("cookie_consent_accepted", { type: "all" });
    setIsVisible(false);
  };

  const handleAcceptEssential = () => {
    sound.playClick();
    localStorage.setItem("tg_cookie_consent", "essential_only");
    analytics.setConsent(false);
    setIsVisible(false);
  };

  const handleSaveCustom = () => {
    sound.playClick();
    localStorage.setItem("tg_cookie_consent", analyticsEnabled ? "all" : "essential_only");
    analytics.setConsent(analyticsEnabled);
    setIsVisible(false);
  };

  if (!isVisible) return null;

  return (
    <AnimatePresence>
      <motion.div
        role="region"
        aria-label="Privacy and data consent banner"
        initial={{ opacity: 0, y: 50, scale: 0.96 }}
        animate={{ opacity: 1, y: 0, scale: 1 }}
        exit={{ opacity: 0, y: 50, scale: 0.96 }}
        className="fixed bottom-4 left-4 right-4 sm:left-6 sm:right-auto sm:max-w-md z-50 p-5 rounded-2xl bg-slate-900/95 dark:bg-[#0E0E14]/95 text-white border border-slate-700/60 dark:border-white/15 shadow-2xl backdrop-blur-2xl"
      >
        <div className="flex items-start gap-3">
          <div className="p-2.5 rounded-xl bg-sky-500/20 text-sky-400 shrink-0 mt-0.5">
            <Cookie className="w-5 h-5" />
          </div>
          <div className="space-y-2 flex-1">
            <div className="flex items-center justify-between">
              <h4 className="font-bold text-sm font-display tracking-tight text-white flex items-center gap-1.5">
                Privacy & Data Consent
              </h4>
              <button
                onClick={handleAcceptEssential}
                className="text-slate-400 hover:text-white p-1 rounded-lg transition-colors cursor-pointer"
                title="Dismiss with Essential only"
                aria-label="Dismiss banner with essential cookies only"
              >
                <X className="w-4 h-4" />
              </button>
            </div>

            <p className="text-xs text-slate-300 leading-relaxed">
              We use necessary telemetry and analytics cookies to optimize 3D WebGL rendering, cache statutory Udyam queries, and improve supply chain risk diagnostics in compliance with DPDP Act 2023.
            </p>

            {showPreferences && (
              <div className="pt-2 pb-1 space-y-2 text-xs border-t border-white/10 mt-2">
                <div className="flex items-center justify-between">
                  <span className="text-slate-300">Essential Engine Cookies</span>
                  <span className="font-mono text-[10px] text-emerald-400 uppercase font-bold">Required</span>
                </div>
                <div className="flex items-center justify-between">
                  <span className="text-slate-300">Anonymized Risk Telemetry</span>
                  <label className="relative inline-flex items-center cursor-pointer">
                    <input
                      type="checkbox"
                      checked={analyticsEnabled}
                      onChange={(e) => setAnalyticsEnabled(e.target.checked)}
                      aria-label="Enable anonymized risk telemetry"
                      className="sr-only peer"
                    />
                    <div className="w-8 h-4 bg-slate-700 peer-focus:outline-none rounded-full peer peer-checked:after:translate-x-full peer-checked:after:border-white after:content-[''] after:absolute after:top-[1px] after:left-[1px] after:bg-white after:rounded-full after:h-3.5 after:w-3.5 after:transition-all peer-checked:bg-sky-500"></div>
                  </label>
                </div>
              </div>
            )}

            <div className="pt-2 flex flex-wrap items-center gap-2">
              {showPreferences ? (
                <button
                  onClick={handleSaveCustom}
                  aria-label="Save cookie consent choices"
                  className="px-3.5 py-1.5 rounded-xl bg-sky-500 hover:bg-sky-600 text-white font-mono text-xs font-bold transition-colors cursor-pointer"
                >
                  Save Choices
                </button>
              ) : (
                <>
                  <button
                    onClick={handleAcceptAll}
                    aria-label="Accept all cookies"
                    className="px-3.5 py-1.5 rounded-xl bg-sky-500 hover:bg-sky-600 text-white font-mono text-xs font-bold transition-colors cursor-pointer shadow-sm shadow-sky-500/20"
                  >
                    Accept All
                  </button>
                  <button
                    onClick={handleAcceptEssential}
                    aria-label="Accept essential cookies only"
                    className="px-3 py-1.5 rounded-xl bg-white/10 hover:bg-white/15 text-slate-300 font-mono text-xs transition-colors cursor-pointer"
                  >
                    Essential Only
                  </button>
                  <button
                    onClick={() => setShowPreferences(true)}
                    aria-label="Customize cookie preferences"
                    className="text-[11px] text-sky-400 hover:underline font-mono px-1.5 py-1 cursor-pointer"
                  >
                    Customize
                  </button>
                </>
              )}

              {onOpenPrivacy && (
                <button
                  onClick={() => {
                    sound.playClick();
                    onOpenPrivacy();
                  }}
                  aria-label="View Privacy Policy details"
                  className="text-[11px] text-slate-400 hover:text-white underline font-mono ml-auto cursor-pointer"
                >
                  Policy Details
                </button>
              )}
            </div>
          </div>
        </div>
      </motion.div>
    </AnimatePresence>
  );
};
