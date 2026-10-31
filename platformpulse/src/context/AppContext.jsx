import React, { createContext, useContext, useState, useEffect } from "react";
import {
  initialPipelines,
  initialDashboards,
  initialRequests,
  wasteRecommendations as initialWasteRecs,
  costDataMonthly,
  spendBreakdown,
  metricGlossary,
  topAttentionItems,
  copilotKnowledge
} from "../data/mockData";
import * as api from "../api/client";
import confetti from "canvas-confetti";

const AppContext = createContext();

export const AppProvider = ({ children }) => {
  // Theme state: dark / light
  const [theme, setTheme] = useState(() => {
    return localStorage.getItem("platformpulse-theme") || "dark";
  });

  useEffect(() => {
    if (theme === "dark") {
      document.documentElement.classList.add("dark");
    } else {
      document.documentElement.classList.remove("dark");
    }
    localStorage.setItem("platformpulse-theme", theme);
  }, [theme]);

  const toggleTheme = () => {
    setTheme((prev) => (prev === "dark" ? "light" : "dark"));
  };

  // Active navigation tab: 'home' | 'pipelines' | 'dashboards' | 'requests' | 'cost'
  const [activeTab, setActiveTab] = useState("home");

  // User persona filter: 'all' | 'engineer' | 'finance' | 'business'
  const [userPersona, setUserPersona] = useState("all");

  // Core entities state
  const [pipelines, setPipelines] = useState(initialPipelines);
  const [dashboards, setDashboards] = useState(initialDashboards);
  const [requests, setRequests] = useState(initialRequests);
  const [wasteRecs, setWasteRecs] = useState(initialWasteRecs);
  const [backendStatus, setBackendStatus] = useState({ connected: false, engine: "Initializing..." });

  // Sync with FastAPI + Exasol backend on mount
  useEffect(() => {
    async function initFromBackend() {
      try {
        const health = await api.fetchHealth();
        if (health && health.status === "healthy") {
          setBackendStatus({
            connected: true,
            engine: health.database?.engine || "Exasol Personal"
          });

          // Fetch fresh records from Exasol
          const [pipes, dashs, reqs, waste] = await Promise.allSettled([
            api.fetchPipelines(),
            api.fetchDashboards(),
            api.fetchRequests(),
            api.fetchWasteRecommendations()
          ]);

          if (pipes.status === "fulfilled" && pipes.value?.length) {
            setPipelines(pipes.value);
          }
          if (dashs.status === "fulfilled" && dashs.value?.length) {
            setDashboards(dashs.value);
          }
          if (reqs.status === "fulfilled" && reqs.value?.length) {
            setRequests(reqs.value);
          }
          if (waste.status === "fulfilled" && waste.value?.length) {
            setWasteRecs(waste.value);
          }
        }
      } catch (err) {
        console.warn("Backend not yet reachable, running in resilient client mode:", err);
      }
    }
    initFromBackend();
  }, []);

  // Modals & drawers
  const [selectedPipeline, setSelectedPipeline] = useState(null);
  const [selectedDashboard, setSelectedDashboard] = useState(null);
  const [selectedRequest, setSelectedRequest] = useState(null);
  const [selectedMetric, setSelectedMetric] = useState(null);
  const [isAlertModalOpen, setIsAlertModalOpen] = useState(false);
  const [activeSlackAlert, setActiveSlackAlert] = useState(null);
  const [isCopilotOpen, setIsCopilotOpen] = useState(false);
  const [isDemoModalOpen, setIsDemoModalOpen] = useState(false);
  const [isNewRequestModalOpen, setIsNewRequestModalOpen] = useState(false);

  // Demo Scenario State
  const [demoState, setDemoState] = useState({
    isRunning: false,
    step: 0,
    isTriggered: true,
    isFixed: false,
    history: [
      { time: "03:14 AM", text: "Stripe Billing Sync failed: Column 'billing_country_iso2' missing", type: "error" },
      { time: "03:16 AM", text: "Executive Revenue Dashboard trust score plummeted to 48/100", type: "error" },
      { time: "03:17 AM", text: "P1 Incident Alert dispatched to #data-incidents on Slack", type: "warning" },
      { time: "07:45 AM", text: "Auto-incident ticket generated in Request Queue (REQ-004)", type: "info" }
    ]
  });

  // Trigger simulated demo scenario step-by-step
  const runDemoScenario = () => {
    setIsDemoModalOpen(true);
    setDemoState((prev) => ({
      ...prev,
      isRunning: true,
      step: 1,
      isTriggered: true,
      isFixed: false,
      history: [
        { time: "03:14 AM", text: "Overnight Cron: Stripe Billing Sync triggered...", type: "info" },
        { time: "03:14:22 AM", text: "CRITICAL: Schema drift! 'billing_country_iso2' missing in Snowflake. Pipeline crashed.", type: "error" }
      ]
    }));

    // Trigger backend state mutation in Exasol
    api.triggerDemoRun().catch(() => {});

    // Step 2: Trust score drops
    setTimeout(() => {
      setDemoState((prev) => ({
        ...prev,
        step: 2,
        history: [
          ...prev.history,
          { time: "03:16 AM", text: "Cascading impact: 'Executive Revenue & ARR Overview' marked STALE (Trust: 48/100).", type: "error" }
        ]
      }));

      // Update dashboard state
      setDashboards((prev) =>
        prev.map((d) =>
          d.id === "dash-exec-revenue"
            ? { ...d, score: 48, status: "stale", lastSync: "14 hours ago (Failed)" }
            : d
        )
      );
    }, 1800);

    // Step 3: Slack alert fires
    setTimeout(() => {
      const alertPayload = {
        channel: "#data-incidents",
        severity: "P1 - CRITICAL",
        title: "Pipeline Failure: pipeline_stripe_billing_sync",
        summary: "Schema mismatch in stg_stripe__charges halted billing sync. 2 downstream executive dashboards impacted.",
        impactedDashboards: ["Executive Revenue & ARR Overview (48 daily viewers)"],
        timestamp: "Today at 03:17 AM",
        actions: ["Acknowledge PagerDuty", "View Stack Trace", "Rerun dbt Marts"]
      };

      setActiveSlackAlert(alertPayload);
      setDemoState((prev) => ({
        ...prev,
        step: 3,
        history: [
          ...prev.history,
          { time: "03:17 AM", text: "Alert Rule fired: P1 incident card dispatched to #data-incidents Slack channel.", type: "warning" }
        ]
      }));
    }, 3600);

    // Step 4: Request ticket auto-created
    setTimeout(() => {
      setDemoState((prev) => ({
        ...prev,
        step: 4,
        history: [
          ...prev.history,
          { time: "07:45 AM", text: "AI Auto-Triage: Injected incident ticket into Request Queue with priority score 96.", type: "info" }
        ]
      }));
    }, 5400);

    // Step 5: Cost impact calculated
    setTimeout(() => {
      setDemoState((prev) => ({
        ...prev,
        isRunning: false,
        step: 5,
        history: [
          ...prev.history,
          { time: "08:00 AM", text: "Cost Impact: $1,850 wasted retry compute and SLA delay tracked in Cost Optimizer.", type: "warning" },
          { time: "Current", text: "Complete chain reaction active across all 4 modules. Ready for resolution.", type: "success" }
        ]
      }));
    }, 7000);
  };

  // Instant one-click fix from demo or morning-after view
  const applyDemoFix = () => {
    // Notify Exasol backend
    api.triggerDemoFix().catch(() => {});

    // Fix pipeline
    setPipelines((prev) =>
      prev.map((p) =>
        p.id === "pipe-stripe-billing"
          ? {
              ...p,
              status: "healthy",
              riskScore: "low",
              errorSummary: null,
              retries: 0,
              duration: "18m 42s",
              lastRun: "Just now (Auto-healed in Exasol)",
              runtimeTrend: "Optimal"
            }
          : p.id === "pipe-snowflake-dbt-gold"
          ? {
              ...p,
              status: "healthy",
              riskScore: "low",
              errorSummary: null,
              lastRun: "Just now (Upstream restored)"
            }
          : p
      )
    );

    // Restore dashboard trust score
    setDashboards((prev) =>
      prev.map((d) =>
        d.id === "dash-exec-revenue"
          ? {
              ...d,
              score: 96,
              status: "trusted",
              lastSync: "Just now",
              breakdown: {
                freshness: 98,
                pipelineReliability: 97,
                schemaStability: 96,
                dataQuality: 95,
                metricConsistency: 94
              },
              issues: [],
              recentAnomalies: []
            }
          : d
      )
    );

    // Mark incident request ticket as completed
    setRequests((prev) =>
      prev.map((r) =>
        r.id === "REQ-004"
          ? { ...r, status: "completed", slaRemainingHours: 0 }
          : r
      )
    );

    // Update demo state
    setDemoState((prev) => ({
      ...prev,
      isFixed: true,
      isRunning: false,
      step: 6,
      history: [
        ...prev.history,
        { time: "Just now", text: "Patch applied: Schema migration successful! Exasol tables updated.", type: "success" },
        { time: "Just now", text: "Executive Dashboard Trust restored from 48 -> 96 (TRUSTED).", type: "success" },
        { time: "Just now", text: "Incident ticket REQ-004 marked COMPLETED in Exasol queue.", type: "success" }
      ]
    }));

    // Trigger celebration confetti
    try {
      confetti({
        particleCount: 80,
        spread: 70,
        origin: { y: 0.6 }
      });
    } catch {
      // fallback
    }
  };

  // Reset demo back to morning-after failed state
  const resetDemo = () => {
    api.triggerDemoReset().catch(() => {});

    setPipelines(initialPipelines);
    setDashboards(initialDashboards);
    setRequests(initialRequests);
    setWasteRecs(initialWasteRecs);
    setDemoState({
      isRunning: false,
      step: 0,
      isTriggered: true,
      isFixed: false,
      history: [
        { time: "03:14 AM", text: "Stripe Billing Sync failed: Column 'billing_country_iso2' missing", type: "error" },
        { time: "03:16 AM", text: "Executive Revenue Dashboard trust score plummeted to 48/100", type: "error" },
        { time: "03:17 AM", text: "P1 Incident Alert dispatched to #data-incidents on Slack", type: "warning" },
        { time: "07:45 AM", text: "Auto-incident ticket generated in Request Queue (REQ-004)", type: "info" }
      ]
    });
  };

  // Request intake submission with AI triage
  const submitNewRequest = async (formData) => {
    // Send to backend
    try {
      await api.createRequest(formData);
    } catch (e) {
      console.warn("Backend request creation failed:", e);
    }

    let classification = "needs_pipeline";
    let rationale = "Complex analytical request requiring new pipeline connectors and data modeling.";
    let matchedAsset = null;
    let effort = 24;

    const lowerTitle = (formData.title + " " + formData.whyNeeded).toLowerCase();

    if (lowerTitle.includes("churn") || lowerTitle.includes("retention") || lowerTitle.includes("cohort")) {
      classification = "already_answerable";
      rationale = "Matched with 'Customer Success Health & Churn Risk' dashboard. Contains existing cohort retention breakdown.";
      matchedAsset = {
        id: "dash-cs-churn",
        name: "Customer Success Health & Churn Risk",
        url: "https://metabase.internal.company.com/dashboard/41"
      };
      effort = 0.5;
    } else if (lowerTitle.includes("export") || lowerTitle.includes("csv") || lowerTitle.includes("query") || lowerTitle.includes("list")) {
      classification = "quick_query";
      rationale = "Ad-hoc query extract that can be executed directly against warehouse tables without new pipeline work.";
      effort = 2;
    } else if (lowerTitle.includes("sales") || lowerTitle.includes("quota") || lowerTitle.includes("attainment")) {
      classification = "already_answerable";
      rationale = "Answerable by 'Sales Rep Performance & Quota Attainment' dashboard with existing regional filters.";
      matchedAsset = {
        id: "dash-sales-quota",
        name: "Sales Rep Performance & Quota Attainment",
        url: "https://looker.internal.company.com/dashboards/184"
      };
      effort = 0.5;
    }

    const urgencyMultiplier = formData.urgency.startsWith("P1") ? 4 : formData.urgency.startsWith("P2") ? 3 : 2;
    const priorityScore = Math.min(99, Math.max(30, urgencyMultiplier * 25 - effort * 0.5 + 20));

    const newTicket = {
      id: `REQ-${String(requests.length + 1).padStart(3, "0")}`,
      title: formData.title,
      requester: formData.requester || "Current User",
      department: formData.department || "Business Ops",
      urgency: formData.urgency,
      deadline: formData.deadline || "2026-11-05",
      whyNeeded: formData.whyNeeded,
      status: classification === "already_answerable" ? "in_triage" : "backlog",
      aiClassification: classification,
      aiRationale: rationale,
      matchedAsset,
      effortHours: effort,
      priorityScore: Math.round(priorityScore),
      createdAt: "Just now",
      slaRemainingHours: formData.urgency.startsWith("P1") ? 12 : 48,
      isOverdue: false
    };

    setRequests([newTicket, ...requests]);
    setIsNewRequestModalOpen(false);
  };

  // Move request ticket status in Kanban
  const moveRequestStatus = (requestId, newStatus) => {
    api.updateRequestStatus(requestId, newStatus).catch(() => {});
    setRequests((prev) =>
      prev.map((r) => (r.id === requestId ? { ...r, status: newStatus } : r))
    );
  };

  // Cost recommendation approval / dismissal
  const handleWasteAction = (recId, action) => {
    api.updateWasteAction(recId, action).catch(() => {});
    setWasteRecs((prev) =>
      prev.map((r) =>
        r.id === recId
          ? {
              ...r,
              status: action === "approve" ? "approved" : "dismissed",
              appliedDate: action === "approve" ? "Today" : null
            }
          : r
      )
    );
  };

  // Computed metrics
  const failedPipelinesCount = pipelines.filter((p) => p.status === "failed").length;
  const delayedPipelinesCount = pipelines.filter((p) => p.status === "delayed").length;
  const atRiskPipelinesCount = pipelines.filter((p) => p.status === "at_risk").length;
  
  const avgTrustScore = Math.round(
    dashboards.reduce((acc, d) => acc + d.score, 0) / Math.max(dashboards.length, 1)
  );

  const activeRecommendations = wasteRecs.filter((r) => r.status === "pending");
  const approvedRecommendations = wasteRecs.filter((r) => r.status === "approved");
  const potentialSavingsMonthly = activeRecommendations.reduce(
    (acc, r) => acc + r.projectedMonthlySavings,
    0
  );
  const realizedSavingsMonthly = approvedRecommendations.reduce(
    (acc, r) => acc + r.projectedMonthlySavings,
    0
  );

  return (
    <AppContext.Provider
      value={{
        theme,
        toggleTheme,
        activeTab,
        setActiveTab,
        userPersona,
        setUserPersona,
        backendStatus,
        pipelines,
        setPipelines,
        dashboards,
        setDashboards,
        requests,
        setRequests,
        wasteRecs,
        costDataMonthly,
        spendBreakdown,
        metricGlossary,
        topAttentionItems,
        copilotKnowledge,
        // Demo
        demoState,
        runDemoScenario,
        applyDemoFix,
        resetDemo,
        isDemoModalOpen,
        setIsDemoModalOpen,
        // Modals & Drawers
        selectedPipeline,
        setSelectedPipeline,
        selectedDashboard,
        setSelectedDashboard,
        selectedRequest,
        setSelectedRequest,
        selectedMetric,
        setSelectedMetric,
        isAlertModalOpen,
        setIsAlertModalOpen,
        activeSlackAlert,
        setActiveSlackAlert,
        isCopilotOpen,
        setIsCopilotOpen,
        isNewRequestModalOpen,
        setIsNewRequestModalOpen,
        // Actions
        submitNewRequest,
        moveRequestStatus,
        handleWasteAction,
        // Computed
        failedPipelinesCount,
        delayedPipelinesCount,
        atRiskPipelinesCount,
        avgTrustScore,
        potentialSavingsMonthly,
        realizedSavingsMonthly
      }}
    >
      {children}
    </AppContext.Provider>
  );
};

export const useApp = () => useContext(AppContext);
