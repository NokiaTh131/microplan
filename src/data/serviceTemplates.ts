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
  },

  // AI/ML Services
  'ollama-llm': {
    name: 'Ollama LLM Server',
    type: 'ml',
    techStack: 'ollama',
    port: 11434,
    healthCheckPath: '/api/tags',
    cpu: 4,
    memory: 8192,
    replicas: 1,
    category: 'AI/ML',
    description: 'Local LLM inference server (Llama2, CodeLlama, Mistral)',
    environment: {
      OLLAMA_HOST: '0.0.0.0',
      OLLAMA_MODELS: '/app/models',
      OLLAMA_NUM_PARALLEL: '2',
      OLLAMA_MAX_LOADED_MODELS: '3'
    }
  },
  'mlflow-tracking': {
    name: 'MLflow Tracking',
    type: 'ml',
    techStack: 'mlflow',
    port: 5000,
    healthCheckPath: '/health',
    cpu: 2,
    memory: 4096,
    replicas: 1,
    category: 'AI/ML',
    description: 'ML lifecycle management and experiment tracking',
    environment: {
      MLFLOW_BACKEND_STORE_URI: 'postgresql://user:pass@postgres:5432/mlflow',
      MLFLOW_DEFAULT_ARTIFACT_ROOT: 's3://mlflow-artifacts/',
      MLFLOW_SERVER_HOST: '0.0.0.0',
      MLFLOW_SERVER_PORT: '5000'
    }
  },
  'jupyter-notebook': {
    name: 'Jupyter Lab',
    type: 'ml',
    techStack: 'jupyter',
    port: 8888,
    healthCheckPath: '/api/status',
    cpu: 2,
    memory: 4096,
    replicas: 1,
    category: 'AI/ML',
    description: 'Interactive computing environment for data science',
    environment: {
      JUPYTER_ENABLE_LAB: 'yes',
      JUPYTER_TOKEN: 'your-secure-token',
      GRANT_SUDO: 'yes',
      CHOWN_HOME: 'yes'
    }
  },
  'tensorboard-viz': {
    name: 'TensorBoard',
    type: 'ml',
    techStack: 'tensorboard',
    port: 6006,
    healthCheckPath: '/',
    cpu: 1,
    memory: 2048,
    replicas: 1,
    category: 'AI/ML',
    description: 'TensorFlow visualization toolkit',
    environment: {
      TENSORBOARD_LOG_DIR: '/logs',
      TENSORBOARD_HOST: '0.0.0.0',
      TENSORBOARD_PORT: '6006'
    }
  },
  'huggingface-tgi': {
    name: 'HuggingFace TGI',
    type: 'ml',
    techStack: 'text-generation-inference',
    port: 8080,
    healthCheckPath: '/health',
    cpu: 4,
    memory: 16384,
    replicas: 1,
    category: 'AI/ML',
    description: 'Text Generation Inference server for LLMs',
    environment: {
      MODEL_ID: 'microsoft/DialoGPT-medium',
      NUM_SHARD: '1',
      MAX_CONCURRENT_REQUESTS: '128',
      MAX_BEST_OF: '2',
      MAX_STOP_SEQUENCES: '4'
    }
  },
  'vllm-server': {
    name: 'vLLM Server',
    type: 'ml',
    techStack: 'vllm',
    port: 8000,
    healthCheckPath: '/health',
    cpu: 8,
    memory: 32768,
    replicas: 1,
    category: 'AI/ML',
    description: 'High-throughput LLM inference server',
    environment: {
      MODEL: 'microsoft/DialoGPT-large',
      HOST: '0.0.0.0',
      PORT: '8000',
      TENSOR_PARALLEL_SIZE: '1',
      GPU_MEMORY_UTILIZATION: '0.9'
    }
  },
  'whisper-api': {
    name: 'Whisper ASR',
    type: 'ml',
    techStack: 'whisper',
    port: 9000,
    healthCheckPath: '/health',
    cpu: 4,
    memory: 8192,
    replicas: 1,
    category: 'AI/ML',
    description: 'Automatic Speech Recognition API',
    environment: {
      MODEL_SIZE: 'base',
      DEVICE: 'cpu',
      COMPUTE_TYPE: 'int8',
      BEAM_SIZE: '5'
    }
  },
  'stable-diffusion-api': {
    name: 'Stable Diffusion API',
    type: 'ml',
    techStack: 'stable-diffusion',
    port: 7860,
    healthCheckPath: '/health',
    cpu: 4,
    memory: 12288,
    replicas: 1,
    category: 'AI/ML',
    description: 'Text-to-image generation API',
    environment: {
      MODEL_ID: 'runwayml/stable-diffusion-v1-5',
      DEVICE: 'cuda',
      PRECISION: 'fp16',
      SAFETY_CHECKER: 'true'
    }
  },
  'langchain-api': {
    name: 'LangChain API',
    type: 'ml',
    techStack: 'langchain',
    port: 8080,
    healthCheckPath: '/health',
    cpu: 2,
    memory: 4096,
    replicas: 2,
    category: 'AI/ML',
    description: 'LLM application framework API',
    environment: {
      OPENAI_API_KEY: 'sk-xxx',
      LANGCHAIN_TRACING_V2: 'true',
      LANGCHAIN_API_KEY: 'ls__xxx',
      CHAINLIT_AUTH_SECRET: 'your-secret'
    }
  },
  'chroma-vectordb': {
    name: 'ChromaDB',
    type: 'ml',
    techStack: 'chromadb',
    port: 8000,
    healthCheckPath: '/api/v1/heartbeat',
    cpu: 2,
    memory: 4096,
    replicas: 1,
    category: 'AI/ML',
    description: 'Vector database for embeddings',
    environment: {
      CHROMA_SERVER_HOST: '0.0.0.0',
      CHROMA_SERVER_HTTP_PORT: '8000',
      PERSIST_DIRECTORY: '/chroma/data',
      ANONYMIZED_TELEMETRY: 'false'
    }
  },
  'qdrant-vectordb': {
    name: 'Qdrant Vector DB',
    type: 'ml',
    techStack: 'qdrant',
    port: 6333,
    healthCheckPath: '/health',
    cpu: 2,
    memory: 4096,
    replicas: 1,
    category: 'AI/ML',
    description: 'High-performance vector search engine',
    environment: {
      QDRANT__SERVICE__HTTP_PORT: '6333',
      QDRANT__SERVICE__GRPC_PORT: '6334',
      QDRANT__STORAGE__STORAGE_PATH: '/qdrant/storage'
    }
  },
  'pinecone-proxy': {
    name: 'Pinecone Proxy',
    type: 'external',
    techStack: 'pinecone',
    port: 443,
    cpu: 0,
    memory: 0,
    replicas: 0,
    category: 'AI/ML',
    description: 'Managed vector database service',
    environment: {
      PINECONE_API_KEY: 'xxx-xxx-xxx',
      PINECONE_ENVIRONMENT: 'us-east1-gcp',
      PINECONE_INDEX_NAME: 'embeddings'
    }
  },
  'weaviate-vectordb': {
    name: 'Weaviate',
    type: 'ml',
    techStack: 'weaviate',
    port: 8080,
    healthCheckPath: '/v1/.well-known/ready',
    cpu: 2,
    memory: 4096,
    replicas: 1,
    category: 'AI/ML',
    description: 'Vector database with built-in ML models',
    environment: {
      QUERY_DEFAULTS_LIMIT: '25',
      AUTHENTICATION_ANONYMOUS_ACCESS_ENABLED: 'true',
      PERSISTENCE_DATA_PATH: '/var/lib/weaviate',
      DEFAULT_VECTORIZER_MODULE: 'none'
    }
  },
  'milvus-vectordb': {
    name: 'Milvus',
    type: 'ml',
    techStack: 'milvus',
    port: 19530,
    healthCheckPath: '/health',
    cpu: 4,
    memory: 8192,
    replicas: 1,
    category: 'AI/ML',
    description: 'Open-source vector database',
    environment: {
      ETCD_ENDPOINTS: 'etcd:2379',
      MINIO_ADDRESS: 'minio:9000',
      PULSAR_ADDRESS: 'pulsar://pulsar:6650'
    }
  },
  'ray-serve': {
    name: 'Ray Serve',
    type: 'ml',
    techStack: 'ray',
    port: 8000,
    healthCheckPath: '/-/healthz',
    cpu: 4,
    memory: 8192,
    replicas: 1,
    category: 'AI/ML',
    description: 'Scalable ML model serving',
    environment: {
      RAY_SERVE_HTTP_HOST: '0.0.0.0',
      RAY_SERVE_HTTP_PORT: '8000',
      RAY_DEDUP_LOGS: '0'
    }
  },
  'triton-inference': {
    name: 'NVIDIA Triton',
    type: 'ml',
    techStack: 'triton',
    port: 8000,
    healthCheckPath: '/v2/health/ready',
    cpu: 4,
    memory: 8192,
    replicas: 1,
    category: 'AI/ML',
    description: 'AI model inference server',
    environment: {
      TRITON_MODEL_REPOSITORY: '/models',
      TRITON_LOG_VERBOSE: '1',
      TRITON_HTTP_PORT: '8000',
      TRITON_GRPC_PORT: '8001'
    }
  },
  'feast-feature-store': {
    name: 'Feast Feature Store',
    type: 'ml',
    techStack: 'feast',
    port: 6566,
    healthCheckPath: '/health',
    cpu: 2,
    memory: 4096,
    replicas: 1,
    category: 'AI/ML',
    description: 'ML feature store',
    environment: {
      FEAST_USAGE: 'False',
      FEAST_SERVER_TYPE: 'http',
      FEAST_LOGGING_LEVEL: 'INFO'
    }
  },
  'airflow-mlops': {
    name: 'Apache Airflow',
    type: 'ml',
    techStack: 'airflow',
    port: 8080,
    healthCheckPath: '/health',
    cpu: 2,
    memory: 4096,
    replicas: 1,
    category: 'AI/ML',
    description: 'ML pipeline orchestration',
    environment: {
      AIRFLOW__CORE__EXECUTOR: 'LocalExecutor',
      AIRFLOW__DATABASE__SQL_ALCHEMY_CONN: 'postgresql+psycopg2://airflow:airflow@postgres:5432/airflow',
      AIRFLOW__CORE__FERNET_KEY: 'your-fernet-key',
      AIRFLOW__WEBSERVER__SECRET_KEY: 'your-secret-key'
    }
  },
  'kubeflow-pipelines': {
    name: 'Kubeflow Pipelines',
    type: 'ml',
    techStack: 'kubeflow',
    port: 8080,
    healthCheckPath: '/apis/v1beta1/healthz',
    cpu: 2,
    memory: 4096,
    replicas: 1,
    category: 'AI/ML',
    description: 'ML workflows on Kubernetes',
    environment: {
      KUBEFLOW_USERID_HEADER: 'x-goog-authenticated-user-email',
      KUBEFLOW_USERID_PREFIX: 'accounts.google.com:'
    }
  },
  'bentoml-serve': {
    name: 'BentoML',
    type: 'ml',
    techStack: 'bentoml',
    port: 3000,
    healthCheckPath: '/healthz',
    cpu: 2,
    memory: 4096,
    replicas: 2,
    category: 'AI/ML',
    description: 'ML model serving framework',
    environment: {
      BENTOML_PORT: '3000',
      BENTOML_HOST: '0.0.0.0',
      BENTOML_HOME: '/bentoml'
    }
  },
  'seldon-core': {
    name: 'Seldon Core',
    type: 'ml',
    techStack: 'seldon',
    port: 8080,
    healthCheckPath: '/health/status',
    cpu: 2,
    memory: 4096,
    replicas: 2,
    category: 'AI/ML',
    description: 'ML deployment on Kubernetes',
    environment: {
      PREDICTIVE_UNIT_HTTP_SERVICE_PORT: '8080',
      PREDICTIVE_UNIT_GRPC_SERVICE_PORT: '5000'
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
  'Payment',
  'AI/ML'
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