import React, { memo } from "react";
import {
  BaseEdge,
  EdgeLabelRenderer,
  EdgeProps,
  getBezierPath,
  // MarkerType,
} from "@xyflow/react";

const DataFlowEdge: React.FC<EdgeProps> = memo(({
  // id,
  sourceX,
  sourceY,
  targetX,
  targetY,
  sourcePosition,
  targetPosition,
  style = {},
  markerEnd,
  // data,
}) => {
  const [edgePath, labelX, labelY] = getBezierPath({
    sourceX,
    sourceY,
    sourcePosition,
    targetX,
    targetY,
    targetPosition,
  });

  return (
    <>
      <BaseEdge
        path={edgePath}
        markerEnd={markerEnd}
        style={{
          strokeWidth: 3,
          stroke: "#f59e0b",
          strokeDasharray: "12 6",
          ...style,
        }}
      />
      <EdgeLabelRenderer>
        <div
          style={{
            position: "absolute",
            transform: `translate(-50%, -50%) translate(${labelX}px,${labelY}px)`,
            fontSize: 10,
            fontWeight: 600,
            color: "#1f2937",
            backgroundColor: "white",
            padding: "2px 6px",
            borderRadius: "4px",
            border: "1px solid #d1d5db",
            pointerEvents: "all",
          }}
          className="nodrag nopan"
        >
          Data
        </div>
      </EdgeLabelRenderer>
    </>
  );
});

DataFlowEdge.displayName = 'DataFlowEdge';

export default DataFlowEdge;
