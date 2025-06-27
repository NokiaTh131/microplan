import type { ServiceNode } from './nodes';
import type { ServiceEdge } from './edges';

export interface Architecture {
  id: string;
  name: string;
  nodes: ServiceNode[];
  edges: ServiceEdge[];
  createdAt: Date;
  updatedAt: Date;
}

export interface AnalysisResult {
  dependencyCycles: string[];
  bottlenecks: string[];
  singlePointsOfFailure: string[];
  resourceRequirements: {
    totalCpu: number;
    totalMemory: number;
    totalReplicas: number;
  };
}