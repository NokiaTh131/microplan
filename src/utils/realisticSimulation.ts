import { Node, Edge } from '@xyflow/react';
import { random, mean, std, round } from 'mathjs';
import { NodeData } from '../stores/architectureStore';

export interface SimulationMetrics {
  timestamp: number;
  nodeId: string;
  metrics: {
    cpu: number;
    memory: number;
    responseTime: number;
    throughput: number;
    errorRate: number;
    availability: number;
    networkLatency: number;
    diskIo: number;
  };
}

export interface FailurePattern {
  id: string;
  type: 'cascade' | 'isolated' | 'network' | 'overload' | 'deadlock';
  probability: number;
  mttr: number; // Mean Time To Recovery in minutes
  mtbf: number; // Mean Time Between Failures in hours
  affectedServices: string[];
  description: string;
}

export interface LoadTestScenario {
  id: string;
  name: string;
  duration: number; // seconds
  rampUpTime: number; // seconds
  maxUsers: number;
  pattern: 'linear' | 'spike' | 'stress' | 'soak' | 'volume';
  targetServices: string[];
}

export interface ChaosPlan {
  id: string;
  name: string;
  duration: number;
  experiments: ChaosExperiment[];
}

export interface ChaosExperiment {
  id: string;
  type: 'pod_kill' | 'network_delay' | 'network_loss' | 'cpu_stress' | 'memory_stress' | 'disk_fill';
  target: string;
  startTime: number; // seconds from start
  duration: number; // seconds
  intensity: number; // 0-1 scale
  parameters: Record<string, any>;
}

export class RealisticSimulationEngine {
  private nodes: Node[];
  private edges: Edge[];
  private metricsHistory: SimulationMetrics[] = [];
  private currentMetrics: Map<string, SimulationMetrics> = new Map();
  private failurePatterns: FailurePattern[] = [];
  private isRunning = false;
  // private _simulationStartTime = 0;
  private activeFailures: Map<string, { pattern: FailurePattern; startTime: number }> = new Map();

  constructor(nodes: Node[], edges: Edge[]) {
    this.nodes = nodes;
    this.edges = edges;
    this.initializeFailurePatterns();
  }

  private initializeFailurePatterns(): void {
    // Database failure patterns
    const dbNodes = this.nodes.filter(n => (n.data as NodeData).config.type === 'database');
    if (dbNodes.length > 0) {
      this.failurePatterns.push({
        id: 'db-connection-pool-exhaustion',
        type: 'overload',
        probability: 0.15,
        mttr: 5,
        mtbf: 48,
        affectedServices: dbNodes.map(n => n.id),
        description: 'Database connection pool exhaustion under high load'
      });
    }

    // API Gateway cascade failures
    const gatewayNodes = this.nodes.filter(n => (n.data as NodeData).config.type === 'gateway');
    if (gatewayNodes.length > 0) {
      this.failurePatterns.push({
        id: 'gateway-cascade',
        type: 'cascade',
        probability: 0.08,
        mttr: 3,
        mtbf: 72,
        affectedServices: this.getDownstreamServices(gatewayNodes[0].id),
        description: 'API Gateway failure causing downstream service failures'
      });
    }

    // Network partition failures
    this.failurePatterns.push({
      id: 'network-partition',
      type: 'network',
      probability: 0.05,
      mttr: 8,
      mtbf: 168, // 1 week
      affectedServices: this.getNetworkDependentServices(),
      description: 'Network partition isolating service clusters'
    });

    // Memory leak patterns
    const apiNodes = this.nodes.filter(n => (n.data as NodeData).config.type === 'api');
    apiNodes.forEach(node => {
      this.failurePatterns.push({
        id: `memory-leak-${node.id}`,
        type: 'isolated',
        probability: 0.12,
        mttr: 2,
        mtbf: 120,
        affectedServices: [node.id],
        description: `Memory leak in ${(node.data as NodeData).config.name}`
      });
    });
  }

