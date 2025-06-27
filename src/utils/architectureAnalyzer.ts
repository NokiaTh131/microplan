 
import { Node, Edge } from '@xyflow/react';

export interface AnalysisResult {
  dependencyCycles: string[];
  bottlenecks: string[];
  singlePointsOfFailure: string[];
  resourceRequirements: {
    totalCpu: number;
    totalMemory: number;
    totalReplicas: number;
  };
  recommendations: string[];
}

export class ArchitectureAnalyzer {
  private nodes: Node[];
  private edges: Edge[];

  constructor(nodes: Node[], edges: Edge[]) {
    this.nodes = nodes;
    this.edges = edges;
  }

  public analyze(): AnalysisResult {
    return {
      dependencyCycles: this.findDependencyCycles(),
      bottlenecks: this.identifyBottlenecks(),
      singlePointsOfFailure: this.findSinglePointsOfFailure(),
      resourceRequirements: this.calculateResourceRequirements(),
      recommendations: this.generateRecommendations(),
    };
  }

  private findDependencyCycles(): string[] {
    const cycles: string[] = [];
    const visited = new Set<string>();
    const recursionStack = new Set<string>();

    const dfs = (nodeId: string, path: string[]): void => {
      if (recursionStack.has(nodeId)) {
        const cycleStart = path.indexOf(nodeId);
        const cycle = path.slice(cycleStart).concat(nodeId);
        const nodeNames = cycle.map(id => this.getNodeName(id));
        cycles.push(`${nodeNames.join(' → ')}`);
        return;
      }

      if (visited.has(nodeId)) return;

      visited.add(nodeId);
      recursionStack.add(nodeId);

      const outgoingEdges = this.edges.filter(edge => edge.source === nodeId);
      for (const edge of outgoingEdges) {
        dfs(edge.target, [...path, nodeId]);
      }

      recursionStack.delete(nodeId);
    };

    for (const node of this.nodes) {
      if (!visited.has(node.id)) {
        dfs(node.id, []);
      }
    }

    return cycles;
  }

  private identifyBottlenecks(): string[] {
    const bottlenecks: string[] = [];
    const incomingCount = new Map<string, number>();
    const outgoingCount = new Map<string, number>();

    // Initialize counts
    this.nodes.forEach(node => {
      incomingCount.set(node.id, 0);
      outgoingCount.set(node.id, 0);
    });

    // Count connections
    this.edges.forEach(edge => {
      incomingCount.set(edge.target, (incomingCount.get(edge.target) || 0) + 1);
      outgoingCount.set(edge.source, (outgoingCount.get(edge.source) || 0) + 1);
    });

    // Identify nodes with high connection density
    this.nodes.forEach(node => {
      const incoming = incomingCount.get(node.id) || 0;
      const outgoing = outgoingCount.get(node.id) || 0;
      const total = incoming + outgoing;

      if (total >= 4) { // Threshold for bottleneck
        const config = (node.data as any)?.config;
        if (config && config.replicas === 1) {
          bottlenecks.push(`${config.name} (${total} connections, 1 replica)`);
        }
      }
    });

    return bottlenecks;
  }

  private findSinglePointsOfFailure(): string[] {
    const spofs: string[] = [];

    this.nodes.forEach(node => {
      const config = (node.data as any)?.config;
      if (!config) return;

      // Single replica services are potential SPOFs
      if (config.replicas === 1) {
        const incomingCount = this.edges.filter(edge => edge.target === node.id).length;
        const outgoingCount = this.edges.filter(edge => edge.source === node.id).length;

        // If it has connections and only 1 replica, it's a SPOF
        if (incomingCount > 0 || outgoingCount > 0) {
          spofs.push(`${config.name} (single replica with dependencies)`);
        }
      }

      // Infrastructure services are critical
      if (config.type === 'infrastructure' && config.replicas <= 2) {
        spofs.push(`${config.name} (critical infrastructure with ${config.replicas} replicas)`);
      }
    });

    return spofs;
  }

  private calculateResourceRequirements(): {
    totalCpu: number;
    totalMemory: number;
    totalReplicas: number;
  } {
    let totalCpu = 0;
    let totalMemory = 0;
    let totalReplicas = 0;

    this.nodes.forEach(node => {
      const config = (node.data as any)?.config;
      if (config) {
        totalCpu += config.cpu * config.replicas;
        totalMemory += config.memory * config.replicas;
        totalReplicas += config.replicas;
      }
    });

    return { totalCpu, totalMemory, totalReplicas };
  }

  private generateRecommendations(): string[] {
    const recommendations: string[] = [];
    const analysis = {
      cycles: this.findDependencyCycles(),
      bottlenecks: this.identifyBottlenecks(),
      spofs: this.findSinglePointsOfFailure(),
    };

    if (analysis.cycles.length > 0) {
      recommendations.push('🔄 Break dependency cycles to improve system stability');
    }

    if (analysis.bottlenecks.length > 0) {
      recommendations.push('⚡ Scale bottleneck services or add load balancing');
    }

    if (analysis.spofs.length > 0) {
      recommendations.push('🛡️ Add redundancy to single points of failure');
    }

    const dbCount = this.nodes.filter(node => 
      (node.data as any)?.config?.type === 'database'
    ).length;

    if (dbCount === 0) {
      recommendations.push('💾 Add persistent storage for stateful services');
    }

    const gatewayCount = this.nodes.filter(node => 
      (node.data as any)?.config?.name?.toLowerCase().includes('gateway')
    ).length;

    if (gatewayCount === 0 && this.nodes.length > 3) {
      recommendations.push('🚪 Consider adding an API Gateway for service orchestration');
    }

    const authCount = this.nodes.filter(node => 
      (node.data as any)?.config?.name?.toLowerCase().includes('auth')
    ).length;

    if (authCount === 0 && this.nodes.length > 2) {
      recommendations.push('🔐 Add authentication service for security');
    }

    if (recommendations.length === 0) {
      recommendations.push('✅ Architecture looks well-designed!');
    }

    return recommendations;
  }

  private getNodeName(nodeId: string): string {
    const node = this.nodes.find(n => n.id === nodeId);
    return (node?.data as any)?.config?.name || nodeId;
  }
}