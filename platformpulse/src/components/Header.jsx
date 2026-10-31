import React from "react";
import { useApp } from "../context/AppContext";
import {
  Activity,
  Layers,
  ShieldCheck,
  Inbox,
  DollarSign,
  Sun,
  Moon,
  Sparkles,
  Play,
  RotateCcw,
  Bell,
  MessageSquare,
  Users,
  CheckCircle2,
  AlertTriangle
} from "lucide-react";

export const Header = () => {
  const {
    theme,
    toggleTheme,
    activeTab,
    setActiveTab,
    userPersona,
    setUserPersona,
    runDemoScenario,
    resetDemo,
    demoState,
    setIsDemoModalOpen,
    setIsAlertModalOpen,
    setIsCopilotOpen,
    failedPipelinesCount,
    dashboards,
    requests,
    wasteRecs,
    backendStatus
  } = useApp();

  const staleDashboardsCount = dashboards.filter((d) => d.status === "stale").length;
  const pendingRequestsCount = requests.filter((r) => r.status === "in_triage" || r.status === "backlog").length;
  const pendingWasteCount = wasteRecs.filter((r) => r.status === "pending").length;

  const navItems = [
    { id: "home", label: "Control Tower", icon: Activity, badge: null },
    {
      id: "pipelines",
      label: "Pipeline Health",
      icon: Layers,
      badge: failedPipelinesCount > 0 ? `${failedPipelinesCount} Failed` : null,
      badgeColor: "bg-red-500 text-white"
    },
    {
      id: "dashboards",
      label: "Dashboard Trust",
      icon: ShieldCheck,
      badge: staleDashboardsCount > 0 ? `${staleDashboardsCount} Stale` : null,
      badgeColor: "bg-amber-500 text-white"
    },
    {
      id: "requests",
      label: "Request Queue",
      icon: Inbox,
      badge: `${pendingRequestsCount}`,
      badgeColor: "bg-blue-500/20 text-blue-600 dark:text-blue-400"
    },
    {
      id: "cost",
      label: "Cost Optimizer",
      icon: DollarSign,
      badge: `$${(pendingWasteCount * 1.95).toFixed(1)}k waste`,
      badgeColor: "bg-emerald-500/20 text-emerald-600 dark:text-emerald-400"
    }
  ];

  return (
    <header className="sticky top-0 z-40 w-full border-b backdrop-blur-md transition-colors duration-200 border-slate-200 dark:border-slate-800 bg-white/90 dark:bg-slate-900/90">
      {/* Top Banner: One-sentence value proposition */}
      <div className="bg-gradient-to-r from-blue-600 via-indigo-600 to-violet-600 text-white px-4 py-1.5 text-xs sm:text-sm font-medium flex items-center justify-between shadow-sm">
        <div className="flex items-center gap-2 mx-auto sm:mx-0 overflow-hidden text-ellipsis whitespace-nowrap">
          <span className="flex h-2 w-2 relative">
            <span className="animate-ping absolute inline-flex h-full w-full rounded-full bg-emerald-300 opacity-75"></span>
            <span className="relative inline-flex rounded-full h-2 w-2 bg-emerald-400"></span>
          </span>
          <span className="font-semibold tracking-wide uppercase text-[10px] bg-white/20 px-1.5 py-0.5 rounded">
            Live Control Tower
          </span>
          <span className="hidden sm:inline">
            PlatformPulse connects overnight pipeline health, dashboard trust scores, AI request triage, and platform cost governance.
          </span>
          <span className="sm:hidden">Unified data platform control tower</span>
        </div>

        {/* Demo status indicator in top bar */}
        <div className="hidden md:flex items-center gap-3">
          <span className="flex items-center gap-1.5 text-xs text-blue-100 bg-blue-900/50 px-2 py-0.5 rounded border border-blue-400/40">
            <span className="w-2 h-2 rounded-full bg-emerald-400 animate-pulse" />
            <span className="font-semibold">Exasol Core:</span>
            <span className="text-blue-200">{backendStatus?.engine ? backendStatus.engine.split(' ')[0] : 'Exasol'} SQL</span>
          </span>

          {demoState.isFixed ? (
            <span className="flex items-center gap-1.5 text-xs text-emerald-200 bg-emerald-950/40 px-2 py-0.5 rounded border border-emerald-500/30">
              <CheckCircle2 className="w-3.5 h-3.5 text-emerald-300" />
              Demo: Issues Auto-Healed
            </span>
          ) : (
            <span className="flex items-center gap-1.5 text-xs text-amber-200 bg-amber-950/40 px-2 py-0.5 rounded border border-amber-500/30">
              <AlertTriangle className="w-3.5 h-3.5 text-amber-300 animate-pulse" />
              Demo: Overnight Failure Active
            </span>
          )}
        </div>
      </div>

      {/* Main Navigation Bar */}
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="flex items-center justify-between h-16 gap-2">
          {/* Brand Logo */}
          <div className="flex items-center gap-3 cursor-pointer" onClick={() => setActiveTab("home")}>
            <div className="relative flex items-center justify-center w-10 h-10 rounded-xl bg-gradient-to-br from-blue-600 to-indigo-700 text-white shadow-md shadow-blue-500/20">
              <Activity className="w-5 h-5 animate-pulse" />
            </div>
            <div>
              <div className="flex items-center gap-2">
                <span className="text-xl font-bold tracking-tight text-slate-900 dark:text-white">
                  Platform<span className="text-blue-600 dark:text-blue-400">Pulse</span>
                </span>
                <span className="text-[10px] uppercase font-semibold px-1.5 py-0.5 rounded bg-blue-100 text-blue-700 dark:bg-blue-950 dark:text-blue-300 border border-blue-200 dark:border-blue-800">
                  v2.4
                </span>
              </div>
              <p className="text-[11px] font-medium text-slate-500 dark:text-slate-400 hidden sm:block">
                Data & IT Platform Control Tower
              </p>
            </div>
          </div>

          {/* Center Navigation Tabs */}
          <nav className="hidden lg:flex items-center space-x-1">
            {navItems.map((item) => {
              const Icon = item.icon;
              const isActive = activeTab === item.id;
              return (
                <button
                  key={item.id}
                  onClick={() => setActiveTab(item.id)}
                  className={`relative flex items-center gap-2 px-3 py-2 rounded-lg text-sm font-medium transition-all ${
                    isActive
                      ? "bg-slate-100 text-blue-600 dark:bg-slate-800 dark:text-blue-400 shadow-sm"
                      : "text-slate-600 dark:text-slate-400 hover:text-slate-900 dark:hover:text-slate-100 hover:bg-slate-50 dark:hover:bg-slate-800/50"
                  }`}
                >
                  <Icon className={`w-4 h-4 ${isActive ? "text-blue-600 dark:text-blue-400" : "text-slate-400"}`} />
                  <span>{item.label}</span>
                  {item.badge && (
                    <span
                      className={`text-[10px] font-bold px-1.5 py-0.5 rounded-full ${item.badgeColor}`}
                    >
                      {item.badge}
                    </span>
                  )}
                  {isActive && (
                    <span className="absolute bottom-0 left-2 right-2 h-0.5 bg-blue-600 dark:bg-blue-400 rounded-full" />
                  )}
                </button>
              );
            })}
          </nav>

          {/* Right Action Controls */}
          <div className="flex items-center gap-2">
            {/* User Persona Switcher */}
            <div className="hidden md:flex items-center gap-1.5 text-xs bg-slate-100 dark:bg-slate-800 p-1 rounded-lg border border-slate-200 dark:border-slate-700">
              <Users className="w-3.5 h-3.5 text-slate-400 ml-1.5" />
              <select
                value={userPersona}
                onChange={(e) => setUserPersona(e.target.value)}
                className="bg-transparent text-xs font-medium text-slate-700 dark:text-slate-300 focus:outline-none cursor-pointer pr-1"
                title="Filter view by target user persona"
              >
                <option value="all" className="dark:bg-slate-800">Persona: All Roles</option>
                <option value="engineer" className="dark:bg-slate-800">Persona: Data Engineer</option>
                <option value="finance" className="dark:bg-slate-800">Persona: Finance & BizOps</option>
                <option value="business" className="dark:bg-slate-800">Persona: Business User</option>
              </select>
            </div>

            {/* Run Demo Scenario Button */}
            <button
              onClick={runDemoScenario}
              className="flex items-center gap-1.5 px-3 py-1.5 text-xs font-semibold rounded-lg bg-gradient-to-r from-amber-500 to-orange-500 hover:from-amber-600 hover:to-orange-600 text-white shadow-sm hover:shadow transition-all"
              title="Simulate overnight pipeline failure and cascade"
            >
              <Play className="w-3.5 h-3.5 fill-current" />
              <span className="hidden sm:inline">Run Demo Scenario</span>
              <span className="sm:hidden">Demo</span>
            </button>

            {/* Reset Demo button if modified */}
            {(demoState.isFixed || demoState.step > 0) && (
              <button
                onClick={resetDemo}
                className="p-1.5 rounded-lg text-slate-500 hover:text-slate-800 dark:text-slate-400 dark:hover:text-slate-200 hover:bg-slate-100 dark:hover:bg-slate-800 transition-colors"
                title="Reset demo scenario to initial failed state"
              >
                <RotateCcw className="w-4 h-4" />
              </button>
            )}

            {/* Copilot Trigger Button */}
            <button
              onClick={() => setIsCopilotOpen(true)}
              className="flex items-center gap-1.5 px-2.5 py-1.5 text-xs font-medium rounded-lg text-purple-700 dark:text-purple-300 bg-purple-50 dark:bg-purple-950/50 hover:bg-purple-100 dark:hover:bg-purple-900/50 border border-purple-200 dark:border-purple-800 transition-colors"
              title="Open PlatformPulse AI Assistant"
            >
              <Sparkles className="w-3.5 h-3.5 text-purple-600 dark:text-purple-400" />
              <span className="hidden xl:inline">AI Copilot</span>
            </button>

            {/* Simulated Slack Incident Bell */}
            <button
              onClick={() => setIsAlertModalOpen(true)}
              className="relative p-2 rounded-lg text-slate-600 dark:text-slate-400 hover:text-slate-900 dark:hover:text-slate-100 hover:bg-slate-100 dark:hover:bg-slate-800 transition-colors"
              title="Simulated Slack Incident Alert"
            >
              <Bell className="w-4 h-4" />
              {failedPipelinesCount > 0 && (
                <span className="absolute top-1 right-1 w-2 h-2 rounded-full bg-red-500 animate-pulse" />
              )}
            </button>

            {/* Theme Toggle Button */}
            <button
              onClick={toggleTheme}
              className="p-2 rounded-lg text-slate-600 dark:text-slate-400 hover:text-slate-900 dark:hover:text-slate-100 hover:bg-slate-100 dark:hover:bg-slate-800 transition-colors"
              title={`Switch to ${theme === "dark" ? "Light" : "Dark"} mode`}
            >
              {theme === "dark" ? <Sun className="w-4 h-4 text-amber-400" /> : <Moon className="w-4 h-4 text-slate-600" />}
            </button>
          </div>
        </div>

        {/* Mobile Navigation bar for smaller screens */}
        <div className="lg:hidden flex items-center justify-between overflow-x-auto py-2 border-t border-slate-200 dark:border-slate-800 gap-1 scrollbar-none">
          {navItems.map((item) => {
            const Icon = item.icon;
            const isActive = activeTab === item.id;
            return (
              <button
                key={item.id}
                onClick={() => setActiveTab(item.id)}
                className={`flex items-center gap-1.5 px-2.5 py-1.5 rounded-lg text-xs font-medium whitespace-nowrap ${
                  isActive
                    ? "bg-blue-50 text-blue-700 dark:bg-slate-800 dark:text-blue-400 font-semibold"
                    : "text-slate-600 dark:text-slate-400 hover:bg-slate-100 dark:hover:bg-slate-800/60"
                }`}
              >
                <Icon className="w-3.5 h-3.5" />
                <span>{item.label}</span>
                {item.badge && (
                  <span className={`text-[9px] px-1 py-0.2 rounded-full ${item.badgeColor}`}>
                    {item.badge}
                  </span>
                )}
              </button>
            );
          })}
        </div>
      </div>
    </header>
  );
};
