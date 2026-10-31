import React, { useState } from "react";
import { useApp } from "../context/AppContext";
import {
  Inbox,
  Plus,
  Sparkles,
  Clock,
  AlertTriangle,
  CheckCircle2,
  ExternalLink,
  ChevronRight,
  Filter,
  Search,
  ArrowRight,
  Lightbulb,
  FileCode,
  Layers,
  Calendar,
  User,
  Building,
  Sliders,
  TrendingDown
} from "lucide-react";

export const RequestQueue = () => {
  const {
    requests,
    submitNewRequest,
    moveRequestStatus,
    selectedRequest,
    setSelectedRequest,
    isNewRequestModalOpen,
    setIsNewRequestModalOpen,
    dashboards,
    setActiveTab,
    setSelectedDashboard
  } = useApp();

  const [classificationFilter, setClassificationFilter] = useState("all");
  const [searchQuery, setSearchQuery] = useState("");
  const [urgencyFilter, setUrgencyFilter] = useState("all");

  // New request intake form state
  const [formData, setFormData] = useState({
    title: "",
    requester: "",
    department: "Sales Ops",
    urgency: "P2 - High",
    deadline: "",
    whyNeeded: ""
  });

  // Live AI triage preview in form
  const [liveSuggestion, setLiveSuggestion] = useState(null);

  const handleFormInputChange = (field, value) => {
    const updated = { ...formData, [field]: value };
    setFormData(updated);

    // Live AI auto-matching
    const text = (updated.title + " " + updated.whyNeeded).toLowerCase();
    if (text.includes("churn") || text.includes("retention")) {
      setLiveSuggestion({
        type: "already_answerable",
        asset: "Customer Success Health & Churn Risk",
        note: "Tab 3 has enterprise churn cohorts already computed."
      });
    } else if (text.includes("sales") || text.includes("quota") || text.includes("attainment")) {
      setLiveSuggestion({
        type: "already_answerable",
        asset: "Sales Rep Performance & Quota Attainment",
        note: "Check regional filters before requesting a new report."
      });
    } else if (text.includes("export") || text.includes("csv") || text.includes("list")) {
      setLiveSuggestion({
        type: "quick_query",
        asset: "Quick SQL Ad-hoc (~1-2h)",
        note: "Data engineer can export CSV directly without dbt pipeline changes."
      });
    } else {
      setLiveSuggestion(null);
    }
  };

  const handleFormSubmit = (e) => {
    e.preventDefault();
    if (!formData.title.trim() || !formData.whyNeeded.trim()) return;
    submitNewRequest(formData);
    setFormData({
      title: "",
      requester: "",
      department: "Sales Ops",
      urgency: "P2 - High",
      deadline: "",
      whyNeeded: ""
    });
    setLiveSuggestion(null);
  };

  // Kanban Columns
  const columns = [
    { id: "backlog", label: "Backlog", color: "border-slate-300 dark:border-slate-700" },
    { id: "in_triage", label: "AI Triaged", color: "border-purple-300 dark:border-purple-700" },
    { id: "in_progress", label: "In Progress", color: "border-blue-300 dark:border-blue-700" },
    { id: "review", label: "QA / Review", color: "border-amber-300 dark:border-amber-700" },
    { id: "completed", label: "Delivered", color: "border-emerald-300 dark:border-emerald-700" }
  ];

  // Filtered requests
  const filteredRequests = requests.filter((r) => {
    const matchesClass =
      classificationFilter === "all" || r.aiClassification === classificationFilter;
    const matchesUrgency =
      urgencyFilter === "all" || r.urgency.startsWith(urgencyFilter);
    const matchesSearch =
      r.title.toLowerCase().includes(searchQuery.toLowerCase()) ||
      r.requester.toLowerCase().includes(searchQuery.toLowerCase()) ||
      r.department.toLowerCase().includes(searchQuery.toLowerCase());

    return matchesClass && matchesUrgency && matchesSearch;
  });

  // Calculate bottleneck
  const inProgressCount = requests.filter((r) => r.status === "in_progress").length;
  const overdueCount = requests.filter((r) => r.isOverdue).length;

  return (
    <div className="space-y-6 pb-12">
      {/* Top Header */}
      <div className="flex flex-col md:flex-row md:items-center justify-between gap-4">
        <div>
          <h1 className="text-2xl font-bold tracking-tight text-slate-900 dark:text-white flex items-center gap-2">
            <Inbox className="w-6 h-6 text-blue-600 dark:text-blue-400" />
            Data Request Queue & AI Triage
          </h1>
          <p className="text-xs sm:text-sm text-slate-500 dark:text-slate-400">
            Intake portal for business users with automated AI triage to match existing assets, prevent duplicate pipeline builds, and enforce SLAs.
          </p>
        </div>

        <button
          onClick={() => setIsNewRequestModalOpen(true)}
          className="px-4 py-2 rounded-xl bg-gradient-to-r from-blue-600 to-indigo-600 hover:from-blue-500 hover:to-indigo-500 text-white font-semibold text-xs shadow-md shadow-blue-500/20 transition-all flex items-center gap-1.5 self-start md:self-auto cursor-pointer"
        >
          <Plus className="w-4 h-4" />
          <span>Submit Data Request</span>
        </button>
      </div>

      {/* Wait-Time Analytics & Bottleneck Alert Bar */}
      <div className="grid grid-cols-1 sm:grid-cols-4 gap-4">
        <div className="p-4 rounded-xl bg-white dark:bg-slate-900 border border-slate-200 dark:border-slate-800 shadow-sm">
          <span className="text-[11px] font-semibold uppercase tracking-wider text-slate-400">
            Median Wait Time
          </span>
          <div className="flex items-baseline gap-2 mt-1">
            <span className="text-2xl font-bold text-slate-900 dark:text-white">3.2</span>
            <span className="text-xs font-medium text-slate-500">Days</span>
            <span className="text-[10px] font-bold px-1.5 py-0.5 rounded bg-emerald-100 text-emerald-700 dark:bg-emerald-950 dark:text-emerald-300">
              -42% MoM
            </span>
          </div>
          <p className="text-[11px] text-slate-500 dark:text-slate-400 mt-1">
            Down from 8.4 days before AI Triage
          </p>
        </div>

        <div className="p-4 rounded-xl bg-white dark:bg-slate-900 border border-slate-200 dark:border-slate-800 shadow-sm">
          <span className="text-[11px] font-semibold uppercase tracking-wider text-slate-400">
            Self-Serve Deflection
          </span>
          <div className="flex items-baseline gap-2 mt-1">
            <span className="text-2xl font-bold text-purple-600 dark:text-purple-400">38%</span>
            <span className="text-[10px] font-bold px-1.5 py-0.5 rounded bg-purple-100 text-purple-700 dark:bg-purple-950 dark:text-purple-300">
              Instant Answer
            </span>
          </div>
          <p className="text-[11px] text-slate-500 dark:text-slate-400 mt-1">
            Routed to existing trusted dashboards
          </p>
        </div>

        <div className="p-4 rounded-xl bg-white dark:bg-slate-900 border border-slate-200 dark:border-slate-800 shadow-sm">
          <span className="text-[11px] font-semibold uppercase tracking-wider text-slate-400">
            SLA Compliance Rate
          </span>
          <div className="flex items-baseline gap-2 mt-1">
            <span className="text-2xl font-bold text-emerald-600 dark:text-emerald-400">86.7%</span>
            <span className="text-[10px] font-bold px-1.5 py-0.5 rounded bg-emerald-100 text-emerald-700 dark:bg-emerald-950 dark:text-emerald-300">
              13/15 on track
            </span>
          </div>
          <p className="text-[11px] text-slate-500 dark:text-slate-400 mt-1">
            Target: 85% delivery within target SLA
          </p>
        </div>

        <div className="p-4 rounded-xl bg-white dark:bg-slate-900 border border-slate-200 dark:border-slate-800 shadow-sm">
          <span className="text-[11px] font-semibold uppercase tracking-wider text-slate-400">
            Bottleneck Stage
          </span>
          <div className="flex items-baseline gap-2 mt-1">
            <span className="text-lg font-bold text-amber-600 dark:text-amber-400">
              In Progress
            </span>
            <span className="text-xs text-slate-500">({inProgressCount} tickets)</span>
          </div>
          <p className="text-[11px] text-slate-500 dark:text-slate-400 mt-1">
            Blocked by Snowflake warehouse capacity
          </p>
        </div>
      </div>

      {/* Bottleneck Alert Banner */}
      {overdueCount > 0 && (
        <div className="p-3.5 rounded-xl bg-amber-50 dark:bg-amber-950/30 border border-amber-200 dark:border-amber-900/50 flex items-center justify-between text-xs text-amber-900 dark:text-amber-200">
          <div className="flex items-center gap-2">
            <AlertTriangle className="w-4 h-4 text-amber-600 dark:text-amber-400 shrink-0" />
            <span>
              <strong>Bottleneck Detected:</strong> 2 tickets have breached their delivery SLA in 'In Progress' and 'Review'.
            </span>
          </div>
          <span className="text-[11px] font-semibold text-amber-700 dark:text-amber-300">
            Priority Escalation Active
          </span>
        </div>
      )}

      {/* Filters and Classification Bar */}
      <div className="flex flex-col sm:flex-row items-stretch sm:items-center justify-between gap-3 p-4 rounded-xl bg-white dark:bg-slate-900 border border-slate-200 dark:border-slate-800 shadow-sm">
        <div className="relative flex-1 max-w-md">
          <Search className="w-4 h-4 absolute left-3 top-3 text-slate-400" />
          <input
            type="text"
            value={searchQuery}
            onChange={(e) => setSearchQuery(e.target.value)}
            placeholder="Search tickets by title, requester, or department..."
            className="w-full pl-9 pr-3 py-2 text-xs rounded-lg bg-slate-50 dark:bg-slate-800 border border-slate-200 dark:border-slate-700 focus:outline-none focus:ring-2 focus:ring-blue-500 dark:text-white"
          />
        </div>

        <div className="flex items-center gap-2 flex-wrap">
          {/* Classification Filter */}
          <div className="flex items-center gap-1 text-xs">
            <span className="text-slate-400 text-[11px]">AI Triage:</span>
            <select
              value={classificationFilter}
              onChange={(e) => setClassificationFilter(e.target.value)}
              className="text-xs font-medium py-1.5 px-2 rounded-lg bg-slate-50 dark:bg-slate-800 border border-slate-200 dark:border-slate-700 text-slate-700 dark:text-slate-300 focus:outline-none cursor-pointer"
            >
              <option value="all">All Classifications ({requests.length})</option>
              <option value="already_answerable">Already Answerable (Instant)</option>
              <option value="quick_query">Quick Query (&lt;2h)</option>
              <option value="needs_pipeline">Needs New Pipeline</option>
            </select>
          </div>

          {/* Urgency Filter */}
          <div className="flex items-center gap-1 text-xs">
            <span className="text-slate-400 text-[11px]">Urgency:</span>
            <select
              value={urgencyFilter}
              onChange={(e) => setUrgencyFilter(e.target.value)}
              className="text-xs font-medium py-1.5 px-2 rounded-lg bg-slate-50 dark:bg-slate-800 border border-slate-200 dark:border-slate-700 text-slate-700 dark:text-slate-300 focus:outline-none cursor-pointer"
            >
              <option value="all">All Urgencies</option>
              <option value="P1">P1 - Critical</option>
              <option value="P2">P2 - High</option>
              <option value="P3">P3 - Medium</option>
              <option value="P4">P4 - Low</option>
            </select>
          </div>
        </div>
      </div>

      {/* Kanban Board Columns */}
      <div className="grid grid-cols-1 md:grid-cols-5 gap-4">
        {columns.map((col) => {
          const colRequests = filteredRequests.filter((r) => r.status === col.id);

          return (
            <div
              key={col.id}
              className="flex flex-col rounded-2xl bg-slate-50/70 dark:bg-slate-900/50 border border-slate-200 dark:border-slate-800 p-3 min-h-[500px]"
            >
              {/* Column Header */}
              <div className="flex items-center justify-between pb-3 mb-2 border-b border-slate-200 dark:border-slate-800 px-1">
                <div className="flex items-center gap-1.5">
                  <h3 className="text-xs font-bold uppercase tracking-wider text-slate-700 dark:text-slate-300">
                    {col.label}
                  </h3>
                  <span className="w-5 h-5 rounded-full bg-slate-200 dark:bg-slate-800 text-[10px] font-bold text-slate-700 dark:text-slate-300 flex items-center justify-center">
                    {colRequests.length}
                  </span>
                </div>
              </div>

              {/* Tickets in Column */}
              <div className="space-y-3 flex-1 overflow-y-auto">
                {colRequests.map((req) => {
                  const isAnswerable = req.aiClassification === "already_answerable";
                  const isQuick = req.aiClassification === "quick_query";
                  const isNewPipe = req.aiClassification === "needs_pipeline";
                  const isOverdue = req.isOverdue;

                  return (
                    <div
                      key={req.id}
                      className={`p-3.5 rounded-xl border bg-white dark:bg-slate-900 transition-all shadow-sm hover:shadow ${
                        isOverdue
                          ? "border-red-300 dark:border-red-900/60"
                          : "border-slate-200 dark:border-slate-800 hover:border-slate-300 dark:hover:border-slate-700"
                      }`}
                    >
                      {/* Top Header: ID & Urgency */}
                      <div className="flex items-center justify-between text-[10px] pb-2">
                        <span className="font-mono font-bold text-slate-500 dark:text-slate-400">
                          {req.id}
                        </span>
                        <span
                          className={`font-bold px-1.5 py-0.5 rounded uppercase tracking-wider ${
                            req.urgency.startsWith("P1")
                              ? "bg-red-100 text-red-800 dark:bg-red-950 dark:text-red-300"
                              : req.urgency.startsWith("P2")
                              ? "bg-amber-100 text-amber-800 dark:bg-amber-950 dark:text-amber-300"
                              : "bg-slate-100 text-slate-700 dark:bg-slate-800 dark:text-slate-300"
                          }`}
                        >
                          {req.urgency.split(" - ")[0]}
                        </span>
                      </div>

                      {/* Title */}
                      <h4 className="text-xs font-bold text-slate-900 dark:text-white leading-snug mb-2 line-clamp-2">
                        {req.title}
                      </h4>

                      {/* AI Classification Badge */}
                      <div className="mb-2">
                        {isAnswerable && (
                          <div className="p-1.5 rounded-lg bg-emerald-50 dark:bg-emerald-950/40 border border-emerald-200 dark:border-emerald-800/40 text-[10px] text-emerald-800 dark:text-emerald-300 space-y-1">
                            <div className="flex items-center gap-1 font-bold">
                              <Lightbulb className="w-3 h-3 text-emerald-600 dark:text-emerald-400 shrink-0" />
                              <span>Existing Asset Match</span>
                            </div>
                            {req.matchedAsset && (
                              <button
                                onClick={() => {
                                  setActiveTab("dashboards");
                                  const d = dashboards.find((x) => x.id === req.matchedAsset.id);
                                  if (d) setSelectedDashboard(d);
                                }}
                                className="font-semibold text-emerald-700 dark:text-emerald-300 hover:underline flex items-center gap-1 truncate text-left"
                              >
                                <span>{req.matchedAsset.name}</span>
                                <ExternalLink className="w-2.5 h-2.5 shrink-0" />
                              </button>
                            )}
                          </div>
                        )}

                        {isQuick && (
                          <span className="inline-flex items-center gap-1 text-[10px] font-semibold px-2 py-0.5 rounded bg-blue-100 text-blue-800 dark:bg-blue-950 dark:text-blue-300">
                            <FileCode className="w-2.5 h-2.5" />
                            Quick SQL Query (~{req.effortHours}h)
                          </span>
                        )}

                        {isNewPipe && (
                          <span className="inline-flex items-center gap-1 text-[10px] font-semibold px-2 py-0.5 rounded bg-purple-100 text-purple-800 dark:bg-purple-950 dark:text-purple-300">
                            <Layers className="w-2.5 h-2.5" />
                            New Pipeline ({req.effortHours}h effort)
                          </span>
                        )}
                      </div>

                      {/* SLA & Requester Info */}
                      <div className="pt-2 border-t border-slate-100 dark:border-slate-800 flex items-center justify-between text-[11px] text-slate-500 dark:text-slate-400">
                        <div className="flex items-center gap-1">
                          <Clock className={`w-3 h-3 ${isOverdue ? "text-red-500 animate-pulse" : ""}`} />
                          <span className={isOverdue ? "text-red-600 dark:text-red-400 font-bold" : ""}>
                            {isOverdue ? "Overdue" : `${req.slaRemainingHours}h SLA`}
                          </span>
                        </div>
                        <span className="font-semibold text-slate-700 dark:text-slate-300 text-[10px]">
                          Score: {req.priorityScore}
                        </span>
                      </div>

                      {/* Move Stage Controls */}
                      <div className="mt-2 pt-2 border-t border-slate-100 dark:border-slate-800 flex items-center justify-between text-[10px]">
                        <span className="text-slate-400 truncate max-w-[90px]">
                          {req.requester.split(" ")[0]} ({req.department})
                        </span>

                        <div className="flex items-center gap-1">
                          {col.id !== "backlog" && (
                            <button
                              onClick={() => {
                                const prevIdx = columns.findIndex((c) => c.id === col.id) - 1;
                                if (prevIdx >= 0) moveRequestStatus(req.id, columns[prevIdx].id);
                              }}
                              className="px-1.5 py-0.5 rounded bg-slate-100 dark:bg-slate-800 hover:bg-slate-200 text-slate-600 dark:text-slate-300"
                              title="Move back"
                            >
                              &larr;
                            </button>
                          )}
                          {col.id !== "completed" && (
                            <button
                              onClick={() => {
                                const nextIdx = columns.findIndex((c) => c.id === col.id) + 1;
                                if (nextIdx < columns.length) moveRequestStatus(req.id, columns[nextIdx].id);
                              }}
                              className="px-1.5 py-0.5 rounded bg-slate-100 dark:bg-slate-800 hover:bg-slate-200 text-slate-600 dark:text-slate-300 font-bold"
                              title="Advance stage"
                            >
                              &rarr;
                            </button>
                          )}
                        </div>
                      </div>
                    </div>
                  );
                })}
              </div>
            </div>
          );
        })}
      </div>

      {/* Intake Form Modal */}
      {isNewRequestModalOpen && (
        <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-black/60 backdrop-blur-sm">
          <div className="w-full max-w-xl rounded-2xl bg-white dark:bg-slate-900 border border-slate-200 dark:border-slate-800 text-slate-900 dark:text-slate-100 shadow-2xl overflow-hidden">
            {/* Header */}
            <div className="p-5 border-b border-slate-200 dark:border-slate-800 flex items-center justify-between bg-slate-50 dark:bg-slate-800/50">
              <div className="flex items-center gap-2">
                <div className="p-1.5 rounded-lg bg-blue-100 dark:bg-blue-950 text-blue-600 dark:text-blue-400">
                  <Plus className="w-4 h-4" />
                </div>
                <div>
                  <h3 className="text-base font-bold text-slate-900 dark:text-white">
                    Submit Data Request
                  </h3>
                  <p className="text-[11px] text-slate-500 dark:text-slate-400">
                    AI will analyze your description to recommend instant dashboards or scope engineering effort.
                  </p>
                </div>
              </div>
              <button
                onClick={() => setIsNewRequestModalOpen(false)}
                className="text-slate-400 hover:text-slate-600 text-xs px-2.5 py-1 rounded bg-slate-200 dark:bg-slate-800"
              >
                Close
              </button>
            </div>

            {/* Form */}
            <form onSubmit={handleFormSubmit} className="p-5 space-y-4 text-xs">
              <div>
                <label className="block font-semibold mb-1 text-slate-700 dark:text-slate-300">
                  Request Title *
                </label>
                <input
                  type="text"
                  required
                  value={formData.title}
                  onChange={(e) => handleFormInputChange("title", e.target.value)}
                  placeholder="e.g. Monthly churn retention breakdown for enterprise accounts"
                  className="w-full p-2.5 rounded-xl bg-slate-50 dark:bg-slate-800 border border-slate-200 dark:border-slate-700 focus:outline-none focus:ring-2 focus:ring-blue-500 dark:text-white"
                />
              </div>

              <div className="grid grid-cols-2 gap-3">
                <div>
                  <label className="block font-semibold mb-1 text-slate-700 dark:text-slate-300">
                    Your Name / Requester
                  </label>
                  <input
                    type="text"
                    value={formData.requester}
                    onChange={(e) => handleFormInputChange("requester", e.target.value)}
                    placeholder="e.g. Jordan Hayes"
                    className="w-full p-2.5 rounded-xl bg-slate-50 dark:bg-slate-800 border border-slate-200 dark:border-slate-700 focus:outline-none focus:ring-2 focus:ring-blue-500 dark:text-white"
                  />
                </div>

                <div>
                  <label className="block font-semibold mb-1 text-slate-700 dark:text-slate-300">
                    Department
                  </label>
                  <select
                    value={formData.department}
                    onChange={(e) => handleFormInputChange("department", e.target.value)}
                    className="w-full p-2.5 rounded-xl bg-slate-50 dark:bg-slate-800 border border-slate-200 dark:border-slate-700 focus:outline-none cursor-pointer dark:text-white"
                  >
                    <option value="Executive">Executive</option>
                    <option value="Finance">Finance</option>
                    <option value="Sales Ops">Sales Ops</option>
                    <option value="Growth Marketing">Growth Marketing</option>
                    <option value="Product">Product</option>
                    <option value="Customer Success">Customer Success</option>
                  </select>
                </div>
              </div>

              <div className="grid grid-cols-2 gap-3">
                <div>
                  <label className="block font-semibold mb-1 text-slate-700 dark:text-slate-300">
                    Urgency
                  </label>
                  <select
                    value={formData.urgency}
                    onChange={(e) => handleFormInputChange("urgency", e.target.value)}
                    className="w-full p-2.5 rounded-xl bg-slate-50 dark:bg-slate-800 border border-slate-200 dark:border-slate-700 focus:outline-none cursor-pointer dark:text-white"
                  >
                    <option value="P1 - Critical">P1 - Critical (Board/Exec blocked)</option>
                    <option value="P2 - High">P2 - High (Ops revenue impact)</option>
                    <option value="P3 - Medium">P3 - Medium (Standard planning)</option>
                    <option value="P4 - Low">P4 - Low (Nice to have)</option>
                  </select>
                </div>

                <div>
                  <label className="block font-semibold mb-1 text-slate-700 dark:text-slate-300">
                    Target Deadline
                  </label>
                  <input
                    type="date"
                    value={formData.deadline}
                    onChange={(e) => handleFormInputChange("deadline", e.target.value)}
                    className="w-full p-2.5 rounded-xl bg-slate-50 dark:bg-slate-800 border border-slate-200 dark:border-slate-700 focus:outline-none focus:ring-2 focus:ring-blue-500 dark:text-white"
                  />
                </div>
              </div>

              <div>
                <label className="block font-semibold mb-1 text-slate-700 dark:text-slate-300">
                  Business Objective & Why You Need It *
                </label>
                <textarea
                  rows={3}
                  required
                  value={formData.whyNeeded}
                  onChange={(e) => handleFormInputChange("whyNeeded", e.target.value)}
                  placeholder="Explain the business context, decisions riding on this data, and specific metrics needed..."
                  className="w-full p-2.5 rounded-xl bg-slate-50 dark:bg-slate-800 border border-slate-200 dark:border-slate-700 focus:outline-none focus:ring-2 focus:ring-blue-500 dark:text-white"
                />
              </div>

              {/* Real-time AI Triage Insight Preview */}
              {liveSuggestion && (
                <div className="p-3.5 rounded-xl bg-purple-50 dark:bg-purple-950/40 border border-purple-200 dark:border-purple-800/40 space-y-1">
                  <div className="flex items-center gap-1.5 font-bold text-purple-700 dark:text-purple-300">
                    <Sparkles className="w-3.5 h-3.5" />
                    <span>AI Triage Preview: {liveSuggestion.asset}</span>
                  </div>
                  <p className="text-slate-600 dark:text-slate-300">
                    {liveSuggestion.note}
                  </p>
                </div>
              )}

              {/* Submit Buttons */}
              <div className="pt-2 flex items-center justify-end gap-2">
                <button
                  type="button"
                  onClick={() => setIsNewRequestModalOpen(false)}
                  className="px-4 py-2 rounded-xl bg-slate-100 hover:bg-slate-200 dark:bg-slate-800 dark:hover:bg-slate-700 text-slate-700 dark:text-slate-300 font-semibold"
                >
                  Cancel
                </button>
                <button
                  type="submit"
                  className="px-5 py-2 rounded-xl bg-blue-600 hover:bg-blue-700 text-white font-semibold shadow-md transition-colors cursor-pointer"
                >
                  Submit & Auto-Triage
                </button>
              </div>
            </form>
          </div>
        </div>
      )}
    </div>
  );
};
