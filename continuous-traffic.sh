#!/bin/bash

# Continuous traffic generation for real-time monitoring
echo "🔄 Starting continuous traffic generation..."
echo "Press Ctrl+C to stop"

# Counter for requests
counter=1

# Function to log with timestamp
log_request() {
    echo "[$(date +'%H:%M:%S')] Request #$counter: $1"
    ((counter++))
}

# Continuous loop
while true; do
    # Main application requests (80% success)
    if [ $((RANDOM % 10)) -lt 8 ]; then
        curl -s http://localhost:8080 > /dev/null
        log_request "Main App (200)"
    else
        curl -s http://localhost:8080/notfound > /dev/null
        log_request "Main App (404)"
    fi
    
    sleep 1
    
    # Traefik dashboard requests
    curl -s http://localhost:8081/dashboard/ > /dev/null
    log_request "Traefik Dashboard"
    
    sleep 1
    
    # Metrics endpoint
    curl -s http://localhost:8081/metrics > /dev/null
    log_request "Metrics Endpoint"
    
    sleep 2
    
    # Load balancer requests
    curl -s http://localhost:80 > /dev/null 2>&1
    log_request "Load Balancer"
    
    sleep 2
done