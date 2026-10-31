import React, { useState } from "react";
import { useApp } from "../context/AppContext";
import {
  Layers,
  AlertTriangle,
  CheckCircle2,
  Clock,
  RefreshCw,
  Search,
  Filter,
  Flame,
  ArrowRight,
  ExternalLink,
  ChevronDown,
  Terminal,
  Bell,
  Play,
  Cpu,
  ShieldAlert,
  ArrowUpRight,
  Check
} from "lucide-react";

export const PipelineHealth = () => {
  const {
    pipelines,
    setPipelines,
    dashboards,
    setActiveTab,
    setSelectedDashboard,
    setIsAlertModalOpen,
    setActiveSlackAlert,
    applyDemoFix,
    selectedPipeline,
    setSelectedPipeline
  } = useApp();

  const [statusFilter, setStatusFilter] = useState("all");
  const [layerFilter, setLayerFilter] = useState("all");
  const [searchQuery, setSearchQuery] = useState("");
  const [showMorningAfter, setShowMorningAfter] = useState(true);
  const [retryingId, setRetryingId] = useState(null);
  const [patchApplied, setPatchApplied] = useState(false);

  // Filtered pipelines
  const filteredPipelines = pipelines.filter((p) => {
    const matchesStatus =
      statusFilter === "all" ||
      (statusFilter === "failed" && p.status === "failed") ||
      (statusFilter === "delayed" && p.status === "delayed") ||
      (statusFilter === "at_risk" && (p.status === "at_risk" || p.riskScore === "high" || p.riskScore === "critical")) ||
      (statusFilter === "healthy" && p.status === "healthy");

    const matchesLayer = layerFilter === "all" || p.layer.toLowerCase() === layerFilter.toLowerCase();
    const matchesSearch =
      p.displayName.toLowerCase().includes(searchQuery.toLowerCase()) ||
      p.name.toLowerCase().includes(searchQuery.toLowerCase()) ||
      p.owner.name.toLowerCase().includes(searchQuery.toLowerCase());

    return matchesStatus && matchesLayer && matchesSearch;
  });

  // Failed pipelines for Morning-After view
  const failedPipelines = pipelines.filter((p) => p.status === "failed");

  // Handle manual retry
  const handleRetryPipeline = (pipelineId) => {
    setRetryingId(pipelineId);
    setTimeout(() => {
      setPipelines((prev) =>
        prev.map((p) =>
          p.id === pipelineId
            ? {
                ...p,
                retries: p.retries + 1,
                lastRun: "Just now (Retry completed)",
                logs: [
                  ...p.logs,
                  `[${new Date().toLocaleTimeString()}] Manual retry dispatched by operator.`,
                  `[${new Date().toLocaleTimeString()}] Validating dependencies and re-executing task...`
                ]
              }
            : p
        )
      );
      setRetryingId(null);
    }, 1200);
  };

  const handleApplyFix = () => {
    setPatchApplied(true);
    applyDemoFix();
    setTimeout(() => setPatchApplied(false), 4000);
  };

  return (
    <div className="space-y-6 pb-12">
      {/* Top Header & Overview */}
      <div className="flex flex-col md:flex-row md:items-center justify-between gap-4">
        <div>
          <h1 className="text-2xl font-bold tracking-tight text-slate-900 dark:text-white flex items-center gap-2">
            <Layers className="w-6 h-6 text-blue-600 dark:text-blue-400" />
            Pipeline Health & Failure Prediction
          </h1>
          <p className="text-xs sm:text-sm text-slate-500 dark:text-slate-400">
            Monitor real-time ETL/ELT runs, predictive failure risks, morning-after incident triage, and downstream blast radiuses.
          </p>
        </div>

        <div className="flex items-center gap-2 flex-wrap">
          <button
            onClick={() => setShowMorningAfter(!showMorningAfter)}
            className={`px-3 py-1.5 text-xs font-semibold rounded-lg border transition-colors flex items-center gap-1.5 ${
              showMorningAfter
                ? "bg-red-50 text-red-700 border-red-200 dark:bg-red-950/60 dark:text-red-300 dark:border-red-900"
                : "bg-white text-slate-700 border-slate-300 dark:bg-slate-800 dark:text-slate-300 dark:border-slate-700"
            }`}
          >
            <Flame className="w-3.5 h-3.5" />
            <span>Morning-After View</span>
            {failedPipelines.length > 0 && (
              <span className="w-2 h-2 rounded-full bg-red-500 animate-ping" />
            )}
          </button>

          <button
            onClick={() => {
              setActiveSlackAlert({
                channel: "#data-incidents",
                severity: "P1 - CRITICAL",
                title: "Alert Rules & Notification Center",
                summary: "Rule: Trigger Slack notification when pipeline fails or exceeds SLA duration by >50%.",
                impactedDashboards: ["Executive Revenue & ARR Overview", "Sales Rep Performance"],
                timestamp: "Last triggered: 03:17 AM",
                actions: ["Send Test Webhook", "Edit Rule Thresholds", "Mute Channel (2h)"]
              });
              setIsAlertModalOpen(true);
            }}
            className="px-3 py-1.5 text-xs font-semibold rounded-lg bg-blue-600 hover:bg-blue-700 text-white shadow-sm transition-colors flex items-center gap-1.5"
          >
            <Bell className="w-3.5 h-3.5" />
            <span>Alert Rules & Slack Preview</span>
          </button>
        </div>
      </div>

      {/* Morning-After Incident View Banner */}
      {showMorningAfter && failedPipelines.length > 0 && (
        <div className="p-5 sm:p-6 rounded-2xl bg-gradient-to-br from-red-950/40 via-red-900/20 to-slate-900 border border-red-800/60 shadow-lg text-slate-100 space-y-4">
          <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-3">
            <div className="flex items-center gap-2.5">
              <div className="p-2 rounded-xl bg-red-600/30 border border-red-500/40 text-red-400">
                <Flame className="w-5 h-5 animate-pulse" />
              </div>
              <div>
                <div className="flex items-center gap-2">
                  <h2 className="text-base font-bold text-white">
                    Morning-After View: What Broke Overnight
                  </h2>
                  <span className="text-[10px] uppercase font-bold tracking-wider px-2 py-0.5 rounded bg-red-500 text-white">
                    {failedPipelines.length} Failures Detected
                  </span>
                </div>
                <p className="text-xs text-red-200/80">
                  Incident window: 03:00 AM – 04:30 AM UTC • Root cause isolated with automated remediation available.
                </p>
              </div>
            </div>

            <button
              onClick={handleApplyFix}
              disabled={patchApplied}
              className="px-4 py-2 rounded-xl bg-gradient-to-r from-emerald-600 to-teal-600 hover:from-emerald-500 hover:to-teal-500 text-white font-semibold text-xs shadow-md shadow-emerald-900/40 transition-all flex items-center gap-1.5 self-start sm:self-auto cursor-pointer"
            >
              {patchApplied ? (
                <>
                  <Check className="w-4 h-4 text-emerald-200" />
                  <span>Patch Applied & Pipeline Healed!</span>
                </>
              ) : (
                <>
                  <RefreshCw className="w-4 h-4" />
                  <span>Apply Suggested Fix & Re-run All</span>
                </>
              )}
            </button>
          </div>

          <div className="grid grid-cols-1 lg:grid-cols-2 gap-4 pt-2">
            {failedPipelines.map((fail) => (
              <div
                key={fail.id}
                className="p-4 rounded-xl bg-black/40 border border-red-900/50 space-y-3"
              >
                <div className="flex items-start justify-between">
                  <div>
                    <span className="text-[11px] font-mono text-red-400">
                      {fail.name}
                    </span>
                    <h3 className="text-sm font-semibold text-white">
                      {fail.displayName}
                    </h3>
                  </div>
                  <span className="text-[10px] font-bold px-2 py-0.5 rounded bg-red-900/80 text-red-200 border border-red-700/50">
                    Failed at {fail.lastRun}
                  </span>
                </div>

                <div className="space-y-1.5 text-xs">
                  <div className="p-2 rounded bg-red-950/70 border border-red-800/40 text-red-200 font-mono text-[11px]">
                    <span className="font-bold text-red-400">Error: </span>
                    {fail.errorSummary}
                  </div>

                  <div className="p-2 rounded bg-emerald-950/40 border border-emerald-800/40 text-emerald-200 text-[11px]">
                    <span className="font-bold text-emerald-400">Suggested Fix: </span>
                    {fail.suggestedFix}
                  </div>
                </div>

                <div className="flex items-center justify-between text-xs pt-1 border-t border-red-950/80">
                  <span className="text-slate-400 text-[11px]">
                    Downstream Blast Radius:
                  </span>
                  <div className="flex items-center gap-1.5">
                    {fail.downstreamDashboards.map((dash) => (
                      <span
                        key={dash.id}
                        onClick={() => {
                          setActiveTab("dashboards");
                          const d = dashboards.find((x) => x.id === dash.id);
                          if (d) setSelectedDashboard(d);
                        }}
                        className="text-[10px] px-2 py-0.5 rounded bg-red-900/40 text-red-300 border border-red-800/40 hover:underline cursor-pointer"
                      >
                        {dash.name}
                      </span>
                    ))}
                  </div>
                </div>
              </div>
            ))}
          </div>
        </div>
      )}

      {/* Filter and Search Bar */}
      <div className="flex flex-col sm:flex-row items-stretch sm:items-center justify-between gap-3 p-4 rounded-xl bg-white dark:bg-slate-900 border border-slate-200 dark:border-slate-800 shadow-sm">
        {/* Search */}
        <div className="relative flex-1 max-w-md">
          <Search className="w-4 h-4 absolute left-3 top-3 text-slate-400" />
          <input
            type="text"
            value={searchQuery}
            onChange={(e) => setSearchQuery(e.target.value)}
            placeholder="Search 14 pipelines by name, owner, or layer..."
            className="w-full pl-9 pr-3 py-2 text-xs rounded-lg bg-slate-50 dark:bg-slate-800 border border-slate-200 dark:border-slate-700 focus:outline-none focus:ring-2 focus:ring-blue-500 dark:text-white"
          />
        </div>

        {/* Filters */}
        <div className="flex items-center gap-2 flex-wrap">
          {/* Status Filter */}
          <div className="flex items-center gap-1 text-xs">
            <span className="text-slate-500 dark:text-slate-400 text-[11px]">Status:</span>
            <select
              value={statusFilter}
              onChange={(e) => setStatusFilter(e.target.value)}
              className="text-xs font-medium py-1.5 px-2 rounded-lg bg-slate-50 dark:bg-slate-800 border border-slate-200 dark:border-slate-700 text-slate-700 dark:text-slate-300 focus:outline-none cursor-pointer"
            >
              <option value="all">All Statuses ({pipelines.length})</option>
              <option value="failed">Failed ({pipelines.filter((p) => p.status === "failed").length})</option>
              <option value="delayed">Delayed ({pipelines.filter((p) => p.status === "delayed").length})</option>
              <option value="at_risk">At Risk ({pipelines.filter((p) => p.status === "at_risk" || p.riskScore === "high").length})</option>
              <option value="healthy">Healthy ({pipelines.filter((p) => p.status === "healthy").length})</option>
            </select>
          </div>

          {/* Layer Filter */}
          <div className="flex items-center gap-1 text-xs">
            <span className="text-slate-500 dark:text-slate-400 text-[11px]">Layer:</span>
            <select
              value={layerFilter}
              onChange={(e) => setLayerFilter(e.target.value)}
              className="text-xs font-medium py-1.5 px-2 rounded-lg bg-slate-50 dark:bg-slate-800 border border-slate-200 dark:border-slate-700 text-slate-700 dark:text-slate-300 focus:outline-none cursor-pointer"
            >
              <option value="all">All Layers</option>
              <option value="bronze">Bronze (Raw Ingest)</option>
              <option value="silver">Silver (Cleansed)</option>
              <option value="gold">Gold (Marts)</option>
              <option value="ml">ML / Feature Store</option>
            </select>
          </div>
        </div>
      </div>

      {/* Pipelines List / Cards */}
      <div className="space-y-3">
        {filteredPipelines.map((pipeline) => {
          const isFailed = pipeline.status === "failed";
          const isDelayed = pipeline.status === "delayed";
          const isAtRisk = pipeline.status === "at_risk" || pipeline.riskScore === "high" || pipeline.riskScore === "critical";
          const isHealthy = pipeline.status === "healthy";

          return (
            <div
              key={pipeline.id}
              className={`p-4 sm:p-5 rounded-xl border transition-all ${
                isFailed
                  ? "bg-red-50/40 dark:bg-red-950/20 border-red-300 dark:border-red-900/60 shadow-sm"
                  : isDelayed
                  ? "bg-amber-50/40 dark:bg-amber-950/20 border-amber-300 dark:border-amber-900/60"
                  : isAtRisk
                  ? "bg-orange-50/30 dark:bg-orange-950/20 border-orange-200 dark:border-orange-900/40"
                  : "bg-white dark:bg-slate-900 border-slate-200 dark:border-slate-800 hover:border-slate-300 dark:hover:border-slate-700"
              }`}
            >
              <div className="flex flex-col lg:flex-row lg:items-center justify-between gap-4">
                {/* Pipeline Info */}
                <div className="space-y-1.5 max-w-xl">
                  <div className="flex items-center gap-2 flex-wrap">
                    {/* Status Pill */}
                    <span
                      className={`inline-flex items-center gap-1 text-[11px] font-bold px-2.5 py-0.5 rounded-full ${
                        isFailed
                          ? "bg-red-600 text-white"
                          : isDelayed
                          ? "bg-amber-500 text-white"
                          : isAtRisk
                          ? "bg-orange-500 text-white"
                          : "bg-emerald-600 text-white"
                      }`}
                    >
                      {isFailed && <AlertTriangle className="w-3 h-3" />}
                      {isDelayed && <Clock className="w-3 h-3" />}
                      {isAtRisk && <AlertTriangle className="w-3 h-3" />}
                      {isHealthy && <CheckCircle2 className="w-3 h-3" />}
                      <span className="uppercase tracking-wider">
                        {pipeline.status.replace("_", " ")}
                      </span>
                    </span>

                    {/* Layer Tag */}
                    <span className="text-[10px] font-bold uppercase tracking-wider px-2 py-0.5 rounded bg-slate-100 text-slate-700 dark:bg-slate-800 dark:text-slate-300 border border-slate-200 dark:border-slate-700">
                      Layer: {pipeline.layer}
                    </span>

                    {/* Failure Prediction Badge */}
                    <span
                      className={`text-[10px] font-bold uppercase tracking-wider px-2 py-0.5 rounded flex items-center gap-1 ${
                        pipeline.riskScore === "critical"
                          ? "bg-red-100 text-red-800 dark:bg-red-950 dark:text-red-300 border border-red-300 dark:border-red-800"
                          : pipeline.riskScore === "high"
                          ? "bg-amber-100 text-amber-800 dark:bg-amber-950 dark:text-amber-300 border border-amber-300 dark:border-amber-800"
                          : "bg-emerald-100 text-emerald-800 dark:bg-emerald-950 dark:text-emerald-300"
                      }`}
                      title={pipeline.riskFactors?.join(", ")}
                    >
                      <Cpu className="w-3 h-3" />
                      Risk: {pipeline.riskScore}
                    </span>

                    {/* Retries */}
                    {pipeline.retries > 0 && (
                      <span className="text-[10px] font-semibold px-1.5 py-0.5 rounded bg-red-100 text-red-700 dark:bg-red-900/60 dark:text-red-300">
                        {pipeline.retries} retries
                      </span>
                    )}
                  </div>

                  <div className="flex items-baseline gap-2">
                    <h3 className="text-base font-bold text-slate-900 dark:text-white">
                      {pipeline.displayName}
                    </h3>
                    <span className="font-mono text-xs text-slate-400">
                      {pipeline.name}
                    </span>
                  </div>

                  {/* Risk Factors / Error Note */}
                  {pipeline.errorSummary ? (
                    <p className="text-xs text-red-600 dark:text-red-400 font-mono">
                      {pipeline.errorSummary}
                    </p>
                  ) : pipeline.riskFactors && pipeline.riskFactors.length > 0 && pipeline.riskScore !== "low" ? (
                    <div className="flex items-center gap-1.5 text-xs text-amber-700 dark:text-amber-300">
                      <AlertTriangle className="w-3.5 h-3.5 shrink-0" />
                      <span>{pipeline.riskFactors[0]}</span>
                    </div>
                  ) : null}

                  {/* Downstream Blast Radius */}
                  <div className="flex items-center gap-1.5 text-xs pt-1 flex-wrap">
                    <span className="text-slate-500 dark:text-slate-400 font-medium text-[11px]">
                      Downstream Dashboards:
                    </span>
                    {pipeline.downstreamDashboards.map((dash) => (
                      <button
                        key={dash.id}
                        onClick={() => {
                          setActiveTab("dashboards");
                          const d = dashboards.find((x) => x.id === dash.id);
                          if (d) setSelectedDashboard(d);
                        }}
                        className={`text-[10px] font-semibold px-2 py-0.5 rounded transition-colors ${
                          dash.critical
                            ? "bg-red-100 text-red-800 dark:bg-red-950 dark:text-red-300 hover:bg-red-200"
                            : "bg-slate-100 text-slate-700 dark:bg-slate-800 dark:text-slate-300 hover:bg-slate-200"
                        }`}
                      >
                        {dash.name} {dash.critical && "⚠️"}
                      </button>
                    ))}
                  </div>
                </div>

                {/* Right Metadata & Interactive Controls */}
                <div className="flex flex-col sm:flex-row lg:flex-col items-start lg:items-end justify-between gap-3 shrink-0 text-xs">
                  <div className="space-y-1 text-left lg:text-right">
                    <div className="text-slate-600 dark:text-slate-300">
                      <span className="text-slate-400">Last run: </span>
                      <span className="font-semibold">{pipeline.lastRun}</span>
                    </div>
                    <div className="text-slate-500 dark:text-slate-400">
                      <span>Duration: {pipeline.duration} </span>
                      <span className="text-slate-400 font-mono text-[11px]">
                        ({pipeline.runtimeTrend})
                      </span>
                    </div>
                    <div className="text-slate-500 dark:text-slate-400 flex items-center lg:justify-end gap-1.5 pt-0.5">
                      <span className="w-4 h-4 rounded-full bg-slate-200 dark:bg-slate-700 flex items-center justify-center text-[9px] font-bold text-slate-700 dark:text-slate-200">
                        {pipeline.owner.avatar}
                      </span>
                      <span>{pipeline.owner.name}</span>
                    </div>
                  </div>

                  {/* Actions */}
                  <div className="flex items-center gap-2 pt-1">
                    <button
                      onClick={() => setSelectedPipeline(pipeline)}
                      className="px-2.5 py-1.5 rounded-lg text-xs font-semibold bg-slate-100 hover:bg-slate-200 dark:bg-slate-800 dark:hover:bg-slate-700 text-slate-800 dark:text-slate-200 transition-colors flex items-center gap-1"
                    >
                      <Terminal className="w-3.5 h-3.5" />
                      <span>Inspect Logs</span>
                    </button>

                    <button
                      onClick={() => handleRetryPipeline(pipeline.id)}
                      disabled={retryingId === pipeline.id}
                      className="px-2.5 py-1.5 rounded-lg text-xs font-semibold bg-blue-50 hover:bg-blue-100 dark:bg-blue-950/60 dark:hover:bg-blue-900/60 text-blue-700 dark:text-blue-300 border border-blue-200 dark:border-blue-800 transition-colors flex items-center gap-1 cursor-pointer"
                    >
                      <RefreshCw className={`w-3.5 h-3.5 ${retryingId === pipeline.id ? "animate-spin" : ""}`} />
                      <span>{retryingId === pipeline.id ? "Retrying..." : "Retry Run"}</span>
                    </button>
                  </div>
                </div>
              </div>
            </div>
          );
        })}
      </div>

      {/* Terminal Logs Modal */}
      {selectedPipeline && (
        <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-black/60 backdrop-blur-sm">
          <div className="w-full max-w-3xl rounded-2xl bg-slate-950 border border-slate-800 text-slate-200 shadow-2xl overflow-hidden flex flex-col max-h-[85vh]">
            {/* Modal Header */}
            <div className="p-4 border-b border-slate-800 flex items-center justify-between bg-slate-900">
              <div className="flex items-center gap-2">
                <Terminal className="w-5 h-5 text-blue-400" />
                <div>
                  <h3 className="text-sm font-bold text-white">
                    Logs: {selectedPipeline.name}
                  </h3>
                  <p className="text-[11px] text-slate-400">
                    Execution ID: run_20261031_031402 • Status: {selectedPipeline.status.toUpperCase()}
                  </p>
                </div>
              </div>
              <button
                onClick={() => setSelectedPipeline(null)}
                className="text-slate-400 hover:text-white text-xs px-2.5 py-1 rounded-lg bg-slate-800 hover:bg-slate-700"
              >
                Close (ESC)
              </button>
            </div>

            {/* Terminal Body */}
            <div className="p-4 overflow-y-auto font-mono text-xs space-y-1.5 bg-black/90 flex-1 leading-relaxed">
              <div className="text-slate-500 pb-2">
                # Container: kubernetes://pod/dbt-runner-prod-824 • Image: platformpulse/etl-runner:v2.14
              </div>
              {selectedPipeline.logs.map((log, index) => {
                const isErr = log.includes("ERROR") || log.includes("CRITICAL") || log.includes("FAILED");
                const isWarn = log.includes("Warning") || log.includes("Retry");
                const isSuccess = log.includes("Success") || log.includes("Restored");

                return (
                  <div
                    key={index}
                    className={`${
                      isErr
                        ? "text-red-400 bg-red-950/30 px-1 rounded"
                        : isWarn
                        ? "text-amber-400"
                        : isSuccess
                        ? "text-emerald-400 font-semibold"
                        : "text-slate-300"
                    }`}
                  >
                    {log}
                  </div>
                );
              })}
            </div>

            {/* Modal Footer */}
            <div className="p-4 border-t border-slate-800 bg-slate-900 flex items-center justify-between text-xs">
              <div className="text-slate-400">
                Owner: {selectedPipeline.owner.name} ({selectedPipeline.owner.email})
              </div>
              <div className="flex items-center gap-2">
                {selectedPipeline.status === "failed" && (
                  <button
                    onClick={() => {
                      applyDemoFix();
                      setSelectedPipeline((prev) => ({
                        ...prev,
                        status: "healthy",
                        logs: [
                          ...prev.logs,
                          "[Fix Applied] Hotfix migration executed.",
                          "[Success] Pipeline running in HEALTHY state."
                        ]
                      }));
                    }}
                    className="px-3 py-1.5 rounded-lg bg-emerald-600 hover:bg-emerald-500 text-white font-semibold flex items-center gap-1"
                  >
                    <RefreshCw className="w-3.5 h-3.5" />
                    <span>Apply Suggested Hotfix</span>
                  </button>
                )}
                <button
                  onClick={() => setSelectedPipeline(null)}
                  className="px-3 py-1.5 rounded-lg bg-slate-800 hover:bg-slate-700 text-white font-semibold"
                >
                  Done
                </button>
              </div>
            </div>
          </div>
        </div>
      )}
    </div>
  );
};
