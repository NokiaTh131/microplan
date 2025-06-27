import toast from 'react-hot-toast';

// Centralized notification system with consistent messaging
export const notify = {
  success: (message: string) => {
    toast.success(message);
  },
  
  error: (message: string, error?: Error) => {
    const errorMessage = error ? `${message}: ${error.message}` : message;
    toast.error(errorMessage);
  },
  
  loading: (message: string) => {
    return toast.loading(message);
  },
  
  dismiss: (toastId: string) => {
    toast.dismiss(toastId);
  },
  
  promise: <T>(
    promise: Promise<T>,
    messages: {
      loading: string;
      success: string | ((data: T) => string);
      error: string | ((error: Error) => string);
    }
  ) => {
    return toast.promise(promise, messages);
  },
};

// Specific notification functions for common operations
export const serviceNotifications = {
  added: (serviceName: string) => 
    notify.success(`Added ${serviceName} service to architecture`),
  
  removed: (serviceName: string) => 
    notify.success(`Removed ${serviceName} service from architecture`),
  
  updated: (serviceName: string) => 
    notify.success(`Updated ${serviceName} configuration`),
  
  connected: (source: string, target: string) => 
    notify.success(`Connected ${source} to ${target}`),
  
  disconnected: (source: string, target: string) => 
    notify.success(`Disconnected ${source} from ${target}`),
  
  duplicated: (serviceName: string, count: number) => 
    notify.success(`Duplicated ${serviceName} (${count} copies created)`),
};

export const codeGenNotifications = {
  generating: (format: string) => 
    notify.loading(`Generating ${format} configuration...`),
  
  generated: (format: string, toastId?: string) => {
    if (toastId) notify.dismiss(toastId);
    notify.success(`${format} configuration generated successfully`);
  },
  
  copied: (format: string) => 
    notify.success(`${format} configuration copied to clipboard`),
  
  exported: (format: string, filename: string) => 
    notify.success(`Exported ${format} as ${filename}`),
  
  error: (format: string, error: Error) => 
    notify.error(`Failed to generate ${format}`, error),
};

export const analysisNotifications = {
  analyzing: () => 
    notify.loading('Analyzing architecture...'),
  
  complete: (issuesFound: number, toastId?: string) => {
    if (toastId) notify.dismiss(toastId);
    if (issuesFound === 0) {
      notify.success('Architecture analysis complete - no issues found!');
    } else {
      notify.success(`Architecture analysis complete - ${issuesFound} issue(s) found`);
    }
  },
  
  error: (error: Error) => 
    notify.error('Failed to analyze architecture', error),
};

export const collaborationNotifications = {
  userJoined: (userName: string) => 
    notify.success(`${userName} joined the collaboration session`),
  
  userLeft: (userName: string) => 
    notify.success(`${userName} left the collaboration session`),
  
  conflictDetected: (nodeId: string) => 
    notify.error(`Conflict detected on node ${nodeId}. Please resolve manually.`),
  
  conflictResolved: (nodeId: string) => 
    notify.success(`Conflict resolved for node ${nodeId}`),
  
  commentAdded: (nodeId: string) => 
    notify.success(`Comment added to ${nodeId}`),
  
  versionCreated: (version: string) => 
    notify.success(`Version ${version} created successfully`),
};

export const simulationNotifications = {
  started: () => 
    notify.success('Simulation started - monitoring system health'),
  
  stopped: () => 
    notify.success('Simulation stopped - system reset'),
  
  realisticModeEnabled: () => 
    notify.success('Realistic simulation mode enabled with advanced metrics'),
  
  realisticModeDisabled: () => 
    notify.success('Realistic simulation mode disabled'),
  
  failureTriggered: (pattern: string, services: string[]) => 
    notify.error(`${pattern.toUpperCase()} failure triggered affecting ${services.join(', ')}`),
  
  failureRecovered: (pattern: string, duration: number) => 
    notify.success(`Recovered from ${pattern} failure (duration: ${duration}min)`),
  
  loadTestStarted: (scenario: string) => 
    notify.success(`Load test started: ${scenario}`),
  
  loadTestCompleted: (scenario: string, dataPoints: number) => 
    notify.success(`Load test completed: ${scenario} (${dataPoints} data points collected)`),
  
  chaosExperimentStarted: (experiment: string, target: string) => 
    notify.error(`Chaos experiment: ${experiment} targeting ${target}`),
};

export const importExportNotifications = {
  templateLoading: (templateName: string) => 
    notify.loading(`Loading ${templateName} template...`),
  
  templateLoaded: (templateName: string, services: number, toastId?: string) => {
    if (toastId) notify.dismiss(toastId);
    notify.success(`Loaded ${templateName} template with ${services} services`);
  },
  
  projectSaving: () => 
    notify.loading('Saving project...'),
  
  projectSaved: (projectName: string, toastId?: string) => {
    if (toastId) notify.dismiss(toastId);
    notify.success(`Project "${projectName}" saved successfully`);
  },
  
  projectLoading: (projectName: string) => 
    notify.loading(`Loading project "${projectName}"...`),
  
  projectLoaded: (projectName: string, toastId?: string) => {
    if (toastId) notify.dismiss(toastId);
    notify.success(`Project "${projectName}" loaded successfully`);
  },
  
  backupCreated: (backupName: string) => 
    notify.success(`Backup "${backupName}" created successfully`),
  
  backupRestored: (backupName: string) => 
    notify.success(`Restored from backup "${backupName}"`),
  
  error: (operation: string, error: Error) => 
    notify.error(`Failed to ${operation}`, error),
};