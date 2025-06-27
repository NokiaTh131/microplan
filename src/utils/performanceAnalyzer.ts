import { Node, Edge } from "@xyflow/react";
import { ServiceConfig, NodeData } from "../stores/architectureStore";

export interface PerformanceMetrics {
  responseTime: {
    p50: number;
    p95: number;
    p99: number;
  };
  throughput: number;
  errorRate: number;
  availability: number;
  resourceUtilization: {
    cpu: number;
    memory: number;
    network: number;
  };
}

export interface PerformanceBottleneck {
  id: string;
  type: "cpu" | "memory" | "network" | "database" | "dependency";
  severity: "low" | "medium" | "high" | "critical";
  service: string;
  description: string;
  impact: string;
  recommendations: string[];
  estimatedImprovement: string;
}

export interface LoadTestScenario {
  id: string;
  name: string;
  description: string;
  userLoad: number;
  duration: number;
  rampUpTime: number;
  endpoint: string;
  expectedThroughput: number;
  expectedLatency: number;
}

export interface OptimizationSuggestion {
  id: string;
  category:
    | "architecture"
    | "infrastructure"
    | "database"
    | "caching"
    | "monitoring";
  priority: "low" | "medium" | "high" | "critical";
  title: string;
  description: string;
  implementation: string;
  estimatedImpact: {
    performance: number;
    cost: number;
    complexity: number;
  };
  prerequisites: string[];
  risks: string[];
}

export interface ResourcePrediction {
  service: string;
  currentResources: {
    cpu: number;
    memory: number;
  };
  predictedNeeds: {
    cpu: number;
    memory: number;
  };
  utilizationTrend: "increasing" | "stable" | "decreasing";
  timeToCapacity: number; // days
  recommendations: string[];
}

export interface ArchitectureHealth {
  overall: number; // 0-100
  categories: {
    scalability: number;
    reliability: number;
    performance: number;
    security: number;
    maintainability: number;
  };
  criticalIssues: string[];
  improvements: string[];
}

class PerformanceAnalyzer {
  private nodes: Node[];
  private edges: Edge[];

  constructor(nodes: Node[], edges: Edge[]) {
    this.nodes = nodes;
    this.edges = edges;
  }

  // Simulate performance metrics based on architecture
  generatePerformanceMetrics(): Record<string, PerformanceMetrics> {
    const metrics: Record<string, PerformanceMetrics> = {};

    this.nodes.forEach((node) => {
      const config = (node.data as NodeData).config;
      const baseLatency = this.calculateBaseLatency(config);
      const loadFactor = this.calculateLoadFactor(node.id);

      metrics[node.id] = {
        responseTime: {
          p50: baseLatency * (0.8 + Math.random() * 0.4),
          p95: baseLatency * (1.5 + Math.random() * 0.5),
          p99: baseLatency * (2.0 + Math.random() * 1.0),
        },
        throughput: this.calculateThroughput(config, loadFactor),
        errorRate: this.calculateErrorRate(config, loadFactor),
        availability: this.calculateAvailability(config),
        resourceUtilization: this.calculateResourceUtilization(
          config,
          loadFactor
        ),
      };
    });

    return metrics;
  }

