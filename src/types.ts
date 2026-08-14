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
  status: "online" | "active" | "offline";
}

export type ViewMode = "3D_SPACE" | "2D_TOPOLOGY" | "RISK_MATRIX";
