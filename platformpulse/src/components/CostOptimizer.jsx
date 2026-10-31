import React, { useState } from "react";
import { useApp } from "../context/AppContext";
import {
  DollarSign,
  TrendingUp,
  AlertTriangle,
  CheckCircle2,
  Trash2,
  Clock,
  Layers,
  Database,
  Cpu,
  Archive,
  Check,
  RotateCcw,
  Sparkles,
  ExternalLink,
  ChevronRight,
  ShieldCheck,
  HelpCircle,
  FileSpreadsheet
} from "lucide-react";
import {
  ResponsiveContainer,
  ComposedChart,
  Line,
  Bar,
  XAxis,
  YAxis,
  Tooltip,
  Legend,
  CartesianGrid,
  BarChart,
  PieChart,
  Pie,
  Cell
} from "recharts";

export const CostOptimizer = () => {
  const {
    costDataMonthly,
    spendBreakdown,
    wasteRecs,
    handleWasteAction,
    potentialSavingsMonthly,
    realizedSavingsMonthly
  } = useApp();

  const [activeBreakdownTab, setActiveBreakdownTab] = useState("warehouse"); // 'warehouse' | 'team' | 'storage'
  const [filterCategory, setFilterCategory] = useState("all");

  const filteredRecs = wasteRecs.filter((r) => {
    if (filterCategory === "all") return true;
    if (filterCategory === "compute") return r.category === "Compute Waste";
    if (filterCategory === "dashboard") return r.category === "Unused Dashboard";
    if (filterCategory === "storage") return r.category === "Storage Waste";
    if (filterCategory === "pipeline") return r.category === "Duplicate Pipeline";
    return true;
  });

  return (
    <div className="space-y-6 pb-12">
      {/* Top Header */}
      <div className="flex flex-col md:flex-row md:items-center justify-between gap-4">
        <div>
          <h1 className="text-2xl font-bold tracking-tight text-slate-900 dark:text-white flex items-center gap-2">
            <DollarSign className="w-6 h-6 text-purple-600 dark:text-purple-400" />
            Platform Cost Optimizer & Waste Governance
          </h1>
          <p className="text-xs sm:text-sm text-slate-500 dark:text-slate-400">
            Real-time attribution connecting compute/storage bills to business teams, detecting idle capacity, and reclaiming platform waste.
          </p>
        </div>

        {/* Savings KPI Badges */}
        <div className="flex items-center gap-2 flex-wrap">
          <div className="p-2.5 px-4 rounded-xl bg-purple-50 dark:bg-purple-950/40 border border-purple-200 dark:border-purple-800 text-xs">
            <span className="text-[10px] uppercase font-bold text-purple-700 dark:text-purple-300 block">
              Actionable Monthly Waste
            </span>
            <span className="text-lg font-bold text-purple-900 dark:text-white">
              ${potentialSavingsMonthly.toLocaleString()} / mo
            </span>
          </div>

          <div className="p-2.5 px-4 rounded-xl bg-emerald-50 dark:bg-emerald-950/40 border border-emerald-200 dark:border-emerald-800 text-xs">
            <span className="text-[10px] uppercase font-bold text-emerald-700 dark:text-emerald-300 block">
              Realized Savings
            </span>
            <span className="text-lg font-bold text-emerald-900 dark:text-white">
              ${realizedSavingsMonthly.toLocaleString()} / mo
            </span>
          </div>
        </div>
      </div>

      {/* Hero Divergence Chart: Cost vs Usage Divergence */}
      <div className="p-5 sm:p-6 rounded-2xl bg-white dark:bg-slate-900 border border-slate-200 dark:border-slate-800 shadow-sm space-y-4">
        <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-2">
          <div>
            <div className="flex items-center gap-2">
              <h2 className="text-base font-bold text-slate-900 dark:text-white">
                Cost vs. Usage Divergence (May – Oct 2026)
              </h2>
              <span className="text-[10px] font-bold uppercase tracking-wider px-2 py-0.5 rounded bg-red-100 text-red-700 dark:bg-red-950 dark:text-red-300">
                Cost +69% vs Queries +17%
              </span>
            </div>
            <p className="text-xs text-slate-500 dark:text-slate-400">
              When spend outpaces query volume, idle warehouses and zombie dashboards are eating platform budget.
            </p>
          </div>

          <div className="flex items-center gap-4 text-xs">
            <div className="flex items-center gap-1.5">
              <span className="w-3 h-3 rounded bg-purple-600 inline-block" />
              <span className="text-slate-600 dark:text-slate-300 font-medium">
                Total Spend ($)
              </span>
            </div>
            <div className="flex items-center gap-1.5">
              <span className="w-3 h-1 rounded bg-emerald-500 inline-block" />
              <span className="text-slate-600 dark:text-slate-300 font-medium">
                Query Volume (Millions)
              </span>
            </div>
          </div>
        </div>

        {/* Recharts Composed Chart */}
        <div className="h-72 w-full pt-2">
          <ResponsiveContainer width="100%" height="100%">
            <ComposedChart data={costDataMonthly} margin={{ top: 10, right: 20, left: 0, bottom: 0 }}>
              <CartesianGrid strokeDasharray="3 3" opacity={0.15} />
              <XAxis dataKey="month" stroke="#94a3b8" fontSize={11} />
              <YAxis
                yAxisId="spend"
                orientation="left"
                stroke="#8b5cf6"
                fontSize={11}
                tickFormatter={(val) => `$${val / 1000}k`}
              />
              <YAxis
                yAxisId="queries"
                orientation="right"
                stroke="#10b981"
                fontSize={11}
                tickFormatter={(val) => `${val}M`}
              />
              <Tooltip
                content={({ active, payload, label }) => {
                  if (active && payload && payload.length) {
                    const data = payload[0].payload;
                    return (
                      <div className="p-3 rounded-xl bg-slate-900 text-white text-xs border border-slate-700 shadow-xl space-y-1">
                        <div className="font-bold border-b border-slate-800 pb-1 text-slate-300">
                          {label}
                        </div>
                        <div className="text-purple-400 font-semibold">
                          Total Spend: ${data.totalSpend.toLocaleString()}
                        </div>
                        <div className="text-emerald-400 font-semibold">
                          Queries Executed: {data.queriesMillion}M
                        </div>
                        <div className="text-amber-400">
                          Cost / 1k Queries: ${data.costPerThousandQueries.toFixed(2)}
                        </div>
                        <div className="text-red-400 text-[10px]">
                          Estimated Idle Waste: ${data.wasteEstimate.toLocaleString()}
                        </div>
                      </div>
                    );
                  }
                  return null;
                }}
              />
              <Bar
                yAxisId="spend"
                dataKey="totalSpend"
                name="Total Platform Spend"
                fill="#8b5cf6"
                radius={[6, 6, 0, 0]}
                barSize={32}
                opacity={0.85}
              />
              <Line
                yAxisId="queries"
                type="monotone"
                dataKey="queriesMillion"
                name="Query Volume (M)"
                stroke="#10b981"
                strokeWidth={3}
                dot={{ r: 4, fill: "#10b981" }}
              />
            </ComposedChart>
          </ResponsiveContainer>
        </div>
      </div>

      {/* Multi-Dimensional Spend Breakdowns */}
      <div className="p-5 sm:p-6 rounded-2xl bg-white dark:bg-slate-900 border border-slate-200 dark:border-slate-800 shadow-sm space-y-4">
        <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-3">
          <div>
            <h2 className="text-base font-bold text-slate-900 dark:text-white">
              Platform Spend Breakdown
            </h2>
            <p className="text-xs text-slate-500 dark:text-slate-400">
              Inspect where the $54.8k October spend is deployed across warehouse engines, business teams, and storage tiers.
            </p>
          </div>

          <div className="flex items-center p-1 rounded-xl bg-slate-100 dark:bg-slate-800 border border-slate-200 dark:border-slate-700 text-xs">
            <button
              onClick={() => setActiveBreakdownTab("warehouse")}
              className={`px-3 py-1.5 rounded-lg font-semibold transition-all ${
                activeBreakdownTab === "warehouse"
                  ? "bg-white text-slate-900 dark:bg-slate-700 dark:text-white shadow-sm"
                  : "text-slate-600 dark:text-slate-400 hover:text-slate-900"
              }`}
            >
              Warehouse Engine
            </button>
            <button
              onClick={() => setActiveBreakdownTab("team")}
              className={`px-3 py-1.5 rounded-lg font-semibold transition-all ${
                activeBreakdownTab === "team"
                  ? "bg-white text-slate-900 dark:bg-slate-700 dark:text-white shadow-sm"
                  : "text-slate-600 dark:text-slate-400 hover:text-slate-900"
              }`}
            >
              Business Team
            </button>
            <button
              onClick={() => setActiveBreakdownTab("storage")}
              className={`px-3 py-1.5 rounded-lg font-semibold transition-all ${
                activeBreakdownTab === "storage"
                  ? "bg-white text-slate-900 dark:bg-slate-700 dark:text-white shadow-sm"
                  : "text-slate-600 dark:text-slate-400 hover:text-slate-900"
              }`}
            >
              Storage Tiers
            </button>
          </div>
        </div>

        {/* Tab 1: By Warehouse Engine */}
        {activeBreakdownTab === "warehouse" && (
          <div className="grid grid-cols-1 sm:grid-cols-3 gap-4 pt-1">
            {spendBreakdown.byWarehouse.map((w, idx) => (
              <div
                key={idx}
                className="p-4 rounded-xl bg-slate-50 dark:bg-slate-800/40 border border-slate-200 dark:border-slate-700/60 space-y-2"
              >
                <div className="flex items-center justify-between text-xs">
                  <span className="font-bold text-slate-900 dark:text-white">
                    {w.name}
                  </span>
                  <span className="font-bold text-slate-700 dark:text-slate-300">
                    {w.percentage}%
                  </span>
                </div>

                <div className="text-xl font-bold text-slate-900 dark:text-white">
                  ${w.spend.toLocaleString()} / mo
                </div>

                <div className="h-2 w-full bg-slate-200 dark:bg-slate-700 rounded-full overflow-hidden">
                  <div
                    className="h-full rounded-full"
                    style={{ width: `${w.percentage}%`, backgroundColor: w.color }}
                  />
                </div>

                <p className="text-[11px] text-slate-500 dark:text-slate-400">
                  {w.name.includes("Snowflake")
                    ? "Compute warehouses (68%), storage & time-travel (32%)"
                    : w.name.includes("BigQuery")
                    ? "On-demand slot capacity & marketing ingestion"
                    : "PySpark ML training clusters & inference batches"}
                </p>
              </div>
            ))}
          </div>
        )}

        {/* Tab 2: By Business Team */}
        {activeBreakdownTab === "team" && (
          <div className="grid grid-cols-1 sm:grid-cols-5 gap-3 pt-1">
            {spendBreakdown.byTeam.map((t, idx) => (
              <div
                key={idx}
                className="p-3.5 rounded-xl bg-slate-50 dark:bg-slate-800/40 border border-slate-200 dark:border-slate-700/60 space-y-2 text-xs"
              >
                <div className="flex items-center justify-between">
                  <span className="font-bold text-slate-900 dark:text-white truncate">
                    {t.name}
                  </span>
                </div>
                <div className="text-base font-bold text-slate-900 dark:text-white">
                  ${t.spend.toLocaleString()}
                </div>
                <div className="h-1.5 w-full bg-slate-200 dark:bg-slate-700 rounded-full overflow-hidden">
                  <div
                    className="h-full rounded-full"
                    style={{ width: `${t.percentage}%`, backgroundColor: t.color }}
                  />
                </div>
                <div className="text-[10px] text-slate-400">
                  {t.percentage}% of overall spend
                </div>
              </div>
            ))}
          </div>
        )}

        {/* Tab 3: By Storage Tier */}
        {activeBreakdownTab === "storage" && (
          <div className="grid grid-cols-1 sm:grid-cols-4 gap-3 pt-1">
            {spendBreakdown.byStorage.map((s, idx) => (
              <div
                key={idx}
                className="p-3.5 rounded-xl bg-slate-50 dark:bg-slate-800/40 border border-slate-200 dark:border-slate-700/60 space-y-1.5 text-xs"
              >
                <span className="font-bold text-slate-900 dark:text-white block">
                  {s.name}
                </span>
                <div className="text-base font-bold text-slate-900 dark:text-white">
                  ${s.monthlyCost.toLocaleString()} / mo
                </div>
                <div className="text-slate-500 dark:text-slate-400 text-[11px]">
                  Total Size: {s.sizeTB} TB
                </div>
              </div>
            ))}
          </div>
        )}
      </div>

      {/* Detection of Waste: Recommendation Cards with 1-Click Action */}
      <div className="space-y-4">
        <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-3">
          <div>
            <div className="flex items-center gap-2">
              <h2 className="text-base font-bold text-slate-900 dark:text-white">
                Detected Waste & Actionable Optimization Cards
              </h2>
              <span className="text-[10px] uppercase font-bold tracking-wider px-2 py-0.5 rounded bg-purple-100 text-purple-700 dark:bg-purple-950 dark:text-purple-300">
                {wasteRecs.filter((r) => r.status === "pending").length} Pending Actions
              </span>
            </div>
            <p className="text-xs text-slate-500 dark:text-slate-400">
              Zero-risk and low-risk optimizations with verified impact. Click "Approve" to simulate immediate cost reduction.
            </p>
          </div>

          {/* Filter Pills */}
          <div className="flex items-center gap-1.5 flex-wrap text-xs">
            <button
              onClick={() => setFilterCategory("all")}
              className={`px-2.5 py-1 rounded-lg font-medium transition-colors ${
                filterCategory === "all"
                  ? "bg-purple-100 text-purple-800 dark:bg-purple-900/60 dark:text-purple-200 font-bold"
                  : "bg-slate-100 dark:bg-slate-800 text-slate-600 dark:text-slate-400"
              }`}
            >
              All ({wasteRecs.length})
            </button>
            <button
              onClick={() => setFilterCategory("compute")}
              className={`px-2.5 py-1 rounded-lg font-medium transition-colors ${
                filterCategory === "compute"
                  ? "bg-purple-100 text-purple-800 dark:bg-purple-900/60 dark:text-purple-200 font-bold"
                  : "bg-slate-100 dark:bg-slate-800 text-slate-600 dark:text-slate-400"
              }`}
            >
              Compute Waste
            </button>
            <button
              onClick={() => setFilterCategory("dashboard")}
              className={`px-2.5 py-1 rounded-lg font-medium transition-colors ${
                filterCategory === "dashboard"
                  ? "bg-purple-100 text-purple-800 dark:bg-purple-900/60 dark:text-purple-200 font-bold"
                  : "bg-slate-100 dark:bg-slate-800 text-slate-600 dark:text-slate-400"
              }`}
            >
              Zombie Dashboards
            </button>
            <button
              onClick={() => setFilterCategory("storage")}
              className={`px-2.5 py-1 rounded-lg font-medium transition-colors ${
                filterCategory === "storage"
                  ? "bg-purple-100 text-purple-800 dark:bg-purple-900/60 dark:text-purple-200 font-bold"
                  : "bg-slate-100 dark:bg-slate-800 text-slate-600 dark:text-slate-400"
              }`}
            >
              Staging Storage
            </button>
          </div>
        </div>

        <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
          {filteredRecs.map((rec) => {
            const isApproved = rec.status === "approved";
            const isDismissed = rec.status === "dismissed";

            return (
              <div
                key={rec.id}
                className={`p-5 rounded-2xl border transition-all ${
                  isApproved
                    ? "bg-emerald-50/40 dark:bg-emerald-950/20 border-emerald-300 dark:border-emerald-800/60"
                    : isDismissed
                    ? "bg-slate-50/50 dark:bg-slate-900/40 border-slate-200 dark:border-slate-800 opacity-60"
                    : "bg-white dark:bg-slate-900 border-slate-200 dark:border-slate-800 shadow-sm hover:border-purple-300 dark:hover:border-purple-800"
                }`}
              >
                <div className="flex items-start justify-between gap-3">
                  <div className="space-y-1">
                    <div className="flex items-center gap-2 flex-wrap">
                      <span className="text-[10px] font-bold uppercase tracking-wider px-2 py-0.5 rounded bg-purple-100 text-purple-800 dark:bg-purple-950 dark:text-purple-300 border border-purple-200 dark:border-purple-800">
                        {rec.category}
                      </span>
                      <span className="text-[10px] font-semibold px-2 py-0.5 rounded bg-emerald-100 text-emerald-800 dark:bg-emerald-950 dark:text-emerald-300">
                        {rec.risk}
                      </span>
                    </div>

                    <h3 className="text-base font-bold text-slate-900 dark:text-white pt-1">
                      {rec.title}
                    </h3>
                    <p className="font-mono text-xs text-slate-500 dark:text-slate-400">
                      Asset: {rec.asset}
                    </p>
                  </div>

                  {/* Monthly Savings Pill */}
                  <div className="text-right shrink-0">
                    <span className="text-lg font-bold text-emerald-600 dark:text-emerald-400 block">
                      +${rec.projectedMonthlySavings.toLocaleString()}
                    </span>
                    <span className="text-[10px] uppercase font-semibold text-slate-400">
                      per month
                    </span>
                  </div>
                </div>

                <p className="text-xs text-slate-600 dark:text-slate-300 mt-3 leading-relaxed">
                  {rec.description}
                </p>

                {/* Footer and Interactive Action Buttons */}
                <div className="mt-4 pt-3 border-t border-slate-100 dark:border-slate-800 flex items-center justify-between text-xs">
                  <div className="text-slate-500 dark:text-slate-400">
                    <span>Current Cost: ${rec.currentMonthlyCost}/mo • Effort: {rec.effort}</span>
                  </div>

                  <div className="flex items-center gap-2">
                    {isApproved ? (
                      <div className="flex items-center gap-2">
                        <span className="inline-flex items-center gap-1 font-semibold text-emerald-600 dark:text-emerald-400">
                          <Check className="w-4 h-4" />
                          Approved & Active
                        </span>
                        <button
                          onClick={() => handleWasteAction(rec.id, "rollback")}
                          className="text-[11px] text-slate-400 hover:text-slate-600 underline"
                        >
                          Undo
                        </button>
                      </div>
                    ) : isDismissed ? (
                      <button
                        onClick={() => handleWasteAction(rec.id, "rollback")}
                        className="text-xs font-semibold text-slate-500 hover:text-slate-800 dark:hover:text-slate-200"
                      >
                        Restore Recommendation
                      </button>
                    ) : (
                      <>
                        <button
                          onClick={() => handleWasteAction(rec.id, "dismiss")}
                          className="px-2.5 py-1.5 rounded-lg text-slate-500 hover:text-slate-700 dark:text-slate-400 dark:hover:text-slate-200 hover:bg-slate-100 dark:hover:bg-slate-800 font-medium"
                        >
                          Dismiss
                        </button>
                        <button
                          onClick={() => handleWasteAction(rec.id, "approve")}
                          className="px-3 py-1.5 rounded-lg bg-emerald-600 hover:bg-emerald-500 text-white font-semibold shadow-sm transition-colors flex items-center gap-1 cursor-pointer"
                        >
                          <Check className="w-3.5 h-3.5" />
                          <span>{rec.actionLabel}</span>
                        </button>
                      </>
                    )}
                  </div>
                </div>
              </div>
            );
          })}
        </div>
      </div>
    </div>
  );
};
