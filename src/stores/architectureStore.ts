 
import { create } from "zustand";
import {
  addEdge,
  applyNodeChanges,
  applyEdgeChanges,
  Connection,
  NodeChange,
  EdgeChange,
  Node,
  Edge,
} from "@xyflow/react";
import { serviceNotifications } from '../utils/notifications';
import { getNodeName } from '../utils/typeGuards';
import { CommunicationType } from '../types/edges';

export type ServiceType = "api" | "database" | "external" | "infrastructure" | "cache" | "queue" | "auth" | "gateway" | "monitoring" | "storage" | "search" | "analytics" | "ml" | "cdn" | "custom";

export interface ServiceConfig {
  readonly name: string;
  readonly type: ServiceType;
  readonly techStack: string;
  readonly port: number;
  readonly healthCheckPath?: string;
  readonly cpu: number;
  readonly memory: number;
  readonly replicas: number;
  readonly environment: Readonly<Record<string, string>>;
}

export interface NodeData extends Record<string, unknown> {
  config: ServiceConfig;
  metadata?: {
    createdAt?: string;
    updatedAt?: string;
    version?: string;
  };
}

interface ArchitectureState {
  nodes: Node[];
  edges: Edge[];
  selectedNode: Node | null;
  selectedEdge: Edge | null;
  selectedEdgeType: CommunicationType;
  isPanelVisible: boolean;
  isEdgeSelectorVisible: boolean;
  onNodesChange: (changes: NodeChange[]) => void;
  onEdgesChange: (changes: EdgeChange[]) => void;
  onConnect: (connection: Connection) => void;
  addNode: (config: ServiceConfig, position: { x: number; y: number }) => void;
  updateNode: (id: string, config: Partial<ServiceConfig> | any) => void;
  selectNode: (node: Node | null) => void;
  selectEdge: (edge: Edge | null) => void;
  setSelectedEdgeType: (edgeType: CommunicationType) => void;
  setPanelVisibility: (visible: boolean) => void;
  setEdgeSelectorVisibility: (visible: boolean) => void;
  deleteNode: (id: string) => void;
  deleteEdge: (id: string) => void;
  loadTemplate: (nodes: Node[], edges: Edge[]) => void;
}

