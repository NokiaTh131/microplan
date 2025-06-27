import { useState, useCallback, useEffect, useRef } from 'react';
import { Node, Edge } from '@xyflow/react';
import { useArchitectureStore } from '../stores/architectureStore';

export interface CollaborationUser {
  id: string;
  name: string;
  email: string;
  avatar?: string;
  color: string;
  isOnline: boolean;
  cursor?: { x: number; y: number; timestamp: number };
  lastSeen: string;
  activeNode?: string;
}

export interface ArchitectureComment {
  id: string;
  nodeId?: string;
  position: { x: number; y: number };
  author: CollaborationUser;
  content: string;
  timestamp: string;
  resolved: boolean;
  replies: ArchitectureComment[];
}

export interface VersionHistoryEntry {
  id: string;
  timestamp: string;
  author: CollaborationUser;
  message: string;
  changes: {
    nodesAdded: number;
    nodesRemoved: number;
    nodesModified: number;
    edgesAdded: number;
    edgesRemoved: number;
  };
  snapshot: {
    nodes: Node[];
    edges: Edge[];
  };
}

interface CollaborationState {
  isConnected: boolean;
  roomId: string | null;
  currentUser: CollaborationUser | null;
  onlineUsers: CollaborationUser[];
  comments: ArchitectureComment[];
  versionHistory: VersionHistoryEntry[];
  conflictedNodes: string[];
  userCursors: Map<string, { x: number; y: number; timestamp: number }>;
  nodeConflicts: Map<string, { user: CollaborationUser; changes: any; timestamp: number }[]>;
}

// Simulated WebSocket for demo purposes
class MockCollaborationService {
  private eventTarget = new EventTarget();
  private isConnected = false;
  // private _roomId: string | null = null;

  connect(roomId: string, user: CollaborationUser) {
    this.isConnected = true;
    // this._roomId = roomId;
    
    // Simulate connection delay
    setTimeout(() => {
      this.emit('connected', { user, roomId });
      this.emit('user-joined', { user });
    }, 1000);
  }

  disconnect() {
    if (this.isConnected) {
      this.emit('disconnected', {});
      this.isConnected = false;
      // this._roomId = null;
    }
  }

  sendNodeUpdate(nodeId: string, data: any) {
    if (this.isConnected) {
      // Simulate network delay and potential conflicts
      setTimeout(() => {
        this.emit('node-updated', { nodeId, data, timestamp: Date.now() });
      }, Math.random() * 500);
    }
  }

  sendComment(comment: ArchitectureComment) {
    if (this.isConnected) {
      setTimeout(() => {
        this.emit('comment-added', { comment });
      }, 200);
    }
  }

  sendCursorPosition(userId: string, position: { x: number; y: number }) {
    if (this.isConnected) {
      this.emit('cursor-moved', { userId, position, timestamp: Date.now() });
    }
  }

  sendNodeChange(nodeId: string, changes: any, userId: string) {
    if (this.isConnected) {
      setTimeout(() => {
        // Simulate potential conflicts
        const hasConflict = Math.random() < 0.1; // 10% chance of conflict
        this.emit('node-change', { 
          nodeId, 
          changes, 
          userId, 
          timestamp: Date.now(),
          hasConflict 
        });
      }, Math.random() * 300);
    }
  }

  sendEdgeChange(edgeId: string, changes: any, userId: string) {
    if (this.isConnected) {
      setTimeout(() => {
        this.emit('edge-change', { 
          edgeId, 
          changes, 
          userId, 
          timestamp: Date.now() 
        });
      }, Math.random() * 200);
    }
  }

  resolveConflict(nodeId: string, resolution: 'accept' | 'reject', userId: string) {
    if (this.isConnected) {
      this.emit('conflict-resolved', { nodeId, resolution, userId });
    }
  }

  createVersion(message: string, snapshot: any) {
    if (this.isConnected) {
      const version: VersionHistoryEntry = {
        id: `version-${Date.now()}`,
        timestamp: new Date().toISOString(),
        author: {
          id: 'current-user',
          name: 'Current User',
          email: 'user@example.com',
          color: '#3B82F6',
          isOnline: true,
          lastSeen: new Date().toISOString(),
        },
        message,
        changes: {
          nodesAdded: Math.floor(Math.random() * 3),
          nodesRemoved: Math.floor(Math.random() * 2),
          nodesModified: Math.floor(Math.random() * 5),
          edgesAdded: Math.floor(Math.random() * 3),
          edgesRemoved: Math.floor(Math.random() * 2),
        },
        snapshot,
      };
      
      setTimeout(() => {
        this.emit('version-created', { version });
      }, 300);
    }
  }

