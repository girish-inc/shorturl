import { useEffect, useState } from 'react';
import { Link } from 'react-router-dom';
import { getHealthCheck } from '../services/linkService';

function HealthPage() {
  const [health, setHealth] = useState(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState('');

  useEffect(() => {
    async function fetchHealth() {
      try {
        const data = await getHealthCheck();
        setHealth(data);
      } catch (err) {
        setError(err.message);
      } finally {
        setLoading(false);
      }
    }

    fetchHealth();
    
    // Refresh health data every 5 seconds
    const interval = setInterval(fetchHealth, 5000);
    return () => clearInterval(interval);
  }, []);

  if (loading) {
    return (
      <div className="app">
        <div className="loading">Loading health status...</div>
      </div>
    );
  }

  if (error) {
    return (
      <div className="app">
        <div className="error-page">
          <h1>Error</h1>
          <p>{error}</p>
          <Link to="/" className="btn-link">Go Home</Link>
        </div>
      </div>
    );
  }

  return (
    <div className="app">
      <header className="header">
        <h1>System Health</h1>
        <p>Real-time system status and diagnostics</p>
        <Link to="/" className="back-link">← Back to Dashboard</Link>
      </header>

      <div className="health-container">
        <div className="health-card status-card">
          <div className="status-indicator">
            <div className={`status-dot ${health.status === 'ok' ? 'active' : 'inactive'}`}></div>
            <div>
              <h2>System Status</h2>
              <p className="status-text">{health.status === 'ok' ? 'All Systems Operational' : 'System Down'}</p>
            </div>
          </div>
        </div>

        <div className="health-grid">
          <div className="health-stat">
            <div className="health-icon uptime">
              <svg xmlns="http://www.w3.org/2000/svg" width="24" height="24" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
                <circle cx="12" cy="12" r="10" />
                <polyline points="12 6 12 12 16 14" />
              </svg>
            </div>
            <div className="health-content">
              <div className="health-label">Uptime</div>
              <div className="health-value">{health.uptimeFormatted}</div>
            </div>
          </div>

          <div className="health-stat">
            <div className="health-icon environment">
              <svg xmlns="http://www.w3.org/2000/svg" width="24" height="24" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
                <path d="M21 16V8a2 2 0 0 0-1-1.73l-7-4a2 2 0 0 0-2 0l-7 4A2 2 0 0 0 3 8v8a2 2 0 0 0 1 1.73l7 4a2 2 0 0 0 2 0l7-4A2 2 0 0 0 21 16z" />
                <polyline points="3.27 6.96 12 12.01 20.73 6.96" />
                <line x1="12" y1="22.08" x2="12" y2="12" />
              </svg>
            </div>
            <div className="health-content">
              <div className="health-label">Environment</div>
              <div className="health-value">{health.environment}</div>
            </div>
          </div>

          <div className="health-stat">
            <div className="health-icon node">
              <svg xmlns="http://www.w3.org/2000/svg" width="24" height="24" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
                <rect x="2" y="7" width="20" height="14" rx="2" ry="2" />
                <path d="M16 21V5a2 2 0 0 0-2-2h-4a2 2 0 0 0-2 2v16" />
              </svg>
            </div>
            <div className="health-content">
              <div className="health-label">Node Version</div>
              <div className="health-value">{health.node}</div>
            </div>
          </div>

          <div className="health-stat">
            <div className="health-icon platform">
              <svg xmlns="http://www.w3.org/2000/svg" width="24" height="24" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
                <circle cx="12" cy="12" r="10" />
                <line x1="2" y1="12" x2="22" y2="12" />
                <path d="M12 2a15.3 15.3 0 0 1 4 10 15.3 15.3 0 0 1-4 10 15.3 15.3 0 0 1-4-10 15.3 15.3 0 0 1 4-10z" />
              </svg>
            </div>
            <div className="health-content">
              <div className="health-label">Platform</div>
              <div className="health-value">{health.platform}</div>
            </div>
          </div>
        </div>

        <div className="memory-section">
          <h3>Memory Usage</h3>
          <div className="memory-grid">
            <div className="memory-item">
              <span className="memory-label">RSS</span>
              <span className="memory-value">{health.memory.rss}</span>
            </div>
            <div className="memory-item">
              <span className="memory-label">Heap Total</span>
              <span className="memory-value">{health.memory.heapTotal}</span>
            </div>
            <div className="memory-item">
              <span className="memory-label">Heap Used</span>
              <span className="memory-value">{health.memory.heapUsed}</span>
            </div>
            <div className="memory-item">
              <span className="memory-label">External</span>
              <span className="memory-value">{health.memory.external}</span>
            </div>
          </div>
        </div>

        <div className="system-info">
          <div className="info-row">
            <span className="info-label">Process ID:</span>
            <span className="info-value">{health.pid}</span>
          </div>
          <div className="info-row">
            <span className="info-label">Last Updated:</span>
            <span className="info-value">{new Date(health.timestamp).toLocaleString()}</span>
          </div>
        </div>
      </div>
    </div>
  );
}

export default HealthPage;

