import { ServiceConfig } from '../stores/architectureStore';

export interface ValidationError {
  field: string;
  message: string;
  type: 'error' | 'warning' | 'info';
}

export interface ValidationResult {
  isValid: boolean;
  errors: ValidationError[];
  warnings: ValidationError[];
}

// Configuration constraints
export const VALIDATION_RULES = {
  name: {
    minLength: 1,
    maxLength: 63,
    pattern: /^[a-z0-9]([a-z0-9-]*[a-z0-9])?$/,
    message: 'Name must be 1-63 characters, lowercase letters, numbers, and hyphens only',
  },
  port: {
    min: 1,
    max: 65535,
    message: 'Port must be between 1 and 65535',
  },
  cpu: {
    min: 0.1,
    max: 32,
    message: 'CPU must be between 0.1 and 32 cores',
  },
  memory: {
    min: 128,
    max: 32768,
    message: 'Memory must be between 128MB and 32GB',
  },
  replicas: {
    min: 1,
    max: 100,
    message: 'Replicas must be between 1 and 100',
  },
} as const;

// Reserved ports for common services
const WELL_KNOWN_PORTS: Record<number, string> = {
  22: 'SSH',
  53: 'DNS',
  80: 'HTTP',
  443: 'HTTPS',
  3306: 'MySQL',
  5432: 'PostgreSQL',
  6379: 'Redis',
  9200: 'Elasticsearch',
  27017: 'MongoDB',
};

