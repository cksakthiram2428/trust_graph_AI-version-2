import React, { useState, useEffect } from "react";
import { Supplier, NetworkData, PlatformStat, CascadeShockResult, ViewMode, User, RealtimeUser } from "./types";
import { Navbar } from "./components/Navbar";
import { LandingPage } from "./components/LandingPage";
import { LoginPage } from "./components/LoginPage";
import { AuroraBackground } from "./components/ui/aurora-background";
import { StatsHUD } from "./components/StatsHUD";
import { Network3DScene } from "./components/Network3DScene";
import { Network2DView } from "./components/Network2DView";
import { RiskMatrixView } from "./components/RiskMatrixView";
import { SupplierGrid } from "./components/SupplierGrid";
import { CascadeSimulatorModal } from "./components/CascadeSimulatorModal";
import { SupplierDetailDrawer } from "./components/SupplierDetailDrawer";
import { SupplierModal } from "./components/SupplierModal";
import { AICopilotDrawer } from "./components/AICopilotDrawer";
import { ResearchHub } from "./components/ResearchHub";
import { LoginModal } from "./components/LoginModal";
import { CsvIngestionModal } from "./components/CsvIngestionModal";
import { UserProfileModal } from "./components/UserProfileModal";
import { FloatingAIAgentButton } from "./components/FloatingAIAgentButton";
import { sound } from "./utils/audio";
import { auth, onAuthStateChanged, logOut, subscribeToRealtimeUsers, syncUserToFirestore } from "./lib/firebase";
import { 
  Sparkles, 
  Network, 
  Layers, 
  Grid3X3, 
  BookOpen, 
  ShieldCheck, 
  Zap, 
  Activity,
  CheckCircle2,
  AlertCircle
} from "lucide-react";

