# 🔧 FIXING: Grafana "Datasource prometheus was not found"

## ✅ **I've Fixed the Configuration**

**What I did:**
1. ✅ Updated Prometheus datasource with UID `prometheus`
2. ✅ Restarted Grafana to reload configurations  
3. ✅ Verified Prometheus connectivity from Grafana container
4. ✅ Confirmed Traefik metrics are available in Prometheus

## 🔍 **Step-by-Step Verification:**

### Step 1: Login to Grafana
1. Go to: http://localhost:3000
2. Login: `admin` / `admin123_change_in_production`

### Step 2: Check Datasource
1. Click **⚙️ Settings** (gear icon) in left sidebar
2. Click **Data Sources**
3. You should see **Prometheus** with a green checkmark
4. If red, click on it and click **"Save & Test"**

### Step 3: Access the Dashboard
1. Click **📊 Dashboards** in left sidebar
2. Look for **"Traefik Monitoring Dashboard"**
3. Click on it
4. The dashboard should now load without errors

## 🛠️ **If Still Not Working - Manual Fix:**

### Option A: Add Datasource Manually
1. In Grafana, go to **⚙️ Settings** → **Data Sources**
2. Click **"Add data source"**
3. Select **Prometheus**
4. Configure:
   ```
   Name: Prometheus
   URL: http://prometheus:9090
   ```
5. Click **"Save & Test"**

### Option B: Recreate Dashboard
1. Go to **📊 Dashboards** → **"+ Create"** → **"Dashboard"**
2. Click **"Add new panel"**
3. In query editor, enter: `rate(traefik_entrypoint_requests_total[5m])`
4. You should see data immediately

## 🧪 **Test Queries:**

Try these queries in **Explore** or a new panel:

```promql
# Basic Traefik metrics
traefik_entrypoint_requests_total

# Request rate  
rate(traefik_entrypoint_requests_total[5m])

# Response times
traefik_entrypoint_request_duration_seconds

# All available metrics
{__name__=~"traefik.*"}
```

## 📊 **Current Status Verification:**

### Check Services:
```bash
docker-compose -f docker-compose.prod.yml ps grafana prometheus
```

### Test Prometheus:
```bash
curl http://localhost:9090/api/v1/query?query=up
```

### Test Datasource Connection:
```bash
# From inside Grafana container
docker-compose -f docker-compose.prod.yml exec grafana wget -q -O - http://prometheus:9090/api/v1/label/__name__/values
```

## 🎯 **Expected Results:**

After these fixes, you should see:
- ✅ **Green datasource** in Grafana settings
- ✅ **Working dashboard** with live metrics
- ✅ **Real-time data** updating every 5 seconds
- ✅ **No "datasource not found" errors**

## 🔄 **If Problems Persist:**

1. **Restart both services:**
   ```bash
   docker-compose -f docker-compose.prod.yml restart prometheus grafana
   ```

2. **Check logs:**
   ```bash
   docker-compose -f docker-compose.prod.yml logs grafana
   docker-compose -f docker-compose.prod.yml logs prometheus
   ```

3. **Manual verification:**
   - Prometheus UI: http://localhost:9090
   - Grafana: http://localhost:3000
   - Test query in Prometheus: `traefik_entrypoint_requests_total`

**🚀 The datasource should now be working! Try accessing the Traefik Monitoring Dashboard again.**