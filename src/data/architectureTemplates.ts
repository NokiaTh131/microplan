import { Node, Edge } from "@xyflow/react";

export interface ArchitectureTemplate {
  id: string;
  name: string;
  description: string;
  category: string;
  complexity: "Simple" | "Medium" | "Complex";
  nodes: Node[];
  edges: Edge[];
  tags: string[];
}

export const architectureTemplates: ArchitectureTemplate[] = [
  {
    id: "ecommerce-basic",
    name: "E-commerce Platform",
    description:
      "Basic e-commerce architecture with user management, product catalog, and payment processing",
    category: "E-commerce",
    complexity: "Medium",
    tags: ["web", "payments", "retail"],
    nodes: [
      {
        id: "nginx-gateway-1",
        type: "serviceNode",
        position: { x: 400, y: 50 },
        data: {
          config: {
            name: "API Gateway",
            type: "gateway",
            techStack: "nginx",
            port: 80,
            healthCheckPath: "/health",
            cpu: 0.5,
            memory: 512,
            replicas: 2,
            environment: {
              UPSTREAM_TIMEOUT: "30s",
              MAX_CONNECTIONS: "1000",
            },
          },
        },
      },
      {
        id: "auth-service-1",
        type: "serviceNode",
        position: { x: 150, y: 200 },
        data: {
          config: {
            name: "Auth Service",
            type: "auth",
            techStack: "express",
            port: 3001,
            healthCheckPath: "/health",
            cpu: 1,
            memory: 1024,
            replicas: 2,
            environment: {
              JWT_SECRET: "your-secret-key",
              TOKEN_EXPIRY: "24h",
            },
          },
        },
      },
      {
        id: "user-service-1",
        type: "serviceNode",
        position: { x: 400, y: 200 },
        data: {
          config: {
            name: "User Service",
            type: "api",
            techStack: "spring-boot",
            port: 8080,
            healthCheckPath: "/actuator/health",
            cpu: 1,
            memory: 1024,
            replicas: 2,
            environment: {
              SPRING_PROFILES_ACTIVE: "production",
            },
          },
        },
      },
      {
        id: "product-service-1",
        type: "serviceNode",
        position: { x: 650, y: 200 },
        data: {
          config: {
            name: "Product Service",
            type: "api",
            techStack: "fastapi",
            port: 8000,
            healthCheckPath: "/health",
            cpu: 1.5,
            memory: 1536,
            replicas: 3,
            environment: {
              MAX_WORKERS: "4",
            },
          },
        },
      },
      {
        id: "payment-service-1",
        type: "serviceNode",
        position: { x: 900, y: 200 },
        data: {
          config: {
            name: "Payment Service",
            type: "api",
            techStack: "go-gin",
            port: 8081,
            healthCheckPath: "/health",
            cpu: 2,
            memory: 2048,
            replicas: 3,
            environment: {
              STRIPE_API_KEY: "sk_test_...",
              GOMAXPROCS: "2",
            },
          },
        },
      },
      {
        id: "postgres-db-1",
        type: "serviceNode",
        position: { x: 250, y: 400 },
        data: {
          config: {
            name: "User Database",
            type: "database",
            techStack: "postgresql",
            port: 5432,
            cpu: 2,
            memory: 4096,
            replicas: 1,
            environment: {
              POSTGRES_DB: "users_db",
              POSTGRES_USER: "app_user",
              POSTGRES_PASSWORD: "secure_password",
            },
          },
        },
      },
      {
        id: "mongodb-1",
        type: "serviceNode",
        position: { x: 550, y: 400 },
        data: {
          config: {
            name: "Product Database",
            type: "database",
            techStack: "mongodb",
            port: 27017,
            cpu: 1.5,
            memory: 2048,
            replicas: 1,
            environment: {
              MONGO_INITDB_ROOT_USERNAME: "admin",
              MONGO_INITDB_ROOT_PASSWORD: "password",
              MONGO_INITDB_DATABASE: "products_db",
            },
          },
        },
      },
      {
        id: "redis-cache-1",
        type: "serviceNode",
        position: { x: 850, y: 400 },
        data: {
          config: {
            name: "Redis Cache",
            type: "cache",
            techStack: "redis",
            port: 6379,
            cpu: 0.5,
            memory: 1024,
            replicas: 1,
            environment: {
              REDIS_PASSWORD: "redis_password",
              REDIS_MAXMEMORY: "512mb",
            },
          },
        },
      },
    ],
    edges: [
      {
        id: "edge-1",
        source: "nginx-gateway-1",
        target: "auth-service-1",
        type: "sync",
      },
      {
        id: "edge-2",
        source: "nginx-gateway-1",
        target: "user-service-1",
        type: "sync",
      },
      {
        id: "edge-3",
        source: "nginx-gateway-1",
        target: "product-service-1",
        type: "sync",
      },
      {
        id: "edge-4",
        source: "nginx-gateway-1",
        target: "payment-service-1",
        type: "sync",
      },
      {
        id: "edge-5",
        source: "user-service-1",
        target: "postgres-db-1",
        type: "dataflow",
      },
      {
        id: "edge-6",
        source: "product-service-1",
        target: "mongodb-1",
        type: "dataflow",
      },
      {
        id: "edge-7",
        source: "payment-service-1",
        target: "redis-cache-1",
        type: "dataflow",
      },
    ],
  },
  {
    id: "microservices-monitoring",
    name: "Microservices with Monitoring",
    description:
      "Complete microservices setup with Prometheus, Grafana, and distributed tracing",
    category: "Observability",
    complexity: "Complex",
    tags: ["monitoring", "observability", "production"],
    nodes: [
      {
        id: "traefik-gateway-1",
        type: "serviceNode",
        position: { x: 400, y: 50 },
        data: {
          config: {
            name: "Traefik Gateway",
            type: "gateway",
            techStack: "traefik",
            port: 80,
            healthCheckPath: "/ping",
            cpu: 0.3,
            memory: 256,
            replicas: 2,
            environment: {
              TRAEFIK_API_DASHBOARD: "true",
            },
          },
        },
      },
      {
        id: "api-service-1",
        type: "serviceNode",
        position: { x: 300, y: 200 },
        data: {
          config: {
            name: "API Service",
            type: "api",
            techStack: "express",
            port: 3000,
            healthCheckPath: "/health",
            cpu: 1,
            memory: 1024,
            replicas: 3,
            environment: {
              NODE_ENV: "production",
            },
          },
        },
      },
      {
        id: "data-service-1",
        type: "serviceNode",
        position: { x: 500, y: 200 },
        data: {
          config: {
            name: "Data Service",
            type: "api",
            techStack: "spring-boot",
            port: 8080,
            healthCheckPath: "/actuator/health",
            cpu: 1.5,
            memory: 1536,
            replicas: 2,
            environment: {
              SPRING_PROFILES_ACTIVE: "production",
            },
          },
        },
      },
      {
        id: "postgres-db-2",
        type: "serviceNode",
        position: { x: 400, y: 350 },
        data: {
          config: {
            name: "PostgreSQL",
            type: "database",
            techStack: "postgresql",
            port: 5432,
            cpu: 2,
            memory: 4096,
            replicas: 1,
            environment: {
              POSTGRES_DB: "app_db",
              POSTGRES_USER: "app_user",
              POSTGRES_PASSWORD: "secure_password",
            },
          },
        },
      },
      {
        id: "prometheus-1",
        type: "serviceNode",
        position: { x: 700, y: 200 },
        data: {
          config: {
            name: "Prometheus",
            type: "monitoring",
            techStack: "prometheus",
            port: 9090,
            healthCheckPath: "/-/healthy",
            cpu: 1,
            memory: 2048,
            replicas: 1,
            environment: {
              PROMETHEUS_STORAGE_TSDB_RETENTION_TIME: "15d",
            },
          },
        },
      },
      {
        id: "grafana-1",
        type: "serviceNode",
        position: { x: 850, y: 200 },
        data: {
          config: {
            name: "Grafana",
            type: "monitoring",
            techStack: "grafana",
            port: 3000,
            healthCheckPath: "/api/health",
            cpu: 0.5,
            memory: 512,
            replicas: 1,
            environment: {
              GF_SECURITY_ADMIN_PASSWORD: "admin",
            },
          },
        },
      },
      {
        id: "jaeger-1",
        type: "serviceNode",
        position: { x: 1000, y: 200 },
        data: {
          config: {
            name: "Jaeger",
            type: "monitoring",
            techStack: "jaeger",
            port: 16686,
            healthCheckPath: "/",
            cpu: 0.5,
            memory: 512,
            replicas: 1,
            environment: {
              COLLECTOR_ZIPKIN_HTTP_PORT: "9411",
            },
          },
        },
      },
    ],
    edges: [
      {
        id: "edge-1",
        source: "traefik-gateway-1",
        target: "api-service-1",
        type: "sync",
      },
      {
        id: "edge-2",
        source: "traefik-gateway-1",
        target: "data-service-1",
        type: "sync",
      },
      {
        id: "edge-3",
        source: "data-service-1",
        target: "postgres-db-2",
        type: "dataflow",
      },
      {
        id: "edge-4",
        source: "api-service-1",
        target: "prometheus-1",
        type: "sync",
      },
      {
        id: "edge-5",
        source: "data-service-1",
        target: "prometheus-1",
        type: "sync",
      },
      {
        id: "edge-6",
        source: "prometheus-1",
        target: "grafana-1",
        type: "dataflow",
      },
      {
        id: "edge-7",
        source: "grafana-1",
        target: "jaeger-1",
        type: "dataflow",
      },
    ],
  },
  {
    id: "messaging-architecture",
    name: "Event-Driven Architecture",
    description:
      "Message-driven microservices with Kafka and RabbitMQ for async communication",
    category: "Messaging",
    complexity: "Complex",
    tags: ["kafka", "messaging", "events", "async"],
    nodes: [
      {
        id: "order-service-1",
        type: "serviceNode",
        position: { x: 200, y: 100 },
        data: {
          config: {
            name: "Order Service",
            type: "api",
            techStack: "spring-boot",
            port: 8080,
            healthCheckPath: "/actuator/health",
            cpu: 1.5,
            memory: 1536,
            replicas: 3,
            environment: {
              SPRING_PROFILES_ACTIVE: "production",
            },
          },
        },
      },
      {
        id: "inventory-service-1",
        type: "serviceNode",
        position: { x: 500, y: 100 },
        data: {
          config: {
            name: "Inventory Service",
            type: "api",
            techStack: "rust-actix",
            port: 8082,
            healthCheckPath: "/health",
            cpu: 1,
            memory: 512,
            replicas: 2,
            environment: {
              RUST_LOG: "info",
            },
          },
        },
      },
      {
        id: "notification-service-1",
        type: "serviceNode",
        position: { x: 800, y: 100 },
        data: {
          config: {
            name: "Notification Service",
            type: "api",
            techStack: "dotnet",
            port: 5000,
            healthCheckPath: "/health",
            cpu: 0.5,
            memory: 512,
            replicas: 2,
            environment: {
              ASPNETCORE_ENVIRONMENT: "Production",
            },
          },
        },
      },
      {
        id: "kafka-1",
        type: "serviceNode",
        position: { x: 350, y: 300 },
        data: {
          config: {
            name: "Apache Kafka",
            type: "queue",
            techStack: "kafka",
            port: 9092,
            cpu: 2,
            memory: 2048,
            replicas: 3,
            environment: {
              KAFKA_ZOOKEEPER_CONNECT: "zookeeper:2181",
            },
          },
        },
      },
      {
        id: "rabbitmq-1",
        type: "serviceNode",
        position: { x: 650, y: 300 },
        data: {
          config: {
            name: "RabbitMQ",
            type: "queue",
            techStack: "rabbitmq",
            port: 5672,
            healthCheckPath: "/api/healthchecks/node",
            cpu: 1,
            memory: 1024,
            replicas: 3,
            environment: {
              RABBITMQ_DEFAULT_USER: "admin",
            },
          },
        },
      },
    ],
    edges: [
      {
        id: "edge-1",
        source: "order-service-1",
        target: "kafka-1",
        type: "async",
      },
      {
        id: "edge-2",
        source: "kafka-1",
        target: "inventory-service-1",
        type: "async",
      },
      {
        id: "edge-3",
        source: "inventory-service-1",
        target: "rabbitmq-1",
        type: "async",
      },
      {
        id: "edge-4",
        source: "rabbitmq-1",
        target: "notification-service-1",
        type: "async",
      },
    ],
  },
  {
    id: "simple-blog",
    name: "Simple Blog Platform",
    description:
      "Basic blog with authentication, posts management, and comments",
    category: "Content",
    complexity: "Simple",
    tags: ["blog", "cms", "simple"],
    nodes: [
      {
        id: "blog-api-1",
        type: "serviceNode",
        position: { x: 300, y: 100 },
        data: {
          config: {
            name: "Blog API",
            type: "api",
            techStack: "express",
            port: 3000,
            healthCheckPath: "/health",
            cpu: 1,
            memory: 1024,
            replicas: 2,
            environment: {
              NODE_ENV: "production",
            },
          },
        },
      },
      {
        id: "auth-service-2",
        type: "serviceNode",
        position: { x: 500, y: 100 },
        data: {
          config: {
            name: "Auth Service",
            type: "auth",
            techStack: "fastapi",
            port: 8000,
            healthCheckPath: "/health",
            cpu: 0.5,
            memory: 512,
            replicas: 1,
            environment: {
              JWT_SECRET: "blog-secret",
            },
          },
        },
      },
      {
        id: "postgres-db-3",
        type: "serviceNode",
        position: { x: 400, y: 250 },
        data: {
          config: {
            name: "Blog Database",
            type: "database",
            techStack: "postgresql",
            port: 5432,
            cpu: 1,
            memory: 2048,
            replicas: 1,
            environment: {
              POSTGRES_DB: "blog_db",
              POSTGRES_USER: "blog_user",
              POSTGRES_PASSWORD: "blog_password",
            },
          },
        },
      },
    ],
    edges: [
      {
        id: "edge-1",
        source: "blog-api-1",
        target: "auth-service-2",
        type: "sync",
      },
      {
        id: "edge-2",
        source: "blog-api-1",
        target: "postgres-db-3",
        type: "dataflow",
      },
      {
        id: "edge-3",
        source: "auth-service-2",
        target: "postgres-db-3",
        type: "dataflow",
      },
    ],
  },
  {
    id: "social-media-platform",
    name: "Social Media Platform",
    description:
      "Scalable social media architecture with user feeds, messaging, and media storage",
    category: "Social",
    complexity: "Complex",
    tags: ["social", "feeds", "messaging", "media"],
    nodes: [
      {
        id: "user-service-2",
        type: "serviceNode",
        position: { x: 200, y: 100 },
        data: {
          config: {
            name: "User Service",
            type: "api",
            techStack: "spring-boot",
            port: 8080,
            healthCheckPath: "/actuator/health",
            cpu: 2,
            memory: 2048,
            replicas: 4,
            environment: {
              SPRING_PROFILES_ACTIVE: "production",
              CACHE_TTL: "3600",
            },
          },
        },
      },
      {
        id: "feed-service-1",
        type: "serviceNode",
        position: { x: 400, y: 100 },
        data: {
          config: {
            name: "Feed Service",
            type: "api",
            techStack: "go-gin",
            port: 8081,
            healthCheckPath: "/health",
            cpu: 3,
            memory: 3072,
            replicas: 6,
            environment: {
              GOMAXPROCS: "4",
              FEED_CACHE_SIZE: "10000",
            },
          },
        },
      },
      {
        id: "messaging-service-1",
        type: "serviceNode",
        position: { x: 600, y: 100 },
        data: {
          config: {
            name: "Messaging Service",
            type: "api",
            techStack: "fastapi",
            port: 8000,
            healthCheckPath: "/health",
            cpu: 1.5,
            memory: 1536,
            replicas: 3,
            environment: {
              MAX_WORKERS: "4",
              MESSAGE_RETENTION: "30d",
            },
          },
        },
      },
      {
        id: "media-service-1",
        type: "serviceNode",
        position: { x: 800, y: 100 },
        data: {
          config: {
            name: "Media Service",
            type: "storage",
            techStack: "rust-actix",
            port: 8082,
            healthCheckPath: "/health",
            cpu: 2,
            memory: 2048,
            replicas: 3,
            environment: {
              RUST_LOG: "info",
              MAX_FILE_SIZE: "50MB",
            },
          },
        },
      },
      {
        id: "redis-cache-2",
        type: "serviceNode",
        position: { x: 300, y: 300 },
        data: {
          config: {
            name: "Redis Cache",
            type: "cache",
            techStack: "redis",
            port: 6379,
            cpu: 1,
            memory: 2048,
            replicas: 3,
            environment: {
              REDIS_MAXMEMORY: "1gb",
              REDIS_MAXMEMORY_POLICY: "allkeys-lru",
            },
          },
        },
      },
      {
        id: "cassandra-db-1",
        type: "serviceNode",
        position: { x: 500, y: 300 },
        data: {
          config: {
            name: "Cassandra",
            type: "database",
            techStack: "cassandra",
            port: 9042,
            cpu: 4,
            memory: 8192,
            replicas: 3,
            environment: {
              CASSANDRA_CLUSTER_NAME: "SocialCluster",
              CASSANDRA_SEEDS: "cassandra-1,cassandra-2",
            },
          },
        },
      },
      {
        id: "s3-storage-1",
        type: "serviceNode",
        position: { x: 700, y: 300 },
        data: {
          config: {
            name: "S3 Storage",
            type: "storage",
            techStack: "s3",
            port: 443,
            cpu: 0.1,
            memory: 128,
            replicas: 1,
            environment: {
              AWS_REGION: "us-east-1",
              BUCKET_NAME: "social-media-assets",
            },
          },
        },
      },
    ],
    edges: [
      {
        id: "edge-1",
        source: "user-service-2",
        target: "redis-cache-2",
        type: "dataflow",
      },
      {
        id: "edge-2",
        source: "feed-service-1",
        target: "cassandra-db-1",
        type: "dataflow",
      },
      {
        id: "edge-3",
        source: "messaging-service-1",
        target: "cassandra-db-1",
        type: "dataflow",
      },
      {
        id: "edge-4",
        source: "media-service-1",
        target: "s3-storage-1",
        type: "dataflow",
      },
      {
        id: "edge-5",
        source: "user-service-2",
        target: "feed-service-1",
        type: "sync",
      },
    ],
  },
  {
    id: "iot-platform",
    name: "IoT Data Platform",
    description:
      "Real-time IoT data processing with device management and analytics",
    category: "IoT",
    complexity: "Complex",
    tags: ["iot", "realtime", "analytics", "mqtt"],
    nodes: [
      {
        id: "device-manager-1",
        type: "serviceNode",
        position: { x: 200, y: 100 },
        data: {
          config: {
            name: "Device Manager",
            type: "api",
            techStack: "go-gin",
            port: 8080,
            healthCheckPath: "/health",
            cpu: 1,
            memory: 1024,
            replicas: 2,
            environment: {
              DEVICE_REGISTRY_SIZE: "1000000",
            },
          },
        },
      },
      {
        id: "mqtt-broker-1",
        type: "serviceNode",
        position: { x: 400, y: 100 },
        data: {
          config: {
            name: "MQTT Broker",
            type: "queue",
            techStack: "mosquitto",
            port: 1883,
            cpu: 2,
            memory: 2048,
            replicas: 3,
            environment: {
              MQTT_MAX_CONNECTIONS: "100000",
              MQTT_PERSISTENCE: "true",
            },
          },
        },
      },
      {
        id: "data-processor-1",
        type: "serviceNode",
        position: { x: 600, y: 100 },
        data: {
          config: {
            name: "Data Processor",
            type: "api",
            techStack: "kafka-streams",
            port: 8082,
            healthCheckPath: "/health",
            cpu: 4,
            memory: 4096,
            replicas: 5,
            environment: {
              KAFKA_BOOTSTRAP_SERVERS: "kafka:9092",
              PROCESSING_THREADS: "4",
            },
          },
        },
      },
      {
        id: "analytics-engine-1",
        type: "serviceNode",
        position: { x: 800, y: 100 },
        data: {
          config: {
            name: "Analytics Engine",
            type: "analytics",
            techStack: "apache-spark",
            port: 8080,
            healthCheckPath: "/health",
            cpu: 8,
            memory: 16384,
            replicas: 3,
            environment: {
              SPARK_EXECUTOR_MEMORY: "4g",
              SPARK_EXECUTOR_CORES: "2",
            },
          },
        },
      },
      {
        id: "timeseries-db-1",
        type: "serviceNode",
        position: { x: 400, y: 300 },
        data: {
          config: {
            name: "InfluxDB",
            type: "database",
            techStack: "influxdb",
            port: 8086,
            cpu: 3,
            memory: 6144,
            replicas: 3,
            environment: {
              INFLUXDB_DB: "iot_metrics",
              INFLUXDB_RETENTION_POLICY: "30d",
            },
          },
        },
      },
      {
        id: "elasticsearch-1",
        type: "serviceNode",
        position: { x: 600, y: 300 },
        data: {
          config: {
            name: "Elasticsearch",
            type: "search",
            techStack: "elasticsearch",
            port: 9200,
            cpu: 4,
            memory: 8192,
            replicas: 3,
            environment: {
              ES_JAVA_OPTS: "-Xms4g -Xmx4g",
              "cluster.name": "iot-cluster",
            },
          },
        },
      },
    ],
    edges: [
      {
        id: "edge-1",
        source: "device-manager-1",
        target: "mqtt-broker-1",
        type: "async",
      },
      {
        id: "edge-2",
        source: "mqtt-broker-1",
        target: "data-processor-1",
        type: "async",
      },
      {
        id: "edge-3",
        source: "data-processor-1",
        target: "timeseries-db-1",
        type: "dataflow",
      },
      {
        id: "edge-4",
        source: "data-processor-1",
        target: "analytics-engine-1",
        type: "async",
      },
      {
        id: "edge-5",
        source: "analytics-engine-1",
        target: "elasticsearch-1",
        type: "dataflow",
      },
    ],
  },
  {
    id: "data-analytics-pipeline",
    name: "Real-time Analytics Pipeline",
    description:
      "Big data processing pipeline with streaming analytics and machine learning",
    category: "Analytics",
    complexity: "Complex",
    tags: ["bigdata", "ml", "streaming", "analytics"],
    nodes: [
      {
        id: "api-gateway-2",
        type: "serviceNode",
        position: { x: 200, y: 100 },
        data: {
          config: {
            name: "Data Ingestion API",
            type: "gateway",
            techStack: "kong",
            port: 8000,
            healthCheckPath: "/status",
            cpu: 2,
            memory: 2048,
            replicas: 3,
            environment: {
              KONG_DATABASE: "postgres",
              KONG_RATE_LIMITING: "1000/minute",
            },
          },
        },
      },
      {
        id: "kafka-cluster-1",
        type: "serviceNode",
        position: { x: 400, y: 100 },
        data: {
          config: {
            name: "Kafka Cluster",
            type: "queue",
            techStack: "kafka",
            port: 9092,
            cpu: 4,
            memory: 8192,
            replicas: 5,
            environment: {
              KAFKA_HEAP_OPTS: "-Xmx4G -Xms4G",
              KAFKA_NUM_PARTITIONS: "12",
            },
          },
        },
      },
      {
        id: "stream-processor-1",
        type: "serviceNode",
        position: { x: 600, y: 100 },
        data: {
          config: {
            name: "Stream Processor",
            type: "analytics",
            techStack: "apache-flink",
            port: 8081,
            healthCheckPath: "/overview",
            cpu: 6,
            memory: 12288,
            replicas: 4,
            environment: {
              FLINK_TASKMANAGER_MEMORY: "8g",
              FLINK_PARALLELISM: "12",
            },
          },
        },
      },
      {
        id: "ml-service-1",
        type: "serviceNode",
        position: { x: 800, y: 100 },
        data: {
          config: {
            name: "ML Service",
            type: "ml",
            techStack: "tensorflow",
            port: 8500,
            healthCheckPath: "/v1/models",
            cpu: 8,
            memory: 16384,
            replicas: 2,
            environment: {
              MODEL_NAME: "analytics_model",
              TENSORFLOW_SERVING_PORT: "8500",
            },
          },
        },
      },
      {
        id: "clickhouse-1",
        type: "serviceNode",
        position: { x: 300, y: 300 },
        data: {
          config: {
            name: "ClickHouse",
            type: "database",
            techStack: "clickhouse",
            port: 8123,
            cpu: 6,
            memory: 12288,
            replicas: 3,
            environment: {
              CLICKHOUSE_DB: "analytics",
              MAX_MEMORY_USAGE: "8000000000",
            },
          },
        },
      },
      {
        id: "redis-cluster-1",
        type: "serviceNode",
        position: { x: 500, y: 300 },
        data: {
          config: {
            name: "Redis Cluster",
            type: "cache",
            techStack: "redis",
            port: 6379,
            cpu: 2,
            memory: 4096,
            replicas: 6,
            environment: {
              REDIS_CLUSTER_ENABLED: "yes",
              REDIS_MAXMEMORY: "3gb",
            },
          },
        },
      },
      {
        id: "grafana-2",
        type: "serviceNode",
        position: { x: 700, y: 300 },
        data: {
          config: {
            name: "Analytics Dashboard",
            type: "monitoring",
            techStack: "grafana",
            port: 3000,
            healthCheckPath: "/api/health",
            cpu: 1,
            memory: 1024,
            replicas: 2,
            environment: {
              GF_SECURITY_ADMIN_PASSWORD: "analytics_admin",
              GF_FEATURE_TOGGLES_ENABLE: "alerting",
            },
          },
        },
      },
    ],
    edges: [
      {
        id: "edge-1",
        source: "api-gateway-2",
        target: "kafka-cluster-1",
        type: "async",
      },
      {
        id: "edge-2",
        source: "kafka-cluster-1",
        target: "stream-processor-1",
        type: "async",
      },
      {
        id: "edge-3",
        source: "stream-processor-1",
        target: "clickhouse-1",
        type: "dataflow",
      },
      {
        id: "edge-4",
        source: "stream-processor-1",
        target: "ml-service-1",
        type: "sync",
      },
      {
        id: "edge-5",
        source: "ml-service-1",
        target: "redis-cluster-1",
        type: "dataflow",
      },
      {
        id: "edge-6",
        source: "clickhouse-1",
        target: "grafana-2",
        type: "dataflow",
      },
    ],
  },
  {
    id: "fintech-trading",
    name: "Fintech Trading Platform",
    description:
      "High-frequency trading platform with risk management and real-time market data",
    category: "Finance",
    complexity: "Complex",
    tags: ["fintech", "trading", "risk", "realtime"],
    nodes: [
      {
        id: "trading-engine-1",
        type: "serviceNode",
        position: { x: 300, y: 100 },
        data: {
          config: {
            name: "Trading Engine",
            type: "api",
            techStack: "rust-actix",
            port: 8080,
            healthCheckPath: "/health",
            cpu: 8,
            memory: 16384,
            replicas: 3,
            environment: {
              RUST_LOG: "info",
              MAX_ORDERS_PER_SECOND: "10000",
            },
          },
        },
      },
      {
        id: "risk-manager-1",
        type: "serviceNode",
        position: { x: 500, y: 100 },
        data: {
          config: {
            name: "Risk Manager",
            type: "api",
            techStack: "cpp",
            port: 8081,
            healthCheckPath: "/health",
            cpu: 4,
            memory: 8192,
            replicas: 3,
            environment: {
              RISK_THRESHOLD: "1000000",
              CHECK_INTERVAL_MS: "100",
            },
          },
        },
      },
      {
        id: "market-data-1",
        type: "serviceNode",
        position: { x: 700, y: 100 },
        data: {
          config: {
            name: "Market Data",
            type: "api",
            techStack: "go-gin",
            port: 8082,
            healthCheckPath: "/health",
            cpu: 6,
            memory: 12288,
            replicas: 4,
            environment: {
              FEED_BUFFER_SIZE: "100000",
              UPDATE_FREQUENCY_MS: "1",
            },
          },
        },
      },
      {
        id: "order-book-1",
        type: "serviceNode",
        position: { x: 900, y: 100 },
        data: {
          config: {
            name: "Order Book",
            type: "api",
            techStack: "rust-actix",
            port: 8083,
            healthCheckPath: "/health",
            cpu: 4,
            memory: 8192,
            replicas: 5,
            environment: {
              BOOK_DEPTH: "1000",
              PRICE_PRECISION: "8",
            },
          },
        },
      },
      {
        id: "cockroachdb-1",
        type: "serviceNode",
        position: { x: 400, y: 300 },
        data: {
          config: {
            name: "CockroachDB",
            type: "database",
            techStack: "cockroachdb",
            port: 26257,
            cpu: 8,
            memory: 16384,
            replicas: 5,
            environment: {
              COCKROACH_CACHE: "8GiB",
              COCKROACH_MAX_SQL_MEMORY: "4GiB",
            },
          },
        },
      },
      {
        id: "redis-stream-1",
        type: "serviceNode",
        position: { x: 600, y: 300 },
        data: {
          config: {
            name: "Redis Streams",
            type: "cache",
            techStack: "redis",
            port: 6379,
            cpu: 4,
            memory: 8192,
            replicas: 3,
            environment: {
              REDIS_MAXMEMORY: "6gb",
              STREAM_MAX_LEN: "1000000",
            },
          },
        },
      },
      {
        id: "prometheus-2",
        type: "serviceNode",
        position: { x: 800, y: 300 },
        data: {
          config: {
            name: "Monitoring",
            type: "monitoring",
            techStack: "prometheus",
            port: 9090,
            healthCheckPath: "/-/healthy",
            cpu: 2,
            memory: 4096,
            replicas: 2,
            environment: {
              PROMETHEUS_RETENTION_TIME: "7d",
              SCRAPE_INTERVAL: "1s",
            },
          },
        },
      },
    ],
    edges: [
      {
        id: "edge-1",
        source: "trading-engine-1",
        target: "risk-manager-1",
        type: "sync",
      },
      {
        id: "edge-2",
        source: "trading-engine-1",
        target: "order-book-1",
        type: "sync",
      },
      {
        id: "edge-3",
        source: "market-data-1",
        target: "order-book-1",
        type: "async",
      },
      {
        id: "edge-4",
        source: "trading-engine-1",
        target: "cockroachdb-1",
        type: "dataflow",
      },
      {
        id: "edge-5",
        source: "market-data-1",
        target: "redis-stream-1",
        type: "dataflow",
      },
      {
        id: "edge-6",
        source: "risk-manager-1",
        target: "prometheus-2",
        type: "sync",
      },
    ],
  },
  {
    id: "gaming-platform",
    name: "Multiplayer Gaming Platform",
    description:
      "Real-time multiplayer gaming with matchmaking, leaderboards, and chat",
    category: "Gaming",
    complexity: "Medium",
    tags: ["gaming", "realtime", "websocket", "multiplayer"],
    nodes: [
      {
        id: "game-server-1",
        type: "serviceNode",
        position: { x: 300, y: 100 },
        data: {
          config: {
            name: "Game Server",
            type: "api",
            techStack: "unity-netcode",
            port: 7777,
            healthCheckPath: "/health",
            cpu: 4,
            memory: 8192,
            replicas: 10,
            environment: {
              MAX_PLAYERS_PER_ROOM: "100",
              TICK_RATE: "60",
            },
          },
        },
      },
      {
        id: "matchmaking-1",
        type: "serviceNode",
        position: { x: 500, y: 100 },
        data: {
          config: {
            name: "Matchmaking",
            type: "api",
            techStack: "go-gin",
            port: 8080,
            healthCheckPath: "/health",
            cpu: 2,
            memory: 2048,
            replicas: 3,
            environment: {
              QUEUE_TIMEOUT: "30s",
              SKILL_THRESHOLD: "100",
            },
          },
        },
      },
      {
        id: "chat-service-1",
        type: "serviceNode",
        position: { x: 700, y: 100 },
        data: {
          config: {
            name: "Chat Service",
            type: "api",
            techStack: "socket.io",
            port: 3000,
            healthCheckPath: "/health",
            cpu: 1,
            memory: 1024,
            replicas: 5,
            environment: {
              MAX_CONNECTIONS: "50000",
              MESSAGE_HISTORY: "100",
            },
          },
        },
      },
      {
        id: "leaderboard-1",
        type: "serviceNode",
        position: { x: 900, y: 100 },
        data: {
          config: {
            name: "Leaderboard",
            type: "api",
            techStack: "fastapi",
            port: 8000,
            healthCheckPath: "/health",
            cpu: 1,
            memory: 1024,
            replicas: 2,
            environment: {
              LEADERBOARD_SIZE: "10000",
              UPDATE_INTERVAL: "5s",
            },
          },
        },
      },
      {
        id: "redis-gaming-1",
        type: "serviceNode",
        position: { x: 400, y: 300 },
        data: {
          config: {
            name: "Game State Cache",
            type: "cache",
            techStack: "redis",
            port: 6379,
            cpu: 2,
            memory: 4096,
            replicas: 3,
            environment: {
              REDIS_MAXMEMORY: "3gb",
              REDIS_POLICY: "volatile-lru",
            },
          },
        },
      },
      {
        id: "mongodb-gaming-1",
        type: "serviceNode",
        position: { x: 600, y: 300 },
        data: {
          config: {
            name: "Player Database",
            type: "database",
            techStack: "mongodb",
            port: 27017,
            cpu: 3,
            memory: 6144,
            replicas: 3,
            environment: {
              MONGO_REPLICA_SET: "gaming-rs",
              MONGO_OPLOG_SIZE: "2048",
            },
          },
        },
      },
      {
        id: "websocket-gateway-1",
        type: "serviceNode",
        position: { x: 800, y: 300 },
        data: {
          config: {
            name: "WebSocket Gateway",
            type: "gateway",
            techStack: "nginx",
            port: 80,
            healthCheckPath: "/health",
            cpu: 1,
            memory: 512,
            replicas: 3,
            environment: {
              WORKER_CONNECTIONS: "10000",
              PROXY_TIMEOUT: "60s",
            },
          },
        },
      },
    ],
    edges: [
      {
        id: "edge-1",
        source: "game-server-1",
        target: "matchmaking-1",
        type: "sync",
      },
      {
        id: "edge-2",
        source: "game-server-1",
        target: "redis-gaming-1",
        type: "dataflow",
      },
      {
        id: "edge-3",
        source: "chat-service-1",
        target: "websocket-gateway-1",
        type: "sync",
      },
      {
        id: "edge-4",
        source: "leaderboard-1",
        target: "mongodb-gaming-1",
        type: "dataflow",
      },
      {
        id: "edge-5",
        source: "matchmaking-1",
        target: "redis-gaming-1",
        type: "dataflow",
      },
      {
        id: "edge-6",
        source: "game-server-1",
        target: "mongodb-gaming-1",
        type: "dataflow",
      },
    ],
  },
  {
    id: "healthcare-system",
    name: "Healthcare Management System",
    description:
      "HIPAA-compliant healthcare platform with patient records, appointments, and telemedicine",
    category: "Healthcare",
    complexity: "Medium",
    tags: ["healthcare", "hipaa", "telemedicine", "records"],
    nodes: [
      {
        id: "patient-service-1",
        type: "serviceNode",
        position: { x: 200, y: 100 },
        data: {
          config: {
            name: "Patient Service",
            type: "api",
            techStack: "spring-boot",
            port: 8080,
            healthCheckPath: "/actuator/health",
            cpu: 2,
            memory: 2048,
            replicas: 3,
            environment: {
              ENCRYPTION_KEY: "patient-data-key",
              AUDIT_ENABLED: "true",
            },
          },
        },
      },
      {
        id: "appointment-service-1",
        type: "serviceNode",
        position: { x: 400, y: 100 },
        data: {
          config: {
            name: "Appointment Service",
            type: "api",
            techStack: "dotnet",
            port: 5000,
            healthCheckPath: "/health",
            cpu: 1,
            memory: 1024,
            replicas: 2,
            environment: {
              ASPNETCORE_ENVIRONMENT: "Production",
              CALENDAR_SYNC: "true",
            },
          },
        },
      },
      {
        id: "telemedicine-1",
        type: "serviceNode",
        position: { x: 600, y: 100 },
        data: {
          config: {
            name: "Telemedicine",
            type: "api",
            techStack: "webrtc",
            port: 3000,
            healthCheckPath: "/health",
            cpu: 3,
            memory: 4096,
            replicas: 4,
            environment: {
              TURN_SERVER: "stun:stun.l.google.com:19302",
              SESSION_TIMEOUT: "3600",
            },
          },
        },
      },
      {
        id: "notification-service-2",
        type: "serviceNode",
        position: { x: 800, y: 100 },
        data: {
          config: {
            name: "Notification Service",
            type: "api",
            techStack: "fastapi",
            port: 8000,
            healthCheckPath: "/health",
            cpu: 0.5,
            memory: 512,
            replicas: 2,
            environment: {
              EMAIL_PROVIDER: "ses",
              SMS_PROVIDER: "twilio",
            },
          },
        },
      },
      {
        id: "encrypted-db-1",
        type: "serviceNode",
        position: { x: 300, y: 300 },
        data: {
          config: {
            name: "Encrypted Database",
            type: "database",
            techStack: "postgresql",
            port: 5432,
            cpu: 4,
            memory: 8192,
            replicas: 2,
            environment: {
              POSTGRES_ENCRYPTION: "AES-256",
              BACKUP_RETENTION: "7y",
            },
          },
        },
      },
      {
        id: "audit-service-1",
        type: "serviceNode",
        position: { x: 500, y: 300 },
        data: {
          config: {
            name: "Audit Service",
            type: "monitoring",
            techStack: "elasticsearch",
            port: 9200,
            cpu: 2,
            memory: 4096,
            replicas: 3,
            environment: {
              ES_SECURITY_ENABLED: "true",
              AUDIT_RETENTION: "10y",
            },
          },
        },
      },
      {
        id: "file-storage-1",
        type: "serviceNode",
        position: { x: 700, y: 300 },
        data: {
          config: {
            name: "Secure File Storage",
            type: "storage",
            techStack: "minio",
            port: 9000,
            cpu: 1,
            memory: 2048,
            replicas: 3,
            environment: {
              MINIO_ENCRYPTION: "SSE-S3",
              ACCESS_CONTROL: "strict",
            },
          },
        },
      },
    ],
    edges: [
      {
        id: "edge-1",
        source: "patient-service-1",
        target: "encrypted-db-1",
        type: "dataflow",
      },
      {
        id: "edge-2",
        source: "appointment-service-1",
        target: "encrypted-db-1",
        type: "dataflow",
      },
      {
        id: "edge-3",
        source: "telemedicine-1",
        target: "file-storage-1",
        type: "dataflow",
      },
      {
        id: "edge-4",
        source: "notification-service-2",
        target: "audit-service-1",
        type: "async",
      },
      {
        id: "edge-5",
        source: "patient-service-1",
        target: "audit-service-1",
        type: "async",
      },
      {
        id: "edge-6",
        source: "appointment-service-1",
        target: "notification-service-2",
        type: "async",
      },
    ],
  },
];

export const templateCategories = [
  "All",
  "E-commerce",
  "Observability",
  "Messaging",
  "Content",
  "Social",
  "Analytics",
  "IoT",
  "Finance",
  "Gaming",
  "Healthcare",
];

export const complexityLevels = ["Simple", "Medium", "Complex"];
