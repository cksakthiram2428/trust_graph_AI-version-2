/**
 * Privacy-First Telemetry & Analytics Tracker
 */

export interface AnalyticsEvent {
  event: string;
  category?: string;
  label?: string;
  value?: number;
  properties?: Record<string, any>;
  timestamp: string;
}

class AnalyticsService {
  private isEnabled: boolean = true;
  private logs: AnalyticsEvent[] = [];

  constructor() {
    const consent = localStorage.getItem("tg_cookie_consent");
    if (consent === "essential_only") {
      this.isEnabled = false;
    }
  }

  public setConsent(allowsAnalytics: boolean) {
    this.isEnabled = allowsAnalytics;
  }

  public track(event: string, properties?: Record<string, any>) {
    const eventObj: AnalyticsEvent = {
      event,
      properties,
      timestamp: new Date().toISOString()
    };

    if (this.isEnabled) {
      this.logs.push(eventObj);
      if (process.env.NODE_ENV !== "production") {
        console.log(`[TrustGraph Analytics] 📊 ${event}`, properties || "");
      }
    }
  }

  public pageView(pageName: string) {
    this.track("page_view", { page: pageName, url: window.location.href });
  }

  public trackSimulation(supplierId: string, depth: number) {
    this.track("cascade_simulation_triggered", { supplierId, depth });
  }

  public trackAudit(supplierId: string) {
    this.track("ai_forensic_audit_triggered", { supplierId });
  }

  public trackRealtimeRefresh() {
    this.track("realtime_intelligence_refreshed");
  }
}

export const analytics = new AnalyticsService();
