interface ServiceConfig {
  name: string;
  type: 'api' | 'database' | 'external' | 'infrastructure' | 'cache' | 'queue' | 'auth' | 'gateway' | 'monitoring' | 'storage' | 'search' | 'analytics' | 'ml' | 'cdn';
  techStack: string;
  port: number;
  healthCheckPath?: string;
  cpu: number;
  memory: number;
  replicas: number;
  environment: Record<string, string>;
  category?: string;
  description?: string;
}

export const serviceTemplates: Record<string, ServiceConfig> = {
  // Infrastructure & Load Balancers
  'nginx-gateway': {
    name: 'Nginx API Gateway',
    type: 'gateway',
    techStack: 'nginx',
    port: 80,
    healthCheckPath: '/health',
    cpu: 0.5,
    memory: 512,
    replicas: 2,
    category: 'Gateway',
    description: 'High-performance reverse proxy and load balancer',
    environment: {
      UPSTREAM_TIMEOUT: '30s',
      MAX_CONNECTIONS: '1000',
      WORKER_PROCESSES: 'auto',
      WORKER_CONNECTIONS: '1024'
    }
  },
  'traefik-gateway': {
    name: 'Traefik Gateway',
    type: 'gateway',
    techStack: 'traefik',
    port: 80,
    healthCheckPath: '/ping',
    cpu: 0.3,
    memory: 256,
    replicas: 2,
    category: 'Gateway',
    description: 'Modern reverse proxy with automatic service discovery',
    environment: {
      TRAEFIK_API_DASHBOARD: 'true',
      TRAEFIK_API_INSECURE: 'true',
      TRAEFIK_ENTRYPOINTS_WEB_ADDRESS: ':80'
    }
  },
  'envoy-proxy': {
    name: 'Envoy Proxy',
    type: 'gateway',
    techStack: 'envoy',
    port: 10000,
    healthCheckPath: '/ready',
    cpu: 0.5,
    memory: 512,
    replicas: 2,
    category: 'Gateway',
    description: 'Cloud-native edge and service proxy',
    environment: {
      ENVOY_ADMIN_PORT: '9901',
      ENVOY_LOG_LEVEL: 'info'
    }
  },
  'haproxy-lb': {
    name: 'HAProxy Load Balancer',
    type: 'gateway',
    techStack: 'haproxy',
    port: 80,
    healthCheckPath: '/stats',
    cpu: 0.5,
    memory: 256,
    replicas: 2,
    category: 'Gateway',
    description: 'Reliable, high-performance TCP/HTTP load balancer',
    environment: {
      HAPROXY_STATS_PORT: '8404',
      HAPROXY_STATS_USER: 'admin',
      HAPROXY_STATS_PASSWORD: 'password'
    }
  },

  // API Services
  'auth-service': {
    name: 'Auth Service',
    type: 'auth',
    techStack: 'express',
    port: 3001,
    healthCheckPath: '/health',
    cpu: 1,
    memory: 1024,
    replicas: 3,
    category: 'Authentication',
    description: 'JWT-based authentication and authorization',
    environment: {
      JWT_SECRET: 'your-secret-key',
      TOKEN_EXPIRY: '24h',
      BCRYPT_ROUNDS: '12'
    }
  },
  'user-service': {
    name: 'User Service',
    type: 'api',
    techStack: 'spring-boot',
    port: 8080,
    healthCheckPath: '/actuator/health',
    cpu: 1,
    memory: 1024,
    replicas: 2,
    category: 'Core Services',
    description: 'User management and profile service',
    environment: {
      SPRING_PROFILES_ACTIVE: 'production',
      SPRING_JPA_HIBERNATE_DDL_AUTO: 'validate'
    }
  },
  'payment-service': {
    name: 'Payment Service',
    type: 'api',
    techStack: 'fastapi',
    port: 8000,
    healthCheckPath: '/health',
    cpu: 2,
    memory: 2048,
    replicas: 3,
    category: 'Financial',
    description: 'Payment processing with Stripe integration',
    environment: {
      STRIPE_API_KEY: 'sk_test_...',
      WEBHOOK_ENDPOINT_SECRET: 'whsec_...',
      MAX_WORKERS: '4'
    }
  },
  'order-service': {
    name: 'Order Service',
    type: 'api',
    techStack: 'go-gin',
    port: 8081,
    healthCheckPath: '/health',
    cpu: 1.5,
    memory: 1536,
    replicas: 3,
    category: 'Core Services',
    description: 'Order management and processing',
    environment: {
      GOMAXPROCS: '2',
      GIN_MODE: 'release'
    }
  },
  'notification-service': {
    name: 'Notification Service',
    type: 'api',
    techStack: 'dotnet',
    port: 5000,
    healthCheckPath: '/health',
    cpu: 0.5,
    memory: 512,
    replicas: 2,
    category: 'Communication',
    description: 'Email, SMS, and push notifications',
    environment: {
      ASPNETCORE_ENVIRONMENT: 'Production',
      SENDGRID_API_KEY: 'SG.xxx',
      TWILIO_AUTH_TOKEN: 'xxx'
    }
  },
  'inventory-service': {
    name: 'Inventory Service',
    type: 'api',
    techStack: 'rust-actix',
    port: 8082,
    healthCheckPath: '/health',
    cpu: 1,
    memory: 512,
    replicas: 2,
    category: 'Core Services',
    description: 'Inventory management and stock tracking',
    environment: {
      RUST_LOG: 'info',
      ACTIX_WORKERS: '2'
    }
  },
  'search-service': {
    name: 'Search Service',
    type: 'search',
    techStack: 'elasticsearch',
    port: 9200,
    healthCheckPath: '/_health',
    cpu: 2,
    memory: 4096,
    replicas: 3,
    category: 'Search',
    description: 'Full-text search and analytics',
    environment: {
      'cluster.name': 'search-cluster',
      'node.name': 'search-node',
      'discovery.type': 'single-node'
    }
  },

  // Databases
  'postgres-db': {
    name: 'PostgreSQL',
    type: 'database',
    techStack: 'postgresql',
    port: 5432,
    cpu: 2,
    memory: 4096,
    replicas: 1,
    category: 'SQL Database',
    description: 'Advanced open-source relational database',
    environment: {
      POSTGRES_DB: 'app_db',
      POSTGRES_USER: 'app_user',
      POSTGRES_PASSWORD: 'secure_password',
      POSTGRES_SHARED_PRELOAD_LIBRARIES: 'pg_stat_statements'
    }
  },
  'mysql-db': {
    name: 'MySQL',
    type: 'database',
    techStack: 'mysql',
    port: 3306,
    cpu: 2,
    memory: 4096,
    replicas: 1,
    category: 'SQL Database',
    description: 'Popular open-source relational database',
    environment: {
      MYSQL_ROOT_PASSWORD: 'rootpassword',
      MYSQL_DATABASE: 'app_db',
      MYSQL_USER: 'app_user',
      MYSQL_PASSWORD: 'userpassword'
    }
  },
  'mongodb': {
    name: 'MongoDB',
    type: 'database',
    techStack: 'mongodb',
    port: 27017,
    cpu: 1.5,
    memory: 2048,
    replicas: 1,
    category: 'NoSQL Database',
    description: 'Document-oriented NoSQL database',
    environment: {
      MONGO_INITDB_ROOT_USERNAME: 'admin',
      MONGO_INITDB_ROOT_PASSWORD: 'password',
      MONGO_INITDB_DATABASE: 'app_db'
    }
  },
  'redis-cache': {
    name: 'Redis Cache',
    type: 'cache',
    techStack: 'redis',
    port: 6379,
    cpu: 0.5,
    memory: 1024,
    replicas: 1,
    category: 'Cache',
    description: 'In-memory data structure store',
    environment: {
      REDIS_PASSWORD: 'redis_password',
      REDIS_MAXMEMORY: '512mb',
      REDIS_MAXMEMORY_POLICY: 'allkeys-lru'
    }
  },
  'cassandra-db': {
    name: 'Cassandra',
    type: 'database',
    techStack: 'cassandra',
    port: 9042,
    cpu: 2,
    memory: 4096,
    replicas: 3,
    category: 'NoSQL Database',
    description: 'Distributed wide-column store database',
    environment: {
      CASSANDRA_CLUSTER_NAME: 'app-cluster',
      CASSANDRA_DC: 'dc1',
      CASSANDRA_RACK: 'rack1'
    }
  },
  'neo4j-graph': {
    name: 'Neo4j',
    type: 'database',
    techStack: 'neo4j',
    port: 7474,
    cpu: 1.5,
    memory: 2048,
    replicas: 1,
    category: 'Graph Database',
    description: 'Native graph database',
    environment: {
      NEO4J_AUTH: 'neo4j/password',
      NEO4J_dbms_memory_heap_initial__size: '512m',
      NEO4J_dbms_memory_heap_max__size: '1G'
    }
  },
  'influxdb-ts': {
    name: 'InfluxDB',
    type: 'database',
    techStack: 'influxdb',
    port: 8086,
    cpu: 1,
    memory: 1024,
    replicas: 1,
    category: 'Time Series DB',
    description: 'Time series database for metrics and events',
    environment: {
      INFLUXDB_DB: 'metrics',
      INFLUXDB_ADMIN_USER: 'admin',
      INFLUXDB_ADMIN_PASSWORD: 'password'
    }
  },

  // Message Queues & Streaming
  'rabbitmq-queue': {
    name: 'RabbitMQ',
    type: 'queue',
    techStack: 'rabbitmq',
    port: 5672,
    healthCheckPath: '/api/healthchecks/node',
    cpu: 1,
    memory: 1024,
    replicas: 3,
    category: 'Message Queue',
    description: 'Reliable message broker',
    environment: {
      RABBITMQ_DEFAULT_USER: 'admin',
      RABBITMQ_DEFAULT_PASS: 'password',
      RABBITMQ_MANAGEMENT_PORT: '15672'
    }
  },
  'kafka-stream': {
    name: 'Apache Kafka',
    type: 'queue',
    techStack: 'kafka',
    port: 9092,
    cpu: 2,
    memory: 2048,
    replicas: 3,
    category: 'Streaming',
    description: 'Distributed event streaming platform',
    environment: {
      KAFKA_ZOOKEEPER_CONNECT: 'zookeeper:2181',
      KAFKA_ADVERTISED_LISTENERS: 'PLAINTEXT://kafka:9092',
      KAFKA_OFFSETS_TOPIC_REPLICATION_FACTOR: '3'
    }
  },
  'apache-pulsar': {
    name: 'Apache Pulsar',
    type: 'queue',
    techStack: 'pulsar',
    port: 6650,
    cpu: 1.5,
    memory: 1536,
    replicas: 3,
    category: 'Streaming',
    description: 'Cloud-native pub-sub messaging',
    environment: {
      PULSAR_MEM: '-Xms1g -Xmx1g',
      PULSAR_STANDALONE: 'true'
    }
  },
  'nats-messaging': {
    name: 'NATS',
    type: 'queue',
    techStack: 'nats',
    port: 4222,
    cpu: 0.3,
    memory: 256,
    replicas: 3,
    category: 'Message Queue',
    description: 'Lightweight messaging system',
    environment: {
      NATS_CLUSTER_NAME: 'nats-cluster',
      NATS_CLIENT_PORT: '4222',
      NATS_MONITORING_PORT: '8222'
    }
  },

  // Monitoring & Observability
  'prometheus-monitoring': {
    name: 'Prometheus',
    type: 'monitoring',
    techStack: 'prometheus',
    port: 9090,
    healthCheckPath: '/-/healthy',
    cpu: 1,
    memory: 2048,
    replicas: 1,
    category: 'Monitoring',
    description: 'Systems monitoring and alerting toolkit',
    environment: {
      PROMETHEUS_STORAGE_TSDB_RETENTION_TIME: '15d',
      PROMETHEUS_STORAGE_TSDB_PATH: '/prometheus'
    }
  },
  'grafana-dashboard': {
    name: 'Grafana',
    type: 'monitoring',
    techStack: 'grafana',
    port: 3000,
    healthCheckPath: '/api/health',
    cpu: 0.5,
    memory: 512,
    replicas: 1,
    category: 'Monitoring',
    description: 'Analytics and monitoring dashboards',
    environment: {
      GF_SECURITY_ADMIN_PASSWORD: 'admin',
      GF_USERS_ALLOW_SIGN_UP: 'false'
    }
  },
  'jaeger-tracing': {
    name: 'Jaeger',
    type: 'monitoring',
    techStack: 'jaeger',
    port: 16686,
    healthCheckPath: '/',
    cpu: 0.5,
    memory: 512,
    replicas: 1,
    category: 'Tracing',
    description: 'Distributed tracing system',
    environment: {
      COLLECTOR_ZIPKIN_HTTP_PORT: '9411',
      QUERY_BASE_PATH: '/jaeger'
    }
  },
  'zipkin-tracing': {
    name: 'Zipkin',
    type: 'monitoring',
    techStack: 'zipkin',
    port: 9411,
    healthCheckPath: '/health',
    cpu: 0.5,
    memory: 512,
    replicas: 1,
    category: 'Tracing',
    description: 'Distributed tracing system',
    environment: {
      STORAGE_TYPE: 'mem',
      QUERY_PORT: '9411'
    }
  },
  'elk-stack': {
    name: 'ELK Stack',
    type: 'analytics',
    techStack: 'elastic-stack',
    port: 5601,
    healthCheckPath: '/api/status',
    cpu: 3,
    memory: 6144,
    replicas: 1,
    category: 'Logging',
    description: 'Elasticsearch, Logstash, and Kibana',
    environment: {
      ELASTIC_VERSION: '8.0.0',
      KIBANA_SYSTEM_PASSWORD: 'password'
    }
  },

  // External Services (Cloud Providers)
  'aws-s3': {
    name: 'AWS S3',
    type: 'storage',
    techStack: 'aws-s3',
    port: 443,
    cpu: 0,
    memory: 0,
    replicas: 0,
    category: 'Storage',
    description: 'Object storage service',
    environment: {
      AWS_REGION: 'us-east-1',
      AWS_ACCESS_KEY_ID: 'AKIA...',
      AWS_SECRET_ACCESS_KEY: '...'
    }
  },
  'aws-rds': {
    name: 'AWS RDS',
    type: 'external',
    techStack: 'aws-rds',
    port: 5432,
    cpu: 0,
    memory: 0,
    replicas: 0,
    category: 'Database',
    description: 'Managed relational database',
    environment: {
      RDS_ENDPOINT: 'mydb.cluster-xxx.us-east-1.rds.amazonaws.com',
      RDS_PORT: '5432'
    }
  },
  'aws-lambda': {
    name: 'AWS Lambda',
    type: 'external',
    techStack: 'aws-lambda',
    port: 443,
    cpu: 0,
    memory: 0,
    replicas: 0,
    category: 'Serverless',
    description: 'Serverless compute service',
    environment: {
      LAMBDA_RUNTIME: 'nodejs18.x',
      LAMBDA_TIMEOUT: '30'
    }
  },
  'azure-blob': {
    name: 'Azure Blob Storage',
    type: 'external',
    techStack: 'azure-blob',
    port: 443,
    cpu: 0,
    memory: 0,
    replicas: 0,
    category: 'Storage',
    description: 'Object storage for Azure',
    environment: {
      AZURE_STORAGE_ACCOUNT: 'mystorageaccount',
      AZURE_STORAGE_CONTAINER: 'mycontainer'
    }
  },
  'gcp-firestore': {
    name: 'Google Firestore',
    type: 'external',
    techStack: 'gcp-firestore',
    port: 443,
    cpu: 0,
    memory: 0,
    replicas: 0,
    category: 'Database',
    description: 'NoSQL document database',
    environment: {
      GOOGLE_PROJECT_ID: 'my-project',
      GOOGLE_APPLICATION_CREDENTIALS: '/path/to/service-account.json'
    }
  },
  'stripe-payments': {
    name: 'Stripe API',
    type: 'external',
    techStack: 'stripe',
    port: 443,
    cpu: 0,
    memory: 0,
    replicas: 0,
    category: 'Payment',
    description: 'Payment processing API',
    environment: {
      STRIPE_PUBLISHABLE_KEY: 'pk_test_...',
      STRIPE_SECRET_KEY: 'sk_test_...'
    }
  },
  'sendgrid-email': {
    name: 'SendGrid',
    type: 'external',
    techStack: 'sendgrid',
    port: 443,
    cpu: 0,
    memory: 0,
    replicas: 0,
    category: 'Communication',
    description: 'Email delivery service',
    environment: {
      SENDGRID_API_KEY: 'SG.xxx',
      FROM_EMAIL: 'noreply@example.com'
    }
  },
  'twilio-sms': {
    name: 'Twilio',
    type: 'external',
    techStack: 'twilio',
    port: 443,
    cpu: 0,
    memory: 0,
    replicas: 0,
    category: 'Communication',
    description: 'SMS and communication APIs',
    environment: {
      TWILIO_ACCOUNT_SID: 'ACxxx',
      TWILIO_AUTH_TOKEN: 'xxx',
      TWILIO_PHONE_NUMBER: '+1234567890'
    }
  }
};

// Service categories for better organization
export const serviceCategories = [
  'Gateway',
  'Authentication', 
  'Core Services',
  'Financial',
  'Communication',
  'Search',
  'SQL Database',
  'NoSQL Database',
  'Cache',
  'Graph Database',
  'Time Series DB',
  'Message Queue',
  'Streaming',
  'Monitoring',
  'Tracing',
  'Logging',
  'Storage',
  'Serverless',
  'Payment'
];

// Performance optimization configs
export const performanceConfigs = {
  highThroughput: {
    cpu: 4,
    memory: 8192,
    replicas: 5,
    environment: {
      MAX_CONNECTIONS: '10000',
      WORKER_PROCESSES: 'auto',
      KEEPALIVE_TIMEOUT: '65'
    }
  },
  lowLatency: {
    cpu: 2,
    memory: 4096,
    replicas: 3,
    environment: {
      TCP_NODELAY: 'true',
      CONNECTION_POOL_SIZE: '100'
    }
  },
  costOptimized: {
    cpu: 0.25,
    memory: 256,
    replicas: 1,
    environment: {
      MIN_IDLE_CONNECTIONS: '1',
      MAX_IDLE_CONNECTIONS: '5'
    }
  }
};