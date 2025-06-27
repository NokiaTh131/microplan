import React from 'react';
import { Zap, MessageCircle, Database, Trash2 } from 'lucide-react';
import { useArchitectureStore } from '../../stores/architectureStore';

const EdgeSelector: React.FC = () => {
  const { selectedEdgeType, setSelectedEdgeType, selectedEdge, deleteEdge } = useArchitectureStore();

  const edgeTypes = [
    {
      id: 'sync',
      label: 'HTTP',
      icon: <Zap className="w-4 h-4" />,
      color: 'bg-blue-500',
      description: 'Synchronous HTTP API calls'
    },
    {
      id: 'async',
      label: 'Queue',
      icon: <MessageCircle className="w-4 h-4" />,
      color: 'bg-purple-500',
      description: 'Asynchronous message queues'
    },
    {
      id: 'dataflow',
      label: 'Data',
      icon: <Database className="w-4 h-4" />,
      color: 'bg-green-500',
      description: 'Data flow connections'
    }
  ];

  const handleEdgeTypeSelect = (edgeType: string) => {
    setSelectedEdgeType(edgeType);
  };

  const handleDeleteEdge = () => {
    if (selectedEdge) {
      deleteEdge(selectedEdge.id);
    }
  };

  return (
    <div className="bg-white/90 backdrop-blur-sm border border-slate-200 rounded-lg shadow-lg p-3">
      <div className="mb-3">
        <h3 className="text-xs font-semibold text-slate-700 mb-2">Connection Type</h3>
        <div className="space-y-1">
          {edgeTypes.map((edgeType) => (
            <button
              key={edgeType.id}
              onClick={() => handleEdgeTypeSelect(edgeType.id)}
              className={`w-full flex items-center gap-3 p-2 rounded-lg transition-all text-left text-xs hover:scale-105 ${
                selectedEdgeType === edgeType.id
                  ? `${edgeType.color} text-white shadow-md`
                  : 'bg-slate-50 text-slate-700 hover:bg-slate-100'
              }`}
            >
              <div className={`p-1 rounded ${
                selectedEdgeType === edgeType.id ? 'bg-white/20' : 'bg-slate-200'
              }`}>
                {edgeType.icon}
              </div>
              <div className="flex-1">
                <div className="font-medium">{edgeType.label}</div>
                <div className={`text-xs ${
                  selectedEdgeType === edgeType.id ? 'text-white/70' : 'text-slate-500'
                }`}>
                  {edgeType.description}
                </div>
              </div>
            </button>
          ))}
        </div>
      </div>

      {selectedEdge && (
        <div className="border-t border-slate-200 pt-3">
          <h4 className="text-xs font-semibold text-slate-700 mb-2">Selected Edge</h4>
          <div className="flex items-center justify-between p-2 bg-slate-50 rounded-lg">
            <div className="text-xs text-slate-600">
              Edge #{selectedEdge.id.slice(-4)}
            </div>
            <button
              onClick={handleDeleteEdge}
              className="p-1 text-red-500 hover:bg-red-50 rounded transition-colors"
              title="Delete edge"
            >
              <Trash2 className="w-3 h-3" />
            </button>
          </div>
        </div>
      )}

      <div className="mt-3 text-xs text-slate-500">
        Select connection type, then connect nodes
      </div>
    </div>
  );
};

export default EdgeSelector;