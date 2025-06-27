import React from 'react';
import { ArrowLeft, MousePointer, Settings } from 'lucide-react';

const EmptyStateHint: React.FC = () => {
  return (
    <div className="absolute top-1/2 right-8 transform -translate-y-1/2 bg-white/90 backdrop-blur-sm border border-slate-200 rounded-xl shadow-lg p-4 max-w-xs">
      <div className="text-center">
        <div className="flex justify-center mb-3">
          <div className="p-2 bg-blue-100 rounded-full">
            <Settings className="w-6 h-6 text-blue-600" />
          </div>
        </div>
        
        <h3 className="text-sm font-semibold text-slate-800 mb-2">
          Get Started
        </h3>
        
        <div className="text-xs text-slate-600 space-y-2">
          <div className="flex items-center gap-2">
            <ArrowLeft className="w-3 h-3 text-blue-500 flex-shrink-0" />
            <span>Add services from the palette</span>
          </div>
          <div className="flex items-center gap-2">
            <MousePointer className="w-3 h-3 text-green-500 flex-shrink-0" />
            <span>Click nodes to configure them</span>
          </div>
        </div>
        
        <div className="mt-3 text-xs text-slate-500">
          The control panel will appear when you have content to manage
        </div>
      </div>
    </div>
  );
};

export default EmptyStateHint;