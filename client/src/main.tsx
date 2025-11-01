import React from 'react';
import ReactDOM from 'react-dom/client';
import App from './App';
import './index.css';
import ErrorBoundary from './components/ErrorBoundary';
import { startConnectionMonitor } from './shield/connection';
import { startFrontendAI } from './shield/frontendAI';
import './utils/synrgyDiagnostics'; // Auto-run diagnostics
import './utils/connection';

// Demo auto-login disabled for full user experience
localStorage.removeItem('synrgy-demo-user');

// Start SHIELD connection monitor
startConnectionMonitor();

// Start SHIELD Frontend AI v3.0
startFrontendAI();

ReactDOM.createRoot(document.getElementById('root')!).render(
  <React.StrictMode>
    <ErrorBoundary>
      <App />
    </ErrorBoundary>
  </React.StrictMode>
);