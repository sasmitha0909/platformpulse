import React from "react";
import { AppProvider, useApp } from "./context/AppContext";
import { Header } from "./components/Header";
import { HomeOverview } from "./components/HomeOverview";
import { PipelineHealth } from "./components/PipelineHealth";
import { DashboardTrust } from "./components/DashboardTrust";
import { RequestQueue } from "./components/RequestQueue";
import { CostOptimizer } from "./components/CostOptimizer";
import { DemoScenarioModal } from "./components/DemoScenarioModal";
import { SlackAlertModal } from "./components/SlackAlertModal";
import { CopilotDrawer } from "./components/CopilotDrawer";

const MainLayout = () => {
  const { activeTab } = useApp();

  return (
    <div className="min-h-screen bg-slate-50 dark:bg-slate-950 text-slate-900 dark:text-slate-100 transition-colors duration-200 flex flex-col font-sans">
      <Header />

      <main className="flex-1 max-w-7xl w-full mx-auto px-4 sm:px-6 lg:px-8 pt-6">
        {activeTab === "home" && <HomeOverview />}
        {activeTab === "pipelines" && <PipelineHealth />}
        {activeTab === "dashboards" && <DashboardTrust />}
        {activeTab === "requests" && <RequestQueue />}
        {activeTab === "cost" && <CostOptimizer />}
      </main>

      {/* Footer */}
      <footer className="border-t border-slate-200 dark:border-slate-800 bg-white dark:bg-slate-900 py-6 text-center text-xs text-slate-500 dark:text-slate-400">
        <div className="max-w-7xl mx-auto px-4 flex flex-col sm:flex-row items-center justify-between gap-2">
          <div className="flex items-center gap-2">
            <span className="font-bold text-slate-800 dark:text-slate-200">
              PlatformPulse
            </span>
            <span>•</span>
            <span>Control Tower for Internal Data & IT Teams</span>
          </div>
          <div>
            Built with React, Tailwind CSS & Recharts • Enterprise-Grade Resilience
          </div>
        </div>
      </footer>

      {/* Global Interactive Modals & Drawers */}
      <DemoScenarioModal />
      <SlackAlertModal />
      <CopilotDrawer />
    </div>
  );
};

export default function App() {
  return (
    <AppProvider>
      <MainLayout />
    </AppProvider>
  );
}
