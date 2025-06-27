import React, { useState, useRef, useCallback, useEffect } from 'react';

interface ResizablePanelProps {
  children: React.ReactNode;
  defaultWidth?: number;
  minWidth?: number;
  maxWidth?: number;
  className?: string;
}

const ResizablePanel: React.FC<ResizablePanelProps> = ({
  children,
  defaultWidth = 384, // w-96 = 24rem = 384px
  minWidth = 280,     // Minimum usable width
  maxWidth = 600,     // Maximum width
  className = ''
}) => {
  const [width, setWidth] = useState(defaultWidth);
  const [isResizing, setIsResizing] = useState(false);
  const panelRef = useRef<HTMLDivElement>(null);

  const handleMouseDown = useCallback((e: React.MouseEvent) => {
    e.preventDefault();
    setIsResizing(true);
  }, []);

  const handleMouseMove = useCallback((e: MouseEvent) => {
    if (!isResizing || !panelRef.current) return;

    const rect = panelRef.current.getBoundingClientRect();
    const newWidth = rect.right - e.clientX;
    
    // Constrain width within bounds
    const constrainedWidth = Math.min(Math.max(newWidth, minWidth), maxWidth);
    setWidth(constrainedWidth);
  }, [isResizing, minWidth, maxWidth]);

  const handleMouseUp = useCallback(() => {
    setIsResizing(false);
  }, []);

  useEffect(() => {
    if (isResizing) {
      document.addEventListener('mousemove', handleMouseMove);
      document.addEventListener('mouseup', handleMouseUp);
      document.body.style.cursor = 'col-resize';
      document.body.style.userSelect = 'none';

      return () => {
        document.removeEventListener('mousemove', handleMouseMove);
        document.removeEventListener('mouseup', handleMouseUp);
        document.body.style.cursor = '';
        document.body.style.userSelect = '';
      };
    }
  }, [isResizing, handleMouseMove, handleMouseUp]);

  return (
    <div 
      ref={panelRef}
      className={`relative flex-shrink-0 ${className}`} 
      style={{ width: `${width}px` }}
    >
      {/* Resize Handle */}
      <div
        className={`absolute left-0 top-0 bottom-0 w-1 cursor-col-resize z-20 group hover:bg-blue-500 transition-colors ${
          isResizing ? 'bg-blue-500' : 'bg-transparent hover:bg-blue-300'
        }`}
        onMouseDown={handleMouseDown}
      >
        {/* Visual indicator */}
        <div className="absolute left-0 top-1/2 -translate-y-1/2 w-1 h-8 bg-slate-300 group-hover:bg-blue-500 transition-colors rounded-r" />
      </div>
      
      {/* Panel Content */}
      <div className="h-full ml-1">
        {children}
      </div>
      
      {/* Overlay during resize to prevent interference */}
      {isResizing && (
        <div className="absolute inset-0 z-10 cursor-col-resize" />
      )}
    </div>
  );
};

export default ResizablePanel;