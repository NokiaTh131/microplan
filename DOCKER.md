# Docker Deployment Guide for Microservice Planner

This guide covers containerized deployment of the Microservice Planner application using Docker and Docker Compose.

## 🚀 Quick Start

### Prerequisites

- Docker 24.0+ 
- Docker Compose 2.20+
- 4GB+ RAM available
- 10GB+ disk space

### Development Setup

```bash
# Clone and setup
git clone <repository>
cd microplan

# Start development environment
docker-compose up -d

# Access the application
open http://localhost:8080
```

### Production Setup

```bash
# Configure environment
cp .env.example .env
# Edit .env with production values

# Deploy production stack
# Option 1: Full deployment (Linux/Mac)
./scripts/deploy.sh deploy

# Option 2: Simple deployment (cross-platform)
./scripts/simple-deploy.sh

# Option 3: Windows PowerShell
scripts/deploy.ps1 deploy
# or
scripts/deploy.bat deploy

# Option 4: Manual deployment
docker-compose -f docker-compose.prod.yml up -d

# Access the application
open http://localhost (or your domain)
```

### Windows Users

If you encounter path issues with Git Bash, use one of these alternatives:

1. **PowerShell** (Recommended):
   ```powershell
   .\scripts\deploy.ps1 deploy
   ```

2. **Command Prompt**:
   ```cmd
   scripts\deploy.bat deploy
   ```

3. **Simple deployment** (no backup):
   ```bash
   ./scripts/simple-deploy.sh
   ```

## 📁 File Structure

```
microplan/
├── Dockerfile                     # Production container
├── Dockerfile.dev                 # Development container
├── docker-compose.yml             # Development stack
├── docker-compose.prod.yml        # Production stack
├── .dockerignore                  # Docker ignore patterns
├── docker/                        # Docker configurations
│   ├── nginx.conf                 # Production nginx config
│   ├── default.conf               # Nginx server config
│   ├── nginx-dev.conf             # Development nginx config
│   ├── prometheus.yml             # Metrics configuration
│   ├── postgres-init/             # Database initialization
│   └── grafana/                   # Monitoring dashboards
├── scripts/
│   └── deploy.sh                  # Deployment automation
└── .env.example                   # Environment template
```

## 🔧 Configuration

### Environment Variables

| Variable | Description | Default | Required |
|----------|-------------|---------|----------|
| `NODE_ENV` | Environment mode | `production` | Yes |
| `POSTGRES_PASSWORD` | Database password | - | Yes |
| `REDIS_PASSWORD` | Redis password | - | Yes |
| `JWT_SECRET` | JWT signing key | - | Yes |
| `GRAFANA_PASSWORD` | Grafana admin password | - | Yes |

### Complete Environment Setup

```bash
# Copy template
cp .env.example .env

# Edit with secure values
nano .env
```

## 🛠 Services

### Development Stack

| Service | Port | Description |
|---------|------|-------------|
| microplan-dev | 3000 | React dev server |
| nginx-dev | 8080 | Reverse proxy |
| postgres | 5432 | Database |
| redis | 6379 | Cache |

### Production Stack

| Service | Port | Description |
|---------|------|-------------|
| microplan | - | React app (internal) |
| traefik | 80/443 | Load balancer + SSL |
| postgres | - | Database (internal) |
| redis | - | Cache (internal) |
| prometheus | - | Metrics (internal) |
| grafana | - | Dashboards (internal) |

## 🚀 Deployment

### Manual Deployment

```bash
# Development
docker-compose up -d

# Production
docker-compose -f docker-compose.prod.yml up -d
```

### Automated Deployment

```bash
# Full deployment with backup
./scripts/deploy.sh deploy

# Check status
./scripts/deploy.sh status

# View logs
./scripts/deploy.sh logs

# Rollback if needed
./scripts/deploy.sh rollback
```

## 📊 Monitoring

### Access Points

- **Application**: http://localhost (production) or http://localhost:8080 (dev)
- **Grafana**: http://grafana.localhost
- **Traefik Dashboard**: http://traefik.localhost
- **Prometheus**: Internal only

### Health Checks