  // Identify performance bottlenecks
  identifyBottlenecks(): PerformanceBottleneck[] {
    const bottlenecks: PerformanceBottleneck[] = [];
    const metrics = this.generatePerformanceMetrics();

    this.nodes.forEach((node) => {
      const config = (node.data as NodeData).config;
      const nodeMetrics = metrics[node.id];
      const dependencies = this.getNodeDependencies(node.id);

      // CPU bottlenecks
      if (nodeMetrics.resourceUtilization.cpu > 80) {
        bottlenecks.push({
          id: `cpu-${node.id}`,
          type: "cpu",
          severity:
            nodeMetrics.resourceUtilization.cpu > 95 ? "critical" : "high",
          service: config.name,
          description: `High CPU utilization (${nodeMetrics.resourceUtilization.cpu.toFixed(
            1
          )}%)`,
          impact: "Increased response times and potential service degradation",
          recommendations: [
            "Increase CPU allocation",
            "Implement horizontal scaling",
            "Optimize algorithms and code",
            "Add caching layer",
          ],
          estimatedImprovement: "30-50% response time reduction",
        });
      }

      // Memory bottlenecks
      if (nodeMetrics.resourceUtilization.memory > 85) {
        bottlenecks.push({
          id: `memory-${node.id}`,
          type: "memory",
          severity:
            nodeMetrics.resourceUtilization.memory > 95 ? "critical" : "high",
          service: config.name,
          description: `High memory utilization (${nodeMetrics.resourceUtilization.memory.toFixed(
            1
          )}%)`,
          impact:
            "Memory leaks, garbage collection pauses, potential OOM errors",
          recommendations: [
            "Increase memory allocation",
            "Implement memory pooling",
            "Optimize data structures",
            "Add memory monitoring",
          ],
          estimatedImprovement: "20-40% stability improvement",
        });
      }

      // Database bottlenecks
      if (config.type === "database" && nodeMetrics.responseTime.p95 > 100) {
        bottlenecks.push({
          id: `db-${node.id}`,
          type: "database",
          severity: nodeMetrics.responseTime.p95 > 500 ? "critical" : "medium",
          service: config.name,
          description: `Slow database queries (P95: ${nodeMetrics.responseTime.p95.toFixed(
            1
          )}ms)`,
          impact: "Slow application response times, poor user experience",
          recommendations: [
            "Add database indexes",
            "Implement query optimization",
            "Add read replicas",
            "Implement connection pooling",
          ],
          estimatedImprovement: "50-70% query performance improvement",
        });
      }

      // Network bottlenecks
      if (dependencies.length > 5) {
        bottlenecks.push({
          id: `network-${node.id}`,
          type: "network",
          severity: "medium",
          service: config.name,
          description: `High number of service dependencies (${dependencies.length})`,
          impact: "Increased latency, complex failure scenarios",
          recommendations: [
            "Implement service mesh",
            "Add circuit breakers",
            "Optimize service boundaries",
            "Implement asynchronous communication",
          ],
          estimatedImprovement: "15-25% latency reduction",
        });
      }
    });

    return bottlenecks.sort((a, b) => {
      const severityOrder = { critical: 4, high: 3, medium: 2, low: 1 };
      return severityOrder[b.severity] - severityOrder[a.severity];
    });
  }

  // Generate optimization suggestions
  generateOptimizations(): OptimizationSuggestion[] {
    const suggestions: OptimizationSuggestion[] = [];
    const bottlenecks = this.identifyBottlenecks();

    // Architecture patterns
    if (
      this.nodes.filter((n) => (n.data as NodeData).config.type === "cache")
        .length === 0
    ) {
      suggestions.push({
        id: "add-caching",
        category: "architecture",
        priority: "high",
        title: "Implement Distributed Caching",
        description:
          "Add a distributed cache layer to reduce database load and improve response times",
        implementation:
          "Deploy Redis or Memcached cluster with application-level caching",
        estimatedImpact: {
          performance: 40,
          cost: -20,
          complexity: 15,
        },
        prerequisites: [
          "Cache invalidation strategy",
          "Data consistency analysis",
        ],
        risks: [
          "Cache invalidation complexity",
          "Additional infrastructure cost",
        ],
      });
    }

    // Load balancing
    const gatewayNodes = this.nodes.filter(
      (n) => (n.data as NodeData).config.type === "gateway"
    );
    if (gatewayNodes.length === 0) {
      suggestions.push({
        id: "add-load-balancer",
        category: "infrastructure",
        priority: "high",
        title: "Add Load Balancer",
        description:
          "Implement load balancing to distribute traffic and improve availability",
        implementation: "Deploy Nginx, HAProxy, or cloud load balancer",
        estimatedImpact: {
          performance: 30,
          cost: 10,
          complexity: 10,
        },
        prerequisites: [
          "Health check endpoints",
          "Session management strategy",
        ],
        risks: ["Single point of failure if not redundant"],
      });
    }

    // Monitoring
    const monitoringNodes = this.nodes.filter(
      (n) => (n.data as NodeData).config.type === "monitoring"
    );
    if (monitoringNodes.length === 0) {
      suggestions.push({
        id: "add-monitoring",
        category: "monitoring",
        priority: "critical",
        title: "Implement Comprehensive Monitoring",
        description:
          "Add monitoring and observability to track performance and detect issues",
        implementation: "Deploy Prometheus, Grafana, and distributed tracing",
        estimatedImpact: {
          performance: 20,
          cost: 15,
          complexity: 25,
        },
        prerequisites: ["Metrics collection strategy", "Alert thresholds"],
        risks: ["Monitoring overhead", "Alert fatigue"],
      });
    }

    // Database optimization
    const dbBottlenecks = bottlenecks.filter((b) => b.type === "database");
    if (dbBottlenecks.length > 0) {
      suggestions.push({
        id: "optimize-database",
        category: "database",
        priority: "high",
        title: "Database Performance Optimization",
        description:
          "Optimize database performance through indexing, query optimization, and scaling",
        implementation:
          "Add indexes, implement read replicas, optimize queries",
        estimatedImpact: {
          performance: 60,
          cost: 20,
          complexity: 30,
        },
        prerequisites: [
          "Query analysis",
          "Index strategy",
          "Replication setup",
        ],
        risks: ["Increased storage cost", "Replication lag"],
      });
    }

    // Auto-scaling
    const highUtilizationServices = this.nodes.filter((node) => {
      const config = (node.data as NodeData).config;
      return config.replicas === 1 && config.type !== "database";
    });

    if (highUtilizationServices.length > 0) {
      suggestions.push({
        id: "implement-autoscaling",
        category: "infrastructure",
        priority: "medium",
        title: "Implement Auto-scaling",
        description:
          "Add horizontal auto-scaling to handle traffic spikes automatically",
        implementation:
          "Configure HPA (Horizontal Pod Autoscaler) or equivalent",
        estimatedImpact: {
          performance: 35,
          cost: -10,
          complexity: 20,
        },
        prerequisites: ["Resource metrics", "Scaling policies", "Load testing"],
        risks: ["Cost fluctuation", "Scaling delays"],
      });
    }

    return suggestions.sort((a, b) => {
      const priorityOrder = { critical: 4, high: 3, medium: 2, low: 1 };
      return priorityOrder[b.priority] - priorityOrder[a.priority];
    });
  }

