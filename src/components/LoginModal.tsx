import React, { useState } from "react";
import { sound } from "../utils/audio";
import { User } from "../types";
import { X, Lock, Mail, ArrowRight, KeyRound } from "lucide-react";
import { signInWithGoogle } from "../lib/firebase";

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
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState("");

  if (!isOpen) return null;

  const handleGoogleSignIn = async () => {
    setError("");
    setLoading(true);
    sound.playClick();
    try {
      const firebaseUser = await signInWithGoogle();
      sound.playAISuccess();
      onLoginSuccess({
        email: firebaseUser.email || "cpo@msme-trustgraph.com",
        name: firebaseUser.displayName || "Procurement Director",
        role: "Verified Executive (Google Auth)"
      });
      onClose();
    } catch (err: any) {
      console.warn("Google popup login info:", err);
      setError(err?.message || "Google sign in was cancelled or requires popup permission.");
    } finally {
      setLoading(false);
    }
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setError("");
    setLoading(true);
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
        onLoginSuccess(data.user);
        onClose();
      } else {
        setError(data.error || "Invalid credentials");
      }
    } catch (err) {
      setError("Network error connecting to authentication service");
    } finally {
      setLoading(false);
    }
  };

  return (
    <div
      id="login-modal-backdrop"
      className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-[#0A0A0C]/85 backdrop-blur-md animate-in fade-in"
    >
      <div className="relative w-full max-w-md rounded-3xl neural-card border border-white/10 shadow-2xl p-6 sm:p-8 bg-[#0A0A0C]">
        {/* Header */}
        <div className="flex items-center justify-between pb-4 border-b border-white/10">
          <div className="flex items-center gap-3">
            <div className="p-2.5 rounded-xl bg-[#38BDF8]/20 border border-[#38BDF8]/40 text-[#38BDF8]">
              <KeyRound className="w-5 h-5" />
            </div>
            <div>
              <h2 className="text-lg font-bold text-white font-mono">
                TrustGraph Command Login
              </h2>
              <span className="text-[10px] font-mono text-[#38BDF8] uppercase tracking-wider">
                Firebase &amp; Enterprise CPO Access
              </span>
            </div>
          </div>

          <button
            onClick={() => { sound.playClick(); onClose(); }}
            className="p-2 rounded-xl bg-white/5 hover:bg-white/10 text-slate-400 hover:text-white transition-colors cursor-pointer"
          >
            <X className="w-5 h-5" />
          </button>
        </div>

        {/* Google Sign-in with Firebase Auth */}
        <div className="mt-6 space-y-4">
          <button
            type="button"
            onClick={handleGoogleSignIn}
            disabled={loading}
            className="w-full py-3 px-4 rounded-xl bg-white hover:bg-slate-100 text-slate-900 font-bold font-mono text-xs flex items-center justify-center gap-3 shadow-lg shadow-white/10 transition-all cursor-pointer disabled:opacity-50"
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
            <span>Sign in with Google (Firebase Auth)</span>
          </button>

          <div className="flex items-center gap-3 my-2">
            <div className="flex-1 h-px bg-white/10" />
            <span className="text-[10px] font-mono text-slate-500 uppercase">or standard login</span>
            <div className="flex-1 h-px bg-white/10" />
          </div>

          {/* Password Form */}
          <form onSubmit={handleSubmit} className="space-y-4">
            {error && (
              <div className="p-3 rounded-xl bg-rose-950/80 border border-rose-500/40 text-xs text-rose-200">
                {error}
              </div>
            )}

            <div>
              <label className="block text-xs font-mono text-slate-300 uppercase mb-1">
                Operator Email
              </label>
              <div className="relative">
                <Mail className="absolute left-3.5 top-1/2 -translate-y-1/2 w-4 h-4 text-slate-400" />
                <input
                  type="email"
                  required
                  value={email}
                  onChange={(e) => setEmail(e.target.value)}
                  className="w-full pl-10 pr-4 py-2.5 rounded-xl bg-[#0A0A0C] border border-white/10 text-sm text-slate-100 focus:outline-none focus:border-[#38BDF8] font-sans"
                />
              </div>
            </div>

            <div>
              <label className="block text-xs font-mono text-slate-300 uppercase mb-1">
                Secret Key / Password
              </label>
              <div className="relative">
                <Lock className="absolute left-3.5 top-1/2 -translate-y-1/2 w-4 h-4 text-slate-400" />
                <input
                  type="password"
                  required
                  value={password}
                  onChange={(e) => setPassword(e.target.value)}
                  className="w-full pl-10 pr-4 py-2.5 rounded-xl bg-[#0A0A0C] border border-white/10 text-sm text-slate-100 focus:outline-none focus:border-[#38BDF8] font-sans"
                />
              </div>
            </div>

            <div className="p-3 rounded-xl bg-white/[0.03] border border-white/10 text-xs text-slate-400 font-mono">
              <span className="text-[#38BDF8] block mb-0.5 font-bold">Demo Credentials:</span>
              admin@trustgraph.com / password123
            </div>

            <button
              type="submit"
              disabled={loading}
              className="btn-cyber w-full py-3 rounded-xl flex items-center justify-center gap-2"
            >
              <span>{loading ? "Authenticating Operator..." : "Authenticate Session"}</span>
              <ArrowRight className="w-4 h-4" />
            </button>
          </form>
        </div>
      </div>
    </div>
  );
};
