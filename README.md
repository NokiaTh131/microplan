# React + TypeScript + Vite

This template provides a minimal setup to get React working in Vite with HMR and some ESLint rules.

Currently, two official plugins are available:

- [@vitejs/plugin-react](https://github.com/vitejs/vite-plugin-react/blob/main/packages/plugin-react) uses [Babel](https://babeljs.io/) for Fast Refresh
- [@vitejs/plugin-react-swc](https://github.com/vitejs/vite-plugin-react/blob/main/packages/plugin-react-swc) uses [SWC](https://swc.rs/) for Fast Refresh

## Expanding the ESLint configuration

If you are developing a production application, we recommend updating the configuration to enable type-aware lint rules:

```js
export default tseslint.config({
  extends: [
    // Remove ...tseslint.configs.recommended and replace with this
    ...tseslint.configs.recommendedTypeChecked,
    // Alternatively, use this for stricter rules
    ...tseslint.configs.strictTypeChecked,
    // Optionally, add this for stylistic rules
    ...tseslint.configs.stylisticTypeChecked,
  ],
  languageOptions: {
    // other options...
    parserOptions: {
      project: ["./tsconfig.node.json", "./tsconfig.app.json"],
      tsconfigRootDir: import.meta.dirname,
    },
  },
});
```

You can also install [eslint-plugin-react-x](https://github.com/Rel1cx/eslint-react/tree/main/packages/plugins/eslint-plugin-react-x) and [eslint-plugin-react-dom](https://github.com/Rel1cx/eslint-react/tree/main/packages/plugins/eslint-plugin-react-dom) for React-specific lint rules:

```js
// eslint.config.js
import reactX from "eslint-plugin-react-x";
import reactDom from "eslint-plugin-react-dom";

export default tseslint.config({
  plugins: {
    // Add the react-x and react-dom plugins
    "react-x": reactX,
    "react-dom": reactDom,
  },
  rules: {
    // other rules...
    // Enable its recommended typescript rules
    ...reactX.configs["recommended-typescript"].rules,
    ...reactDom.configs.recommended.rules,
  },
});
```

🐳 Complete Docker Infrastructure

Core Files Created:

- Dockerfile - Multi-stage production build with security hardening
- Dockerfile.dev - Development container with hot reload
- .dockerignore - Optimized build context
- docker-compose.yml - Development stack
- docker-compose.prod.yml - Production stack with monitoring

Configuration Files:

- docker/nginx.conf - Production nginx with security headers
- docker/default.conf - Server configuration with rate limiting
- docker/nginx-dev.conf - Development proxy configuration
- docker/prometheus.yml - Metrics collection setup
- docker/postgres-init/01-init.sql - Database initialization

Environment Management:

- .env.example - Template with all configuration options
- .env.development - Development-specific settings
- .env.production - Production configuration template

Automation & Deployment:

- scripts/deploy.sh - Production deployment automation
- docker/README.md - Detailed deployment guide
- DOCKER.md - Comprehensive documentation

🚀 Key Features:

Security:

- Non-root containers with user isolation
- Read-only filesystems where possible
- Security headers (CSRF, XSS protection)
- Container secrets management
- SSL/TLS termination with Let's Encrypt

Production Stack:

- Traefik: Load balancer with automatic SSL
- Nginx: High-performance web server
- PostgreSQL: Database with proper initialization
- Redis: Caching with authentication
- Prometheus: Metrics collection
- Grafana: Monitoring dashboards

Development Stack:

- Hot reload for development
- Database and cache for local testing
- Reverse proxy setup
- Volume mounting for code changes

Monitoring & Observability:

- Health checks for all services
- Prometheus metrics collection
- Grafana dashboards
- Comprehensive logging
- Performance monitoring

Backup & Recovery:

- Automated backup scripts
- Database dump/restore
- Volume backup/restore
- Rollback capabilities

📋 Usage:

Development:

docker-compose up -d

# Access: http://localhost:8080

Production:

cp .env.example .env

# Configure environment variables

./scripts/deploy.sh deploy

# Access: http://localhost (with SSL)

Monitoring:

- Grafana: http://grafana.localhost
- Traefik Dashboard: http://traefik.localhost

This setup is enterprise-ready with security best practices, monitoring, automated deployment, and comprehensive documentation. It can handle both development and production
workloads with proper scaling and security measures.
