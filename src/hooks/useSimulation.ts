import { useState, useCallback, useEffect, useRef } from "react";
import { Node, Edge } from "@xyflow/react";
import { RealisticSimulationEngine, SimulationMetrics, FailurePattern, LoadTestScenario } from '../utils/realisticSimulation';

export interface SimulationEvent {
  id: string;
  type: "failure" | "recovery" | "load" | "deploy";
  targetNodeId: string;
  timestamp: number;
  message: string;
  severity: "low" | "medium" | "high" | "critical";
}

export interface SimulationState {
  isRunning: boolean;
  events: SimulationEvent[];
  failedNodes: Set<string>;
  currentLoad: Record<string, number>;
  currentMetrics: Map<string, SimulationMetrics>;
  metricsHistory: SimulationMetrics[];
  activeFailures: Map<string, { pattern: FailurePattern; startTime: number }>;
  systemHealthScore: number;
  isRealisticMode: boolean;
}

export const useSimulation = (nodes: Node[], edges: Edge[]) => {
  const [simulationState, setSimulationState] = useState<SimulationState>({
    isRunning: false,
    events: [],
    failedNodes: new Set(),
    currentLoad: {},
    currentMetrics: new Map(),
    metricsHistory: [],
    activeFailures: new Map(),
    systemHealthScore: 100,
    isRealisticMode: false,
  });
  
  const realisticEngineRef = useRef<RealisticSimulationEngine | null>(null);

  const addEvent = useCallback(
    (event: Omit<SimulationEvent, "id" | "timestamp">) => {
      const newEvent: SimulationEvent = {
        ...event,
        id: `event-${Date.now()}-${Math.random()}`,
        timestamp: Date.now(),
      };

      setSimulationState((prev) => ({
        ...prev,
        events: [newEvent, ...prev.events].slice(0, 100), // Keep last 100 events
      }));

      return newEvent;
    },
    []
  );

  const simulateNodeFailure = useCallback(
    (nodeId: string) => {
      const node = nodes.find((n) => n.id === nodeId);
      if (!node) return;

      const config = (node.data as any)?.config;
      const nodeName = config?.name || nodeId;

      setSimulationState((prev) => ({
        ...prev,
        failedNodes: new Set([...prev.failedNodes, nodeId]),
      }));

      addEvent({
        type: "failure",
        targetNodeId: nodeId,
        message: `${nodeName} has failed`,
        severity: "critical",
      });

      // Simulate cascade failures
      const dependentNodes = edges.filter((edge) => edge.target === nodeId);
      dependentNodes.forEach((edge) => {
        const dependentNode = nodes.find((n) => n.id === edge.source);
        if (dependentNode) {
          const depConfig = (dependentNode.data as any)?.config;
          setTimeout(() => {
            addEvent({
              type: "failure",
              targetNodeId: edge.source,
              message: `${
                depConfig?.name || edge.source
              } affected by ${nodeName} failure`,
              severity: "high",
            });
          }, Math.random() * 2000 + 1000);
        }
      });
    },
    [nodes, edges, addEvent]
  );

  const simulateNodeRecovery = useCallback(
    (nodeId: string) => {
      const node = nodes.find((n) => n.id === nodeId);
      if (!node) return;

      const config = (node.data as any)?.config;
      const nodeName = config?.name || nodeId;

      setSimulationState((prev) => {
        const newFailedNodes = new Set(prev.failedNodes);
        newFailedNodes.delete(nodeId);
        return {
          ...prev,
          failedNodes: newFailedNodes,
        };
      });

      addEvent({
        type: "recovery",
        targetNodeId: nodeId,
        message: `${nodeName} has recovered`,
        severity: "low",
      });
    },
    [nodes, addEvent]
  );

  const simulateLoadTest = useCallback(
    (intensity: "light" | "moderate" | "heavy") => {
      const loadMultipliers = {
        light: 1.5,
        moderate: 3,
        heavy: 5,
      };

      const multiplier = loadMultipliers[intensity];

      nodes.forEach((node) => {
        const config = (node.data as any)?.config;
        if (config?.type === "api") {
          const baseLoad = config.replicas * 100; // Base RPS
          const simulatedLoad = baseLoad * multiplier;

          setSimulationState((prev) => ({
            ...prev,
            currentLoad: {
              ...prev.currentLoad,
              [node.id]: simulatedLoad,
            },
          }));

          addEvent({
            type: "load",
            targetNodeId: node.id,
            message: `${config.name} under ${intensity} load: ${simulatedLoad} RPS`,
            severity: intensity === "heavy" ? "high" : "medium",
          });

          // Simulate failures under heavy load
          if (intensity === "heavy" && config.replicas === 1) {
            setTimeout(() => {
              simulateNodeFailure(node.id);
            }, Math.random() * 5000 + 2000);
          }
        }
      });
    },
    [nodes, addEvent, simulateNodeFailure]
  );

  const simulateDeployment = useCallback(
    (nodeId: string) => {
      const node = nodes.find((n) => n.id === nodeId);
      if (!node) return;

      const config = (node.data as any)?.config;
      const nodeName = config?.name || nodeId;

      addEvent({
        type: "deploy",
        targetNodeId: nodeId,
        message: `Deploying ${nodeName} v2.0`,
        severity: "medium",
      });

      // Simulate rolling deployment
      if (config?.replicas > 1) {
        setTimeout(() => {
          addEvent({
            type: "deploy",
            targetNodeId: nodeId,
            message: `${nodeName} rolling deployment 50% complete`,
            severity: "low",
          });
        }, 2000);

        setTimeout(() => {
          addEvent({
            type: "deploy",
            targetNodeId: nodeId,
            message: `${nodeName} deployment completed successfully`,
            severity: "low",
          });
        }, 4000);
      } else {
        // Single replica means downtime
        setTimeout(() => {
          setSimulationState((prev) => ({
            ...prev,
            failedNodes: new Set([...prev.failedNodes, nodeId]),
          }));

          addEvent({
            type: "failure",
            targetNodeId: nodeId,
            message: `${nodeName} temporarily unavailable during deployment`,
            severity: "high",
          });
        }, 1000);

        setTimeout(() => {
          simulateNodeRecovery(nodeId);
          addEvent({
            type: "deploy",
            targetNodeId: nodeId,
            message: `${nodeName} deployment completed`,
            severity: "low",
          });
        }, 3000);
      }
    },
    [nodes, addEvent, simulateNodeRecovery]
  );

  const startSimulation = useCallback(() => {
    setSimulationState((prev) => ({ ...prev, isRunning: true }));

    addEvent({
      type: "deploy",
      targetNodeId: "",
      message: "Simulation started - monitoring system health",
      severity: "low",
    });
  }, [addEvent]);

  const stopSimulation = useCallback(() => {
    setSimulationState((prev) => ({
      ...prev,
      isRunning: false,
      failedNodes: new Set(),
      currentLoad: {},
    }));

    addEvent({
      type: "deploy",
      targetNodeId: "",
      message: "Simulation stopped - system reset",
      severity: "low",
    });
  }, [addEvent]);

  const clearEvents = useCallback(() => {
    setSimulationState((prev) => ({ ...prev, events: [] }));
  }, []);

  // Initialize realistic simulation engine when nodes/edges change
  useEffect(() => {
    if (nodes.length > 0) {
      realisticEngineRef.current = new RealisticSimulationEngine(nodes, edges);
    }
  }, [nodes, edges]);

  const toggleRealisticMode = useCallback(() => {
    setSimulationState(prev => ({
      ...prev,
      isRealisticMode: !prev.isRealisticMode
    }));
    
    if (!simulationState.isRealisticMode && realisticEngineRef.current) {
      realisticEngineRef.current.start();
      addEvent({
        type: "deploy",
        targetNodeId: "",
        message: "Realistic simulation mode enabled with advanced metrics",
        severity: "medium",
      });
    } else if (realisticEngineRef.current) {
      realisticEngineRef.current.stop();
      addEvent({
        type: "deploy",
        targetNodeId: "",
        message: "Realistic simulation mode disabled",
        severity: "low",
      });
    }
  }, [simulationState.isRealisticMode, addEvent]);

  const runLoadTest = useCallback((scenario: LoadTestScenario) => {
    if (!realisticEngineRef.current) return;
    
    addEvent({
      type: "load",
      targetNodeId: "",
      message: `Starting ${scenario.pattern} load test: ${scenario.name}`,
      severity: "medium",
    });
    
    realisticEngineRef.current.executeLoadTest(scenario).then((results) => {
      setSimulationState(prev => ({
        ...prev,
        metricsHistory: [...prev.metricsHistory, ...results].slice(-1000), // Keep last 1000 metrics
      }));
      
      addEvent({
        type: "load",
        targetNodeId: "",
        message: `Load test completed: ${results.length} data points collected`,
        severity: "low",
      });
    });
  }, [addEvent]);

  const simulateRealisticFailure = useCallback((patternId?: string) => {
    if (!realisticEngineRef.current) return;
    
    const failurePattern = realisticEngineRef.current.simulateRealisticFailure(patternId);
    if (failurePattern) {
      setSimulationState(prev => ({
        ...prev,
        failedNodes: new Set([...prev.failedNodes, ...failurePattern.affectedServices]),
        activeFailures: new Map(prev.activeFailures.set(failurePattern.id, {
          pattern: failurePattern,
          startTime: Date.now()
        }))
      }));
      
      addEvent({
        type: "failure",
        targetNodeId: failurePattern.affectedServices[0] || "",
        message: `${failurePattern.type.toUpperCase()}: ${failurePattern.description}`,
        severity: "critical",
      });
      
      // Schedule recovery
      setTimeout(() => {
        setSimulationState(prev => {
          const newFailedNodes = new Set(prev.failedNodes);
          failurePattern.affectedServices.forEach(id => newFailedNodes.delete(id));
          const newActiveFailures = new Map(prev.activeFailures);
          newActiveFailures.delete(failurePattern.id);
          
          return {
            ...prev,
            failedNodes: newFailedNodes,
            activeFailures: newActiveFailures
          };
        });
        
        addEvent({
          type: "recovery",
          targetNodeId: failurePattern.affectedServices[0] || "",
          message: `Recovered from ${failurePattern.type} failure (MTTR: ${failurePattern.mttr}min)`,
          severity: "low",
        });
      }, failurePattern.mttr * 60 * 1000);
    }
  }, [addEvent]);

  const runChaosExperiment = useCallback((experiment: { type: string; target: string; duration: number; intensity: number }) => {
    if (!realisticEngineRef.current) return;
    
    const chaosExperiment = {
      id: `chaos-${Date.now()}`,
      type: experiment.type as any,
      target: experiment.target,
      startTime: 0,
      duration: experiment.duration,
      intensity: experiment.intensity,
      parameters: {}
    };
    
    realisticEngineRef.current.runChaosExperiment(chaosExperiment);
    
    addEvent({
      type: "failure",
      targetNodeId: experiment.target,
      message: `Chaos experiment: ${experiment.type} on ${experiment.target} (${experiment.duration}s)`,
      severity: "high",
    });
  }, [addEvent]);

  const getRealtimeMetrics = useCallback(() => {
    if (!realisticEngineRef.current) return new Map();
    return realisticEngineRef.current.getCurrentMetrics();
  }, []);

  const getSystemHealth = useCallback(() => {
    if (!realisticEngineRef.current) return 100;
    return realisticEngineRef.current.calculateSystemHealthScore();
  }, []);

  const getFailurePatterns = useCallback(() => {
    if (!realisticEngineRef.current) return [];
    return realisticEngineRef.current.getFailurePatterns();
  }, []);

  // Update metrics periodically when realistic mode is enabled
  useEffect(() => {
    if (!simulationState.isRealisticMode || !realisticEngineRef.current) return;
    
    const interval = setInterval(() => {
      const currentMetrics = getRealtimeMetrics();
      const healthScore = getSystemHealth();
      const activeFailures = realisticEngineRef.current?.getActiveFailures() || new Map();
      
      setSimulationState(prev => ({
        ...prev,
        currentMetrics,
        systemHealthScore: healthScore,
        activeFailures
      }));
    }, 2000);
    
    return () => clearInterval(interval);
  }, [simulationState.isRealisticMode, getRealtimeMetrics, getSystemHealth]);

  return {
    simulationState,
    simulateNodeFailure,
    simulateNodeRecovery,
    simulateLoadTest,
    simulateDeployment,
    startSimulation,
    stopSimulation,
    clearEvents,
    // New realistic simulation methods
    toggleRealisticMode,
    runLoadTest,
    simulateRealisticFailure,
    runChaosExperiment,
    getRealtimeMetrics,
    getSystemHealth,
    getFailurePatterns,
  };
};
