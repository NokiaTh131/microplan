import { useCallback, useMemo } from 'react';
import { NodeChange, EdgeChange, Connection } from '@xyflow/react';
import { useArchitectureStore } from '../stores/architectureStore';

// Custom hook for optimizing canvas operations
export const useCanvasOptimization = () => {
  const { nodes, edges, onNodesChange, onEdgesChange, onConnect } = useArchitectureStore();

  // Memoized viewport settings for better performance
  const viewportSettings = useMemo(() => ({
    defaultViewport: { x: 0, y: 0, zoom: 0.8 },
    minZoom: 0.1,
    maxZoom: 2,
    nodeOrigin: [0.5, 0.5] as [number, number],
    snapToGrid: true,
    snapGrid: [20, 20] as [number, number],
    onlyRenderVisibleElements: true,
    elevateNodesOnSelect: true,
    selectNodesOnDrag: false,
  }), []);

  // Optimized node change handler with debouncing
  const optimizedOnNodesChange = useCallback((changes: NodeChange[]) => {
    // Filter out unnecessary updates to reduce re-renders
    const filteredChanges = changes.filter(change => {
      if (change.type === 'position' && change.dragging) {
        // Only apply position changes when dragging is complete
        return false;
      }
      return true;
    });

    if (filteredChanges.length > 0) {
      onNodesChange(filteredChanges);
    }
  }, [onNodesChange]);

  // Optimized edge change handler
  const optimizedOnEdgesChange = useCallback((changes: EdgeChange[]) => {
    // Batch edge changes for better performance
    onEdgesChange(changes);
  }, [onEdgesChange]);

  // Optimized connection handler with validation
  const optimizedOnConnect = useCallback((connection: Connection) => {
    // Validate connection before creating
    if (connection.source && connection.target && connection.source !== connection.target) {
      // Check if connection already exists
      const existingEdge = edges.find(
        edge => edge.source === connection.source && edge.target === connection.target
      );
      
      if (!existingEdge) {
        onConnect(connection);
      }
    }
  }, [edges, onConnect]);

  // Canvas interaction settings for better UX
  const interactionSettings = useMemo(() => ({
    panOnDrag: [1, 2], // Pan with left and middle mouse button
    selectionOnDrag: false,
    multiSelectionKeyCode: 'Meta', // Cmd/Ctrl for multi-selection
    deleteKeyCode: 'Delete',
    zoomOnPinch: true,
    zoomOnScroll: true,
    zoomOnDoubleClick: false,
    preventScrolling: true,
  }), []);

  // Performance monitoring for large architectures
  const performanceMetrics = useMemo(() => {
    const nodeCount = nodes.length;
    const edgeCount = edges.length;
    const complexity = nodeCount + edgeCount;
    
    return {
      nodeCount,
      edgeCount,
      complexity,
      isLargeArchitecture: complexity > 50,
      shouldVirtualize: complexity > 100,
      recommendOptimizations: complexity > 200,
    };
  }, [nodes.length, edges.length]);

  // Dynamic performance settings based on architecture size
  const adaptiveSettings = useMemo(() => {
    const { isLargeArchitecture, shouldVirtualize } = performanceMetrics;
    
    return {
      ...viewportSettings,
      onlyRenderVisibleElements: isLargeArchitecture,
      elevateNodesOnSelect: !shouldVirtualize,
      // Disable animations for very large architectures
      nodesDraggable: !shouldVirtualize,
      nodesConnectable: !shouldVirtualize,
      elementsSelectable: true,
    };
  }, [viewportSettings, performanceMetrics]);

  // Canvas action handlers
  const canvasActions = useMemo(() => ({
    fitView: () => {
      // Custom fit view implementation that considers all nodes
      const xValues = nodes.map(node => node.position.x);
      const yValues = nodes.map(node => node.position.y);
      
      if (xValues.length === 0) return;
      
      const minX = Math.min(...xValues);
      const maxX = Math.max(...xValues);
      const minY = Math.min(...yValues);
      const maxY = Math.max(...yValues);
      
      return {
        x: -(minX + maxX) / 2,
        y: -(minY + maxY) / 2,
        zoom: 0.8,
      };
    },
    
    centerNode: (nodeId: string) => {
      const node = nodes.find(n => n.id === nodeId);
      if (node) {
        return {
          x: -node.position.x + window.innerWidth / 2,
          y: -node.position.y + window.innerHeight / 2,
          zoom: 1,
        };
      }
      return null;
    },
    
    selectAllNodes: () => {
      return nodes.map(node => ({ ...node, selected: true }));
    },
    
    deselectAll: () => {
      return {
        nodes: nodes.map(node => ({ ...node, selected: false })),
        edges: edges.map(edge => ({ ...edge, selected: false })),
      };
    },
  }), [nodes, edges]);

  // Keyboard shortcuts for canvas operations
  const keyboardHandlers = useMemo(() => ({
    'Meta+a': canvasActions.selectAllNodes,
    'Escape': canvasActions.deselectAll,
    'Meta+=': () => ({ zoom: 1.2 }),
    'Meta+-': () => ({ zoom: 0.8 }),
    'Meta+0': canvasActions.fitView,
  }), [canvasActions]);

  return {
    // Optimized handlers
    onNodesChange: optimizedOnNodesChange,
    onEdgesChange: optimizedOnEdgesChange,
    onConnect: optimizedOnConnect,
    
    // Settings
    viewportSettings: adaptiveSettings,
    interactionSettings,
    
    // Performance metrics
    performanceMetrics,
    
    // Actions
    canvasActions,
    keyboardHandlers,
    
    // Utility functions
    isLargeArchitecture: performanceMetrics.isLargeArchitecture,
    shouldShowOptimizationWarning: performanceMetrics.recommendOptimizations,
  };
};