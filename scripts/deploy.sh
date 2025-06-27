#!/bin/bash
# Production deployment script for Microservice Planner

set -e

# Colors for output
RED='\033[0;31m'
GREEN='\033[0;32m'
YELLOW='\033[1;33m'
NC='\033[0m' # No Color

# Configuration
COMPOSE_FILE="docker-compose.prod.yml"
ENV_FILE=".env"
BACKUP_DIR="./backups"

# Functions
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

check_requirements() {
    log "Checking requirements..."
    
    if ! command -v docker &> /dev/null; then
        error "Docker is not installed"
    fi
    
    if ! command -v docker-compose &> /dev/null; then
        error "Docker Compose is not installed"
    fi
    
    if [ ! -f "$ENV_FILE" ]; then
        error "Environment file $ENV_FILE not found. Copy .env.example to .env and configure it."
    fi
    
    log "Requirements check passed"
}

backup_data() {
    log "Creating backup..."
    
    mkdir -p "$BACKUP_DIR"
    TIMESTAMP=$(date +%Y%m%d_%H%M%S)
    
    # Backup database if running
    if docker-compose -f "$COMPOSE_FILE" ps postgres 2>/dev/null | grep -q "Up"; then
        log "Backing up database..."
        docker-compose -f "$COMPOSE_FILE" exec -T postgres pg_dump -U microplan microplan > "$BACKUP_DIR/db_backup_$TIMESTAMP.sql" 2>/dev/null || true
    else
        log "PostgreSQL service not running, skipping database backup"
    fi
    
    # Backup volumes (only if volumes exist)
    log "Checking for volumes to backup..."
    if docker volume ls | grep -q "microplan-postgres-prod"; then
        log "Backing up volumes..."
        # Use absolute path and escape Windows path conversion
        BACKUP_PATH="$(pwd)/$BACKUP_DIR"
        if [[ "$OSTYPE" == "msys" || "$OSTYPE" == "cygwin" ]]; then
            # Windows Git Bash - use winpty and fix path
            BACKUP_PATH="$(cygpath -w "$(pwd)/$BACKUP_DIR" | sed 's|\\|/|g')"
            docker run --rm -v microplan-postgres-prod:/data -v "$BACKUP_PATH":/backup alpine sh -c "cd /data && tar czf /backup/volumes_backup_$TIMESTAMP.tar.gz . 2>/dev/null || true"
        else
            # Linux/Mac
            docker run --rm -v microplan-postgres-prod:/data -v "$BACKUP_PATH":/backup alpine tar czf "/backup/volumes_backup_$TIMESTAMP.tar.gz" -C /data . 2>/dev/null || true
        fi
    else
        log "No volumes found to backup"
    fi
    
    log "Backup completed: $BACKUP_DIR"
}

deploy() {
    log "Starting deployment..."
    
    # Pull latest images
    log "Pulling latest images..."
    docker-compose -f "$COMPOSE_FILE" pull
    
    # Build application image
    log "Building application..."
    docker-compose -f "$COMPOSE_FILE" build --no-cache microplan
    
    # Start services
    log "Starting services..."
    docker-compose -f "$COMPOSE_FILE" up -d
    
    # Wait for services to be healthy
    log "Waiting for services to be healthy..."
    timeout 300 bash -c '
        until docker-compose -f "'"$COMPOSE_FILE"'" ps | grep -q "healthy"; do
            echo "Waiting for services..."
            sleep 10
        done
    '
    
    log "Deployment completed successfully"
}

rollback() {
    log "Rolling back to previous version..."
    
    # Stop current services
    docker-compose -f "$COMPOSE_FILE" down
    
    # Restore from latest backup
    LATEST_BACKUP=$(ls -t "$BACKUP_DIR"/db_backup_*.sql | head -n1)
    if [ -n "$LATEST_BACKUP" ]; then
        log "Restoring database from $LATEST_BACKUP"
        docker-compose -f "$COMPOSE_FILE" up -d postgres
        sleep 30
        docker-compose -f "$COMPOSE_FILE" exec -T postgres psql -U microplan microplan < "$LATEST_BACKUP"
    fi
    
    # Start services with previous image
    docker-compose -f "$COMPOSE_FILE" up -d
    
    log "Rollback completed"
}

health_check() {
    log "Performing health check..."
    
    # Check if all services are running
    if ! docker-compose -f "$COMPOSE_FILE" ps | grep -q "Up"; then
        error "Some services are not running"
    fi
    
    # Check application health endpoint
    if ! curl -f http://localhost:80/health > /dev/null 2>&1; then
        warn "Application health check failed"
        return 1
    fi
    
    log "Health check passed"
    return 0
}

show_status() {
    log "Service Status:"
    docker-compose -f "$COMPOSE_FILE" ps
    
    log "Service Logs (last 20 lines):"
    docker-compose -f "$COMPOSE_FILE" logs --tail=20
}

cleanup() {
    log "Cleaning up unused Docker resources..."
    docker system prune -f
    docker volume prune -f
    log "Cleanup completed"
}

# Main script
case "$1" in
    "deploy")
        check_requirements
        backup_data
        deploy
        health_check
        ;;
    "rollback")
        check_requirements
        rollback
        ;;
    "backup")
        check_requirements
        backup_data
        ;;
    "status")
        show_status
        ;;
    "health")
        health_check
        ;;
    "cleanup")
        cleanup
        ;;
    "logs")
        docker-compose -f "$COMPOSE_FILE" logs -f "${@:2}"
        ;;
    *)
        echo "Usage: $0 {deploy|rollback|backup|status|health|cleanup|logs}"
        echo ""
        echo "Commands:"
        echo "  deploy   - Deploy the application (with backup)"
        echo "  rollback - Rollback to previous version"
        echo "  backup   - Create backup only"
        echo "  status   - Show service status"
        echo "  health   - Check application health"
        echo "  cleanup  - Clean unused Docker resources"
        echo "  logs     - Show service logs"
        exit 1
        ;;
esac