import { Edge } from '@xyflow/react';

export type CommunicationType = 'sync' | 'async' | 'data-flow';

export interface EdgeData extends Record<string, unknown> {
  communicationType: CommunicationType;
  protocol?: string;
  description?: string;
}

export type ServiceEdge = Edge<EdgeData>;