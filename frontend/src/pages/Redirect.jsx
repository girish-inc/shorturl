import { useEffect, useState } from 'react';
import { useParams } from 'react-router-dom';

const API_BASE = import.meta.env.VITE_API_URL || '/api';

// Get backend base URL for redirects
function getBackendBaseUrl() {
  // In production, VITE_API_URL will be like 'https://backend.onrender.com/api'
  // We need to get 'https://backend.onrender.com'
  if (API_BASE.startsWith('http')) {
    return API_BASE.replace(/\/api\/?$/, '');
  }
  // In development, API_BASE is '/api' and we're using the same origin
  return window.location.origin;
}

function Redirect() {
  const { code } = useParams();
  const [error, setError] = useState(null);

  useEffect(() => {
    async function redirect() {
      try {
        // Fetch link info to verify it exists
        const response = await fetch(`${API_BASE}/links/${code}/stats`);
        
        if (!response.ok) {
          setError('Link not found');
          return;
        }

        const data = await response.json();
        
        // Redirect through backend to track clicks
        const backendBaseUrl = getBackendBaseUrl();
        window.location.href = `${backendBaseUrl}/${code}`;
      } catch (err) {
        setError('Failed to redirect');
      }
    }

    redirect();
  }, [code]);

  if (error) {
    return (
      <div style={{ 
        display: 'flex', 
        justifyContent: 'center', 
        alignItems: 'center', 
        height: '100vh',
        fontFamily: 'system-ui, -apple-system, sans-serif'
      }}>
        <div style={{ textAlign: 'center' }}>
          <h2>❌ {error}</h2>
          <p>The link you're looking for doesn't exist.</p>
          <a href="/">Go Home</a>
        </div>
      </div>
    );
  }

  return (
    <div style={{ 
      display: 'flex', 
      justifyContent: 'center', 
      alignItems: 'center', 
      height: '100vh',
      fontFamily: 'system-ui, -apple-system, sans-serif'
    }}>
      <div style={{ textAlign: 'center' }}>
        <h2>Redirecting...</h2>
        <p>Please wait while we redirect you.</p>
      </div>
    </div>
  );
}

export default Redirect;