  private getDownstreamServices(nodeId: string): string[] {
    const visited = new Set<string>();
    const downstream: string[] = [];

    const dfs = (currentId: string) => {
      if (visited.has(currentId)) return;
      visited.add(currentId);

      const outgoingEdges = this.edges.filter(e => e.source === currentId);
      outgoingEdges.forEach(edge => {
        downstream.push(edge.target);
        dfs(edge.target);
      });
    };

    dfs(nodeId);
    return downstream;
  }

  private getNetworkDependentServices(): string[] {
    return this.nodes
      .filter(n => {
        const config = (n.data as NodeData).config;
        return ['api', 'gateway', 'external'].includes(config.type);
      })
      .map(n => n.id);
  }

  // Realistic metric generation based on service type and load
  private generateRealisticMetrics(nodeId: string, currentLoad = 1): SimulationMetrics {
    const node = this.nodes.find(n => n.id === nodeId);
    if (!node) throw new Error(`Node ${nodeId} not found`);

    const config = (node.data as NodeData).config;
    const isUnderFailure = this.activeFailures.has(nodeId);
    
    // Base metrics by service type
    const baseMetrics = this.getBaseMetricsByServiceType(config.type);
    
    // Apply load factor
    const loadFactor = Math.min(currentLoad, 5); // Cap at 5x load
    
    // Apply realistic variations using normal distribution
    const metrics = {
      cpu: this.applyNormalVariation(baseMetrics.cpu * loadFactor, 0.1, isUnderFailure ? 1.5 : 1),
      memory: this.applyNormalVariation(baseMetrics.memory * Math.sqrt(loadFactor), 0.05, isUnderFailure ? 1.3 : 1),
      responseTime: this.applyLogNormalVariation(baseMetrics.responseTime * loadFactor, 0.3, isUnderFailure ? 3 : 1),
      throughput: this.applyNormalVariation(baseMetrics.throughput / loadFactor, 0.2, isUnderFailure ? 0.3 : 1),
      errorRate: this.applyExponentialVariation(baseMetrics.errorRate * loadFactor, isUnderFailure ? 10 : 1),
      availability: isUnderFailure ? 0 : this.applyBetaVariation(baseMetrics.availability, 0.05),
      networkLatency: this.applyGammaVariation(baseMetrics.networkLatency, loadFactor),
      diskIo: this.applyNormalVariation(baseMetrics.diskIo * Math.sqrt(loadFactor), 0.15, 1)
    };

    // Apply service-specific constraints
    metrics.cpu = Math.max(0, Math.min(100, metrics.cpu));
    metrics.memory = Math.max(0, Math.min(100, metrics.memory));
    metrics.errorRate = Math.max(0, Math.min(100, metrics.errorRate));
    metrics.availability = Math.max(0, Math.min(100, metrics.availability));

    return {
      timestamp: Date.now(),
      nodeId,
      metrics
    };
  }

  private getBaseMetricsByServiceType(type: string): SimulationMetrics['metrics'] {
    const baseMetrics: Record<string, SimulationMetrics['metrics']> = {
      api: {
        cpu: 25, memory: 40, responseTime: 100, throughput: 1000,
        errorRate: 0.1, availability: 99.9, networkLatency: 50, diskIo: 20
      },
      database: {
        cpu: 60, memory: 70, responseTime: 50, throughput: 5000,
        errorRate: 0.05, availability: 99.95, networkLatency: 10, diskIo: 80
      },
      cache: {
        cpu: 15, memory: 90, responseTime: 1, throughput: 50000,
        errorRate: 0.01, availability: 99.99, networkLatency: 5, diskIo: 5
      },
      gateway: {
        cpu: 20, memory: 30, responseTime: 20, throughput: 10000,
        errorRate: 0.02, availability: 99.9, networkLatency: 30, diskIo: 10
      },
      external: {
        cpu: 30, memory: 35, responseTime: 500, throughput: 500,
        errorRate: 2, availability: 99.5, networkLatency: 200, diskIo: 15
      },
      queue: {
        cpu: 20, memory: 50, responseTime: 10, throughput: 20000,
        errorRate: 0.05, availability: 99.8, networkLatency: 15, diskIo: 40
      }
    };

    return baseMetrics[type] || baseMetrics.api;
  }

