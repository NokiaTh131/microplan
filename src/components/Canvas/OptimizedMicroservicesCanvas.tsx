import React, { useCallback, useMemo, useRef, useEffect } from "react";
import {
  ReactFlow,
  Background,
  Controls,
  MiniMap,
  MarkerType,
  ReactFlowProvider,
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

const OptimizedMicroservicesCanvas: React.FC = () => {
  const {
    nodes,
    edges,
    onNodesChange,
    onEdgesChange,
    onConnect,
    addNode,
    selectEdge,
  } = useArchitectureStore();

  const reactFlowWrapper = useRef<HTMLDivElement>(null);

  // Memoize node and edge types to prevent recreation
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

  // Throttle drag events to improve performance
  const onDragOver = useCallback((event: React.DragEvent) => {
    event.preventDefault();
    event.dataTransfer.dropEffect = "move";
  }, []);

  const onDrop = useCallback(
    (event: React.DragEvent) => {
      event.preventDefault();

      const templateData = event.dataTransfer.getData("application/reactflow");
      if (!templateData) return;

      const template = JSON.parse(templateData);
      const reactFlowBounds = reactFlowWrapper.current?.getBoundingClientRect();

      if (reactFlowBounds) {
        const position = {
          x: event.clientX - reactFlowBounds.left - 50,
          y: event.clientY - reactFlowBounds.top - 50,
        };

        addNode(template, position);
      }
    },
    [addNode]
  );

  // Memoize edge click handler
  const onEdgeClick = useCallback(
    (_: any, edge: any) => selectEdge(edge),
    [selectEdge]
  );

  // Memoize default edge options
  const defaultEdgeOptions = useMemo(() => ({
    type: "sync",
    style: { strokeWidth: 2, stroke: "#9ca3af" },
    markerEnd: {
      type: MarkerType.ArrowClosed,
      color: "#9ca3af",
    },
  }), []);

  // Memoize minimap node color function with performance optimization
  const minimapNodeColor = useMemo(() => {
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
      const nodeData = node.data;
      return nodeColorMap[nodeData?.config?.type as keyof typeof nodeColorMap] || "#6b7280";
    };
  }, []);

  // Performance monitoring
  useEffect(() => {
    if (nodes.length > 50) {
      console.warn("Large number of nodes detected. Consider implementing virtualization.");
    }
  }, [nodes.length]);

  // Memoize the entire ReactFlow component props
  const reactFlowProps = useMemo(() => ({
    nodes,
    edges,
    nodeTypes,
    edgeTypes,
    onNodesChange,
    onEdgesChange,
    onConnect,
    onDrop,
    onDragOver,
    onEdgeClick,
    defaultEdgeOptions,
    fitView: true,
    attributionPosition: "top-right" as const,
    // Performance optimizations
    nodesDraggable: true,
    nodesConnectable: true,
    elementsSelectable: true,
    snapToGrid: true,
    snapGrid: [15, 15] as [number, number],
    // Reduce re-renders by limiting updates
    maxZoom: 4,
    minZoom: 0.1,
    defaultViewport: { x: 0, y: 0, zoom: 1 },
  }), [
    nodes,
    edges,
    nodeTypes,
    edgeTypes,
    onNodesChange,
    onEdgesChange,
    onConnect,
    onDrop,
    onDragOver,
    onEdgeClick,
    defaultEdgeOptions,
  ]);

  return (
    <div className="h-full w-full" ref={reactFlowWrapper}>
      <ReactFlowProvider>
        <ReactFlow {...reactFlowProps}>
          <Background />
          <Controls className="bg-white/80 backdrop-blur-sm border border-slate-200 rounded-lg shadow-lg" />
          <MiniMap
            nodeColor={minimapNodeColor}
            className="bg-white/80 backdrop-blur-sm border border-slate-200 rounded-lg shadow-lg"
            pannable
            zoomable
          />
        </ReactFlow>
      </ReactFlowProvider>
    </div>
  );
};

export default OptimizedMicroservicesCanvas;