export const validateServiceConfig = (config: Partial<ServiceConfig>, existingConfigs: ServiceConfig[] = []): ValidationResult => {
  const errors: ValidationError[] = [];
  const warnings: ValidationError[] = [];

  // Validate name
  if (!config.name) {
    errors.push({
      field: 'name',
      message: 'Service name is required',
      type: 'error',
    });
  } else {
    if (config.name.length < VALIDATION_RULES.name.minLength) {
      errors.push({
        field: 'name',
        message: `Name must be at least ${VALIDATION_RULES.name.minLength} character`,
        type: 'error',
      });
    }
    
    if (config.name.length > VALIDATION_RULES.name.maxLength) {
      errors.push({
        field: 'name',
        message: `Name must not exceed ${VALIDATION_RULES.name.maxLength} characters`,
        type: 'error',
      });
    }
    
    if (!VALIDATION_RULES.name.pattern.test(config.name)) {
      errors.push({
        field: 'name',
        message: VALIDATION_RULES.name.message,
        type: 'error',
      });
    }

    // Check for duplicate names
    const duplicate = existingConfigs.find(c => c.name === config.name);
    if (duplicate) {
      errors.push({
        field: 'name',
        message: 'Service name must be unique',
        type: 'error',
      });
    }
  }

  // Validate port
  if (config.port !== undefined) {
    if (config.port < VALIDATION_RULES.port.min || config.port > VALIDATION_RULES.port.max) {
      errors.push({
        field: 'port',
        message: VALIDATION_RULES.port.message,
        type: 'error',
      });
    }

    // Check for port conflicts
    const portConflict = existingConfigs.find(c => c.port === config.port && c.name !== config.name);
    if (portConflict) {
      errors.push({
        field: 'port',
        message: `Port ${config.port} is already used by ${portConflict.name}`,
        type: 'error',
      });
    }

    // Warn about well-known ports
    if (WELL_KNOWN_PORTS[config.port]) {
      warnings.push({
        field: 'port',
        message: `Port ${config.port} is commonly used for ${WELL_KNOWN_PORTS[config.port]}`,
        type: 'warning',
      });
    }
  }

  // Validate CPU
  if (config.cpu !== undefined) {
    if (config.cpu < VALIDATION_RULES.cpu.min || config.cpu > VALIDATION_RULES.cpu.max) {
      errors.push({
        field: 'cpu',
        message: VALIDATION_RULES.cpu.message,
        type: 'error',
      });
    }

    // Performance warnings
    if (config.cpu > 8) {
      warnings.push({
        field: 'cpu',
        message: 'High CPU allocation may be expensive in production',
        type: 'warning',
      });
    }
  }

  // Validate memory
  if (config.memory !== undefined) {
    if (config.memory < VALIDATION_RULES.memory.min || config.memory > VALIDATION_RULES.memory.max) {
      errors.push({
        field: 'memory',
        message: VALIDATION_RULES.memory.message,
        type: 'error',
      });
    }

    // Performance warnings
    if (config.memory > 16384) {
      warnings.push({
        field: 'memory',
        message: 'High memory allocation may be expensive in production',
        type: 'warning',
      });
    }

    // Check CPU to memory ratio
    if (config.cpu && config.memory) {
      const ratio = config.memory / (config.cpu * 1024);
      if (ratio < 0.5) {
        warnings.push({
          field: 'memory',
          message: 'Low memory-to-CPU ratio may cause performance issues',
          type: 'warning',
        });
      }
      if (ratio > 8) {
        warnings.push({
          field: 'memory',
          message: 'High memory-to-CPU ratio may be inefficient',
          type: 'warning',
        });
      }
    }
  }

  // Validate replicas
  if (config.replicas !== undefined) {
    if (config.replicas < VALIDATION_RULES.replicas.min || config.replicas > VALIDATION_RULES.replicas.max) {
      errors.push({
        field: 'replicas',
        message: VALIDATION_RULES.replicas.message,
        type: 'error',
      });
    }

    // High availability warnings
    if (config.type === 'database' && config.replicas === 1) {
      warnings.push({
        field: 'replicas',
        message: 'Single database instance is a single point of failure',
        type: 'warning',
      });
    }

    if (config.replicas > 10) {
      warnings.push({
        field: 'replicas',
        message: 'High replica count may increase complexity and costs',
        type: 'warning',
      });
    }
  }

  // Validate health check path
  if (config.healthCheckPath && !config.healthCheckPath.startsWith('/')) {
    errors.push({
      field: 'healthCheckPath',
      message: 'Health check path must start with "/"',
      type: 'error',
    });
  }

  // Type-specific validations
  if (config.type === 'database' && config.healthCheckPath) {
    warnings.push({
      field: 'healthCheckPath',
      message: 'Databases typically use TCP health checks instead of HTTP',
      type: 'warning',
    });
  }

  if (config.type === 'cache' && config.replicas && config.replicas > 3) {
    warnings.push({
      field: 'replicas',
      message: 'Cache clusters typically use 3 or fewer replicas',
      type: 'warning',
    });
  }

  return {
    isValid: errors.length === 0,
    errors,
    warnings,
  };
};

export const validateEnvironmentVariables = (environment: Record<string, string>): ValidationError[] => {
  const errors: ValidationError[] = [];
  
  Object.entries(environment).forEach(([key, value]) => {
    // Validate environment variable names
    if (!/^[A-Z][A-Z0-9_]*$/.test(key)) {
      errors.push({
        field: 'environment',
        message: `Environment variable "${key}" should be uppercase with underscores`,
        type: 'warning',
      });
    }

    // Check for sensitive data
    const sensitivePatterns = [
      /password/i,
      /secret/i,
      /key/i,
      /token/i,
      /credential/i,
    ];

    if (sensitivePatterns.some(pattern => pattern.test(key)) && value && value !== '***') {
      errors.push({
        field: 'environment',
        message: `Sensitive variable "${key}" should not contain actual values`,
        type: 'warning',
      });
    }

    // Validate value format for common variables
    if (key.includes('PORT') && value && !/^\d+$/.test(value)) {
      errors.push({
        field: 'environment',
        message: `Port variable "${key}" should be a number`,
        type: 'error',
      });
    }

    if (key.includes('URL') && value && !/^https?:\/\//.test(value) && value !== 'localhost') {
      errors.push({
        field: 'environment',
        message: `URL variable "${key}" should start with http:// or https://`,
        type: 'warning',
      });
    }
  });

  return errors;
};