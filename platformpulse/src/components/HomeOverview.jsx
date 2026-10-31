import React, { useState } from "react";
import { useApp } from "../context/AppContext";
import {
  Activity,
  Layers,
  ShieldCheck,
  Inbox,
  DollarSign,
  AlertTriangle,
  CheckCircle2,
  Clock,
  ArrowUpRight,
  ArrowDownRight,
  TrendingUp,
  Sparkles,
  HelpCircle,
  Play,
  Zap,
  ChevronRight,
  ExternalLink,
  Flame,
  Search,
  Send,
  RefreshCw,
  Sliders,
  Database
} from "lucide-react";

export const HomeOverview = () => {
  const {
    pipelines,
    dashboards,
    requests,
    wasteRecs,
    topAttentionItems,
    setActiveTab,
    runDemoScenario,
    demoState,
    setSelectedPipeline,
    setSelectedDashboard,
    setSelectedRequest,
    setSelectedMetric,
    handleWasteAction,
    setIsCopilotOpen,
    copilotKnowledge,
    failedPipelinesCount,
    delayedPipelinesCount,
    avgTrustScore,
    userPersona
  } = useApp();

  // Local state for interactive Copilot in Home view
  const [copilotQuery, setCopilotQuery] = useState("");
  const [copilotResponse, setCopilotResponse] = useState(null);
  const [isTyping, setIsTyping] = useState(false);

  const handleAskQuestion = (questionText) => {
    setCopilotQuery(questionText);
    setIsTyping(true);

    setTimeout(() => {
      // Find matching knowledge or fallback
      const lower = questionText.toLowerCase();
      const match = copilotKnowledge.find((k) =>
        k.keywords.some((kw) => lower.includes(kw))
      );

      if (match) {
        setCopilotResponse(match.answer);
      } else {
        setCopilotResponse(
          `**PlatformPulse Analysis**: For "${questionText}", telemetry shows 2 pipelines running with elevated latency, and 1 downstream dashboard marked stale. Check the **Pipeline Health** and **Dashboard Trust** tabs for real-time root causes.`
        );
      }
      setIsTyping(false);
    }, 400);
  };

  // Persona focal message
  const personaTips = {
    all: "Unified executive view monitoring overnight incidents, reporting fidelity, team backlog, and infrastructure efficiency.",
    engineer: "Focus: 2 failed pipelines detected overnight (Stripe API schema drift, DBT downstream failure). Action required in Pipeline Health.",
    finance: "Focus: Platform cost grew 44% faster than query usage this quarter. $7,820/mo in waste reduction recommendations available.",
    business: "Focus: Executive Revenue dashboard is currently STALE (Score 48). Request queue SLA median wait time is 3.2 days."
  };

  const staleDashboards = dashboards.filter((d) => d.status === "stale").length;
  const cautionDashboards = dashboards.filter((d) => d.status === "caution").length;
  const trustedDashboards = dashboards.filter((d) => d.status === "trusted").length;

  return (
    <div className="space-y-6 pb-12">
      {/* Hero Welcome & Value Proposition */}
      <div className="relative overflow-hidden rounded-2xl bg-gradient-to-r from-slate-900 via-indigo-950 to-slate-900 text-white p-6 sm:p-8 shadow-xl border border-slate-800">
        <div className="absolute top-0 right-0 -mt-10 -mr-10 w-96 h-96 bg-blue-500/10 rounded-full blur-3xl pointer-events-none" />
        <div className="absolute bottom-0 left-1/3 -mb-10 w-80 h-80 bg-purple-500/10 rounded-full blur-3xl pointer-events-none" />

        <div className="relative z-10 flex flex-col md:flex-row md:items-center justify-between gap-6">
          <div className="max-w-3xl space-y-2">
            <div className="flex items-center gap-2">
              <span className="inline-flex items-center gap-1.5 px-2.5 py-0.5 rounded-full text-xs font-semibold bg-blue-500/20 text-blue-300 border border-blue-400/30">
                <Sparkles className="w-3.5 h-3.5" />
                Data & IT Operations Control Tower
              </span>
              <span className="text-xs text-slate-400">
                Oct 31, 2026 • Live Telemetry
              </span>
            </div>

            <h1 className="text-2xl sm:text-3xl font-extrabold tracking-tight text-white">
              Stop blind spots before the CEO opens the dashboard.
            </h1>

            <p className="text-sm sm:text-base text-slate-300 leading-relaxed">
              PlatformPulse bridges the four critical silos of enterprise data operations: overnight pipeline failures, eroding dashboard trust, endless request backlogs, and runaway platform spend.
            </p>

            {/* Persona Callout */}
            <div className="pt-1 flex items-center gap-2 text-xs text-blue-200">
              <span className="font-semibold text-slate-400 uppercase tracking-wider text-[10px]">
                Active Persona:
              </span>
              <span className="bg-white/10 px-2 py-0.5 rounded font-medium">
                {userPersona === "all" ? "All Roles" : userPersona}
              </span>
              <span className="hidden sm:inline text-slate-300">
                — {personaTips[userPersona]}
              </span>
            </div>
          </div>

          {/* Quick Action Button for Demo Scenario */}
          <div className="flex flex-col sm:flex-row md:flex-col gap-2 shrink-0">
            <button
              onClick={runDemoScenario}
              className="flex items-center justify-center gap-2 px-5 py-3 rounded-xl bg-gradient-to-r from-amber-500 to-orange-500 hover:from-amber-600 hover:to-orange-600 text-white font-semibold text-sm shadow-lg shadow-orange-500/25 transition-all transform hover:-translate-y-0.5 active:translate-y-0 cursor-pointer"
            >
              <Play className="w-4 h-4 fill-current" />
              <span>Run Demo Scenario</span>
            </button>
            <p className="text-[11px] text-center text-slate-400">
              Simulates failure → alert → ticket → cost impact
            </p>
          </div>
        </div>
      </div>

      {/* Four Primary KPI Cards */}
      <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-4">
        {/* KPI 1: Pipeline Health */}
        <div
          onClick={() => setActiveTab("pipelines")}
          className="group relative bg-white dark:bg-slate-900 p-5 rounded-xl border border-slate-200 dark:border-slate-800 shadow-sm hover:shadow-md transition-all cursor-pointer hover:border-red-300 dark:hover:border-red-800"
        >
          <div className="flex items-center justify-between">
            <span className="text-xs font-semibold uppercase tracking-wider text-slate-500 dark:text-slate-400">
              Pipelines Failed (24h)
            </span>
            <div className="p-2 rounded-lg bg-red-50 text-red-600 dark:bg-red-950/50 dark:text-red-400">
              <Layers className="w-5 h-5" />
            </div>
          </div>

          <div className="mt-3 flex items-baseline gap-2">
            <span className="text-3xl font-bold text-slate-900 dark:text-white">
              {failedPipelinesCount}
            </span>
            <span className="text-xs font-semibold px-2 py-0.5 rounded-full bg-red-100 text-red-700 dark:bg-red-900/40 dark:text-red-300">
              Critical Alert
            </span>
          </div>

          <p className="mt-1 text-xs text-slate-500 dark:text-slate-400">
            {delayedPipelinesCount} delayed, 3 at-risk of breaking tonight
          </p>

          <div className="mt-4 pt-3 border-t border-slate-100 dark:border-slate-800 flex items-center justify-between text-xs text-red-600 dark:text-red-400 font-medium">
            <span>Stripe billing sync crashed</span>
            <ChevronRight className="w-4 h-4 group-hover:translate-x-1 transition-transform" />
          </div>
        </div>

        {/* KPI 2: Dashboard Trust */}
        <div
          onClick={() => setActiveTab("dashboards")}
          className="group relative bg-white dark:bg-slate-900 p-5 rounded-xl border border-slate-200 dark:border-slate-800 shadow-sm hover:shadow-md transition-all cursor-pointer hover:border-amber-300 dark:hover:border-amber-800"
        >
          <div className="flex items-center justify-between">
            <span className="text-xs font-semibold uppercase tracking-wider text-slate-500 dark:text-slate-400">
              Avg Dashboard Trust
            </span>
            <div className="p-2 rounded-lg bg-amber-50 text-amber-600 dark:bg-amber-950/50 dark:text-amber-400">
              <ShieldCheck className="w-5 h-5" />
            </div>
          </div>

          <div className="mt-3 flex items-baseline gap-2">
            <span className="text-3xl font-bold text-slate-900 dark:text-white">
              {avgTrustScore}
              <span className="text-lg font-normal text-slate-400">/100</span>
            </span>
            <span
              className={`text-xs font-semibold px-2 py-0.5 rounded-full ${
                avgTrustScore >= 85
                  ? "bg-emerald-100 text-emerald-700 dark:bg-emerald-900/40 dark:text-emerald-300"
                  : avgTrustScore >= 65
                  ? "bg-amber-100 text-amber-700 dark:bg-amber-900/40 dark:text-amber-300"
                  : "bg-red-100 text-red-700 dark:bg-red-900/40 dark:text-red-300"
              }`}
            >
              {avgTrustScore >= 85 ? "Trusted" : "Caution"}
            </span>
          </div>

          <p className="mt-1 text-xs text-slate-500 dark:text-slate-400">
            {staleDashboards} Stale, {cautionDashboards} Caution, {trustedDashboards} Trusted
          </p>

          <div className="mt-4 pt-3 border-t border-slate-100 dark:border-slate-800 flex items-center justify-between text-xs text-amber-600 dark:text-amber-400 font-medium">
            <span>Executive ARR score at 48</span>
            <ChevronRight className="w-4 h-4 group-hover:translate-x-1 transition-transform" />
          </div>
        </div>

        {/* KPI 3: Request Queue */}
        <div
          onClick={() => setActiveTab("requests")}
          className="group relative bg-white dark:bg-slate-900 p-5 rounded-xl border border-slate-200 dark:border-slate-800 shadow-sm hover:shadow-md transition-all cursor-pointer hover:border-blue-300 dark:hover:border-blue-800"
        >
          <div className="flex items-center justify-between">
            <span className="text-xs font-semibold uppercase tracking-wider text-slate-500 dark:text-slate-400">
              Median Wait Time
            </span>
            <div className="p-2 rounded-lg bg-blue-50 text-blue-600 dark:bg-blue-950/50 dark:text-blue-400">
              <Inbox className="w-5 h-5" />
            </div>
          </div>

          <div className="mt-3 flex items-baseline gap-2">
            <span className="text-3xl font-bold text-slate-900 dark:text-white">
              3.2
            </span>
            <span className="text-sm font-semibold text-slate-500">Days</span>
            <span className="text-xs font-semibold px-2 py-0.5 rounded-full bg-emerald-100 text-emerald-700 dark:bg-emerald-900/40 dark:text-emerald-300 flex items-center gap-0.5">
              <ArrowDownRight className="w-3 h-3" />
              -42% AI Triage
            </span>
          </div>

          <p className="mt-1 text-xs text-slate-500 dark:text-slate-400">
            15 total in queue • 5 already answerable
          </p>

          <div className="mt-4 pt-3 border-t border-slate-100 dark:border-slate-800 flex items-center justify-between text-xs text-blue-600 dark:text-blue-400 font-medium">
            <span>2 tickets overdue SLA</span>
            <ChevronRight className="w-4 h-4 group-hover:translate-x-1 transition-transform" />
          </div>
        </div>

        {/* KPI 4: Cost per Query */}
        <div
          onClick={() => setActiveTab("cost")}
          className="group relative bg-white dark:bg-slate-900 p-5 rounded-xl border border-slate-200 dark:border-slate-800 shadow-sm hover:shadow-md transition-all cursor-pointer hover:border-purple-300 dark:hover:border-purple-800"
        >
          <div className="flex items-center justify-between">
            <span className="text-xs font-semibold uppercase tracking-wider text-slate-500 dark:text-slate-400">
              Cost / 1k Queries
            </span>
            <div className="p-2 rounded-lg bg-purple-50 text-purple-600 dark:bg-purple-950/50 dark:text-purple-400">
              <DollarSign className="w-5 h-5" />
            </div>
          </div>

          <div className="mt-3 flex items-baseline gap-2">
            <span className="text-3xl font-bold text-slate-900 dark:text-white">
              $5.71
            </span>
            <span className="text-xs font-semibold px-2 py-0.5 rounded-full bg-red-100 text-red-700 dark:bg-red-900/40 dark:text-red-300 flex items-center gap-0.5">
              <ArrowUpRight className="w-3 h-3" />
              +44% Divergence
            </span>
          </div>

          <p className="mt-1 text-xs text-slate-500 dark:text-slate-400">
            Total spend: $54.8k/mo • Queries: +17%
          </p>

          <div className="mt-4 pt-3 border-t border-slate-100 dark:border-slate-800 flex items-center justify-between text-xs text-purple-600 dark:text-purple-400 font-medium">
            <span>$7.8k/mo waste identified</span>
            <ChevronRight className="w-4 h-4 group-hover:translate-x-1 transition-transform" />
          </div>
        </div>
      </div>

      {/* Two Column Layout: "Needs Attention Today" and "AI Natural-Language Copilot" */}
      <div className="grid grid-cols-1 lg:grid-cols-12 gap-6">
        {/* Left Column (7 cols): Top 5 Issues Ranked */}
        <div className="lg:col-span-7 bg-white dark:bg-slate-900 p-5 sm:p-6 rounded-2xl border border-slate-200 dark:border-slate-800 shadow-sm">
          <div className="flex items-center justify-between mb-4">
            <div className="flex items-center gap-2">
              <div className="p-1.5 rounded-lg bg-red-100 dark:bg-red-950/60 text-red-600 dark:text-red-400">
                <Flame className="w-4 h-4" />
              </div>
              <h2 className="text-base sm:text-lg font-bold text-slate-900 dark:text-white">
                Needs Attention Today
              </h2>
            </div>
            <span className="text-xs text-slate-500 dark:text-slate-400">
              Ranked by cross-system business risk
            </span>
          </div>

          <div className="space-y-3">
            {topAttentionItems.map((item, index) => {
              const isCrit = item.severity === "critical";
              const isHigh = item.severity === "high";

              return (
                <div
                  key={item.id}
                  className={`p-3.5 rounded-xl border transition-all ${
                    isCrit
                      ? "bg-red-50/50 dark:bg-red-950/20 border-red-200 dark:border-red-900/50"
                      : isHigh
                      ? "bg-amber-50/40 dark:bg-amber-950/20 border-amber-200 dark:border-amber-900/50"
                      : "bg-slate-50 dark:bg-slate-800/40 border-slate-200 dark:border-slate-700/60"
                  }`}
                >
                  <div className="flex items-start justify-between gap-3">
                    <div className="flex items-start gap-3">
                      <span
                        className={`flex items-center justify-center w-6 h-6 rounded-full text-xs font-bold shrink-0 mt-0.5 ${
                          isCrit
                            ? "bg-red-600 text-white"
                            : isHigh
                            ? "bg-amber-500 text-white"
                            : "bg-slate-400 text-white"
                        }`}
                      >
                        {index + 1}
                      </span>

                      <div className="space-y-1">
                        <div className="flex items-center gap-2 flex-wrap">
                          <h3 className="text-sm font-semibold text-slate-900 dark:text-white">
                            {item.title}
                          </h3>
                          <span
                            className={`text-[10px] font-bold uppercase tracking-wider px-1.5 py-0.5 rounded ${
                              isCrit
                                ? "bg-red-200 text-red-800 dark:bg-red-900 dark:text-red-200"
                                : isHigh
                                ? "bg-amber-200 text-amber-800 dark:bg-amber-900 dark:text-amber-200"
                                : "bg-slate-200 text-slate-700 dark:bg-slate-700 dark:text-slate-300"
                            }`}
                          >
                            {item.category}
                          </span>
                        </div>

                        <p className="text-xs text-slate-600 dark:text-slate-300 leading-snug">
                          {item.detail}
                        </p>

                        <p className="text-[11px] font-medium text-slate-500 dark:text-slate-400 flex items-center gap-1 pt-0.5">
                          <span className="font-semibold text-slate-700 dark:text-slate-300">Impact:</span>
                          {item.impact}
                        </p>
                      </div>
                    </div>

                    <button
                      onClick={() => {
                        setActiveTab(item.linkTab);
                        if (item.pipelineId) {
                          const p = pipelines.find((x) => x.id === item.pipelineId);
                          if (p) setSelectedPipeline(p);
                        } else if (item.dashboardId) {
                          const d = dashboards.find((x) => x.id === item.dashboardId);
                          if (d) setSelectedDashboard(d);
                        } else if (item.metricId) {
                          setActiveTab("dashboards");
                        } else if (item.ticketId) {
                          const r = requests.find((x) => x.id === item.ticketId);
                          if (r) setSelectedRequest(r);
                        }
                      }}
                      className="px-2.5 py-1 text-xs font-semibold rounded-lg bg-white dark:bg-slate-800 border border-slate-300 dark:border-slate-700 hover:bg-slate-100 dark:hover:bg-slate-700 text-slate-800 dark:text-slate-200 shrink-0 shadow-sm transition-colors"
                    >
                      Resolve
                    </button>
                  </div>
                </div>
              );
            })}
          </div>
        </div>

        {/* Right Column (5 cols): Embedded Copilot Assistant */}
        <div className="lg:col-span-5 bg-white dark:bg-slate-900 p-5 sm:p-6 rounded-2xl border border-slate-200 dark:border-slate-800 shadow-sm flex flex-col justify-between">
          <div>
            <div className="flex items-center justify-between mb-3">
              <div className="flex items-center gap-2">
                <div className="p-1.5 rounded-lg bg-purple-100 dark:bg-purple-950/60 text-purple-600 dark:text-purple-400">
                  <Sparkles className="w-4 h-4" />
                </div>
                <h2 className="text-base font-bold text-slate-900 dark:text-white">
                  PlatformPulse Copilot
                </h2>
              </div>
              <span className="text-[10px] uppercase font-bold tracking-wider px-2 py-0.5 rounded bg-purple-100 text-purple-700 dark:bg-purple-950 dark:text-purple-300">
                Connected to Data Mesh
              </span>
            </div>

            <p className="text-xs text-slate-500 dark:text-slate-400 mb-4">
              Ask natural-language questions about pipeline telemetry, dashboard trust drops, queue status, or platform cost.
            </p>

            {/* Quick Suggestion Chips */}
            <div className="space-y-1.5 mb-4">
              <p className="text-[11px] font-semibold text-slate-500 uppercase tracking-wider">
                Suggested Questions:
              </p>
              {copilotKnowledge.map((item, idx) => (
                <button
                  key={idx}
                  onClick={() => handleAskQuestion(item.question)}
                  className="w-full text-left text-xs px-2.5 py-1.5 rounded-lg bg-slate-50 hover:bg-slate-100 dark:bg-slate-800/60 dark:hover:bg-slate-800 text-slate-700 dark:text-slate-300 border border-slate-200/60 dark:border-slate-700/60 transition-colors flex items-center justify-between group"
                >
                  <span className="truncate">{item.question}</span>
                  <ChevronRight className="w-3.5 h-3.5 text-slate-400 group-hover:translate-x-0.5 transition-transform shrink-0 ml-1" />
                </button>
              ))}
            </div>

            {/* Response Box */}
            {(isTyping || copilotResponse) && (
              <div className="p-3.5 rounded-xl bg-purple-50/60 dark:bg-purple-950/20 border border-purple-200 dark:border-purple-900/60 mb-4 text-xs">
                {isTyping ? (
                  <div className="flex items-center gap-2 text-purple-600 dark:text-purple-400">
                    <RefreshCw className="w-3.5 h-3.5 animate-spin" />
                    <span>Analyzing pipeline logs, trust signals, and warehouse telemetry...</span>
                  </div>
                ) : (
                  <div className="space-y-2 text-slate-800 dark:text-slate-200 whitespace-pre-line leading-relaxed">
                    <div className="font-semibold text-purple-700 dark:text-purple-300 flex items-center gap-1.5">
                      <Sparkles className="w-3.5 h-3.5" />
                      Q: {copilotQuery}
                    </div>
                    <div>{copilotResponse}</div>
                  </div>
                )}
              </div>
            )}
          </div>

          {/* Input Box */}
          <div className="pt-2">
            <form
              onSubmit={(e) => {
                e.preventDefault();
                if (copilotQuery.trim()) {
                  handleAskQuestion(copilotQuery);
                }
              }}
              className="relative flex items-center"
            >
              <input
                type="text"
                value={copilotQuery}
                onChange={(e) => setCopilotQuery(e.target.value)}
                placeholder="Ask e.g. Why is the sales dashboard wrong today?..."
                className="w-full text-xs py-2.5 pl-3 pr-10 rounded-xl bg-slate-50 dark:bg-slate-800 border border-slate-200 dark:border-slate-700 focus:outline-none focus:ring-2 focus:ring-purple-500 dark:text-white"
              />
              <button
                type="submit"
                className="absolute right-1.5 p-1.5 rounded-lg bg-purple-600 hover:bg-purple-700 text-white transition-colors"
                title="Send query"
              >
                <Send className="w-3.5 h-3.5" />
              </button>
            </form>
          </div>
        </div>
      </div>

      {/* Control Tower Architecture Synergy Map */}
      <div className="bg-white dark:bg-slate-900 p-5 sm:p-6 rounded-2xl border border-slate-200 dark:border-slate-800 shadow-sm">
        <div className="flex items-center justify-between mb-4">
          <div>
            <h2 className="text-base font-bold text-slate-900 dark:text-white">
              Platform Data Flow & Blast Radius Map
            </h2>
            <p className="text-xs text-slate-500 dark:text-slate-400">
              Real-time synchronization showing how raw pipeline ingestion impacts downstream business assets and cloud bills.
            </p>
          </div>
          <span className="text-xs text-emerald-600 dark:text-emerald-400 font-semibold bg-emerald-50 dark:bg-emerald-950/50 px-2.5 py-1 rounded-full border border-emerald-200 dark:border-emerald-800 flex items-center gap-1">
            <span className="w-1.5 h-1.5 rounded-full bg-emerald-500 animate-ping" />
            Control Mesh Online
          </span>
        </div>

        <div className="grid grid-cols-1 md:grid-cols-4 gap-4 pt-2">
          {/* Layer 1: Ingestion Pipelines */}
          <div
            onClick={() => setActiveTab("pipelines")}
            className="p-4 rounded-xl border border-slate-200 dark:border-slate-800 bg-slate-50/50 dark:bg-slate-800/40 hover:bg-slate-100/70 dark:hover:bg-slate-800/80 transition-colors cursor-pointer space-y-2.5"
          >
            <div className="flex items-center justify-between">
              <span className="text-[11px] font-bold uppercase tracking-wider text-slate-500 dark:text-slate-400">
                1. Data Pipelines
              </span>
              <span className="text-[10px] font-bold px-2 py-0.5 rounded-full bg-red-100 text-red-700 dark:bg-red-900/50 dark:text-red-300">
                {failedPipelinesCount} Crashed
              </span>
            </div>
            <div className="space-y-1.5 text-xs">
              <div className="flex items-center justify-between p-2 rounded bg-red-100/60 dark:bg-red-950/40 text-red-700 dark:text-red-300 border border-red-200 dark:border-red-900/40">
                <span className="font-semibold truncate">stripe_billing_sync</span>
                <span className="text-[10px] font-bold">FAILED</span>
              </div>
              <div className="flex items-center justify-between p-2 rounded bg-amber-100/60 dark:bg-amber-950/40 text-amber-700 dark:text-amber-300 border border-amber-200 dark:border-amber-900/40">
                <span className="font-semibold truncate">salesforce_crm_etl</span>
                <span className="text-[10px] font-bold">DELAYED</span>
              </div>
              <div className="flex items-center justify-between p-2 rounded bg-emerald-100/40 dark:bg-emerald-950/20 text-emerald-700 dark:text-emerald-300">
                <span className="font-medium truncate">kafka_clickstream</span>
                <span className="text-[10px] font-bold">OK (14k/s)</span>
              </div>
            </div>
          </div>

          {/* Layer 2: Transformation & dbt Marts */}
          <div
            onClick={() => setActiveTab("dashboards")}
            className="p-4 rounded-xl border border-slate-200 dark:border-slate-800 bg-slate-50/50 dark:bg-slate-800/40 hover:bg-slate-100/70 dark:hover:bg-slate-800/80 transition-colors cursor-pointer space-y-2.5"
          >
            <div className="flex items-center justify-between">
              <span className="text-[11px] font-bold uppercase tracking-wider text-slate-500 dark:text-slate-400">
                2. Semantic Layer
              </span>
              <span className="text-[10px] font-bold px-2 py-0.5 rounded-full bg-amber-100 text-amber-700 dark:bg-amber-900/50 dark:text-amber-300">
                3 Conflicts
              </span>
            </div>
            <div className="space-y-1.5 text-xs">
              <div className="flex items-center justify-between p-2 rounded bg-red-100/60 dark:bg-red-950/40 text-red-700 dark:text-red-300 border border-red-200 dark:border-red-900/40">
                <span className="font-semibold truncate">fact_arr_transactions</span>
                <span className="text-[10px] font-bold">14k NULLS</span>
              </div>
              <div className="flex items-center justify-between p-2 rounded bg-amber-100/60 dark:bg-amber-950/40 text-amber-700 dark:text-amber-300 border border-amber-200 dark:border-amber-900/40">
                <span className="font-semibold truncate">Net ARR Definition</span>
                <span className="text-[10px] font-bold">$1.2M GAP</span>
              </div>
              <div className="flex items-center justify-between p-2 rounded bg-emerald-100/40 dark:bg-emerald-950/20 text-emerald-700 dark:text-emerald-300">
                <span className="font-medium truncate">Gross Margin %</span>
                <span className="text-[10px] font-bold">LOCKED</span>
              </div>
            </div>
          </div>

          {/* Layer 3: Consuming Business Dashboards */}
          <div
            onClick={() => setActiveTab("dashboards")}
            className="p-4 rounded-xl border border-slate-200 dark:border-slate-800 bg-slate-50/50 dark:bg-slate-800/40 hover:bg-slate-100/70 dark:hover:bg-slate-800/80 transition-colors cursor-pointer space-y-2.5"
          >
            <div className="flex items-center justify-between">
              <span className="text-[11px] font-bold uppercase tracking-wider text-slate-500 dark:text-slate-400">
                3. Business Dashboards
              </span>
              <span className="text-[10px] font-bold px-2 py-0.5 rounded-full bg-red-100 text-red-700 dark:bg-red-900/50 dark:text-red-300">
                Score: 48 Stale
              </span>
            </div>
            <div className="space-y-1.5 text-xs">
              <div className="flex items-center justify-between p-2 rounded bg-red-100/60 dark:bg-red-950/40 text-red-700 dark:text-red-300 border border-red-200 dark:border-red-900/40">
                <span className="font-semibold truncate">Exec Revenue & ARR</span>
                <span className="text-[10px] font-bold">48 / 100</span>
              </div>
              <div className="flex items-center justify-between p-2 rounded bg-amber-100/60 dark:bg-amber-950/40 text-amber-700 dark:text-amber-300 border border-amber-200 dark:border-amber-900/40">
                <span className="font-semibold truncate">Sales Rep Quotas</span>
                <span className="text-[10px] font-bold">68 / 100</span>
              </div>
              <div className="flex items-center justify-between p-2 rounded bg-emerald-100/40 dark:bg-emerald-950/20 text-emerald-700 dark:text-emerald-300">
                <span className="font-medium truncate">Product DAU & Ret.</span>
                <span className="text-[10px] font-bold">96 / 100</span>
              </div>
            </div>
          </div>

          {/* Layer 4: Cost & Governance */}
          <div
            onClick={() => setActiveTab("cost")}
            className="p-4 rounded-xl border border-slate-200 dark:border-slate-800 bg-slate-50/50 dark:bg-slate-800/40 hover:bg-slate-100/70 dark:hover:bg-slate-800/80 transition-colors cursor-pointer space-y-2.5"
          >
            <div className="flex items-center justify-between">
              <span className="text-[11px] font-bold uppercase tracking-wider text-slate-500 dark:text-slate-400">
                4. Cost Governance
              </span>
              <span className="text-[10px] font-bold px-2 py-0.5 rounded-full bg-purple-100 text-purple-700 dark:bg-purple-900/50 dark:text-purple-300">
                $54.8k / mo
              </span>
            </div>
            <div className="space-y-1.5 text-xs">
              <div className="flex items-center justify-between p-2 rounded bg-red-100/60 dark:bg-red-950/40 text-red-700 dark:text-red-300 border border-red-200 dark:border-red-900/40">
                <span className="font-semibold truncate">BI_ANALYTICS_XL</span>
                <span className="text-[10px] font-bold">6.8% CPU (Waste)</span>
              </div>
              <div className="flex items-center justify-between p-2 rounded bg-amber-100/60 dark:bg-amber-950/40 text-amber-700 dark:text-amber-300 border border-amber-200 dark:border-amber-900/40">
                <span className="font-semibold truncate">Zombie Tableau Dash</span>
                <span className="text-[10px] font-bold">0 VIEWS (90d)</span>
              </div>
              <div className="flex items-center justify-between p-2 rounded bg-emerald-100/40 dark:bg-emerald-950/20 text-emerald-700 dark:text-emerald-300">
                <span className="font-medium truncate">Potential Savings</span>
                <span className="text-[10px] font-bold">$7,820 / mo</span>
              </div>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};
