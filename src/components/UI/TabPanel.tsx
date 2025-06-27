import React, { useState, useEffect } from "react";
import {
  Settings,
  TrendingUp,
  Code,
  Activity,
  Upload,
  Layout,
  Shield,
  Zap,
} from "lucide-react";
import NodeConfigPanel from "../Panels/NodeConfigPanel";
import ArchitectureAnalysis from "../Panels/ArchitectureAnalysis";
import CodeGenerator from "../Panels/CodeGenerator";
import SimulationPanel from "../Panels/SimulationPanel";
import ExportImportPanel from "../Panels/ExportImportPanel";
import TemplateSelector from "../Panels/TemplateSelector";
import SecurityPanel from "../Panels/SecurityPanel";
import PerformancePanel from "../Panels/PerformancePanel";
import { usePanelVisibility } from "../../hooks/usePanelVisibility";

type TabType =
  | "templates"
  | "projects"
  | "config"
  | "analysis"
  | "code"
  | "simulation"
  | "export"
  | "security"
  | "performance";

interface Tab {
  id: TabType;
  label: string;
  icon: React.ReactNode;
  component: React.ReactNode;
}

const TabPanel: React.FC = () => {
  const { shouldShowPanel, relevantTabs, defaultTab } = usePanelVisibility();
  const [activeTab, setActiveTab] = useState<TabType>("templates");

  const allTabs: Tab[] = [
    {
      id: "templates",
      label: "Templates",
      icon: <Layout className="w-4 h-4" />,
      component: <TemplateSelector />,
    },
    {
      id: "config",
      label: "Configure",
      icon: <Settings className="w-4 h-4" />,
      component: <NodeConfigPanel />,
    },
    {
      id: "analysis",
      label: "Analysis",
      icon: <TrendingUp className="w-4 h-4" />,
      component: <ArchitectureAnalysis />,
    },
    {
      id: "code",
      label: "Generate",
      icon: <Code className="w-4 h-4" />,
      component: <CodeGenerator />,
    },
    {
      id: "simulation",
      label: "Simulate",
      icon: <Activity className="w-4 h-4" />,
      component: <SimulationPanel />,
    },
    {
      id: "export",
      label: "Export",
      icon: <Upload className="w-4 h-4" />,
      component: <ExportImportPanel />,
    },
    {
      id: "security",
      label: "Security",
      icon: <Shield className="w-4 h-4" />,
      component: <SecurityPanel />,
    },
    {
      id: "performance",
      label: "Performance",
      icon: <Zap className="w-4 h-4" />,
      component: <PerformancePanel />,
    },
  ];

  // Filter tabs based on what's relevant
  const availableTabs = allTabs.filter((tab) => relevantTabs.includes(tab.id));

  // Auto-switch to default tab when context changes
  useEffect(() => {
    if (relevantTabs.length > 0 && !relevantTabs.includes(activeTab)) {
      setActiveTab(defaultTab as TabType);
    }
  }, [relevantTabs, activeTab, defaultTab]);

  // Don't render anything if panel should be hidden
  if (!shouldShowPanel) {
    return null;
  }

  const activeTabComponent = availableTabs.find(
    (tab) => tab.id === activeTab
  )?.component;

  return (
    <div className="flex flex-col h-full w-full bg-white/90 backdrop-blur-sm border-l border-slate-200 shadow-lg">
      {/* Tab Navigation - only show if multiple tabs available */}
      {availableTabs.length > 1 && (
        <div className="flex border-b border-slate-200 bg-slate-50">
          {availableTabs.map((tab) => (
            <button
              key={tab.id}
              onClick={() => setActiveTab(tab.id)}
              className={`flex items-center justify-center gap-1 px-2 py-3 text-xs font-medium transition-colors flex-1 min-w-0 ${
                activeTab === tab.id
                  ? "bg-white text-blue-600 border-b-2 border-blue-600"
                  : "text-slate-600 hover:text-slate-800 hover:bg-slate-100"
              }`}
              title={tab.label}
            >
              {tab.icon}
              <span className="hidden sm:inline truncate">{tab.label}</span>
            </button>
          ))}
        </div>
      )}

      {/* Tab Content */}
      <div className="flex-1 overflow-hidden">{activeTabComponent}</div>
    </div>
  );
};

export default TabPanel;
