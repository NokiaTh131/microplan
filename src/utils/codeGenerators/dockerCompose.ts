 
import { Node, Edge } from "@xyflow/react";

interface DockerService {
  image: string;
  ports?: string[];
  environment?: Record<string, string>;
  depends_on?: string[];
  volumes?: string[];
  deploy?: {
    replicas?: number;
    resources?: {
      limits?: {
        cpus?: string;
        memory?: string;
      };
    };
  };
  command?: string;
  healthcheck?: {
    test: string[];
    interval: string;
    timeout: string;
    retries: number;
  };
  networks: string[];
}

interface DockerComposeFile {
  services: Record<string, DockerService>;
  volumes?: Record<string, any>;
  networks?: Record<string, any>;
}

export class DockerComposeGenerator {
  private nodes: Node[];
  private edges: Edge[];

  constructor(nodes: Node[], edges: Edge[]) {
    this.nodes = nodes;
    this.edges = edges;
  }

  public generate(): string {
    const compose: DockerComposeFile = {
      services: {},
      volumes: {},
      networks: {
        microservices: {
          driver: "bridge",
        },
      },
    };

    this.nodes.forEach((node) => {
      const config = (node.data as any)?.config;
      if (!config) return;

      const serviceName = this.sanitizeServiceName(config.name);
      const service = this.createDockerService(config);

      compose.services[serviceName] = service;

      // Add volumes for databases
      if (config.type === "database") {
        compose.volumes![`${serviceName}_data`] = {};
        service.volumes = [
          `${serviceName}_data:/var/lib/${this.getVolumeMount(
            config.techStack
          )}`,
        ];
      }
    });

    // Add dependencies based on edges
    this.addDependencies(compose);

    return this.formatYaml(compose);
  }

  private createDockerService(config: any): DockerService {
    const service: DockerService = {
      image: this.getDockerImage(config),
      ports: [`${config.port}:${config.port}`],
      environment: { ...config.environment },
      networks: ["microservices"],
    };

    // Add resource limits
    if (config.cpu || config.memory) {
      service.deploy = {
        replicas: config.replicas,
        resources: {
          limits: {
            cpus: config.cpu.toString(),
            memory: `${config.memory}M`,
          },
        },
      };
    }

    // Add health check
    if (config.healthCheckPath) {
      service.healthcheck = {
        test: [
          `CMD`,
          `curl`,
          `-f`,
          `http://localhost:${config.port}${config.healthCheckPath}`,
        ],
        interval: "30s",
        timeout: "10s",
        retries: 3,
      };
    }

    // Database specific configurations
    if (config.type === "database") {
      this.addDatabaseConfig(service, config);
    }

    return service;
  }

  private getDockerImage(config: any): string {
    const imageMap: Record<string, string> = {
      express: "node:18-alpine",
      "spring-boot": "openjdk:17-jre-slim",
      fastapi: "python:3.11-slim",
      "next.js": "node:18-alpine",
      postgresql: "postgres:15-alpine",
      mongodb: "mongo:6",
      redis: "redis:7-alpine",
      nginx: "nginx:alpine",
      kafka: "confluentinc/cp-kafka:latest",
    };

    return imageMap[config.techStack] || "alpine:latest";
  }

  private addDatabaseConfig(service: DockerService, config: any): void {
    switch (config.techStack) {
      case "postgresql":
        service.environment = {
          ...service.environment,
          POSTGRES_DB: config.environment.POSTGRES_DB || "app_db",
          POSTGRES_USER: config.environment.POSTGRES_USER || "app_user",
          POSTGRES_PASSWORD:
            config.environment.POSTGRES_PASSWORD || "secure_password",
        };
        break;
      case "mongodb":
        service.environment = {
          ...service.environment,
          MONGO_INITDB_ROOT_USERNAME:
            config.environment.MONGO_INITDB_ROOT_USERNAME || "admin",
          MONGO_INITDB_ROOT_PASSWORD:
            config.environment.MONGO_INITDB_ROOT_PASSWORD || "password",
        };
        break;
      case "redis":
        service.command = config.environment.REDIS_PASSWORD
          ? `redis-server --requirepass ${config.environment.REDIS_PASSWORD}`
          : undefined;
        break;
    }
  }

  private getVolumeMount(techStack: string): string {
    const mountMap: Record<string, string> = {
      postgresql: "postgresql/data",
      mongodb: "mongodb",
      redis: "redis",
    };
    return mountMap[techStack] || "data";
  }

  private addDependencies(compose: DockerComposeFile): void {
    this.edges.forEach((edge) => {
      const sourceNode = this.nodes.find((n) => n.id === edge.source);
      const targetNode = this.nodes.find((n) => n.id === edge.target);

      if (sourceNode && targetNode) {
        const sourceName = this.sanitizeServiceName(
          (sourceNode.data as any)?.config?.name
        );
        const targetName = this.sanitizeServiceName(
          (targetNode.data as any)?.config?.name
        );

        if (!compose.services[sourceName].depends_on) {
          compose.services[sourceName].depends_on = [];
        }

        if (!compose.services[sourceName].depends_on!.includes(targetName)) {
          compose.services[sourceName].depends_on!.push(targetName);
        }
      }
    });
  }

  private sanitizeServiceName(name: string): string {
    return name
      .toLowerCase()
      .replace(/[^a-z0-9-]/g, "-")
      .replace(/-+/g, "-");
  }

  private formatYaml(obj: any, indent = 0): string {
    let yaml = "";
    const spaces = "  ".repeat(indent);

    for (const [key, value] of Object.entries(obj)) {
      if (value === null || value === undefined) continue;

      if (Array.isArray(value)) {
        yaml += `${spaces}${key}:\n`;
        value.forEach((item: any) => {
          if (typeof item === "object") {
            yaml += `${spaces}  - ${this.formatYaml(
              item,
              indent + 1
            ).trim()}\n`;
          } else {
            yaml += `${spaces}  - ${item}\n`;
          }
        });
      } else if (typeof value === "object") {
        yaml += `${spaces}${key}:\n`;
        yaml += this.formatYaml(value, indent + 1);
      } else {
        yaml += `${spaces}${key}: ${value}\n`;
      }
    }

    return yaml;
  }
}
