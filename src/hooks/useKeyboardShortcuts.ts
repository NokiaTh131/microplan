import { useEffect, useCallback, useRef, useMemo } from "react";
import { useArchitectureStore } from "../stores/architectureStore";
import { notify } from "../utils/notifications";

interface ShortcutAction {
  description: string;
  action: () => void;
  preventDefault?: boolean;
}

interface ShortcutMap {
  [key: string]: ShortcutAction;
}

// Hook for managing keyboard shortcuts throughout the application
export const useKeyboardShortcuts = () => {
  const {
    nodes,
    selectedNode,
    selectedEdge,
    deleteNode,
    deleteEdge,
    selectNode,
    selectEdge,
  } = useArchitectureStore();

  const isInputFocused = useRef(false);

  // Track input focus to avoid triggering shortcuts when typing
  const handleFocusChange = useCallback(() => {
    const activeElement = document.activeElement;
    isInputFocused.current =
      activeElement?.tagName === "INPUT" ||
      activeElement?.tagName === "TEXTAREA" ||
      (activeElement as HTMLElement | null)?.contentEditable === "true";
  }, []);

  // Canvas navigation shortcuts
  const canvasShortcuts: ShortcutMap = useMemo(
    () => ({
      "Meta+0": {
        description: "Fit all nodes to view",
        action: () => {
          // Trigger fit view - this would be handled by the canvas component
          const event = new CustomEvent("fit-view");
          window.dispatchEvent(event);
          notify.success("Fit all nodes to view");
        },
      },
      "Meta+=": {
        description: "Zoom in",
        action: () => {
          const event = new CustomEvent("zoom-in");
          window.dispatchEvent(event);
        },
      },
      "Meta+-": {
        description: "Zoom out",
        action: () => {
          const event = new CustomEvent("zoom-out");
          window.dispatchEvent(event);
        },
      },
      "Meta+a": {
        description: "Select all nodes",
        action: () => {
          const event = new CustomEvent("select-all");
          window.dispatchEvent(event);
          notify.success(`Selected ${nodes.length} nodes`);
        },
        preventDefault: true,
      },
      Escape: {
        description: "Deselect all",
        action: () => {
          selectNode(null);
          selectEdge(null);
          const event = new CustomEvent("deselect-all");
          window.dispatchEvent(event);
        },
      },
    }),
    [nodes.length, selectNode, selectEdge]
  );

  // Node and edge management shortcuts
  const managementShortcuts: ShortcutMap = useMemo(() => ({
    Delete: {
      description: "Delete selected node or edge",
      action: () => {
        if (selectedNode) {
          deleteNode(selectedNode.id);
        } else if (selectedEdge) {
          deleteEdge(selectedEdge.id);
        }
      },
    },
    Backspace: {
      description: "Delete selected node or edge",
      action: () => {
        if (selectedNode) {
          deleteNode(selectedNode.id);
        } else if (selectedEdge) {
          deleteEdge(selectedEdge.id);
        }
      },
    },
    "Meta+d": {
      description: "Duplicate selected node",
      action: () => {
        if (selectedNode) {
          const event = new CustomEvent("duplicate-node", {
            detail: selectedNode,
          });
          window.dispatchEvent(event);
        }
      },
      preventDefault: true,
    },
    "Meta+g": {
      description: "Group selected nodes",
      action: () => {
        const event = new CustomEvent("group-nodes");
        window.dispatchEvent(event);
        notify.success("Group nodes feature coming soon!");
      },
      preventDefault: true,
    },
  }), [selectedNode, selectedEdge, deleteNode, deleteEdge]);

  // File operations shortcuts
  const fileShortcuts: ShortcutMap = useMemo(() => ({
    "Meta+s": {
      description: "Save project",
      action: () => {
        const event = new CustomEvent("save-project");
        window.dispatchEvent(event);
      },
      preventDefault: true,
    },
    "Meta+o": {
      description: "Open project",
      action: () => {
        const event = new CustomEvent("open-project");
        window.dispatchEvent(event);
      },
      preventDefault: true,
    },
    "Meta+e": {
      description: "Export architecture",
      action: () => {
        const event = new CustomEvent("export-architecture");
        window.dispatchEvent(event);
      },
      preventDefault: true,
    },
    "Meta+i": {
      description: "Import architecture",
      action: () => {
        const event = new CustomEvent("import-architecture");
        window.dispatchEvent(event);
      },
      preventDefault: true,
    },
  }), []);

  // Panel navigation shortcuts
  const panelShortcuts: ShortcutMap = useMemo(() => ({
    "Meta+1": {
      description: "Switch to Analysis panel",
      action: () => {
        const event = new CustomEvent("switch-panel", { detail: "analysis" });
        window.dispatchEvent(event);
      },
      preventDefault: true,
    },
    "Meta+2": {
      description: "Switch to Code Generation panel",
      action: () => {
        const event = new CustomEvent("switch-panel", { detail: "codegen" });
        window.dispatchEvent(event);
      },
      preventDefault: true,
    },
    "Meta+3": {
      description: "Switch to Performance panel",
      action: () => {
        const event = new CustomEvent("switch-panel", {
          detail: "performance",
        });
        window.dispatchEvent(event);
      },
      preventDefault: true,
    },
    "Meta+4": {
      description: "Switch to Simulation panel",
      action: () => {
        const event = new CustomEvent("switch-panel", { detail: "simulation" });
        window.dispatchEvent(event);
      },
      preventDefault: true,
    },
    "Meta+5": {
      description: "Switch to Security panel",
      action: () => {
        const event = new CustomEvent("switch-panel", { detail: "security" });
        window.dispatchEvent(event);
      },
      preventDefault: true,
    },
    "Meta+6": {
      description: "Switch to Collaboration panel",
      action: () => {
        const event = new CustomEvent("switch-panel", {
          detail: "collaboration",
        });
        window.dispatchEvent(event);
      },
      preventDefault: true,
    },
  }), []);

  // Simulation shortcuts
  const simulationShortcuts: ShortcutMap = useMemo(() => ({
    "Meta+r": {
      description: "Start/Stop simulation",
      action: () => {
        const event = new CustomEvent("toggle-simulation");
        window.dispatchEvent(event);
      },
      preventDefault: true,
    },
    "Meta+Shift+r": {
      description: "Toggle realistic simulation mode",
      action: () => {
        const event = new CustomEvent("toggle-realistic-simulation");
        window.dispatchEvent(event);
      },
      preventDefault: true,
    },
  }), []);

  // Quick actions shortcuts
  const quickActionShortcuts: ShortcutMap = useMemo(() => ({
    "Meta+/": {
      description: "Show keyboard shortcuts help",
      action: () => {
        const event = new CustomEvent("show-shortcuts-help");
        window.dispatchEvent(event);
      },
      preventDefault: true,
    },
    F1: {
      description: "Show help",
      action: () => {
        notify.success("Help feature coming soon!");
      },
      preventDefault: true,
    },
    "Meta+,": {
      description: "Open settings",
      action: () => {
        const event = new CustomEvent("open-settings");
        window.dispatchEvent(event);
      },
      preventDefault: true,
    },
  }), []);

  // Combine all shortcuts
  const allShortcuts: ShortcutMap = useMemo(
    () => ({
      ...canvasShortcuts,
      ...managementShortcuts,
      ...fileShortcuts,
      ...panelShortcuts,
      ...simulationShortcuts,
      ...quickActionShortcuts,
    }),
    [
      canvasShortcuts,
      managementShortcuts,
      fileShortcuts,
      panelShortcuts,
      simulationShortcuts,
      quickActionShortcuts,
    ]
  );

  // Create key combination string from keyboard event
  const getKeyCombo = useCallback((event: KeyboardEvent): string => {
    const parts: string[] = [];

    if (event.metaKey) parts.push("Meta");
    if (event.ctrlKey && !event.metaKey) parts.push("Ctrl");
    if (event.altKey) parts.push("Alt");
    if (event.shiftKey) parts.push("Shift");

    // Handle special keys
    if (event.key === " ") parts.push("Space");
    else if (event.key === "Enter") parts.push("Enter");
    else if (event.key === "Escape") parts.push("Escape");
    else if (event.key === "Delete") parts.push("Delete");
    else if (event.key === "Backspace") parts.push("Backspace");
    else if (event.key === "Tab") parts.push("Tab");
    else if (event.key === "ArrowUp") parts.push("ArrowUp");
    else if (event.key === "ArrowDown") parts.push("ArrowDown");
    else if (event.key === "ArrowLeft") parts.push("ArrowLeft");
    else if (event.key === "ArrowRight") parts.push("ArrowRight");
    else if (event.key.length === 1) {
      parts.push(event.key);
    } else {
      parts.push(event.key);
    }

    return parts.join("+");
  }, []);

  // Handle keyboard events
  const handleKeyDown = useCallback(
    (event: KeyboardEvent) => {
      // Don't trigger shortcuts when typing in inputs
      if (isInputFocused.current) return;

      const keyCombo = getKeyCombo(event);
      const shortcut = allShortcuts[keyCombo];

      if (shortcut) {
        if (shortcut.preventDefault) {
          event.preventDefault();
        }
        shortcut.action();
      }
    },
    [allShortcuts, getKeyCombo]
  );

  // Set up event listeners
  useEffect(() => {
    // Focus tracking
    document.addEventListener("focusin", handleFocusChange);
    document.addEventListener("focusout", handleFocusChange);

    // Keyboard events
    document.addEventListener("keydown", handleKeyDown);

    return () => {
      document.removeEventListener("focusin", handleFocusChange);
      document.removeEventListener("focusout", handleFocusChange);
      document.removeEventListener("keydown", handleKeyDown);
    };
  }, [handleKeyDown, handleFocusChange]);

  // Get help text for shortcuts
  const getShortcutsHelp = useCallback(() => {
    return Object.entries(allShortcuts).map(([key, action]) => ({
      key,
      description: action.description,
    }));
  }, [allShortcuts]);

  return {
    shortcuts: allShortcuts,
    getShortcutsHelp,
    isInputFocused: () => isInputFocused.current,
  };
};
