import React, { useCallback, useMemo } from "react";
import {
  ReactFlow,
  Background,
  Controls,
  MiniMap,
  MarkerType,
} from "@xyflow/react";
import "@xyflow/react/dist/style.css";

import { useArchitectureStore } from "../../stores/architectureStore";
import ServiceNode from "../CustomNodes/ServiceNode";
import SyncEdge from "../CustomEdges/SyncEdge";
import AsyncEdge from "../CustomEdges/AsyncEdge";
import DataFlowEdge from "../CustomEdges/DataFlowEdge";
import { HttpsEdge } from "../CustomEdges/HttpsEdge";
import { TlsAsyncEdge } from "../CustomEdges/TlsAsyncEdge";
import { EncryptedDataEdge } from "../CustomEdges/EncryptedDataEdge";

interface ServiceConfig {
  name: string;
  type:
    | "api"
    | "database"
    | "external"
    | "infrastructure"
    | "cache"
    | "queue"
    | "auth"
    | "gateway"
    | "monitoring"
    | "storage"
    | "search"
    | "analytics"
    | "ml"
    | "cdn";
  techStack: string;
  port: number;
  healthCheckPath?: string;
  cpu: number;
  memory: number;
  replicas: number;
  environment: Record<string, string>;
}

const MicroservicesCanvas: React.FC = () => {
  const {
    nodes,
    edges,
    onNodesChange,
    onEdgesChange,
    onConnect,
    addNode,
    selectEdge,
  } = useArchitectureStore();

  // Memoize node and edge types to prevent recreation on every render
  const nodeTypes = useMemo(() => ({
    serviceNode: ServiceNode,
  }), []);

  const edgeTypes = useMemo(() => ({
    sync: SyncEdge,
    async: AsyncEdge,
    'data-flow': DataFlowEdge,
    https: HttpsEdge,
    'tls-async': TlsAsyncEdge,
    'encrypted-data': EncryptedDataEdge,
  }), []);

  const onDragOver = useCallback((event: React.DragEvent) => {
    event.preventDefault();
    event.dataTransfer.dropEffect = "move";
  }, []);

  const onDrop = useCallback(
    (event: React.DragEvent) => {
      event.preventDefault();

      const templateData = event.dataTransfer.getData("application/reactflow");

      if (typeof templateData === "undefined" || !templateData) {
        return;
      }

      const template: ServiceConfig = JSON.parse(templateData);

      // Get the canvas bounds to calculate proper position
      const reactFlowBounds = (event.target as Element)
        .closest(".react-flow")
        ?.getBoundingClientRect();
      const position = {
        x: event.clientX - (reactFlowBounds?.left || 0) - 140, // Account for node width
        y: event.clientY - (reactFlowBounds?.top || 0) - 100, // Account for node height
      };

      addNode(template, position);
    },
    [addNode]
  );

  return (
    <div className="flex-1 h-full relative">
      <ReactFlow
        nodes={nodes}
        edges={edges}
        nodeTypes={nodeTypes}
        edgeTypes={edgeTypes}
        onNodesChange={onNodesChange}
        onEdgesChange={onEdgesChange}
        onConnect={onConnect}
        onDrop={onDrop}
        onDragOver={onDragOver}
        fitView
        attributionPosition="top-right"
        onEdgeClick={useCallback((_: any, edge: any) => selectEdge(edge), [selectEdge])}
        defaultEdgeOptions={useMemo(() => ({
          type: "sync",
          style: { strokeWidth: 2, stroke: "#9ca3af" },
          markerEnd: {
            type: MarkerType.ArrowClosed,
            color: "#9ca3af",
          },
        }), [])}
      >
        <Background />
        <Controls className="bg-white/80 backdrop-blur-sm border border-slate-200 rounded-lg shadow-lg" />
        <MiniMap
          nodeColor={useMemo(() => {
            const nodeColorMap = {
              "api": "#3b82f6",
              "auth": "#22c55e", 
              "gateway": "#f97316",
              "database": "#10b981",
              "cache": "#ef4444",
              "queue": "#8b5cf6",
              "search": "#eab308",
              "monitoring": "#06b6d4",
              "analytics": "#6366f1",
              "storage": "#64748b",
              "cdn": "#60a5fa",
              "ml": "#ec4899",
              "external": "#8b5cf6",
              "infrastructure": "#f97316",
            };
            
            return (node: any) => {
              const nodeData = node.data as any;
              return nodeColorMap[nodeData?.config?.type as keyof typeof nodeColorMap] || "#6b7280";
            };
          }, [])}
          className="bg-white/80 backdrop-blur-sm border border-slate-200 rounded-lg shadow-lg"
        />
      </ReactFlow>
    </div>
  );
};

export default MicroservicesCanvas;
