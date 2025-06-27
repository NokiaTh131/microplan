import React, { useState, useCallback } from "react";
import { Download, Copy, FileText, Code, Check } from "lucide-react";
import { useArchitectureStore } from "../../stores/architectureStore";
import { DockerComposeGenerator } from "../../utils/codeGenerators/dockerCompose";
import { KubernetesGenerator } from "../../utils/codeGenerators/kubernetes";

type GenerationType = "docker-compose" | "kubernetes" | "nginx";

const CodeGenerator: React.FC = () => {
  const { nodes, edges } = useArchitectureStore();
  const [selectedType, setSelectedType] =
    useState<GenerationType>("docker-compose");
  const [generatedCode, setGeneratedCode] = useState<string>("");
  const [copied, setCopied] = useState(false);

  const generateCode = useCallback(() => {
    if (nodes.length === 0) return;

    const generateNginxConfig = (): string => {
      const apiNodes = nodes.filter(
        (node) => (node.data as any)?.config?.type === "api"
      );

      let config = `# Nginx Configuration for Microservices\n`;
      config += `upstream backend {\n`;

      apiNodes.forEach((node) => {
        const config_data = (node.data as any)?.config;
        if (config_data) {
          const serviceName = config_data.name
            .toLowerCase()
            .replace(/[^a-z0-9-]/g, "-");
          config += `    server ${serviceName}:${config_data.port};\n`;
        }
      });

      config += `}\n\n`;
      config += `server {\n`;
      config += `    listen 80;\n`;
      config += `    server_name localhost;\n\n`;
      config += `    location / {\n`;
      config += `        proxy_pass http://backend;\n`;
      config += `        proxy_set_header Host $host;\n`;
      config += `        proxy_set_header X-Real-IP $remote_addr;\n`;
      config += `        proxy_set_header X-Forwarded-For $proxy_add_x_forwarded_for;\n`;
      config += `        proxy_set_header X-Forwarded-Proto $scheme;\n`;
      config += `    }\n\n`;

      // Add health check endpoint
      config += `    location /health {\n`;
      config += `        access_log off;\n`;
      config += `        return 200 "healthy\\n";\n`;
      config += `        add_header Content-Type text/plain;\n`;
      config += `    }\n`;
      config += `}\n`;

      return config;
    };

    let code = "";

    switch (selectedType) {
      case "docker-compose": {
        const dockerGenerator = new DockerComposeGenerator(nodes, edges);
        code = dockerGenerator.generate();
        break;
      }
      case "kubernetes": {
        const k8sGenerator = new KubernetesGenerator(nodes);
        code = k8sGenerator.generate();
        break;
      }
      case "nginx":
        code = generateNginxConfig();
        break;
    }

    setGeneratedCode(code);
  }, [selectedType, nodes, edges]);

  const copyToClipboard = async () => {
    try {
      await navigator.clipboard.writeText(generatedCode);
      setCopied(true);
      setTimeout(() => setCopied(false), 2000);
    } catch (err) {
      console.error("Failed to copy to clipboard:", err);
    }
  };

  const downloadFile = () => {
    const fileExtensions = {
      "docker-compose": "docker-compose.yml",
      kubernetes: "kubernetes.yaml",
      nginx: "nginx.conf",
    };

    const filename = fileExtensions[selectedType];
    const blob = new Blob([generatedCode], { type: "text/plain" });
    const url = URL.createObjectURL(blob);
    const a = document.createElement("a");
    a.href = url;
    a.download = filename;
    document.body.appendChild(a);
    a.click();
    document.body.removeChild(a);
    URL.revokeObjectURL(url);
  };

  React.useEffect(() => {
    generateCode();
  }, [selectedType, nodes, edges, generateCode]);

  if (nodes.length === 0) {
    return (
      <div className="bg-white/90 backdrop-blur-sm border-t border-slate-200 p-6">
        <div className="text-center text-slate-500">
          <Code className="w-12 h-12 mx-auto mb-4 opacity-50" />
          <h3 className="text-lg font-semibold mb-2">Code Generation</h3>
          <p className="text-sm">
            Add services to generate infrastructure code
          </p>
        </div>
      </div>
    );
  }

  return (
    <div className="bg-white/90 backdrop-blur-sm border-t border-slate-200 p-6 flex flex-col h-full">
      {/* Header */}
      <div className="flex items-center justify-between mb-6">
        <div className="flex items-center gap-2">
          <FileText className="w-5 h-5 text-blue-600" />
          <h3 className="text-lg font-bold text-slate-800">Code Generation</h3>
        </div>
        <div className="flex items-center gap-2">
          <button
            onClick={copyToClipboard}
            disabled={!generatedCode}
            className="flex items-center gap-2 px-3 py-2 bg-slate-500 text-white rounded-lg hover:bg-slate-600 transition-colors disabled:opacity-50"
          >
            {copied ? (
              <Check className="w-4 h-4" />
            ) : (
              <Copy className="w-4 h-4" />
            )}
            {copied ? "Copied!" : "Copy"}
          </button>
          <button
            onClick={downloadFile}
            disabled={!generatedCode}
            className="flex items-center gap-2 px-3 py-2 bg-blue-500 text-white rounded-lg hover:bg-blue-600 transition-colors disabled:opacity-50"
          >
            <Download className="w-4 h-4" />
            Download
          </button>
        </div>
      </div>

      {/* Type Selector */}
      <div className="flex gap-2 mb-4">
        {(
          [
            {
              key: "docker-compose",
              label: "Docker Compose",
              color: "bg-blue-500",
            },
            { key: "kubernetes", label: "Kubernetes", color: "bg-purple-500" },
            { key: "nginx", label: "Nginx Config", color: "bg-green-500" },
          ] as const
        ).map(({ key, label, color }) => (
          <button
            key={key}
            onClick={() => setSelectedType(key)}
            className={`px-4 py-2 rounded-lg text-sm font-medium transition-colors ${
              selectedType === key
                ? `${color} text-white`
                : "bg-slate-100 text-slate-700 hover:bg-slate-200"
            }`}
          >
            {label}
          </button>
        ))}
      </div>

      {/* Generated Code */}
      <div className="flex-1 bg-slate-900 rounded-lg p-4 overflow-hidden">
        <pre className="text-green-400 text-sm font-mono h-full overflow-auto whitespace-pre-wrap">
          {generatedCode || "Generating..."}
        </pre>
      </div>

      {/* Info */}
      <div className="mt-4 p-3 bg-blue-50 border border-blue-200 rounded-lg">
        <div className="text-xs text-blue-700">
          {selectedType === "docker-compose" && (
            <div>
              <strong>Docker Compose:</strong> Ready-to-use configuration with
              networking, volumes, and health checks. Run with{" "}
              <code className="bg-blue-100 px-1 rounded">
                docker-compose up
              </code>
            </div>
          )}
          {selectedType === "kubernetes" && (
            <div>
              <strong>Kubernetes:</strong> Complete manifests including
              deployments, services, and ingress. Apply with{" "}
              <code className="bg-blue-100 px-1 rounded">kubectl apply -f</code>
            </div>
          )}
          {selectedType === "nginx" && (
            <div>
              <strong>Nginx:</strong> Load balancer configuration for API
              services. Use as{" "}
              <code className="bg-blue-100 px-1 rounded">nginx.conf</code>
            </div>
          )}
        </div>
      </div>
    </div>
  );
};

export default CodeGenerator;
