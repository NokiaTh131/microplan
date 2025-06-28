import React, { useState } from "react";
import {
  Zap,
  MessageCircle,
  Database,
  Trash2,
  Shield,
  Lock,
  ShieldCheck,
  ChevronDown,
  ChevronUp,
} from "lucide-react";
import { useArchitectureStore } from "../../stores/architectureStore";
import { CommunicationType } from "../../types/edges";

const EdgeSelector: React.FC = () => {
  const { selectedEdgeType, setSelectedEdgeType, selectedEdge, deleteEdge } =
    useArchitectureStore();
  const [isSecureExpanded, setIsSecureExpanded] = useState(true);
  const [isStandardExpanded, setIsStandardExpanded] = useState(false);

  const edgeTypes: Array<{
    id: CommunicationType;
    label: string;
    icon: React.ReactNode;
    color: string;
    description: string;
    category: string;
  }> = [
    {
      id: "sync",
      label: "HTTP",
      icon: <Zap className="w-4 h-4" />,
      color: "bg-blue-500",
      description: "Synchronous HTTP API calls",
      category: "Unencrypted",
    },
    {
      id: "async",
      label: "Queue",
      icon: <MessageCircle className="w-4 h-4" />,
      color: "bg-purple-500",
      description: "Asynchronous message queues",
      category: "Unencrypted",
    },
    {
      id: "data-flow",
      label: "Data",
      icon: <Database className="w-4 h-4" />,
      color: "bg-orange-500",
      description: "Data flow connections",
      category: "Unencrypted",
    },
    {
      id: "https",
      label: "HTTPS",
      icon: <Shield className="w-4 h-4" />,
      color: "bg-green-600",
      description: "Secure HTTPS API calls",
      category: "Encrypted",
    },
    {
      id: "tls-async",
      label: "TLS Queue",
      icon: <Lock className="w-4 h-4" />,
      color: "bg-green-700",
      description: "Encrypted async messaging",
      category: "Encrypted",
    },
    {
      id: "encrypted-data",
      label: "Encrypted Data",
      icon: <ShieldCheck className="w-4 h-4" />,
      color: "bg-green-800",
      description: "Encrypted data pipelines",
      category: "Encrypted",
    },
  ];

  const handleEdgeTypeSelect = (edgeType: CommunicationType) => {
    setSelectedEdgeType(edgeType);
  };

  const handleDeleteEdge = () => {
    if (selectedEdge) {
      deleteEdge(selectedEdge.id);
    }
  };

  const unencryptedTypes = edgeTypes.filter(
    (type) => type.category === "Unencrypted"
  );
  const encryptedTypes = edgeTypes.filter(
    (type) => type.category === "Encrypted"
  );

  return (
    <div className="bg-white/95 backdrop-blur-sm border border-slate-200 rounded-xl shadow-lg p-3 max-w-xs">
      <div className="mb-3">
        <div className="flex items-center justify-between mb-3">
          <h3 className="text-xs font-semibold text-slate-700 flex items-center gap-2">
            <div className="w-1.5 h-1.5 bg-gradient-to-r from-blue-500 to-purple-500 rounded-full"></div>
            Connections
          </h3>
        </div>

        {/* Encrypted Connections */}
        <div className="mb-3">
          <button
            onClick={() => setIsSecureExpanded(!isSecureExpanded)}
            className="w-full flex items-center justify-between gap-1 mb-2 p-1.5 rounded-md bg-gradient-to-r from-green-50 to-emerald-50 border border-green-200 hover:from-green-100 hover:to-emerald-100 transition-all duration-200"
          >
            <div className="flex items-center gap-1">
              <Shield className="w-3 h-3 text-green-600" />
              <h4 className="text-xs font-medium text-green-700">Secure</h4>
              <span className="text-xs bg-green-100 text-green-600 px-1 py-0.5 rounded-full">
                {encryptedTypes.length}
              </span>
            </div>
            {isSecureExpanded ? (
              <ChevronUp className="w-3 h-3 text-green-600" />
            ) : (
              <ChevronDown className="w-3 h-3 text-green-600" />
            )}
          </button>

          <div
            className={`overflow-hidden transition-all duration-300 ease-in-out ${
              isSecureExpanded ? "max-h-96 opacity-100" : "max-h-0 opacity-0"
            }`}
          >
            <div className="space-y-1 pb-1">
              {encryptedTypes.map((edgeType) => (
                <button
                  key={edgeType.id}
                  onClick={() => handleEdgeTypeSelect(edgeType.id)}
                  className={`w-full flex items-center gap-2 p-2 rounded-md transition-all duration-200 text-left text-xs group hover:shadow-sm ${
                    selectedEdgeType === edgeType.id
                      ? `${edgeType.color} text-white shadow-md`
                      : "bg-white border border-slate-200 text-slate-700 hover:bg-gradient-to-r hover:from-green-50 hover:to-emerald-50 hover:border-green-200"
                  }`}
                >
                  <div
                    className={`p-1 rounded-sm transition-all ${
                      selectedEdgeType === edgeType.id
                        ? "bg-white/20"
                        : "bg-slate-100 group-hover:bg-green-100"
                    }`}
                  >
                    <div className="w-3 h-3 flex items-center justify-center">
                      {edgeType.icon}
                    </div>
                  </div>
                  <div className="flex-1">
                    <div className="font-medium">{edgeType.label}</div>
                    <div
                      className={`text-xs hidden sm:block ${
                        selectedEdgeType === edgeType.id
                          ? "text-white/80"
                          : "text-slate-500 group-hover:text-green-600"
                      }`}
                    >
                      {edgeType.description}
                    </div>
                  </div>
                </button>
              ))}
            </div>
          </div>
        </div>

        {/* Unencrypted Connections */}
        <div>
          <button
            onClick={() => setIsStandardExpanded(!isStandardExpanded)}
            className="w-full flex items-center justify-between gap-1 mb-2 p-1.5 rounded-md bg-gradient-to-r from-amber-50 to-orange-50 border border-amber-200 hover:from-amber-100 hover:to-orange-100 transition-all duration-200"
          >
            <div className="flex items-center gap-1">
              <Zap className="w-3 h-3 text-amber-600" />
              <h4 className="text-xs font-medium text-amber-700">Standard</h4>
              <span className="text-xs bg-amber-100 text-amber-600 px-1 py-0.5 rounded-full">
                {unencryptedTypes.length}
              </span>
            </div>
            {isStandardExpanded ? (
              <ChevronUp className="w-3 h-3 text-amber-600" />
            ) : (
              <ChevronDown className="w-3 h-3 text-amber-600" />
            )}
          </button>

          <div
            className={`overflow-hidden transition-all duration-300 ease-in-out ${
              isStandardExpanded ? "max-h-96 opacity-100" : "max-h-0 opacity-0"
            }`}
          >
            <div className="space-y-1 pb-1">
              {unencryptedTypes.map((edgeType) => (
                <button
                  key={edgeType.id}
                  onClick={() => handleEdgeTypeSelect(edgeType.id)}
                  className={`w-full flex items-center gap-2 p-2 rounded-md transition-all duration-200 text-left text-xs group hover:shadow-sm ${
                    selectedEdgeType === edgeType.id
                      ? `${edgeType.color} text-white shadow-md`
                      : "bg-white border border-slate-200 text-slate-700 hover:bg-gradient-to-r hover:from-amber-50 hover:to-orange-50 hover:border-amber-200"
                  }`}
                >
                  <div
                    className={`p-1 rounded-sm transition-all ${
                      selectedEdgeType === edgeType.id
                        ? "bg-white/20"
                        : "bg-slate-100 group-hover:bg-amber-100"
                    }`}
                  >
                    <div className="w-3 h-3 flex items-center justify-center">
                      {edgeType.icon}
                    </div>
                  </div>
                  <div className="flex-1">
                    <div className="font-medium">{edgeType.label}</div>
                    <div
                      className={`text-xs hidden sm:block ${
                        selectedEdgeType === edgeType.id
                          ? "text-white/80"
                          : "text-slate-500 group-hover:text-amber-600"
                      }`}
                    >
                      {edgeType.description}
                    </div>
                  </div>
                </button>
              ))}
            </div>
          </div>
        </div>
      </div>

      {selectedEdge && (
        <div className="border-t border-slate-200 pt-3">
          <h4 className="text-xs font-semibold text-slate-700 mb-2 flex items-center gap-1">
            <div className="w-1.5 h-1.5 bg-gradient-to-r from-red-500 to-pink-500 rounded-full"></div>
            Selected
          </h4>
          <div className="flex items-center justify-between p-2 bg-gradient-to-r from-slate-50 to-gray-50 border border-slate-200 rounded-md">
            <div className="text-xs text-slate-600 font-medium">
              #{selectedEdge.id.slice(-4)}
            </div>
            <button
              onClick={handleDeleteEdge}
              className="p-1 text-red-500 hover:bg-red-50 rounded-sm transition-all duration-200"
              title="Delete connection"
            >
              <Trash2 className="w-3 h-3" />
            </button>
          </div>
        </div>
      )}

      <div className="mt-3 p-2 bg-gradient-to-r from-blue-50 to-indigo-50 border border-blue-200 rounded-md">
        <div className="text-xs text-blue-700 text-center font-medium">
          💡 Select type, drag to connect
        </div>
      </div>
    </div>
  );
};

export default EdgeSelector;
