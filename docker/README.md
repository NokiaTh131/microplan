# Docker Deployment Guide

This directory contains Docker configurations for the Microservice Planner application.

## Quick Start

### Development Environment

```bash
# Start development environment
docker-compose up -d

# View logs
docker-compose logs -f

# Stop environment
docker-compose down
```

### Production Environment

```bash
# Copy and configure environment variables
cp .env.example .env
# Edit .env with your production values

# Start production environment
docker-compose -f docker-compose.prod.yml up -d

# View logs
docker-compose -f docker-compose.prod.yml logs -f

# Stop environment
docker-compose -f docker-compose.prod.yml down
```

## Services

### Development (`docker-compose.yml`)

- **microplan-dev**: React development server with hot reload
- **nginx-dev**: Reverse proxy for development
- **postgres**: PostgreSQL database for development
- **redis**: Redis cache for development

**Ports:**
- 3000: Direct access to React dev server
- 8080: Nginx reverse proxy
- 5432: PostgreSQL
- 6379: Redis

### Production (`docker-compose.prod.yml`)

- **microplan**: Production React app served by Nginx
- **traefik**: Load balancer and reverse proxy with SSL
- **postgres**: PostgreSQL database
- **redis**: Redis cache with authentication
- **prometheus**: Metrics collection
- **grafana**: Monitoring dashboards

**Ports:**
- 80: HTTP (redirects to HTTPS in production)
- 443: HTTPS
- 8080: Traefik dashboard

## Configuration

### Environment Variables

Copy `.env.example` to `.env` and configure:

```bash
# Required for production
POSTGRES_PASSWORD=your_secure_password
REDIS_PASSWORD=your_redis_password
JWT_SECRET=your_jwt_secret
GRAFANA_PASSWORD=your_grafana_password
```

### SSL Certificates

Production uses Let's Encrypt for SSL certificates. Configure your domain in the Traefik labels.

### Database Initialization

The PostgreSQL container automatically runs scripts from `docker/postgres-init/` on first startup.

## Monitoring

Access monitoring services:

- **Grafana**: http://grafana.localhost (admin/password from env)
- **Prometheus**: http://prometheus.localhost
- **Traefik Dashboard**: http://traefik.localhost

## Health Checks

All services include health checks:

```bash
# Check service health
docker-compose ps

# View health check logs
docker inspect --format='{{json .State.Health}}' microplan-app
```

## Backup and Recovery

### Database Backup

```bash
# Create backup
docker-compose exec postgres pg_dump -U microplan microplan > backup.sql

# Restore backup
docker-compose exec -T postgres psql -U microplan microplan < backup.sql
```

### Volume Backup

```bash
# Backup all volumes
docker run --rm -v microplan-postgres-prod:/data -v $(pwd):/backup alpine tar czf /backup/postgres-backup.tar.gz -C /data .
```

## Security

### Production Security Checklist

- [ ] Change all default passwords
- [ ] Configure SSL certificates
- [ ] Set up firewall rules
- [ ] Enable audit logging
- [ ] Configure security headers
- [ ] Set up intrusion detection
- [ ] Regular security updates

### Container Security

- All containers run as non-root users
- Read-only filesystems where possible
- No unnecessary privileges
- Security scanning with Trivy

## Troubleshooting

### Common Issues

1. **Port conflicts**: Change ports in docker-compose.yml
2. **Permission errors**: Check volume permissions
3. **Memory issues**: Increase Docker memory limits
4. **SSL issues**: Check certificate configuration

### Debug Commands

```bash
# View container logs
docker-compose logs [service-name]

# Execute commands in container
docker-compose exec [service-name] /bin/sh

# Check resource usage
docker stats

# Inspect container configuration
docker inspect [container-name]
```

## Scaling

### Horizontal Scaling

```bash
# Scale specific services
docker-compose -f docker-compose.prod.yml up -d --scale microplan=3

# Auto-scaling with Docker Swarm
docker stack deploy -c docker-compose.prod.yml microplan-stack
```

### Resource Limits

Configure in docker-compose.yml:

```yaml
services:
  microplan:
    deploy:
      resources:
        limits:
          cpus: '2'
          memory: 1G
        reservations:
          cpus: '0.5'
          memory: 512M
```

## CI/CD Integration

### GitHub Actions Example

```yaml
- name: Deploy to production
  run: |
    docker-compose -f docker-compose.prod.yml pull
    docker-compose -f docker-compose.prod.yml up -d
```

### Health Check Validation

```bash
# Wait for services to be healthy
timeout 300 bash -c 'until docker-compose ps | grep -q "healthy"; do sleep 10; done'
```