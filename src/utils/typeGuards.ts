import { Node, Edge } from '@xyflow/react';
import { ServiceConfig, NodeData } from '../stores/architectureStore';

// Type guards for better type safety
export const isServiceNodeData = (data: unknown): data is NodeData => {
  return (
    typeof data === 'object' &&
    data !== null &&
    'config' in data &&
    typeof (data as any).config === 'object'
  );
};

export const isServiceConfig = (config: unknown): config is ServiceConfig => {
  return (
    typeof config === 'object' &&
    config !== null &&
    'name' in config &&
    'type' in config &&
    typeof (config as any).name === 'string' &&
    typeof (config as any).type === 'string'
  );
};

export const isValidNode = (node: unknown): node is Node<NodeData> => {
  return (
    typeof node === 'object' &&
    node !== null &&
    'id' in node &&
    'type' in node &&
    'data' in node &&
    'position' in node &&
    typeof (node as any).id === 'string' &&
    isServiceNodeData((node as any).data)
  );
};

export const isValidEdge = (edge: unknown): edge is Edge => {
  return (
    typeof edge === 'object' &&
    edge !== null &&
    'id' in edge &&
    'source' in edge &&
    'target' in edge &&
    typeof (edge as any).id === 'string' &&
    typeof (edge as any).source === 'string' &&
    typeof (edge as any).target === 'string'
  );
};

export const hasValidConfig = (node: Node): node is Node<NodeData> => {
  return isServiceNodeData(node.data) && isServiceConfig(node.data.config);
};

// Utility functions for safe data access
export const getNodeName = (node: Node): string => {
  if (hasValidConfig(node)) {
    return node.data.config.name || node.id;
  }
  return node.id;
};

export const getNodeType = (node: Node): string => {
  if (hasValidConfig(node)) {
    return node.data.config.type || 'unknown';
  }
  return 'unknown';
};

export const getNodeConfig = (node: Node): ServiceConfig | null => {
  if (hasValidConfig(node)) {
    return node.data.config;
  }
  return null;
};

// Array validation helpers
export const validateNodesArray = (nodes: unknown[]): Node<NodeData>[] => {
  return nodes.filter(isValidNode);
};

export const validateEdgesArray = (edges: unknown[]): Edge[] => {
  return edges.filter(isValidEdge);
};

// Error handling helpers
export const safeJsonParse = <T>(json: string, defaultValue: T): T => {
  try {
    const parsed = JSON.parse(json);
    return parsed ?? defaultValue;
  } catch {
    return defaultValue;
  }
};

export const safeAsyncOperation = async <T>(
  operation: () => Promise<T>,
  fallback: T,
  errorHandler?: (error: Error) => void
): Promise<T> => {
  try {
    return await operation();
  } catch (error) {
    if (errorHandler && error instanceof Error) {
      errorHandler(error);
    }
    return fallback;
  }
};