import React, { useState } from "react";
import {
  Play,
  Square,
  Zap,
  Activity,
  AlertTriangle,
  CheckCircle,
  Clock,
  Trash2,
  TrendingUp,
  Shield,
  BarChart3,
  Target,
} from "lucide-react";
import { useArchitectureStore } from "../../stores/architectureStore";
import { useSimulation } from "../../hooks/useSimulation";

const SimulationPanel: React.FC = () => {
  const { nodes, edges } = useArchitectureStore();
  const [activeTab, setActiveTab] = useState<"basic" | "realistic" | "metrics">(
    "basic"
  );
  const {
    simulationState,
    simulateNodeFailure,
    simulateNodeRecovery,
    simulateLoadTest,
    simulateDeployment,
    startSimulation,
    stopSimulation,
    clearEvents,
    // Realistic simulation methods
    runLoadTest,
    simulateRealisticFailure,
    runChaosExperiment,

    getFailurePatterns,
  } = useSimulation(nodes, edges);

  const getEventIcon = (type: string) => {
    switch (type) {
      case "failure":
        return <AlertTriangle className="w-4 h-4 text-red-500" />;
      case "recovery":
        return <CheckCircle className="w-4 h-4 text-green-500" />;
      case "load":
        return <TrendingUp className="w-4 h-4 text-yellow-500" />;
      case "deploy":
        return <Shield className="w-4 h-4 text-blue-500" />;
      default:
        return <Activity className="w-4 h-4 text-gray-500" />;
    }
  };

  const getSeverityColor = (severity: string) => {
    switch (severity) {
      case "critical":
        return "bg-red-100 text-red-800 border-red-200";
      case "high":
        return "bg-orange-100 text-orange-800 border-orange-200";
      case "medium":
        return "bg-yellow-100 text-yellow-800 border-yellow-200";
      case "low":
        return "bg-green-100 text-green-800 border-green-200";
      default:
        return "bg-gray-100 text-gray-800 border-gray-200";
    }
  };

  const formatTimestamp = (timestamp: number) => {
    return new Date(timestamp).toLocaleTimeString();
  };

  if (nodes.length === 0) {
    return (
      <div className="bg-white/90 backdrop-blur-sm border-t border-slate-200 p-6">
        <div className="text-center text-slate-500">
          <Activity className="w-12 h-12 mx-auto mb-4 opacity-50" />
          <h3 className="text-lg font-semibold mb-2">System Simulation</h3>
          <p className="text-sm">
            Add services to start simulating failures and load tests
          </p>
        </div>
      </div>
    );
  }

  return (
    <div className="bg-white/90 backdrop-blur-sm border-t border-slate-200 p-6 flex flex-col h-full">
      {/* Header */}
      <div className="flex items-center justify-between mb-6">
        <div className="flex items-center gap-2">
          <Activity className="w-5 h-5 text-blue-600" />
          <h3 className="text-lg font-bold text-slate-800">
            System Simulation
          </h3>
          {simulationState.isRunning && (
            <div className="flex items-center gap-1 px-2 py-1 bg-green-100 text-green-700 rounded-full text-xs">
              <div className="w-2 h-2 bg-green-500 rounded-full animate-pulse" />
              Running
            </div>
          )}
        </div>
        <div className="flex items-center gap-2">
          {simulationState.isRunning ? (
            <button
              onClick={stopSimulation}
              className="flex items-center gap-2 px-3 py-2 bg-red-500 text-white rounded-lg hover:bg-red-600 transition-colors"
            >
              <Square className="w-4 h-4" />
              Stop
            </button>
          ) : (
            <button
              onClick={startSimulation}
              className="flex items-center gap-2 px-3 py-2 bg-green-500 text-white rounded-lg hover:bg-green-600 transition-colors"
            >
              <Play className="w-4 h-4" />
              Start
            </button>
          )}
        </div>
      </div>

      {/* Tab Navigation */}
      <div className="flex border-b border-slate-200 mb-6">
        {[
          { id: "basic", label: "Basic Tests", icon: Zap },
          { id: "realistic", label: "Realistic Sim", icon: BarChart3 },
          { id: "metrics", label: "Live Metrics", icon: Activity },
        ].map(({ id, label, icon: Icon }) => (
          <button
            key={id}
            onClick={() => setActiveTab(id as any)}
            className={`flex items-center gap-2 px-4 py-2 border-b-2 transition-colors ${
              activeTab === id
                ? "border-blue-500 text-blue-600"
                : "border-transparent text-slate-600 hover:text-slate-800"
            }`}
          >
            <Icon className="w-4 h-4" />
            {label}
          </button>
        ))}
      </div>

      {/* Tab Content */}
      {activeTab === "basic" && (
        <div className="grid grid-cols-2 gap-4 mb-6">
          {/* Failure Tests */}
          <div className="space-y-3">
            <h4 className="text-sm font-semibold text-slate-700 flex items-center gap-2">
              <AlertTriangle className="w-4 h-4" />
              Failure Tests
            </h4>

            <div className="space-y-2">
              {nodes.map((node) => {
                const config = (node.data as any)?.config;
                const isFailure = simulationState.failedNodes.has(node.id);

                return (
                  <div
                    key={node.id}
                    className="flex items-center justify-between p-2 bg-slate-50 rounded-lg"
                  >
                    <div className="flex items-center gap-2">
                      <div
                        className={`w-2 h-2 rounded-full ${
                          isFailure ? "bg-red-500" : "bg-green-500"
                        }`}
                      />
                      <span className="text-sm font-medium">
                        {config?.name || node.id}
                      </span>
                    </div>
                    <button
                      onClick={() =>
                        isFailure
                          ? simulateNodeRecovery(node.id)
                          : simulateNodeFailure(node.id)
                      }
                      className={`px-2 py-1 text-xs rounded transition-colors ${
                        isFailure
                          ? "bg-green-500 text-white hover:bg-green-600"
                          : "bg-red-500 text-white hover:bg-red-600"
                      }`}
                    >
                      {isFailure ? "Recover" : "Fail"}
                    </button>
                  </div>
                );
              })}
            </div>
          </div>

          {/* Load Tests */}
          <div className="space-y-3">
            <h4 className="text-sm font-semibold text-slate-700 flex items-center gap-2">
              <Zap className="w-4 h-4" />
              Load Tests
            </h4>

            <div className="space-y-2">
              {(["light", "moderate", "heavy"] as const).map((intensity) => (
                <button
                  key={intensity}
                  onClick={() => simulateLoadTest(intensity)}
                  className={`w-full px-3 py-2 text-sm rounded-lg transition-colors ${
                    intensity === "light"
                      ? "bg-blue-500 text-white hover:bg-blue-600"
                      : intensity === "moderate"
                      ? "bg-yellow-500 text-white hover:bg-yellow-600"
                      : "bg-red-500 text-white hover:bg-red-600"
                  }`}
                >
                  {intensity.charAt(0).toUpperCase() + intensity.slice(1)} Load
                  Test
                </button>
              ))}
            </div>

            <div className="pt-2 border-t border-slate-200">
              <h5 className="text-xs font-semibold text-slate-600 mb-2">
                Deployment Test
              </h5>
              <div className="space-y-1">
                {nodes.slice(0, 3).map((node) => {
                  const config = (node.data as any)?.config;
                  return (
                    <button
                      key={node.id}
                      onClick={() => simulateDeployment(node.id)}
                      className="w-full px-2 py-1 text-xs bg-purple-500 text-white rounded hover:bg-purple-600 transition-colors"
                    >
                      Deploy {config?.name || node.id}
                    </button>
                  );
                })}
              </div>
            </div>
          </div>
        </div>
      )}

      {activeTab === "realistic" && simulationState.isRealisticMode && (
        <div className="space-y-6 mb-6">
          {/* Realistic Load Tests */}
          <div className="space-y-3">
            <h4 className="text-sm font-semibold text-slate-700 flex items-center gap-2">
              <Target className="w-4 h-4" />
              Advanced Load Testing
            </h4>
            <div className="grid grid-cols-2 gap-2">
              {[
                {
                  name: "Linear Ramp",
                  pattern: "linear",
                  duration: 300,
                  maxUsers: 100,
                },
                {
                  name: "Spike Test",
                  pattern: "spike",
                  duration: 180,
                  maxUsers: 500,
                },
                {
                  name: "Stress Test",
                  pattern: "stress",
                  duration: 600,
                  maxUsers: 1000,
                },
                {
                  name: "Soak Test",
                  pattern: "soak",
                  duration: 1800,
                  maxUsers: 200,
                },
              ].map((scenario) => (
                <button
                  key={scenario.name}
                  onClick={() =>
                    runLoadTest({
                      id: `test-${Date.now()}`,
                      name: scenario.name,
                      duration: scenario.duration,
                      rampUpTime: 60,
                      maxUsers: scenario.maxUsers,
                      pattern: scenario.pattern as any,
                      targetServices: nodes.slice(0, 3).map((n) => n.id),
                    })
                  }
                  className="px-3 py-2 text-sm bg-blue-500 text-white rounded hover:bg-blue-600 transition-colors"
                >
                  {scenario.name}
                </button>
              ))}
            </div>
          </div>

          {/* Chaos Engineering */}
          <div className="space-y-3">
            <h4 className="text-sm font-semibold text-slate-700 flex items-center gap-2">
              <AlertTriangle className="w-4 h-4" />
              Chaos Engineering
            </h4>
            <div className="grid grid-cols-2 gap-2">
              {nodes.slice(0, 4).map((node) => {
                const config = (node.data as any)?.config;
                return (
                  <div key={node.id} className="space-y-1">
                    <div className="text-xs font-medium text-slate-600">
                      {config?.name || node.id}
                    </div>
                    <div className="flex gap-1">
                      <button
                        onClick={() =>
                          runChaosExperiment({
                            type: "cpu_stress",
                            target: node.id,
                            duration: 30,
                            intensity: 0.8,
                          })
                        }
                        className="px-2 py-1 text-xs bg-red-500 text-white rounded hover:bg-red-600"
                      >
                        CPU
                      </button>
                      <button
                        onClick={() =>
                          runChaosExperiment({
                            type: "memory_stress",
                            target: node.id,
                            duration: 30,
                            intensity: 0.7,
                          })
                        }
                        className="px-2 py-1 text-xs bg-orange-500 text-white rounded hover:bg-orange-600"
                      >
                        RAM
                      </button>
                      <button
                        onClick={() =>
                          runChaosExperiment({
                            type: "network_delay",
                            target: node.id,
                            duration: 60,
                            intensity: 0.5,
                          })
                        }
                        className="px-2 py-1 text-xs bg-yellow-500 text-white rounded hover:bg-yellow-600"
                      >
                        NET
                      </button>
                    </div>
                  </div>
                );
              })}
            </div>
          </div>

          {/* Realistic Failure Patterns */}
          <div className="space-y-3">
            <h4 className="text-sm font-semibold text-slate-700 flex items-center gap-2">
              <Shield className="w-4 h-4" />
              Failure Patterns
            </h4>
            <div className="space-y-2">
              {getFailurePatterns()
                .slice(0, 4)
                .map((pattern) => (
                  <div
                    key={pattern.id}
                    className="flex items-center justify-between p-2 bg-slate-50 rounded"
                  >
                    <div className="flex-1">
                      <div className="text-sm font-medium">
                        {pattern.type.toUpperCase()}
                      </div>
                      <div className="text-xs text-slate-600 truncate">
                        {pattern.description}
                      </div>
                      <div className="text-xs text-slate-500">
                        MTTR: {pattern.mttr}min | MTBF: {pattern.mtbf}h
                      </div>
                    </div>
                    <button
                      onClick={() => simulateRealisticFailure(pattern.id)}
                      className="px-2 py-1 text-xs bg-red-500 text-white rounded hover:bg-red-600"
                    >
                      Trigger
                    </button>
                  </div>
                ))}
            </div>
          </div>
        </div>
      )}

      {activeTab === "metrics" && simulationState.isRealisticMode && (
        <div className="space-y-4 mb-6">
          <div className="grid grid-cols-2 gap-4">
            {Array.from(simulationState.currentMetrics.entries())
              .slice(0, 6)
              .map(([nodeId, metrics]) => {
                const node = nodes.find((n) => n.id === nodeId);
                const config = (node?.data as any)?.config;
                const isFailure = simulationState.failedNodes.has(nodeId);

                return (
                  <div key={nodeId} className="bg-slate-50 rounded-lg p-3">
                    <div className="flex items-center gap-2 mb-2">
                      <div
                        className={`w-2 h-2 rounded-full ${
                          isFailure
                            ? "bg-red-500"
                            : metrics.metrics.availability > 99
                            ? "bg-green-500"
                            : "bg-yellow-500"
                        }`}
                      />
                      <span className="text-sm font-medium">
                        {config?.name || nodeId}
                      </span>
                    </div>
                    <div className="space-y-1">
                      <div className="flex justify-between text-xs">
                        <span>CPU:</span>
                        <span
                          className={
                            metrics.metrics.cpu > 80
                              ? "text-red-600"
                              : "text-slate-600"
                          }
                        >
                          {Math.round(metrics.metrics.cpu)}%
                        </span>
                      </div>
                      <div className="flex justify-between text-xs">
                        <span>Memory:</span>
                        <span
                          className={
                            metrics.metrics.memory > 80
                              ? "text-red-600"
                              : "text-slate-600"
                          }
                        >
                          {Math.round(metrics.metrics.memory)}%
                        </span>
                      </div>
                      <div className="flex justify-between text-xs">
                        <span>Response:</span>
                        <span
                          className={
                            metrics.metrics.responseTime > 1000
                              ? "text-red-600"
                              : "text-slate-600"
                          }
                        >
                          {Math.round(metrics.metrics.responseTime)}ms
                        </span>
                      </div>
                      <div className="flex justify-between text-xs">
                        <span>Errors:</span>
                        <span
                          className={
                            metrics.metrics.errorRate > 5
                              ? "text-red-600"
                              : "text-slate-600"
                          }
                        >
                          {metrics.metrics.errorRate.toFixed(2)}%
                        </span>
                      </div>
                      <div className="flex justify-between text-xs">
                        <span>Uptime:</span>
                        <span
                          className={
                            metrics.metrics.availability < 99
                              ? "text-red-600"
                              : "text-green-600"
                          }
                        >
                          {metrics.metrics.availability.toFixed(1)}%
                        </span>
                      </div>
                    </div>
                  </div>
                );
              })}
          </div>

          {simulationState.activeFailures.size > 0 && (
            <div className="space-y-2">
              <h5 className="text-sm font-semibold text-red-700">
                Active Failures
              </h5>
              {Array.from(simulationState.activeFailures.entries()).map(
                ([id, failure]) => (
                  <div
                    key={id}
                    className="flex items-center justify-between p-2 bg-red-50 border border-red-200 rounded"
                  >
                    <div>
                      <div className="text-sm font-medium text-red-800">
                        {failure.pattern.type.toUpperCase()}
                      </div>
                      <div className="text-xs text-red-600">
                        {failure.pattern.description}
                      </div>
                    </div>
                    <div className="text-xs text-red-500">
                      {Math.round((Date.now() - failure.startTime) / 1000)}s ago
                    </div>
                  </div>
                )
              )}
            </div>
          )}
        </div>
      )}

      {/* Event Log */}
      <div className="flex-1 min-h-0">
        <div className="flex items-center justify-between mb-3">
          <h4 className="text-sm font-semibold text-slate-700 flex items-center gap-2">
            <Clock className="w-4 h-4" />
            Event Log
          </h4>
          <button
            onClick={clearEvents}
            className="flex items-center gap-1 px-2 py-1 text-xs text-slate-600 hover:text-slate-800 transition-colors"
          >
            <Trash2 className="w-3 h-3" />
            Clear
          </button>
        </div>

        <div className="bg-slate-50 rounded-lg p-3 h-full overflow-y-auto space-y-2">
          {simulationState.events.length === 0 ? (
            <div className="text-center text-slate-500 py-8">
              <Clock className="w-8 h-8 mx-auto mb-2 opacity-50" />
              <p className="text-sm">
                No events yet. Start a simulation to see activity.
              </p>
            </div>
          ) : (
            simulationState.events.map((event) => (
              <div
                key={event.id}
                className={`flex items-start gap-3 p-3 rounded-lg border ${getSeverityColor(
                  event.severity
                )}`}
              >
                <div className="flex-shrink-0 mt-0.5">
                  {getEventIcon(event.type)}
                </div>
                <div className="flex-1 min-w-0">
                  <div className="text-sm font-medium">{event.message}</div>
                  <div className="text-xs opacity-75 mt-1">
                    {formatTimestamp(event.timestamp)}
                  </div>
                </div>
              </div>
            ))
          )}
        </div>
      </div>
    </div>
  );
};

export default SimulationPanel;
