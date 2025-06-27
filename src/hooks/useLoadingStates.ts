import { useState, useCallback, useRef } from "react";

interface LoadingState {
  isLoading: boolean;
  error: string | null;
  progress?: number;
}

interface LoadingStates {
  [key: string]: LoadingState;
}

// Hook for managing multiple loading states across the application
export const useLoadingStates = () => {
  const [loadingStates, setLoadingStates] = useState<LoadingStates>({});
  const timeoutRefs = useRef<Map<string, ReturnType<typeof setTimeout>>>(new Map());

  // Set loading state for a specific operation
  const setLoading = useCallback(
    (key: string, isLoading: boolean, error?: string, progress?: number) => {
      setLoadingStates((prev) => ({
        ...prev,
        [key]: {
          isLoading,
          error: error || null,
          progress,
        },
      }));

      // Clear any existing timeout for this key
      const existingTimeout = timeoutRefs.current.get(key);
      if (existingTimeout) {
        clearTimeout(existingTimeout);
        timeoutRefs.current.delete(key);
      }

      // Auto-clear loading state after 30 seconds to prevent stuck states
      if (isLoading) {
        const timeout = setTimeout(() => {
          setLoadingStates((prev) => ({
            ...prev,
            [key]: {
              isLoading: false,
              error: "Operation timed out",
              progress: undefined,
            },
          }));
          timeoutRefs.current.delete(key);
        }, 30000);

        timeoutRefs.current.set(key, timeout);
      }
    },
    []
  );

  // Start loading for a specific operation
  const startLoading = useCallback(
    (key: string, progress?: number) => {
      setLoading(key, true, undefined, progress);
    },
    [setLoading]
  );

  // Stop loading for a specific operation
  const stopLoading = useCallback(
    (key: string, error?: string) => {
      setLoading(key, false, error);
    },
    [setLoading]
  );

  // Update progress for a loading operation
  const updateProgress = useCallback((key: string, progress: number) => {
    setLoadingStates((prev) => ({
      ...prev,
      [key]: {
        ...prev[key],
        progress,
      },
    }));
  }, []);

  // Clear all loading states
  const clearAll = useCallback(() => {
    // Clear all timeouts
    timeoutRefs.current.forEach((timeout) => clearTimeout(timeout));
    timeoutRefs.current.clear();

    setLoadingStates({});
  }, []);

  // Get loading state for a specific operation
  const getLoadingState = useCallback(
    (key: string): LoadingState => {
      return loadingStates[key] || { isLoading: false, error: null };
    },
    [loadingStates]
  );

  // Check if any operation is loading
  const isAnyLoading = useCallback(() => {
    return Object.values(loadingStates).some((state) => state.isLoading);
  }, [loadingStates]);

  // Execute an async operation with automatic loading state management
  const executeWithLoading = useCallback(
    async <T>(
      key: string,
      operation: () => Promise<T>,
      options?: {
        onProgress?: (progress: number) => void;
        timeout?: number;
      }
    ): Promise<T> => {
      try {
        startLoading(key);

        // Set up progress tracking if provided
        if (options?.onProgress) {
          const progressInterval = setInterval(() => {
            // Simulate progress updates - in real implementation, this would be driven by the operation
            const currentState = getLoadingState(key);
            const currentProgress = currentState.progress || 0;
            if (currentProgress < 90) {
              updateProgress(key, Math.min(currentProgress + 10, 90));
            }
          }, 200);

          setTimeout(
            () => clearInterval(progressInterval),
            options.timeout || 5000
          );
        }

        const result = await operation();
        stopLoading(key);
        return result;
      } catch (error) {
        const errorMessage =
          error instanceof Error ? error.message : "Unknown error occurred";
        stopLoading(key, errorMessage);
        throw error;
      }
    },
    [startLoading, stopLoading, getLoadingState, updateProgress]
  );

  // Predefined loading keys for common operations
  const loadingKeys = {
    ANALYSIS: "architecture-analysis",
    CODE_GENERATION: "code-generation",
    TEMPLATE_LOADING: "template-loading",
    PROJECT_SAVING: "project-saving",
    PROJECT_LOADING: "project-loading",
    EXPORT: "export-operation",
    IMPORT: "import-operation",
    COLLABORATION_SYNC: "collaboration-sync",
    SIMULATION: "simulation-operation",
    BACKUP_CREATION: "backup-creation",
    BACKUP_RESTORE: "backup-restore",
  } as const;

  return {
    // State management
    loadingStates,
    setLoading,
    startLoading,
    stopLoading,
    updateProgress,
    clearAll,

    // Queries
    getLoadingState,
    isAnyLoading,
    isLoading: (key: string) => getLoadingState(key).isLoading,
    getError: (key: string) => getLoadingState(key).error,
    getProgress: (key: string) => getLoadingState(key).progress,

    // Utilities
    executeWithLoading,
    loadingKeys,
  };
};
