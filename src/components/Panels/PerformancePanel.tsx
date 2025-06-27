import React, { useState, useMemo, useEffect, useCallback } from 'react';
import {
  Zap,
  TrendingUp,
  AlertTriangle,
  CheckCircle,
  Activity,
  Cpu,
  HardDrive,
  Network,
  Database,
  Target,
  Lightbulb,
  BarChart3,
  // PieChart,
  RefreshCw,
  Settings,
  // Eye,
  ArrowUp,
  ArrowDown,
  Bell,
  BellOff,
  // Clock,
  TrendingDown,
  Gauge,
  Monitor,
} from 'lucide-react';
import { useArchitectureStore } from '../../stores/architectureStore';
import { 
  PerformanceAnalyzer, 
  // PerformanceBottleneck, 
  // OptimizationSuggestion,
  // ResourcePrediction,
  // ArchitectureHealth 
} from '../../utils/performanceAnalyzer';

interface Alert {
  id: string;
  severity: 'critical' | 'warning' | 'info';
  service: string;
  metric: string;
  value: number;
  threshold: number;
  timestamp: Date;
  acknowledged: boolean;
}

interface PerformanceHistoryEntry {
  timestamp: Date;
  metrics: Record<string, {
    cpu: number;
    memory: number;
    responseTime: number;
    throughput: number;
    errorRate: number;
  }>;
}