  private emit(event: string, data: any) {
    this.eventTarget.dispatchEvent(new CustomEvent(event, { detail: data }));
  }

  on(event: string, callback: (data: any) => void) {
    this.eventTarget.addEventListener(event, (e: any) => callback(e.detail));
  }

  off(event: string, callback: (data: any) => void) {
    this.eventTarget.removeEventListener(event, callback as any);
  }
}

export const useCollaboration = () => {
  const { nodes, edges, loadTemplate } = useArchitectureStore();
  const [state, setState] = useState<CollaborationState>({
    isConnected: false,
    roomId: null,
    currentUser: null,
    onlineUsers: [],
    comments: [],
    versionHistory: [],
    conflictedNodes: [],
    userCursors: new Map(),
    nodeConflicts: new Map(),
  });

  const collaborationService = useRef(new MockCollaborationService()).current;

  // Initialize current user
  useEffect(() => {
    // Create a new user profile (in-memory only)
    const newUser: CollaborationUser = {
      id: `user-${Date.now()}`,
      name: 'Anonymous User',
      email: '',
      color: '#3B82F6',
      isOnline: true,
      lastSeen: new Date().toISOString(),
    };
    setState(prev => ({ ...prev, currentUser: newUser }));
  }, []);

  // Setup collaboration event listeners
  useEffect(() => {
    const handleConnected = (data: any) => {
      setState(prev => ({
        ...prev,
        isConnected: true,
        roomId: data.roomId,
      }));
    };

    const handleUserJoined = (data: any) => {
      setState(prev => ({
        ...prev,
        onlineUsers: [...prev.onlineUsers.filter(u => u.id !== data.user.id), data.user],
      }));
    };

    const handleNodeUpdated = (data: any) => {
      // Handle real-time node updates
      console.log('Node updated by collaborator:', data);
    };

    const handleCommentAdded = (data: any) => {
      setState(prev => ({
        ...prev,
        comments: [...prev.comments, data.comment],
      }));
    };

    const handleVersionCreated = (data: any) => {
      setState(prev => ({
        ...prev,
        versionHistory: [data.version, ...prev.versionHistory],
      }));
    };

    const handleCursorMoved = (data: any) => {
      setState(prev => ({
        ...prev,
        userCursors: new Map(prev.userCursors.set(data.userId, {
          x: data.position.x,
          y: data.position.y,
          timestamp: data.timestamp
        })),
        onlineUsers: prev.onlineUsers.map(user => 
          user.id === data.userId 
            ? { ...user, cursor: { ...data.position, timestamp: data.timestamp } }
            : user
        )
      }));
    };

    const handleNodeChange = (data: any) => {
      if (data.hasConflict) {
        setState(prev => {
          const conflicts = prev.nodeConflicts.get(data.nodeId) || [];
          const user = prev.onlineUsers.find(u => u.id === data.userId);
          if (user) {
            conflicts.push({
              user,
              changes: data.changes,
              timestamp: data.timestamp
            });
          }
          return {
            ...prev,
            nodeConflicts: new Map(prev.nodeConflicts.set(data.nodeId, conflicts)),
            conflictedNodes: [...prev.conflictedNodes, data.nodeId].filter((id, index, arr) => arr.indexOf(id) === index)
          };
        });
      }
    };

    const handleConflictResolved = (data: any) => {
      setState(prev => ({
        ...prev,
        nodeConflicts: new Map(prev.nodeConflicts.set(data.nodeId, [])),
        conflictedNodes: prev.conflictedNodes.filter(id => id !== data.nodeId)
      }));
    };

    collaborationService.on('connected', handleConnected);
    collaborationService.on('user-joined', handleUserJoined);
    collaborationService.on('node-updated', handleNodeUpdated);
    collaborationService.on('comment-added', handleCommentAdded);
    collaborationService.on('version-created', handleVersionCreated);
    collaborationService.on('cursor-moved', handleCursorMoved);
    collaborationService.on('node-change', handleNodeChange);
    collaborationService.on('conflict-resolved', handleConflictResolved);

    return () => {
      collaborationService.off('connected', handleConnected);
      collaborationService.off('user-joined', handleUserJoined);
      collaborationService.off('node-updated', handleNodeUpdated);
      collaborationService.off('comment-added', handleCommentAdded);
      collaborationService.off('version-created', handleVersionCreated);
      collaborationService.off('cursor-moved', handleCursorMoved);
      collaborationService.off('node-change', handleNodeChange);
      collaborationService.off('conflict-resolved', handleConflictResolved);
    };
  }, [collaborationService]);

  const joinRoom = useCallback((roomId: string) => {
    if (state.currentUser) {
      collaborationService.connect(roomId, state.currentUser);
    }
  }, [state.currentUser, collaborationService]);

  const leaveRoom = useCallback(() => {
    collaborationService.disconnect();
    setState(prev => ({
      ...prev,
      isConnected: false,
      roomId: null,
      onlineUsers: [],
    }));
  }, [collaborationService]);

  const addComment = useCallback((content: string, position: { x: number; y: number }, nodeId?: string) => {
    if (!state.currentUser) return;

    const comment: ArchitectureComment = {
      id: `comment-${Date.now()}`,
      nodeId,
      position,
      author: state.currentUser,
      content,
      timestamp: new Date().toISOString(),
      resolved: false,
      replies: [],
    };

    collaborationService.sendComment(comment);
  }, [state.currentUser, collaborationService]);

  const resolveComment = useCallback((commentId: string) => {
    setState(prev => ({
      ...prev,
      comments: prev.comments.map(comment =>
        comment.id === commentId ? { ...comment, resolved: true } : comment
      ),
    }));
  }, []);

  const createVersion = useCallback((message: string) => {
    const snapshot = {
      nodes: [...nodes],
      edges: [...edges],
    };
    collaborationService.createVersion(message, snapshot);
  }, [nodes, edges, collaborationService]);

  const restoreVersion = useCallback((versionId: string) => {
    const version = state.versionHistory.find(v => v.id === versionId);
    if (version) {
      loadTemplate(version.snapshot.nodes, version.snapshot.edges);
    }
  }, [state.versionHistory, loadTemplate]);

  const updateUserProfile = useCallback((updates: Partial<CollaborationUser>) => {
    if (state.currentUser) {
      const updatedUser = { ...state.currentUser, ...updates };
      setState(prev => ({ ...prev, currentUser: updatedUser }));
    }
  }, [state.currentUser]);

  // Auto-create versions on significant changes
  useEffect(() => {
    if (nodes.length > 0 && state.isConnected) {
      const timer = setTimeout(() => {
        createVersion('Auto-save checkpoint');
      }, 30000); // Create version every 30 seconds

      return () => clearTimeout(timer);
    }
  }, [nodes.length, state.isConnected, createVersion]);

  const sendCursorUpdate = useCallback((position: { x: number; y: number }) => {
    if (state.currentUser && state.isConnected) {
      collaborationService.sendCursorPosition(state.currentUser.id, position);
    }
  }, [state.currentUser, state.isConnected, collaborationService]);

  const sendNodeUpdate = useCallback((nodeId: string, changes: any) => {
    if (state.currentUser && state.isConnected) {
      collaborationService.sendNodeChange(nodeId, changes, state.currentUser.id);
    }
  }, [state.currentUser, state.isConnected, collaborationService]);

  const resolveNodeConflict = useCallback((nodeId: string, resolution: 'accept' | 'reject') => {
    if (state.currentUser && state.isConnected) {
      collaborationService.resolveConflict(nodeId, resolution, state.currentUser.id);
    }
  }, [state.currentUser, state.isConnected, collaborationService]);

  return {
    ...state,
    joinRoom,
    leaveRoom,
    addComment,
    resolveComment,
    createVersion,
    restoreVersion,
    updateUserProfile,
    sendCursorUpdate,
    sendNodeUpdate,
    resolveNodeConflict,
    isCollaborationEnabled: state.isConnected,
  };
};