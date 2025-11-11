/**
 * 🩺 UPTIME MONITOR
 * 
 * Prevents Render cold starts by pinging the API every 15 minutes
 * Run this as a separate service or cron job
 */

import https from 'https';

const API_URL = process.env.RENDER_API_URL || 'https://synrgy-api.onrender.com';
const PING_INTERVAL = 15 * 60 * 1000; // 15 minutes

/**
 * Ping the API health endpoint
 */
async function pingAPI(): Promise<void> {
  return new Promise((resolve, reject) => {
    const url = `${API_URL}/api/health`;
    
    https.get(url, (res) => {
      const timestamp = new Date().toISOString();
      
      if (res.statusCode === 200) {
        console.log(`✅ [${timestamp}] API is alive (${res.statusCode})`);
        resolve();
      } else {
        console.warn(`⚠️  [${timestamp}] API returned ${res.statusCode}`);
        resolve(); // Don't reject, just log
      }
    }).on('error', (err) => {
      const timestamp = new Date().toISOString();
      console.error(`❌ [${timestamp}] Ping failed: ${err.message}`);
      reject(err);
    });
  });
}

/**
 * Start uptime monitoring
 */
async function startMonitoring() {
  console.log('🩺 Synrgy Uptime Monitor started');
  console.log(`📡 Pinging: ${API_URL}/api/health`);
  console.log(`⏱️  Interval: Every ${PING_INTERVAL / 60000} minutes\n`);

  // Initial ping
  try {
    await pingAPI();
  } catch (err) {
    console.error('Initial ping failed, but continuing...');
  }

  // Set up recurring pings
  setInterval(async () => {
    try {
      await pingAPI();
    } catch (err) {
      // Error already logged, continue monitoring
    }
  }, PING_INTERVAL);

  console.log('✅ Monitoring active. Press Ctrl+C to stop.\n');
}

// Start monitoring if run directly
if (require.main === module) {
  startMonitoring().catch((err) => {
    console.error('Failed to start monitoring:', err);
    process.exit(1);
  });
}

export { pingAPI, startMonitoring };

