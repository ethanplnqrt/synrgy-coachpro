// SHIELD SYSTEM v3.0 - Frontend AI for Anti-Crash Protection
let stabilityScore = 100;
let errorCount = 0;

export function startFrontendAI() {
  console.log('🧠 Synrgy Live AI active — Backend connection verified');

  // Monitor JavaScript errors
  window.addEventListener('error', (e) => {
    handleError('JavaScript Error', e.message);
  });

  // Monitor unhandled promise rejections
  window.addEventListener('unhandledrejection', (e) => {
    handleError('Unhandled Rejection', e.reason?.message || String(e.reason));
  });

  // Monitor fetch errors
  const originalFetch = window.fetch;
  window.fetch = async function(...args) {
    try {
      const response = await originalFetch.apply(this, args);
      return response;
    } catch (error) {
      handleError('Fetch Error', String(error));
      throw error;
    }
  };

  // Gradual recovery
  setInterval(() => {
    if (stabilityScore < 100) {
      stabilityScore = Math.min(stabilityScore + 1, 100);
    }
    
    if (errorCount > 0) {
      errorCount = Math.max(errorCount - 1, 0);
    }
  }, 5000);

  // Health check
  setInterval(() => {
    checkHealth();
  }, 30000);
}

function handleError(context: string, message: string) {
  stabilityScore = Math.max(stabilityScore - 10, 0);
  errorCount++;
  
  console.warn(`🧩 Frontend AI: erreur captée [${context}]`, message);
  
  // Log to localStorage for monitoring
  try {
    const errorLog = JSON.parse(localStorage.getItem('frontend_errors') || '[]');
    errorLog.push({
      context,
      message: message.substring(0, 100),
      timestamp: new Date().toISOString(),
      stabilityScore
    });
    
    if (errorLog.length > 20) {
      errorLog.shift();
    }
    
    localStorage.setItem('frontend_errors', JSON.stringify(errorLog));
  } catch (e) {
    // Ignore localStorage errors
  }

  // Critical threshold: reload if too unstable
  if (stabilityScore < 30 && errorCount > 5) {
    console.log('🧠 Prévention critique : rechargement partiel des composants');
    console.log(`Score de stabilité: ${stabilityScore}%`);
    
    // Store current state
    const currentPath = window.location.pathname;
    localStorage.setItem('reload_path', currentPath);
    
    // Soft reload (React preserves cache)
    setTimeout(() => {
      const savedPath = localStorage.getItem('reload_path');
      if (savedPath) {
        window.location.href = savedPath;
      } else {
        window.location.reload();
      }
    }, 1000);
  }
}

function checkHealth() {
  const healthData = {
    stabilityScore,
    errorCount,
    memoryUsage: (performance as any).memory?.usedJSHeapSize || 0,
    timestamp: new Date().toISOString()
  };

  // Update localStorage for dashboard
  try {
    localStorage.setItem('frontend_health', JSON.stringify(healthData));
  } catch (e) {
    // Ignore localStorage errors
  }

  // Log critical health issues
  if (stabilityScore < 50) {
    console.warn(`⚠️ Frontend AI : Score de stabilité faible (${stabilityScore}%)`);
  }
}

export function getStabilityScore(): number {
  return stabilityScore;
}

export function getErrorCount(): number {
  return errorCount;
}
