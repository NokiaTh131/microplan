import React, { useState } from 'react';
import { 
  Layout, 
  Download, 
  Eye, 
  Users, 
  Zap,
  Search,
  CheckCircle,
  AlertTriangle,
  XCircle
} from 'lucide-react';
import { 
  architectureTemplates, 
  templateCategories, 
  complexityLevels,
  ArchitectureTemplate 
} from '../../data/architectureTemplates';
import { useArchitectureStore } from '../../stores/architectureStore';

const TemplateSelector: React.FC = () => {
  const store = useArchitectureStore();
  const [selectedCategory, setSelectedCategory] = useState('All');
  const [selectedComplexity, setSelectedComplexity] = useState<string>('All');
  const [searchTerm, setSearchTerm] = useState('');
  const [selectedTemplate, setSelectedTemplate] = useState<ArchitectureTemplate | null>(null);
  const [showPreview, setShowPreview] = useState(false);

  const getComplexityIcon = (complexity: string) => {
    switch (complexity) {
      case 'Simple': return <CheckCircle className="w-4 h-4 text-green-500" />;
      case 'Medium': return <AlertTriangle className="w-4 h-4 text-yellow-500" />;
      case 'Complex': return <XCircle className="w-4 h-4 text-red-500" />;
      default: return <CheckCircle className="w-4 h-4 text-gray-500" />;
    }
  };

  const getComplexityColor = (complexity: string) => {
    switch (complexity) {
      case 'Simple': return 'bg-green-100 text-green-800 border-green-200';
      case 'Medium': return 'bg-yellow-100 text-yellow-800 border-yellow-200';
      case 'Complex': return 'bg-red-100 text-red-800 border-red-200';
      default: return 'bg-gray-100 text-gray-800 border-gray-200';
    }
  };

  const filteredTemplates = architectureTemplates.filter(template => {
    const matchesCategory = selectedCategory === 'All' || template.category === selectedCategory;
    const matchesComplexity = selectedComplexity === 'All' || template.complexity === selectedComplexity;
    const matchesSearch = searchTerm === '' || 
      template.name.toLowerCase().includes(searchTerm.toLowerCase()) ||
      template.description.toLowerCase().includes(searchTerm.toLowerCase()) ||
      template.tags.some(tag => tag.toLowerCase().includes(searchTerm.toLowerCase()));
    
    return matchesCategory && matchesComplexity && matchesSearch;
  });

  const loadTemplate = (template: ArchitectureTemplate) => {
    // Create a mapping from template node IDs to new node IDs
    const nodeIdMapping: Record<string, string> = {};
    
    // Generate unique IDs for all nodes first
    template.nodes.forEach(node => {
      nodeIdMapping[node.id] = `node-${Date.now()}-${Math.random().toString(36).substr(2, 9)}`;
    });
    
    // Create new nodes with mapped IDs
    const newNodes = template.nodes.map(node => {
      const config = (node.data as any)?.config;
      return {
        id: nodeIdMapping[node.id],
        type: "serviceNode",
        position: node.position,
        data: { config }
      };
    }).filter(node => node.data.config);

    // Create new edges with mapped IDs
    const newEdges = template.edges.map(edge => {
      const sourceNodeId = nodeIdMapping[edge.source];
      const targetNodeId = nodeIdMapping[edge.target];
      
      return {
        id: `edge-${Date.now()}-${Math.random().toString(36).substr(2, 9)}`,
        source: sourceNodeId,
        target: targetNodeId,
        sourceHandle: edge.sourceHandle,
        targetHandle: edge.targetHandle,
        type: edge.type || 'sync',
        data: {
          communicationType: edge.type || 'sync',
          protocol: edge.type === 'sync' ? 'HTTP' : edge.type === 'async' ? 'Queue' : 'Data',
        }
      };
    });

    // Load template using the new batch method
    store.loadTemplate(newNodes as any, newEdges as any);
    
    console.log('Loaded template with', newNodes.length, 'nodes and', newEdges.length, 'edges');
  };

  const handlePreview = (template: ArchitectureTemplate) => {
    setSelectedTemplate(template);
    setShowPreview(true);
  };

  if (showPreview && selectedTemplate) {
    return (
      <div className="p-6 h-full overflow-y-auto space-y-6">
        {/* Preview Header */}
        <div className="flex items-center justify-between">
          <div className="flex items-center gap-3">
            <button
              onClick={() => setShowPreview(false)}
              className="p-2 hover:bg-slate-100 rounded-lg transition-colors"
            >
              ← Back
            </button>
            <h3 className="text-lg font-bold text-slate-800">{selectedTemplate.name}</h3>
            <div className={`px-2 py-1 rounded-full text-xs font-medium border ${getComplexityColor(selectedTemplate.complexity)}`}>
              {selectedTemplate.complexity}
            </div>
          </div>
          <button
            onClick={() => loadTemplate(selectedTemplate)}
            className="flex items-center gap-2 bg-blue-500 text-white px-4 py-2 rounded-lg hover:bg-blue-600 transition-colors"
          >
            <Download className="w-4 h-4" />
            Load Template
          </button>
        </div>

        {/* Template Details */}
        <div className="space-y-4">
          <p className="text-slate-600">{selectedTemplate.description}</p>
          
          <div className="flex flex-wrap gap-2">
            {selectedTemplate.tags.map(tag => (
              <span key={tag} className="px-2 py-1 bg-blue-100 text-blue-700 rounded-full text-xs">
                #{tag}
              </span>
            ))}
          </div>

          <div className="grid grid-cols-2 gap-4 bg-slate-50 p-4 rounded-lg">
            <div className="text-center">
              <div className="text-2xl font-bold text-slate-800">{selectedTemplate.nodes.length}</div>
              <div className="text-sm text-slate-600">Services</div>
            </div>
            <div className="text-center">
              <div className="text-2xl font-bold text-slate-800">{selectedTemplate.edges.length}</div>
              <div className="text-sm text-slate-600">Connections</div>
            </div>
          </div>

          {/* Services List */}
          <div>
            <h4 className="text-md font-semibold text-slate-700 mb-3">Included Services</h4>
            <div className="space-y-2">
              {selectedTemplate.nodes.map(node => {
                const config = (node.data as any)?.config;
                return (
                  <div key={node.id} className="flex items-center justify-between p-3 bg-white border border-slate-200 rounded-lg">
                    <div>
                      <div className="font-medium text-slate-800">{config?.name}</div>
                      <div className="text-sm text-slate-600">{config?.techStack}</div>
                    </div>
                    <div className="text-xs text-slate-500">
                      {config?.cpu}CPU • {config?.memory}MB • {config?.replicas}x
                    </div>
                  </div>
                );
              })}
            </div>
          </div>
        </div>
      </div>
    );
  }

  return (
    <div className="p-6 h-full overflow-y-auto space-y-6">
      {/* Header */}
      <div>
        <h3 className="text-lg font-bold text-slate-800 mb-2 flex items-center gap-2">
          <Layout className="w-5 h-5 text-blue-600" />
          Architecture Templates
        </h3>
        <p className="text-sm text-slate-600">
          Start with pre-built architectures for common use cases
        </p>
      </div>

      {/* Search and Filters */}
      <div className="space-y-4">
        {/* Search */}
        <div className="relative">
          <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 w-4 h-4 text-slate-400" />
          <input
            type="text"
            placeholder="Search templates..."
            value={searchTerm}
            onChange={(e) => setSearchTerm(e.target.value)}
            className="w-full pl-10 pr-4 py-2 border border-slate-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-blue-500"
          />
        </div>

        {/* Filters */}
        <div className="grid grid-cols-2 gap-4">
          <div>
            <label className="block text-sm font-medium text-slate-700 mb-2">Category</label>
            <select
              value={selectedCategory}
              onChange={(e) => setSelectedCategory(e.target.value)}
              className="w-full px-3 py-2 border border-slate-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-blue-500"
            >
              {templateCategories.map(category => (
                <option key={category} value={category}>{category}</option>
              ))}
            </select>
          </div>
          <div>
            <label className="block text-sm font-medium text-slate-700 mb-2">Complexity</label>
            <select
              value={selectedComplexity}
              onChange={(e) => setSelectedComplexity(e.target.value)}
              className="w-full px-3 py-2 border border-slate-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-blue-500"
            >
              <option value="All">All Levels</option>
              {complexityLevels.map(level => (
                <option key={level} value={level}>{level}</option>
              ))}
            </select>
          </div>
        </div>
      </div>

      {/* Results Count */}
      <div className="text-sm text-slate-600">
        {filteredTemplates.length} template{filteredTemplates.length !== 1 ? 's' : ''} found
      </div>

      {/* Template Grid */}
      <div className="space-y-3">
        {filteredTemplates.map(template => (
          <div key={template.id} className="border border-slate-200 rounded-lg p-3 hover:shadow-md transition-shadow">
            <div className="flex items-start justify-between mb-2">
              <div className="flex-1 min-w-0">
                <div className="flex items-center gap-2 mb-1">
                  <h4 className="font-semibold text-slate-800 text-sm truncate">{template.name}</h4>
                  <div className={`px-1.5 py-0.5 rounded-full text-xs font-medium border flex items-center gap-1 ${getComplexityColor(template.complexity)}`}>
                    {getComplexityIcon(template.complexity)}
                    <span className="hidden sm:inline">{template.complexity}</span>
                  </div>
                </div>
                <p className="text-xs text-slate-600 mb-2 line-clamp-2">{template.description}</p>
                <div className="flex flex-wrap gap-1 mb-2">
                  {template.tags.slice(0, 2).map(tag => (
                    <span key={tag} className="px-1.5 py-0.5 bg-slate-100 text-slate-600 rounded-full text-xs">
                      #{tag}
                    </span>
                  ))}
                  {template.tags.length > 2 && (
                    <span className="px-1.5 py-0.5 bg-slate-100 text-slate-600 rounded-full text-xs">
                      +{template.tags.length - 2}
                    </span>
                  )}
                </div>
              </div>
            </div>

            <div className="flex items-center justify-between pt-2 border-t border-slate-100">
              <div className="flex items-center gap-3 text-xs text-slate-500">
                <div className="flex items-center gap-1">
                  <Users className="w-3 h-3" />
                  <span className="hidden sm:inline">{template.nodes.length} services</span>
                  <span className="sm:hidden">{template.nodes.length}</span>
                </div>
                <div className="flex items-center gap-1">
                  <Zap className="w-3 h-3" />
                  <span className="hidden sm:inline">{template.edges.length} connections</span>
                  <span className="sm:hidden">{template.edges.length}</span>
                </div>
              </div>
              <div className="flex gap-1">
                <button
                  onClick={() => handlePreview(template)}
                  className="flex items-center gap-1 px-2 py-1 text-xs text-slate-600 border border-slate-300 rounded hover:bg-slate-50 transition-colors"
                >
                  <Eye className="w-3 h-3" />
                  <span className="hidden sm:inline">Preview</span>
                </button>
                <button
                  onClick={() => loadTemplate(template)}
                  className="flex items-center gap-1 px-2 py-1 text-xs bg-blue-500 text-white rounded hover:bg-blue-600 transition-colors"
                >
                  <Download className="w-3 h-3" />
                  <span className="hidden sm:inline">Load</span>
                </button>
              </div>
            </div>
          </div>
        ))}
      </div>

      {filteredTemplates.length === 0 && (
        <div className="text-center py-12">
          <Layout className="w-12 h-12 text-slate-300 mx-auto mb-4" />
          <h4 className="text-lg font-medium text-slate-500 mb-2">No templates found</h4>
          <p className="text-slate-400">Try adjusting your search or filters</p>
        </div>
      )}
    </div>
  );
};

export default TemplateSelector;