# PowerShell deployment script for Microservice Planner (Windows)
param(
    [Parameter(Mandatory=$true)]
    [ValidateSet("deploy", "rollback", "backup", "status", "health", "cleanup", "logs")]
    [string]$Action,
    
    [string]$Service = ""
)

# Configuration
$ComposeFile = "docker-compose.prod.yml"
$EnvFile = ".env"
$BackupDir = "./backups"

# Colors for output
function Write-Log {
    param([string]$Message)
    Write-Host "[$(Get-Date -Format 'yyyy-MM-dd HH:mm:ss')] $Message" -ForegroundColor Green
}

function Write-Warning {
    param([string]$Message)
    Write-Host "[$(Get-Date -Format 'yyyy-MM-dd HH:mm:ss')] WARNING: $Message" -ForegroundColor Yellow
}

function Write-Error {
    param([string]$Message)
    Write-Host "[$(Get-Date -Format 'yyyy-MM-dd HH:mm:ss')] ERROR: $Message" -ForegroundColor Red
    exit 1
}

function Test-Requirements {
    Write-Log "Checking requirements..."
    
    if (!(Get-Command docker -ErrorAction SilentlyContinue)) {
        Write-Error "Docker is not installed or not in PATH"
    }
    
    if (!(Get-Command docker-compose -ErrorAction SilentlyContinue)) {
        Write-Error "Docker Compose is not installed or not in PATH"
    }
    
    if (!(Test-Path $EnvFile)) {
        Write-Error "Environment file $EnvFile not found. Copy .env.example to .env and configure it."
    }
    
    Write-Log "Requirements check passed"
}

function Backup-Data {
    Write-Log "Creating backup..."
    
    if (!(Test-Path $BackupDir)) {
        New-Item -ItemType Directory -Path $BackupDir -Force | Out-Null
    }
    
    $Timestamp = Get-Date -Format "yyyyMMdd_HHmmss"
    
    # Backup database if running
    $PostgresStatus = docker-compose -f $ComposeFile ps postgres 2>$null
    if ($PostgresStatus -match "Up") {
        Write-Log "Backing up database..."
        try {
            docker-compose -f $ComposeFile exec -T postgres pg_dump -U microplan microplan > "$BackupDir/db_backup_$Timestamp.sql"
        } catch {
            Write-Warning "Database backup failed: $_"
        }
    } else {
        Write-Log "PostgreSQL service not running, skipping database backup"
    }
    
    # Backup volumes
    Write-Log "Checking for volumes to backup..."
    $VolumeExists = docker volume ls | Select-String "microplan-postgres-prod"
    if ($VolumeExists) {
        Write-Log "Backing up volumes..."
        try {
            $BackupPath = (Resolve-Path $BackupDir).Path
            docker run --rm -v microplan-postgres-prod:/data -v "${BackupPath}:/backup" alpine tar czf "/backup/volumes_backup_$Timestamp.tar.gz" -C /data .
        } catch {
            Write-Warning "Volume backup failed: $_"
        }
    } else {
        Write-Log "No volumes found to backup"
    }
    
    Write-Log "Backup completed: $BackupDir"
}

function Deploy-Application {
    Write-Log "Starting deployment..."
    
    # Pull latest images
    Write-Log "Pulling latest images..."
    docker-compose -f $ComposeFile pull
    
    # Build application image
    Write-Log "Building application..."
    docker-compose -f $ComposeFile build --no-cache microplan
    
    # Start services
    Write-Log "Starting services..."
    docker-compose -f $ComposeFile up -d
    
    # Wait for services to be healthy
    Write-Log "Waiting for services to be healthy..."
    $timeout = 300
    $elapsed = 0
    do {
        Start-Sleep 10
        $elapsed += 10
        $status = docker-compose -f $ComposeFile ps
        Write-Host "Waiting for services... ($elapsed/$timeout seconds)"
    } while ($elapsed -lt $timeout -and !($status -match "healthy"))
    
    if ($elapsed -ge $timeout) {
        Write-Warning "Timeout waiting for services to be healthy"
    } else {
        Write-Log "Deployment completed successfully"
    }
}

function Rollback-Application {
    Write-Log "Rolling back to previous version..."
    
    # Stop current services
    docker-compose -f $ComposeFile down
    
    # Restore from latest backup
    $LatestBackup = Get-ChildItem "$BackupDir/db_backup_*.sql" | Sort-Object LastWriteTime -Descending | Select-Object -First 1
    if ($LatestBackup) {
        Write-Log "Restoring database from $($LatestBackup.Name)"
        docker-compose -f $ComposeFile up -d postgres
        Start-Sleep 30
        Get-Content $LatestBackup.FullName | docker-compose -f $ComposeFile exec -T postgres psql -U microplan microplan
    }
    
    # Start services with previous image
    docker-compose -f $ComposeFile up -d
    
    Write-Log "Rollback completed"
}

function Test-Health {
    Write-Log "Performing health check..."
    
    # Check if all services are running
    $RunningServices = docker-compose -f $ComposeFile ps | Select-String "Up"
    if (!$RunningServices) {
        Write-Error "Some services are not running"
    }
    
    # Check application health endpoint
    try {
        $response = Invoke-WebRequest -Uri "http://localhost:80/health" -UseBasicParsing -TimeoutSec 10
        if ($response.StatusCode -eq 200) {
            Write-Log "Health check passed"
            return $true
        }
    } catch {
        Write-Warning "Application health check failed: $_"
        return $false
    }
}

function Show-Status {
    Write-Log "Service Status:"
    docker-compose -f $ComposeFile ps
    
    Write-Log "Service Logs (last 20 lines):"
    docker-compose -f $ComposeFile logs --tail=20
}

function Clear-Resources {
    Write-Log "Cleaning up unused Docker resources..."
    docker system prune -f
    docker volume prune -f
    Write-Log "Cleanup completed"
}

function Show-Logs {
    if ($Service) {
        docker-compose -f $ComposeFile logs -f $Service
    } else {
        docker-compose -f $ComposeFile logs -f
    }
}

# Main script execution
switch ($Action) {
    "deploy" {
        Test-Requirements
        Backup-Data
        Deploy-Application
        Test-Health
    }
    "rollback" {
        Test-Requirements
        Rollback-Application
    }
    "backup" {
        Test-Requirements
        Backup-Data
    }
    "status" {
        Show-Status
    }
    "health" {
        Test-Health
    }
    "cleanup" {
        Clear-Resources
    }
    "logs" {
        Show-Logs
    }
}

Write-Log "Script completed"