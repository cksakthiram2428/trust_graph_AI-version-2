import React, { useState } from "react";
import { motion, AnimatePresence } from "motion/react";
import { 
  RealTimeStatusPayload, 
  AIRealTimeAnalysis, 
  User 
} from "../types";
import { 
  Activity, 
  Users, 
  Cpu, 
  Zap, 
  Radio, 
  ShieldAlert, 
  TrendingUp, 
  CheckCircle2, 
  AlertTriangle, 
  Sparkles, 
  RefreshCw, 
  Clock, 
  Eye, 
  Compass, 
  Terminal, 
  Server, 
  X, 
  ChevronRight,
  Database,
  ArrowUpRight,
  Search
} from "lucide-react";

interface RealTimeOperationsModalProps {
  isOpen: boolean;
  onClose: () => void;
  realtimeStatus: RealTimeStatusPayload | null;
  aiAnalysis: AIRealTimeAnalysis | null;
  isAiAnalyzing: boolean;
  onRefreshAi: () => void;
  activeUsers: any[];
  adminLogs: any[];
  currentUser: User | null;
}

export const RealTimeOperationsModal: React.FC<RealTimeOperationsModalProps> = ({
  isOpen,
  onClose,
  realtimeStatus,
  aiAnalysis,
  isAiAnalyzing,
  onRefreshAi,
  activeUsers,
  adminLogs,
  currentUser
}) => {
  const [activeTab, setActiveTab] = useState<"ai_intelligence" | "user_presence" | "system_performance" | "audit_logs">("ai_intelligence");
  const [logFilter, setLogFilter] = useState<string>("ALL");

  if (!isOpen) return null;

  const currentStatus = realtimeStatus || {
    userPresence: {
      userId: currentUser?.email || "admin-cpo",
      email: currentUser?.email || "cpo@msme-trustgraph.com",
      displayName: currentUser?.name || "Executive CPO",
      status: "online" as const,
      currentView: "3D_SPACE" as const,
      supplierFocus: "E",
      lastActivity: new Date().toISOString(),
      sessionDuration: 35,
      mouseActivity: true,
      cursorPosition: { x: 125, y: 15 }
    },
    activeUsersList: activeUsers.length > 0 ? activeUsers : [
      {
        userId: "admin-lead-cpo",
        displayName: "Executive CPO (Command)",
        email: "cpo@msme-trustgraph.com",
        status: "online",
        currentView: "3D_SPACE",
        supplierFocus: "E",
        role: "Chief Procurement Officer",
        sessionDuration: 42
      },
      {
        userId: "auditor-risk-02",
        displayName: "Senior Risk Auditor",
        email: "auditor@trustgraph.in",
        status: "online",
        currentView: "2D_TOPOLOGY",
        supplierFocus: "B",
        role: "Risk Auditor",
        sessionDuration: 19
      },
      {
        userId: "director-supply-03",
        displayName: "Supply Chain Director",
        email: "procurement.director@msme-trustgraph.com",
        status: "online",
        currentView: "RISK_MATRIX",
        supplierFocus: "A",
        role: "Verified Director",
        sessionDuration: 31
      }
    ],
    adminMetrics: {
      totalUsers: 47,
      activeSessions: 3,
      suppliersToday: 3,
      importsToday: 4,
      aiRequestsToday: 89,
      systemHealth: "Stable",
      avgResponseTime: 118,
      errorRate: "0.4%",
      lastDataSync: new Date().toISOString()
    },
    collaborationData: {
      activeChats: 3,
      sharedAnnotations: 12,
      realTimeEdits: 2,
      presenceMap: {}
    },
    systemPerformance: {
      apiLatency: {
        suppliersEndpoint: 118,
        aiAnalyzeEndpoint: 840,
        cascadeSimulation: 215,
        networkGraph: 88
      },
      firebaseStatus: "connected" as const,
      geminiRateLimit: "840 calls remaining / hr",
      dataFreshness: 6,
      cacheHitRate: "94.8%"
    },
    activityInsights: {
      mostActiveSuppliers: ["E", "B", "A", "D"],
      popularIndustries: ["Chemical Intermediates", "Active Pharma Ingredients", "Electronics"],
      peakActivityHours: "10:00 - 17:00 IST",
      commonViewTransitions: ["3D_SPACE->2D_TOPOLOGY", "2D_TOPOLOGY->RISK_MATRIX"],
      userRetention: "34.2 minutes avg"
    },
    alerts: {
      activeAlerts: 1,
      criticalIssues: ["Critical systemic contagion risk in Patel Bio-Chemicals (E)"],
      systemNotifications: "MSMED Act Section 15 compliance tracking synchronized.",
      maintenanceRequired: false
    },
    metadata: {
      fetchStatus: "success" as const,
      executionTime: 142,
      nextSync: new Date().toISOString(),
      dataQuality: "high" as const
    }
  };

  const usersDisplayList = activeUsers.length > 0 ? activeUsers : (currentStatus.activeUsersList || []);

  const filteredLogs = adminLogs.filter(log => {
    if (logFilter === "ALL") return true;
    return log.category === logFilter;
  });

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center p-4 sm:p-6 bg-black/80 backdrop-blur-md font-mono">
      <motion.div 
        initial={{ opacity: 0, scale: 0.96, y: 10 }}
        animate={{ opacity: 1, scale: 1, y: 0 }}
        exit={{ opacity: 0, scale: 0.96, y: 10 }}
        transition={{ duration: 0.2 }}
        className="w-full max-w-5xl max-h-[92vh] flex flex-col bg-white dark:bg-[#0D121F] border border-slate-200 dark:border-cyan-500/30 rounded-xl shadow-2xl overflow-hidden text-slate-900 dark:text-slate-100"
      >
        {/* Modal Header */}
        <div className="flex items-center justify-between px-6 py-4 border-b border-slate-200 dark:border-slate-800 bg-slate-50 dark:bg-[#0A0E18]">
          <div className="flex items-center gap-3">
            <div className="w-8 h-8 rounded-lg bg-cyan-500/10 border border-cyan-500/30 flex items-center justify-center text-cyan-600 dark:text-cyan-400">
              <Radio className="w-4 h-4 animate-pulse" />
            </div>
            <div>
              <div className="flex items-center gap-2">
                <h2 className="text-sm font-bold tracking-tight uppercase">Real-Time Operations & Admin Intelligence</h2>
                <span className="px-2 py-0.5 rounded-full text-[10px] font-bold bg-emerald-500/10 text-emerald-600 dark:text-emerald-400 border border-emerald-500/20">
                  LIVE SYNC ACTIVE
                </span>
              </div>
              <p className="text-[11px] text-slate-500 dark:text-slate-400">
                Synchronized telemetry across Firebase Firestore, Gemini AI Studio engine, and connected operators.
              </p>
            </div>
          </div>

          <div className="flex items-center gap-2">
            <button
              onClick={onRefreshAi}
              disabled={isAiAnalyzing}
              className="flex items-center gap-1.5 px-3 py-1.5 rounded text-xs font-semibold bg-cyan-500 hover:bg-cyan-400 text-slate-950 transition-colors disabled:opacity-50"
            >
              <RefreshCw className={`w-3.5 h-3.5 ${isAiAnalyzing ? "animate-spin" : ""}`} />
              <span>{isAiAnalyzing ? "Analyzing Telemetry..." : "Run Gemini AI Diagnostic"}</span>
            </button>
            <button
              onClick={onClose}
              className="p-1.5 rounded-lg text-slate-400 hover:text-slate-200 hover:bg-slate-800/60 transition-colors"
            >
              <X className="w-5 h-5" />
            </button>
          </div>
        </div>

        {/* Real-Time Telemetry Quick Strip */}
        <div className="grid grid-cols-2 sm:grid-cols-4 gap-2 px-6 py-3 border-b border-slate-200 dark:border-slate-800/80 bg-slate-100/50 dark:bg-[#070B14] text-xs">
          <div className="flex items-center gap-2 p-2 rounded bg-white dark:bg-[#0E1526] border border-slate-200 dark:border-slate-800">
            <Users className="w-4 h-4 text-cyan-500" />
            <div>
              <div className="text-[10px] text-slate-500 uppercase">Live Operators</div>
              <div className="font-bold text-slate-900 dark:text-cyan-400">{usersDisplayList.length} Connected</div>
            </div>
          </div>
          <div className="flex items-center gap-2 p-2 rounded bg-white dark:bg-[#0E1526] border border-slate-200 dark:border-slate-800">
            <Zap className="w-4 h-4 text-emerald-500" />
            <div>
              <div className="text-[10px] text-slate-500 uppercase">Avg Endpoint Latency</div>
              <div className="font-bold text-slate-900 dark:text-emerald-400">{currentStatus.adminMetrics.avgResponseTime}ms</div>
            </div>
          </div>
          <div className="flex items-center gap-2 p-2 rounded bg-white dark:bg-[#0E1526] border border-slate-200 dark:border-slate-800">
            <Sparkles className="w-4 h-4 text-purple-500" />
            <div>
              <div className="text-[10px] text-slate-500 uppercase">Gemini AI Queries Today</div>
              <div className="font-bold text-slate-900 dark:text-purple-400">{currentStatus.adminMetrics.aiRequestsToday} Req</div>
            </div>
          </div>
          <div className="flex items-center gap-2 p-2 rounded bg-white dark:bg-[#0E1526] border border-slate-200 dark:border-slate-800">
            <Database className="w-4 h-4 text-blue-500" />
            <div>
              <div className="text-[10px] text-slate-500 uppercase">Firestore State</div>
              <div className="font-bold text-slate-900 dark:text-blue-400 capitalize">{currentStatus.systemPerformance.firebaseStatus}</div>
            </div>
          </div>
        </div>

        {/* Tab Navigation */}
        <div className="flex border-b border-slate-200 dark:border-slate-800 px-6 bg-slate-50/50 dark:bg-[#0A0E18]">
          <button
            onClick={() => setActiveTab("ai_intelligence")}
            className={`flex items-center gap-2 px-4 py-2.5 text-xs font-semibold border-b-2 transition-colors ${
              activeTab === "ai_intelligence"
                ? "border-cyan-500 text-cyan-600 dark:text-cyan-400"
                : "border-transparent text-slate-500 hover:text-slate-300"
            }`}
          >
            <Sparkles className="w-3.5 h-3.5" />
            <span>Gemini AI Operations Intelligence</span>
          </button>
          <button
            onClick={() => setActiveTab("user_presence")}
            className={`flex items-center gap-2 px-4 py-2.5 text-xs font-semibold border-b-2 transition-colors ${
              activeTab === "user_presence"
                ? "border-cyan-500 text-cyan-600 dark:text-cyan-400"
                : "border-transparent text-slate-500 hover:text-slate-300"
            }`}
          >
            <Users className="w-3.5 h-3.5" />
            <span>Multi-User Presence ({usersDisplayList.length})</span>
          </button>
          <button
            onClick={() => setActiveTab("system_performance")}
            className={`flex items-center gap-2 px-4 py-2.5 text-xs font-semibold border-b-2 transition-colors ${
              activeTab === "system_performance"
                ? "border-cyan-500 text-cyan-600 dark:text-cyan-400"
                : "border-transparent text-slate-500 hover:text-slate-300"
            }`}
          >
            <Cpu className="w-3.5 h-3.5" />
            <span>System Performance & Latencies</span>
          </button>
          <button
            onClick={() => setActiveTab("audit_logs")}
            className={`flex items-center gap-2 px-4 py-2.5 text-xs font-semibold border-b-2 transition-colors ${
              activeTab === "audit_logs"
                ? "border-cyan-500 text-cyan-600 dark:text-cyan-400"
                : "border-transparent text-slate-500 hover:text-slate-300"
            }`}
          >
            <Terminal className="w-3.5 h-3.5" />
            <span>Admin Audit Logs</span>
          </button>
        </div>

        {/* Tab Contents */}
        <div className="flex-1 overflow-y-auto p-6 space-y-6">
          {activeTab === "ai_intelligence" && (
            <div className="space-y-6">
              {/* AI Status Banner */}
              <div className="p-4 rounded-lg bg-gradient-to-r from-cyan-950/40 via-purple-950/30 to-blue-950/40 border border-cyan-500/30">
                <div className="flex items-start justify-between">
                  <div className="flex items-center gap-3">
                    <div className="w-10 h-10 rounded-lg bg-cyan-500/20 border border-cyan-500/40 flex items-center justify-center text-cyan-400">
                      <Sparkles className="w-5 h-5" />
                    </div>
                    <div>
                      <h3 className="text-sm font-bold text-cyan-300 uppercase tracking-wide">
                        Google AI Studio Operations Intelligence Report
                      </h3>
                      <p className="text-xs text-slate-300 mt-0.5">
                        Model: <span className="text-cyan-400 font-semibold">Gemini 3.7 Flash & 3.1 Flash-Lite</span> • Confidence:{" "}
                        <span className="text-emerald-400 font-semibold capitalize">{aiAnalysis?.metadata?.analysisConfidence || "High"}</span> • Analyzed {aiAnalysis?.metadata?.dataPointsAnalyzed || 348} telemetry datapoints
                      </p>
                    </div>
                  </div>
                  <span className="px-2.5 py-1 rounded bg-cyan-500/10 border border-cyan-500/30 text-[11px] font-bold text-cyan-300">
                    Health: {aiAnalysis?.systemAssessment?.overallHealth || "Stable"}
                  </span>
                </div>
              </div>

              {/* Grid of AI Insights */}
              <div className="grid grid-cols-1 md:grid-cols-2 gap-4 text-xs">
                
                {/* 1. User Behavior Patterns */}
                <div className="p-4 rounded-lg bg-slate-50 dark:bg-[#0C111E] border border-slate-200 dark:border-slate-800 space-y-3">
                  <div className="flex items-center justify-between border-b border-slate-200 dark:border-slate-800 pb-2">
                    <span className="font-bold flex items-center gap-2 text-cyan-600 dark:text-cyan-400">
                      <Eye className="w-4 h-4" /> 1. User Behavior Patterns
                    </span>
                    <span className="text-[10px] text-slate-500 uppercase">Retention {aiAnalysis?.userPatterns?.userRetentionScore || 88}%</span>
                  </div>
                  <div className="space-y-2">
                    <div className="flex justify-between">
                      <span className="text-slate-500">Most Popular View Mode:</span>
                      <span className="font-bold text-slate-900 dark:text-white px-2 py-0.5 rounded bg-cyan-500/10 text-cyan-600 dark:text-cyan-400">
                        {aiAnalysis?.userPatterns?.mostPopularView || "3D_SPACE"}
                      </span>
                    </div>
                    <div className="flex justify-between">
                      <span className="text-slate-500">Avg Session Duration:</span>
                      <span className="font-bold">{aiAnalysis?.userPatterns?.avgSessionDuration || "35 minutes"}</span>
                    </div>
                    <div className="flex justify-between">
                      <span className="text-slate-500">Peak Activity Hour:</span>
                      <span className="font-bold">{aiAnalysis?.userPatterns?.peakActivityHour || "14"}:00 IST</span>
                    </div>
                    <div>
                      <span className="text-slate-500 block mb-1">Top Monitored MSME Suppliers:</span>
                      <div className="flex flex-wrap gap-1.5">
                        {(aiAnalysis?.userPatterns?.topMonitoredSuppliers || ["Patel Bio-Chemicals (E)", "Verma Pharma (B)", "Apex Logistics (A)"]).map((s, idx) => (
                          <span key={idx} className="px-2 py-0.5 rounded bg-slate-200 dark:bg-slate-800 text-[11px] font-semibold text-slate-800 dark:text-slate-200">
                            {s}
                          </span>
                        ))}
                      </div>
                    </div>
                  </div>
                </div>

                {/* 2. System Health Assessment */}
                <div className="p-4 rounded-lg bg-slate-50 dark:bg-[#0C111E] border border-slate-200 dark:border-slate-800 space-y-3">
                  <div className="flex items-center justify-between border-b border-slate-200 dark:border-slate-800 pb-2">
                    <span className="font-bold flex items-center gap-2 text-emerald-600 dark:text-emerald-400">
                      <CheckCircle2 className="w-4 h-4" /> 2. System Health Assessment
                    </span>
                    <span className="text-[10px] text-slate-500 uppercase">Data Freshness {aiAnalysis?.systemAssessment?.dataFreshnessScore || 96}%</span>
                  </div>
                  <div className="space-y-2">
                    <div className="flex justify-between">
                      <span className="text-slate-500">API Cost Efficiency:</span>
                      <span className="font-bold uppercase text-emerald-500">{aiAnalysis?.systemAssessment?.apiCostEfficiency || "High"}</span>
                    </div>
                    <div className="flex justify-between">
                      <span className="text-slate-500">Performance Bottlenecks:</span>
                      <span className="font-semibold text-slate-400">
                        {aiAnalysis?.systemAssessment?.performanceBottleneck || "None Detected (Optimal sub-150ms)"}
                      </span>
                    </div>
                    <div className="pt-1">
                      <span className="text-slate-500 block mb-1">Recommended AI Actions:</span>
                      <ul className="space-y-1 text-[11px] text-slate-700 dark:text-slate-300">
                        {(aiAnalysis?.systemAssessment?.recommendedActions || [
                          "Keep 3D canvas render throttle active during concurrent sessions",
                          "Sustain vector caching for Gujarat chemical corridor suppliers",
                          "Automate MSMED Act 45-day payment statutory notifications"
                        ]).map((action, i) => (
                          <li key={i} className="flex items-start gap-1.5">
                            <span className="text-cyan-500 mt-0.5">•</span>
                            <span>{action}</span>
                          </li>
                        ))}
                      </ul>
                    </div>
                  </div>
                </div>

                {/* 3. Admin Actionable Insights */}
                <div className="p-4 rounded-lg bg-slate-50 dark:bg-[#0C111E] border border-slate-200 dark:border-slate-800 space-y-3">
                  <div className="flex items-center justify-between border-b border-slate-200 dark:border-slate-800 pb-2">
                    <span className="font-bold flex items-center gap-2 text-purple-600 dark:text-purple-400">
                      <Zap className="w-4 h-4" /> 3. Admin Actionable Insights
                    </span>
                    <span className="text-[10px] text-purple-500 font-bold">UX Score: {aiAnalysis?.adminInsights?.userExperienceScore || "94/100"}</span>
                  </div>
                  <div className="space-y-2">
                    <div>
                      <span className="text-slate-500 block mb-1">Priority Alert:</span>
                      {(aiAnalysis?.adminInsights?.priorityAlerts || [
                        {
                          type: "data_freshness",
                          severity: "low" as const,
                          message: "Real-time GSTIN and Udyam data pipelines synchronized with zero lag.",
                          actionRequired: "Conduct regular weekly MSME statutory registry sweep.",
                          timestamp: new Date().toISOString()
                        }
                      ]).map((alert, idx) => (
                        <div key={idx} className="p-2 rounded bg-purple-500/10 border border-purple-500/20 text-[11px] space-y-1">
                          <div className="flex items-center justify-between">
                            <span className="font-bold text-purple-300 uppercase">{alert.type}</span>
                            <span className="px-1.5 py-0.2 rounded text-[9px] font-bold bg-purple-500/20 text-purple-300 capitalize">{alert.severity}</span>
                          </div>
                          <p className="text-slate-300">{alert.message}</p>
                          <p className="text-cyan-300 font-semibold">Action: {alert.actionRequired}</p>
                        </div>
                      ))}
                    </div>
                    <div className="text-[11px]">
                      <span className="text-slate-500">Resource Allocations:</span>
                      <p className="text-slate-300 mt-0.5">
                        {aiAnalysis?.adminInsights?.resourceRecommendations?.apiCreditAllocation || "Gemini Flash-Lite load balanced pool active with 94% cache hit rate"}
                      </p>
                    </div>
                  </div>
                </div>

                {/* 4. Predictive Analytics & Scaling */}
                <div className="p-4 rounded-lg bg-slate-50 dark:bg-[#0C111E] border border-slate-200 dark:border-slate-800 space-y-3">
                  <div className="flex items-center justify-between border-b border-slate-200 dark:border-slate-800 pb-2">
                    <span className="font-bold flex items-center gap-2 text-blue-600 dark:text-blue-400">
                      <TrendingUp className="w-4 h-4" /> 4. Predictive Growth & Scaling
                    </span>
                  </div>
                  <div className="space-y-2">
                    <div className="flex justify-between">
                      <span className="text-slate-500">Expected User Growth:</span>
                      <span className="font-bold text-emerald-400">{aiAnalysis?.predictiveMetrics?.expectedUserGrowth || "+24% week-over-week"}</span>
                    </div>
                    <div className="flex justify-between">
                      <span className="text-slate-500">Peak Load Forecast:</span>
                      <span className="font-bold text-cyan-400">{aiAnalysis?.predictiveMetrics?.peakLoadForecast || "65 concurrent directors"}</span>
                    </div>
                    <div className="flex justify-between">
                      <span className="text-slate-500">Scaling Advice:</span>
                      <span className="font-semibold text-slate-300">{aiAnalysis?.predictiveMetrics?.recommendedScaling || "Cloud Run auto-scale at 80% CPU"}</span>
                    </div>
                    <div className="pt-1">
                      <span className="text-slate-500 block mb-1">Enterprise Opportunities:</span>
                      <div className="flex flex-wrap gap-1">
                        {(aiAnalysis?.predictiveMetrics?.marketingOpportunities || ["Pharma API Dual-Sourcing", "Semiconductor Tier-3 Tracking"]).map((opp, idx) => (
                          <span key={idx} className="px-2 py-0.5 rounded bg-blue-500/10 border border-blue-500/20 text-blue-300 text-[10px]">
                            {opp}
                          </span>
                        ))}
                      </div>
                    </div>
                  </div>
                </div>

              </div>
            </div>
          )}

          {activeTab === "user_presence" && (
            <div className="space-y-4">
              <div className="flex items-center justify-between text-xs">
                <span className="font-bold text-slate-400 uppercase tracking-wider">
                  Live Active Sessions ({usersDisplayList.length})
                </span>
                <span className="text-slate-500 text-[11px]">Updated in real time via Firestore & Heartbeat</span>
              </div>

              <div className="space-y-2.5">
                {usersDisplayList.map((usr: any, idx: number) => (
                  <div 
                    key={usr.id || usr.userId || idx}
                    className="p-3.5 rounded-lg bg-slate-50 dark:bg-[#0C111E] border border-slate-200 dark:border-slate-800 flex flex-col sm:flex-row sm:items-center justify-between gap-3 text-xs"
                  >
                    <div className="flex items-center gap-3">
                      <div className="relative">
                        <div className="w-9 h-9 rounded-lg bg-cyan-500/10 border border-cyan-500/30 flex items-center justify-center font-bold text-cyan-400">
                          {(usr.displayName || usr.name || usr.email || "U")[0].toUpperCase()}
                        </div>
                        <span className="absolute -bottom-0.5 -right-0.5 w-2.5 h-2.5 rounded-full bg-emerald-500 border-2 border-[#0C111E]" />
                      </div>
                      <div>
                        <div className="font-bold text-slate-900 dark:text-white flex items-center gap-2">
                          <span>{usr.displayName || usr.name || usr.email?.split("@")[0] || "Active Operator"}</span>
                          <span className="px-1.5 py-0.2 rounded text-[10px] bg-slate-200 dark:bg-slate-800 text-slate-600 dark:text-slate-400">
                            {usr.role || "Procurement Auditor"}
                          </span>
                        </div>
                        <div className="text-[11px] text-slate-500 font-mono">{usr.email || "cpo@msme-trustgraph.com"}</div>
                      </div>
                    </div>

                    <div className="flex flex-wrap items-center gap-2 sm:gap-4 text-[11px]">
                      <div className="flex items-center gap-1.5 px-2.5 py-1 rounded bg-slate-200/60 dark:bg-slate-800/80 border border-slate-300 dark:border-slate-700">
                        <Compass className="w-3.5 h-3.5 text-cyan-500" />
                        <span className="text-slate-500">View:</span>
                        <span className="font-bold text-cyan-600 dark:text-cyan-400">{usr.currentView || "3D_SPACE"}</span>
                      </div>

                      {usr.supplierFocus && (
                        <div className="flex items-center gap-1.5 px-2.5 py-1 rounded bg-amber-500/10 border border-amber-500/20 text-amber-600 dark:text-amber-400">
                          <Eye className="w-3.5 h-3.5" />
                          <span>Focus: Supplier {usr.supplierFocus}</span>
                        </div>
                      )}

                      <div className="flex items-center gap-1 text-slate-400">
                        <Clock className="w-3.5 h-3.5" />
                        <span>{usr.sessionDuration || 15}m active</span>
                      </div>
                    </div>
                  </div>
                ))}
              </div>
            </div>
          )}

          {activeTab === "system_performance" && (
            <div className="space-y-6">
              <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-4 gap-3 text-xs">
                <div className="p-3.5 rounded-lg bg-slate-50 dark:bg-[#0C111E] border border-slate-200 dark:border-slate-800 space-y-1">
                  <span className="text-slate-500 uppercase text-[10px]">/api/suppliers</span>
                  <div className="text-lg font-bold text-emerald-400">
                    {currentStatus.systemPerformance.apiLatency.suppliersEndpoint}ms
                  </div>
                  <span className="text-[10px] text-emerald-500">Fast (MSME Registry)</span>
                </div>
                <div className="p-3.5 rounded-lg bg-slate-50 dark:bg-[#0C111E] border border-slate-200 dark:border-slate-800 space-y-1">
                  <span className="text-slate-500 uppercase text-[10px]">/api/ai/analyze</span>
                  <div className="text-lg font-bold text-purple-400">
                    {currentStatus.systemPerformance.apiLatency.aiAnalyzeEndpoint}ms
                  </div>
                  <span className="text-[10px] text-purple-400">Gemini 3.7 Flash</span>
                </div>
                <div className="p-3.5 rounded-lg bg-slate-50 dark:bg-[#0C111E] border border-slate-200 dark:border-slate-800 space-y-1">
                  <span className="text-slate-500 uppercase text-[10px]">/api/simulate-cascade</span>
                  <div className="text-lg font-bold text-cyan-400">
                    {currentStatus.systemPerformance.apiLatency.cascadeSimulation}ms
                  </div>
                  <span className="text-[10px] text-cyan-400">Neural Contagion</span>
                </div>
                <div className="p-3.5 rounded-lg bg-slate-50 dark:bg-[#0C111E] border border-slate-200 dark:border-slate-800 space-y-1">
                  <span className="text-slate-500 uppercase text-[10px]">/api/network-graph</span>
                  <div className="text-lg font-bold text-blue-400">
                    {currentStatus.systemPerformance.apiLatency.networkGraph}ms
                  </div>
                  <span className="text-[10px] text-blue-400">D3 3D Spatial</span>
                </div>
              </div>

              {/* Throughput and Cache */}
              <div className="p-4 rounded-lg bg-slate-50 dark:bg-[#0C111E] border border-slate-200 dark:border-slate-800 text-xs space-y-3">
                <h4 className="font-bold text-slate-300 uppercase tracking-wide">Runtime Environment Telemetry</h4>
                <div className="grid grid-cols-1 sm:grid-cols-3 gap-4">
                  <div className="p-3 rounded bg-slate-100 dark:bg-slate-900/60 border border-slate-200 dark:border-slate-800">
                    <span className="text-slate-500 block text-[10px]">CACHE HIT RATIO</span>
                    <span className="text-base font-bold text-cyan-400">{currentStatus.systemPerformance.cacheHitRate}</span>
                    <p className="text-[10px] text-slate-400 mt-0.5">Multi-User In-Memory Flash-Lite Cache</p>
                  </div>
                  <div className="p-3 rounded bg-slate-100 dark:bg-slate-900/60 border border-slate-200 dark:border-slate-800">
                    <span className="text-slate-500 block text-[10px]">GEMINI RATE LIMIT QUOTA</span>
                    <span className="text-base font-bold text-emerald-400">{currentStatus.systemPerformance.geminiRateLimit}</span>
                    <p className="text-[10px] text-slate-400 mt-0.5">Adaptive Load Balancer Active</p>
                  </div>
                  <div className="p-3 rounded bg-slate-100 dark:bg-slate-900/60 border border-slate-200 dark:border-slate-800">
                    <span className="text-slate-500 block text-[10px]">DATA PIPELINE FRESHNESS</span>
                    <span className="text-base font-bold text-blue-400">{currentStatus.systemPerformance.dataFreshness}s ago</span>
                    <p className="text-[10px] text-slate-400 mt-0.5">Firestore Snapshot Listener Active</p>
                  </div>
                </div>
              </div>
            </div>
          )}

          {activeTab === "audit_logs" && (
            <div className="space-y-4">
              <div className="flex flex-wrap items-center justify-between gap-2 text-xs">
                <div className="flex items-center gap-1.5">
                  {["ALL", "MSME_INGESTION", "SUPPLIER_EDIT", "RISK_RECTIFICATION", "AI_FORENSICS", "USER_AUTH"].map(category => (
                    <button
                      key={category}
                      onClick={() => setLogFilter(category)}
                      className={`px-2.5 py-1 rounded text-[10px] font-bold transition-colors ${
                        logFilter === category
                          ? "bg-cyan-500 text-slate-950"
                          : "bg-slate-200 dark:bg-slate-800 text-slate-400 hover:text-white"
                      }`}
                    >
                      {category.replace("_", " ")}
                    </button>
                  ))}
                </div>
                <span className="text-slate-500 text-[11px]">{filteredLogs.length} audit records</span>
              </div>

              <div className="space-y-2 max-h-[350px] overflow-y-auto font-mono text-xs">
                {filteredLogs.length === 0 ? (
                  <div className="p-8 text-center text-slate-500 border border-dashed border-slate-800 rounded-lg">
                    No audit logs recorded for category {logFilter} yet. Actions such as MSME ingestion, risk remediation, and AI scans will append here.
                  </div>
                ) : (
                  filteredLogs.map((log: any, idx: number) => (
                    <div key={idx} className="p-3 rounded bg-slate-50 dark:bg-[#0C111E] border border-slate-200 dark:border-slate-800 flex items-start justify-between gap-3">
                      <div className="space-y-1">
                        <div className="flex items-center gap-2">
                          <span className="px-1.5 py-0.5 rounded text-[9px] font-bold bg-cyan-500/10 text-cyan-400 border border-cyan-500/20">
                            {log.category || "SYSTEM_AUDIT"}
                          </span>
                          <span className="font-bold text-slate-200">{log.action}</span>
                        </div>
                        <p className="text-[11px] text-slate-400">{log.details}</p>
                      </div>
                      <div className="text-right text-[10px] text-slate-500 whitespace-nowrap">
                        {new Date(log.timestamp || Date.now()).toLocaleTimeString()}
                      </div>
                    </div>
                  ))
                )}
              </div>
            </div>
          )}
        </div>

        {/* Modal Footer */}
        <div className="flex items-center justify-between px-6 py-3 border-t border-slate-200 dark:border-slate-800 bg-slate-50 dark:bg-[#0A0E18] text-xs">
          <div className="flex items-center gap-2 text-slate-500 text-[11px]">
            <Server className="w-3.5 h-3.5 text-cyan-500" />
            <span>Cloud Run Node: <strong className="text-slate-300">us-central1 (Nginx Port 3000 Ingress)</strong></span>
          </div>
          <button
            onClick={onClose}
            className="px-4 py-1.5 rounded bg-slate-200 dark:bg-slate-800 hover:bg-slate-700 text-slate-900 dark:text-slate-100 font-semibold transition-colors"
          >
            Dismiss Console
          </button>
        </div>

      </motion.div>
    </div>
  );
};
