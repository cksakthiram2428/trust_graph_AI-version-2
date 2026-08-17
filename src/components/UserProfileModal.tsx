import React, { useState, useRef } from "react";
import { User } from "../types";
import { sound } from "../utils/audio";
import { updateUserProfileInFirestore } from "../lib/firebase";
import { 
  X, 
  User as UserIcon, 
  Camera, 
  Upload, 
  Check, 
  Building2, 
  Briefcase, 
  Phone, 
  Mail, 
  Bell, 
  Shield, 
  Sparkles, 
  Save, 
  CheckCircle2, 
  AlertCircle,
  FileBadge,
  LogOut
} from "lucide-react";

interface UserProfileModalProps {
  isOpen: boolean;
  onClose: () => void;
  user: User | null;
  onUpdateUser: (updatedUser: User) => void;
  onLogout?: () => void;
}

export const UserProfileModal: React.FC<UserProfileModalProps> = ({
  isOpen,
  onClose,
  user,
  onUpdateUser,
  onLogout
}) => {
  if (!isOpen) return null;

  const [activeTab, setActiveTab] = useState<"general" | "avatar" | "alerts">("general");
  const [name, setName] = useState(user?.name || "Procurement Director");
  const [role, setRole] = useState(user?.role || "Chief Procurement Officer");
  const [company, setCompany] = useState(user?.company || "Enterprise Supply Chain Corp");
  const [department, setDepartment] = useState(user?.department || "Global Strategic Sourcing");
  const [phone, setPhone] = useState(user?.phone || "+91 98765 43210");
  const [bio, setBio] = useState(user?.bio || "Responsible for MSME tier-1 and tier-2 vendor resilience, contagion mitigation, and statutory compliance.");
  const [photoURL, setPhotoURL] = useState(user?.photoURL || "");
  const [emailAlerts, setEmailAlerts] = useState(user?.emailAlerts ?? true);
  const [smsAlerts, setSmsAlerts] = useState(user?.smsAlerts ?? true);
  const [saving, setSaving] = useState(false);
  const [savedSuccess, setSavedSuccess] = useState(false);

  const fileInputRef = useRef<HTMLInputElement>(null);

  const avatarPresets = [
    {
      id: "preset-1",
      label: "Executive Director",
      url: "https://images.unsplash.com/photo-1534528741775-53994a69daeb?w=150&auto=format&fit=crop&q=80"
    },
    {
      id: "preset-2",
      label: "Risk Architect",
      url: "https://images.unsplash.com/photo-1507003211169-0a1dd7228f2d?w=150&auto=format&fit=crop&q=80"
    },
    {
      id: "preset-3",
      label: "Supply Lead",
      url: "https://images.unsplash.com/photo-1573496359142-b8d87734a5a2?w=150&auto=format&fit=crop&q=80"
    },
    {
      id: "preset-4",
      label: "Forensic Auditor",
      url: "https://images.unsplash.com/photo-1500648767791-00dcc994a43e?w=150&auto=format&fit=crop&q=80"
    },
    {
      id: "preset-5",
      label: "Cyber Analyst",
      url: "https://images.unsplash.com/photo-1580489944761-15a19d654956?w=150&auto=format&fit=crop&q=80"
    }
  ];

  const handleImageUpload = (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0];
    if (!file) return;

    sound.playClick();
    const reader = new FileReader();
    reader.onload = () => {
      if (typeof reader.result === "string") {
        setPhotoURL(reader.result);
      }
    };
    reader.readAsDataURL(file);
  };

  const handleSave = async (e: React.FormEvent) => {
    e.preventDefault();
    setSaving(true);
    sound.playClick();

    const updatedUser: User = {
      uid: user?.uid || `user-${Date.now()}`,
      email: user?.email || "cpo@trustgraph.com",
      name,
      role,
      company,
      department,
      phone,
      bio,
      photoURL,
      provider: user?.provider || "password",
      emailAlerts,
      smsAlerts
    };

    try {
      if (updatedUser.uid) {
        await updateUserProfileInFirestore(updatedUser.uid, {
          displayName: name,
          name,
          role,
          company,
          department,
          phone,
          bio,
          photoURL,
          emailAlerts,
          smsAlerts
        });
      }
      sound.playAISuccess();
      onUpdateUser(updatedUser);
      setSavedSuccess(true);
      setTimeout(() => {
        setSavedSuccess(false);
        onClose();
      }, 1000);
    } catch (err) {
      console.error("Save profile error:", err);
    } finally {
      setSaving(false);
    }
  };

  return (
    <div
      id="user-profile-modal-backdrop"
      className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-slate-900/80 dark:bg-[#070709]/85 backdrop-blur-md animate-in fade-in"
    >
      <div className="relative w-full max-w-2xl rounded-3xl neural-card border border-slate-200 dark:border-white/10 shadow-2xl p-6 sm:p-8 bg-white dark:bg-[#0E0E12] text-slate-900 dark:text-slate-100 overflow-hidden">
        {/* Header */}
        <div className="flex items-center justify-between pb-4 border-b border-slate-100 dark:border-white/10">
          <div className="flex items-center gap-3">
            <div className="relative w-12 h-12 rounded-2xl bg-gradient-to-br from-sky-500 to-indigo-600 p-0.5 shadow-md">
              {photoURL ? (
                <img
                  src={photoURL}
                  alt={name}
                  referrerPolicy="no-referrer"
                  className="w-full h-full object-cover rounded-[14px]"
                />
              ) : (
                <div className="w-full h-full bg-white dark:bg-[#0A0A0C] rounded-[14px] flex items-center justify-center text-sky-500 font-bold text-lg font-mono">
                  {name.charAt(0).toUpperCase()}
                </div>
              )}
            </div>
            <div>
              <h2 className="text-lg font-bold text-slate-900 dark:text-white font-display">
                Operator Profile Settings
              </h2>
              <span className="text-[11px] font-mono text-sky-600 dark:text-[#38BDF8] uppercase tracking-wider">
                {user?.email || "cpo@trustgraph.com"} • {user?.provider ? `${user.provider.toUpperCase()} AUTH` : "ENTERPRISE"}
              </span>
            </div>
          </div>

          <button
            onClick={() => {
              sound.playClick();
              onClose();
            }}
            className="p-2 rounded-xl bg-slate-100 dark:bg-white/5 hover:bg-slate-200 dark:hover:bg-white/10 text-slate-500 dark:text-slate-400 hover:text-slate-900 dark:hover:text-white transition-colors cursor-pointer"
          >
            <X className="w-5 h-5" />
          </button>
        </div>

        {/* Tab Navigation */}
        <div className="flex items-center gap-2 mt-5 p-1 rounded-xl bg-slate-100 dark:bg-white/5 border border-slate-200 dark:border-white/10 text-xs font-mono">
          <button
            type="button"
            onClick={() => { sound.playClick(); setActiveTab("general"); }}
            className={`flex-1 py-2 rounded-lg flex items-center justify-center gap-1.5 transition-all cursor-pointer ${
              activeTab === "general"
                ? "bg-white dark:bg-white/10 text-sky-600 dark:text-[#38BDF8] shadow-sm font-bold"
                : "text-slate-600 dark:text-slate-400 hover:text-slate-900 dark:hover:text-slate-200"
            }`}
          >
            <UserIcon className="w-3.5 h-3.5" />
            <span>Profile Details</span>
          </button>

          <button
            type="button"
            onClick={() => { sound.playClick(); setActiveTab("avatar"); }}
            className={`flex-1 py-2 rounded-lg flex items-center justify-center gap-1.5 transition-all cursor-pointer ${
              activeTab === "avatar"
                ? "bg-white dark:bg-white/10 text-sky-600 dark:text-[#38BDF8] shadow-sm font-bold"
                : "text-slate-600 dark:text-slate-400 hover:text-slate-900 dark:hover:text-slate-200"
            }`}
          >
            <Camera className="w-3.5 h-3.5" />
            <span>Avatar &amp; Photo</span>
          </button>

          <button
            type="button"
            onClick={() => { sound.playClick(); setActiveTab("alerts"); }}
            className={`flex-1 py-2 rounded-lg flex items-center justify-center gap-1.5 transition-all cursor-pointer ${
              activeTab === "alerts"
                ? "bg-white dark:bg-white/10 text-sky-600 dark:text-[#38BDF8] shadow-sm font-bold"
                : "text-slate-600 dark:text-slate-400 hover:text-slate-900 dark:hover:text-slate-200"
            }`}
          >
            <Bell className="w-3.5 h-3.5" />
            <span>Alerts &amp; Directives</span>
          </button>
        </div>

        {/* Tab Content Form */}
        <form onSubmit={handleSave} className="mt-6 space-y-4">
          {activeTab === "general" && (
            <div className="space-y-4 max-h-[380px] overflow-y-auto pr-1">
              <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                <div>
                  <label className="block text-xs font-mono text-slate-600 dark:text-slate-400 uppercase mb-1">
                    Display Name
                  </label>
                  <div className="relative">
                    <UserIcon className="absolute left-3.5 top-1/2 -translate-y-1/2 w-4 h-4 text-slate-400" />
                    <input
                      type="text"
                      required
                      value={name}
                      onChange={(e) => setName(e.target.value)}
                      className="w-full pl-10 pr-4 py-2 rounded-xl bg-slate-50 dark:bg-[#0A0A0C] border border-slate-200 dark:border-white/10 text-sm text-slate-900 dark:text-slate-100 focus:outline-none focus:border-sky-500 font-sans"
                    />
                  </div>
                </div>

                <div>
                  <label className="block text-xs font-mono text-slate-600 dark:text-slate-400 uppercase mb-1">
                    Designation / Role
                  </label>
                  <div className="relative">
                    <Briefcase className="absolute left-3.5 top-1/2 -translate-y-1/2 w-4 h-4 text-slate-400" />
                    <input
                      type="text"
                      required
                      value={role}
                      onChange={(e) => setRole(e.target.value)}
                      className="w-full pl-10 pr-4 py-2 rounded-xl bg-slate-50 dark:bg-[#0A0A0C] border border-slate-200 dark:border-white/10 text-sm text-slate-900 dark:text-slate-100 focus:outline-none focus:border-sky-500 font-sans"
                    />
                  </div>
                </div>
              </div>

              <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                <div>
                  <label className="block text-xs font-mono text-slate-600 dark:text-slate-400 uppercase mb-1">
                    Enterprise / Organization
                  </label>
                  <div className="relative">
                    <Building2 className="absolute left-3.5 top-1/2 -translate-y-1/2 w-4 h-4 text-slate-400" />
                    <input
                      type="text"
                      value={company}
                      onChange={(e) => setCompany(e.target.value)}
                      className="w-full pl-10 pr-4 py-2 rounded-xl bg-slate-50 dark:bg-[#0A0A0C] border border-slate-200 dark:border-white/10 text-sm text-slate-900 dark:text-slate-100 focus:outline-none focus:border-sky-500 font-sans"
                    />
                  </div>
                </div>

                <div>
                  <label className="block text-xs font-mono text-slate-600 dark:text-slate-400 uppercase mb-1">
                    Department
                  </label>
                  <div className="relative">
                    <FileBadge className="absolute left-3.5 top-1/2 -translate-y-1/2 w-4 h-4 text-slate-400" />
                    <input
                      type="text"
                      value={department}
                      onChange={(e) => setDepartment(e.target.value)}
                      className="w-full pl-10 pr-4 py-2 rounded-xl bg-slate-50 dark:bg-[#0A0A0C] border border-slate-200 dark:border-white/10 text-sm text-slate-900 dark:text-slate-100 focus:outline-none focus:border-sky-500 font-sans"
                    />
                  </div>
                </div>
              </div>

              <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                <div>
                  <label className="block text-xs font-mono text-slate-600 dark:text-slate-400 uppercase mb-1">
                    Official Email
                  </label>
                  <div className="relative">
                    <Mail className="absolute left-3.5 top-1/2 -translate-y-1/2 w-4 h-4 text-slate-400" />
                    <input
                      type="email"
                      disabled
                      value={user?.email || "cpo@trustgraph.com"}
                      className="w-full pl-10 pr-4 py-2 rounded-xl bg-slate-100 dark:bg-white/[0.03] border border-slate-200 dark:border-white/5 text-sm text-slate-500 dark:text-slate-400 cursor-not-allowed font-mono"
                    />
                  </div>
                </div>

                <div>
                  <label className="block text-xs font-mono text-slate-600 dark:text-slate-400 uppercase mb-1">
                    Emergency Phone / Signal
                  </label>
                  <div className="relative">
                    <Phone className="absolute left-3.5 top-1/2 -translate-y-1/2 w-4 h-4 text-slate-400" />
                    <input
                      type="text"
                      value={phone}
                      onChange={(e) => setPhone(e.target.value)}
                      className="w-full pl-10 pr-4 py-2 rounded-xl bg-slate-50 dark:bg-[#0A0A0C] border border-slate-200 dark:border-white/10 text-sm text-slate-900 dark:text-slate-100 focus:outline-none focus:border-sky-500 font-mono"
                    />
                  </div>
                </div>
              </div>

              <div>
                <label className="block text-xs font-mono text-slate-600 dark:text-slate-400 uppercase mb-1">
                  Procurement Charter &amp; Bio
                </label>
                <textarea
                  rows={2}
                  value={bio}
                  onChange={(e) => setBio(e.target.value)}
                  className="w-full p-3 rounded-xl bg-slate-50 dark:bg-[#0A0A0C] border border-slate-200 dark:border-white/10 text-sm text-slate-900 dark:text-slate-100 focus:outline-none focus:border-sky-500 font-sans"
                />
              </div>
            </div>
          )}

          {activeTab === "avatar" && (
            <div className="space-y-5 max-h-[380px] overflow-y-auto pr-1">
              {/* Photo Upload Area */}
              <div className="p-4 rounded-2xl bg-slate-50 dark:bg-white/[0.02] border border-slate-200 dark:border-white/10 flex flex-col sm:flex-row items-center gap-4">
                <div className="relative w-20 h-20 rounded-2xl bg-gradient-to-br from-sky-500 to-indigo-600 p-0.5 shrink-0 shadow-md">
                  {photoURL ? (
                    <img
                      src={photoURL}
                      alt="Avatar"
                      referrerPolicy="no-referrer"
                      className="w-full h-full object-cover rounded-[14px]"
                    />
                  ) : (
                    <div className="w-full h-full bg-slate-100 dark:bg-[#0A0A0C] rounded-[14px] flex items-center justify-center text-sky-500 font-bold text-2xl">
                      {name.charAt(0).toUpperCase()}
                    </div>
                  )}
                </div>

                <div className="flex-1 text-center sm:text-left space-y-2">
                  <div className="text-xs font-mono font-bold text-slate-900 dark:text-white uppercase">
                    Upload Custom Picture
                  </div>
                  <p className="text-xs text-slate-500 dark:text-slate-400">
                    Supports PNG, JPG, or SVG. Stored in high-resolution security tokens.
                  </p>
                  <div className="flex items-center justify-center sm:justify-start gap-2">
                    <input
                      type="file"
                      ref={fileInputRef}
                      onChange={handleImageUpload}
                      accept="image/*"
                      className="hidden"
                    />
                    <button
                      type="button"
                      onClick={() => fileInputRef.current?.click()}
                      className="px-3.5 py-1.5 rounded-xl bg-sky-500/10 hover:bg-sky-500/20 text-sky-600 dark:text-cyan-400 border border-sky-500/30 text-xs font-mono font-bold flex items-center gap-1.5 cursor-pointer"
                    >
                      <Upload className="w-3.5 h-3.5" />
                      <span>Choose File</span>
                    </button>
                    {photoURL && (
                      <button
                        type="button"
                        onClick={() => setPhotoURL("")}
                        className="px-3 py-1.5 rounded-xl bg-slate-200 dark:bg-white/10 text-slate-600 dark:text-slate-300 text-xs font-mono cursor-pointer"
                      >
                        Reset
                      </button>
                    )}
                  </div>
                </div>
              </div>

              {/* Preset Gallery */}
              <div>
                <label className="block text-xs font-mono text-slate-600 dark:text-slate-400 uppercase mb-2">
                  Or Select An Executive Avatar Preset
                </label>
                <div className="grid grid-cols-2 sm:grid-cols-5 gap-3">
                  {avatarPresets.map((preset) => {
                    const isSelected = photoURL === preset.url;
                    return (
                      <div
                        key={preset.id}
                        onClick={() => {
                          sound.playClick();
                          setPhotoURL(preset.url);
                        }}
                        className={`p-2.5 rounded-2xl border transition-all cursor-pointer flex flex-col items-center gap-2 text-center ${
                          isSelected
                            ? "border-sky-500 bg-sky-500/10 dark:bg-sky-500/20 shadow-md ring-2 ring-sky-500/30"
                            : "border-slate-200 dark:border-white/10 hover:border-slate-300 dark:hover:border-white/20 bg-slate-50 dark:bg-white/[0.02]"
                        }`}
                      >
                        <img
                          src={preset.url}
                          alt={preset.label}
                          referrerPolicy="no-referrer"
                          className="w-12 h-12 rounded-xl object-cover"
                        />
                        <span className="text-[10px] font-mono font-semibold text-slate-700 dark:text-slate-300 line-clamp-1">
                          {preset.label}
                        </span>
                      </div>
                    );
                  })}
                </div>
              </div>
            </div>
          )}

          {activeTab === "alerts" && (
            <div className="space-y-4 max-h-[380px] overflow-y-auto pr-1">
              <div className="p-4 rounded-2xl bg-slate-50 dark:bg-white/[0.02] border border-slate-200 dark:border-white/10 space-y-4">
                <div className="flex items-center justify-between">
                  <div>
                    <span className="text-xs font-bold text-slate-900 dark:text-white font-mono block">
                      Contagion Shockwave Disruption Alerts
                    </span>
                    <span className="text-xs text-slate-500 dark:text-slate-400">
                      Receive instant notifications when a tier-1 or tier-2 supplier exceeds 70% insolvency probability.
                    </span>
                  </div>
                  <button
                    type="button"
                    onClick={() => { sound.playClick(); setEmailAlerts(!emailAlerts); }}
                    className={`w-11 h-6 flex items-center rounded-full p-1 transition-colors cursor-pointer ${
                      emailAlerts ? "bg-sky-500" : "bg-slate-300 dark:bg-white/20"
                    }`}
                  >
                    <div
                      className={`bg-white w-4 h-4 rounded-full shadow-md transform transition-transform ${
                        emailAlerts ? "translate-x-5" : "translate-x-0"
                      }`}
                    />
                  </button>
                </div>

                <div className="pt-3 border-t border-slate-200 dark:border-white/10 flex items-center justify-between">
                  <div>
                    <span className="text-xs font-bold text-slate-900 dark:text-white font-mono block">
                      MSMED Act 45-Day Statutory Penalty Alerts
                    </span>
                    <span className="text-xs text-slate-500 dark:text-slate-400">
                      Triggers compounding interest warnings on outstanding vendor invoices approaching statutory deadlines.
                    </span>
                  </div>
                  <button
                    type="button"
                    onClick={() => { sound.playClick(); setSmsAlerts(!smsAlerts); }}
                    className={`w-11 h-6 flex items-center rounded-full p-1 transition-colors cursor-pointer ${
                      smsAlerts ? "bg-sky-500" : "bg-slate-300 dark:bg-white/20"
                    }`}
                  >
                    <div
                      className={`bg-white w-4 h-4 rounded-full shadow-md transform transition-transform ${
                        smsAlerts ? "translate-x-5" : "translate-x-0"
                      }`}
                    />
                  </button>
                </div>
              </div>

              <div className="p-3.5 rounded-2xl bg-sky-50 dark:bg-sky-950/40 border border-sky-200 dark:border-sky-500/30 text-xs text-sky-800 dark:text-sky-200 flex items-start gap-2.5 font-mono">
                <Shield className="w-4 h-4 text-sky-500 shrink-0 mt-0.5" />
                <span>
                  Security clearance level: <strong>Tier-1 Executive Command</strong> with multi-model Gemini 3.5 Copilot access and live government API bridging.
                </span>
              </div>
            </div>
          )}

          {/* Action Footer */}
          <div className="pt-4 border-t border-slate-100 dark:border-white/10 flex items-center justify-between gap-3">
            {onLogout ? (
              <button
                type="button"
                onClick={() => {
                  sound.playClick();
                  onClose();
                  onLogout();
                }}
                className="px-4 py-2.5 rounded-xl border border-rose-500/30 bg-rose-500/10 text-rose-600 dark:text-rose-400 font-mono text-xs font-bold hover:bg-rose-500/20 transition-colors flex items-center gap-1.5 cursor-pointer"
              >
                <LogOut className="w-3.5 h-3.5" />
                <span>Logout</span>
              </button>
            ) : <div />}

            <div className="flex items-center gap-3">
              <button
                type="button"
                onClick={() => { sound.playClick(); onClose(); }}
                className="px-4 py-2.5 rounded-xl border border-slate-200 dark:border-white/10 bg-slate-100 dark:bg-white/5 text-slate-700 dark:text-slate-300 font-mono text-xs hover:bg-slate-200 dark:hover:bg-white/10 transition-colors cursor-pointer"
              >
                Cancel
              </button>

              <button
                type="submit"
                disabled={saving}
                className="px-6 py-2.5 rounded-xl bg-gradient-to-r from-sky-500 to-cyan-500 hover:from-sky-400 hover:to-cyan-400 text-slate-950 font-mono font-bold text-xs tracking-wider uppercase flex items-center gap-2 shadow-lg shadow-sky-500/20 transition-all cursor-pointer disabled:opacity-50"
              >
                {savedSuccess ? (
                  <>
                    <CheckCircle2 className="w-4 h-4 text-emerald-950" />
                    <span>Saved!</span>
                  </>
                ) : (
                  <>
                    <Save className="w-4 h-4" />
                    <span>{saving ? "Saving Changes..." : "Save Settings"}</span>
                  </>
                )}
              </button>
            </div>
          </div>
        </form>
      </div>
    </div>
  );
};
