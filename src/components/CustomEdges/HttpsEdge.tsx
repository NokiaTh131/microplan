import { memo } from 'react';
import {
  EdgeProps,
  BaseEdge,
  EdgeLabelRenderer,
  getBezierPath,
} from "@xyflow/react";

const HttpsEdge = memo(({
  sourceX,
  sourceY,
  targetX,
  targetY,
  sourcePosition,
  targetPosition,
  style = {},
  markerEnd,
}: EdgeProps) => {
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
          ...style,
          stroke: "#10b981", // Green color for secure connection
          strokeWidth: 2,
          strokeDasharray: "0", // Solid line for HTTPS
        }}
      />
      <EdgeLabelRenderer>
        <div
          style={{
            position: "absolute",
            transform: `translate(-50%, -50%) translate(${labelX}px,${labelY}px)`,
            fontSize: 10,
            fontWeight: "bold",
            color: "#065f46",
            backgroundColor: "#d1fae5",
            padding: "2px 6px",
            borderRadius: "4px",
            border: "1px solid #10b981",
            pointerEvents: "all",
          }}
          className="nodrag nopan"
        >
          HTTPS
        </div>
      </EdgeLabelRenderer>
    </>
  );
});

HttpsEdge.displayName = 'HttpsEdge';

export { HttpsEdge };
