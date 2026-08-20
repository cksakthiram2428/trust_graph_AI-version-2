import { useState, useEffect, useCallback, useRef } from "react";
import { 
  RealTimeStatusPayload, 
  AIRealTimeAnalysis, 
  UserPresenceData, 
  ViewMode, 
  User 
} from "../types";
import { 
  subscribeToRealtimeUsers, 
  subscribeToAdminLogs, 
  updateUserPresence, 
  logAdminOperation 
} from "../lib/firebase";

interface UseRealtimeDataProps {
  user: User | null;
  currentView: ViewMode;
  supplierFocus?: string | null;
}

export function useRealtimeData({ user, currentView, supplierFocus }: UseRealtimeDataProps) {
  const [realtimeStatus, setRealtimeStatus] = useState<RealTimeStatusPayload | null>(null);
  const [aiAnalysis, setAiAnalysis] = useState<AIRealTimeAnalysis | null>(null);
  const [isAiAnalyzing, setIsAiAnalyzing] = useState(false);
  const [activeUsers, setActiveUsers] = useState<any[]>([]);
  const [adminLogs, setAdminLogs] = useState<any[]>([]);
  const [sessionDuration, setSessionDuration] = useState(1);
  const [isOnline, setIsOnline] = useState(true);
  const [lastSyncTime, setLastSyncTime] = useState<string>(new Date().toISOString());

  const mousePositionRef = useRef<{ x: number; y: number }>({ x: 0, y: 0 });
  const hasMouseActivityRef = useRef(false);

  // Track session timer
  useEffect(() => {
    const timer = setInterval(() => {
      setSessionDuration((prev) => prev + 1);
    }, 60000);
    return () => clearInterval(timer);
  }, []);

  // Track mouse coordinates for collaborative cursor presence
  useEffect(() => {
    const handleMouseMove = (e: MouseEvent) => {
      mousePositionRef.current = { x: e.clientX, y: e.clientY };
      hasMouseActivityRef.current = true;
    };
    window.addEventListener("mousemove", handleMouseMove, { passive: true });
    return () => window.removeEventListener("mousemove", handleMouseMove);
  }, []);

  // Fetch full Real-Time status snapshot
  const fetchRealTimeStatus = useCallback(async () => {
    try {
      const res = await fetch("/api/admin/real-time-status");
      if (res.ok) {
        const data: RealTimeStatusPayload = await res.json();
        setRealtimeStatus(data);
        setLastSyncTime(new Date().toISOString());
        setIsOnline(true);
      }
    } catch (err) {
      console.warn("Failed to fetch real-time status snapshot:", err);
      setIsOnline(false);
    }
  }, []);

  // Trigger Gemini AI Operations Analysis
  const triggerAiOperationsAnalysis = useCallback(async (forceRefresh = false) => {
    setIsAiAnalyzing(true);
    try {
      const res = await fetch("/api/admin/real-time-status/ai-analysis", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ forceRefresh })
      });
      if (res.ok) {
        const json = await res.json();
        if (json.data) {
          setAiAnalysis(json.data);
        }
      }
    } catch (err) {
      console.error("AI operations analysis query error:", err);
    } finally {
      setIsAiAnalyzing(false);
    }
  }, []);

  // Sync heartbeat & presence to backend & Firestore
  const sendPresenceHeartbeat = useCallback(async () => {
    const uid = user?.email || (user as any)?.id || "admin-local-cpo";
    const displayName = user?.name || (user as any)?.displayName || user?.email?.split("@")[0] || "Executive CPO";
    const email = user?.email || "cpo@msme-trustgraph.com";
    const role = user?.role || "Chief Procurement Officer";

    const payload = {
      userId: uid,
      email,
      displayName,
      role,
      status: "online" as const,
      currentView,
      supplierFocus: supplierFocus || null,
      cursorPosition: mousePositionRef.current,
      mouseActivity: hasMouseActivityRef.current,
      sessionDuration
    };

    hasMouseActivityRef.current = false;

    // Send to express backend
    try {
      await fetch("/api/admin/presence", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify(payload)
      });
    } catch (e) {
      // Offline fallback
    }

    // Sync to Firestore
    try {
      await updateUserPresence(uid, payload);
    } catch (e) {}
  }, [user, currentView, supplierFocus, sessionDuration]);

  // Subscribe to real-time users from Firestore
  useEffect(() => {
    const unsubscribeUsers = subscribeToRealtimeUsers((users) => {
      if (users && users.length > 0) {
        setActiveUsers(users);
      }
    });

    const unsubscribeLogs = subscribeToAdminLogs((logs) => {
      if (logs) {
        setAdminLogs(logs);
      }
    });

    return () => {
      unsubscribeUsers();
      unsubscribeLogs();
    };
  }, []);

  // Heartbeat & status polling interval
  useEffect(() => {
    sendPresenceHeartbeat();
    fetchRealTimeStatus();

    // Initial AI analysis fetch
    triggerAiOperationsAnalysis(false);

    const heartbeatInterval = setInterval(() => {
      sendPresenceHeartbeat();
      fetchRealTimeStatus();
    }, 15000);

    return () => clearInterval(heartbeatInterval);
  }, [sendPresenceHeartbeat, fetchRealTimeStatus, triggerAiOperationsAnalysis]);

  // Log admin action helper
  const logAction = useCallback(async (
    action: string,
    category: "MSME_INGESTION" | "SUPPLIER_EDIT" | "RISK_RECTIFICATION" | "AI_FORENSICS" | "USER_AUTH" | "SYSTEM_AUDIT",
    details: string,
    metadata?: Record<string, any>
  ) => {
    await logAdminOperation(action, category, details, user ? { uid: (user as any).id || user.email, email: user.email } : null, metadata);
    fetchRealTimeStatus();
  }, [user, fetchRealTimeStatus]);

  return {
    realtimeStatus,
    aiAnalysis,
    isAiAnalyzing,
    activeUsers,
    adminLogs,
    sessionDuration,
    isOnline,
    lastSyncTime,
    refreshStatus: fetchRealTimeStatus,
    refreshAiAnalysis: () => triggerAiOperationsAnalysis(true),
    logAction
  };
}
