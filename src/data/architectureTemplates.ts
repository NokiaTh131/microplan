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
    id: "simple-web-app",
    name: "Simple Web Application",
    description:
      "Basic three-tier web application with load balancer, API server, and database",
    category: "Web",
    complexity: "Simple",
    tags: ["web", "basic", "reliable", "low-risk"],
    nodes: [
      {
        id: "nginx-lb-1",
        type: "serviceNode",
        position: { x: 400, y: 50 },
        data: {
          config: {
            name: "Load Balancer",
            type: "gateway",
            techStack: "nginx",
            port: 80,
            healthCheckPath: "/health",
            cpu: 0.5,
            memory: 512,
            replicas: 2,
            environment: {
              WORKER_PROCESSES: "auto",
              KEEPALIVE_TIMEOUT: "65",
            },
          },
        },
      },
      {
        id: "web-api-1",
        type: "serviceNode",
        position: { x: 400, y: 200 },
        data: {
          config: {
            name: "Web API",
            type: "api",
            techStack: "express",
            port: 3000,
            healthCheckPath: "/health",
            cpu: 1,
            memory: 1024,
            replicas: 3,
            environment: {
              NODE_ENV: "production",
              LOG_LEVEL: "info",
            },
          },
        },
      },
      {
        id: "postgres-1",
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
              POSTGRES_DB: "webapp_db",
              POSTGRES_MAX_CONNECTIONS: "100",
              POSTGRES_SHARED_BUFFERS: "256MB",
            },
          },
        },
      },
    ],
    edges: [
      {
        id: "edge-1",
        source: "nginx-lb-1",
        target: "web-api-1",
        type: "https",
      },
      {
        id: "edge-2",
        source: "web-api-1",
        target: "postgres-1",
        type: "encrypted-data",
      },
    ],
  },
  {
    id: "api-gateway-pattern",
    name: "API Gateway with Services",
    description:
      "Standard API Gateway pattern with two backend services and shared database",
    category: "API",
    complexity: "Simple",
    tags: ["api-gateway", "microservices", "reliable", "low-risk"],
    nodes: [
      {
        id: "kong-gateway-1",
        type: "serviceNode",
        position: { x: 400, y: 50 },
        data: {
          config: {
            name: "Kong Gateway",
            type: "gateway",
            techStack: "kong",
            port: 8000,
            healthCheckPath: "/status",
            cpu: 1,
            memory: 1024,
            replicas: 2,
            environment: {
              KONG_DATABASE: "postgres",
              KONG_ADMIN_LISTEN: "0.0.0.0:8001",
            },
          },
        },
      },
      {
        id: "user-api-1",
        type: "serviceNode",
        position: { x: 250, y: 200 },
        data: {
          config: {
            name: "User API",
            type: "api",
            techStack: "spring-boot",
            port: 8080,
            healthCheckPath: "/actuator/health",
            cpu: 1,
            memory: 1024,
            replicas: 2,
            environment: {
              SPRING_PROFILES_ACTIVE: "production",
              LOGGING_LEVEL_ROOT: "INFO",
            },
          },
        },
      },
      {
        id: "content-api-1",
        type: "serviceNode",
        position: { x: 550, y: 200 },
        data: {
          config: {
            name: "Content API",
            type: "api",
            techStack: "fastapi",
            port: 8000,
            healthCheckPath: "/health",
            cpu: 1,
            memory: 1024,
            replicas: 2,
            environment: {
              LOG_LEVEL: "INFO",
              MAX_WORKERS: "4",
            },
          },
        },
      },
      {
        id: "postgres-shared-1",
        type: "serviceNode",
        position: { x: 400, y: 350 },
        data: {
          config: {
            name: "Shared Database",
            type: "database",
            techStack: "postgresql",
            port: 5432,
            cpu: 2,
            memory: 4096,
            replicas: 1,
            environment: {
              POSTGRES_DB: "shared_db",
              POSTGRES_MAX_CONNECTIONS: "200",
            },
          },
        },
      },
    ],
    edges: [
      {
        id: "edge-1",
        source: "kong-gateway-1",
        target: "user-api-1",
        type: "https",
      },
      {
        id: "edge-2",
        source: "kong-gateway-1",
        target: "content-api-1",
        type: "https",
      },
      {
        id: "edge-3",
        source: "user-api-1",
        target: "postgres-shared-1",
        type: "encrypted-data",
      },
      {
        id: "edge-4",
        source: "content-api-1",
        target: "postgres-shared-1",
        type: "encrypted-data",
      },
    ],
  },
  {
    id: "crud-api-redis",
    name: "CRUD API with Caching",
    description:
      "Simple CRUD API with Redis caching layer for improved performance",
    category: "API",
    complexity: "Simple",
    tags: ["crud", "cache", "redis", "reliable", "low-risk"],
    nodes: [
      {
        id: "api-server-1",
        type: "serviceNode",
        position: { x: 400, y: 100 },
        data: {
          config: {
            name: "CRUD API",
            type: "api",
            techStack: "express",
            port: 3000,
            healthCheckPath: "/health",
            cpu: 1,
            memory: 1024,
            replicas: 2,
            environment: {
              NODE_ENV: "production",
              CACHE_TTL: "300",
            },
          },
        },
      },
      {
        id: "redis-cache-simple-1",
        type: "serviceNode",
        position: { x: 250, y: 250 },
        data: {
          config: {
            name: "Redis Cache",
            type: "cache",
            techStack: "redis",
            port: 6379,
            cpu: 0.5,
            memory: 512,
            replicas: 1,
            environment: {
              REDIS_MAXMEMORY: "256mb",
              REDIS_MAXMEMORY_POLICY: "allkeys-lru",
            },
          },
        },
      },
      {
        id: "mysql-1",
        type: "serviceNode",
        position: { x: 550, y: 250 },
        data: {
          config: {
            name: "MySQL Database",
            type: "database",
            techStack: "mysql",
            port: 3306,
            cpu: 1.5,
            memory: 2048,
            replicas: 1,
            environment: {
              MYSQL_DATABASE: "app_db",
              MYSQL_MAX_CONNECTIONS: "100",
            },
          },
        },
      },
    ],
    edges: [
      {
        id: "edge-1",
        source: "api-server-1",
        target: "redis-cache-simple-1",
        type: "data-flow",
      },
      {
        id: "edge-2",
        source: "api-server-1",
        target: "mysql-1",
        type: "data-flow",
      },
    ],
  },
  {
    id: "monolith-with-db",
    name: "Monolith Application",
    description:
      "Traditional monolithic application with database - perfect starting point",
    category: "Monolith",
    complexity: "Simple",
    tags: ["monolith", "traditional", "simple", "low-risk"],
    nodes: [
      {
        id: "monolith-app-1",
        type: "serviceNode",
        position: { x: 400, y: 150 },
        data: {
          config: {
            name: "Monolith App",
            type: "api",
            techStack: "spring-boot",
            port: 8080,
            healthCheckPath: "/actuator/health",
            cpu: 2,
            memory: 2048,
            replicas: 2,
            environment: {
              SPRING_PROFILES_ACTIVE: "production",
              SERVER_PORT: "8080",
            },
          },
        },
      },
      {
        id: "postgres-monolith-1",
        type: "serviceNode",
        position: { x: 400, y: 300 },
        data: {
          config: {
            name: "Application Database",
            type: "database",
            techStack: "postgresql",
            port: 5432,
            cpu: 2,
            memory: 4096,
            replicas: 1,
            environment: {
              POSTGRES_DB: "monolith_db",
              POSTGRES_MAX_CONNECTIONS: "100",
            },
          },
        },
      },
    ],
    edges: [
      {
        id: "edge-1",
        source: "monolith-app-1",
        target: "postgres-monolith-1",
        type: "data-flow",
      },
    ],
  },
  {
    id: "static-site-cdn",
    name: "Static Site with CDN",
    description: "Static website with CDN distribution and API backend",
    category: "Web",
    complexity: "Simple",
    tags: ["static", "cdn", "frontend", "low-risk"],
    nodes: [
      {
        id: "cdn-1",
        type: "serviceNode",
        position: { x: 400, y: 50 },
        data: {
          config: {
            name: "CDN",
            type: "cdn",
            techStack: "cloudflare",
            port: 443,
            cpu: 0.1,
            memory: 128,
            replicas: 1,
            environment: {
              CACHE_TTL: "86400",
              COMPRESSION: "gzip",
            },
          },
        },
      },
      {
        id: "static-files-1",
        type: "serviceNode",
        position: { x: 250, y: 200 },
        data: {
          config: {
            name: "Static Files",
            type: "storage",
            techStack: "nginx",
            port: 80,
            healthCheckPath: "/health",
            cpu: 0.3,
            memory: 256,
            replicas: 2,
            environment: {
              GZIP_ENABLED: "true",
              CACHE_CONTROL: "public, max-age=31536000",
            },
          },
        },
      },
      {
        id: "api-backend-1",
        type: "serviceNode",
        position: { x: 550, y: 200 },
        data: {
          config: {
            name: "API Backend",
            type: "api",
            techStack: "express",
            port: 3000,
            healthCheckPath: "/health",
            cpu: 1,
            memory: 1024,
            replicas: 2,
            environment: {
              NODE_ENV: "production",
              CORS_ENABLED: "true",
            },
          },
        },
      },
      {
        id: "sqlite-1",
        type: "serviceNode",
        position: { x: 550, y: 350 },
        data: {
          config: {
            name: "SQLite DB",
            type: "database",
            techStack: "sqlite",
            port: 0,
            cpu: 0.2,
            memory: 256,
            replicas: 1,
            environment: {
              DB_PATH: "/data/app.db",
              VACUUM_INTERVAL: "86400",
            },
          },
        },
      },
    ],
    edges: [
      {
        id: "edge-1",
        source: "cdn-1",
        target: "static-files-1",
        type: "sync",
      },
      {
        id: "edge-2",
        source: "cdn-1",
        target: "api-backend-1",
        type: "sync",
      },
      {
        id: "edge-3",
        source: "api-backend-1",
        target: "sqlite-1",
        type: "data-flow",
      },
    ],
  },
  {
    id: "task-queue-pattern",
    name: "Background Task Processing",
    description: "Web API with background task queue processing using Redis",
    category: "Queue",
    complexity: "Simple",
    tags: ["queue", "background-jobs", "redis", "reliable", "low-risk"],
    nodes: [
      {
        id: "web-frontend-1",
        type: "serviceNode",
        position: { x: 300, y: 100 },
        data: {
          config: {
            name: "Web Frontend",
            type: "api",
            techStack: "fastapi",
            port: 8000,
            healthCheckPath: "/health",
            cpu: 1,
            memory: 1024,
            replicas: 2,
            environment: {
              LOG_LEVEL: "INFO",
              QUEUE_URL: "redis://redis:6379",
            },
          },
        },
      },
      {
        id: "task-worker-1",
        type: "serviceNode",
        position: { x: 500, y: 100 },
        data: {
          config: {
            name: "Task Worker",
            type: "worker",
            techStack: "celery",
            port: 0,
            cpu: 1,
            memory: 1024,
            replicas: 3,
            environment: {
              CELERY_BROKER_URL: "redis://redis:6379",
              WORKER_CONCURRENCY: "4",
            },
          },
        },
      },
      {
        id: "redis-queue-1",
        type: "serviceNode",
        position: { x: 400, y: 250 },
        data: {
          config: {
            name: "Redis Queue",
            type: "queue",
            techStack: "redis",
            port: 6379,
            cpu: 0.5,
            memory: 1024,
            replicas: 1,
            environment: {
              REDIS_MAXMEMORY: "512mb",
              REDIS_PERSISTENCE: "aof",
            },
          },
        },
      },
      {
        id: "postgres-tasks-1",
        type: "serviceNode",
        position: { x: 400, y: 400 },
        data: {
          config: {
            name: "Task Database",
            type: "database",
            techStack: "postgresql",
            port: 5432,
            cpu: 1,
            memory: 2048,
            replicas: 1,
            environment: {
              POSTGRES_DB: "tasks_db",
              POSTGRES_MAX_CONNECTIONS: "50",
            },
          },
        },
      },
    ],
    edges: [
      {
        id: "edge-1",
        source: "web-frontend-1",
        target: "redis-queue-1",
        type: "tls-async",
      },
      {
        id: "edge-2",
        source: "task-worker-1",
        target: "redis-queue-1",
        type: "tls-async",
      },
      {
        id: "edge-3",
        source: "task-worker-1",
        target: "postgres-tasks-1",
        type: "encrypted-data",
      },
      {
        id: "edge-4",
        source: "web-frontend-1",
        target: "postgres-tasks-1",
        type: "encrypted-data",
      },
    ],
  },
  {
    id: "cms-basic",
    name: "Content Management System",
    description: "Basic CMS with admin panel, public API, and file storage",
    category: "CMS",
    complexity: "Simple",
    tags: ["cms", "content", "admin", "storage", "low-risk"],
    nodes: [
      {
        id: "admin-panel-1",
        type: "serviceNode",
        position: { x: 200, y: 100 },
        data: {
          config: {
            name: "Admin Panel",
            type: "frontend",
            techStack: "react",
            port: 3000,
            healthCheckPath: "/health",
            cpu: 0.5,
            memory: 512,
            replicas: 2,
            environment: {
              REACT_APP_API_URL: "http://api:8000",
              NODE_ENV: "production",
            },
          },
        },
      },
      {
        id: "public-api-1",
        type: "serviceNode",
        position: { x: 400, y: 100 },
        data: {
          config: {
            name: "Public API",
            type: "api",
            techStack: "express",
            port: 8000,
            healthCheckPath: "/health",
            cpu: 1,
            memory: 1024,
            replicas: 2,
            environment: {
              NODE_ENV: "production",
              UPLOAD_MAX_SIZE: "10MB",
            },
          },
        },
      },
      {
        id: "file-storage-cms-1",
        type: "serviceNode",
        position: { x: 600, y: 100 },
        data: {
          config: {
            name: "File Storage",
            type: "storage",
            techStack: "minio",
            port: 9000,
            cpu: 0.5,
            memory: 1024,
            replicas: 1,
            environment: {
              MINIO_ACCESS_KEY: "admin",
              MINIO_BROWSER: "on",
            },
          },
        },
      },
      {
        id: "postgres-cms-1",
        type: "serviceNode",
        position: { x: 400, y: 250 },
        data: {
          config: {
            name: "CMS Database",
            type: "database",
            techStack: "postgresql",
            port: 5432,
            cpu: 1.5,
            memory: 2048,
            replicas: 1,
            environment: {
              POSTGRES_DB: "cms_db",
              POSTGRES_MAX_CONNECTIONS: "100",
            },
          },
        },
      },
    ],
    edges: [
      {
        id: "edge-1",
        source: "admin-panel-1",
        target: "public-api-1",
        type: "sync",
      },
      {
        id: "edge-2",
        source: "public-api-1",
        target: "postgres-cms-1",
        type: "data-flow",
      },
      {
        id: "edge-3",
        source: "public-api-1",
        target: "file-storage-cms-1",
        type: "data-flow",
      },
    ],
  },
  {
    id: "rest-api-auth",
    name: "REST API with Authentication",
    description: "Secure REST API with JWT authentication and rate limiting",
    category: "API",
    complexity: "Simple",
    tags: ["rest", "auth", "jwt", "security", "low-risk"],
    nodes: [
      {
        id: "auth-gateway-1",
        type: "serviceNode",
        position: { x: 400, y: 50 },
        data: {
          config: {
            name: "Auth Gateway",
            type: "gateway",
            techStack: "nginx",
            port: 80,
            healthCheckPath: "/health",
            cpu: 0.5,
            memory: 512,
            replicas: 2,
            environment: {
              RATE_LIMIT: "100r/m",
              SSL_ENABLED: "true",
            },
          },
        },
      },
      {
        id: "auth-service-simple-1",
        type: "serviceNode",
        position: { x: 300, y: 200 },
        data: {
          config: {
            name: "Auth Service",
            type: "auth",
            techStack: "express",
            port: 3001,
            healthCheckPath: "/health",
            cpu: 0.5,
            memory: 512,
            replicas: 2,
            environment: {
              JWT_SECRET: "your-secret-key",
              TOKEN_EXPIRY: "24h",
            },
          },
        },
      },
      {
        id: "api-service-simple-1",
        type: "serviceNode",
        position: { x: 500, y: 200 },
        data: {
          config: {
            name: "API Service",
            type: "api",
            techStack: "fastapi",
            port: 8000,
            healthCheckPath: "/health",
            cpu: 1,
            memory: 1024,
            replicas: 2,
            environment: {
              LOG_LEVEL: "INFO",
              CORS_ORIGINS: "*",
            },
          },
        },
      },
      {
        id: "postgres-auth-1",
        type: "serviceNode",
        position: { x: 400, y: 350 },
        data: {
          config: {
            name: "User Database",
            type: "database",
            techStack: "postgresql",
            port: 5432,
            cpu: 1,
            memory: 1024,
            replicas: 1,
            environment: {
              POSTGRES_DB: "users_db",
              POSTGRES_MAX_CONNECTIONS: "50",
            },
          },
        },
      },
    ],
    edges: [
      {
        id: "edge-1",
        source: "auth-gateway-1",
        target: "auth-service-simple-1",
        type: "sync",
      },
      {
        id: "edge-2",
        source: "auth-gateway-1",
        target: "api-service-simple-1",
        type: "sync",
      },
      {
        id: "edge-3",
        source: "auth-service-simple-1",
        target: "postgres-auth-1",
        type: "data-flow",
      },
      {
        id: "edge-4",
        source: "api-service-simple-1",
        target: "postgres-auth-1",
        type: "data-flow",
      },
    ],
  },
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
        type: "data-flow",
      },
      {
        id: "edge-6",
        source: "product-service-1",
        target: "mongodb-1",
        type: "data-flow",
      },
      {
        id: "edge-7",
        source: "payment-service-1",
        target: "redis-cache-1",
        type: "data-flow",
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
        type: "data-flow",
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
        type: "data-flow",
      },
      {
        id: "edge-7",
        source: "grafana-1",
        target: "jaeger-1",
        type: "data-flow",
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
        type: "data-flow",
      },
      {
        id: "edge-3",
        source: "auth-service-2",
        target: "postgres-db-3",
        type: "data-flow",
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
        type: "data-flow",
      },
      {
        id: "edge-2",
        source: "feed-service-1",
        target: "cassandra-db-1",
        type: "data-flow",
      },
      {
        id: "edge-3",
        source: "messaging-service-1",
        target: "cassandra-db-1",
        type: "data-flow",
      },
      {
        id: "edge-4",
        source: "media-service-1",
        target: "s3-storage-1",
        type: "data-flow",
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
        type: "data-flow",
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
        type: "data-flow",
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
        type: "data-flow",
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
        type: "data-flow",
      },
      {
        id: "edge-6",
        source: "clickhouse-1",
        target: "grafana-2",
        type: "data-flow",
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
        type: "data-flow",
      },
      {
        id: "edge-5",
        source: "market-data-1",
        target: "redis-stream-1",
        type: "data-flow",
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
        type: "data-flow",
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
        type: "data-flow",
      },
      {
        id: "edge-5",
        source: "matchmaking-1",
        target: "redis-gaming-1",
        type: "data-flow",
      },
      {
        id: "edge-6",
        source: "game-server-1",
        target: "mongodb-gaming-1",
        type: "data-flow",
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
        type: "data-flow",
      },
      {
        id: "edge-2",
        source: "appointment-service-1",
        target: "encrypted-db-1",
        type: "data-flow",
      },
      {
        id: "edge-3",
        source: "telemedicine-1",
        target: "file-storage-1",
        type: "data-flow",
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
  {
    id: "ai-chatbot-platform",
    name: "AI Chatbot Platform",
    description:
      "Complete AI chatbot platform with LLM inference, vector search, and conversation management",
    category: "AI/ML",
    complexity: "Medium",
    tags: ["ai", "chatbot", "llm", "vector-search", "conversation"],
    nodes: [
      {
        id: "api-gateway-ai-1",
        type: "serviceNode",
        position: { x: 400, y: 50 },
        data: {
          config: {
            name: "API Gateway",
            type: "gateway",
            techStack: "nginx",
            port: 80,
            healthCheckPath: "/health",
            cpu: 1,
            memory: 1024,
            replicas: 2,
            environment: {
              RATE_LIMIT: "1000r/m",
              TIMEOUT: "60s",
            },
          },
        },
      },
      {
        id: "chat-api-1",
        type: "serviceNode",
        position: { x: 200, y: 200 },
        data: {
          config: {
            name: "Chat API",
            type: "api",
            techStack: "fastapi",
            port: 8000,
            healthCheckPath: "/health",
            cpu: 2,
            memory: 4096,
            replicas: 3,
            environment: {
              MAX_WORKERS: "4",
              STREAMING_ENABLED: "true",
            },
          },
        },
      },
      {
        id: "ollama-llm-1",
        type: "serviceNode",
        position: { x: 400, y: 200 },
        data: {
          config: {
            name: "Ollama LLM",
            type: "ml",
            techStack: "ollama",
            port: 11434,
            healthCheckPath: "/api/tags",
            cpu: 8,
            memory: 16384,
            replicas: 2,
            environment: {
              OLLAMA_HOST: "0.0.0.0",
              OLLAMA_MODELS: "/app/models",
              OLLAMA_NUM_PARALLEL: "4",
            },
          },
        },
      },
      {
        id: "chroma-vector-1",
        type: "serviceNode",
        position: { x: 600, y: 200 },
        data: {
          config: {
            name: "Vector Database",
            type: "ml",
            techStack: "chromadb",
            port: 8000,
            healthCheckPath: "/api/v1/heartbeat",
            cpu: 2,
            memory: 4096,
            replicas: 1,
            environment: {
              CHROMA_SERVER_HOST: "0.0.0.0",
              PERSIST_DIRECTORY: "/chroma/data",
            },
          },
        },
      },
      {
        id: "postgres-chat-1",
        type: "serviceNode",
        position: { x: 300, y: 350 },
        data: {
          config: {
            name: "Chat Database",
            type: "database",
            techStack: "postgresql",
            port: 5432,
            cpu: 2,
            memory: 4096,
            replicas: 1,
            environment: {
              POSTGRES_DB: "chatbot_db",
              POSTGRES_MAX_CONNECTIONS: "100",
            },
          },
        },
      },
      {
        id: "redis-session-1",
        type: "serviceNode",
        position: { x: 500, y: 350 },
        data: {
          config: {
            name: "Session Cache",
            type: "cache",
            techStack: "redis",
            port: 6379,
            cpu: 1,
            memory: 2048,
            replicas: 1,
            environment: {
              REDIS_MAXMEMORY: "1gb",
              REDIS_MAXMEMORY_POLICY: "allkeys-lru",
            },
          },
        },
      },
    ],
    edges: [
      {
        id: "edge-1",
        source: "api-gateway-ai-1",
        target: "chat-api-1",
        type: "https",
      },
      {
        id: "edge-2",
        source: "chat-api-1",
        target: "ollama-llm-1",
        type: "https",
      },
      {
        id: "edge-3",
        source: "chat-api-1",
        target: "chroma-vector-1",
        type: "https",
      },
      {
        id: "edge-4",
        source: "chat-api-1",
        target: "postgres-chat-1",
        type: "encrypted-data",
      },
      {
        id: "edge-5",
        source: "chat-api-1",
        target: "redis-session-1",
        type: "encrypted-data",
      },
    ],
  },
  {
    id: "ml-training-pipeline",
    name: "ML Training Pipeline",
    description:
      "End-to-end ML training pipeline with data processing, model training, and experiment tracking",
    category: "AI/ML",
    complexity: "Complex",
    tags: ["ml", "training", "pipeline", "mlops", "experiment-tracking"],
    nodes: [
      {
        id: "data-ingestion-1",
        type: "serviceNode",
        position: { x: 150, y: 100 },
        data: {
          config: {
            name: "Data Ingestion",
            type: "api",
            techStack: "fastapi",
            port: 8000,
            healthCheckPath: "/health",
            cpu: 2,
            memory: 4096,
            replicas: 2,
            environment: {
              BATCH_SIZE: "1000",
              DATA_VALIDATION: "true",
            },
          },
        },
      },
      {
        id: "airflow-orchestrator-1",
        type: "serviceNode",
        position: { x: 350, y: 100 },
        data: {
          config: {
            name: "ML Orchestrator",
            type: "ml",
            techStack: "airflow",
            port: 8080,
            healthCheckPath: "/health",
            cpu: 4,
            memory: 8192,
            replicas: 1,
            environment: {
              AIRFLOW__CORE__EXECUTOR: "CeleryExecutor",
              AIRFLOW__CORE__PARALLELISM: "32",
            },
          },
        },
      },
      {
        id: "jupyter-lab-1",
        type: "serviceNode",
        position: { x: 550, y: 100 },
        data: {
          config: {
            name: "Jupyter Lab",
            type: "ml",
            techStack: "jupyter",
            port: 8888,
            healthCheckPath: "/api/status",
            cpu: 4,
            memory: 8192,
            replicas: 1,
            environment: {
              JUPYTER_ENABLE_LAB: "yes",
              JUPYTER_TOKEN: "ml-research-token",
            },
          },
        },
      },
      {
        id: "mlflow-tracking-1",
        type: "serviceNode",
        position: { x: 750, y: 100 },
        data: {
          config: {
            name: "MLflow Tracking",
            type: "ml",
            techStack: "mlflow",
            port: 5000,
            healthCheckPath: "/health",
            cpu: 2,
            memory: 4096,
            replicas: 1,
            environment: {
              MLFLOW_BACKEND_STORE_URI:
                "postgresql://user:pass@postgres:5432/mlflow",
              MLFLOW_DEFAULT_ARTIFACT_ROOT: "s3://ml-artifacts/",
            },
          },
        },
      },
      {
        id: "ray-training-1",
        type: "serviceNode",
        position: { x: 950, y: 100 },
        data: {
          config: {
            name: "Ray Training",
            type: "ml",
            techStack: "ray",
            port: 8000,
            healthCheckPath: "/-/healthz",
            cpu: 16,
            memory: 32768,
            replicas: 3,
            environment: {
              RAY_WORKER_GPU: "1",
              RAY_MEMORY_LIMIT: "30GB",
            },
          },
        },
      },
      {
        id: "postgres-ml-1",
        type: "serviceNode",
        position: { x: 300, y: 300 },
        data: {
          config: {
            name: "ML Metadata DB",
            type: "database",
            techStack: "postgresql",
            port: 5432,
            cpu: 4,
            memory: 8192,
            replicas: 1,
            environment: {
              POSTGRES_DB: "ml_metadata",
              POSTGRES_SHARED_BUFFERS: "2GB",
            },
          },
        },
      },
      {
        id: "minio-storage-1",
        type: "serviceNode",
        position: { x: 500, y: 300 },
        data: {
          config: {
            name: "Model Storage",
            type: "storage",
            techStack: "minio",
            port: 9000,
            cpu: 2,
            memory: 4096,
            replicas: 1,
            environment: {
              MINIO_ACCESS_KEY: "minio",
              MINIO_SECRET_KEY: "minio123",
            },
          },
        },
      },
      {
        id: "feast-features-1",
        type: "serviceNode",
        position: { x: 700, y: 300 },
        data: {
          config: {
            name: "Feature Store",
            type: "ml",
            techStack: "feast",
            port: 6566,
            healthCheckPath: "/health",
            cpu: 2,
            memory: 4096,
            replicas: 1,
            environment: {
              FEAST_USAGE: "False",
              FEAST_SERVER_TYPE: "http",
            },
          },
        },
      },
    ],
    edges: [
      {
        id: "edge-1",
        source: "data-ingestion-1",
        target: "airflow-orchestrator-1",
        type: "https",
      },
      {
        id: "edge-2",
        source: "airflow-orchestrator-1",
        target: "ray-training-1",
        type: "https",
      },
      {
        id: "edge-3",
        source: "jupyter-lab-1",
        target: "mlflow-tracking-1",
        type: "https",
      },
      {
        id: "edge-4",
        source: "ray-training-1",
        target: "mlflow-tracking-1",
        type: "https",
      },
      {
        id: "edge-5",
        source: "mlflow-tracking-1",
        target: "postgres-ml-1",
        type: "encrypted-data",
      },
      {
        id: "edge-6",
        source: "ray-training-1",
        target: "minio-storage-1",
        type: "encrypted-data",
      },
      {
        id: "edge-7",
        source: "data-ingestion-1",
        target: "feast-features-1",
        type: "https",
      },
    ],
  },
  {
    id: "ai-content-generation",
    name: "AI Content Generation Platform",
    description:
      "Multi-modal AI platform for text, image, and audio generation with queue-based processing",
    category: "AI/ML",
    complexity: "Complex",
    tags: ["ai", "generation", "multimodal", "queue", "text", "image", "audio"],
    nodes: [
      {
        id: "content-api-1",
        type: "serviceNode",
        position: { x: 400, y: 50 },
        data: {
          config: {
            name: "Content API",
            type: "api",
            techStack: "fastapi",
            port: 8000,
            healthCheckPath: "/health",
            cpu: 2,
            memory: 4096,
            replicas: 3,
            environment: {
              MAX_WORKERS: "8",
              QUEUE_TIMEOUT: "300",
            },
          },
        },
      },
      {
        id: "redis-queue-ai-1",
        type: "serviceNode",
        position: { x: 400, y: 150 },
        data: {
          config: {
            name: "Task Queue",
            type: "queue",
            techStack: "redis",
            port: 6379,
            cpu: 2,
            memory: 4096,
            replicas: 1,
            environment: {
              REDIS_MAXMEMORY: "3gb",
              REDIS_PERSISTENCE: "aof",
            },
          },
        },
      },
      {
        id: "text-generation-1",
        type: "serviceNode",
        position: { x: 150, y: 300 },
        data: {
          config: {
            name: "Text Generation",
            type: "ml",
            techStack: "vllm",
            port: 8000,
            healthCheckPath: "/health",
            cpu: 8,
            memory: 32768,
            replicas: 2,
            environment: {
              MODEL: "meta-llama/Llama-2-7b-chat-hf",
              TENSOR_PARALLEL_SIZE: "2",
            },
          },
        },
      },
      {
        id: "image-generation-1",
        type: "serviceNode",
        position: { x: 400, y: 300 },
        data: {
          config: {
            name: "Image Generation",
            type: "ml",
            techStack: "stable-diffusion",
            port: 7860,
            healthCheckPath: "/health",
            cpu: 8,
            memory: 24576,
            replicas: 1,
            environment: {
              MODEL_ID: "runwayml/stable-diffusion-v1-5",
              DEVICE: "cuda",
            },
          },
        },
      },
      {
        id: "audio-generation-1",
        type: "serviceNode",
        position: { x: 650, y: 300 },
        data: {
          config: {
            name: "Audio Generation",
            type: "ml",
            techStack: "whisper",
            port: 9000,
            healthCheckPath: "/health",
            cpu: 4,
            memory: 8192,
            replicas: 1,
            environment: {
              MODEL_SIZE: "large",
              DEVICE: "cuda",
            },
          },
        },
      },
      {
        id: "content-moderator-1",
        type: "serviceNode",
        position: { x: 850, y: 200 },
        data: {
          config: {
            name: "Content Moderator",
            type: "ml",
            techStack: "huggingface-tgi",
            port: 8080,
            healthCheckPath: "/health",
            cpu: 4,
            memory: 8192,
            replicas: 1,
            environment: {
              MODEL_ID: "unitary/toxic-bert",
              MAX_CONCURRENT_REQUESTS: "32",
            },
          },
        },
      },
      {
        id: "postgres-content-1",
        type: "serviceNode",
        position: { x: 200, y: 450 },
        data: {
          config: {
            name: "Content Database",
            type: "database",
            techStack: "postgresql",
            port: 5432,
            cpu: 2,
            memory: 4096,
            replicas: 1,
            environment: {
              POSTGRES_DB: "content_db",
              POSTGRES_MAX_CONNECTIONS: "100",
            },
          },
        },
      },
      {
        id: "s3-storage-content-1",
        type: "serviceNode",
        position: { x: 500, y: 450 },
        data: {
          config: {
            name: "Media Storage",
            type: "storage",
            techStack: "minio",
            port: 9000,
            cpu: 1,
            memory: 2048,
            replicas: 1,
            environment: {
              MINIO_BROWSER: "on",
              MINIO_COMPRESSION: "true",
            },
          },
        },
      },
    ],
    edges: [
      {
        id: "edge-1",
        source: "content-api-1",
        target: "redis-queue-ai-1",
        type: "tls-async",
      },
      {
        id: "edge-2",
        source: "redis-queue-ai-1",
        target: "text-generation-1",
        type: "tls-async",
      },
      {
        id: "edge-3",
        source: "redis-queue-ai-1",
        target: "image-generation-1",
        type: "tls-async",
      },
      {
        id: "edge-4",
        source: "redis-queue-ai-1",
        target: "audio-generation-1",
        type: "tls-async",
      },
      {
        id: "edge-5",
        source: "content-api-1",
        target: "content-moderator-1",
        type: "https",
      },
      {
        id: "edge-6",
        source: "content-api-1",
        target: "postgres-content-1",
        type: "encrypted-data",
      },
      {
        id: "edge-7",
        source: "image-generation-1",
        target: "s3-storage-content-1",
        type: "encrypted-data",
      },
      {
        id: "edge-8",
        source: "audio-generation-1",
        target: "s3-storage-content-1",
        type: "encrypted-data",
      },
    ],
  },
  {
    id: "rag-knowledge-base",
    name: "RAG Knowledge Base System",
    description:
      "Retrieval-Augmented Generation system with document processing and semantic search",
    category: "AI/ML",
    complexity: "Medium",
    tags: [
      "rag",
      "knowledge-base",
      "embeddings",
      "semantic-search",
      "documents",
    ],
    nodes: [
      {
        id: "rag-api-1",
        type: "serviceNode",
        position: { x: 400, y: 100 },
        data: {
          config: {
            name: "RAG API",
            type: "api",
            techStack: "langchain",
            port: 8080,
            healthCheckPath: "/health",
            cpu: 4,
            memory: 8192,
            replicas: 2,
            environment: {
              OPENAI_API_KEY: "sk-xxx",
              CHUNK_SIZE: "1000",
              CHUNK_OVERLAP: "200",
            },
          },
        },
      },
      {
        id: "document-processor-1",
        type: "serviceNode",
        position: { x: 200, y: 200 },
        data: {
          config: {
            name: "Document Processor",
            type: "ml",
            techStack: "langchain",
            port: 8001,
            healthCheckPath: "/health",
            cpu: 2,
            memory: 4096,
            replicas: 1,
            environment: {
              SUPPORTED_FORMATS: "pdf,docx,txt,md",
              MAX_FILE_SIZE: "50MB",
            },
          },
        },
      },
      {
        id: "embedding-service-1",
        type: "serviceNode",
        position: { x: 400, y: 200 },
        data: {
          config: {
            name: "Embedding Service",
            type: "ml",
            techStack: "huggingface-tgi",
            port: 8080,
            healthCheckPath: "/health",
            cpu: 4,
            memory: 8192,
            replicas: 1,
            environment: {
              MODEL_ID: "sentence-transformers/all-MiniLM-L6-v2",
              BATCH_SIZE: "32",
            },
          },
        },
      },
      {
        id: "qdrant-vector-1",
        type: "serviceNode",
        position: { x: 600, y: 200 },
        data: {
          config: {
            name: "Vector Database",
            type: "ml",
            techStack: "qdrant",
            port: 6333,
            healthCheckPath: "/health",
            cpu: 4,
            memory: 8192,
            replicas: 1,
            environment: {
              QDRANT__SERVICE__HTTP_PORT: "6333",
              QDRANT__STORAGE__STORAGE_PATH: "/qdrant/storage",
            },
          },
        },
      },
      {
        id: "llm-service-1",
        type: "serviceNode",
        position: { x: 800, y: 200 },
        data: {
          config: {
            name: "LLM Service",
            type: "ml",
            techStack: "ollama",
            port: 11434,
            healthCheckPath: "/api/tags",
            cpu: 8,
            memory: 16384,
            replicas: 1,
            environment: {
              OLLAMA_MODELS: "/app/models",
              OLLAMA_NUM_PARALLEL: "2",
            },
          },
        },
      },
      {
        id: "postgres-docs-1",
        type: "serviceNode",
        position: { x: 300, y: 350 },
        data: {
          config: {
            name: "Document Metadata",
            type: "database",
            techStack: "postgresql",
            port: 5432,
            cpu: 2,
            memory: 4096,
            replicas: 1,
            environment: {
              POSTGRES_DB: "documents_db",
              POSTGRES_EXTENSION: "vector",
            },
          },
        },
      },
      {
        id: "elasticsearch-search-1",
        type: "serviceNode",
        position: { x: 500, y: 350 },
        data: {
          config: {
            name: "Text Search",
            type: "search",
            techStack: "elasticsearch",
            port: 9200,
            cpu: 2,
            memory: 4096,
            replicas: 1,
            environment: {
              "cluster.name": "rag-search",
              "discovery.type": "single-node",
            },
          },
        },
      },
      {
        id: "redis-cache-rag-1",
        type: "serviceNode",
        position: { x: 700, y: 350 },
        data: {
          config: {
            name: "Query Cache",
            type: "cache",
            techStack: "redis",
            port: 6379,
            cpu: 1,
            memory: 2048,
            replicas: 1,
            environment: {
              REDIS_MAXMEMORY: "1gb",
              REDIS_MAXMEMORY_POLICY: "allkeys-lru",
            },
          },
        },
      },
    ],
    edges: [
      {
        id: "edge-1",
        source: "rag-api-1",
        target: "document-processor-1",
        type: "https",
      },
      {
        id: "edge-2",
        source: "document-processor-1",
        target: "embedding-service-1",
        type: "https",
      },
      {
        id: "edge-3",
        source: "embedding-service-1",
        target: "qdrant-vector-1",
        type: "https",
      },
      {
        id: "edge-4",
        source: "rag-api-1",
        target: "qdrant-vector-1",
        type: "https",
      },
      {
        id: "edge-5",
        source: "rag-api-1",
        target: "llm-service-1",
        type: "https",
      },
      {
        id: "edge-6",
        source: "rag-api-1",
        target: "postgres-docs-1",
        type: "encrypted-data",
      },
      {
        id: "edge-7",
        source: "rag-api-1",
        target: "elasticsearch-search-1",
        type: "https",
      },
      {
        id: "edge-8",
        source: "rag-api-1",
        target: "redis-cache-rag-1",
        type: "encrypted-data",
      },
    ],
  },
  {
    id: "computer-vision-pipeline",
    name: "Computer Vision Processing Pipeline",
    description:
      "Real-time computer vision system for object detection, classification, and analysis",
    category: "AI/ML",
    complexity: "Complex",
    tags: [
      "computer-vision",
      "object-detection",
      "classification",
      "real-time",
      "pipeline",
    ],
    nodes: [
      {
        id: "vision-api-1",
        type: "serviceNode",
        position: { x: 400, y: 50 },
        data: {
          config: {
            name: "Vision API",
            type: "api",
            techStack: "fastapi",
            port: 8000,
            healthCheckPath: "/health",
            cpu: 2,
            memory: 4096,
            replicas: 3,
            environment: {
              MAX_FILE_SIZE: "100MB",
              SUPPORTED_FORMATS: "jpg,png,webp,mp4",
            },
          },
        },
      },
      {
        id: "image-preprocessor-1",
        type: "serviceNode",
        position: { x: 200, y: 200 },
        data: {
          config: {
            name: "Image Preprocessor",
            type: "ml",
            techStack: "opencv",
            port: 8001,
            healthCheckPath: "/health",
            cpu: 4,
            memory: 8192,
            replicas: 2,
            environment: {
              RESIZE_STRATEGY: "adaptive",
              BATCH_SIZE: "16",
            },
          },
        },
      },
      {
        id: "object-detector-1",
        type: "serviceNode",
        position: { x: 400, y: 200 },
        data: {
          config: {
            name: "Object Detector",
            type: "ml",
            techStack: "triton",
            port: 8000,
            healthCheckPath: "/v2/health/ready",
            cpu: 8,
            memory: 16384,
            replicas: 2,
            environment: {
              TRITON_MODEL_REPOSITORY: "/models",
              MODEL_NAME: "yolov8n",
            },
          },
        },
      },
      {
        id: "classifier-1",
        type: "serviceNode",
        position: { x: 600, y: 200 },
        data: {
          config: {
            name: "Image Classifier",
            type: "ml",
            techStack: "tensorboard",
            port: 8500,
            healthCheckPath: "/v1/models",
            cpu: 6,
            memory: 12288,
            replicas: 1,
            environment: {
              MODEL_NAME: "resnet50",
              MODEL_VERSION: "1",
            },
          },
        },
      },
      {
        id: "face-recognition-1",
        type: "serviceNode",
        position: { x: 800, y: 200 },
        data: {
          config: {
            name: "Face Recognition",
            type: "ml",
            techStack: "triton",
            port: 8001,
            healthCheckPath: "/v2/health/ready",
            cpu: 4,
            memory: 8192,
            replicas: 1,
            environment: {
              MODEL_NAME: "arcface",
              CONFIDENCE_THRESHOLD: "0.7",
            },
          },
        },
      },
      {
        id: "kafka-vision-1",
        type: "serviceNode",
        position: { x: 400, y: 350 },
        data: {
          config: {
            name: "Vision Stream",
            type: "queue",
            techStack: "kafka",
            port: 9092,
            cpu: 4,
            memory: 8192,
            replicas: 3,
            environment: {
              KAFKA_HEAP_OPTS: "-Xmx4G",
              KAFKA_NUM_PARTITIONS: "12",
            },
          },
        },
      },
      {
        id: "mongodb-vision-1",
        type: "serviceNode",
        position: { x: 200, y: 500 },
        data: {
          config: {
            name: "Vision Results",
            type: "database",
            techStack: "mongodb",
            port: 27017,
            cpu: 2,
            memory: 4096,
            replicas: 1,
            environment: {
              MONGO_INITDB_DATABASE: "vision_db",
              MONGO_REPLICA_SET: "vision-rs",
            },
          },
        },
      },
      {
        id: "minio-vision-1",
        type: "serviceNode",
        position: { x: 600, y: 500 },
        data: {
          config: {
            name: "Media Storage",
            type: "storage",
            techStack: "minio",
            port: 9000,
            cpu: 2,
            memory: 4096,
            replicas: 1,
            environment: {
              MINIO_COMPRESSION: "true",
              MINIO_BROWSER: "on",
            },
          },
        },
      },
    ],
    edges: [
      {
        id: "edge-1",
        source: "vision-api-1",
        target: "image-preprocessor-1",
        type: "https",
      },
      {
        id: "edge-2",
        source: "image-preprocessor-1",
        target: "object-detector-1",
        type: "https",
      },
      {
        id: "edge-3",
        source: "image-preprocessor-1",
        target: "classifier-1",
        type: "https",
      },
      {
        id: "edge-4",
        source: "image-preprocessor-1",
        target: "face-recognition-1",
        type: "https",
      },
      {
        id: "edge-5",
        source: "object-detector-1",
        target: "kafka-vision-1",
        type: "tls-async",
      },
      {
        id: "edge-6",
        source: "classifier-1",
        target: "kafka-vision-1",
        type: "tls-async",
      },
      {
        id: "edge-7",
        source: "kafka-vision-1",
        target: "mongodb-vision-1",
        type: "encrypted-data",
      },
      {
        id: "edge-8",
        source: "vision-api-1",
        target: "minio-vision-1",
        type: "encrypted-data",
      },
    ],
  },
  {
    id: "ai-recommendation-engine",
    name: "AI Recommendation Engine",
    description:
      "Personalized recommendation system with collaborative filtering and real-time inference",
    category: "AI/ML",
    complexity: "Medium",
    tags: [
      "recommendations",
      "collaborative-filtering",
      "personalization",
      "real-time",
    ],
    nodes: [
      {
        id: "recommendation-api-1",
        type: "serviceNode",
        position: { x: 400, y: 100 },
        data: {
          config: {
            name: "Recommendation API",
            type: "api",
            techStack: "fastapi",
            port: 8000,
            healthCheckPath: "/health",
            cpu: 2,
            memory: 4096,
            replicas: 3,
            environment: {
              REAL_TIME_THRESHOLD: "100ms",
              BATCH_SIZE: "32",
            },
          },
        },
      },
      {
        id: "user-profiler-1",
        type: "serviceNode",
        position: { x: 200, y: 250 },
        data: {
          config: {
            name: "User Profiler",
            type: "ml",
            techStack: "ray",
            port: 8000,
            healthCheckPath: "/-/healthz",
            cpu: 4,
            memory: 8192,
            replicas: 2,
            environment: {
              PROFILE_UPDATE_INTERVAL: "1h",
              FEATURE_COUNT: "1000",
            },
          },
        },
      },
      {
        id: "content-analyzer-1",
        type: "serviceNode",
        position: { x: 400, y: 250 },
        data: {
          config: {
            name: "Content Analyzer",
            type: "ml",
            techStack: "huggingface-tgi",
            port: 8080,
            healthCheckPath: "/health",
            cpu: 4,
            memory: 8192,
            replicas: 1,
            environment: {
              MODEL_ID: "sentence-transformers/all-MiniLM-L6-v2",
              EMBEDDING_DIM: "384",
            },
          },
        },
      },
      {
        id: "recommendation-model-1",
        type: "serviceNode",
        position: { x: 600, y: 250 },
        data: {
          config: {
            name: "Recommendation Model",
            type: "ml",
            techStack: "bentoml",
            port: 3000,
            healthCheckPath: "/healthz",
            cpu: 8,
            memory: 16384,
            replicas: 2,
            environment: {
              MODEL_TYPE: "collaborative_filtering",
              INFERENCE_TIMEOUT: "50ms",
            },
          },
        },
      },
      {
        id: "feature-store-1",
        type: "serviceNode",
        position: { x: 150, y: 400 },
        data: {
          config: {
            name: "Feature Store",
            type: "ml",
            techStack: "feast",
            port: 6566,
            healthCheckPath: "/health",
            cpu: 2,
            memory: 4096,
            replicas: 1,
            environment: {
              ONLINE_STORE: "redis",
              OFFLINE_STORE: "s3",
            },
          },
        },
      },
      {
        id: "redis-features-1",
        type: "serviceNode",
        position: { x: 350, y: 400 },
        data: {
          config: {
            name: "Feature Cache",
            type: "cache",
            techStack: "redis",
            port: 6379,
            cpu: 2,
            memory: 4096,
            replicas: 1,
            environment: {
              REDIS_MAXMEMORY: "3gb",
              FEATURE_TTL: "3600",
            },
          },
        },
      },
      {
        id: "weaviate-content-1",
        type: "serviceNode",
        position: { x: 550, y: 400 },
        data: {
          config: {
            name: "Content Embeddings",
            type: "ml",
            techStack: "weaviate",
            port: 8080,
            healthCheckPath: "/v1/.well-known/ready",
            cpu: 4,
            memory: 8192,
            replicas: 1,
            environment: {
              DEFAULT_VECTORIZER_MODULE: "text2vec-transformers",
              VECTOR_DIMENSIONS: "384",
            },
          },
        },
      },
      {
        id: "clickhouse-analytics-1",
        type: "serviceNode",
        position: { x: 750, y: 400 },
        data: {
          config: {
            name: "Analytics DB",
            type: "database",
            techStack: "clickhouse",
            port: 8123,
            cpu: 4,
            memory: 8192,
            replicas: 1,
            environment: {
              CLICKHOUSE_DB: "recommendations",
              MAX_MEMORY_USAGE: "6000000000",
            },
          },
        },
      },
    ],
    edges: [
      {
        id: "edge-1",
        source: "recommendation-api-1",
        target: "user-profiler-1",
        type: "https",
      },
      {
        id: "edge-2",
        source: "recommendation-api-1",
        target: "content-analyzer-1",
        type: "https",
      },
      {
        id: "edge-3",
        source: "recommendation-api-1",
        target: "recommendation-model-1",
        type: "https",
      },
      {
        id: "edge-4",
        source: "user-profiler-1",
        target: "feature-store-1",
        type: "https",
      },
      {
        id: "edge-5",
        source: "feature-store-1",
        target: "redis-features-1",
        type: "encrypted-data",
      },
      {
        id: "edge-6",
        source: "content-analyzer-1",
        target: "weaviate-content-1",
        type: "https",
      },
      {
        id: "edge-7",
        source: "recommendation-model-1",
        target: "clickhouse-analytics-1",
        type: "encrypted-data",
      },
      {
        id: "edge-8",
        source: "recommendation-api-1",
        target: "redis-features-1",
        type: "encrypted-data",
      },
    ],
  },
];

export const templateCategories = [
  "All",
  "Web",
  "API",
  "Monolith",
  "Queue",
  "CMS",
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
  "AI/ML",
];

export const complexityLevels = ["Simple", "Medium", "Complex"];