  // Statistical distribution helpers
  private applyNormalVariation(value: number, stdDev: number, multiplier = 1): number {
    const variation = Number(random(-stdDev, stdDev)) * value;
    return Math.max(0, value + variation * multiplier);
  }

  private applyLogNormalVariation(value: number, sigma: number, multiplier = 1): number {
    const logValue = Math.log(Math.max(1, value));
    const variation = Number(random(-sigma, sigma));
    return Math.exp(logValue + variation) * multiplier;
  }

  private applyExponentialVariation(value: number, multiplier = 1): number {
    const lambda = 1 / Math.max(0.01, value);
    return (-Math.log(Math.random()) / lambda) * multiplier;
  }

  private applyBetaVariation(value: number, variance: number): number {
    // Simplified beta distribution approximation using normal
    const sample = Math.random();
    return Math.max(0, Math.min(100, value + (sample - 0.5) * variance * 100));
  }

  private applyGammaVariation(value: number, loadFactor: number): number {
    // Gamma distribution for latency (right-skewed)
    const shape = 2;
    const scale = value / shape;
    
    // Approximation using normal
    const sample = Number(random(0, 1));
    return Math.max(1, shape * scale * loadFactor * (1 + sample * 0.5));
  }

  // Chaos Engineering methods
  runChaosExperiment(experiment: ChaosExperiment): void {
    const node = this.nodes.find(n => n.id === experiment.target);
    if (!node) return;

    switch (experiment.type) {
      case 'pod_kill':
        this.simulatePodKill(experiment.target, experiment.duration);
        break;
      case 'network_delay':
        this.simulateNetworkDelay(experiment.target, experiment.intensity * 1000, experiment.duration);
        break;
      case 'cpu_stress':
        this.simulateCpuStress(experiment.target, experiment.intensity, experiment.duration);
        break;
      case 'memory_stress':
        this.simulateMemoryStress(experiment.target, experiment.intensity, experiment.duration);
        break;
    }
  }

  private simulatePodKill(nodeId: string, duration: number): void {
    const fakePattern: FailurePattern = {
      id: `chaos-pod-kill-${nodeId}`,
      type: 'isolated',
      probability: 1,
      mttr: duration / 60,
      mtbf: 1,
      affectedServices: [nodeId],
      description: 'Chaos Engineering: Pod Kill Experiment'
    };

    this.activeFailures.set(nodeId, {
      pattern: fakePattern,
      startTime: Date.now()
    });

    setTimeout(() => {
      this.activeFailures.delete(nodeId);
    }, duration * 1000);
  }

  private simulateNetworkDelay(nodeId: string, delayMs: number, duration: number): void {
    // Modify network latency for the duration
    const currentMetric = this.currentMetrics.get(nodeId);
    if (currentMetric) {
      currentMetric.metrics.networkLatency += delayMs;
      
      setTimeout(() => {
        const metric = this.currentMetrics.get(nodeId);
        if (metric) {
          metric.metrics.networkLatency = Math.max(0, metric.metrics.networkLatency - delayMs);
        }
      }, duration * 1000);
    }
  }

  private simulateCpuStress(nodeId: string, intensity: number, duration: number): void {
    const currentMetric = this.currentMetrics.get(nodeId);
    if (currentMetric) {
      const additionalCpu = intensity * 50; // Up to 50% additional CPU
      currentMetric.metrics.cpu = Math.min(100, currentMetric.metrics.cpu + additionalCpu);
      
      setTimeout(() => {
        const metric = this.currentMetrics.get(nodeId);
        if (metric) {
          metric.metrics.cpu = Math.max(0, metric.metrics.cpu - additionalCpu);
        }
      }, duration * 1000);
    }
  }