```bash
# Check all services
docker-compose ps

# Application health
curl http://localhost/health

# Individual service health
docker inspect --format='{{json .State.Health}}' microplan-app
```

### Logs

```bash
# All services
docker-compose logs -f

# Specific service
docker-compose logs -f microplan

# Last 100 lines
docker-compose logs --tail=100
```

## 🔒 Security

### Production Security Features

- ✅ Non-root containers
- ✅ Read-only filesystems
- ✅ Security headers (CSRF, XSS, etc.)
- ✅ SSL/TLS termination
- ✅ Rate limiting
- ✅ Container isolation
- ✅ Secrets management

### Security Checklist

- [ ] Change all default passwords
- [ ] Configure SSL certificates
- [ ] Set up firewall rules
- [ ] Enable audit logging
- [ ] Regular security updates
- [ ] Vulnerability scanning

## 📦 Backup & Recovery

### Automated Backup

```bash
# Create backup
./scripts/deploy.sh backup

# Backups stored in ./backups/
ls -la backups/
```

### Manual Backup

```bash
# Database backup
docker-compose exec postgres pg_dump -U microplan microplan > backup.sql

# Volume backup
docker run --rm -v microplan-postgres-prod:/data -v $(pwd):/backup alpine \
  tar czf /backup/volumes.tar.gz -C /data .
```

### Recovery

```bash
# Restore database
docker-compose exec -T postgres psql -U microplan microplan < backup.sql

# Restore volumes
docker run --rm -v microplan-postgres-prod:/data -v $(pwd):/backup alpine \
  tar xzf /backup/volumes.tar.gz -C /data
```

## 🔧 Troubleshooting

### Common Issues

#### Port Conflicts
```bash
# Check port usage
netstat -tulpn | grep :80

# Change ports in docker-compose.yml
ports:
  - "8081:80"  # Changed from 80:80
```

#### Memory Issues
```bash
# Check Docker memory
docker system df

# Clean up
docker system prune -f
```

#### Permission Problems
```bash
# Fix volume permissions
sudo chown -R $USER:$USER ./data
```

#### SSL Issues
```bash
# Check certificate status
docker-compose logs traefik | grep acme

# Force certificate renewal
docker-compose restart traefik
```

### Debug Commands

```bash
# Service status
docker-compose ps

# Resource usage
docker stats

# Container shell access
docker-compose exec microplan /bin/sh

# Network inspection
docker network ls
docker network inspect microplan-network
```

## 📈 Performance

### Resource Requirements

#### Minimum (Development)
- CPU: 2 cores
- RAM: 2GB
- Disk: 5GB

#### Recommended (Production)
- CPU: 4 cores
- RAM: 8GB
- Disk: 20GB SSD

### Scaling

#### Horizontal Scaling
```bash
# Scale application instances
docker-compose -f docker-compose.prod.yml up -d --scale microplan=3

# With Docker Swarm
docker stack deploy -c docker-compose.prod.yml microplan-stack
```

#### Vertical Scaling
```yaml
# In docker-compose.yml
services:
  microplan:
    deploy:
      resources:
        limits:
          cpus: '2'
          memory: 2G
```

## 🔄 CI/CD Integration

### GitHub Actions

```yaml
name: Deploy Production
on:
  push:
    branches: [main]

jobs:
  deploy:
    runs-on: ubuntu-latest
    steps:
      - uses: actions/checkout@v3
      
      - name: Deploy to production
        run: |
          ./scripts/deploy.sh deploy
          
      - name: Health check
        run: |
          ./scripts/deploy.sh health
```

### GitLab CI

```yaml
deploy:
  stage: deploy
  script:
    - ./scripts/deploy.sh deploy
  only:
    - main
```

## 🆘 Support

### Getting Help

1. Check this documentation
2. Review container logs
3. Check GitHub issues
4. Contact support team

### Useful Commands

```bash
# Complete reset (⚠️ Data loss!)
docker-compose down -v
docker system prune -af

# Update images
docker-compose pull
docker-compose up -d

# Export configuration
docker-compose config > current-config.yml
```

---

**Note**: This deployment is production-ready with security best practices, monitoring, and automated backup/recovery. Customize the configuration based on your specific requirements.