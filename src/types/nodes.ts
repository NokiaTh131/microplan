import { Node } from '@xyflow/react';

export type ServiceType = 'api' | 'database' | 'external' | 'infrastructure';

export type TechStack = 'express' | 'spring-boot' | 'fastapi' | 'next.js' | 'postgresql' | 'mongodb' | 'redis' | 'nginx' | 'kafka';

export interface ServiceConfig {
  name: string;
  type: ServiceType;
  techStack: TechStack;
  port: number;
  healthCheckPath?: string;
  cpu: number;
  memory: number;
  replicas: number;
  environment: Record<string, string>;
}

export interface ServiceNodeData extends Record<string, unknown> {
  config: ServiceConfig;
  isSelected?: boolean;
}

export type ServiceNode = Node<ServiceNodeData>;