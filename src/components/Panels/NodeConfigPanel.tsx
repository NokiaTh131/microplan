import React, { useState } from "react";
import { useForm } from "react-hook-form";
import {
  X,
  Save,
  Settings,
  Cpu,
  HardDrive,
  Copy,
  Plus,
  Trash2,
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

const NodeConfigPanel: React.FC = () => {
  const { selectedNode, updateNode, selectNode } = useArchitectureStore();
  const [envVars, setEnvVars] = useState<Array<{ key: string; value: string }>>(
    []
  );

  const { register, handleSubmit, setValue } = useForm<ServiceConfig>();

  React.useEffect(() => {
    if (selectedNode?.data) {
      const config = (selectedNode.data as any).config;
      setValue("name", config.name);
      setValue("type", config.type);
      setValue("techStack", config.techStack);
      setValue("port", config.port);
      setValue("healthCheckPath", config.healthCheckPath);
      setValue("cpu", config.cpu);
      setValue("memory", config.memory);
      setValue("replicas", config.replicas);

      // Convert environment object to array for editing
      const envArray = Object.entries(config.environment || {}).map(
        ([key, value]) => ({ key, value: String(value) })
      );
      setEnvVars(envArray);
    }
  }, [selectedNode, setValue]);

  if (!selectedNode) {
    return (
      <div className="bg-white/90 backdrop-blur-sm border-l border-slate-200 w-80 p-6 shadow-lg">
        <div className="text-center text-slate-500 mt-12">
          <Settings className="w-12 h-12 mx-auto mb-4 opacity-50" />
          <h3 className="text-sm font-semibold mb-2">Node Configuration</h3>
          <p className="text-xs">
            Select a service node to configure its properties
          </p>
        </div>
      </div>
    );
  }

  const onSubmit = (data: ServiceConfig) => {
    // Convert env vars array back to object
    const environment = envVars.reduce((acc, { key, value }) => {
      if (key.trim()) acc[key] = value;
      return acc;
    }, {} as Record<string, string>);

    updateNode(selectedNode.id, { ...data, environment });
  };

  const addEnvVar = () => {
    setEnvVars([...envVars, { key: "", value: "" }]);
  };

  const updateEnvVar = (
    index: number,
    field: "key" | "value",
    value: string
  ) => {
    const updated = [...envVars];
    updated[index][field] = value;
    setEnvVars(updated);
  };

  const removeEnvVar = (index: number) => {
    setEnvVars(envVars.filter((_, i) => i !== index));
  };

  // const config = (selectedNode.data as any).config;

  return (
    <div className="bg-white/90 backdrop-blur-sm border-l border-slate-200 w-full shadow-lg flex flex-col h-full">
      {/* Header */}
      <div className="p-6 border-b border-slate-200">
        <div className="flex items-center justify-between mb-4">
          <h3 className="text-sm font-bold text-slate-800">
            Configure Service
          </h3>
          <button
            onClick={() => selectNode(null)}
            className="p-2 hover:bg-slate-100 rounded-lg transition-colors"
          >
            <X className="w-5 h-5 text-slate-600" />
          </button>
        </div>
        <div className="text-xs text-slate-600">
          Node ID:{" "}
          <span className="font-mono text-xs">
            #{selectedNode.id.slice(-8)}
          </span>
        </div>
      </div>

      {/* Form */}
      <div className="flex-1 overflow-y-auto p-6">
        <form onSubmit={handleSubmit(onSubmit)} className="space-y-6">
          {/* Basic Info */}
          <div className="space-y-4">
            <h4 className="text-xs font-semibold text-slate-700 border-b border-slate-200 pb-2">
              Basic Information
            </h4>

            <div>
              <label className="block text-xs font-medium text-slate-700 mb-2">
                Service Name
              </label>
              <input
                {...register("name", { required: true })}
                className="w-full px-3 py-2 border border-slate-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-blue-500"
                placeholder="Enter service name"
              />
            </div>

            <div>
              <label className="block text-xs font-medium text-slate-700 mb-2">
                Type
              </label>
              <select
                {...register("type", { required: true })}
                className="w-full px-3 py-2 border border-slate-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-blue-500"
              >
                <option value="api">API Service</option>
                <option value="auth">Authentication</option>
                <option value="gateway">API Gateway</option>
                <option value="database">Database</option>
                <option value="cache">Cache</option>
                <option value="queue">Message Queue</option>
                <option value="search">Search Engine</option>
                <option value="monitoring">Monitoring</option>
                <option value="analytics">Analytics</option>
                <option value="storage">Storage</option>
                <option value="cdn">CDN</option>
                <option value="ml">Machine Learning</option>
                <option value="external">External Service</option>
                <option value="infrastructure">Infrastructure</option>
              </select>
            </div>

            <div>
              <label className="block text-xs font-medium text-slate-700 mb-2">
                Tech Stack
              </label>
              <input
                {...register("techStack", { required: true })}
                className="w-full px-3 py-2 border border-slate-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-blue-500"
                placeholder="e.g., express, postgresql, redis"
              />
            </div>

            <div>
              <label className="block text-xs font-medium text-slate-700 mb-2">
                Port
              </label>
              <input
                {...register("port", { required: true, valueAsNumber: true })}
                type="number"
                className="w-full px-3 py-2 border border-slate-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-blue-500"
                placeholder="3000"
              />
            </div>

            <div>
              <label className="block text-xs font-medium text-slate-700 mb-2">
                Health Check Path
              </label>
              <input
                {...register("healthCheckPath")}
                className="w-full px-3 py-2 border border-slate-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-blue-500"
                placeholder="/health"
              />
            </div>
          </div>

          {/* Resources */}
          <div className="space-y-4">
            <h4 className="text-xs font-semibold text-slate-700 border-b border-slate-200 pb-2 flex items-center gap-2">
              <Cpu className="w-4 h-4" />
              Resource Requirements
            </h4>

            <div className="grid grid-cols-2 gap-4">
              <div>
                <label className="block text-xs font-medium text-slate-700 mb-2">
                  <div className="flex items-center gap-1">
                    <Cpu className="w-3 h-3" />
                    CPU Cores
                  </div>
                </label>
                <input
                  {...register("cpu", { required: true, valueAsNumber: true })}
                  type="number"
                  step="0.1"
                  className="w-full px-3 py-2 border border-slate-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-blue-500"
                  placeholder="1"
                />
              </div>

              <div>
                <label className="block text-xs font-medium text-slate-700 mb-2">
                  <div className="flex items-center gap-1">
                    <HardDrive className="w-3 h-3" />
                    Memory (MB)
                  </div>
                </label>
                <input
                  {...register("memory", {
                    required: true,
                    valueAsNumber: true,
                  })}
                  type="number"
                  className="w-full px-3 py-2 border border-slate-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-blue-500"
                  placeholder="1024"
                />
              </div>
            </div>

            <div>
              <label className="block text-xs font-medium text-slate-700 mb-2">
                <div className="flex items-center gap-1">
                  <Copy className="w-3 h-3" />
                  Replicas
                </div>
              </label>
              <input
                {...register("replicas", {
                  required: true,
                  valueAsNumber: true,
                })}
                type="number"
                min="1"
                className="w-full px-3 py-2 border border-slate-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-blue-500"
                placeholder="1"
              />
            </div>
          </div>

          {/* Environment Variables */}
          <div className="space-y-4">
            <div className="flex items-center justify-between">
              <h4 className="text-xs font-semibold text-slate-700 border-b border-slate-200 pb-2">
                Environment Variables
              </h4>
              <button
                type="button"
                onClick={addEnvVar}
                className="flex items-center gap-1 px-3 py-1 bg-blue-500 text-white rounded-lg text-xs hover:bg-blue-600 transition-colors"
              >
                <Plus className="w-3 h-3" />
                Add
              </button>
            </div>

            <div className="space-y-2 max-h-48 overflow-y-auto">
              {envVars.map((envVar, index) => (
                <div key={index} className="flex gap-2 items-center">
                  <input
                    value={envVar.key}
                    onChange={(e) => updateEnvVar(index, "key", e.target.value)}
                    placeholder="KEY"
                    className="flex-1 px-2 py-1 border border-slate-300 rounded text-xs font-mono"
                  />
                  <input
                    value={envVar.value}
                    onChange={(e) =>
                      updateEnvVar(index, "value", e.target.value)
                    }
                    placeholder="value"
                    className="flex-1 px-2 py-1 border border-slate-300 rounded text-xs font-mono"
                  />
                  <button
                    type="button"
                    onClick={() => removeEnvVar(index)}
                    className="p-1 text-red-500 hover:bg-red-50 rounded"
                  >
                    <Trash2 className="w-3 h-3" />
                  </button>
                </div>
              ))}
            </div>
          </div>

          {/* Save Button */}
          <div className="pt-4 border-t border-slate-200">
            <button
              type="submit"
              className="w-full flex items-center justify-center gap-2 bg-blue-500 text-white py-3 rounded-lg hover:bg-blue-600 transition-colors font-medium"
            >
              <Save className="w-4 h-4" />
              Save Configuration
            </button>
          </div>
        </form>
      </div>
    </div>
  );
};

export default NodeConfigPanel;
