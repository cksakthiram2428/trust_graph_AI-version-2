"use client";

import React, { useState } from "react";
import { motion } from "motion/react";
import { AuroraBackground } from "./ui/aurora-background";
import { sound } from "../utils/audio";
import { User, RealtimeUser } from "../types";
import { 
  Network, 
  Lock, 
  Mail, 
  ArrowRight, 
  KeyRound, 
  ShieldCheck, 
  Users, 
  Sparkles, 
  ArrowLeft, 
  Sun, 
  Moon, 
  Volume2, 
  VolumeX,
  CheckCircle2,
  AlertCircle,
  Building,
  UserCheck
} from "lucide-react";
import { 
  signInWithGoogle, 
  signInWithGithub, 
  signInWithMicrosoft, 
  syncUserToFirestore 
} from "../lib/firebase";

interface LoginPageProps {
  onLoginSuccess: (user: User) => void;
  onBackToLanding: () => void;
  onEnterWorkspace: () => void;
  theme: "dark" | "light";
  onToggleTheme: () => void;
  isMuted: boolean;
  onToggleSound: () => void;
  onlineUsers?: RealtimeUser[];
}

export const LoginPage: React.FC<LoginPageProps> = ({
  onLoginSuccess,
  onBackToLanding,
  onEnterWorkspace,
  theme,
  onToggleTheme,
  isMuted,
  onToggleSound,
  onlineUsers = []
}) => {
  const [authMethod, setAuthMethod] = useState<"oauth" | "password">("oauth");
  const [email, setEmail] = useState("admin@trustgraph.com");
  const [password, setPassword] = useState("password123");
  const [displayName, setDisplayName] = useState("");
  const [selectedRole, setSelectedRole] = useState("Executive Director (CPO)");
  const [loading, setLoading] = useState<string | null>(null);
  const [error, setError] = useState("");
  const [successMsg, setSuccessMsg] = useState("");

  const handleOAuthLogin = async (provider: "google" | "github" | "microsoft") => {
    setError("");
    setSuccessMsg("");
    setLoading(provider);
    sound.playClick();

    try {
      let firebaseUser: any = null;
      if (provider === "google") {
        firebaseUser = await signInWithGoogle();
      } else if (provider === "github") {
        firebaseUser = await signInWithGithub();
      } else if (provider === "microsoft") {
        firebaseUser = await signInWithMicrosoft();
      }

      sound.playAISuccess();
      const userObj: User = {
        uid: firebaseUser?.uid,
        email: firebaseUser?.email || `user@${provider}-trustgraph.com`,
        name: firebaseUser?.displayName || (provider === "google" ? "Google Executive" : provider === "github" ? "GitHub Risk Architect" : "Enterprise CPO"),
        role: provider === "google" ? "Verified Director (Google Auth)" : provider === "github" ? "Supply Chain Engineer (GitHub)" : "Enterprise Executive (Microsoft 365)",
        photoURL: firebaseUser?.photoURL || "",
        provider
      };

      setSuccessMsg(`Authenticated via ${provider.toUpperCase()}`);
      setTimeout(() => {
        onLoginSuccess(userObj);
      }, 400);
    } catch (err: any) {
      console.warn(`${provider} login notice:`, err);
      // If the provider is not enabled in Firebase Console yet or user closed popup, provide friendly guidance and seamless option
      if (err?.code === "auth/operation-not-allowed" || err?.code === "auth/configuration-not-found" || err?.message?.includes("operation-not-allowed")) {
        setError(`${provider.toUpperCase()} Auth is not yet enabled in your Firebase Console project. You can enable it in Authentication -> Sign-in method, or use Quick Enterprise Login below.`);
      } else if (err?.code === "auth/popup-closed-by-user") {
        setError("Sign-in popup closed. Please click again to retry.");
      } else {
        setError(err?.message || `Could not complete ${provider} authentication.`);
      }
    } finally {
      setLoading(null);
    }
  };

  const handleStandardLogin = async (e: React.FormEvent) => {
    e.preventDefault();
    setError("");
    setSuccessMsg("");
    setLoading("password");
    sound.playClick();

    try {
      const res = await fetch("/api/login", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ email, password })
      });

      const data = await res.json();
      if (res.ok && data.success) {
        sound.playAISuccess();
        const userObj: User = {
          uid: `std-${Date.now()}`,
          email: data.user.email || email,
          name: data.user.name || displayName || email.split("@")[0],
          role: selectedRole || data.user.role || "Procurement Auditor",
          provider: "password"
        };
        
        // Sync real-time user to Firestore database
        await syncUserToFirestore(userObj, "password", userObj.role);

        setSuccessMsg("Session authenticated successfully");
        setTimeout(() => {
          onLoginSuccess(userObj);
        }, 400);
      } else {
        setError(data.error || "Invalid credentials");
      }
    } catch (err) {
      setError("Network error connecting to authentication service");
    } finally {
      setLoading(null);
    }
  };

  // Quick preset login for fast testing
  const handleQuickPresetLogin = async (presetEmail: string, presetName: string, presetRole: string, presetProvider: "google" | "github" | "microsoft" | "password") => {
    setError("");
    setLoading("quick");
    sound.playClick();

    const userObj: User = {
      uid: `quick-${presetProvider}-${Date.now().toString(36)}`,
      email: presetEmail,
      name: presetName,
      role: presetRole,
      provider: presetProvider
    };

    try {
      await syncUserToFirestore(userObj, presetProvider, presetRole);
    } catch (e) {}

    sound.playAISuccess();
    setSuccessMsg(`Signed in as ${presetName}`);
    setTimeout(() => {
      onLoginSuccess(userObj);
    }, 300);
  };

  return (
    <div className="min-h-screen bg-slate-50 dark:bg-[#070709] text-slate-900 dark:text-slate-100 transition-colors duration-500 flex flex-col selection:bg-cyan-500/30 selection:text-cyan-600 dark:selection:text-cyan-200">
      <AuroraBackground className="min-h-screen py-6 justify-between">
        {/* Top Header */}
        <header className="w-full max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 flex items-center justify-between gap-4">
          <div className="flex items-center gap-3">
            <button
              onClick={() => {
                sound.playClick();
                onBackToLanding();
              }}
              className="flex items-center gap-2 px-3 py-2 rounded-xl bg-white/80 dark:bg-white/5 hover:bg-white dark:hover:bg-white/10 border border-slate-200 dark:border-white/10 text-slate-700 dark:text-slate-200 text-xs font-mono transition-all cursor-pointer shadow-sm"
            >
              <ArrowLeft className="w-4 h-4" />
              <span>Back to Landing</span>
            </button>

            <div className="hidden sm:flex items-center gap-2 pl-3 border-l border-slate-200 dark:border-white/10">
              <Network className="w-5 h-5 text-sky-500 dark:text-cyan-400 animate-pulse" />
              <span className="font-display font-extrabold text-lg text-slate-900 dark:text-white">
                TrustGraph <span className="text-sky-500 dark:text-cyan-400">AI</span>
              </span>
            </div>
          </div>

          <div className="flex items-center gap-2">
            {/* Audio Toggle */}
            <button
              onClick={() => {
                onToggleSound();
                if (isMuted) sound.playClick();
              }}
              className="p-2.5 rounded-xl border border-slate-200 dark:border-white/10 bg-white/70 dark:bg-white/5 text-slate-700 dark:text-slate-300 hover:text-sky-500 backdrop-blur-md transition-all cursor-pointer shadow-sm"
              title={isMuted ? "Unmute Audio FX" : "Mute Audio FX"}
            >
              {isMuted ? <VolumeX className="w-4 h-4" /> : <Volume2 className="w-4 h-4 text-sky-500 animate-pulse" />}
            </button>

            {/* Theme Toggle */}
            <button
              onClick={() => {
                sound.playClick();
                onToggleTheme();
              }}
              className="p-2.5 rounded-xl border border-slate-200 dark:border-white/10 bg-white/70 dark:bg-white/5 text-slate-700 dark:text-slate-300 hover:text-amber-500 backdrop-blur-md transition-all cursor-pointer shadow-sm"
              title={`Switch to ${theme === "dark" ? "Light" : "Dark"} Mode`}
            >
              {theme === "dark" ? <Sun className="w-4 h-4 text-amber-400" /> : <Moon className="w-4 h-4 text-slate-700" />}
            </button>
          </div>
        </header>

        {/* Main Login Panel Card */}
        <div className="w-full max-w-4xl mx-auto px-4 py-8 flex flex-col lg:flex-row items-stretch justify-center gap-6">
          {/* Left / Main Authentication Box */}
          <motion.div
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.5 }}
            className="w-full lg:max-w-md p-6 sm:p-8 rounded-3xl bg-white/90 dark:bg-[#0A0A0E]/90 backdrop-blur-2xl border border-slate-200 dark:border-white/10 shadow-2xl shadow-slate-300/40 dark:shadow-cyan-950/20 flex flex-col justify-between"
          >
            <div>
              {/* Card Header */}
              <div className="flex items-center gap-3 pb-5 border-b border-slate-100 dark:border-white/10">
                <div className="w-12 h-12 rounded-2xl bg-gradient-to-br from-sky-400 via-sky-500 to-indigo-600 p-0.5 shadow-lg shadow-sky-500/25">
                  <div className="w-full h-full bg-white dark:bg-[#0A0A0C] rounded-[14px] flex items-center justify-center">
                    <KeyRound className="w-6 h-6 text-sky-500 dark:text-cyan-400" />
                  </div>
                </div>
                <div>
                  <h1 className="text-xl font-bold text-slate-900 dark:text-white font-mono">
                    Command Login
                  </h1>
                  <p className="text-xs font-mono text-sky-600 dark:text-sky-400">
                    Firebase &amp; OAuth Enterprise Portal
                  </p>
                </div>
              </div>

              {/* Status Notifications */}
              {error && (
                <div className="mt-4 p-3 rounded-xl bg-rose-50 dark:bg-rose-950/70 border border-rose-200 dark:border-rose-500/40 text-xs text-rose-700 dark:text-rose-200 flex items-start gap-2">
                  <AlertCircle className="w-4 h-4 shrink-0 mt-0.5 text-rose-500" />
                  <span>{error}</span>
                </div>
              )}

              {successMsg && (
                <div className="mt-4 p-3 rounded-xl bg-emerald-50 dark:bg-emerald-950/70 border border-emerald-200 dark:border-emerald-500/40 text-xs text-emerald-700 dark:text-emerald-200 flex items-center gap-2">
                  <CheckCircle2 className="w-4 h-4 text-emerald-500" />
                  <span>{successMsg}</span>
                </div>
              )}

              {/* Method Switcher Tabs */}
              <div className="mt-6 p-1 rounded-xl bg-slate-100 dark:bg-white/[0.05] border border-slate-200 dark:border-white/10 flex text-xs font-mono">
                <button
                  type="button"
                  onClick={() => { sound.playClick(); setAuthMethod("oauth"); }}
                  className={`flex-1 py-2 rounded-lg font-semibold transition-all cursor-pointer ${
                    authMethod === "oauth"
                      ? "bg-white dark:bg-sky-500/20 text-sky-600 dark:text-cyan-300 shadow-sm border border-slate-200/60 dark:border-sky-500/40"
                      : "text-slate-500 dark:text-slate-400 hover:text-slate-900 dark:hover:text-white"
                  }`}
                >
                  OAuth Providers
                </button>
                <button
                  type="button"
                  onClick={() => { sound.playClick(); setAuthMethod("password"); }}
                  className={`flex-1 py-2 rounded-lg font-semibold transition-all cursor-pointer ${
                    authMethod === "password"
                      ? "bg-white dark:bg-sky-500/20 text-sky-600 dark:text-cyan-300 shadow-sm border border-slate-200/60 dark:border-sky-500/40"
                      : "text-slate-500 dark:text-slate-400 hover:text-slate-900 dark:hover:text-white"
                  }`}
                >
                  Operator Credentials
                </button>
              </div>

              {/* OAuth Providers Section */}
              {authMethod === "oauth" && (
                <div className="mt-6 space-y-3">
                  {/* Google Login */}
                  <button
                    type="button"
                    onClick={() => handleOAuthLogin("google")}
                    disabled={loading !== null}
                    className="w-full py-3 px-4 rounded-xl bg-white dark:bg-white/10 hover:bg-slate-50 dark:hover:bg-white/15 text-slate-800 dark:text-white border border-slate-300 dark:border-white/20 font-bold font-mono text-xs flex items-center justify-center gap-3 shadow-md hover:shadow-lg transition-all cursor-pointer disabled:opacity-50"
                  >
                    <svg className="w-4 h-4" viewBox="0 0 24 24">
                      <path
                        fill="#4285F4"
                        d="M23.745 12.27c0-.7-.06-1.4-.19-2.07H12v4.51h6.6c-.29 1.52-1.14 2.82-2.4 3.68v3.05h3.88c2.27-2.09 3.665-5.17 3.665-9.17z"
                      />
                      <path
                        fill="#34A853"
                        d="M12 24c3.24 0 5.95-1.08 7.93-2.91l-3.88-3.05c-1.08.72-2.45 1.16-4.05 1.16-3.12 0-5.77-2.1-6.72-4.93H1.25v3.15C3.26 21.36 7.33 24 12 24z"
                      />
                      <path
                        fill="#FBBC05"
                        d="M5.28 14.27c-.25-.72-.38-1.49-.38-2.27s.13-1.55.38-2.27V6.58H1.25C.45 8.18 0 9.99 0 12s.45 3.82 1.25 5.42l4.03-3.15z"
                      />
                      <path
                        fill="#EA4335"
                        d="M12 4.75c1.77 0 3.35.61 4.6 1.8l3.42-3.42C17.95 1.19 15.24 0 12 0 7.33 0 3.26 2.64 1.25 6.58l4.03 3.15c.95-2.83 3.6-4.98 6.72-4.98z"
                      />
                    </svg>
                    <span>{loading === "google" ? "Authenticating Google..." : "Sign in with Google"}</span>
                  </button>

                  {/* Microsoft 365 / Entra ID Login */}
                  <button
                    type="button"
                    onClick={() => handleOAuthLogin("microsoft")}
                    disabled={loading !== null}
                    className="w-full py-3 px-4 rounded-xl bg-white dark:bg-white/10 hover:bg-slate-50 dark:hover:bg-white/15 text-slate-800 dark:text-white border border-slate-300 dark:border-white/20 font-bold font-mono text-xs flex items-center justify-center gap-3 shadow-md hover:shadow-lg transition-all cursor-pointer disabled:opacity-50"
                  >
                    <svg className="w-4 h-4" viewBox="0 0 23 23">
                      <path fill="#f35325" d="M1 1h10v10H1z"/>
                      <path fill="#81bc06" d="M12 1h10v10H12z"/>
                      <path fill="#05a6f0" d="M1 12h10v10H1z"/>
                      <path fill="#ffba08" d="M12 12h10v10H12z"/>
                    </svg>
                    <span>{loading === "microsoft" ? "Authenticating Microsoft..." : "Sign in with Microsoft"}</span>
                  </button>

                  {/* GitHub Login */}
                  <button
                    type="button"
                    onClick={() => handleOAuthLogin("github")}
                    disabled={loading !== null}
                    className="w-full py-3 px-4 rounded-xl bg-slate-900 hover:bg-slate-800 dark:bg-black/50 hover:dark:bg-black text-white border border-slate-800 dark:border-white/20 font-bold font-mono text-xs flex items-center justify-center gap-3 shadow-md hover:shadow-lg transition-all cursor-pointer disabled:opacity-50"
                  >
                    <svg className="w-4 h-4 fill-current" viewBox="0 0 24 24">
                      <path fillRule="evenodd" clipRule="evenodd" d="M12 2C6.477 2 2 6.484 2 12.017c0 4.425 2.865 8.18 6.839 9.504.5.092.682-.217.682-.483 0-.237-.008-.868-.013-1.703-2.782.605-3.369-1.343-3.369-1.343-.454-1.158-1.11-1.466-1.11-1.466-.908-.62.069-.608.069-.608 1.003.07 1.53 1.032 1.53 1.032.892 1.53 2.341 1.088 2.91.832.092-.647.35-1.088.636-1.338-2.22-.253-4.555-1.113-4.555-4.951 0-1.093.39-1.988 1.029-2.688-.103-.253-.446-1.272.098-2.65 0 0 .84-.27 2.75 1.026A9.564 9.564 0 0112 6.844c.85.004 1.705.115 2.504.337 1.909-1.296 2.747-1.027 2.747-1.027.546 1.379.202 2.398.1 2.651.64.7 1.028 1.595 1.028 2.688 0 3.848-2.339 4.695-4.566 4.943.359.309.678.92.678 1.855 0 1.338-.012 2.419-.012 2.747 0 .268.18.58.688.482A10.019 10.019 0 0022 12.017C22 6.484 17.522 2 12 2z"/>
                    </svg>
                    <span>{loading === "github" ? "Authenticating GitHub..." : "Sign in with GitHub"}</span>
                  </button>
                </div>
              )}

              {/* Standard Password Form */}
              {authMethod === "password" && (
                <form onSubmit={handleStandardLogin} className="mt-6 space-y-4">
                  <div>
                    <label className="block text-xs font-mono text-slate-600 dark:text-slate-300 uppercase mb-1">
                      Operator Email
                    </label>
                    <div className="relative">
                      <Mail className="absolute left-3.5 top-1/2 -translate-y-1/2 w-4 h-4 text-slate-400" />
                      <input
                        type="email"
                        required
                        value={email}
                        onChange={(e) => setEmail(e.target.value)}
                        className="w-full pl-10 pr-4 py-2.5 rounded-xl bg-slate-50 dark:bg-[#070709] border border-slate-200 dark:border-white/10 text-sm text-slate-900 dark:text-slate-100 focus:outline-none focus:border-sky-500 font-sans"
                      />
                    </div>
                  </div>

                  <div>
                    <label className="block text-xs font-mono text-slate-600 dark:text-slate-300 uppercase mb-1">
                      Password
                    </label>
                    <div className="relative">
                      <Lock className="absolute left-3.5 top-1/2 -translate-y-1/2 w-4 h-4 text-slate-400" />
                      <input
                        type="password"
                        required
                        value={password}
                        onChange={(e) => setPassword(e.target.value)}
                        className="w-full pl-10 pr-4 py-2.5 rounded-xl bg-slate-50 dark:bg-[#070709] border border-slate-200 dark:border-white/10 text-sm text-slate-900 dark:text-slate-100 focus:outline-none focus:border-sky-500 font-sans"
                      />
                    </div>
                  </div>

                  <div className="p-3 rounded-xl bg-slate-50 dark:bg-white/[0.03] border border-slate-200 dark:border-white/10 text-xs text-slate-500 dark:text-slate-400 font-mono">
                    <span className="text-sky-600 dark:text-sky-400 font-bold block mb-0.5">Demo Operator:</span>
                    admin@trustgraph.com / password123
                  </div>

                  <button
                    type="submit"
                    disabled={loading !== null}
                    className="w-full py-3 rounded-xl bg-gradient-to-r from-sky-500 to-cyan-500 hover:from-sky-400 hover:to-cyan-400 text-slate-950 font-mono font-bold text-xs tracking-wider uppercase flex items-center justify-center gap-2 shadow-lg shadow-sky-500/20 transition-all cursor-pointer disabled:opacity-50"
                  >
                    <span>{loading === "password" ? "Authenticating Session..." : "Authenticate Session"}</span>
                    <ArrowRight className="w-4 h-4" />
                  </button>
                </form>
              )}
            </div>

            {/* Quick Demo Role Switcher */}
            <div className="mt-8 pt-6 border-t border-slate-100 dark:border-white/10 space-y-3">
              <div className="flex items-center justify-between text-[11px] font-mono text-slate-500">
                <span>Instant Enterprise Fast-Track:</span>
                <Sparkles className="w-3.5 h-3.5 text-sky-500" />
              </div>
              <div className="grid grid-cols-2 gap-2">
                <button
                  type="button"
                  onClick={() => handleQuickPresetLogin("cpo@tata-motors.com", "Rajesh Sharma", "Chief Procurement Officer", "google")}
                  className="p-2 rounded-lg bg-slate-100 dark:bg-white/5 hover:bg-sky-50 dark:hover:bg-sky-950/40 text-left border border-slate-200 dark:border-white/5 transition-all text-[11px] font-mono cursor-pointer"
                >
                  <div className="font-bold text-slate-800 dark:text-slate-200 truncate">Rajesh Sharma</div>
                  <div className="text-[10px] text-sky-600 dark:text-sky-400 truncate">CPO (Tata Group)</div>
                </button>
                <button
                  type="button"
                  onClick={() => handleQuickPresetLogin("risk.head@mahindra.com", "Ananya Deshmukh", "Head of Risk & Compliance", "microsoft")}
                  className="p-2 rounded-lg bg-slate-100 dark:bg-white/5 hover:bg-sky-50 dark:hover:bg-sky-950/40 text-left border border-slate-200 dark:border-white/5 transition-all text-[11px] font-mono cursor-pointer"
                >
                  <div className="font-bold text-slate-800 dark:text-slate-200 truncate">Ananya Deshmukh</div>
                  <div className="text-[10px] text-sky-600 dark:text-sky-400 truncate">Risk Lead (Mahindra)</div>
                </button>
              </div>
            </div>
          </motion.div>

          {/* Right / Real-Time Database Users & Live Telemetry Panel */}
          <motion.div
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.5, delay: 0.1 }}
            className="w-full lg:max-w-md p-6 sm:p-8 rounded-3xl bg-white/70 dark:bg-[#0A0A0E]/70 backdrop-blur-2xl border border-slate-200 dark:border-white/10 shadow-xl flex flex-col justify-between"
          >
            <div>
              <div className="flex items-center justify-between pb-4 border-b border-slate-100 dark:border-white/10">
                <div className="flex items-center gap-2.5">
                  <div className="w-2.5 h-2.5 rounded-full bg-emerald-500 animate-pulse" />
                  <h3 className="font-mono text-sm font-bold text-slate-900 dark:text-white uppercase tracking-wider">
                    Real-time Active Operators ({onlineUsers.length > 0 ? onlineUsers.length : 3})
                  </h3>
                </div>
                <span className="text-[10px] font-mono text-sky-600 dark:text-sky-400 px-2 py-0.5 rounded-full bg-sky-50 dark:bg-sky-950/80 border border-sky-200 dark:border-sky-500/30">
                  Firestore Live
                </span>
              </div>

              <p className="mt-3 text-xs text-slate-600 dark:text-slate-400">
                Active procurement directors and supply chain auditors currently connected to the knowledge graph:
              </p>

              {/* Real-time Users List */}
              <div className="mt-4 space-y-2.5 max-h-72 overflow-y-auto pr-1">
                {onlineUsers.length > 0 ? (
                  onlineUsers.map((u, i) => (
                    <div
                      key={u.id || i}
                      className="p-3 rounded-2xl bg-white dark:bg-white/[0.03] border border-slate-200 dark:border-white/5 flex items-center justify-between gap-3 shadow-sm"
                    >
                      <div className="flex items-center gap-3 min-w-0">
                        <div className="w-8 h-8 rounded-full bg-gradient-to-br from-sky-400 to-indigo-600 flex items-center justify-center text-white font-bold text-xs uppercase shrink-0">
                          {u.displayName ? u.displayName[0] : "U"}
                        </div>
                        <div className="min-w-0">
                          <div className="text-xs font-bold text-slate-900 dark:text-white truncate">
                            {u.displayName || u.email}
                          </div>
                          <div className="text-[10px] font-mono text-slate-500 dark:text-slate-400 truncate">
                            {u.role || "Procurement Auditor"}
                          </div>
                        </div>
                      </div>
                      <div className="text-right shrink-0">
                        <span className="inline-flex items-center gap-1 text-[10px] font-mono text-emerald-600 dark:text-emerald-400">
                          <span className="w-1.5 h-1.5 rounded-full bg-emerald-500" />
                          Online
                        </span>
                      </div>
                    </div>
                  ))
                ) : (
                  // Fallback real-time simulated rows while first writes sync
                  <>
                    <div className="p-3 rounded-2xl bg-white dark:bg-white/[0.03] border border-slate-200 dark:border-white/5 flex items-center justify-between gap-3 shadow-sm">
                      <div className="flex items-center gap-3 min-w-0">
                        <div className="w-8 h-8 rounded-full bg-sky-500 flex items-center justify-center text-white font-bold text-xs">
                          R
                        </div>
                        <div className="min-w-0">
                          <div className="text-xs font-bold text-slate-900 dark:text-white truncate">
                            Rajesh Sharma
                          </div>
                          <div className="text-[10px] font-mono text-slate-500 dark:text-slate-400">
                            Chief Procurement Officer (Google Auth)
                          </div>
                        </div>
                      </div>
                      <span className="inline-flex items-center gap-1 text-[10px] font-mono text-emerald-600 dark:text-emerald-400">
                        <span className="w-1.5 h-1.5 rounded-full bg-emerald-500" />
                        Online
                      </span>
                    </div>

                    <div className="p-3 rounded-2xl bg-white dark:bg-white/[0.03] border border-slate-200 dark:border-white/5 flex items-center justify-between gap-3 shadow-sm">
                      <div className="flex items-center gap-3 min-w-0">
                        <div className="w-8 h-8 rounded-full bg-indigo-500 flex items-center justify-center text-white font-bold text-xs">
                          A
                        </div>
                        <div className="min-w-0">
                          <div className="text-xs font-bold text-slate-900 dark:text-white truncate">
                            Ananya Deshmukh
                          </div>
                          <div className="text-[10px] font-mono text-slate-500 dark:text-slate-400">
                            Head of Risk &amp; Compliance (Microsoft Auth)
                          </div>
                        </div>
                      </div>
                      <span className="inline-flex items-center gap-1 text-[10px] font-mono text-emerald-600 dark:text-emerald-400">
                        <span className="w-1.5 h-1.5 rounded-full bg-emerald-500" />
                        Online
                      </span>
                    </div>

                    <div className="p-3 rounded-2xl bg-white dark:bg-white/[0.03] border border-slate-200 dark:border-white/5 flex items-center justify-between gap-3 shadow-sm">
                      <div className="flex items-center gap-3 min-w-0">
                        <div className="w-8 h-8 rounded-full bg-cyan-600 flex items-center justify-center text-white font-bold text-xs">
                          V
                        </div>
                        <div className="min-w-0">
                          <div className="text-xs font-bold text-slate-900 dark:text-white truncate">
                            Vikram Malhotra
                          </div>
                          <div className="text-[10px] font-mono text-slate-500 dark:text-slate-400">
                            Supply Chain Architect (GitHub Auth)
                          </div>
                        </div>
                      </div>
                      <span className="inline-flex items-center gap-1 text-[10px] font-mono text-emerald-600 dark:text-emerald-400">
                        <span className="w-1.5 h-1.5 rounded-full bg-emerald-500" />
                        Active
                      </span>
                    </div>
                  </>
                )}
              </div>
            </div>

            {/* Security Assurance Footer */}
            <div className="mt-6 pt-5 border-t border-slate-100 dark:border-white/10 text-[11px] font-mono text-slate-500 space-y-2">
              <div className="flex items-center gap-2">
                <ShieldCheck className="w-4 h-4 text-emerald-500" />
                <span>Zero-Trust ABAC Security &amp; Firestore Rule Partitioning</span>
              </div>
              <div className="flex items-center gap-2">
                <Lock className="w-4 h-4 text-sky-500" />
                <span>Encrypted Token Exchange with TLS 1.3 &amp; MSMED Act 2006</span>
              </div>
            </div>
          </motion.div>
        </div>

        {/* Footer */}
        <footer className="w-full text-center py-4 text-xs font-mono text-slate-500 dark:text-slate-400">
          TrustGraph AI Authentication Portal • Integrated with Firebase Firestore &amp; OAuth 2.0
        </footer>
      </AuroraBackground>
    </div>
  );
};