export const useArchitectureStore = create<ArchitectureState>((set, get) => ({
  nodes: [],
  edges: [],
  selectedNode: null,
  selectedEdge: null,
  selectedEdgeType: 'sync',
  isPanelVisible: true,
  isEdgeSelectorVisible: true,

  onNodesChange: (changes) => {
    set({
      nodes: applyNodeChanges(changes, get().nodes),
    });
  },

  onEdgesChange: (changes) => {
    set({
      edges: applyEdgeChanges(changes, get().edges),
    });
  },

  onConnect: (connection) => {
    // Generate unique ID using timestamp + random number to avoid duplicates
    const uniqueId = `edge-${Date.now()}-${Math.random().toString(36).substr(2, 9)}`;
    
    // Map edge types to appropriate protocols
    const getProtocolForEdgeType = (edgeType: CommunicationType): string => {
      switch (edgeType) {
        case 'sync':
          return 'HTTP';
        case 'async':
          return 'Queue';
        case 'data-flow':
          return 'Data';
        case 'https':
          return 'HTTPS';
        case 'tls-async':
          return 'TLS Queue';
        case 'encrypted-data':
          return 'Encrypted Data';
        default:
          return 'Unknown';
      }
    };
    
    const newEdge = {
      ...connection,
      id: uniqueId,
      type: get().selectedEdgeType,
      data: {
        communicationType: get().selectedEdgeType,
        protocol: getProtocolForEdgeType(get().selectedEdgeType),
      },
    } as Edge;
    set({
      edges: addEdge(newEdge, get().edges),
    });
    
    // Get node names for notification
    const sourceNode = get().nodes.find(node => node.id === connection.source);
    const targetNode = get().nodes.find(node => node.id === connection.target);
    const sourceName = sourceNode ? getNodeName(sourceNode) : 'Unknown';
    const targetName = targetNode ? getNodeName(targetNode) : 'Unknown';
    
    serviceNotifications.connected(sourceName, targetName);
  },

  addNode: (config, position) => {
    // Generate unique ID using timestamp + random number to avoid duplicates
    const uniqueId = `node-${Date.now()}-${Math.random().toString(36).substr(2, 9)}`;
    
    // Determine node type and data based on the service config
    let nodeType = "serviceNode";
    let nodeData: any;
    
    if (config.name === 'Custom Node' || config.techStack === 'Custom') {
      // Create custom node with default configuration
      nodeType = "customNode";
      nodeData = {
        config: {
          name: 'Custom Node',
          type: 'custom',
          customType: 'service',
          description: 'A fully customizable node',
          icon: 'custom',
          color: 'blue',
          borderColor: 'blue',
          textColor: 'blue',
          techStack: 'Custom',
          runtime: '',
          language: '',
          framework: '',
          database: '',
          port: 3000,
          protocol: 'HTTP',
          endpoints: [],
          domains: [],
          cpu: 1,
          memory: 512,
          storage: 0,
          replicas: 1,
          environment: {},
          secrets: [],
          configMaps: [],
          healthCheckPath: '/health',
          healthCheckInterval: 30,
          healthCheckTimeout: 5,
          metricsPath: '/metrics',
          loggingLevel: 'info',
          customProperties: {},
          dependencies: [],
          provides: [],
          consumes: [],
          deploymentStrategy: 'RollingUpdate',
          volumes: [],
          networkPolicy: '',
          authentication: false,
          authorization: false,
          encryption: false,
          certificates: [],
          businessFunction: '',
          dataFlow: [],
          integrationPatterns: [],
        },
        metadata: {
          createdAt: new Date().toISOString(),
          version: '1.0',
          author: 'User',
          tags: ['custom'],
          documentation: '',
        },
      };
    } else {
      // Create regular service node
      nodeData = {
        config,
        metadata: {
          createdAt: new Date().toISOString(),
          version: '1.0.0',
        },
      };
    }
    
    const newNode: Node = {
      id: uniqueId,
      type: nodeType,
      position,
      data: nodeData,
    };
    set({
      nodes: [...get().nodes, newNode],
    });
    
    // Notify user of successful addition
    serviceNotifications.added(nodeData.config.name);
  },

  updateNode: (id, configUpdate) => {
    const currentNode = get().nodes.find(node => node.id === id);
    const currentName = currentNode ? getNodeName(currentNode) : 'Unknown Service';
    
    set({
      nodes: get().nodes.map((node) =>
        node.id === id
          ? {
              ...node,
              data: {
                ...node.data,
                config: { 
                  ...((node.data as any).config), 
                  ...configUpdate 
                },
                metadata: {
                  ...((node.data as any).metadata),
                  updatedAt: new Date().toISOString(),
                },
              },
            }
          : node
      ),
    });
    
    // Notify user of successful update
    serviceNotifications.updated((configUpdate as any).name || currentName);
  },

  selectNode: (node) => {
    set({ selectedNode: node });
  },

  selectEdge: (edge) => {
    set({ selectedEdge: edge });
  },

  setSelectedEdgeType: (edgeType) => {
    set({ selectedEdgeType: edgeType });
  },

  setPanelVisibility: (visible) => {
    set({ isPanelVisible: visible });
  },

  setEdgeSelectorVisibility: (visible) => {
    set({ isEdgeSelectorVisible: visible });
  },

  deleteNode: (id) => {
    const nodeToDelete = get().nodes.find(node => node.id === id);
    const nodeName = nodeToDelete ? getNodeName(nodeToDelete) : 'Unknown Service';
    
    set({
      nodes: get().nodes.filter((node) => node.id !== id),
      edges: get().edges.filter(
        (edge) => edge.source !== id && edge.target !== id
      ),
      selectedNode: get().selectedNode?.id === id ? null : get().selectedNode,
    });
    
    // Notify user of successful deletion
    serviceNotifications.removed(nodeName);
  },

  deleteEdge: (id) => {
    set({
      edges: get().edges.filter((edge) => edge.id !== id),
      selectedEdge: get().selectedEdge?.id === id ? null : get().selectedEdge,
    });
  },

  loadTemplate: (nodes, edges) => {
    set({
      nodes,
      edges,
      selectedNode: null,
      selectedEdge: null,
    });
  },
}));
