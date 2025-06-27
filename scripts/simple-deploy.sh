#!/bin/bash
# Simplified deployment script for initial setup
# Skips backup for first-time deployment

set -e

# Colors for output
GREEN='\033[0;32m'
YELLOW='\033[1;33m'
RED='\033[0;31m'
NC='\033[0m' # No Color

log() {
    echo -e "${GREEN}[$(date +'%Y-%m-%d %H:%M:%S')] $1${NC}"
}

warn() {
    echo -e "${YELLOW}[$(date +'%Y-%m-%d %H:%M:%S')] WARNING: $1${NC}"
}

error() {
    echo -e "${RED}[$(date +'%Y-%m-%d %H:%M:%S')] ERROR: $1${NC}"
    exit 1
}

# Configuration
COMPOSE_FILE="docker-compose.prod.yml"
ENV_FILE=".env"

log "Starting simple deployment (no backup)..."

# Check requirements
if ! command -v docker &> /dev/null; then
    error "Docker is not installed"
fi

if ! command -v docker-compose &> /dev/null; then
    error "Docker Compose is not installed"
fi

if [ ! -f "$ENV_FILE" ]; then
    warn "Environment file $ENV_FILE not found. Using defaults."
    log "You should copy .env.example to .env and configure it for production."
fi

# Pull latest images
log "Pulling latest images..."
docker-compose -f "$COMPOSE_FILE" pull || warn "Some images could not be pulled"

# Build application image
log "Building application..."
docker-compose -f "$COMPOSE_FILE" build microplan

# Stop any existing services
log "Stopping existing services..."
docker-compose -f "$COMPOSE_FILE" down --remove-orphans || true

# Start services
log "Starting services..."
docker-compose -f "$COMPOSE_FILE" up -d

# Wait for services
log "Waiting for services to start..."
sleep 30

# Check status
log "Checking service status..."
docker-compose -f "$COMPOSE_FILE" ps

# Simple health check
log "Performing basic health check..."
if docker-compose -f "$COMPOSE_FILE" ps | grep -q "Up"; then
    log "✅ Services are running"
else
    warn "⚠️  Some services may not be running properly"
fi

# Show access information
log "🎉 Deployment completed!"
echo ""
echo "Access your application at:"
echo "  - Main app: http://localhost"
echo "  - Traefik dashboard: http://localhost:8080"
echo ""
echo "To check logs: docker-compose -f $COMPOSE_FILE logs -f"
echo "To stop: docker-compose -f $COMPOSE_FILE down"