  private simulateMemoryStress(nodeId: string, intensity: number, duration: number): void {
    const currentMetric = this.currentMetrics.get(nodeId);
    if (currentMetric) {
      const additionalMemory = intensity * 40; // Up to 40% additional memory
      currentMetric.metrics.memory = Math.min(100, currentMetric.metrics.memory + additionalMemory);
      
      setTimeout(() => {
        const metric = this.currentMetrics.get(nodeId);
        if (metric) {
          metric.metrics.memory = Math.max(0, metric.metrics.memory - additionalMemory);
        }
      }, duration * 1000);
    }
  }

  // Load testing with realistic patterns
  executeLoadTest(scenario: LoadTestScenario): Promise<SimulationMetrics[]> {
    return new Promise((resolve) => {
      const results: SimulationMetrics[] = [];
      const interval = 1000; // 1 second intervals
      const totalSteps = scenario.duration;
      let currentStep = 0;

      const testInterval = setInterval(() => {
        const progress = currentStep / totalSteps;
        const loadMultiplier = this.calculateLoadMultiplier(scenario.pattern, progress, scenario.rampUpTime / scenario.duration);

        scenario.targetServices.forEach(nodeId => {
          const metrics = this.generateRealisticMetrics(nodeId, loadMultiplier);
          results.push(metrics);
          this.currentMetrics.set(nodeId, metrics);
        });

        currentStep++;
        if (currentStep >= totalSteps) {
          clearInterval(testInterval);
          resolve(results);
        }
      }, interval);
    });
  }

  private calculateLoadMultiplier(pattern: LoadTestScenario['pattern'], progress: number, rampUpRatio: number): number {
    switch (pattern) {
      case 'linear':
        return progress <= rampUpRatio ? progress / rampUpRatio : 1;
      
      case 'spike':
        return progress < 0.1 ? progress * 10 : 
               progress < 0.9 ? 1 : 
               Math.max(0, 2 - (progress - 0.9) * 10);
      
      case 'stress':
        return Math.min(10, Math.exp(progress * 3));
      
      case 'soak':
        return progress <= rampUpRatio ? progress / rampUpRatio : 0.8;
      
      case 'volume':
        return 1 + Math.sin(progress * Math.PI * 4) * 0.5;
      
      default:
        return 1;
    }
  }

  // Advanced failure simulation
  simulateRealisticFailure(patternId?: string): FailurePattern | null {
    const availablePatterns = patternId 
      ? this.failurePatterns.filter(p => p.id === patternId)
      : this.failurePatterns;

    if (availablePatterns.length === 0) return null;

    // Select pattern based on probability
    const selectedPattern = this.selectPatternByProbability(availablePatterns);
    
    // Apply failure with realistic timing
    selectedPattern.affectedServices.forEach(serviceId => {
      this.activeFailures.set(serviceId, {
        pattern: selectedPattern,
        startTime: Date.now()
      });

      // Schedule recovery based on MTTR
      const recoveryTime = this.generateRecoveryTime(selectedPattern.mttr);
      setTimeout(() => {
        this.activeFailures.delete(serviceId);
      }, recoveryTime * 60 * 1000); // Convert minutes to milliseconds
    });

    return selectedPattern;
  }

  private selectPatternByProbability(patterns: FailurePattern[]): FailurePattern {
    const totalWeight = patterns.reduce((sum, p) => sum + p.probability, 0);
    let random = Math.random() * totalWeight;
    
    for (const pattern of patterns) {
      random -= pattern.probability;
      if (random <= 0) return pattern;
    }
    
    return patterns[0]; // Fallback
  }

  private generateRecoveryTime(mttr: number): number {
    // Generate recovery time using exponential distribution
    return -Math.log(Math.random()) * mttr;
  }

