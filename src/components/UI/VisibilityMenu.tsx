import React, { useState } from 'react';
import { Eye, EyeOff, Menu, X, PanelRightOpen, Zap } from 'lucide-react';
import { useArchitectureStore } from '../../stores/architectureStore';

const VisibilityMenu: React.FC = () => {
  const { 
    isPanelVisible, 
    isEdgeSelectorVisible,
    setPanelVisibility, 
    setEdgeSelectorVisibility 
  } = useArchitectureStore();
  const [isMenuOpen, setIsMenuOpen] = useState(false);

  const menuItems = [
    {
      id: 'panel',
      label: 'Right Panel',
      icon: <PanelRightOpen className="w-4 h-4" />,
      isVisible: isPanelVisible,
      toggle: () => setPanelVisibility(!isPanelVisible),
    },
    {
      id: 'edgeSelector',
      label: 'Edge Selector',
      icon: <Zap className="w-4 h-4" />,
      isVisible: isEdgeSelectorVisible,
      toggle: () => setEdgeSelectorVisibility(!isEdgeSelectorVisible),
    },
  ];

  return (
    <div className="relative">
      {/* Menu Toggle Button */}
      <button
        onClick={() => setIsMenuOpen(!isMenuOpen)}
        className="w-8 h-8 bg-white/90 backdrop-blur-sm border border-slate-200 rounded-lg shadow-lg hover:bg-slate-50 transition-colors flex items-center justify-center"
        title="View Options"
      >
        {isMenuOpen ? (
          <X className="w-4 h-4 text-slate-600" />
        ) : (
          <Menu className="w-4 h-4 text-slate-600" />
        )}
      </button>

      {/* Dropdown Menu */}
      {isMenuOpen && (
        <div className="absolute top-10 right-0 bg-white/95 backdrop-blur-sm border border-slate-200 rounded-lg shadow-lg min-w-40 z-30">
          <div className="p-2">
            <div className="text-xs font-semibold text-slate-700 mb-2 px-2">
              View Options
            </div>
            {menuItems.map((item) => (
              <button
                key={item.id}
                onClick={() => {
                  item.toggle();
                  setIsMenuOpen(false);
                }}
                className="w-full flex items-center justify-between gap-2 px-2 py-2 text-sm text-slate-700 hover:bg-slate-100 rounded-md transition-colors"
              >
                <div className="flex items-center gap-2">
                  {item.icon}
                  <span>{item.label}</span>
                </div>
                {item.isVisible ? (
                  <Eye className="w-4 h-4 text-green-600" />
                ) : (
                  <EyeOff className="w-4 h-4 text-slate-400" />
                )}
              </button>
            ))}
          </div>
        </div>
      )}

      {/* Backdrop to close menu */}
      {isMenuOpen && (
        <div
          className="fixed inset-0 z-20"
          onClick={() => setIsMenuOpen(false)}
        />
      )}
    </div>
  );
};

export default VisibilityMenu;