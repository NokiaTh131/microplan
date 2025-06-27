# CLAUDE.md

This file provides guidance to Claude Code (claude.ai/code) when working with code in this repository.

## Project Overview

This is a React + TypeScript + Vite application called "microplan" that appears to be designed as a microservice planning tool. The project uses modern web development technologies with:

- **React 19** with TypeScript for the frontend
- **Vite** as the build tool and dev server
- **SWC** for fast refresh instead of Babel
- **Tailwind CSS v4** for styling
- **ESLint** with TypeScript integration for code quality

## Development Commands

```bash
# Start development server with hot reload
npm run dev

# Build for production (includes TypeScript compilation)
npm run build

# Run linter
npm run lint

# Preview production build
npm run preview
```

## Architecture

The application follows a standard React/Vite project structure:

- **src/main.tsx** - Application entry point with React.StrictMode
- **src/App.tsx** - Main application component (currently contains default Vite template)
- **src/index.css** - Global styles
- **src/App.css** - Component-specific styles
- **public/** - Static assets served directly
- **dist/** - Production build output (ignored by ESLint)

## TypeScript Configuration

The project uses a project references setup with:

- **tsconfig.json** - Root configuration with references to app and node configs
- **tsconfig.app.json** - Application-specific TypeScript settings
- **tsconfig.node.json** - Node.js/Vite tooling TypeScript settings

## ESLint Configuration

Uses modern ESLint flat config format (eslint.config.js) with:

- TypeScript ESLint integration
- React Hooks rules
- React Refresh rules for Vite HMR
- Browser globals configured

## Build Process

The build process runs TypeScript compilation first (`tsc -b`) followed by Vite bundling, ensuring type safety before bundling.

# Microservices Architecture Planner

## Project Overview

Build a visual microservices architecture design tool using React Flow that helps software engineers plan, analyze, and generate infrastructure code for distributed systems.

## What You'll Build

A comprehensive tool that allows users to:

- Visually design microservices architectures by dragging and dropping services
- Configure service properties, technology stacks, and resource requirements
- Analyze architecture for dependencies, bottlenecks, and performance issues
- Generate real infrastructure code (Docker Compose, Kubernetes YAML)
- Simulate service failures and test system resilience

## Key Features

### 1. Visual Architecture Designer

- **Service Nodes**: Different types (API Gateway, Auth, Payment, Notification services)
- **Database Nodes**: Multiple database types (PostgreSQL, MongoDB, Redis)
- **External Services**: Third-party APIs, message queues, CDNs
- **Smart Connections**: Different edge types for sync/async communication

### 2. Service Configuration

- Technology stack selection (Express, Spring Boot, FastAPI)
- Resource requirements (CPU, memory, scaling settings)
- Health check configurations
- Port and endpoint management

### 3. Architecture Analysis

- Dependency cycle detection
- Performance bottleneck identification
- Resource requirement calculations
- Single point of failure detection

### 4. Code Generation

- Docker Compose files with all services
- Kubernetes deployment manifests
- API Gateway configurations (Nginx/Traefik)
- Monitoring setup (Prometheus/Grafana)

### 5. System Simulation

- Service failure simulation
- Load testing visualization
- Deployment strategy simulation

## Technical Stack

### Frontend

- **React 18** with TypeScript for type safety
- **React Flow 11.x** for the visual canvas and node management
- **Tailwind CSS** for responsive styling
- **Zustand** for lightweight state management
- **React Hook Form** for configuration forms
- **Lucide React** for consistent iconography

### Development Tools

- **Vite** for fast development and building
- **ESLint + Prettier** for code quality
- **React Testing Library + Vitest** for testing

## Project Structure

```
microservices-planner/
├── src/
│   ├── components/
│   │   ├── Canvas/
│   │   │   ├── MicroservicesCanvas.tsx          # Main React Flow canvas
│   │   │   ├── CustomNodes/
│   │   │   │   ├── ServiceNode.tsx              # Configurable service nodes
│   │   │   │   ├── DatabaseNode.tsx             # Database nodes
│   │   │   │   ├── ExternalServiceNode.tsx      # External API nodes
│   │   │   │   └── InfrastructureNode.tsx       # Load balancers, caches
│   │   │   └── CustomEdges/
│   │   │       ├── SyncEdge.tsx                 # Synchronous communication
│   │   │       ├── AsyncEdge.tsx                # Async/message queue
│   │   │       └── DataFlowEdge.tsx             # Data pipeline edges
│   │   ├── Panels/
│   │   │   ├── NodeConfigPanel.tsx              # Service configuration UI
│   │   │   ├── ArchitectureAnalysis.tsx         # Analysis results display
│   │   │   ├── CodeGenerator.tsx                # Generated code viewer
│   │   │   └── SimulationPanel.tsx              # Failure simulation controls
│   │   ├── Toolbar/
│   │   │   ├── NodePalette.tsx                  # Drag-and-drop node palette
│   │   │   └── ToolbarActions.tsx               # Save, export, import actions
│   │   └── UI/
│   │       ├── Modal.tsx                        # Reusable modal component
│   │       ├── Tabs.tsx                         # Tab navigation
│   │       └── CodeBlock.tsx                    # Syntax-highlighted code
│   ├── hooks/
│   │   ├── useArchitectureAnalysis.ts           # Architecture validation logic
│   │   ├── useCodeGeneration.ts                 # Infrastructure code generation
│   │   └── useSimulation.ts                     # Failure simulation logic
│   ├── stores/
│   │   ├── architectureStore.ts                 # Main application state
│   │   └── simulationStore.ts                   # Simulation state
│   ├── types/
│   │   ├── nodes.ts                             # Node type definitions
│   │   ├── edges.ts                             # Edge type definitions
│   │   └── architecture.ts                     # Architecture interfaces
│   ├── utils/
│   │   ├── architectureAnalyzer.ts              # Dependency analysis
│   │   ├── codeGenerators/
│   │   │   ├── dockerCompose.ts                 # Docker Compose generation
│   │   │   ├── kubernetes.ts                    # K8s YAML generation
│   │   │   └── nginx.ts                         # API Gateway configs
│   │   └── performanceCalculator.ts             # Performance estimation
│   └── data/
│       ├── serviceTemplates.ts                  # Predefined service types
│       ├── techStackOptions.ts                  # Available technologies
│       └── deploymentPatterns.ts                # Common patterns
├── public/
├── package.json
├── vite.config.ts
├── tailwind.config.js
└── tsconfig.json
```

## Implementation Guide

this project you will use react flow if you confuse please go check docs from this link https://reactflow.dev/learn, https://reactflow.dev/api-reference, https://reactflow.dev/examples, https://reactflow.dev/components

### Phase 1: Foundation (4-6 hours)

**Goal**: Set up the basic React Flow canvas with draggable service nodes

**Tasks**:

1. Initialize React + TypeScript + Vite project
2. Install and configure React Flow, Tailwind CSS, Zustand
3. Create basic `MicroservicesCanvas` component
4. Implement `ServiceNode` component with basic configuration
5. Add node palette for dragging services onto canvas
6. Set up Zustand store for managing nodes and edges
7. install react flow use npm install @xyflow/react

**Key Files to Create**:

- `src/components/Canvas/MicroservicesCanvas.tsx`
- `src/components/CustomNodes/ServiceNode.tsx`
- `src/components/Toolbar/NodePalette.tsx`
- `src/stores/architectureStore.ts`

### Phase 2: Node Types & Configuration (4-6 hours)

**Goal**: Add different node types and configuration panels

**Tasks**:

1. Create `DatabaseNode`, `ExternalServiceNode`, `InfrastructureNode` components
2. Implement `NodeConfigPanel` with forms for service properties
3. Add custom edge types for different communication patterns
4. Create service templates with predefined configurations
5. Add technology stack selection for each service

**Key Files to Create**:

- `src/components/CustomNodes/DatabaseNode.tsx`
- `src/components/CustomNodes/ExternalServiceNode.tsx`
- `src/components/Panels/NodeConfigPanel.tsx`
- `src/components/CustomEdges/SyncEdge.tsx`
- `src/data/serviceTemplates.ts`

### Phase 3: Analysis & Code Generation (4-6 hours)

**Goal**: Implement architecture analysis and code generation features

**Tasks**:

1. Build dependency analysis algorithm to detect cycles
2. Implement performance estimation based on service chains
3. Create Docker Compose generator from architecture
4. Add Kubernetes YAML generation
5. Build analysis results display component

**Key Files to Create**:

- `src/utils/architectureAnalyzer.ts`
- `src/utils/codeGenerators/dockerCompose.ts`
- `src/utils/codeGenerators/kubernetes.ts`
- `src/components/Panels/ArchitectureAnalysis.tsx`
- `src/hooks/useArchitectureAnalysis.ts`

### Phase 4: Simulation & Polish (3-4 hours)

**Goal**: Add simulation features and polish the user experience

**Tasks**:

1. Implement service failure simulation
2. Add export/import functionality for architectures
3. Create code syntax highlighting for generated files
4. Add animations and improved styling
5. Implement architecture validation rules

**Key Files to Create**:

- `src/components/Panels/SimulationPanel.tsx`
- `src/hooks/useSimulation.ts`
- `src/components/UI/CodeBlock.tsx`
- `src/utils/validators.ts`

## Learning Objectives

### Technical Skills

- **React Flow Mastery**: Learn to create custom nodes, edges, and interactions
- **TypeScript Proficiency**: Work with complex type definitions and interfaces
- **State Management**: Use Zustand for managing complex application state
- **Code Generation**: Build template systems for infrastructure as code

### System Design Concepts

- **Microservices Architecture**: Understand service decomposition and communication patterns
- **Infrastructure as Code**: Generate real Docker and Kubernetes configurations
- **Performance Analysis**: Learn to identify bottlenecks in distributed systems
- **Resilience Planning**: Understand failure modes and recovery strategies

### Software Engineering Practices

- **Component Architecture**: Build reusable, composable React components
- **Separation of Concerns**: Organize code into logical modules and utilities
- **Testing Strategy**: Write unit tests for complex business logic
- **Code Quality**: Use ESLint, Prettier, and TypeScript for maintainable code

## Sample Architectures to Build

### E-commerce Platform

- API Gateway → Auth Service → Product Catalog → Payment Processing
- Product Service → PostgreSQL Database
- User Service → Redis Cache
- Order Service → Message Queue → Inventory Service
- All services monitored with Prometheus/Grafana

### Social Media Application

- Load Balancer → Multiple API Gateway instances
- User Service → MongoDB for profiles
- Media Service → S3 for file storage
- Notification Service → WebSocket connections
- Feed Service → Redis for caching

## Success Metrics

By completion, you should be able to:

- Design a complete microservices architecture visually
- Generate working Docker Compose files that can be deployed
- Identify potential issues in service dependencies
- Understand the trade-offs in different architectural decisions
- Export Kubernetes manifests for production deployment

## Extensions & Next Steps

- Add cost estimation based on cloud provider pricing
- Implement API contract validation between services
- Add security analysis (authentication, authorization flows)
- Create architecture comparison tools
- Build integration with actual deployment pipelines

This project bridges the gap between theoretical system design knowledge and practical implementation skills, providing a valuable tool for planning real-world distributed systems.
