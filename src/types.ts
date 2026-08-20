export interface Supplier {
  id: string;
  name: string;
  industry: string;
  tier: "Tier-1 Direct" | "Tier-2 Sub-assembly" | "Tier-3 Raw Material";
  score: number;
  risk: "Very Low Risk" | "Low Risk" | "Medium Risk" | "High Risk" | "Critical Risk";
  riskIcon: string;
  riskColor: string; // emerald, green, yellow, orange, red
  insight: string;
  paymentDelay: string;
  deliveryReliability: string;
  qualityRate: string;
  complaintCount: number;
  criticality: "High" | "Medium" | "Low";
  leadTimeDays: number;
  monthlyVolumeINR: string;
  city: string;
  gstin: string;
  dependencies: string[];
  dataSource?: "real_registration" | "simulated_metrics";
  udyamNumber?: string;
  enterpriseCategory?: "Micro" | "Small" | "Medium";
  nicCode?: string;
  mcaCin?: string;
  incorporationDate?: string;
  realTimeData?: {
    weather?: {
      temp: number;
      condition: string;
      impact: string;
      fetchedAt: string;
    };
    news?: {
      headline: string;
      risk: string;
      publishedAt: string;
    }[];
    economicImpact?: string;
    lastRefresh?: string;
    scoreAdjustment?: number;
    alertType?: "low" | "medium" | "high" | "critical";
    intelligenceDrawer?: {
      weatherImpact: string;
      newsRisk: string;
      macroOutlook: string;
      regulatoryStatus: string;
    };
    cascadeNarrative?: string;
    priorityActions?: string[];
  };
}

export interface NetworkNode {
  id: number;
  key: string;
  label: string;
  role: string;
  tier: string;
  x: number;
  y: number;
  z: number;
  score: number;
  size: number;
  risk: string;
  color: string;
}

export interface NetworkEdge {
  fromId: number;
  toId: number;
  flow: string;
  weight: number;
  status: "healthy" | "warning" | "critical";
}

export interface NetworkData {
  nodes: NetworkNode[];
  edges: NetworkEdge[];
}

export interface PlatformStat {
  label: string;
  value: string;
  change: string;
  icon: string;
}

export interface StatsResponse {
  stats: PlatformStat[];
  summary: {
    totalSuppliers: number;
    averageTrustScore: number;
    highRiskCount: number;
    tier1Count: number;
    systemHealth: string;
    lastRealtimeRefresh?: string;
  };
}

export interface CascadeShockResult {
  originSupplier: Supplier;
  shockType: string;
  originNodeId: number;
  directImpactedNodeIds: number[];
  secondaryImpactedNodeIds: number[];
  estimatedDowntimeDays: number;
  monetaryExposureINR: string;
  cascadeNarrative: string;
  mitigationSteps: string[];
}

export interface AIAnalysisResult {
  supplierName: string;
  overallRisk: string;
  score: number;
  executiveSummary?: string;
  analysis?: string;
  contagionPotential: string;
  keyBottlenecks: string[];
  aiActionPlan: string[];
  recommendedAlternatives: {
    name: string;
    score: number;
    location: string;
    leadTime: string;
  }[];
}

export interface User {
  uid?: string;
  email: string;
  name: string;
  role: string;
  photoURL?: string;
  provider?: "google" | "github" | "microsoft" | "password";
  phone?: string;
  company?: string;
  department?: string;
  bio?: string;
  emailAlerts?: boolean;
  smsAlerts?: boolean;
}

export interface RealtimeUser {
  id: string;
  uid?: string;
  email: string;
  displayName: string;
  photoURL?: string;
  provider: "google" | "github" | "microsoft" | "password";
  role: string;
  lastLoginAt: string;
  status: "online" | "active" | "offline" | "away";
  currentView?: "3D_SPACE" | "2D_TOPOLOGY" | "RISK_MATRIX";
  supplierFocus?: string | null;
  lastActivity?: string;
  sessionDuration?: number;
  mouseActivity?: boolean;
  cursorPosition?: { x: number; y: number };
}

