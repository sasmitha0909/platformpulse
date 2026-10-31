import React from "react";
import { useApp } from "../context/AppContext";
import {
  Play,
  RotateCcw,
  CheckCircle2,
  AlertTriangle,
  Flame,
  ArrowRight,
  ShieldAlert,
  Inbox,
  DollarSign,
  Bell,
  Sparkles,
  Check,
  X
} from "lucide-react";

export const DemoScenarioModal = () => {
  const {
    demoState,
    runDemoScenario,
    applyDemoFix,
    resetDemo,
    isDemoModalOpen,
    setIsDemoModalOpen,
    setActiveTab,
    dashboards,
    pipelines,
    requests
  } = useApp();

  if (!isDemoModalOpen) return null;

  const steps = [
    {
      num: 1,
      title: "Overnight Pipeline Crash (03:14 AM)",
      desc: "pipeline_stripe_billing_sync failed on schema drift: column 'billing_country_iso2' missing in Snowflake destination.",
      icon: Flame,
      color: "text-red-500",
      activeBg: "bg-red-500/10 border-red-500/40",
      targetTab: "pipelines"
    },
    {
      num: 2,
      title: "Dashboard Trust Plummeted to 48/100 (03:16 AM)",
      desc: "'Executive Revenue & ARR Overview' marked STALE; freshness SLA breached by 12 hours with 14k null records.",
      icon: ShieldAlert,
      color: "text-red-500",
      activeBg: "bg-red-500/10 border-red-500/40",
      targetTab: "dashboards"
    },
    {
      num: 3,
      title: "P1 Incident Alert Dispatched (03:17 AM)",
      desc: "Simulated Slack webhook triggered to #data-incidents; on-call engineer alerted via PagerDuty.",
      icon: Bell,
      color: "text-amber-500",
      activeBg: "bg-amber-500/10 border-amber-500/40",
      targetTab: "pipelines"
    },
    {
      num: 4,
      title: "Auto-Ticket Injected in Request Queue (07:45 AM)",
      desc: "Finance team opens dashboard for board prep; REQ-004 auto-classified with priority score 96.",
      icon: Inbox,
      color: "text-blue-500",
      activeBg: "bg-blue-500/10 border-blue-500/40",
      targetTab: "requests"
    },
    {
      num: 5,
      title: "Platform Cost Spillover ($1,850 Impact)",
      desc: "Repeated failed retry executions and warehouse idle spin time logged as unbudgeted platform spend.",
      icon: DollarSign,
      color: "text-purple-500",
      activeBg: "bg-purple-500/10 border-purple-500/40",
      targetTab: "cost"
    }
  ];

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-black/75 backdrop-blur-md">
      <div className="w-full max-w-2xl rounded-2xl bg-white dark:bg-slate-900 border border-slate-200 dark:border-slate-800 text-slate-900 dark:text-slate-100 shadow-2xl overflow-hidden flex flex-col max-h-[92vh]">
        {/* Header */}
        <div className="p-5 border-b border-slate-200 dark:border-slate-800 flex items-center justify-between bg-gradient-to-r from-slate-900 to-indigo-950 text-white">
          <div className="flex items-center gap-3">
            <div className="p-2 rounded-xl bg-amber-500/20 text-amber-400 border border-amber-500/30">
              <Sparkles className="w-5 h-5 animate-spin" />
            </div>
            <div>
              <div className="flex items-center gap-2">
                <h3 className="text-base font-bold text-white">
                  Demo Scenario: The Overnight Failure Cascade
                </h3>
                <span className="text-[10px] uppercase font-bold tracking-wider px-2 py-0.5 rounded bg-amber-500 text-black">
                  Interactive Simulation
                </span>
              </div>
              <p className="text-xs text-slate-300">
                Experience the domino chain reaction across pipelines, trust scores, request tickets, and platform spend.
              </p>
            </div>
          </div>

          <button
            onClick={() => setIsDemoModalOpen(false)}
            className="text-slate-400 hover:text-white p-1 rounded-lg hover:bg-white/10"
          >
            <X className="w-5 h-5" />
          </button>
        </div>

        {/* Content & Steps */}
        <div className="p-5 overflow-y-auto space-y-4 text-xs">
          {/* Status Banner */}
          <div
            className={`p-4 rounded-xl border flex items-center justify-between ${
              demoState.isFixed
                ? "bg-emerald-50 dark:bg-emerald-950/40 border-emerald-200 dark:border-emerald-800 text-emerald-800 dark:text-emerald-200"
                : "bg-red-50 dark:bg-red-950/40 border-red-200 dark:border-red-800 text-red-800 dark:text-red-200"
            }`}
          >
            <div className="flex items-center gap-2.5">
              {demoState.isFixed ? (
                <CheckCircle2 className="w-5 h-5 text-emerald-600 dark:text-emerald-400 shrink-0" />
              ) : (
                <AlertTriangle className="w-5 h-5 text-red-600 dark:text-red-400 shrink-0 animate-pulse" />
              )}
              <div>
                <span className="font-bold text-sm block">
                  {demoState.isFixed
                    ? "System Restored: All Pipelines & Trust Scores Healthy"
                    : "Failure Active: Cross-System Cascading Incident"}
                </span>
                <span className="text-[11px] opacity-90">
                  {demoState.isFixed
                    ? "Schema migration applied, dbt models rebuilt, executive dashboard trust back at 96/100."
                    : "Stripe failure has halted downstream mart transformations and invalidated executive metrics."}
                </span>
              </div>
            </div>

            <div className="shrink-0 pl-2">
              {demoState.isFixed ? (
                <button
                  onClick={resetDemo}
                  className="px-3 py-1.5 rounded-lg text-xs font-semibold bg-white dark:bg-slate-800 text-slate-700 dark:text-slate-200 border border-slate-300 dark:border-slate-700 hover:bg-slate-50 flex items-center gap-1 cursor-pointer"
                >
                  <RotateCcw className="w-3.5 h-3.5" />
                  <span>Re-trigger Failure</span>
                </button>
              ) : (
                <button
                  onClick={applyDemoFix}
                  className="px-4 py-2 rounded-xl bg-gradient-to-r from-emerald-600 to-teal-600 hover:from-emerald-500 hover:to-teal-500 text-white font-semibold text-xs shadow-md transition-all flex items-center gap-1.5 cursor-pointer"
                >
                  <Check className="w-4 h-4" />
                  <span>Apply 1-Click Fix</span>
                </button>
              )}
            </div>
          </div>

          {/* Sequential 5-Step Timeline */}
          <div className="space-y-2.5 pt-1">
            <h4 className="font-bold text-slate-700 dark:text-slate-300 uppercase tracking-wider text-[11px]">
              The 5-Phase Chain Reaction:
            </h4>

            {steps.map((st) => {
              const Icon = st.icon;
              const isPast = demoState.isFixed || demoState.step >= st.num;

              return (
                <div
                  key={st.num}
                  className={`p-3.5 rounded-xl border transition-all flex items-start gap-3 ${
                    isPast
                      ? "bg-slate-50 dark:bg-slate-800/60 border-slate-200 dark:border-slate-700"
                      : "bg-white dark:bg-slate-900 border-slate-100 dark:border-slate-800 opacity-50"
                  }`}
                >
                  <div
                    className={`flex items-center justify-center w-8 h-8 rounded-xl font-bold shrink-0 mt-0.5 ${
                      demoState.isFixed
                        ? "bg-emerald-100 dark:bg-emerald-950 text-emerald-600 dark:text-emerald-400"
                        : "bg-red-100 dark:bg-red-950 text-red-600 dark:text-red-400"
                    }`}
                  >
                    {demoState.isFixed ? (
                      <Check className="w-4 h-4" />
                    ) : (
                      <Icon className="w-4 h-4" />
                    )}
                  </div>

                  <div className="space-y-1 flex-1">
                    <div className="flex items-center justify-between">
                      <h5 className="font-bold text-slate-900 dark:text-white">
                        {st.title}
                      </h5>
                      <button
                        onClick={() => {
                          setIsDemoModalOpen(false);
                          setActiveTab(st.targetTab);
                        }}
                        className="text-[11px] font-semibold text-blue-600 dark:text-blue-400 hover:underline flex items-center gap-0.5"
                      >
                        <span>View Tab</span>
                        <ArrowRight className="w-3 h-3" />
                      </button>
                    </div>
                    <p className="text-slate-600 dark:text-slate-300 text-[11px]">
                      {st.desc}
                    </p>
                  </div>
                </div>
              );
            })}
          </div>

          {/* Live Incident Execution History */}
          <div className="p-3.5 rounded-xl bg-slate-950 text-slate-300 font-mono text-[11px] space-y-1.5 border border-slate-800">
            <div className="text-slate-500 font-bold border-b border-slate-800 pb-1 text-[10px]">
              SIMULATION TELEMETRY STREAM
            </div>
            {demoState.history.map((h, i) => (
              <div key={i} className="flex items-start gap-2">
                <span className="text-slate-500 shrink-0">[{h.time}]</span>
                <span
                  className={
                    h.type === "error"
                      ? "text-red-400 font-semibold"
                      : h.type === "warning"
                      ? "text-amber-400"
                      : h.type === "success"
                      ? "text-emerald-400 font-semibold"
                      : "text-slate-300"
                  }
                >
                  {h.text}
                </span>
              </div>
            ))}
          </div>
        </div>

        {/* Footer */}
        <div className="p-4 border-t border-slate-200 dark:border-slate-800 bg-slate-50 dark:bg-slate-800/50 flex items-center justify-between text-xs">
          <span className="text-slate-500 dark:text-slate-400">
            Click any "View Tab" link to inspect the real-time effect in each core module.
          </span>

          <button
            onClick={() => setIsDemoModalOpen(false)}
            className="px-4 py-2 rounded-xl bg-slate-200 dark:bg-slate-700 hover:bg-slate-300 dark:hover:bg-slate-600 font-semibold text-slate-800 dark:text-slate-200 transition-colors cursor-pointer"
          >
            Close Console
          </button>
        </div>
      </div>
    </div>
  );
};
