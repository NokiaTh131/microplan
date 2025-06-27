import { memo } from 'react';
import {
  EdgeProps,
  BaseEdge,
  EdgeLabelRenderer,
  getBezierPath,
} from "@xyflow/react";

const TlsAsyncEdge = memo(({
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
          stroke: "#059669", // Darker green for TLS async
          strokeWidth: 2,
          strokeDasharray: "8 4", // Dashed line for async
        }}
      />
      <EdgeLabelRenderer>
        <div
          style={{
            position: "absolute",
            transform: `translate(-50%, -50%) translate(${labelX}px,${labelY}px)`,
            fontSize: 10,
            fontWeight: "bold",
            color: "#064e3b",
            backgroundColor: "#a7f3d0",
            padding: "2px 6px",
            borderRadius: "4px",
            border: "1px solid #059669",
            pointerEvents: "all",
          }}
          className="nodrag nopan"
        >
          TLS Queue
        </div>
      </EdgeLabelRenderer>
    </>
  );
});

TlsAsyncEdge.displayName = 'TlsAsyncEdge';

export { TlsAsyncEdge };