export type ViewMode = "3D_SPACE" | "2D_TOPOLOGY" | "RISK_MATRIX";

export interface UserPresenceData {
  userId: string;
  email: string;
  displayName: string;
  status: "online" | "offline" | "away";
  currentView: ViewMode;
  supplierFocus: string | null;
  lastActivity: string;
  sessionDuration: number;
  mouseActivity: boolean;
  cursorPosition: { x: number; y: number };
}

export interface AdminMetricsData {
  totalUsers: number | string;
  activeSessions: number | string;
  suppliersToday: number | string;
  importsToday: number | string;
  aiRequestsToday: number | string;
  systemHealth: "Stable" | "Elevated" | "Critical" | string;
  avgResponseTime: number | string;
  errorRate: string;
  lastDataSync: string;
}

export interface CollaborationData {
  activeChats: number | string;
  sharedAnnotations: number | string;
  realTimeEdits: number | string;
  presenceMap: Record<string, {
    name: string;
    view: string;
    since: string;
    email?: string;
    focus?: string | null;
  }>;
}

export interface SystemPerformanceData {
  apiLatency: {
    suppliersEndpoint: number | string;
    aiAnalyzeEndpoint: number | string;
    cascadeSimulation: number | string;
    networkGraph: number | string;
  };
  firebaseStatus: "connected" | "disconnected";
  geminiRateLimit: string;
  dataFreshness: number | string;
  cacheHitRate: string;
}

export interface ActivityInsightsData {
  mostActiveSuppliers: string[];
  popularIndustries: string[];
  peakActivityHours: string;
  commonViewTransitions: string[];
  userRetention: string;
}

export interface AlertsData {
  activeAlerts: number;
  criticalIssues: string[];
  systemNotifications: string;
  maintenanceRequired: boolean;
}

export interface RealTimeStatusPayload {
  userPresence: UserPresenceData;
  activeUsersList?: UserPresenceData[];
  adminMetrics: AdminMetricsData;
  collaborationData: CollaborationData;
  systemPerformance: SystemPerformanceData;
  activityInsights: ActivityInsightsData;
  alerts: AlertsData;
  metadata: {
    fetchStatus: "success" | "partial" | "failed";
    executionTime: number | string;
    nextSync: string;
    dataQuality: "high" | "medium" | "low";
    errorDetails?: string;
  };
}

export interface AIRealTimeAnalysis {
  userPatterns: {
    mostPopularView: string;
    avgSessionDuration: string;
    topMonitoredSuppliers: string[];
    peakActivityHour: string | number;
    userRetentionScore: string | number;
    viewTransitionPatterns: string[];
  };
  systemAssessment: {
    overallHealth: "Stable" | "Elevated" | "Critical";
    performanceBottleneck: string | null;
    firebaseStatus: string;
    apiCostEfficiency: "high" | "medium" | "low";
    dataFreshnessScore: number;
    recommendedActions: string[];
  };
  adminInsights: {
    priorityAlerts: {
      type: string;
      severity: "low" | "Medium" | "Critical";
      message: string;
      actionRequired: string;
      timestamp: string;
    }[];
    resourceRecommendations: {
      serverCapacity: string;
      apiCreditAllocation: string;
      featurePriority: string[];
    };
    userExperienceScore: string;
  };
  predictiveMetrics: {
    expectedUserGrowth: string;
    peakLoadForecast: string;
    capacityWarnings: string[];
    recommendedScaling: string;
    marketingOpportunities: string[];
  };
  realTimeAlerts: {
    activeAlerts: number;
    criticalIssues: string[];
    notifications: string;
    maintenanceWindow?: string;
  };
  metadata: {
    analysisConfidence: "high" | "medium" | "low";
    dataPointsAnalyzed: number;
    lastDataUpdate: string;
    recommendedNextAnalysis: string;
  };
}