  // Predict resource needs
  predictResourceNeeds(): ResourcePrediction[] {
    const predictions: ResourcePrediction[] = [];

    this.nodes.forEach((node) => {
      const config = (node.data as NodeData).config;
      const currentLoad = this.calculateLoadFactor(node.id);
      const growthRate = 0.1 + Math.random() * 0.2; // 10-30% growth

      const prediction: ResourcePrediction = {
        service: config.name,
        currentResources: {
          cpu: config.cpu,
          memory: config.memory,
        },
        predictedNeeds: {
          cpu: config.cpu * (1 + growthRate),
          memory: config.memory * (1 + growthRate * 0.8),
        },
        utilizationTrend:
          currentLoad > 0.7
            ? "increasing"
            : currentLoad > 0.3
            ? "stable"
            : "decreasing",
        timeToCapacity: Math.floor(365 / (growthRate * 100)), // days
        recommendations: this.generateResourceRecommendations(
          config,
          currentLoad,
          growthRate
        ),
      };

      predictions.push(prediction);
    });

    return predictions;
  }

  // Calculate overall architecture health
  calculateArchitectureHealth(): ArchitectureHealth {
    const bottlenecks = this.identifyBottlenecks();

    const scalability = this.assessScalability();
    const reliability = this.assessReliability();
    const performance = this.assessPerformance();
    const security = this.assessSecurity();
    const maintainability = this.assessMaintainability();

    const overall = Math.round(
      (scalability + reliability + performance + security + maintainability) / 5
    );

    return {
      overall,
      categories: {
        scalability,
        reliability,
        performance,
        security,
        maintainability,
      },
      criticalIssues: bottlenecks
        .filter((b) => b.severity === "critical")
        .map((b) => `${b.service}: ${b.description}`),
      improvements: this.generateOptimizations()
        .slice(0, 5)
        .map((s) => s.title),
    };
  }

  // Helper methods
  private calculateBaseLatency(config: ServiceConfig): number {
    const typeLatencies: Record<string, number> = {
      api: 20,
      database: 50,
      cache: 1,
      queue: 10,
      gateway: 5,
      auth: 15,
      external: 100,
      storage: 30,
      search: 25,
      analytics: 200,
      ml: 500,
      monitoring: 10,
      infrastructure: 5,
      cdn: 2,
    };
    return typeLatencies[config.type] || 20;
  }

  private calculateLoadFactor(nodeId: string): number {
    const dependencies = this.getNodeDependencies(nodeId);
    const dependents = this.getNodeDependents(nodeId);
    return Math.min(1, (dependencies.length + dependents.length) / 10);
  }

  private calculateThroughput(
    config: ServiceConfig,
    loadFactor: number
  ): number {
    const baseRps = config.replicas * 100; // 100 RPS per replica
    return Math.round(baseRps * (1 - loadFactor * 0.3));
  }

  private calculateErrorRate(
    config: ServiceConfig,
    loadFactor: number
  ): number {
    const baseErrorRate = config.type === "external" ? 2 : 0.1;
    return Math.min(10, baseErrorRate * (1 + loadFactor * 2));
  }

  private calculateAvailability(config: ServiceConfig): number {
    const baseAvailability = config.replicas > 1 ? 99.9 : 99.5;
    const typeBonus = config.type === "database" ? -0.2 : 0;
    return Math.max(95, baseAvailability + typeBonus);
  }

