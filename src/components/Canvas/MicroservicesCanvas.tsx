import React, { useCallback } from "react";
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

const nodeTypes = {
  serviceNode: ServiceNode,
};

const edgeTypes = {
  sync: SyncEdge,
  async: AsyncEdge,
  dataflow: DataFlowEdge,
};

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
        onEdgeClick={(_, edge) => selectEdge(edge)}
        defaultEdgeOptions={{
          type: "sync",
          style: { strokeWidth: 2, stroke: "#9ca3af" },
          markerEnd: {
            type: MarkerType.ArrowClosed,
            color: "#9ca3af",
          },
        }}
      >
        <Background />
        <Controls className="bg-white/80 backdrop-blur-sm border border-slate-200 rounded-lg shadow-lg" />
        <MiniMap
          nodeColor={(node) => {
            const nodeData = node.data as any;
            switch (nodeData?.config?.type) {
              case "api":
                return "#3b82f6";
              case "auth":
                return "#22c55e";
              case "gateway":
                return "#f97316";
              case "database":
                return "#10b981";
              case "cache":
                return "#ef4444";
              case "queue":
                return "#8b5cf6";
              case "search":
                return "#eab308";
              case "monitoring":
                return "#06b6d4";
              case "analytics":
                return "#6366f1";
              case "storage":
                return "#64748b";
              case "cdn":
                return "#60a5fa";
              case "ml":
                return "#ec4899";
              case "external":
                return "#8b5cf6";
              case "infrastructure":
                return "#f97316";
              default:
                return "#6b7280";
            }
          }}
          className="bg-white/80 backdrop-blur-sm border border-slate-200 rounded-lg shadow-lg"
        />
      </ReactFlow>
    </div>
  );
};

export default MicroservicesCanvas;
