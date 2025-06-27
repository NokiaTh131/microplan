import React, { memo } from 'react';
import { Download, Eye, Users, Zap, CheckCircle, AlertTriangle, XCircle } from 'lucide-react';
import { ArchitectureTemplate } from '../../data/architectureTemplates';

interface TemplateCardProps {
  template: ArchitectureTemplate;
  onPreview: (template: ArchitectureTemplate) => void;
  onLoad: (template: ArchitectureTemplate) => void;
  getCategoryColor: (category: string) => string;
  getCategoryAccent: (category: string) => string;
  getComplexityColor: (complexity: string) => string;
}

const getComplexityIcon = (complexity: string) => {
  switch (complexity) {
    case 'Simple': return <CheckCircle className="w-4 h-4 text-green-500" />;
    case 'Medium': return <AlertTriangle className="w-4 h-4 text-yellow-500" />;
    case 'Complex': return <XCircle className="w-4 h-4 text-red-500" />;
    default: return <CheckCircle className="w-4 h-4 text-gray-500" />;
  }
};

const TemplateCard: React.FC<TemplateCardProps> = memo(({
  template,
  onPreview,
  onLoad,
  getCategoryColor,
  getCategoryAccent,
  getComplexityColor,
}) => {
  return (
    <div className="bg-white border border-slate-200 rounded-lg hover:shadow-md transition-all duration-200 overflow-hidden">
      {/* Header */}
      <div className="p-4 pb-3">
        <div className="flex flex-col sm:flex-row sm:items-start sm:justify-between gap-3">
          <div className="flex-1 min-w-0">
            {/* Title and Category */}
            <div className="flex flex-col sm:flex-row sm:items-center gap-2 mb-2">
              <h4 className="font-semibold text-slate-900 text-base leading-tight">{template.name}</h4>
              <div className="flex items-center gap-2 flex-shrink-0">
                <span className={`px-2 py-1 rounded-md text-xs font-medium ${getCategoryColor(template.category)}`}>
                  {template.category}
                </span>
                <div className={`px-2 py-1 rounded-md text-xs font-medium border flex items-center gap-1 ${getComplexityColor(template.complexity)}`}>
                  {getComplexityIcon(template.complexity)}
                  <span className="hidden sm:inline">{template.complexity}</span>
                </div>
              </div>
            </div>
            
            {/* Description */}
            <p className="text-sm text-slate-600 mb-3 line-clamp-2 leading-relaxed">{template.description}</p>
            
            {/* Tags */}
            <div className="flex flex-wrap gap-1.5 mb-3">
              {template.tags.slice(0, 3).map(tag => (
                <span key={tag} className={`px-2 py-1 rounded-md text-xs font-medium border ${getCategoryAccent(template.category)}`}>
                  #{tag}
                </span>
              ))}
              {template.tags.length > 3 && (
                <span className="px-2 py-1 rounded-md text-xs font-medium bg-slate-50 text-slate-600 border border-slate-200">
                  +{template.tags.length - 3}
                </span>
              )}
            </div>
          </div>
        </div>
      </div>

      {/* Footer */}
      <div className="px-4 py-3 bg-slate-50 border-t border-slate-100">
        <div className="flex flex-col sm:flex-row sm:items-center sm:justify-between gap-3">
          {/* Stats */}
          <div className="flex items-center gap-4 text-sm">
            <div className="flex items-center gap-2 text-slate-600">
              <div className={`p-1.5 rounded-md ${getCategoryAccent(template.category)}`}>
                <Users className="w-3 h-3" />
              </div>
              <span className="font-medium">
                <span className="hidden sm:inline">{template.nodes.length} services</span>
                <span className="sm:hidden">{template.nodes.length}</span>
              </span>
            </div>
            <div className="flex items-center gap-2 text-slate-600">
              <div className={`p-1.5 rounded-md ${getCategoryAccent(template.category)}`}>
                <Zap className="w-3 h-3" />
              </div>
              <span className="font-medium">
                <span className="hidden sm:inline">{template.edges.length} connections</span>
                <span className="sm:hidden">{template.edges.length}</span>
              </span>
            </div>
          </div>
          
          {/* Actions */}
          <div className="flex gap-2 w-full sm:w-auto">
            <button
              onClick={() => onPreview(template)}
              className="flex-1 sm:flex-none flex items-center justify-center gap-2 px-3 py-2 text-sm text-slate-700 bg-white border border-slate-300 rounded-md hover:bg-slate-50 hover:border-slate-400 transition-colors"
            >
              <Eye className="w-4 h-4" />
              <span>Preview</span>
            </button>
            <button
              onClick={() => onLoad(template)}
              className={`flex-1 sm:flex-none flex items-center justify-center gap-2 px-3 py-2 text-sm text-white rounded-md hover:opacity-90 transition-opacity ${getCategoryColor(template.category)}`}
            >
              <Download className="w-4 h-4" />
              <span>Load</span>
            </button>
          </div>
        </div>
      </div>
    </div>
  );
});

TemplateCard.displayName = 'TemplateCard';

export default TemplateCard;