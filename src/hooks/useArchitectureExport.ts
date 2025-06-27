 
import { useCallback } from 'react';
import { Node, Edge } from '@xyflow/react';
import { useArchitectureStore } from '../stores/architectureStore';

interface ArchitectureExport {
  version: string;
  metadata: {
    name: string;
    description: string;
    createdAt: string;
    updatedAt: string;
  };
  nodes: Node[];
  edges: Edge[];
}

export const useArchitectureExport = () => {
  const { nodes, edges } = useArchitectureStore();

  const exportArchitecture = useCallback((name: string, description: string = ''): ArchitectureExport => {
    return {
      version: '1.0.0',
      metadata: {
        name,
        description,
        createdAt: new Date().toISOString(),
        updatedAt: new Date().toISOString()
      },
      nodes,
      edges
    };
  }, [nodes, edges]);

  const downloadArchitecture = useCallback((name: string, description: string = '') => {
    const architecture = exportArchitecture(name, description);
    const blob = new Blob([JSON.stringify(architecture, null, 2)], { type: 'application/json' });
    const url = URL.createObjectURL(blob);
    
    const a = document.createElement('a');
    a.href = url;
    a.download = `${name.toLowerCase().replace(/[^a-z0-9]/g, '-')}-architecture.json`;
    document.body.appendChild(a);
    a.click();
    document.body.removeChild(a);
    URL.revokeObjectURL(url);
  }, [exportArchitecture]);

  const copyToClipboard = useCallback(async (name: string, description: string = '') => {
    const architecture = exportArchitecture(name, description);
    try {
      await navigator.clipboard.writeText(JSON.stringify(architecture, null, 2));
      return true;
    } catch (error: unknown) {
      console.error('Failed to copy to clipboard:', error);
      return false;
    }
  }, [exportArchitecture]);

  return {
    exportArchitecture,
    downloadArchitecture,
    copyToClipboard
  };
};

export const useArchitectureImport = () => {
  const store = useArchitectureStore();

  const validateArchitecture = (data: any): data is ArchitectureExport => {
    return (
      data &&
      typeof data === 'object' &&
      data.version &&
      data.metadata &&
      Array.isArray(data.nodes) &&
      Array.isArray(data.edges)
    );
  };

  const importArchitecture = useCallback((architectureData: ArchitectureExport) => {
    if (!validateArchitecture(architectureData)) {
      throw new Error('Invalid architecture format');
    }

    // Create a mapping from original node IDs to new node IDs
    const nodeIdMapping: Record<string, string> = {};
    
    // Generate unique IDs for all nodes first
    architectureData.nodes.forEach(node => {
      nodeIdMapping[node.id] = `node-${Date.now()}-${Math.random().toString(36).substr(2, 9)}`;
    });
    
    // Create new nodes with mapped IDs
    const newNodes = architectureData.nodes.map(node => {
      const config = (node.data as any)?.config;
      return {
        id: nodeIdMapping[node.id],
        type: node.type || "serviceNode",
        position: node.position,
        data: { config }
      };
    }).filter(node => node.data.config);

    // Create new edges with mapped IDs
    const newEdges = architectureData.edges.map(edge => {
      const sourceNodeId = nodeIdMapping[edge.source];
      const targetNodeId = nodeIdMapping[edge.target];
      
      return {
        id: `edge-${Date.now()}-${Math.random().toString(36).substr(2, 9)}`,
        source: sourceNodeId,
        target: targetNodeId,
        sourceHandle: edge.sourceHandle,
        targetHandle: edge.targetHandle,
        type: edge.type || 'sync',
        data: edge.data || {
          communicationType: edge.type || 'sync',
          protocol: edge.type === 'sync' ? 'HTTP' : edge.type === 'async' ? 'Queue' : 'Data',
        }
      };
    });

    // Load architecture using the new batch method
    store.loadTemplate(newNodes as any, newEdges as any);
    
    console.log('Imported architecture with', newNodes.length, 'nodes and', newEdges.length, 'edges');
    
    return architectureData.metadata;
  }, [store]);

  const importFromFile = useCallback((file: File): Promise<any> => {
    return new Promise((resolve, reject) => {
      const reader = new FileReader();
      reader.onload = (e) => {
        try {
          const content = e.target?.result as string;
          const data = JSON.parse(content);
          const metadata = importArchitecture(data);
          resolve(metadata);
        } catch (error) {
          reject(error);
        }
      };
      reader.onerror = () => reject(new Error('Failed to read file'));
      reader.readAsText(file);
    });
  }, [importArchitecture]);

  const importFromText = useCallback((text: string) => {
    try {
      const data = JSON.parse(text);
      return importArchitecture(data);
    } catch {
      throw new Error('Invalid JSON format');
    }
  }, [importArchitecture]);

  return {
    importArchitecture,
    importFromFile,
    importFromText,
    validateArchitecture
  };
};