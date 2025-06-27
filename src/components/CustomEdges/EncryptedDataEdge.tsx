import { memo } from 'react';
import {
  EdgeProps,
  BaseEdge,
  EdgeLabelRenderer,
  getBezierPath,
} from "@xyflow/react";

const EncryptedDataEdge = memo(({
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
          stroke: "#047857", // Deep green for encrypted data
          strokeWidth: 3,
          strokeDasharray: "12 6", // Longer dashes for data flow
        }}
      />
      <EdgeLabelRenderer>
        <div
          style={{
            position: "absolute",
            transform: `translate(-50%, -50%) translate(${labelX}px,${labelY}px)`,
            fontSize: 10,
            fontWeight: "bold",
            color: "#022c22",
            backgroundColor: "#6ee7b7",
            padding: "2px 6px",
            borderRadius: "4px",
            border: "1px solid #047857",
            pointerEvents: "all",
          }}
          className="nodrag nopan"
        >
          Encrypted Data
        </div>
      </EdgeLabelRenderer>
    </>
  );
});

EncryptedDataEdge.displayName = 'EncryptedDataEdge';

export { EncryptedDataEdge };
