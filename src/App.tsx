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
import { StickyMobileCTA } from "./components/StickyMobileCTA";
import { CookieBanner } from "./components/CookieBanner";
import { PrivacyPolicyModal } from "./components/PrivacyPolicyModal";
import { TermsPageModal } from "./components/TermsPageModal";
import { ContactModal } from "./components/ContactModal";
import { ThankYouModal } from "./components/ThankYouModal";
import { NotFoundPage } from "./components/NotFoundPage";
import { sound } from "./utils/audio";
import { updatePageSEO } from "./utils/seo";
import { analytics } from "./utils/analytics";
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
  // Navigation & Page State
  const [pageMode, setPageMode] = useState<"LANDING" | "WORKSPACE" | "LOGIN" | "404">("LANDING");
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

  // Compliance, Legal & Auxiliary Modals
  const [isPrivacyOpen, setIsPrivacyOpen] = useState(false);
  const [isTermsOpen, setIsTermsOpen] = useState(false);
  const [isContactOpen, setIsContactOpen] = useState(false);
  const [isThankYouOpen, setIsThankYouOpen] = useState(false);
  const [thankYouInfo, setThankYouInfo] = useState<{ title?: string; message?: string; referenceId?: string }>({});

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

  // Sync Dynamic SEO and Telemetry on page and view changes
  useEffect(() => {
    if (pageMode === "404") {
      updatePageSEO("404");
      analytics.pageView("404_Page_Not_Found");
    } else if (pageMode === "LANDING") {
      updatePageSEO("landing");
      analytics.pageView("Landing_Page");
    } else if (pageMode === "LOGIN") {
      updatePageSEO("login");
      analytics.pageView("Login_Screen");
    } else {
      updatePageSEO(viewMode);
      analytics.pageView(`Workspace_${viewMode}`);
    }
  }, [pageMode, viewMode]);

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
    analytics.track("Enter_Workspace", { initialView: initialView || "3D_SPACE" });
  };

  const handleSelectNode = (key: string) => {
    setSelectedNodeKey(key);
    const found = suppliers.find(s => s.id === key || s.name.toLowerCase() === key.toLowerCase());
    if (found) {
      setSelectedSupplier(found);
    }
  };

  const handleOpenCascadeModal = (supplier: Supplier) => {
    setCascadeTargetSupplier(supplier);
    setIsCascadeModalOpen(true);
    analytics.track("Open_Cascade_Simulator", { supplierId: supplier.id, supplierName: supplier.name });
  };

  const handleApplyShockTo3D = (result: CascadeShockResult) => {
    setActiveCascadeResult(result);
    const affectedCount = (result.directImpactedNodeIds?.length || 0) + (result.secondaryImpactedNodeIds?.length || 0);
    showToast(`Cascade Shockwave Applied: ${affectedCount} vendors impacted`, "error");
    analytics.track("Apply_Cascade_Shockwave", { 
      originSupplier: result.originSupplier?.name,
      shockType: result.shockType,
      affectedCount,
      monetaryExposureINR: result.monetaryExposureINR 
    });
  };

  const handleSaveSupplier = async (supplierData: Partial<Supplier>) => {
    try {
      if (supplierData.id && suppliers.some(s => s.id === supplierData.id)) {
        // Update existing
        const res = await fetch(`/api/suppliers/${supplierData.id}`, {
          method: "PUT",
          headers: { "Content-Type": "application/json" },
          body: JSON.stringify(supplierData)
        });
        if (!res.ok) throw new Error("Failed to update");
        const updated = await res.json();
        setSuppliers(prev => prev.map(s => s.id === updated.id ? updated : s));
        showToast(`MSME "${updated.name}" updated successfully`, "success");
      } else {
        // Create new
        const res = await fetch("/api/suppliers", {
          method: "POST",
          headers: { "Content-Type": "application/json" },
          body: JSON.stringify(supplierData)
        });
        if (!res.ok) throw new Error("Failed to create");
        const created = await res.json();
        setSuppliers(prev => [created, ...prev]);
        showToast(`MSME "${created.name}" added to knowledge graph`, "success");
      }
      setIsAddEditOpen(false);

      // Refresh network topology
      fetch("/api/network")
        .then(r => r.json())
        .then(data => setNetworkData(data))
        .catch(() => {});
    } catch (e) {
      showToast("Error saving MSME supplier data", "error");
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
    setPageMode("LANDING");
    showToast("Signed out. Returned to Landing page.", "info");
    analytics.track("User_Logout");
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

      {/* Conditional Rendering: Custom 404 vs Landing Page vs Login Panel vs Workspace */}
      {pageMode === "404" ? (
        <NotFoundPage
          onReturnHome={() => setPageMode("LANDING")}
          onEnterWorkspace={() => handleEnterWorkspace("3D_SPACE")}
          onOpenCopilot={() => setIsCopilotOpen(true)}
        />
      ) : pageMode === "LANDING" ? (
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
          onOpenPrivacy={() => setIsPrivacyOpen(true)}
          onOpenTerms={() => setIsTermsOpen(true)}
          onOpenContact={() => setIsContactOpen(true)}
          onTest404={() => setPageMode("404")}
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
            onOpenPrivacy={() => setIsPrivacyOpen(true)}
            onOpenTerms={() => setIsTermsOpen(true)}
            onOpenContact={() => setIsContactOpen(true)}
            onTest404={() => setPageMode("404")}
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
              <div className="flex flex-wrap items-center justify-center gap-4 sm:gap-6 text-[11px] text-slate-500 dark:text-slate-400 uppercase tracking-wider">
                <button onClick={() => setIsPrivacyOpen(true)} className="hover:text-sky-400 cursor-pointer">Privacy</button>
                <button onClick={() => setIsTermsOpen(true)} className="hover:text-sky-400 cursor-pointer">Terms</button>
                <button onClick={() => setIsContactOpen(true)} className="hover:text-sky-400 cursor-pointer">Contact HQ</button>
                <button onClick={() => setPageMode("404")} className="hover:text-amber-400 cursor-pointer">404 Test</button>
              </div>
            </div>
          </footer>
        </AuroraBackground>
      )}

      {/* Floating Round AI Agent Button in Bottom-Right Corner */}
      <FloatingAIAgentButton
        onClick={() => setIsCopilotOpen(prev => !prev)}
        isOpen={isCopilotOpen}
      />

      {/* Sticky Mobile Quick-Action Navigation Bar */}
      <StickyMobileCTA
        onEnterWorkspace={() => handleEnterWorkspace("3D_SPACE")}
        onOpenCopilot={() => setIsCopilotOpen(true)}
        onOpenAddSupplier={() => {
          setEditingSupplier(null);
          setIsAddEditOpen(true);
        }}
        onOpenCsvModal={() => setIsCsvModalOpen(true)}
        currentMode={pageMode === "WORKSPACE" ? viewMode : pageMode}
      />

      {/* Cookie Consent Banner */}
      <CookieBanner onOpenPrivacy={() => setIsPrivacyOpen(true)} />

      {/* Shared Modals and Drawers */}

      {/* User Profile Settings Modal with Logout Action */}
      <UserProfileModal
        isOpen={isProfileOpen}
        onClose={() => setIsProfileOpen(false)}
        user={user}
        onUpdateUser={handleUpdateProfile}
        onLogout={handleLogout}
      />

      {/* Privacy Policy Modal */}
      <PrivacyPolicyModal
        isOpen={isPrivacyOpen}
        onClose={() => setIsPrivacyOpen(false)}
      />

      {/* Terms of Service Modal */}
      <TermsPageModal
        isOpen={isTermsOpen}
        onClose={() => setIsTermsOpen(false)}
        onOpenPrivacy={() => {
          setIsTermsOpen(false);
          setIsPrivacyOpen(true);
        }}
      />

      {/* Contact HQ Modal */}
      <ContactModal
        isOpen={isContactOpen}
        onClose={() => setIsContactOpen(false)}
        onSubmitSuccess={(data) => {
          setThankYouInfo({
            title: "Transmission Received",
            message: `Thank you, ${data.name}. Your inquiry regarding "${data.subject}" has been routed to our Supply Chain Risk Architecture team at T-Hub Phase 2, Hyderabad.`,
            referenceId: `TG-${Date.now().toString().slice(-6)}`
          });
          setIsThankYouOpen(true);
        }}
      />

      {/* Thank You Confirmation Modal */}
      <ThankYouModal
        isOpen={isThankYouOpen}
        onClose={() => setIsThankYouOpen(false)}
        title={thankYouInfo.title}
        message={thankYouInfo.message}
        referenceId={thankYouInfo.referenceId}
        onExploreGraph={() => {
          setIsThankYouOpen(false);
          handleEnterWorkspace("3D_SPACE");
        }}
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
          setThankYouInfo({
            title: "Dataset Ingestion Complete",
            message: `Successfully validated and integrated ${count} MSME records from public registries into the active 3D knowledge graph with statutory GSTIN tags.`,
            referenceId: `UDYAM-${Date.now().toString().slice(-6)}`
          });
          setIsThankYouOpen(true);
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