const PerformancePanel: React.FC = () => {
  const { nodes, edges } = useArchitectureStore();
  const [activeTab, setActiveTab] = useState<'overview' | 'bottlenecks' | 'optimization' | 'resources' | 'monitoring' | 'alerts'>('overview');
  const [autoRefresh, setAutoRefresh] = useState(false);
  const [alertsEnabled, setAlertsEnabled] = useState(true);
  const [alerts, setAlerts] = useState<Alert[]>([]);
  const [performanceHistory, setPerformanceHistory] = useState<PerformanceHistoryEntry[]>([]);
  const [monitoringInterval, setMonitoringInterval] = useState<ReturnType<typeof setTimeout> | null>(null);

  const analyzer = useMemo(() => new PerformanceAnalyzer(nodes, edges), [nodes, edges]);
  
  const metrics = useMemo(() => analyzer.generatePerformanceMetrics(), [analyzer]);
  const bottlenecks = useMemo(() => analyzer.identifyBottlenecks(), [analyzer]);
  const optimizations = useMemo(() => analyzer.generateOptimizations(), [analyzer]);
  const resourcePredictions = useMemo(() => analyzer.predictResourceNeeds(), [analyzer]);
  const health = useMemo(() => analyzer.calculateArchitectureHealth(), [analyzer]);

  const getSeverityColor = (severity: string) => {
    switch (severity) {
      case 'critical': return 'text-red-600 bg-red-50 border-red-200';
      case 'high': return 'text-orange-600 bg-orange-50 border-orange-200';
      case 'medium': return 'text-yellow-600 bg-yellow-50 border-yellow-200';
      case 'low': return 'text-blue-600 bg-blue-50 border-blue-200';
      default: return 'text-slate-600 bg-slate-50 border-slate-200';
    }
  };

  const getPriorityColor = (priority: string) => {
    switch (priority) {
      case 'critical': return 'text-red-600 bg-red-50 border-red-200';
      case 'high': return 'text-orange-600 bg-orange-50 border-orange-200';
      case 'medium': return 'text-yellow-600 bg-yellow-50 border-yellow-200';
      case 'low': return 'text-green-600 bg-green-50 border-green-200';
      default: return 'text-slate-600 bg-slate-50 border-slate-200';
    }
  };

  const getHealthColor = (score: number) => {
    if (score >= 80) return 'text-green-600';
    if (score >= 60) return 'text-yellow-600';
    if (score >= 40) return 'text-orange-600';
    return 'text-red-600';
  };

  const formatMetric = (value: number, unit: string = '') => {
    return `${value.toFixed(1)}${unit}`;
  };

  // Real-time monitoring
  const generateAlert = useCallback((service: string, metric: string, value: number, threshold: number, severity: Alert['severity']) => {
    const alert: Alert = {
      id: `alert-${Date.now()}-${Math.random()}`,
      severity,
      service,
      metric,
      value,
      threshold,
      timestamp: new Date(),
      acknowledged: false,
    };
    
    setAlerts(prev => [alert, ...prev.slice(0, 99)]); // Keep last 100 alerts
    
    if (alertsEnabled) {
      // In a real app, this would trigger notifications
      console.warn(`Performance Alert: ${service} ${metric} is ${value} (threshold: ${threshold})`);
    }
  }, [alertsEnabled]);

  const checkForAlerts = useCallback(() => {
    Object.entries(metrics).forEach(([nodeId, nodeMetrics]) => {
      const node = nodes.find(n => n.id === nodeId);
      if (!node) return;
      
      const serviceName = (node.data as any).config.name;
      
      // CPU alerts
      if (nodeMetrics.resourceUtilization.cpu > 90) {
        generateAlert(serviceName, 'CPU Usage', nodeMetrics.resourceUtilization.cpu, 90, 'critical');
      } else if (nodeMetrics.resourceUtilization.cpu > 80) {
        generateAlert(serviceName, 'CPU Usage', nodeMetrics.resourceUtilization.cpu, 80, 'warning');
      }
      
      // Memory alerts
      if (nodeMetrics.resourceUtilization.memory > 95) {
        generateAlert(serviceName, 'Memory Usage', nodeMetrics.resourceUtilization.memory, 95, 'critical');
      } else if (nodeMetrics.resourceUtilization.memory > 85) {
        generateAlert(serviceName, 'Memory Usage', nodeMetrics.resourceUtilization.memory, 85, 'warning');
      }
      
      // Response time alerts
      if (nodeMetrics.responseTime.p95 > 1000) {
        generateAlert(serviceName, 'Response Time P95', nodeMetrics.responseTime.p95, 1000, 'critical');
      } else if (nodeMetrics.responseTime.p95 > 500) {
        generateAlert(serviceName, 'Response Time P95', nodeMetrics.responseTime.p95, 500, 'warning');
      }
      
      // Error rate alerts
      if (nodeMetrics.errorRate > 5) {
        generateAlert(serviceName, 'Error Rate', nodeMetrics.errorRate, 5, 'critical');
      } else if (nodeMetrics.errorRate > 2) {
        generateAlert(serviceName, 'Error Rate', nodeMetrics.errorRate, 2, 'warning');
      }
      
      // Availability alerts
      if (nodeMetrics.availability < 99) {
        generateAlert(serviceName, 'Availability', nodeMetrics.availability, 99, 'critical');
      } else if (nodeMetrics.availability < 99.5) {
        generateAlert(serviceName, 'Availability', nodeMetrics.availability, 99.5, 'warning');
      }
    });
  }, [metrics, nodes, generateAlert]);

  const recordPerformanceHistory = useCallback(() => {
    const historyEntry: PerformanceHistoryEntry = {
      timestamp: new Date(),
      metrics: Object.fromEntries(
        Object.entries(metrics).map(([nodeId, nodeMetrics]) => [
          nodeId,
          {
            cpu: nodeMetrics.resourceUtilization.cpu,
            memory: nodeMetrics.resourceUtilization.memory,
            responseTime: nodeMetrics.responseTime.p95,
            throughput: nodeMetrics.throughput,
            errorRate: nodeMetrics.errorRate,
          }
        ])
      )
    };
    
    setPerformanceHistory(prev => [historyEntry, ...prev.slice(0, 287)]); // Keep ~24 hours of 5-minute intervals
  }, [metrics]);

  // Auto-refresh and monitoring
  useEffect(() => {
    if (autoRefresh) {
      const interval = setInterval(() => {
        checkForAlerts();
        recordPerformanceHistory();
      }, 5000); // Check every 5 seconds
      
      setMonitoringInterval(interval);
      
      return () => clearInterval(interval);
    } else if (monitoringInterval) {
      clearInterval(monitoringInterval);
      setMonitoringInterval(null);
    }
  }, [autoRefresh, checkForAlerts, recordPerformanceHistory, monitoringInterval]);

  const acknowledgeAlert = useCallback((alertId: string) => {
    setAlerts(prev => prev.map(alert => 
      alert.id === alertId ? { ...alert, acknowledged: true } : alert
    ));
  }, []);

  const clearAcknowledgedAlerts = useCallback(() => {
    setAlerts(prev => prev.filter(alert => !alert.acknowledged));
  }, []);

  const getAlertColor = (severity: Alert['severity']) => {
    switch (severity) {
      case 'critical': return 'text-red-600 bg-red-50 border-red-200';
      case 'warning': return 'text-yellow-600 bg-yellow-50 border-yellow-200';
      case 'info': return 'text-blue-600 bg-blue-50 border-blue-200';
      default: return 'text-slate-600 bg-slate-50 border-slate-200';
    }
  };

  const getMetricTrend = (nodeId: string, metric: keyof PerformanceHistoryEntry['metrics'][string]) => {
    if (performanceHistory.length < 2) return 'stable';
    
    const latest = performanceHistory[0]?.metrics[nodeId]?.[metric];
    const previous = performanceHistory[1]?.metrics[nodeId]?.[metric];
    
    if (!latest || !previous) return 'stable';
    
    const change = ((latest - previous) / previous) * 100;
    
    if (change > 5) return 'increasing';
    if (change < -5) return 'decreasing';
    return 'stable';
  };

  const formatTime = (date: Date) => {
    return date.toLocaleTimeString(undefined, { 
      hour: '2-digit', 
      minute: '2-digit',
      second: '2-digit'
    });
  };

  return (
    <div className="p-6 h-full overflow-y-auto space-y-6">
      {/* Header */}
      <div className="flex items-center justify-between">
        <div>
          <h3 className="text-lg font-bold text-slate-800 mb-2 flex items-center gap-2">
            <Zap className="w-5 h-5 text-yellow-600" />
            Performance Analysis
          </h3>
          <p className="text-sm text-slate-600">
            Monitor, analyze, and optimize your architecture performance
          </p>
        </div>
        <div className="flex items-center gap-2">
          <button
            onClick={() => setAlertsEnabled(!alertsEnabled)}
            className={`p-2 rounded-lg border transition-colors ${
              alertsEnabled ? 'bg-orange-50 border-orange-200 text-orange-600' : 'border-slate-300 text-slate-600'
            }`}
            title={alertsEnabled ? 'Disable alerts' : 'Enable alerts'}
          >
            {alertsEnabled ? <Bell className="w-4 h-4" /> : <BellOff className="w-4 h-4" />}
          </button>
          <button
            onClick={() => setAutoRefresh(!autoRefresh)}
            className={`p-2 rounded-lg border transition-colors ${
              autoRefresh ? 'bg-blue-50 border-blue-200 text-blue-600' : 'border-slate-300 text-slate-600'
            }`}
            title="Auto refresh monitoring"
          >
            <RefreshCw className={`w-4 h-4 ${autoRefresh ? 'animate-spin' : ''}`} />
          </button>
          <button className="p-2 border border-slate-300 rounded-lg text-slate-600 hover:bg-slate-50">
            <Settings className="w-4 h-4" />
          </button>
        </div>
      </div>

      {/* Health Overview */}
      <div className="grid grid-cols-2 lg:grid-cols-5 gap-4">
        <div className="col-span-2 lg:col-span-1 p-4 bg-white border border-slate-200 rounded-lg">
          <div className="text-center">
            <div className={`text-3xl font-bold mb-1 ${getHealthColor(health.overall)}`}>
              {health.overall}
            </div>
            <div className="text-sm text-slate-600">Overall Health</div>
          </div>
        </div>
        
        {Object.entries(health.categories).map(([category, score]) => (
          <div key={category} className="p-3 bg-white border border-slate-200 rounded-lg">
            <div className="flex items-center justify-between mb-1">
              <span className="text-xs font-medium text-slate-600 capitalize">
                {category}
              </span>
              <span className={`text-sm font-bold ${getHealthColor(score)}`}>
                {score}
              </span>
            </div>
            <div className="w-full bg-slate-100 rounded-full h-1.5">
              <div
                className={`h-1.5 rounded-full transition-all duration-300 ${
                  score >= 80 ? 'bg-green-500' :
                  score >= 60 ? 'bg-yellow-500' :
                  score >= 40 ? 'bg-orange-500' : 'bg-red-500'
                }`}
                style={{ width: `${score}%` }}
              />
            </div>
          </div>
        ))}
      </div>

      {/* Active Alerts */}
      {alerts.filter(a => !a.acknowledged && a.severity === 'critical').length > 0 && (
        <div className="p-4 bg-red-50 border border-red-200 rounded-lg">
          <div className="flex items-center justify-between mb-2">
            <div className="flex items-center gap-2">
              <AlertTriangle className="w-5 h-5 text-red-600" />
              <span className="font-semibold text-red-800">Critical Performance Alerts</span>
            </div>
            <span className="text-xs text-red-600 bg-red-100 px-2 py-1 rounded">
              {alerts.filter(a => !a.acknowledged && a.severity === 'critical').length} active
            </span>
          </div>
          <div className="space-y-1 text-sm text-red-700">
            {alerts.filter(a => !a.acknowledged && a.severity === 'critical').slice(0, 3).map((alert) => (
              <div key={alert.id} className="flex items-center justify-between">
                <span>• {alert.service}: {alert.metric} at {formatMetric(alert.value)}</span>
                <span className="text-xs">{formatTime(alert.timestamp)}</span>
              </div>
            ))}
            {alerts.filter(a => !a.acknowledged && a.severity === 'critical').length > 3 && (
              <div className="text-xs text-red-600">
                +{alerts.filter(a => !a.acknowledged && a.severity === 'critical').length - 3} more alerts
              </div>
            )}
          </div>
        </div>
      )}

      {/* Critical Issues Alert */}
      {health.criticalIssues.length > 0 && (
        <div className="p-4 bg-red-50 border border-red-200 rounded-lg">
          <div className="flex items-center gap-2 mb-2">
            <AlertTriangle className="w-5 h-5 text-red-600" />
            <span className="font-semibold text-red-800">Critical Issues Detected</span>
          </div>
          <ul className="space-y-1 text-sm text-red-700">
            {health.criticalIssues.map((issue, index) => (
              <li key={index}>• {issue}</li>
            ))}
          </ul>
        </div>
      )}

      {/* Tabs */}
      <div className="flex border-b border-slate-200 overflow-x-auto">
        {([
          { id: 'overview', label: 'Overview', icon: <BarChart3 className="w-4 h-4" /> },
          { id: 'bottlenecks', label: 'Bottlenecks', icon: <AlertTriangle className="w-4 h-4" /> },
          { id: 'optimization', label: 'Optimization', icon: <Lightbulb className="w-4 h-4" /> },
          { id: 'resources', label: 'Resources', icon: <Activity className="w-4 h-4" /> },
          { id: 'monitoring', label: 'Monitoring', icon: <Monitor className="w-4 h-4" /> },
          { id: 'alerts', label: 'Alerts', icon: <Bell className="w-4 h-4" /> },
        ] as const).map((tab) => (
          <button
            key={tab.id}
            onClick={() => setActiveTab(tab.id)}
            className={`flex-1 py-2 px-3 text-sm font-medium transition-colors flex items-center justify-center gap-1 ${
              activeTab === tab.id
                ? 'text-blue-600 border-b-2 border-blue-600'
                : 'text-slate-600 hover:text-slate-800'
            }`}
          >
            {tab.icon}
            <span className="hidden sm:inline">{tab.label}</span>
          </button>
        ))}
      </div>

      {/* Tab Content */}
      <div className="space-y-4">
        {/* Overview Tab */}
        {activeTab === 'overview' && (
          <div className="space-y-4">
            <h4 className="font-semibold text-slate-700">Service Performance Metrics</h4>
            <div className="grid gap-4">
              {Object.entries(metrics).map(([nodeId, metric]) => {
                const node = nodes.find(n => n.id === nodeId);
                if (!node) return null;
                
                return (
                  <div key={nodeId} className="p-4 border border-slate-200 rounded-lg">
                    <div className="flex items-center justify-between mb-3">
                      <div className="flex items-center gap-2">
                        <Activity className="w-4 h-4 text-blue-600" />
                        <span className="font-medium text-slate-800">{(node.data as any).config.name}</span>
                        <span className="text-xs text-slate-500 px-2 py-1 bg-slate-100 rounded">
                          {(node.data as any).config.type}
                        </span>
                      </div>
                      <div className="flex items-center gap-1">
                        <CheckCircle className={`w-4 h-4 ${
                          metric.availability >= 99.5 ? 'text-green-600' : 
                          metric.availability >= 99 ? 'text-yellow-600' : 'text-red-600'
                        }`} />
                        <span className="text-sm font-medium">
                          {formatMetric(metric.availability, '%')}
                        </span>
                      </div>
                    </div>
                    
                    <div className="grid grid-cols-2 lg:grid-cols-4 gap-4 text-sm">
                      <div>
                        <div className="text-slate-600 mb-1">Response Time (P95)</div>
                        <div className="font-medium">{formatMetric(metric.responseTime.p95, 'ms')}</div>
                      </div>
                      <div>
                        <div className="text-slate-600 mb-1">Throughput</div>
                        <div className="font-medium">{formatMetric(metric.throughput, ' RPS')}</div>
                      </div>
                      <div>
                        <div className="text-slate-600 mb-1">Error Rate</div>
                        <div className="font-medium">{formatMetric(metric.errorRate, '%')}</div>
                      </div>
                      <div>
                        <div className="text-slate-600 mb-1">CPU Usage</div>
                        <div className="font-medium">{formatMetric(metric.resourceUtilization.cpu, '%')}</div>
                      </div>
                    </div>
                  </div>
                );
              })}
            </div>
          </div>
        )}

        {/* Bottlenecks Tab */}
        {activeTab === 'bottlenecks' && (
          <div className="space-y-4">
            <div className="flex items-center justify-between">
              <h4 className="font-semibold text-slate-700">Performance Bottlenecks</h4>
              <span className="text-sm text-slate-500">{bottlenecks.length} issues found</span>
            </div>
            
            {bottlenecks.length === 0 ? (
              <div className="text-center py-8">
                <CheckCircle className="w-12 h-12 text-green-500 mx-auto mb-4" />
                <h4 className="text-lg font-medium text-slate-500 mb-2">No Bottlenecks Detected</h4>
                <p className="text-slate-400">Your architecture is performing well!</p>
              </div>
            ) : (
              <div className="space-y-3">
                {bottlenecks.map((bottleneck) => (
                  <div key={bottleneck.id} className={`p-4 border rounded-lg ${getSeverityColor(bottleneck.severity)}`}>
                    <div className="flex items-start justify-between mb-2">
                      <div className="flex items-center gap-2">
                        {bottleneck.type === 'cpu' && <Cpu className="w-4 h-4" />}
                        {bottleneck.type === 'memory' && <HardDrive className="w-4 h-4" />}
                        {bottleneck.type === 'network' && <Network className="w-4 h-4" />}
                        {bottleneck.type === 'database' && <Database className="w-4 h-4" />}
                        <span className="font-medium">{bottleneck.service}</span>
                      </div>
                      <span className="text-xs font-medium px-2 py-1 rounded bg-white capitalize">
                        {bottleneck.severity}
                      </span>
                    </div>
                    <p className="text-sm mb-2">{bottleneck.description}</p>
                    <p className="text-xs text-slate-600 mb-3">{bottleneck.impact}</p>
                    <div className="space-y-1">
                      <div className="text-xs font-medium">Recommendations:</div>
                      <ul className="text-xs space-y-1">
                        {bottleneck.recommendations.map((rec, index) => (
                          <li key={index}>• {rec}</li>
                        ))}
                      </ul>
                    </div>
                    <div className="mt-2 text-xs">
                      <span className="font-medium">Expected improvement: </span>
                      {bottleneck.estimatedImprovement}
                    </div>
                  </div>
                ))}
              </div>
            )}
          </div>
        )}

        {/* Optimization Tab */}
        {activeTab === 'optimization' && (
          <div className="space-y-4">
            <div className="flex items-center justify-between">
              <h4 className="font-semibold text-slate-700">Optimization Suggestions</h4>
              <span className="text-sm text-slate-500">{optimizations.length} suggestions</span>
            </div>
            
            <div className="space-y-3">
              {optimizations.map((suggestion) => (
                <div key={suggestion.id} className={`p-4 border rounded-lg ${getPriorityColor(suggestion.priority)}`}>
                  <div className="flex items-start justify-between mb-2">
                    <div className="flex items-center gap-2">
                      <Target className="w-4 h-4" />
                      <span className="font-medium">{suggestion.title}</span>
                    </div>
                    <div className="flex items-center gap-2">
                      <span className="text-xs font-medium px-2 py-1 rounded bg-white capitalize">
                        {suggestion.category}
                      </span>
                      <span className="text-xs font-medium px-2 py-1 rounded bg-white capitalize">
                        {suggestion.priority}
                      </span>
                    </div>
                  </div>
                  
                  <p className="text-sm mb-3">{suggestion.description}</p>
                  <p className="text-xs text-slate-600 mb-3">{suggestion.implementation}</p>
                  
                  <div className="grid grid-cols-3 gap-4 mb-3 text-xs">
                    <div>
                      <div className="font-medium flex items-center gap-1">
                        <ArrowUp className="w-3 h-3 text-green-600" />
                        Performance
                      </div>
                      <div>+{suggestion.estimatedImpact.performance}%</div>
                    </div>
                    <div>
                      <div className="font-medium flex items-center gap-1">
                        <ArrowDown className="w-3 h-3 text-blue-600" />
                        Cost
                      </div>
                      <div>{suggestion.estimatedImpact.cost > 0 ? '+' : ''}{suggestion.estimatedImpact.cost}%</div>
                    </div>
                    <div>
                      <div className="font-medium">Complexity</div>
                      <div>+{suggestion.estimatedImpact.complexity}%</div>
                    </div>
                  </div>
                  
                  {suggestion.prerequisites.length > 0 && (
                    <div className="mb-2">
                      <div className="text-xs font-medium mb-1">Prerequisites:</div>
                      <ul className="text-xs space-y-1">
                        {suggestion.prerequisites.map((prereq, index) => (
                          <li key={index}>• {prereq}</li>
                        ))}
                      </ul>
                    </div>
                  )}
                  
                  {suggestion.risks.length > 0 && (
                    <div>
                      <div className="text-xs font-medium mb-1">Risks:</div>
                      <ul className="text-xs space-y-1">
                        {suggestion.risks.map((risk, index) => (
                          <li key={index}>• {risk}</li>
                        ))}
                      </ul>
                    </div>
                  )}
                </div>
              ))}
            </div>
          </div>
        )}

        {/* Resources Tab */}
        {activeTab === 'resources' && (
          <div className="space-y-4">
            <h4 className="font-semibold text-slate-700">Resource Predictions</h4>
            
            <div className="space-y-3">
              {resourcePredictions.map((prediction, index) => (
                <div key={index} className="p-4 border border-slate-200 rounded-lg">
                  <div className="flex items-center justify-between mb-3">
                    <span className="font-medium text-slate-800">{prediction.service}</span>
                    <div className="flex items-center gap-2">
                      <TrendingUp className={`w-4 h-4 ${
                        prediction.utilizationTrend === 'increasing' ? 'text-red-600' :
                        prediction.utilizationTrend === 'stable' ? 'text-yellow-600' : 'text-green-600'
                      }`} />
                      <span className="text-xs text-slate-500 capitalize">
                        {prediction.utilizationTrend}
                      </span>
                    </div>
                  </div>
                  
                  <div className="grid grid-cols-2 gap-4 mb-3 text-sm">
                    <div>
                      <div className="text-slate-600 mb-1">Current CPU</div>
                      <div className="font-medium">{prediction.currentResources.cpu} cores</div>
                    </div>
                    <div>
                      <div className="text-slate-600 mb-1">Predicted CPU</div>
                      <div className="font-medium">{prediction.predictedNeeds.cpu.toFixed(1)} cores</div>
                    </div>
                    <div>
                      <div className="text-slate-600 mb-1">Current Memory</div>
                      <div className="font-medium">{prediction.currentResources.memory} GB</div>
                    </div>
                    <div>
                      <div className="text-slate-600 mb-1">Predicted Memory</div>
                      <div className="font-medium">{prediction.predictedNeeds.memory.toFixed(1)} GB</div>
                    </div>
                  </div>
                  
                  <div className="text-xs text-slate-600 mb-2">
                    Time to capacity: {prediction.timeToCapacity} days
                  </div>
                  
                  {prediction.recommendations.length > 0 && (
                    <div>
                      <div className="text-xs font-medium mb-1">Recommendations:</div>
                      <ul className="text-xs space-y-1">
                        {prediction.recommendations.map((rec, index) => (
                          <li key={index}>• {rec}</li>
                        ))}
                      </ul>
                    </div>
                  )}
                </div>
              ))}
            </div>
          </div>
        )}

        {/* Monitoring Tab */}
        {activeTab === 'monitoring' && (
          <div className="space-y-4">
            <div className="flex items-center justify-between">
              <h4 className="font-semibold text-slate-700">Real-time Monitoring</h4>
              <div className="flex items-center gap-2">
                <span className={`text-xs px-2 py-1 rounded ${autoRefresh ? 'bg-green-50 text-green-600' : 'bg-slate-50 text-slate-600'}`}>
                  {autoRefresh ? 'Live' : 'Paused'}
                </span>
                {performanceHistory.length > 0 && (
                  <span className="text-xs text-slate-500">
                    Last update: {formatTime(performanceHistory[0].timestamp)}
                  </span>
                )}
              </div>
            </div>
            
            <div className="grid gap-4">
              {Object.entries(metrics).map(([nodeId, metric]) => {
                const node = nodes.find(n => n.id === nodeId);
                if (!node) return null;
                
                return (
                  <div key={nodeId} className="p-4 border border-slate-200 rounded-lg">
                    <div className="flex items-center justify-between mb-3">
                      <div className="flex items-center gap-2">
                        <Gauge className="w-4 h-4 text-blue-600" />
                        <span className="font-medium text-slate-800">{(node.data as any).config.name}</span>
                        <span className="text-xs text-slate-500 px-2 py-1 bg-slate-100 rounded">
                          {(node.data as any).config.type}
                        </span>
                      </div>
                      <div className="flex items-center gap-2">
                        {getMetricTrend(nodeId, 'cpu') === 'increasing' && (
                          <TrendingUp className="w-4 h-4 text-red-500" />
                        )}
                        {getMetricTrend(nodeId, 'cpu') === 'decreasing' && (
                          <TrendingDown className="w-4 h-4 text-green-500" />
                        )}
                        <span className={`text-xs px-2 py-1 rounded ${
                          metric.availability >= 99.5 ? 'bg-green-50 text-green-600' : 
                          metric.availability >= 99 ? 'bg-yellow-50 text-yellow-600' : 'bg-red-50 text-red-600'
                        }`}>
                          {formatMetric(metric.availability, '% uptime')}
                        </span>
                      </div>
                    </div>
                    
                    <div className="grid grid-cols-2 lg:grid-cols-5 gap-3 text-sm">
                      <div className="text-center">
                        <div className="text-xs text-slate-600 mb-1">CPU</div>
                        <div className={`font-bold ${
                          metric.resourceUtilization.cpu > 80 ? 'text-red-600' : 
                          metric.resourceUtilization.cpu > 60 ? 'text-yellow-600' : 'text-green-600'
                        }`}>
                          {formatMetric(metric.resourceUtilization.cpu, '%')}
                        </div>
                        <div className="w-full bg-slate-100 rounded-full h-1 mt-1">
                          <div
                            className={`h-1 rounded-full transition-all duration-300 ${
                              metric.resourceUtilization.cpu > 80 ? 'bg-red-500' : 
                              metric.resourceUtilization.cpu > 60 ? 'bg-yellow-500' : 'bg-green-500'
                            }`}
                            style={{ width: `${metric.resourceUtilization.cpu}%` }}
                          />
                        </div>
                      </div>
                      
                      <div className="text-center">
                        <div className="text-xs text-slate-600 mb-1">Memory</div>
                        <div className={`font-bold ${
                          metric.resourceUtilization.memory > 85 ? 'text-red-600' : 
                          metric.resourceUtilization.memory > 70 ? 'text-yellow-600' : 'text-green-600'
                        }`}>
                          {formatMetric(metric.resourceUtilization.memory, '%')}
                        </div>
                        <div className="w-full bg-slate-100 rounded-full h-1 mt-1">
                          <div
                            className={`h-1 rounded-full transition-all duration-300 ${
                              metric.resourceUtilization.memory > 85 ? 'bg-red-500' : 
                              metric.resourceUtilization.memory > 70 ? 'bg-yellow-500' : 'bg-green-500'
                            }`}
                            style={{ width: `${metric.resourceUtilization.memory}%` }}
                          />
                        </div>
                      </div>
                      
                      <div className="text-center">
                        <div className="text-xs text-slate-600 mb-1">Response Time</div>
                        <div className={`font-bold ${
                          metric.responseTime.p95 > 500 ? 'text-red-600' : 
                          metric.responseTime.p95 > 200 ? 'text-yellow-600' : 'text-green-600'
                        }`}>
                          {formatMetric(metric.responseTime.p95, 'ms')}
                        </div>
                        <div className="text-xs text-slate-500">P95</div>
                      </div>
                      
                      <div className="text-center">
                        <div className="text-xs text-slate-600 mb-1">Throughput</div>
                        <div className="font-bold text-blue-600">
                          {formatMetric(metric.throughput, ' RPS')}
                        </div>
                        <div className="text-xs text-slate-500">Requests/sec</div>
                      </div>
                      
                      <div className="text-center">
                        <div className="text-xs text-slate-600 mb-1">Error Rate</div>
                        <div className={`font-bold ${
                          metric.errorRate > 2 ? 'text-red-600' : 
                          metric.errorRate > 1 ? 'text-yellow-600' : 'text-green-600'
                        }`}>
                          {formatMetric(metric.errorRate, '%')}
                        </div>
                        <div className="text-xs text-slate-500">Errors</div>
                      </div>
                    </div>
                  </div>
                );
              })}
            </div>
          </div>
        )}

        {/* Alerts Tab */}
        {activeTab === 'alerts' && (
          <div className="space-y-4">
            <div className="flex items-center justify-between">
              <h4 className="font-semibold text-slate-700">Performance Alerts</h4>
              <div className="flex items-center gap-2">
                <button
                  onClick={clearAcknowledgedAlerts}
                  disabled={alerts.filter(a => a.acknowledged).length === 0}
                  className="px-3 py-1 text-sm border border-slate-300 rounded hover:bg-slate-50 disabled:opacity-50 disabled:cursor-not-allowed"
                >
                  Clear Acknowledged
                </button>
                <span className="text-sm text-slate-500">
                  {alerts.filter(a => !a.acknowledged).length} active
                </span>
              </div>
            </div>
            
            {alerts.length === 0 ? (
              <div className="text-center py-8">
                <CheckCircle className="w-12 h-12 text-green-500 mx-auto mb-4" />
                <h4 className="text-lg font-medium text-slate-500 mb-2">No Alerts</h4>
                <p className="text-slate-400">All systems are performing normally</p>
              </div>
            ) : (
              <div className="space-y-3">
                {alerts.map((alert) => (
                  <div key={alert.id} className={`p-4 border rounded-lg ${getAlertColor(alert.severity)} ${alert.acknowledged ? 'opacity-60' : ''}`}>
                    <div className="flex items-start justify-between mb-2">
                      <div className="flex items-center gap-2">
                        <AlertTriangle className="w-4 h-4" />
                        <span className="font-medium">{alert.service}</span>
                        <span className="text-xs px-2 py-1 rounded bg-white font-medium capitalize">
                          {alert.severity}
                        </span>
                      </div>
                      <div className="flex items-center gap-2">
                        <span className="text-xs text-slate-500">
                          {formatTime(alert.timestamp)}
                        </span>
                        {!alert.acknowledged && (
                          <button
                            onClick={() => acknowledgeAlert(alert.id)}
                            className="px-2 py-1 text-xs bg-white border border-current rounded hover:bg-slate-50"
                          >
                            Acknowledge
                          </button>
                        )}
                      </div>
                    </div>
                    
                    <div className="text-sm mb-2">
                      <strong>{alert.metric}</strong> is at <strong>{formatMetric(alert.value)}</strong>
                      {alert.threshold && (
                        <span> (threshold: {formatMetric(alert.threshold)})</span>
                      )}
                    </div>
                    
                    {alert.acknowledged && (
                      <div className="text-xs text-slate-500 mt-2 flex items-center gap-1">
                        <CheckCircle className="w-3 h-3" />
                        Acknowledged
                      </div>
                    )}
                  </div>
                ))}
              </div>
            )}
          </div>
        )}
      </div>
    </div>
  );
};

export default PerformancePanel;