import React, { useState } from "react";
import { useApp } from "../context/AppContext";
import {
  Bell,
  CheckCircle2,
  AlertTriangle,
  ExternalLink,
  Mail,
  MessageSquare,
  X,
  RefreshCw,
  Terminal,
  ShieldAlert,
  Check
} from "lucide-react";

export const SlackAlertModal = () => {
  const {
    isAlertModalOpen,
    setIsAlertModalOpen,
    activeSlackAlert,
    applyDemoFix,
    setActiveTab,
    pipelines,
    setSelectedPipeline
  } = useApp();

  const [previewChannel, setPreviewChannel] = useState("slack"); // 'slack' | 'email'
  const [acknowledged, setAcknowledged] = useState(false);
  const [patchApplied, setPatchApplied] = useState(false);

  if (!isAlertModalOpen) return null;

  const alert = activeSlackAlert || {
    channel: "#data-incidents",
    severity: "P1 - CRITICAL",
    title: "Pipeline Failure: pipeline_stripe_billing_sync",
    summary: "Schema mismatch in stg_stripe__charges halted billing sync at 03:14 AM. 2 downstream executive dashboards impacted.",
    impactedDashboards: ["Executive Revenue & ARR Overview (48 daily viewers)", "Customer Success Health & Churn Risk"],
    timestamp: "Today at 03:17 AM",
    actions: ["Acknowledge PagerDuty", "View Stack Trace", "Apply Migration Patch"]
  };

  const handleApplyFix = () => {
    setPatchApplied(true);
    applyDemoFix();
    setTimeout(() => {
      setPatchApplied(false);
      setIsAlertModalOpen(false);
    }, 1500);
  };

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-black/75 backdrop-blur-sm">
      <div className="w-full max-w-xl rounded-2xl bg-white dark:bg-slate-900 border border-slate-200 dark:border-slate-800 text-slate-900 dark:text-slate-100 shadow-2xl overflow-hidden flex flex-col max-h-[90vh]">
        {/* Header */}
        <div className="p-4 border-b border-slate-200 dark:border-slate-800 flex items-center justify-between bg-slate-50 dark:bg-slate-800/60">
          <div className="flex items-center gap-2">
            <Bell className="w-4 h-4 text-red-500" />
            <h3 className="text-sm font-bold text-slate-900 dark:text-white">
              Alert Rules & Incident Dispatch Preview
            </h3>
          </div>

          <div className="flex items-center gap-2">
            <div className="flex items-center p-0.5 rounded-lg bg-slate-200 dark:bg-slate-700 text-xs font-semibold">
              <button
                onClick={() => setPreviewChannel("slack")}
                className={`px-2 py-1 rounded-md transition-all flex items-center gap-1 ${
                  previewChannel === "slack"
                    ? "bg-white text-slate-900 dark:bg-slate-900 dark:text-white shadow-sm"
                    : "text-slate-600 dark:text-slate-400"
                }`}
              >
                <MessageSquare className="w-3 h-3 text-purple-500" />
                <span>Slack Preview</span>
              </button>
              <button
                onClick={() => setPreviewChannel("email")}
                className={`px-2 py-1 rounded-md transition-all flex items-center gap-1 ${
                  previewChannel === "email"
                    ? "bg-white text-slate-900 dark:bg-slate-900 dark:text-white shadow-sm"
                    : "text-slate-600 dark:text-slate-400"
                }`}
              >
                <Mail className="w-3 h-3 text-blue-500" />
                <span>Email Digest</span>
              </button>
            </div>

            <button
              onClick={() => setIsAlertModalOpen(false)}
              className="p-1 rounded-lg text-slate-400 hover:text-slate-600 dark:hover:text-white"
            >
              <X className="w-5 h-5" />
            </button>
          </div>
        </div>

        {/* Modal Body */}
        <div className="p-5 overflow-y-auto space-y-4 text-xs">
          {previewChannel === "slack" ? (
            /* SLACK CLIENT MOCKUP */
            <div className="p-4 rounded-xl bg-slate-900 text-slate-100 font-sans border border-slate-800 space-y-3 shadow-inner">
              {/* Slack Header */}
              <div className="flex items-center justify-between border-b border-slate-800 pb-2 text-[11px] text-slate-400">
                <span className="font-bold text-white flex items-center gap-1">
                  <span>#</span> data-incidents
                </span>
                <span>Active Notification Rule #14: Critical Pipeline Outages</span>
              </div>

              {/* Bot Post */}
              <div className="flex items-start gap-3">
                <div className="w-9 h-9 rounded-lg bg-blue-600 flex items-center justify-center font-bold text-white shrink-0 text-sm shadow">
                  PP
                </div>

                <div className="space-y-2 flex-1">
                  <div className="flex items-center gap-1.5">
                    <span className="font-bold text-white text-xs">
                      PlatformPulse Alert Bot
                    </span>
                    <span className="text-[9px] bg-slate-700 text-slate-300 px-1 rounded uppercase font-semibold">
                      APP
                    </span>
                    <span className="text-[11px] text-slate-400">{alert.timestamp}</span>
                  </div>

                  {/* Slack Rich Attachment Card */}
                  <div className="p-3.5 rounded-lg bg-slate-950 border-l-4 border-l-red-500 border border-slate-800 space-y-2.5">
                    <div className="flex items-center justify-between">
                      <span className="font-bold text-red-400 text-xs flex items-center gap-1">
                        <AlertTriangle className="w-3.5 h-3.5" />
                        {alert.title}
                      </span>
                      <span className="text-[10px] font-bold px-1.5 py-0.5 rounded bg-red-950 text-red-300 border border-red-800">
                        {alert.severity}
                      </span>
                    </div>

                    <p className="text-slate-300 text-xs leading-relaxed">
                      {alert.summary}
                    </p>

                    <div className="p-2 rounded bg-slate-900/80 border border-slate-800 text-[11px] space-y-1">
                      <div className="text-slate-400 font-semibold">
                        Impacted Downstream Dashboards:
                      </div>
                      {alert.impactedDashboards.map((dash, idx) => (
                        <div key={idx} className="text-amber-300 flex items-center gap-1">
                          <span>•</span>
                          <span>{dash}</span>
                        </div>
                      ))}
                    </div>

                    {/* Interactive Slack Action Buttons */}
                    <div className="flex items-center gap-2 pt-1 flex-wrap">
                      <button
                        onClick={() => setAcknowledged(true)}
                        className={`px-3 py-1.5 rounded text-xs font-semibold transition-colors flex items-center gap-1 ${
                          acknowledged
                            ? "bg-slate-800 text-slate-400"
                            : "bg-slate-800 hover:bg-slate-700 text-white border border-slate-700"
                        }`}
                      >
                        {acknowledged ? (
                          <>
                            <Check className="w-3.5 h-3.5 text-emerald-400" />
                            <span>Acknowledged by You</span>
                          </>
                        ) : (
                          <span>Acknowledge PagerDuty</span>
                        )}
                      </button>

                      <button
                        onClick={handleApplyFix}
                        className="px-3 py-1.5 rounded text-xs font-semibold bg-emerald-600 hover:bg-emerald-500 text-white transition-colors flex items-center gap-1"
                      >
                        {patchApplied ? (
                          <>
                            <Check className="w-3.5 h-3.5" />
                            <span>Patch Deployed!</span>
                          </>
                        ) : (
                          <>
                            <RefreshCw className="w-3.5 h-3.5" />
                            <span>Run Hotfix Patch</span>
                          </>
                        )}
                      </button>

                      <button
                        onClick={() => {
                          setIsAlertModalOpen(false);
                          setActiveTab("pipelines");
                          const p = pipelines.find((x) => x.id === "pipe-stripe-billing");
                          if (p) setSelectedPipeline(p);
                        }}
                        className="px-2.5 py-1.5 rounded text-xs text-slate-300 hover:text-white underline"
                      >
                        Inspect Stack Trace
                      </button>
                    </div>
                  </div>
                </div>
              </div>
            </div>
          ) : (
            /* EMAIL DIGEST MOCKUP */
            <div className="p-5 rounded-xl bg-slate-50 dark:bg-slate-800/40 border border-slate-200 dark:border-slate-700 space-y-3 font-sans">
              <div className="border-b border-slate-200 dark:border-slate-700 pb-2 text-xs space-y-1">
                <div>
                  <span className="text-slate-400">From: </span>
                  <span className="font-semibold text-slate-800 dark:text-slate-200">
                    alerts@platformpulse.internal.company.com
                  </span>
                </div>
                <div>
                  <span className="text-slate-400">To: </span>
                  <span className="font-semibold text-slate-800 dark:text-slate-200">
                    data-oncall@company.com, cfo-ops@company.com
                  </span>
                </div>
                <div>
                  <span className="text-slate-400">Subject: </span>
                  <span className="font-bold text-red-600 dark:text-red-400">
                    [URGENT] Pipeline Outage: Executive Revenue Stale (48/100)
                  </span>
                </div>
              </div>

              <div className="space-y-2 text-xs text-slate-700 dark:text-slate-300 leading-relaxed">
                <p>Hello Data Operations Team,</p>
                <p>
                  At <strong>03:14 AM UTC</strong>, the automated pipeline <code>pipeline_stripe_billing_sync</code> terminated unexpectedly with exit code 1 due to schema drift.
                </p>
                <p>
                  <strong>Downstream Impact:</strong> The <em>Executive Revenue & ARR Overview</em> dashboard used by 48 C-Suite stakeholders has been marked STALE and failed freshness assertions.
                </p>
                <div className="p-3 rounded-lg bg-white dark:bg-slate-900 border border-slate-200 dark:border-slate-800 text-[11px] font-mono">
                  Recommended hotfix: Apply migration patch v2.14 or run 'dbt run --select stg_stripe__charges+'
                </div>
              </div>
            </div>
          )}
        </div>

        {/* Footer */}
        <div className="p-4 border-t border-slate-200 dark:border-slate-800 bg-slate-50 dark:bg-slate-800/60 flex items-center justify-between text-xs">
          <span className="text-slate-500 dark:text-slate-400">
            Rules configured: Slack Webhook, PagerDuty Integration, Email Digest.
          </span>
          <button
            onClick={() => setIsAlertModalOpen(false)}
            className="px-4 py-2 rounded-xl bg-slate-200 dark:bg-slate-700 hover:bg-slate-300 dark:hover:bg-slate-600 font-semibold text-slate-800 dark:text-slate-200 transition-colors"
          >
            Close
          </button>
        </div>
      </div>
    </div>
  );
};
