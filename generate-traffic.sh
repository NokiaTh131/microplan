#!/bin/bash

# Generate traffic to create metrics and traces
echo "🚀 Generating traffic for metrics and traces..."

# Function to make requests with delays
make_requests() {
    local url=$1
    local count=$2
    local delay=$3
    
    for i in $(seq 1 $count); do
        echo "Making request $i to $url"
        curl -s "$url" > /dev/null
        sleep $delay
    done
}

# Generate traffic to main application
echo "📱 Generating traffic to main application..."
make_requests "http://localhost:8080" 10 0.5 &

# Generate traffic to Traefik dashboard
echo "🔧 Generating traffic to Traefik dashboard..."
make_requests "http://localhost:8081/dashboard/" 5 1 &

# Generate traffic to Traefik metrics
echo "📊 Generating traffic to metrics endpoint..."
make_requests "http://localhost:8081/metrics" 5 1 &

# Generate some errors (404s)
echo "❌ Generating some 404 errors for testing..."
make_requests "http://localhost:8080/nonexistent" 3 2 &

# Generate traffic through load balancer (port 80)
echo "⚖️ Generating traffic through load balancer..."
make_requests "http://localhost:80" 5 1 &

# Wait for all background jobs to complete
wait

echo "✅ Traffic generation completed!"
echo "📈 Check Grafana at: http://localhost:3000"
echo "🔍 Check Jaeger at: http://localhost:16686"
echo "🔧 Check Traefik at: http://localhost:8081/dashboard/"