  private calculateResourceUtilization(
    _config: ServiceConfig,
    loadFactor: number
  ): {
    cpu: number;
    memory: number;
    network: number;
  } {
    const baseCpu = 20 + loadFactor * 50;
    const baseMemory = 30 + loadFactor * 40;
    const baseNetwork = 10 + loadFactor * 30;

    return {
      cpu: Math.min(100, baseCpu + Math.random() * 20),
      memory: Math.min(100, baseMemory + Math.random() * 20),
      network: Math.min(100, baseNetwork + Math.random() * 15),
    };
  }

  private getNodeDependencies(nodeId: string): string[] {
    return this.edges
      .filter((edge) => edge.source === nodeId)
      .map((edge) => edge.target);
  }

  private getNodeDependents(nodeId: string): string[] {
    return this.edges
      .filter((edge) => edge.target === nodeId)
      .map((edge) => edge.source);
  }

  private generateResourceRecommendations(
    config: ServiceConfig,
    currentLoad: number,
    growthRate: number
  ): string[] {
    const recommendations: string[] = [];

    if (currentLoad > 0.8) {
      recommendations.push("Consider immediate scaling to handle current load");
    }

    if (growthRate > 0.2) {
      recommendations.push(
        "Plan for aggressive scaling due to high growth rate"
      );
    }

    if (config.replicas === 1 && config.type !== "database") {
      recommendations.push("Add redundancy with multiple replicas");
    }

    if (config.cpu < 1 && currentLoad > 0.6) {
      recommendations.push("Increase CPU allocation to improve performance");
    }

    return recommendations;
  }

  private assessScalability(): number {
    let score = 70;

    // Check for single points of failure
    const singleReplicas = this.nodes.filter(
      (n) =>
        (n.data as NodeData).config.replicas === 1 &&
        (n.data as NodeData).config.type !== "database"
    );
    score -= singleReplicas.length * 10;

    // Check for load balancers
    const hasLoadBalancer = this.nodes.some(
      (n) => (n.data as NodeData).config.type === "gateway"
    );
    if (hasLoadBalancer) score += 15;

    // Check for caching
    const hasCache = this.nodes.some(
      (n) => (n.data as NodeData).config.type === "cache"
    );
    if (hasCache) score += 10;

    return Math.max(0, Math.min(100, score));
  }

  private assessReliability(): number {
    let score = 60;

    // Check for monitoring
    const hasMonitoring = this.nodes.some(
      (n) => (n.data as NodeData).config.type === "monitoring"
    );
    if (hasMonitoring) score += 20;

    // Check for redundancy
    const avgReplicas =
      this.nodes.reduce(
        (sum, n) => sum + (n.data as NodeData).config.replicas,
        0
      ) / this.nodes.length;
    score += Math.min(20, avgReplicas * 5);

    return Math.max(0, Math.min(100, score));
  }

  private assessPerformance(): number {
    const bottlenecks = this.identifyBottlenecks();
    let score = 80;

    score -= bottlenecks.filter((b) => b.severity === "critical").length * 20;
    score -= bottlenecks.filter((b) => b.severity === "high").length * 10;
    score -= bottlenecks.filter((b) => b.severity === "medium").length * 5;

    return Math.max(0, Math.min(100, score));
  }

  private assessSecurity(): number {
    let score = 50;

    // Check for auth service
    const hasAuth = this.nodes.some(
      (n) => (n.data as NodeData).config.type === "auth"
    );
    if (hasAuth) score += 25;

    // Check for gateway (API protection)
    const hasGateway = this.nodes.some(
      (n) => (n.data as NodeData).config.type === "gateway"
    );
    if (hasGateway) score += 15;

    // Check for external services (potential security risk)
    const externalServices = this.nodes.filter(
      (n) => (n.data as NodeData).config.type === "external"
    );
    score -= externalServices.length * 5;

    return Math.max(0, Math.min(100, score));
  }

  private assessMaintainability(): number {
    let score = 70;

    // Complexity penalty
    const nodeCount = this.nodes.length;
    if (nodeCount > 20) score -= 20;
    else if (nodeCount > 10) score -= 10;

    // Architecture patterns bonus
    const hasMonitoring = this.nodes.some(
      (n) => (n.data as NodeData).config.type === "monitoring"
    );
    if (hasMonitoring) score += 15;

    const hasQueue = this.nodes.some(
      (n) => (n.data as NodeData).config.type === "queue"
    );
    if (hasQueue) score += 10;

    return Math.max(0, Math.min(100, score));
  }
}

export { PerformanceAnalyzer };
