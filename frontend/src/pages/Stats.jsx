import { useEffect, useState } from 'react';
import { useParams, Link } from 'react-router-dom';
import { getLinkStats } from '../services/linkService';
import { formatDate } from '../utils/date';
import { getShortLinkBase } from '../utils/url';

function StatsPage() {
  const { code } = useParams();
  const [link, setLink] = useState(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState('');
  const [copied, setCopied] = useState(false);

  useEffect(() => {
    async function fetchStats() {
      try {
        const data = await getLinkStats(code);
        setLink(data);
      } catch (err) {
        setError(err.message);
      } finally {
        setLoading(false);
      }
    }

    fetchStats();
  }, [code]);

  const handleCopy = async () => {
    const shortLinkBase = getShortLinkBase();
    const shortUrl = shortLinkBase ? `${shortLinkBase}/${code}` : `${window.location.origin}/${code}`;
    
    try {
      await navigator.clipboard.writeText(shortUrl);
      setCopied(true);
      setTimeout(() => setCopied(false), 2000);
    } catch (err) {
      console.error('Failed to copy:', err);
    }
  };

  if (loading) {
    return (
      <div className="app">
        <div className="loading">Loading stats...</div>
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

  if (!link) {
    return (
      <div className="app">
        <div className="error-page">
          <h1>Link Not Found</h1>
          <p>The link you're looking for doesn't exist.</p>
          <Link to="/" className="btn-link">Go Home</Link>
        </div>
      </div>
    );
  }

  const shortLinkBase = getShortLinkBase();
  const shortUrl = shortLinkBase ? `${shortLinkBase}/${link.code}` : `/${link.code}`;

  return (
    <div className="app">
      <header className="header">
        <h1>Link Statistics</h1>
        <p>Detailed analytics for your shortened link</p>
        <Link to="/" className="back-link">← Back to Dashboard</Link>
      </header>

      <div className="stats-container">
        <div className="stats-card highlight-card">
          <div className="stats-header">
            <h2>Short Link</h2>
            <button 
              onClick={handleCopy}
              className={`copy-btn-large ${copied ? 'copied' : ''}`}
              title={copied ? 'Copied!' : 'Copy link'}
            >
              {copied ? (
                <>
                  <svg xmlns="http://www.w3.org/2000/svg" width="18" height="18" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
                    <polyline points="20 6 9 17 4 12" />
                  </svg>
                  Copied!
                </>
              ) : (
                <>
                  <svg xmlns="http://www.w3.org/2000/svg" width="18" height="18" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
                    <rect x="9" y="9" width="13" height="13" rx="2" ry="2" />
                    <path d="M5 15H4a2 2 0 0 1-2-2V4a2 2 0 0 1 2-2h9a2 2 0 0 1 2 2v1" />
                  </svg>
                  Copy Link
                </>
              )}
            </button>
          </div>
          <a href={shortUrl} className="stats-url short" target="_blank" rel="noopener noreferrer">
            {shortUrl}
          </a>
        </div>

        <div className="stats-card">
          <h3>Original URL</h3>
          <a href={link.url} className="stats-url" target="_blank" rel="noopener noreferrer">
            {link.url}
          </a>
        </div>

        <div className="stats-grid">
          <div className="stat-item">
            <div className="stat-icon clicks">
              <svg xmlns="http://www.w3.org/2000/svg" width="24" height="24" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
                <path d="M10 13a5 5 0 0 0 7.54.54l3-3a5 5 0 0 0-7.07-7.07l-1.72 1.71" />
                <path d="M14 11a5 5 0 0 0-7.54-.54l-3 3a5 5 0 0 0 7.07 7.07l1.71-1.71" />
              </svg>
            </div>
            <div className="stat-content">
              <div className="stat-value">{link.clicks}</div>
              <div className="stat-label">Total Clicks</div>
            </div>
          </div>

          <div className="stat-item">
            <div className="stat-icon created">
              <svg xmlns="http://www.w3.org/2000/svg" width="24" height="24" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
                <circle cx="12" cy="12" r="10" />
                <polyline points="12 6 12 12 16 14" />
              </svg>
            </div>
            <div className="stat-content">
              <div className="stat-value">{formatDate(link.created_at)}</div>
              <div className="stat-label">Created</div>
            </div>
          </div>

          <div className="stat-item">
            <div className="stat-icon last-clicked">
              <svg xmlns="http://www.w3.org/2000/svg" width="24" height="24" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
                <path d="M12 2v4M12 18v4M4.93 4.93l2.83 2.83M16.24 16.24l2.83 2.83M2 12h4M18 12h4M4.93 19.07l2.83-2.83M16.24 7.76l2.83-2.83" />
              </svg>
            </div>
            <div className="stat-content">
              <div className="stat-value">
                {link.last_clicked ? formatDate(link.last_clicked) : 'Never'}
              </div>
              <div className="stat-label">Last Clicked</div>
            </div>
          </div>

          <div className="stat-item">
            <div className="stat-icon code">
              <svg xmlns="http://www.w3.org/2000/svg" width="24" height="24" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
                <polyline points="16 18 22 12 16 6" />
                <polyline points="8 6 2 12 8 18" />
              </svg>
            </div>
            <div className="stat-content">
              <div className="stat-value">{link.code}</div>
              <div className="stat-label">Short Code</div>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}

export default StatsPage;

