import { useMemo } from 'react';
import { useArchitectureStore } from '../stores/architectureStore';

export const usePanelVisibility = () => {
  const { nodes, selectedNode } = useArchitectureStore();

  const shouldShowPanel = useMemo(() => {
    // Always show panel for templates, or when:
    // 1. A node is selected (for configuration)
    // 2. There are nodes (for analysis, code generation, simulation)
    return true; // Always show panel to access templates
  }, []);

  const getRelevantTabs = useMemo(() => {
    const tabs = ['templates', 'projects', 'cloud']; // Always show templates, projects, and cloud sync
    
    // Configuration tab - only when a node is selected
    if (selectedNode) {
      tabs.push('config');
    }
    
    // Analysis, Code Generation, Simulation, Export, Security, Performance - only when there are nodes
    if (nodes.length > 0) {
      tabs.push('analysis', 'code', 'simulation', 'export', 'security', 'performance');
    }
    
    return tabs;
  }, [selectedNode, nodes.length]);

  const getDefaultTab = () => {
    if (selectedNode) return 'config';
    if (nodes.length > 0) return 'analysis';
    return 'templates'; // Default to templates when no nodes
  };

  return {
    shouldShowPanel,
    relevantTabs: getRelevantTabs,
    defaultTab: getDefaultTab()
  };
};