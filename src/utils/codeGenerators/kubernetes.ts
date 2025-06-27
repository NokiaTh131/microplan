 
import { Node } from "@xyflow/react";

interface KubernetesResource {
  apiVersion: string;
  kind: string;
  metadata: {
    name: string;
    labels?: Record<string, string>;
    annotations?: Record<string, string>;
  };
  spec?: any;
  data?: any;
}

export class KubernetesGenerator {
  private nodes: Node[];

  constructor(nodes: Node[]) {
    this.nodes = nodes;
  }

  public generate(): string {
    const resources: KubernetesResource[] = [];

    this.nodes.forEach((node) => {
      const config = (node.data as any)?.config;
      if (!config) return;

      const serviceName = this.sanitizeServiceName(config.name);

      // Create Deployment
      resources.push(this.createDeployment(config, serviceName));

      // Create Service
      resources.push(this.createService(config, serviceName));

      // Create ConfigMap for environment variables
      if (Object.keys(config.environment || {}).length > 0) {
        resources.push(this.createConfigMap(config, serviceName));
      }

      // Create PersistentVolumeClaim for databases
      if (config.type === "database") {
        resources.push(this.createPVC(serviceName));
      }
    });

    // Add Ingress for API Gateway
    const gatewayNode = this.nodes.find(
      (node) =>
        (node.data as any)?.config?.type === "infrastructure" &&
        (node.data as any)?.config?.name?.toLowerCase().includes("gateway")
    );

    if (gatewayNode) {
      resources.push(this.createIngress());
    }

    return resources.map((resource) => this.toYaml(resource)).join("\n---\n");
  }

  private createDeployment(
    config: any,
    serviceName: string
  ): KubernetesResource {
    return {
      apiVersion: "apps/v1",
      kind: "Deployment",
      metadata: {
        name: serviceName,
        labels: {
          app: serviceName,
          type: config.type,
        },
      },
      spec: {
        replicas: config.replicas,
        selector: {
          matchLabels: {
            app: serviceName,
          },
        },
        template: {
          metadata: {
            labels: {
              app: serviceName,
              type: config.type,
            },
          },
          spec: {
            containers: [
              {
                name: serviceName,
                image: this.getDockerImage(config),
                ports: [
                  {
                    containerPort: config.port,
                    name: "http",
                  },
                ],
                env: this.createEnvVars(config, serviceName),
                resources: {
                  requests: {
                    cpu: `${config.cpu * 0.5}`,
                    memory: `${config.memory * 0.7}Mi`,
                  },
                  limits: {
                    cpu: `${config.cpu}`,
                    memory: `${config.memory}Mi`,
                  },
                },
                ...(config.healthCheckPath && {
                  livenessProbe: {
                    httpGet: {
                      path: config.healthCheckPath,
                      port: config.port,
                    },
                    initialDelaySeconds: 30,
                    periodSeconds: 10,
                  },
                  readinessProbe: {
                    httpGet: {
                      path: config.healthCheckPath,
                      port: config.port,
                    },
                    initialDelaySeconds: 5,
                    periodSeconds: 5,
                  },
                }),
                ...(config.type === "database" && {
                  volumeMounts: [
                    {
                      name: "data",
                      mountPath: this.getVolumeMountPath(config.techStack),
                    },
                  ],
                }),
              },
            ],
            ...(config.type === "database" && {
              volumes: [
                {
                  name: "data",
                  persistentVolumeClaim: {
                    claimName: `${serviceName}-pvc`,
                  },
                },
              ],
            }),
          },
        },
      },
    };
  }

  private createService(config: any, serviceName: string): KubernetesResource {
    return {
      apiVersion: "v1",
      kind: "Service",
      metadata: {
        name: serviceName,
        labels: {
          app: serviceName,
        },
      },
      spec: {
        selector: {
          app: serviceName,
        },
        ports: [
          {
            port: config.port,
            targetPort: config.port,
            name: "http",
          },
        ],
        type: config.type === "infrastructure" ? "LoadBalancer" : "ClusterIP",
      },
    };
  }

  private createConfigMap(
    config: any,
    serviceName: string
  ): KubernetesResource {
    return {
      apiVersion: "v1",
      kind: "ConfigMap",
      metadata: {
        name: `${serviceName}-config`,
        labels: {
          app: serviceName,
        },
      },
      data: config.environment,
    };
  }

  private createPVC(serviceName: string): KubernetesResource {
    return {
      apiVersion: "v1",
      kind: "PersistentVolumeClaim",
      metadata: {
        name: `${serviceName}-pvc`,
        labels: {
          app: serviceName,
        },
      },
      spec: {
        accessModes: ["ReadWriteOnce"],
        resources: {
          requests: {
            storage: "10Gi",
          },
        },
      },
    };
  }

  private createIngress(): KubernetesResource {
    return {
      apiVersion: "networking.k8s.io/v1",
      kind: "Ingress",
      metadata: {
        name: "microservices-ingress",
        annotations: {
          "kubernetes.io/ingress.class": "nginx",
          "nginx.ingress.kubernetes.io/rewrite-target": "/$1",
        },
      },
      spec: {
        rules: [
          {
            host: "microservices.local",
            http: {
              paths: [
                {
                  path: "/(.*)",
                  pathType: "Prefix",
                  backend: {
                    service: {
                      name: "api-gateway",
                      port: {
                        number: 80,
                      },
                    },
                  },
                },
              ],
            },
          },
        ],
      },
    };
  }

  private createEnvVars(config: any, serviceName: string): any[] {
    const envVars: any[] = [];

    // Add environment variables from ConfigMap
    if (Object.keys(config.environment || {}).length > 0) {
      envVars.push({
        name: "CONFIG_MAP_REF",
        valueFrom: {
          configMapKeyRef: {
            name: `${serviceName}-config`,
            key: "config",
          },
        },
      });

      // Add individual environment variables
      Object.entries(config.environment || {}).forEach(([key, value]) => {
        envVars.push({
          name: key,
          value: value,
        });
      });
    }

    return envVars;
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

  private getVolumeMountPath(techStack: string): string {
    const pathMap: Record<string, string> = {
      postgresql: "/var/lib/postgresql/data",
      mongodb: "/data/db",
      redis: "/data",
    };
    return pathMap[techStack] || "/data";
  }

  private sanitizeServiceName(name: string): string {
    return name
      .toLowerCase()
      .replace(/[^a-z0-9-]/g, "-")
      .replace(/-+/g, "-");
  }

  private toYaml(obj: any, indent = 0): string {
    let yaml = "";
    const spaces = "  ".repeat(indent);

    for (const [key, value] of Object.entries(obj)) {
      if (value === null || value === undefined) continue;

      if (Array.isArray(value)) {
        yaml += `${spaces}${key}:\n`;
        value.forEach((item: any) => {
          if (typeof item === "object") {
            yaml += `${spaces}- `;
            yaml += this.toYaml(item, indent + 1).replace(/^\s*/, "");
          } else {
            yaml += `${spaces}- ${item}\n`;
          }
        });
      } else if (typeof value === "object") {
        yaml += `${spaces}${key}:\n`;
        yaml += this.toYaml(value, indent + 1);
      } else {
        yaml += `${spaces}${key}: ${value}\n`;
      }
    }

    return yaml;
  }
}
