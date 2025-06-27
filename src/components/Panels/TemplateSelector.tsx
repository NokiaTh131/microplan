import React, { useState, useMemo, useCallback } from 'react';
import { 
  Layout, 
  Search,
  Download,
} from 'lucide-react';
import { 
  architectureTemplates, 
  templateCategories, 
  complexityLevels,
  ArchitectureTemplate 
} from '../../data/architectureTemplates';
import { useArchitectureStore } from '../../stores/architectureStore';
import { useDebounce } from '../../hooks/useDebounce';
import TemplateCard from './TemplateCard';

const TemplateSelector: React.FC = () => {
  const store = useArchitectureStore();
  const [selectedCategory, setSelectedCategory] = useState('All');
  const [selectedComplexity, setSelectedComplexity] = useState<string>('All');
  const [searchTerm, setSearchTerm] = useState('');
  const [selectedTemplate, setSelectedTemplate] = useState<ArchitectureTemplate | null>(null);
  const [showPreview, setShowPreview] = useState(false);


  const getComplexityColor = (complexity: string) => {
    switch (complexity) {
      case 'Simple': return 'bg-green-50 text-green-700 border-green-200';
      case 'Medium': return 'bg-amber-50 text-amber-700 border-amber-200';
      case 'Complex': return 'bg-red-50 text-red-700 border-red-200';
      default: return 'bg-gray-50 text-gray-700 border-gray-200';
    }
  };

  const getCategoryColor = (category: string) => {
    const colors = {
      'Web': 'bg-blue-600 text-white',
      'API': 'bg-purple-600 text-white', 
      'Monolith': 'bg-gray-600 text-white',
      'Queue': 'bg-orange-600 text-white',
      'CMS': 'bg-pink-600 text-white',
      'E-commerce': 'bg-green-600 text-white',
      'Observability': 'bg-yellow-600 text-white',
      'Messaging': 'bg-violet-600 text-white',
      'Content': 'bg-teal-600 text-white',
      'Social': 'bg-indigo-600 text-white',
      'Analytics': 'bg-emerald-600 text-white',
      'IoT': 'bg-rose-600 text-white',
      'Finance': 'bg-amber-600 text-white',
      'Gaming': 'bg-fuchsia-600 text-white',
      'Healthcare': 'bg-cyan-600 text-white',
    };
    return colors[category as keyof typeof colors] || 'bg-gray-600 text-white';
  };

  const getCategoryAccent = (category: string) => {
    const accents = {
      'Web': 'bg-blue-50 border-blue-200 text-blue-700',
      'API': 'bg-purple-50 border-purple-200 text-purple-700', 
      'Monolith': 'bg-gray-50 border-gray-200 text-gray-700',
      'Queue': 'bg-orange-50 border-orange-200 text-orange-700',
      'CMS': 'bg-pink-50 border-pink-200 text-pink-700',
      'E-commerce': 'bg-green-50 border-green-200 text-green-700',
      'Observability': 'bg-yellow-50 border-yellow-200 text-yellow-700',
      'Messaging': 'bg-violet-50 border-violet-200 text-violet-700',
      'Content': 'bg-teal-50 border-teal-200 text-teal-700',
      'Social': 'bg-indigo-50 border-indigo-200 text-indigo-700',
      'Analytics': 'bg-emerald-50 border-emerald-200 text-emerald-700',
      'IoT': 'bg-rose-50 border-rose-200 text-rose-700',
      'Finance': 'bg-amber-50 border-amber-200 text-amber-700',
      'Gaming': 'bg-fuchsia-50 border-fuchsia-200 text-fuchsia-700',
      'Healthcare': 'bg-cyan-50 border-cyan-200 text-cyan-700',
    };
    return accents[category as keyof typeof accents] || 'bg-gray-50 border-gray-200 text-gray-700';
  };

  // Debounce search to improve performance
  const debouncedSearchTerm = useDebounce(searchTerm, 300);

  // Memoize filtered templates to prevent recalculation on every render
  const filteredTemplates = useMemo(() => {
    return architectureTemplates.filter(template => {
      const matchesCategory = selectedCategory === 'All' || template.category === selectedCategory;
      const matchesComplexity = selectedComplexity === 'All' || template.complexity === selectedComplexity;
      const matchesSearch = debouncedSearchTerm === '' || 
        template.name.toLowerCase().includes(debouncedSearchTerm.toLowerCase()) ||
        template.description.toLowerCase().includes(debouncedSearchTerm.toLowerCase()) ||
        template.tags.some(tag => tag.toLowerCase().includes(debouncedSearchTerm.toLowerCase()));
      
      return matchesCategory && matchesComplexity && matchesSearch;
    });
  }, [selectedCategory, selectedComplexity, debouncedSearchTerm]);

  const loadTemplate = useCallback((template: ArchitectureTemplate) => {
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
  }, [store]);

  const handlePreview = useCallback((template: ArchitectureTemplate) => {
    setSelectedTemplate(template);
    setShowPreview(true);
  }, []);

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
      <div className="space-y-4">
        {filteredTemplates.map(template => (
          <TemplateCard
            key={template.id}
            template={template}
            onPreview={handlePreview}
            onLoad={loadTemplate}
            getCategoryColor={getCategoryColor}
            getCategoryAccent={getCategoryAccent}
            getComplexityColor={getComplexityColor}
          />
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