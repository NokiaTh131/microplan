import React from "react";
import { Handle, Position, NodeProps } from "@xyflow/react";
import {
  Server,
  Database,
  Globe,
  Settings,
  Trash2,
  Shield,
  Router,
  Network,
  GitBranch,
  Code,
  Coffee,
  Zap,
  Cpu,
  Chrome,
  TreePine,
  Gauge,
  Container,
  TrendingUp,
  FileSearch,
  MessageSquare,
  BarChart3,
  Activity,
  Eye,
  FileText,
  Cloud,
  CloudSnow,
  CreditCard,
  Mail,
  Phone,
  HardDrive,
  Workflow,
  Lock,
} from "lucide-react";
import { useArchitectureStore } from "../../stores/architectureStore";

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

interface ServiceNodeData {
  config: ServiceConfig;
  isSelected?: boolean;
}

const ServiceNode: React.FC<NodeProps> = ({ id, data, selected }) => {
  const { selectNode, deleteNode } = useArchitectureStore();
  const { config } = data as unknown as ServiceNodeData;

  const getIcon = () => {
    // First check for specific tech stack icons
    switch (config.techStack.toLowerCase()) {
      // API Gateways & Load Balancers
      case "nginx":
        return <Router className="w-5 h-5 text-orange-500" />;
      case "traefik":
        return <Network className="w-5 h-5 text-blue-500" />;
      case "envoy":
        return <GitBranch className="w-5 h-5 text-purple-500" />;
      case "haproxy":
        return <Workflow className="w-5 h-5 text-red-500" />;

      // Programming Languages & Frameworks
      case "express":
        return <Code className="w-5 h-5 text-green-600" />;
      case "spring-boot":
        return <Coffee className="w-5 h-5 text-green-700" />;
      case "fastapi":
        return <Zap className="w-5 h-5 text-teal-500" />;
      case "go-gin":
        return <Cpu className="w-5 h-5 text-cyan-500" />;
      case "dotnet":
        return <Chrome className="w-5 h-5 text-blue-600" />;
      case "rust-actix":
        return <Shield className="w-5 h-5 text-orange-600" />;

      // Databases
      case "postgresql":
        return <Database className="w-5 h-5 text-blue-700" />;
      case "mysql":
        return <Database className="w-5 h-5 text-orange-500" />;
      case "mongodb":
        return <TreePine className="w-5 h-5 text-green-600" />;
      case "redis":
        return <Gauge className="w-5 h-5 text-red-500" />;
      case "cassandra":
        return <Container className="w-5 h-5 text-purple-600" />;
      case "neo4j":
        return <GitBranch className="w-5 h-5 text-blue-500" />;
      case "influxdb":
        return <TrendingUp className="w-5 h-5 text-purple-500" />;
      case "elasticsearch":
        return <FileSearch className="w-5 h-5 text-yellow-600" />;

      // Message Queues & Streaming
      case "rabbitmq":
        return <MessageSquare className="w-5 h-5 text-orange-500" />;
      case "kafka":
        return <BarChart3 className="w-5 h-5 text-slate-700" />;
      case "pulsar":
        return <Activity className="w-5 h-5 text-blue-600" />;
      case "nats":
        return <Zap className="w-5 h-5 text-green-500" />;

      // Monitoring & Observability
      case "prometheus":
        return <Activity className="w-5 h-5 text-orange-500" />;
      case "grafana":
        return <BarChart3 className="w-5 h-5 text-orange-600" />;
      case "jaeger":
        return <Eye className="w-5 h-5 text-blue-500" />;
      case "zipkin":
        return <Eye className="w-5 h-5 text-green-500" />;
      case "elastic-stack":
        return <FileText className="w-5 h-5 text-yellow-500" />;

      // Cloud Services
      case "aws-s3":
        return <Cloud className="w-5 h-5 text-orange-500" />;
      case "aws-rds":
        return <Database className="w-5 h-5 text-orange-500" />;
      case "aws-lambda":
        return <Zap className="w-5 h-5 text-orange-500" />;
      case "azure-blob":
        return <CloudSnow className="w-5 h-5 text-blue-500" />;
      case "gcp-firestore":
        return <Database className="w-5 h-5 text-blue-500" />;

      // External APIs
      case "stripe":
        return <CreditCard className="w-5 h-5 text-purple-500" />;
      case "sendgrid":
        return <Mail className="w-5 h-5 text-blue-500" />;
      case "twilio":
        return <Phone className="w-5 h-5 text-red-500" />;

      default:
        // Fallback to service type icons
        switch (config.type) {
          case "api":
            return <Server className="w-5 h-5 text-blue-500" />;
          case "auth":
            return <Lock className="w-5 h-5 text-green-500" />;
          case "gateway":
            return <Router className="w-5 h-5 text-orange-500" />;
          case "database":
            return <Database className="w-5 h-5 text-green-500" />;
          case "cache":
            return <Gauge className="w-5 h-5 text-red-500" />;
          case "queue":
            return <MessageSquare className="w-5 h-5 text-purple-500" />;
          case "search":
            return <FileSearch className="w-5 h-5 text-yellow-600" />;
          case "monitoring":
            return <Activity className="w-5 h-5 text-cyan-500" />;
          case "analytics":
            return <BarChart3 className="w-5 h-5 text-indigo-500" />;
          case "storage":
            return <HardDrive className="w-5 h-5 text-slate-500" />;
          case "cdn":
            return <Network className="w-5 h-5 text-blue-400" />;
          case "ml":
            return <Cpu className="w-5 h-5 text-pink-500" />;
          case "external":
            return <Globe className="w-5 h-5 text-purple-500" />;
          case "infrastructure":
            return <Settings className="w-5 h-5 text-orange-500" />;
          default:
            return <Server className="w-5 h-5" />;
        }
    }
  };

  const handleClick = () => {
    selectNode({
      id,
      type: "serviceNode",
      position: { x: 0, y: 0 },
      data: data as any,
    });
  };

  const handleDelete = (e: React.MouseEvent) => {
    e.stopPropagation();
    deleteNode(id);
  };

  return (
    <div
      className={`group relative bg-white rounded-lg border border-gray-500 w-20 h-20 ${
        selected ? "ring-6 ring-gray-300/80 ring-offset" : ""
      }`}
      onClick={handleClick}
    >
      {/* Left Handle */}
      <Handle
        type="target"
        position={Position.Left}
        className="!bg-gray-400 hover:!bg-red-400 hover:!border-red-400 transition-colors !border-gray-400"
        style={{
          width: "6px",
          height: "12px",
          borderRadius: "0",
        }}
      />

      {/* Icon Container */}
      <div className="flex items-center justify-center w-full h-full">
        <div className="w-8 h-8 flex items-center justify-center">
          {getIcon()}
        </div>
      </div>

      {/* Delete Button - Only show on hover */}
      <button
        onClick={handleDelete}
        className="absolute -top-2 -right-2 w-6 h-6 bg-red-500 hover:bg-red-600 text-white rounded-full flex items-center justify-center opacity-0 group-hover:opacity-100 transition-all duration-200 shadow-md"
      >
        <Trash2 className="w-3 h-3" />
      </button>

      {/* Node Label - Show on hover */}
      <div className="absolute -bottom-7 left-1/2 -translate-x-1/2">
        <div className="text-gray-900 text-xs px-2 py-1 rounded whitespace-nowrap">
          {config.name}
        </div>
      </div>

      {/* Bottom Handle */}
      <Handle
        type="source"
        position={Position.Right}
        className="!bg-gray-400 !border-gray-400 hover:!bg-red-400 hover:!border-red-400 transition-colors rounded-full"
        style={{
          width: "12px",
          height: "12px",
        }}
      />
    </div>
  );
};

export default ServiceNode;