import React, { useState, useMemo } from "react";
import {
  Server,
  Database,
  Settings,
  Layers,
  Sparkles,
  Search,
  Globe,
  Zap,
  MessageSquare,
  BarChart3,
  Shield,
  HardDrive,
  Cloud,
  CreditCard,
  FileSearch,
  CloudSnow,
  Gauge,
  Activity,
  FileText,
  Mail,
  Phone,
  TreePine,
  TrendingUp,
  Cpu,
  Network,
  Router,
  Container,
  Eye,
  GitBranch,
  Coffee,
  Chrome,
  Code,
  Workflow,
} from "lucide-react";
import {
  serviceTemplates,
  serviceCategories,
} from "../../data/serviceTemplates";
import { useArchitectureStore } from "../../stores/architectureStore";

interface LocalServiceConfig {
  description: any;
  name: string;
  type: "api" | "database" | "external" | "infrastructure";
  techStack: string;
  port: number;
  healthCheckPath?: string;
  cpu: number;
  memory: number;
  replicas: number;
  environment: Record<string, string>;
}

interface PaletteItem {
  id: string;
  label: string;
  icon: React.ReactNode;
  color: string;
  template: LocalServiceConfig;
  category: string;
}

const NodePalette: React.FC = () => {
  const { addNode } = useArchitectureStore();
  const [searchTerm, setSearchTerm] = useState("");
  const [selectedCategory, setSelectedCategory] = useState("All");

  const getCategoryIcon = (category: string) => {
    switch (category) {
      case "Gateway":
        return <Settings className="w-3 h-3" />;
      case "Authentication":
        return <Shield className="w-3 h-3" />;
      case "Core Services":
        return <Server className="w-3 h-3" />;
      case "Communication":
        return <MessageSquare className="w-3 h-3" />;
      case "Financial":
        return <Zap className="w-3 h-3" />;
      case "SQL Database":
      case "NoSQL Database":
      case "Cache":
      case "Graph Database":
      case "Time Series DB":
        return <Database className="w-3 h-3" />;
      case "Message Queue":
      case "Streaming":
        return <BarChart3 className="w-3 h-3" />;
      case "Monitoring":
      case "Tracing":
      case "Logging":
        return <BarChart3 className="w-3 h-3" />;
      case "Storage":
      case "Serverless":
        return <HardDrive className="w-3 h-3" />;
      case "External":
        return <Globe className="w-3 h-3" />;
      default:
        return <Sparkles className="w-3 h-3" />;
    }
  };

  const getServiceIcon = (techStack: string, type: string) => {
    // Specific tech stack icons
    switch (techStack.toLowerCase()) {
      // API Gateways & Load Balancers
      case "nginx":
        return <Router className="w-4 h-4" />;
      case "traefik":
        return <Network className="w-4 h-4" />;
      case "envoy":
        return <GitBranch className="w-4 h-4" />;
      case "haproxy":
        return <Workflow className="w-4 h-4" />;

      // Programming Languages & Frameworks
      case "express":
        return <Code className="w-4 h-4" />;
      case "spring-boot":
        return <Coffee className="w-4 h-4" />;
      case "fastapi":
        return <Zap className="w-4 h-4" />;
      case "go-gin":
        return <Cpu className="w-4 h-4" />;
      case "dotnet":
        return <Chrome className="w-4 h-4" />;
      case "rust-actix":
        return <Shield className="w-4 h-4" />;

      // Databases
      case "postgresql":
        return <Database className="w-4 h-4" />;
      case "mysql":
        return <Database className="w-4 h-4" />;
      case "mongodb":
        return <TreePine className="w-4 h-4" />;
      case "redis":
        return <Gauge className="w-4 h-4" />;
      case "cassandra":
        return <Container className="w-4 h-4" />;
      case "neo4j":
        return <GitBranch className="w-4 h-4" />;
      case "influxdb":
        return <TrendingUp className="w-4 h-4" />;
      case "elasticsearch":
        return <FileSearch className="w-4 h-4" />;

      // Message Queues & Streaming
      case "rabbitmq":
        return <MessageSquare className="w-4 h-4" />;
      case "kafka":
        return <BarChart3 className="w-4 h-4" />;
      case "pulsar":
        return <Activity className="w-4 h-4" />;
      case "nats":
        return <Zap className="w-4 h-4" />;

      // Monitoring & Observability
      case "prometheus":
        return <Activity className="w-4 h-4" />;
      case "grafana":
        return <BarChart3 className="w-4 h-4" />;
      case "jaeger":
        return <Eye className="w-4 h-4" />;
      case "zipkin":
        return <Eye className="w-4 h-4" />;
      case "elastic-stack":
        return <FileText className="w-4 h-4" />;

      // Cloud Services
      case "aws-s3":
        return <Cloud className="w-4 h-4" />;
      case "aws-rds":
        return <Database className="w-4 h-4" />;
      case "aws-lambda":
        return <Zap className="w-4 h-4" />;
      case "azure-blob":
        return <CloudSnow className="w-4 h-4" />;
      case "gcp-firestore":
        return <Database className="w-4 h-4" />;

      // External APIs
      case "stripe":
        return <CreditCard className="w-4 h-4" />;
      case "sendgrid":
        return <Mail className="w-4 h-4" />;
      case "twilio":
        return <Phone className="w-4 h-4" />;

      default:
        // Fallback to type-based icons
        switch (type) {
          case "api":
            return <Server className="w-4 h-4" />;
          case "database":
            return <Database className="w-4 h-4" />;
          case "external":
            return <Globe className="w-4 h-4" />;
          case "infrastructure":
            return <Settings className="w-4 h-4" />;
          default:
            return <Server className="w-4 h-4" />;
        }
    }
  };

  const getServiceColor = (type: string) => {
    switch (type) {
      case "api":
        return "bg-blue-600 text-white";
      case "database":
        return "bg-green-600 text-white";
      case "external":
        return "bg-purple-600 text-white";
      case "infrastructure":
        return "bg-gray-700 text-white";
      case "cache":
        return "bg-red-600 text-white";
      case "queue":
        return "bg-orange-600 text-white";
      case "auth":
        return "bg-indigo-600 text-white";
      case "gateway":
        return "bg-emerald-700 text-white";
      case "monitoring":
        return "bg-yellow-600 text-white";
      case "storage":
        return "bg-cyan-600 text-white";
      case "search":
        return "bg-violet-600 text-white";
      case "analytics":
        return "bg-pink-600 text-white";
      case "ml":
        return "bg-slate-600 text-white";
      case "cdn":
        return "bg-teal-600 text-white";
      default:
        return "bg-slate-600 text-white";
    }
  };

  const paletteItems: PaletteItem[] = useMemo(() => {
    // Add Custom Node as a special entry
    const serviceItems = Object.entries(serviceTemplates).map(
      ([id, template]) => ({
        id,
        label: template.name,
        icon: getServiceIcon(template.techStack, template.type),
        color: getServiceColor(template.type),
        template: template as LocalServiceConfig,
        category: template.category || "Other",
      })
    );

    return [...serviceItems];
  }, []);

  const filteredItems = useMemo(() => {
    return paletteItems.filter((item) => {
      const matchesSearch =
        searchTerm === "" ||
        item.label.toLowerCase().includes(searchTerm.toLowerCase()) ||
        item.template.techStack
          .toLowerCase()
          .includes(searchTerm.toLowerCase()) ||
        (item.template.description
          ?.toLowerCase()
          .includes(searchTerm.toLowerCase()) ??
          false);

      const matchesCategory =
        selectedCategory === "All" || item.category === selectedCategory;

      return matchesSearch && matchesCategory;
    });
  }, [paletteItems, searchTerm, selectedCategory]);

  const handleDragStart = (
    event: React.DragEvent,
    template: LocalServiceConfig
  ) => {
    event.dataTransfer.setData(
      "application/reactflow",
      JSON.stringify(template)
    );
    event.dataTransfer.effectAllowed = "move";
  };

  const handleClick = (template: LocalServiceConfig) => {
    const position = {
      x: Math.random() * 400 + 100,
      y: Math.random() * 300 + 100,
    };
    addNode(template, position);
  };

  const groupedItems = filteredItems.reduce((acc, item) => {
    if (!acc[item.category]) {
      acc[item.category] = [];
    }
    acc[item.category].push(item);
    return acc;
  }, {} as Record<string, PaletteItem[]>);

  return (
    <div className="bg-white/90 backdrop-blur-sm border-r border-slate-200 w-64 shadow-lg flex flex-col h-full overflow-y-auto">
      <div className="p-4 flex-1 flex flex-col">
        {/* Header */}
        <div className="mb-4">
          <div className="flex items-center gap-2 mb-2">
            <div className="p-1.5 bg-blue-600 rounded-lg">
              <Layers className="w-4 h-4 text-white" />
            </div>
            <h3 className="text-sm font-bold text-slate-800">
              Services ({filteredItems.length})
            </h3>
          </div>
          <p className="text-xs text-slate-600">Drag & drop or click to add</p>
        </div>

        {/* Search */}
        <div className="mb-3">
          <div className="relative">
            <Search className="absolute left-2 top-1/2 transform -translate-y-1/2 w-3 h-3 text-slate-400" />
            <input
              type="text"
              placeholder="Search services..."
              value={searchTerm}
              onChange={(e) => setSearchTerm(e.target.value)}
              className="w-full pl-7 pr-3 py-1.5 text-xs border border-slate-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-blue-500"
            />
          </div>
        </div>

        {/* Category Filter */}
        <div className="mb-4">
          <select
            value={selectedCategory}
            onChange={(e) => setSelectedCategory(e.target.value)}
            className="w-full px-2 py-1.5 text-xs border border-slate-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-blue-500"
          >
            <option value="All">All Categories</option>
            {serviceCategories.map((category) => (
              <option key={category} value={category}>
                {category}
              </option>
            ))}
          </select>
        </div>

        {/* Service Groups */}
        <div className="flex-1 overflow-y-auto">
          <div className="space-y-4">
            {Object.entries(groupedItems).map(([category, items]) => (
              <div key={category}>
                <h4 className="text-xs font-medium text-slate-700 mb-2 flex items-center gap-1">
                  {getCategoryIcon(category)}
                  {category} ({items.length})
                </h4>
                <div className="space-y-1.5">
                  {items.map((item) => (
                    <div
                      key={item.id}
                      draggable
                      onDragStart={(event) =>
                        handleDragStart(event, item.template)
                      }
                      onClick={() => handleClick(item.template)}
                      className={`group relative flex items-center gap-2 p-2.5 rounded-lg cursor-pointer transition-all duration-300 ${item.color} overflow-hidden hover:opacity-90`}
                    >
                      {/* Hover Background */}
                      <div className="absolute inset-0 bg-white/10 opacity-0 group-hover:opacity-100 transition-opacity duration-300" />

                      {/* Icon */}
                      <div className="relative z-10 p-1 bg-white/20 rounded-md backdrop-blur-sm">
                        {item.icon}
                      </div>

                      {/* Content */}
                      <div className="relative z-10 flex-1 min-w-0">
                        <span className="text-xs font-medium block truncate">
                          {item.label}
                        </span>
                        <span className="text-xs opacity-90 truncate block">
                          {item.template.techStack}
                        </span>
                      </div>

                      {/* Drag Indicator */}
                      <div className="relative z-10 opacity-60 group-hover:opacity-100 transition-opacity">
                        <div className="w-0.5 h-3 bg-white/40 rounded-full" />
                      </div>
                    </div>
                  ))}
                </div>
              </div>
            ))}
          </div>
        </div>
      </div>

      {/* Help Text */}
      <div className="p-4 bg-slate-50 border-t border-slate-200">
        <div className="text-xs text-slate-600 space-y-1.5">
          <div className="flex items-center gap-2">
            <div className="w-1.5 h-1.5 bg-blue-500 rounded-full" />
            <span>
              <strong>Click:</strong> Add randomly
            </span>
          </div>
          <div className="flex items-center gap-2">
            <div className="w-1.5 h-1.5 bg-green-500 rounded-full" />
            <span>
              <strong>Drag:</strong> Place precisely
            </span>
          </div>
        </div>
      </div>
    </div>
  );
};

export default NodePalette;
