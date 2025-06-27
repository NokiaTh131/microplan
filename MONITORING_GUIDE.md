# 📊 Complete Monitoring Guide - Microservice Planner

## 🎯 Step 1: Access Grafana and View Traefik Dashboards

### 1.1 Login to Grafana
1. **Open your browser** and go to: http://localhost:3000
2. **Login credentials:**
   - Username: `admin`
   - Password: `admin123_change_in_production`

### 1.2 View Pre-configured Traefik Dashboard
1. After login, click on **"Dashboards"** in the left sidebar
2. Look for **"Traefik Monitoring Dashboard"** 
3. Click on it to view real-time metrics including:
   - **Request Rate per Entrypoint** - Shows traffic volume
   - **Total Request Rate** - Overall system load
   - **Request Duration Percentiles** - Performance metrics
   - **HTTP Status Code Distribution** - Success vs error rates
   - **Open Connections** - Active connections

### 1.3 Create Custom Dashboards
1. Click **"+"** → **"Dashboard"** → **"Add new panel"**
2. **Useful Prometheus queries for Traefik:**
   ```promql
   # Request rate by service
   rate(traefik_service_requests_total[5m])
   
   # Average response time
   rate(traefik_service_request_duration_seconds_sum[5m]) / rate(traefik_service_request_duration_seconds_count[5m])
   
   # Error rate percentage
   rate(traefik_service_requests_total{code=~"4..|5.."}[5m]) / rate(traefik_service_requests_total[5m]) * 100
   
   # Active services
   traefik_service_server_up
   ```

---

## 🔍 Step 2: Use Jaeger for Request Tracing

### 2.1 Access Jaeger UI
1. **Open your browser** and go to: http://localhost:16686
2. **No login required** - Jaeger UI opens directly

### 2.2 View Traces
1. **Service Selection:**
   - In the left panel, select service from dropdown
   - Look for services like `traefik`, `microplan-app`
   
2. **Search Traces:**
   - Click **"Find Traces"** to see recent traces
   - Adjust time range using the time picker
   
3. **Analyze Trace Details:**
   - Click on any trace to see detailed timeline
   - View span details, duration, and errors
   - See request flow through services

### 2.3 Understanding Trace Data
- **Trace**: Complete request journey
- **Span**: Individual operation within a trace
- **Tags**: Metadata about the operation
- **Duration**: How long each operation took

---

## 🚀 Step 3: Monitor Traffic Patterns and Performance

### 3.1 Real-time Traffic Monitoring

#### Option A: Manual Traffic Generation
Run the included script to generate test traffic:
```bash
./generate-traffic.sh
```

#### Option B: Continuous Monitoring
For real-time dashboard updates:
```bash
./continuous-traffic.sh
```
*Press Ctrl+C to stop*

### 3.2 Multi-Dashboard Monitoring Setup

**Open these URLs in separate browser tabs:**

1. **Traefik Dashboard**: http://localhost:8081/dashboard/
   - Real-time service health
   - Request routing visualization
   - Middleware status

2. **Grafana Dashboards**: http://localhost:3000
   - Detailed metrics and graphs
   - Historical data analysis
   - Custom alerting (can be configured)

3. **Prometheus**: http://localhost:9090
   - Raw metrics data
   - Custom queries
   - Target health status

4. **Jaeger Tracing**: http://localhost:16686
   - Request trace analysis
   - Performance bottleneck identification
   - Service dependency mapping

### 3.3 Key Metrics to Monitor

#### Performance Metrics:
- **Request Rate**: `rate(traefik_entrypoint_requests_total[5m])`
- **Response Time**: 95th percentile response times
- **Error Rate**: 4xx/5xx error percentage
- **Throughput**: Requests per second

#### Health Metrics:
- **Service Availability**: Services up/down status
- **Connection Count**: Active connections
- **Resource Usage**: Memory, CPU (if exporters added)

#### Business Metrics:
- **User Traffic Patterns**: Peak usage times
- **Feature Usage**: Most accessed endpoints
- **Geographic Distribution**: If geo-tagging enabled

### 3.4 Alerting Setup (Optional)
1. In Grafana, go to **Alerting** → **Alert Rules**
2. Create alerts for:
   - High error rates (>5%)
   - Slow response times (>500ms)
   - Service downtime
   - High traffic spikes

---

## 🎛️ Practical Exercise: Complete Monitoring Workflow

### Exercise: Monitor a Real Scenario

1. **Start Continuous Traffic**:
   ```bash
   ./continuous-traffic.sh
   ```

2. **Open All Monitoring Tools**:
   - Traefik: http://localhost:8081/dashboard/
   - Grafana: http://localhost:3000/d/traefik-monitoring
   - Jaeger: http://localhost:16686
   - Prometheus: http://localhost:9090

3. **Observe Real-time Changes**:
   - Watch request counts increase in Traefik dashboard
   - See metrics update in Grafana every 5 seconds
   - Find new traces appearing in Jaeger
   - Query live metrics in Prometheus

4. **Simulate Issues**:
   ```bash
   # Generate 404 errors
   for i in {1..10}; do curl http://localhost:8080/notfound; done
   
   # Generate load
   for i in {1..50}; do curl http://localhost:8080 & done; wait
   ```

5. **Analyze Results**:
   - Check error rate spike in Grafana
   - Find error traces in Jaeger
   - See status code distribution change in Traefik

---

## 🔧 Troubleshooting

### Common Issues:

1. **No metrics in Grafana**:
   - Check Prometheus targets: http://localhost:9090/targets
   - Verify Traefik metrics: http://localhost:8081/metrics

2. **No traces in Jaeger**:
   - Ensure traffic is flowing through Traefik
   - Check Jaeger health: http://localhost:16686

3. **Dashboard not loading**:
   - Restart Grafana: `docker-compose -f docker-compose.prod.yml restart grafana`
   - Check Grafana logs: `docker-compose -f docker-compose.prod.yml logs grafana`

### Health Check Commands:
```bash
# Check all services
docker-compose -f docker-compose.prod.yml ps

# Test endpoints
curl http://localhost:8080        # Main app
curl http://localhost:8081/metrics # Traefik metrics
curl http://localhost:3000        # Grafana
curl http://localhost:9090        # Prometheus
curl http://localhost:16686       # Jaeger
```

---

## 📈 Expected Results

After completing all steps, you should see:

✅ **Grafana Dashboard** showing:
- Request rates, response times, error rates
- Visual charts updating every 5 seconds
- Historical data trends

✅ **Jaeger Traces** displaying:
- Individual request journeys
- Service-to-service communication
- Performance bottlenecks

✅ **Traefik Dashboard** revealing:
- Active services and their health
- Real-time traffic routing
- Load balancing statistics

✅ **Real-time Monitoring** providing:
- Live system performance insights
- Immediate issue detection
- Performance optimization opportunities

🎉 **You now have a complete observability stack for your microservice architecture!**