import React, { useState } from "react";
import { sound } from "../utils/audio";
import { User } from "../types";
import { X, Lock, Mail, ArrowRight, KeyRound } from "lucide-react";
import { signInWithGoogle, signInWithGithub, signInWithMicrosoft, syncUserToFirestore } from "../lib/firebase";

interface LoginModalProps {
  isOpen: boolean;
  onClose: () => void;
  onLoginSuccess: (user: User) => void;
}

export const LoginModal: React.FC<LoginModalProps> = ({
  isOpen,
  onClose,
  onLoginSuccess
}) => {
  const [email, setEmail] = useState("admin@trustgraph.com");
  const [password, setPassword] = useState("password123");
  const [loading, setLoading] = useState<string | null>(null);
  const [error, setError] = useState("");

  if (!isOpen) return null;

  const handleOAuthSignIn = async (provider: "google" | "github" | "microsoft") => {
    setError("");
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
      onLoginSuccess({
        uid: firebaseUser?.uid,
        email: firebaseUser?.email || `user@${provider}-trustgraph.com`,
        name: firebaseUser?.displayName || (provider === "google" ? "Google Executive" : provider === "github" ? "GitHub Risk Architect" : "Enterprise CPO"),
        role: provider === "google" ? "Verified Director (Google Auth)" : provider === "github" ? "Supply Chain Engineer (GitHub)" : "Enterprise Executive (Microsoft 365)",
        photoURL: firebaseUser?.photoURL || "",
        provider
      });
      onClose();
    } catch (err: any) {
      console.warn(`${provider} popup login notice:`, err);
      if (err?.code === "auth/operation-not-allowed" || err?.message?.includes("operation-not-allowed")) {
        setError(`${provider.toUpperCase()} provider needs to be enabled in Firebase Console. You can also log in with Demo Operator credentials below.`);
      } else if (err?.code === "auth/popup-closed-by-user") {
        setError("Sign-in popup was closed.");
      } else {
        setError(err?.message || `${provider} sign-in failed.`);
      }
    } finally {
      setLoading(null);
    }
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setError("");
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
          name: data.user.name || "Procurement Director",
          role: data.user.role || "Verified Executive",
          provider: "password"
        };
        await syncUserToFirestore(userObj, "password", userObj.role);
        onLoginSuccess(userObj);
        onClose();
      } else {
        setError(data.error || "Invalid credentials");
      }
    } catch (err) {
      setError("Network error connecting to authentication service");
    } finally {
      setLoading(null);
    }
  };

  return (
    <div
      id="login-modal-backdrop"
      className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-slate-900/80 dark:bg-[#0A0A0C]/85 backdrop-blur-md animate-in fade-in"
    >
      <div className="relative w-full max-w-md rounded-3xl neural-card border border-slate-200 dark:border-white/10 shadow-2xl p-6 sm:p-8 bg-white dark:bg-[#0A0A0C] text-slate-900 dark:text-slate-100">
        {/* Header */}
        <div className="flex items-center justify-between pb-4 border-b border-slate-100 dark:border-white/10">
          <div className="flex items-center gap-3">
            <div className="p-2.5 rounded-xl bg-sky-500/10 dark:bg-[#38BDF8]/20 border border-sky-500/30 dark:border-[#38BDF8]/40 text-sky-600 dark:text-[#38BDF8]">
              <KeyRound className="w-5 h-5" />
            </div>
            <div>
              <h2 className="text-lg font-bold text-slate-900 dark:text-white font-mono">
                TrustGraph Command Login
              </h2>
              <span className="text-[10px] font-mono text-sky-600 dark:text-[#38BDF8] uppercase tracking-wider">
                Firebase &amp; Enterprise CPO Access
              </span>
            </div>
          </div>

          <button
            onClick={() => { sound.playClick(); onClose(); }}
            className="p-2 rounded-xl bg-slate-100 dark:bg-white/5 hover:bg-slate-200 dark:hover:bg-white/10 text-slate-500 dark:text-slate-400 hover:text-slate-900 dark:hover:text-white transition-colors cursor-pointer"
          >
            <X className="w-5 h-5" />
          </button>
        </div>

        {/* OAuth Buttons */}
        <div className="mt-5 space-y-2.5">
          <button
            type="button"
            onClick={() => handleOAuthSignIn("google")}
            disabled={loading !== null}
            className="w-full py-2.5 px-4 rounded-xl bg-white dark:bg-white/10 hover:bg-slate-50 dark:hover:bg-white/15 text-slate-800 dark:text-white border border-slate-300 dark:border-white/20 font-bold font-mono text-xs flex items-center justify-center gap-3 shadow-sm transition-all cursor-pointer disabled:opacity-50"
          >
            <svg className="w-4 h-4" viewBox="0 0 24 24">
              <path fill="#4285F4" d="M23.745 12.27c0-.7-.06-1.4-.19-2.07H12v4.51h6.6c-.29 1.52-1.14 2.82-2.4 3.68v3.05h3.88c2.27-2.09 3.665-5.17 3.665-9.17z" />
              <path fill="#34A853" d="M12 24c3.24 0 5.95-1.08 7.93-2.91l-3.88-3.05c-1.08.72-2.45 1.16-4.05 1.16-3.12 0-5.77-2.1-6.72-4.93H1.25v3.15C3.26 21.36 7.33 24 12 24z" />
              <path fill="#FBBC05" d="M5.28 14.27c-.25-.72-.38-1.49-.38-2.27s.13-1.55.38-2.27V6.58H1.25C.45 8.18 0 9.99 0 12s.45 3.82 1.25 5.42l4.03-3.15z" />
              <path fill="#EA4335" d="M12 4.75c1.77 0 3.35.61 4.6 1.8l3.42-3.42C17.95 1.19 15.24 0 12 0 7.33 0 3.26 2.64 1.25 6.58l4.03 3.15c.95-2.83 3.6-4.98 6.72-4.98z" />
            </svg>
            <span>{loading === "google" ? "Authenticating Google..." : "Sign in with Google"}</span>
          </button>

          <div className="grid grid-cols-2 gap-2">
            <button
              type="button"
              onClick={() => handleOAuthSignIn("microsoft")}
              disabled={loading !== null}
              className="py-2.5 px-3 rounded-xl bg-white dark:bg-white/10 hover:bg-slate-50 dark:hover:bg-white/15 text-slate-800 dark:text-white border border-slate-300 dark:border-white/20 font-bold font-mono text-xs flex items-center justify-center gap-2 shadow-sm transition-all cursor-pointer disabled:opacity-50"
            >
              <svg className="w-3.5 h-3.5" viewBox="0 0 23 23">
                <path fill="#f35325" d="M1 1h10v10H1z"/>
                <path fill="#81bc06" d="M12 1h10v10H12z"/>
                <path fill="#05a6f0" d="M1 12h10v10H1z"/>
                <path fill="#ffba08" d="M12 12h10v10H12z"/>
              </svg>
              <span>{loading === "microsoft" ? "..." : "Microsoft"}</span>
            </button>

            <button
              type="button"
              onClick={() => handleOAuthSignIn("github")}
              disabled={loading !== null}
              className="py-2.5 px-3 rounded-xl bg-slate-900 hover:bg-slate-800 dark:bg-black/60 dark:hover:bg-black text-white border border-slate-800 dark:border-white/20 font-bold font-mono text-xs flex items-center justify-center gap-2 shadow-sm transition-all cursor-pointer disabled:opacity-50"
            >
              <svg className="w-3.5 h-3.5 fill-current" viewBox="0 0 24 24">
                <path fillRule="evenodd" clipRule="evenodd" d="M12 2C6.477 2 2 6.484 2 12.017c0 4.425 2.865 8.18 6.839 9.504.5.092.682-.217.682-.483 0-.237-.008-.868-.013-1.703-2.782.605-3.369-1.343-3.369-1.343-.454-1.158-1.11-1.466-1.11-1.466-.908-.62.069-.608.069-.608 1.003.07 1.53 1.032 1.53 1.032.892 1.53 2.341 1.088 2.91.832.092-.647.35-1.088.636-1.338-2.22-.253-4.555-1.113-4.555-4.951 0-1.093.39-1.988 1.029-2.688-.103-.253-.446-1.272.098-2.65 0 0 .84-.27 2.75 1.026A9.564 9.564 0 0112 6.844c.85.004 1.705.115 2.504.337 1.909-1.296 2.747-1.027 2.747-1.027.546 1.379.202 2.398.1 2.651.64.7 1.028 1.595 1.028 2.688 0 3.848-2.339 4.695-4.566 4.943.359.309.678.92.678 1.855 0 1.338-.012 2.419-.012 2.747 0 .268.18.58.688.482A10.019 10.019 0 0022 12.017C22 6.484 17.522 2 12 2z"/>
              </svg>
              <span>{loading === "github" ? "..." : "GitHub"}</span>
            </button>
          </div>
        </div>

        <div className="flex items-center gap-3 my-4">
          <div className="flex-1 h-px bg-slate-200 dark:bg-white/10" />
          <span className="text-[10px] font-mono text-slate-400 dark:text-slate-500 uppercase">or standard login</span>
          <div className="flex-1 h-px bg-slate-200 dark:bg-white/10" />
        </div>

        {/* Password Form */}
        <form onSubmit={handleSubmit} className="space-y-3.5">
          {error && (
            <div className="p-3 rounded-xl bg-rose-50 dark:bg-rose-950/80 border border-rose-200 dark:border-rose-500/40 text-xs text-rose-700 dark:text-rose-200">
              {error}
            </div>
          )}

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
                className="w-full pl-10 pr-4 py-2.5 rounded-xl bg-slate-50 dark:bg-[#0A0A0C] border border-slate-200 dark:border-white/10 text-sm text-slate-900 dark:text-slate-100 focus:outline-none focus:border-sky-500 font-sans"
              />
            </div>
          </div>

          <div>
            <label className="block text-xs font-mono text-slate-600 dark:text-slate-300 uppercase mb-1">
              Secret Key / Password
            </label>
            <div className="relative">
              <Lock className="absolute left-3.5 top-1/2 -translate-y-1/2 w-4 h-4 text-slate-400" />
              <input
                type="password"
                required
                value={password}
                onChange={(e) => setPassword(e.target.value)}
                className="w-full pl-10 pr-4 py-2.5 rounded-xl bg-slate-50 dark:bg-[#0A0A0C] border border-slate-200 dark:border-white/10 text-sm text-slate-900 dark:text-slate-100 focus:outline-none focus:border-sky-500 font-sans"
              />
            </div>
          </div>

          <div className="p-2.5 rounded-xl bg-slate-50 dark:bg-white/[0.03] border border-slate-200 dark:border-white/10 text-xs text-slate-500 dark:text-slate-400 font-mono">
            <span className="text-sky-600 dark:text-[#38BDF8] block mb-0.5 font-bold">Demo Credentials:</span>
            admin@trustgraph.com / password123
          </div>

          <button
            type="submit"
            disabled={loading !== null}
            className="w-full py-3 rounded-xl bg-gradient-to-r from-sky-500 to-cyan-500 hover:from-sky-400 hover:to-cyan-400 text-slate-950 font-mono font-bold text-xs tracking-wider uppercase flex items-center justify-center gap-2 shadow-lg shadow-sky-500/20 transition-all cursor-pointer disabled:opacity-50"
          >
            <span>{loading === "password" ? "Authenticating Operator..." : "Authenticate Session"}</span>
            <ArrowRight className="w-4 h-4" />
          </button>
        </form>
      </div>
    </div>
  );
};