export default function App() {
  // Navigation & Page State (Landing vs Workspace vs Login Panel)
  const [pageMode, setPageMode] = useState<"LANDING" | "WORKSPACE" | "LOGIN">("LANDING");
  const [viewMode, setViewMode] = useState<ViewMode>("3D_SPACE");

  // Real-time Database Users State
  const [onlineUsers, setOnlineUsers] = useState<RealtimeUser[]>([]);

  // Theme State (Dark / Light)
  const [theme, setTheme] = useState<"dark" | "light">(() => {
    if (typeof window !== "undefined") {
      const saved = localStorage.getItem("trustgraph_theme");
      if (saved === "light" || saved === "dark") return saved;
    }
    return "dark";
  });

  const [isMuted, setIsMuted] = useState(sound.isMuted);

  // Sync theme class to documentElement
  useEffect(() => {
    if (theme === "dark") {
      document.documentElement.classList.add("dark");
    } else {
      document.documentElement.classList.remove("dark");
    }
    try {
      localStorage.setItem("trustgraph_theme", theme);
    } catch (e) {}
  }, [theme]);

  const toggleTheme = () => {
    setTheme(prev => (prev === "dark" ? "light" : "dark"));
  };

  const toggleSound = () => {
    sound.isMuted = !sound.isMuted;
    setIsMuted(sound.isMuted);
  };

  // App Core State
  const [suppliers, setSuppliers] = useState<Supplier[]>([]);
  const [networkData, setNetworkData] = useState<NetworkData>({ nodes: [], edges: [] });
  const [stats, setStats] = useState<PlatformStat[]>([]);
  const [systemHealth, setSystemHealth] = useState<string>("Active Neural Monitoring");
  const [lastRealtimeRefresh, setLastRealtimeRefresh] = useState<string | undefined>(undefined);
  const [loading, setLoading] = useState<boolean>(true);
  const [refreshing, setRefreshing] = useState<boolean>(false);

  // User Auth State with Firebase integration
  const [user, setUser] = useState<User | null>({
    email: "admin@trustgraph.com",
    name: "MSME Operations HQ",
    role: "Chief Procurement Officer"
  });
  const [isLoginOpen, setIsLoginOpen] = useState<boolean>(false);
  const [isProfileOpen, setIsProfileOpen] = useState<boolean>(false);

  // Modals and Drawers
  const [selectedSupplier, setSelectedSupplier] = useState<Supplier | null>(null);
  const [selectedNodeKey, setSelectedNodeKey] = useState<string | null>(null);
  const [editingSupplier, setEditingSupplier] = useState<Supplier | null>(null);
  const [isAddEditOpen, setIsAddEditOpen] = useState<boolean>(false);
  const [cascadeTargetSupplier, setCascadeTargetSupplier] = useState<Supplier | null>(null);
  const [activeCascadeResult, setActiveCascadeResult] = useState<CascadeShockResult | null>(null);
  const [isCascadeModalOpen, setIsCascadeModalOpen] = useState<boolean>(false);
  const [isCopilotOpen, setIsCopilotOpen] = useState<boolean>(false);
  const [isCsvModalOpen, setIsCsvModalOpen] = useState<boolean>(false);
  const [toastMessage, setToastMessage] = useState<{ text: string; type: "success" | "error" | "info" } | null>(null);

  // Show toast utility
  const showToast = (text: string, type: "success" | "error" | "info" = "info") => {
    setToastMessage({ text, type });
    setTimeout(() => setToastMessage(null), 3500);
  };

  // Firebase Auth State Listener
  useEffect(() => {
    const unsubscribe = onAuthStateChanged(auth, (firebaseUser) => {
      if (firebaseUser) {
        setUser({
          uid: firebaseUser.uid,
          email: firebaseUser.email || "user@trustgraph.com",
          name: firebaseUser.displayName || "Procurement Officer",
          role: "Verified Executive (Google Auth)",
          photoURL: firebaseUser.photoURL || ""
        });
      }
    });
    return () => unsubscribe();
  }, []);

  // Real-time Database Users Subscription (Firestore)
  useEffect(() => {
    const unsubscribe = subscribeToRealtimeUsers((realtimeUsersList) => {
      if (realtimeUsersList && realtimeUsersList.length > 0) {
        setOnlineUsers(realtimeUsersList);
      }
    });
    return () => {
      if (unsubscribe) unsubscribe();
    };
  }, []);

  // Initial Fetch of Suppliers, Stats & Network Data
  useEffect(() => {
    fetchInitialData();
  }, []);

  const fetchInitialData = async () => {
    setLoading(true);
    try {
      const [suppliersRes, statsRes, networkRes] = await Promise.all([
        fetch("/api/suppliers"),
        fetch("/api/stats"),
        fetch("/api/network")
      ]);

      if (suppliersRes.ok) {
        const supData = await suppliersRes.json();
        setSuppliers(supData);
      }
      if (statsRes.ok) {
        const statsData = await statsRes.json();
        setStats(statsData.stats || []);
        if (statsData.systemHealth) setSystemHealth(statsData.systemHealth);
        if (statsData.summary?.lastRealtimeRefresh) setLastRealtimeRefresh(statsData.summary.lastRealtimeRefresh);
      }
      if (networkRes.ok) {
        const netData = await networkRes.json();
        setNetworkData(netData);
      }
    } catch (err) {
      console.error("Failed to load initial data", err);
      showToast("Operating in local cached model mode", "info");
    } finally {
      setLoading(false);
    }
  };

  // Navigation handlers
  const handleEnterWorkspace = (initialView?: "3D_SPACE" | "2D_TOPOLOGY" | "RISK_MATRIX") => {
    sound.playAISuccess();
    if (initialView) setViewMode(initialView);
    setPageMode("WORKSPACE");
  };

  const handleSelectNode = (nodeId: string) => {
    sound.playTargetLock();
    setSelectedNodeKey(nodeId);
    const matchedSupplier = suppliers.find(s => s.id === nodeId);
    if (matchedSupplier) {
      setSelectedSupplier(matchedSupplier);
    }
  };

  const handleOpenCascadeModal = (supplier: Supplier) => {
    sound.playClick();
    setCascadeTargetSupplier(supplier);
    setIsCascadeModalOpen(true);
  };

  const handleApplyShockTo3D = (result: CascadeShockResult) => {
    setActiveCascadeResult(result);
    setPageMode("WORKSPACE");
    setViewMode("3D_SPACE");
    sound.playShockwave();
    showToast(`Cascade propagation initialized: ${result.monetaryExposureINR} at risk`, "error");
  };

  const handleSaveSupplier = async (supplierData: Partial<Supplier>) => {
    try {
      const isEditing = !!editingSupplier;
      const url = isEditing ? `/api/suppliers/${editingSupplier.id}` : "/api/suppliers";
      const method = isEditing ? "PUT" : "POST";

      const res = await fetch(url, {
        method,
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify(supplierData)
      });

      if (!res.ok) throw new Error("Failed to save supplier");

      const saved = await res.json();
      if (isEditing) {
        setSuppliers(prev => prev.map(s => (s.id === saved.id ? saved : s)));
        showToast(`Updated supplier: ${saved.name}`, "success");
      } else {
        setSuppliers(prev => [saved, ...prev]);
        showToast(`Added MSME: ${saved.name}`, "success");
      }

      // Refresh network topology
      fetch("/api/network")
        .then(r => r.json())
        .then(data => setNetworkData(data))
        .catch(() => {});

      setIsAddEditOpen(false);
      setEditingSupplier(null);
    } catch (e: any) {
      console.error(e);
      showToast(e.message || "Failed to save supplier", "error");
    }
  };

  const handleDeleteSupplier = async (supplierId: string) => {
    if (!confirm("Are you sure you want to remove this MSME supplier from the monitoring network?")) {
      return;
    }
    try {
      const res = await fetch(`/api/suppliers/${supplierId}`, { method: "DELETE" });
      if (!res.ok) throw new Error("Failed to delete");
      setSuppliers(prev => prev.filter(s => s.id !== supplierId));
      showToast("Supplier removed from graph roster", "info");

      // Refresh network
      fetch("/api/network")
        .then(r => r.json())
        .then(data => setNetworkData(data))
        .catch(() => {});
    } catch (e) {
      showToast("Could not remove supplier", "error");
    }
  };

  const handleLogout = async () => {
    sound.playClick();
    try {
      await logOut();
    } catch (e) {}
    setUser(null);
    // Explicit Requirement: "make the navigation like once you logout , the landing page should open"
    setPageMode("LANDING");
    showToast("Signed out. Returned to Landing page.", "info");
  };

  const handleUpdateProfile = (updatedUser: User) => {
    setUser(updatedUser);
    showToast("Profile details updated successfully", "success");
  };

  const handleRefreshRealtime = async () => {
    setRefreshing(true);
    sound.playAISuccess();
    try {
      const res = await fetch("/api/admin/refresh-realtime", {
        method: "POST",
        headers: { "Content-Type": "application/json" }
      });
      const data = await res.json();
      if (data.status === "success") {
        showToast(`Real-time Refresh Successful: Analyzed ${data.data.adjustmentsCount} risks`, "success");
        setLastRealtimeRefresh(new Date().toISOString());
        // Refresh supplier data to show new scores/data
        fetchInitialData();
      } else {
        throw new Error(data.error || "Refresh failed");
      }
    } catch (err: any) {
      console.error(err);
      showToast(err.message || "Failed to sync real-time data", "error");
    } finally {
      setRefreshing(false);
    }
  };

  return (
    <div className="min-h-screen bg-slate-50 dark:bg-slate-950 text-slate-900 dark:text-slate-100 flex flex-col transition-colors duration-300 selection:bg-cyan-500/30 selection:text-cyan-600 dark:selection:text-cyan-200 relative">
      {/* Toast Alert Floating Top Center */}
      {toastMessage && (
        <div className="fixed top-20 left-1/2 -translate-x-1/2 z-50 px-4 py-2.5 rounded-xl bg-slate-900/95 backdrop-blur-xl border border-cyan-500/40 shadow-2xl flex items-center gap-2 text-xs font-mono text-cyan-200 animate-in fade-in slide-in-from-top-4">
          <CheckCircle2 className="w-4 h-4 text-cyan-400" />
          <span>{toastMessage.text}</span>
        </div>
      )}

      {/* Conditional Rendering: Landing Page vs Login Panel vs Workspace */}
      {pageMode === "LANDING" ? (
        <LandingPage
          onEnterWorkspace={handleEnterWorkspace}
          onOpenCopilot={() => setIsCopilotOpen(true)}
          onOpenCsvModal={() => setIsCsvModalOpen(true)}
          onOpenLogin={() => setPageMode("LOGIN")}
          user={user}
          onOpenProfile={() => setIsProfileOpen(true)}
          theme={theme}
          onToggleTheme={toggleTheme}
          isMuted={isMuted}
          onToggleSound={toggleSound}
          suppliers={suppliers}
          stats={stats}
        />
      ) : pageMode === "LOGIN" ? (
        <LoginPage
          onLoginSuccess={(loggedUser) => {
            setUser(loggedUser);
            setPageMode("WORKSPACE");
            showToast(`Welcome back, ${loggedUser.name}`, "success");
          }}
          onBackToLanding={() => setPageMode("LANDING")}
          onEnterWorkspace={() => setPageMode("WORKSPACE")}
          theme={theme}
          onToggleTheme={toggleTheme}
          isMuted={isMuted}
          onToggleSound={toggleSound}
          onlineUsers={onlineUsers}
        />
      ) : (
        <AuroraBackground className="min-h-screen py-0 w-full justify-start overflow-x-hidden">
          {/* Global Navbar */}
          <Navbar
            viewMode={viewMode}
            onSetViewMode={setViewMode}
            onOpenCopilot={() => setIsCopilotOpen(true)}
            onAddSupplier={() => {
              setEditingSupplier(null);
              setIsAddEditOpen(true);
            }}
            user={user}
            onOpenProfile={() => setIsProfileOpen(true)}
            onLoginClick={() => setPageMode("LOGIN")}
            onLogout={handleLogout}
            theme={theme}
            onToggleTheme={toggleTheme}
            onShowLanding={() => setPageMode("LANDING")}
          />

          {/* Main Knowledge Graph Body */}
          <main className="flex-1 max-w-7xl w-full mx-auto px-4 sm:px-6 lg:px-8 py-6 space-y-8 relative z-10">
            {/* Top Metric HUD & Live Telemetry */}
            <StatsHUD
              stats={stats}
              systemHealth={systemHealth}
              onOpenCopilot={() => setIsCopilotOpen(true)}
              isLoading={loading}
              lastRealtimeRefresh={lastRealtimeRefresh}
              onRefreshRealtime={handleRefreshRealtime}
              isRefreshing={refreshing}
            />

            {/* Knowledge Graph View Switcher Container */}
            <div className="space-y-4">
              {/* Main Visual Canvas Area based on viewMode */}
              {viewMode === "3D_SPACE" && (
                <div className="space-y-2">
                  <Network3DScene
                    networkData={networkData}
                    onSelectNode={handleSelectNode}
                    selectedNodeKey={selectedNodeKey}
                    cascadeResult={activeCascadeResult}
                    onTriggerCascade={(id) => {
                      const s = suppliers.find(item => item.id === id);
                      if (s) handleOpenCascadeModal(s);
                    }}
                  />
                </div>
              )}

              {viewMode === "2D_TOPOLOGY" && (
                <Network2DView
                  networkData={networkData}
                  onSelectNode={handleSelectNode}
                  selectedNodeKey={selectedNodeKey}
                />
              )}

              {viewMode === "RISK_MATRIX" && (
                <RiskMatrixView
                  suppliers={suppliers}
                  onSelectSupplier={(s) => setSelectedSupplier(s)}
                  onSimulateCascade={(s) => handleOpenCascadeModal(s)}
                />
              )}
            </div>

            {/* Supplier Forensic Trust Grid */}
            <div className="pt-4 border-t border-slate-200 dark:border-slate-800/80">
              <div className="flex items-center justify-between mb-4">
                <div className="flex items-center gap-2.5">
                  <span className="w-2.5 h-2.5 rounded-full bg-emerald-500 animate-pulse" />
                  <h2 className="text-lg font-bold text-slate-900 dark:text-white font-mono uppercase tracking-wider">
                    Active Supplier Trust Roster ({suppliers.length})
                  </h2>
                </div>
                <span className="text-xs font-mono text-slate-500 dark:text-slate-400">
                  Real-time payment lag &amp; statutory verification
                </span>
              </div>

              <SupplierGrid
                suppliers={suppliers}
                onSelectSupplier={(s) => setSelectedSupplier(s)}
                onSimulateCascade={(s) => handleOpenCascadeModal(s)}
                onEditSupplier={(s) => {
                  setEditingSupplier(s);
                  setIsAddEditOpen(true);
                }}
                onDeleteSupplier={handleDeleteSupplier}
                onAddSupplier={() => {
                  setEditingSupplier(null);
                  setIsAddEditOpen(true);
                }}
                onAddCsv={() => setIsCsvModalOpen(true)}
                onFocusIn3D={(id) => {
                  setViewMode("3D_SPACE");
                  handleSelectNode(id);
                }}
              />
            </div>

            {/* Research & Regulatory Intelligence Hub */}
            <div className="pt-8 border-t border-slate-200 dark:border-slate-800/80">
              <ResearchHub />
            </div>
          </main>

          {/* Footer */}
          <footer className="mt-12 border-t border-slate-200 dark:border-white/10 bg-white/90 dark:bg-[#0A0A0C]/90 backdrop-blur-md py-6 text-xs font-mono text-slate-500 dark:text-slate-400 transition-colors duration-300 w-full relative z-10">
            <div className="max-w-7xl mx-auto px-4 flex flex-col md:flex-row items-center justify-between gap-4">
              <div className="flex items-center gap-2 text-slate-700 dark:text-slate-300">
                <span className="w-2 h-2 rounded-full bg-sky-500 animate-pulse" />
                <span className="font-semibold tracking-wide">TrustGraph AI • 3D Immersive Supply Chain Knowledge Graph</span>
              </div>
              <div className="flex flex-wrap items-center justify-center gap-4 sm:gap-8 text-[11px] text-slate-500 dark:text-slate-400 uppercase tracking-wider">
                <span className="flex items-center gap-1.5">
                  <span className="text-sky-500 dark:text-[#38BDF8]">[01]</span> SYSTEM STATUS: <strong className="text-emerald-500 dark:text-emerald-400">OPERATIONAL</strong>
                </span>
                <span className="flex items-center gap-1.5">
                  <span className="text-sky-500 dark:text-[#38BDF8]">[02]</span> LATENCY: <strong className="text-slate-800 dark:text-white">12MS</strong>
                </span>
                <span className="flex items-center gap-1.5">
                  <span className="text-sky-500 dark:text-[#38BDF8]">[03]</span> SECURITY: <strong className="text-sky-600 dark:text-sky-300">ENCRYPTED_TLS_1.3</strong>
                </span>
              </div>
            </div>
          </footer>
        </AuroraBackground>
      )}

      {/* Floating Round AI Agent Button in Bottom-Right Corner (Present on both Landing Page and Hero/Workspace) */}
      <FloatingAIAgentButton
        onClick={() => setIsCopilotOpen(prev => !prev)}
        isOpen={isCopilotOpen}
      />

      {/* Shared Modals and Drawers (accessible from both Landing & Workspace) */}

      {/* User Profile Settings Modal */}
      <UserProfileModal
        isOpen={isProfileOpen}
        onClose={() => setIsProfileOpen(false)}
        user={user}
        onUpdateProfile={handleUpdateProfile}
      />

      {/* Supplier Forensic Detail Drawer */}
      <SupplierDetailDrawer
        supplier={selectedSupplier}
        onClose={() => setSelectedSupplier(null)}
        onSimulateCascade={(s) => {
          setSelectedSupplier(null);
          handleOpenCascadeModal(s);
        }}
      />

      {/* CSV Public MSME Ingestion Modal */}
      <CsvIngestionModal
        isOpen={isCsvModalOpen}
        onClose={() => setIsCsvModalOpen(false)}
        onImportSuccess={(count) => {
          fetchInitialData();
          setIsCsvModalOpen(false);
          showToast(`Successfully imported and validated ${count} MSME entities`, "success");
        }}
      />

      {/* 3D Contagion Cascade Stress Test Simulator Modal */}
      {isCascadeModalOpen && (
        <CascadeSimulatorModal
          supplier={cascadeTargetSupplier}
          allSuppliers={suppliers}
          onClose={() => setIsCascadeModalOpen(false)}
          onApplyShockTo3D={(result) => {
            handleApplyShockTo3D(result);
            setIsCascadeModalOpen(false);
          }}
        />
      )}

      {/* Add / Edit Supplier Modal */}
      <SupplierModal
        supplier={editingSupplier}
        isOpen={isAddEditOpen}
        onClose={() => setIsAddEditOpen(false)}
        onSave={handleSaveSupplier}
      />

      {/* AI Supply Chain Copilot Drawer with Translucent Glassmorphism */}
      <AICopilotDrawer
        isOpen={isCopilotOpen}
        onClose={() => setIsCopilotOpen(false)}
        onRunCascadeForSupplier={(id) => {
          const s = suppliers.find(item => item.id === id);
          if (s) handleOpenCascadeModal(s);
        }}
      />

      {/* Operator Login Modal */}
      <LoginModal
        isOpen={isLoginOpen}
        onClose={() => setIsLoginOpen(false)}
        onLoginSuccess={(loggedUser) => {
          setUser(loggedUser);
          showToast(`Welcome back, ${loggedUser.name}`, "success");
        }}
      />
    </div>
  );
}