  // Statistical analysis methods
  calculateSystemHealthScore(): number {
    const currentMetrics = Array.from(this.currentMetrics.values());
    if (currentMetrics.length === 0) return 100;

    const weights = {
      availability: 0.3,
      errorRate: 0.25,
      responseTime: 0.2,
      cpu: 0.1,
      memory: 0.1,
      throughput: 0.05
    };

    let totalScore = 0;
    currentMetrics.forEach(metric => {
      const scores = {
        availability: metric.metrics.availability,
        errorRate: Math.max(0, 100 - metric.metrics.errorRate * 10),
        responseTime: Math.max(0, 100 - Math.min(100, metric.metrics.responseTime / 10)),
        cpu: Math.max(0, 100 - metric.metrics.cpu),
        memory: Math.max(0, 100 - metric.metrics.memory),
        throughput: Math.min(100, metric.metrics.throughput / 100)
      };

      const weightedScore = Object.entries(weights).reduce((sum, [key, weight]) => {
        return sum + scores[key as keyof typeof scores] * weight;
      }, 0);

      totalScore += weightedScore;
    });

    return round(totalScore / currentMetrics.length, 1);
  }

  getMetricsStatistics(nodeId: string, timeWindow = 300000): any { // 5 minutes default
    const cutoff = Date.now() - timeWindow;
    const relevantMetrics = this.metricsHistory
      .filter(m => m.nodeId === nodeId && m.timestamp >= cutoff)
      .map(m => m.metrics);

    if (relevantMetrics.length === 0) return null;

    const statistics: any = {};
    const metricKeys = Object.keys(relevantMetrics[0]);

    metricKeys.forEach(key => {
      const values = relevantMetrics.map(m => m[key as keyof SimulationMetrics['metrics']]);
      statistics[key] = {
        mean: round(mean(values), 2),
        std: round(std(values), 2),
        min: Math.min(...values),
        max: Math.max(...values),
        p50: this.percentile(values, 0.5),
        p95: this.percentile(values, 0.95),
        p99: this.percentile(values, 0.99)
      };
    });

    return statistics;
  }

  private percentile(values: number[], p: number): number {
    const sorted = [...values].sort((a, b) => a - b);
    const index = Math.ceil(sorted.length * p) - 1;
    return sorted[Math.max(0, index)];
  }

  // Simulation control
  start(): void {
    if (this.isRunning) return;
    
    this.isRunning = true;
    // this._simulationStartTime = Date.now();
    
    // Generate initial metrics
    this.nodes.forEach(node => {
      const metrics = this.generateRealisticMetrics(node.id);
      this.currentMetrics.set(node.id, metrics);
      this.metricsHistory.push(metrics);
    });

    // Start continuous metric generation
    this.startMetricsCollection();
  }

  stop(): void {
    this.isRunning = false;
    this.activeFailures.clear();
  }

  private startMetricsCollection(): void {
    if (!this.isRunning) return;

    // Generate new metrics every 5 seconds
    setTimeout(() => {
      this.nodes.forEach(node => {
        const metrics = this.generateRealisticMetrics(node.id);
        this.currentMetrics.set(node.id, metrics);
        this.metricsHistory.push(metrics);
      });

      // Trim history to last hour
      const oneHourAgo = Date.now() - 3600000;
      this.metricsHistory = this.metricsHistory.filter(m => m.timestamp >= oneHourAgo);

      // Random failure simulation
      if (Math.random() < 0.01) { // 1% chance per interval
        this.simulateRealisticFailure();
      }

      this.startMetricsCollection();
    }, 5000);
  }

  // Getters
  getCurrentMetrics(): Map<string, SimulationMetrics> {
    return new Map(this.currentMetrics);
  }

  getMetricsHistory(): SimulationMetrics[] {
    return [...this.metricsHistory];
  }

  getActiveFailures(): Map<string, { pattern: FailurePattern; startTime: number }> {
    return new Map(this.activeFailures);
  }

  getFailurePatterns(): FailurePattern[] {
    return [...this.failurePatterns];
  }
}