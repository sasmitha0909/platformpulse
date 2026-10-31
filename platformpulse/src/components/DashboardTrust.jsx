import React, { useState } from "react";
import { useApp } from "../context/AppContext";
import {
  ShieldCheck,
  ShieldAlert,
  AlertTriangle,
  CheckCircle2,
  Clock,
  ExternalLink,
  Search,
  Filter,
  Layers,
  BookOpen,
  ArrowRight,
  TrendingDown,
  Info,
  Check,
  XCircle,
  HelpCircle,
  Eye,
  SlidersHorizontal,
  ChevronRight
} from "lucide-react";

export const DashboardTrust = () => {
  const {
    dashboards,
    pipelines,
    metricGlossary,
    setActiveTab,
    setSelectedPipeline,
    selectedDashboard,
    setSelectedDashboard
  } = useApp();

  const [activeSubTab, setActiveSubTab] = useState("dashboards"); // 'dashboards' | 'glossary'
  const [searchQuery, setSearchQuery] = useState("");
  const [statusFilter, setStatusFilter] = useState("all");
  const [departmentFilter, setDepartmentFilter] = useState("all");
  const [standardizedMetrics, setStandardizedMetrics] = useState({});

  // Filtered dashboards
  const filteredDashboards = dashboards.filter((d) => {
    const matchesStatus =
      statusFilter === "all" ||
      (statusFilter === "trusted" && d.status === "trusted") ||
      (statusFilter === "caution" && d.status === "caution") ||
      (statusFilter === "stale" && d.status === "stale");

    const matchesDept =
      departmentFilter === "all" ||
      d.department.toLowerCase().includes(departmentFilter.toLowerCase());

    const matchesSearch =
      d.name.toLowerCase().includes(searchQuery.toLowerCase()) ||
      d.owner.toLowerCase().includes(searchQuery.toLowerCase()) ||
      d.department.toLowerCase().includes(searchQuery.toLowerCase());

    return matchesStatus && matchesDept && matchesSearch;
  });

  const handleStandardizeMetric = (metricId) => {
    setStandardizedMetrics((prev) => ({
      ...prev,
      [metricId]: true
    }));
  };

  return (
    <div className="space-y-6 pb-12">
      {/* Top Header */}
      <div className="flex flex-col md:flex-row md:items-center justify-between gap-4">
        <div>
          <h1 className="text-2xl font-bold tracking-tight text-slate-900 dark:text-white flex items-center gap-2">
            <ShieldCheck className="w-6 h-6 text-emerald-600 dark:text-emerald-400" />
            Dashboard Trust Score & Metric Governance
          </h1>
          <p className="text-xs sm:text-sm text-slate-500 dark:text-slate-400">
            Automated trust certification (0–100) combining data freshness, upstream pipeline SLAs, schema changes, null anomalies, and KPI definition consistency.
          </p>
        </div>

        {/* Sub-tab Switcher: Dashboards vs Metric Glossary */}
        <div className="flex items-center p-1 rounded-xl bg-slate-100 dark:bg-slate-800 border border-slate-200 dark:border-slate-700 self-start md:self-auto">
          <button
            onClick={() => setActiveSubTab("dashboards")}
            className={`px-3 py-1.5 rounded-lg text-xs font-semibold transition-all flex items-center gap-1.5 ${
              activeSubTab === "dashboards"
                ? "bg-white text-slate-900 dark:bg-slate-700 dark:text-white shadow-sm"
                : "text-slate-600 dark:text-slate-400 hover:text-slate-900"
            }`}
          >
            <ShieldCheck className="w-3.5 h-3.5" />
            <span>Dashboard Directory ({dashboards.length})</span>
          </button>
          <button
            onClick={() => setActiveSubTab("glossary")}
            className={`px-3 py-1.5 rounded-lg text-xs font-semibold transition-all flex items-center gap-1.5 ${
              activeSubTab === "glossary"
                ? "bg-white text-slate-900 dark:bg-slate-700 dark:text-white shadow-sm"
                : "text-slate-600 dark:text-slate-400 hover:text-slate-900"
            }`}
          >
            <BookOpen className="w-3.5 h-3.5" />
            <span>Metric Glossary & Conflicts (4)</span>
            <span className="w-2 h-2 rounded-full bg-red-500 animate-pulse" />
          </button>
        </div>
      </div>

      {/* VIEW 1: DASHBOARD DIRECTORY */}
      {activeSubTab === "dashboards" && (
        <div className="space-y-5">
          {/* Summary Health Bar */}
          <div className="grid grid-cols-1 sm:grid-cols-3 gap-4">
            <div className="p-4 rounded-xl bg-emerald-50/50 dark:bg-emerald-950/20 border border-emerald-200 dark:border-emerald-900/40 flex items-center justify-between">
              <div>
                <span className="text-xs font-semibold text-emerald-800 dark:text-emerald-300">
                  Trusted Dashboards (85–100)
                </span>
                <p className="text-2xl font-bold text-emerald-700 dark:text-emerald-400">
                  {dashboards.filter((d) => d.status === "trusted").length} of {dashboards.length}
                </p>
                <p className="text-[11px] text-emerald-600/80 dark:text-emerald-400/70">
                  Fresh, validated, verified definitions
                </p>
              </div>
              <CheckCircle2 className="w-8 h-8 text-emerald-500/40" />
            </div>

            <div className="p-4 rounded-xl bg-amber-50/50 dark:bg-amber-950/20 border border-amber-200 dark:border-amber-900/40 flex items-center justify-between">
              <div>
                <span className="text-xs font-semibold text-amber-800 dark:text-amber-300">
                  Use With Caution (60–84)
                </span>
                <p className="text-2xl font-bold text-amber-700 dark:text-amber-400">
                  {dashboards.filter((d) => d.status === "caution").length} of {dashboards.length}
                </p>
                <p className="text-[11px] text-amber-600/80 dark:text-amber-400/70">
                  Minor sync delays or metric variances
                </p>
              </div>
              <AlertTriangle className="w-8 h-8 text-amber-500/40" />
            </div>

            <div className="p-4 rounded-xl bg-red-50/50 dark:bg-red-950/20 border border-red-200 dark:border-red-900/40 flex items-center justify-between">
              <div>
                <span className="text-xs font-semibold text-red-800 dark:text-red-300">
                  Stale / High Risk (&lt;60)
                </span>
                <p className="text-2xl font-bold text-red-700 dark:text-red-400">
                  {dashboards.filter((d) => d.status === "stale").length} of {dashboards.length}
                </p>
                <p className="text-[11px] text-red-600/80 dark:text-red-400/70">
                  Upstream pipeline failure or null spikes
                </p>
              </div>
              <XCircle className="w-8 h-8 text-red-500/40" />
            </div>
          </div>

          {/* Search and Filters */}
          <div className="flex flex-col sm:flex-row items-stretch sm:items-center justify-between gap-3 p-4 rounded-xl bg-white dark:bg-slate-900 border border-slate-200 dark:border-slate-800 shadow-sm">
            <div className="relative flex-1 max-w-md">
              <Search className="w-4 h-4 absolute left-3 top-3 text-slate-400" />
              <input
                type="text"
                value={searchQuery}
                onChange={(e) => setSearchQuery(e.target.value)}
                placeholder="Search dashboards by name, owner, department..."
                className="w-full pl-9 pr-3 py-2 text-xs rounded-lg bg-slate-50 dark:bg-slate-800 border border-slate-200 dark:border-slate-700 focus:outline-none focus:ring-2 focus:ring-blue-500 dark:text-white"
              />
            </div>

            <div className="flex items-center gap-2">
              <select
                value={statusFilter}
                onChange={(e) => setStatusFilter(e.target.value)}
                className="text-xs font-medium py-1.5 px-2 rounded-lg bg-slate-50 dark:bg-slate-800 border border-slate-200 dark:border-slate-700 text-slate-700 dark:text-slate-300 focus:outline-none cursor-pointer"
              >
                <option value="all">All Trust Levels</option>
                <option value="trusted">Trusted (&ge;85)</option>
                <option value="caution">Use with Caution (60-84)</option>
                <option value="stale">Stale (&lt;60)</option>
              </select>

              <select
                value={departmentFilter}
                onChange={(e) => setDepartmentFilter(e.target.value)}
                className="text-xs font-medium py-1.5 px-2 rounded-lg bg-slate-50 dark:bg-slate-800 border border-slate-200 dark:border-slate-700 text-slate-700 dark:text-slate-300 focus:outline-none cursor-pointer"
              >
                <option value="all">All Departments</option>
                <option value="Executive">Executive & Finance</option>
                <option value="Sales">Sales Ops</option>
                <option value="Product">Product Growth</option>
                <option value="Marketing">Marketing</option>
              </select>
            </div>
          </div>

          {/* Dashboards Cards Grid */}
          <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
            {filteredDashboards.map((dash) => {
              const isTrusted = dash.status === "trusted";
              const isCaution = dash.status === "caution";
              const isStale = dash.status === "stale";

              return (
                <div
                  key={dash.id}
                  className={`p-5 rounded-2xl border transition-all ${
                    isStale
                      ? "bg-red-50/30 dark:bg-red-950/20 border-red-300 dark:border-red-900/60 shadow-sm"
                      : isCaution
                      ? "bg-amber-50/20 dark:bg-amber-950/10 border-amber-200 dark:border-amber-900/40"
                      : "bg-white dark:bg-slate-900 border-slate-200 dark:border-slate-800"
                  }`}
                >
                  <div className="flex items-start justify-between gap-3">
                    <div className="space-y-1">
                      <div className="flex items-center gap-2 flex-wrap">
                        {/* Status Badge */}
                        <span
                          className={`inline-flex items-center gap-1 text-[11px] font-bold px-2.5 py-0.5 rounded-full ${
                            isTrusted
                              ? "bg-emerald-100 text-emerald-800 dark:bg-emerald-950 dark:text-emerald-300 border border-emerald-300 dark:border-emerald-800"
                              : isCaution
                              ? "bg-amber-100 text-amber-800 dark:bg-amber-950 dark:text-amber-300 border border-amber-300 dark:border-amber-800"
                              : "bg-red-100 text-red-800 dark:bg-red-950 dark:text-red-300 border border-red-300 dark:border-red-800"
                          }`}
                        >
                          {isTrusted && <CheckCircle2 className="w-3.5 h-3.5" />}
                          {isCaution && <AlertTriangle className="w-3.5 h-3.5" />}
                          {isStale && <XCircle className="w-3.5 h-3.5" />}
                          <span>
                            {isTrusted
                              ? "Trusted"
                              : isCaution
                              ? "Use with caution"
                              : "Stale / At Risk"}
                          </span>
                        </span>

                        {dash.isExecutive && (
                          <span className="text-[10px] uppercase font-bold tracking-wider px-2 py-0.5 rounded bg-purple-100 text-purple-700 dark:bg-purple-950 dark:text-purple-300">
                            C-Suite Asset
                          </span>
                        )}

                        <span className="text-[11px] text-slate-500 dark:text-slate-400">
                          {dash.department}
                        </span>
                      </div>

                      <h3 className="text-base font-bold text-slate-900 dark:text-white pt-1">
                        {dash.name}
                      </h3>
                      <p className="text-xs text-slate-500 dark:text-slate-400 flex items-center gap-1.5">
                        <Eye className="w-3.5 h-3.5" />
                        <span>{dash.viewersDaily} daily viewers</span>
                        <span>•</span>
                        <span>Owner: {dash.owner}</span>
                      </p>
                    </div>

                    {/* Circular / Large Score Badge */}
                    <div
                      className={`flex flex-col items-center justify-center w-16 h-16 rounded-2xl shrink-0 font-extrabold shadow-sm border ${
                        isTrusted
                          ? "bg-emerald-500/10 border-emerald-500/30 text-emerald-600 dark:text-emerald-400"
                          : isCaution
                          ? "bg-amber-500/10 border-amber-500/30 text-amber-600 dark:text-amber-400"
                          : "bg-red-500/10 border-red-500/30 text-red-600 dark:text-red-400 animate-pulse"
                      }`}
                    >
                      <span className="text-2xl tracking-tight leading-none">
                        {dash.score}
                      </span>
                      <span className="text-[9px] uppercase tracking-wider text-slate-500 dark:text-slate-400">
                        Trust Score
                      </span>
                    </div>
                  </div>

                  {/* 5-Dimension Score Progress Bars */}
                  <div className="mt-4 pt-3 border-t border-slate-100 dark:border-slate-800 space-y-2 text-xs">
                    <div className="flex items-center justify-between text-slate-500 dark:text-slate-400 text-[11px]">
                      <span>Dimension Reliability Breakdown:</span>
                      <span className="font-mono text-slate-700 dark:text-slate-300">
                        Freshness: {dash.lastSync}
                      </span>
                    </div>

                    <div className="grid grid-cols-5 gap-1.5">
                      {/* Freshness */}
                      <div className="space-y-1">
                        <div className="h-1.5 w-full bg-slate-200 dark:bg-slate-700 rounded-full overflow-hidden">
                          <div
                            className={`h-full rounded-full ${
                              dash.breakdown.freshness >= 80 ? "bg-emerald-500" : "bg-red-500"
                            }`}
                            style={{ width: `${dash.breakdown.freshness}%` }}
                          />
                        </div>
                        <div className="text-[9px] text-center text-slate-400 truncate">
                          Fresh ({dash.breakdown.freshness}%)
                        </div>
                      </div>

                      {/* Pipeline Reliability */}
                      <div className="space-y-1">
                        <div className="h-1.5 w-full bg-slate-200 dark:bg-slate-700 rounded-full overflow-hidden">
                          <div
                            className={`h-full rounded-full ${
                              dash.breakdown.pipelineReliability >= 80 ? "bg-emerald-500" : "bg-red-500"
                            }`}
                            style={{ width: `${dash.breakdown.pipelineReliability}%` }}
                          />
                        </div>
                        <div className="text-[9px] text-center text-slate-400 truncate">
                          Pipeline ({dash.breakdown.pipelineReliability}%)
                        </div>
                      </div>

                      {/* Schema Stability */}
                      <div className="space-y-1">
                        <div className="h-1.5 w-full bg-slate-200 dark:bg-slate-700 rounded-full overflow-hidden">
                          <div
                            className={`h-full rounded-full ${
                              dash.breakdown.schemaStability >= 80 ? "bg-emerald-500" : "bg-amber-500"
                            }`}
                            style={{ width: `${dash.breakdown.schemaStability}%` }}
                          />
                        </div>
                        <div className="text-[9px] text-center text-slate-400 truncate">
                          Schema ({dash.breakdown.schemaStability}%)
                        </div>
                      </div>

                      {/* Data Quality */}
                      <div className="space-y-1">
                        <div className="h-1.5 w-full bg-slate-200 dark:bg-slate-700 rounded-full overflow-hidden">
                          <div
                            className={`h-full rounded-full ${
                              dash.breakdown.dataQuality >= 80 ? "bg-emerald-500" : "bg-amber-500"
                            }`}
                            style={{ width: `${dash.breakdown.dataQuality}%` }}
                          />
                        </div>
                        <div className="text-[9px] text-center text-slate-400 truncate">
                          Quality ({dash.breakdown.dataQuality}%)
                        </div>
                      </div>

                      {/* Metric Consistency */}
                      <div className="space-y-1">
                        <div className="h-1.5 w-full bg-slate-200 dark:bg-slate-700 rounded-full overflow-hidden">
                          <div
                            className={`h-full rounded-full ${
                              dash.breakdown.metricConsistency >= 80 ? "bg-emerald-500" : "bg-red-500"
                            }`}
                            style={{ width: `${dash.breakdown.metricConsistency}%` }}
                          />
                        </div>
                        <div className="text-[9px] text-center text-slate-400 truncate">
                          Metric ({dash.breakdown.metricConsistency}%)
                        </div>
                      </div>
                    </div>
                  </div>

                  {/* Upstream Pipelines and Issues */}
                  <div className="mt-3 pt-3 border-t border-slate-100 dark:border-slate-800 flex items-center justify-between text-xs">
                    <div className="flex items-center gap-1.5 flex-wrap">
                      <span className="text-[11px] text-slate-400">Upstream:</span>
                      {dash.upstreamPipelines.map((pipeId) => {
                        const pipe = pipelines.find((p) => p.id === pipeId);
                        const isPipeFailed = pipe?.status === "failed";
                        return (
                          <button
                            key={pipeId}
                            onClick={() => {
                              setActiveTab("pipelines");
                              if (pipe) setSelectedPipeline(pipe);
                            }}
                            className={`text-[10px] px-2 py-0.5 rounded font-mono ${
                              isPipeFailed
                                ? "bg-red-100 text-red-700 dark:bg-red-950 dark:text-red-300 font-bold animate-pulse"
                                : "bg-slate-100 text-slate-600 dark:bg-slate-800 dark:text-slate-300"
                            }`}
                          >
                            {pipe?.displayName || pipeId}
                          </button>
                        );
                      })}
                    </div>

                    <button
                      onClick={() => setSelectedDashboard(dash)}
                      className="px-2.5 py-1 rounded-lg text-xs font-semibold bg-slate-100 hover:bg-slate-200 dark:bg-slate-800 dark:hover:bg-slate-700 text-slate-800 dark:text-slate-200 transition-colors flex items-center gap-1 shrink-0"
                    >
                      <span>Drill-down</span>
                      <ChevronRight className="w-3.5 h-3.5" />
                    </button>
                  </div>
                </div>
              );
            })}
          </div>
        </div>
      )}

      {/* VIEW 2: METRIC GLOSSARY & KPI CONFLICTS */}
      {activeSubTab === "glossary" && (
        <div className="space-y-4">
          <div className="p-4 rounded-xl bg-amber-50 dark:bg-amber-950/30 border border-amber-200 dark:border-amber-900/50 flex items-start gap-3">
            <AlertTriangle className="w-5 h-5 text-amber-600 dark:text-amber-400 shrink-0 mt-0.5" />
            <div className="space-y-1 text-xs text-amber-900 dark:text-amber-200">
              <h3 className="text-sm font-bold">
                Why Dashboards Lose Trust: Semantic Definition Drift
              </h3>
              <p>
                When two dashboards report the exact same metric name (e.g. "Net ARR" or "Active Users") with differing calculations, business stakeholders lose trust in data. Below are actively detected metric conflicts with variance calculations.
              </p>
            </div>
          </div>

          <div className="space-y-4">
            {metricGlossary.map((metric) => {
              const isFixed = standardizedMetrics[metric.id];

              return (
                <div
                  key={metric.id}
                  className={`p-5 rounded-2xl border transition-all ${
                    metric.hasConflict && !isFixed
                      ? "bg-white dark:bg-slate-900 border-red-200 dark:border-red-900/60 shadow-sm"
                      : "bg-white dark:bg-slate-900 border-slate-200 dark:border-slate-800"
                  }`}
                >
                  <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-3 pb-3 border-b border-slate-100 dark:border-slate-800">
                    <div className="flex items-center gap-2">
                      <h3 className="text-base font-bold text-slate-900 dark:text-white">
                        {metric.kpiName}
                      </h3>
                      {metric.hasConflict && !isFixed ? (
                        <span className="text-[10px] uppercase font-bold px-2 py-0.5 rounded bg-red-100 text-red-800 dark:bg-red-950 dark:text-red-300 border border-red-200 dark:border-red-800">
                          Conflict Detected ({metric.severity})
                        </span>
                      ) : (
                        <span className="text-[10px] uppercase font-bold px-2 py-0.5 rounded bg-emerald-100 text-emerald-800 dark:bg-emerald-950 dark:text-emerald-300 border border-emerald-200 dark:border-emerald-800 flex items-center gap-1">
                          <Check className="w-3 h-3" />
                          Unified & Verified Standard
                        </span>
                      )}
                    </div>

                    <div className="text-xs font-semibold text-red-600 dark:text-red-400">
                      Discrepancy: {metric.discrepancy}
                    </div>
                  </div>

                  <p className="text-xs text-slate-600 dark:text-slate-300 mt-2">
                    {metric.conflictSummary}
                  </p>

                  {/* Side-by-Side Conflicting Definitions */}
                  <div className="grid grid-cols-1 md:grid-cols-2 gap-3 mt-3">
                    {metric.definitions.map((def, idx) => (
                      <div
                        key={idx}
                        className="p-3.5 rounded-xl bg-slate-50 dark:bg-slate-800/60 border border-slate-200 dark:border-slate-700/60 space-y-1.5 text-xs"
                      >
                        <div className="flex items-center justify-between">
                          <span className="font-bold text-slate-900 dark:text-white">
                            {def.dashboard}
                          </span>
                          <span className="text-[10px] font-semibold px-2 py-0.5 rounded bg-slate-200 dark:bg-slate-700 text-slate-700 dark:text-slate-300">
                            Dept: {def.department}
                          </span>
                        </div>

                        <div className="p-2 rounded bg-slate-100 dark:bg-slate-900 font-mono text-[11px] text-slate-800 dark:text-slate-200">
                          {def.formula}
                        </div>

                        <div className="flex items-center justify-between text-[11px] text-slate-500 dark:text-slate-400 pt-1">
                          <span>Owner: {def.owner}</span>
                          <span className="italic font-medium">{def.status}</span>
                        </div>
                      </div>
                    ))}
                  </div>

                  {/* Action & Resolution */}
                  <div className="mt-4 pt-3 border-t border-slate-100 dark:border-slate-800 flex flex-col sm:flex-row sm:items-center justify-between gap-3 text-xs">
                    <div className="text-slate-500 dark:text-slate-400">
                      <span className="font-semibold text-slate-700 dark:text-slate-300">
                        Governance Recommendation:{" "}
                      </span>
                      {metric.recommendedAction}
                    </div>

                    {metric.hasConflict && !isFixed && (
                      <button
                        onClick={() => handleStandardizeMetric(metric.id)}
                        className="px-3 py-1.5 rounded-lg bg-blue-600 hover:bg-blue-700 text-white font-semibold text-xs transition-colors shrink-0 flex items-center gap-1.5 cursor-pointer"
                      >
                        <Check className="w-3.5 h-3.5" />
                        <span>Enforce Standard Semantic Layer</span>
                      </button>
                    )}
                  </div>
                </div>
              );
            })}
          </div>
        </div>
      )}

      {/* Drill-down Modal for Dashboard Trust */}
      {selectedDashboard && (
        <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-black/60 backdrop-blur-sm">
          <div className="w-full max-w-2xl rounded-2xl bg-white dark:bg-slate-900 border border-slate-200 dark:border-slate-800 text-slate-900 dark:text-slate-100 shadow-2xl overflow-hidden flex flex-col max-h-[90vh]">
            {/* Modal Header */}
            <div className="p-5 border-b border-slate-200 dark:border-slate-800 flex items-center justify-between bg-slate-50 dark:bg-slate-800/50">
              <div className="flex items-center gap-3">
                <div
                  className={`flex flex-col items-center justify-center w-12 h-12 rounded-xl font-bold border text-lg ${
                    selectedDashboard.score >= 85
                      ? "bg-emerald-500/10 border-emerald-500/30 text-emerald-600 dark:text-emerald-400"
                      : selectedDashboard.score >= 60
                      ? "bg-amber-500/10 border-amber-500/30 text-amber-600 dark:text-amber-400"
                      : "bg-red-500/10 border-red-500/30 text-red-600 dark:text-red-400"
                  }`}
                >
                  {selectedDashboard.score}
                </div>
                <div>
                  <h3 className="text-base font-bold text-slate-900 dark:text-white">
                    {selectedDashboard.name}
                  </h3>
                  <p className="text-xs text-slate-500 dark:text-slate-400">
                    Trust Audit Report • Status: {selectedDashboard.status.toUpperCase()}
                  </p>
                </div>
              </div>

              <button
                onClick={() => setSelectedDashboard(null)}
                className="text-slate-400 hover:text-slate-700 dark:hover:text-white text-xs px-2.5 py-1 rounded-lg bg-slate-200 dark:bg-slate-800"
              >
                Close (ESC)
              </button>
            </div>

            {/* Modal Content */}
            <div className="p-5 overflow-y-auto space-y-4 text-xs">
              {/* Trust Score Breakdown */}
              <div className="space-y-2">
                <h4 className="font-bold text-slate-700 dark:text-slate-300 uppercase tracking-wider text-[11px]">
                  5-Pillar Trust Verification
                </h4>
                <div className="grid grid-cols-1 sm:grid-cols-2 gap-2">
                  <div className="p-3 rounded-xl bg-slate-50 dark:bg-slate-800/50 border border-slate-200 dark:border-slate-700">
                    <span className="text-slate-400">Data Freshness:</span>
                    <div className="text-sm font-bold text-slate-900 dark:text-white">
                      {selectedDashboard.breakdown.freshness} / 100 ({selectedDashboard.lastSync})
                    </div>
                  </div>
                  <div className="p-3 rounded-xl bg-slate-50 dark:bg-slate-800/50 border border-slate-200 dark:border-slate-700">
                    <span className="text-slate-400">Upstream Pipeline Reliability:</span>
                    <div className="text-sm font-bold text-slate-900 dark:text-white">
                      {selectedDashboard.breakdown.pipelineReliability} / 100
                    </div>
                  </div>
                  <div className="p-3 rounded-xl bg-slate-50 dark:bg-slate-800/50 border border-slate-200 dark:border-slate-700">
                    <span className="text-slate-400">Schema Stability:</span>
                    <div className="text-sm font-bold text-slate-900 dark:text-white">
                      {selectedDashboard.breakdown.schemaStability} / 100
                    </div>
                  </div>
                  <div className="p-3 rounded-xl bg-slate-50 dark:bg-slate-800/50 border border-slate-200 dark:border-slate-700">
                    <span className="text-slate-400">Data Quality & Null Checks:</span>
                    <div className="text-sm font-bold text-slate-900 dark:text-white">
                      {selectedDashboard.breakdown.dataQuality} / 100
                    </div>
                  </div>
                </div>
              </div>

              {/* Identified Issues */}
              {selectedDashboard.issues.length > 0 && (
                <div className="space-y-2">
                  <h4 className="font-bold text-red-600 dark:text-red-400 uppercase tracking-wider text-[11px]">
                    Identified Integrity Issues:
                  </h4>
                  <div className="space-y-1.5">
                    {selectedDashboard.issues.map((issue, idx) => (
                      <div
                        key={idx}
                        className="p-2.5 rounded-lg bg-red-50 dark:bg-red-950/30 border border-red-200 dark:border-red-900/40 text-red-700 dark:text-red-300 flex items-start gap-2"
                      >
                        <AlertTriangle className="w-4 h-4 shrink-0 mt-0.5" />
                        <span>{issue}</span>
                      </div>
                    ))}
                  </div>
                </div>
              )}

              {/* Anomalies List */}
              {selectedDashboard.recentAnomalies.length > 0 && (
                <div className="space-y-2">
                  <h4 className="font-bold text-amber-600 dark:text-amber-400 uppercase tracking-wider text-[11px]">
                    Recent Automated Anomaly Detections:
                  </h4>
                  <div className="space-y-1.5">
                    {selectedDashboard.recentAnomalies.map((anom, idx) => (
                      <div
                        key={idx}
                        className="p-2.5 rounded-lg bg-amber-50 dark:bg-amber-950/30 border border-amber-200 dark:border-amber-900/40 text-amber-800 dark:text-amber-300 flex items-center justify-between"
                      >
                        <span className="font-semibold">{anom.type}: {anom.detail}</span>
                        <span className="text-[10px] uppercase font-bold px-1.5 py-0.5 rounded bg-amber-200 dark:bg-amber-900">
                          {anom.severity}
                        </span>
                      </div>
                    ))}
                  </div>
                </div>
              )}
            </div>

            {/* Modal Footer */}
            <div className="p-4 border-t border-slate-200 dark:border-slate-800 bg-slate-50 dark:bg-slate-800/50 flex items-center justify-between text-xs">
              <a
                href={selectedDashboard.url}
                target="_blank"
                rel="noreferrer"
                className="text-blue-600 dark:text-blue-400 hover:underline flex items-center gap-1 font-medium"
              >
                <span>Open in BI Tool (Tableau/Looker)</span>
                <ExternalLink className="w-3.5 h-3.5" />
              </a>

              <div className="flex items-center gap-2">
                <button
                  onClick={() => setSelectedDashboard(null)}
                  className="px-3 py-1.5 rounded-lg bg-slate-200 dark:bg-slate-700 text-slate-800 dark:text-slate-200 font-semibold"
                >
                  Dismiss
                </button>
              </div>
            </div>
          </div>
        </div>
      )}
    </div>
  );
};
