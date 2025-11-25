import { useState } from 'react';
import { Link } from 'react-router-dom';
import EmptyState from './EmptyState';
import { formatDate } from '../utils/date';

function LinksTable({ links, fetchingLinks, shortLinkBase, onDelete }) {
  const [copiedCode, setCopiedCode] = useState(null);

  if (fetchingLinks) {
    return <div className="loading">Loading links...</div>;
  }

  if (links.length === 0) {
    return <EmptyState />;
  }

  const handleCopy = async (code) => {
    const shortUrl = shortLinkBase ? `${shortLinkBase}/${code}` : `${window.location.origin}/${code}`;
    
    try {
      await navigator.clipboard.writeText(shortUrl);
      setCopiedCode(code);
      setTimeout(() => setCopiedCode(null), 2000);
    } catch (err) {
      console.error('Failed to copy:', err);
    }
  };

  return (
    <table className="links-table">
      <thead>
        <tr>
          <th>Short Code</th>
          <th>Original URL</th>
          <th>Clicks</th>
          <th>Last Clicked</th>
          <th>Actions</th>
        </tr>
      </thead>
      <tbody>
        {links.map((link) => (
          <tr key={link.id}>
            <td>
              <a
                href={shortLinkBase ? `${shortLinkBase}/${link.code}` : `/${link.code}`}
                className="short-link"
                target="_blank"
                rel="noopener noreferrer"
              >
                {link.code}
              </a>
            </td>
            <td>
              <div className="original-url" title={link.url}>
                {link.url}
              </div>
            </td>
            <td>
              <span className="clicks-badge">{link.clicks}</span>
            </td>
            <td>
              <span className="date">
                {link.last_clicked ? formatDate(link.last_clicked) : 'Never'}
              </span>
            </td>
            <td>
              <div className="action-buttons">
                <Link
                  to={`/stats/${link.code}`}
                  className="stats-btn"
                  title="View stats"
                >
                  <svg
                    xmlns="http://www.w3.org/2000/svg"
                    width="16"
                    height="16"
                    viewBox="0 0 24 24"
                    fill="none"
                    stroke="currentColor"
                    strokeWidth="2"
                    strokeLinecap="round"
                    strokeLinejoin="round"
                  >
                    <line x1="18" y1="20" x2="18" y2="10" />
                    <line x1="12" y1="20" x2="12" y2="4" />
                    <line x1="6" y1="20" x2="6" y2="14" />
                  </svg>
                </Link>
                <button
                  onClick={() => handleCopy(link.code)}
                  className={`copy-btn ${copiedCode === link.code ? 'copied' : ''}`}
                  title={copiedCode === link.code ? 'Copied!' : 'Copy short link'}
                >
                  {copiedCode === link.code ? (
                    <svg
                      xmlns="http://www.w3.org/2000/svg"
                      width="16"
                      height="16"
                      viewBox="0 0 24 24"
                      fill="none"
                      stroke="currentColor"
                      strokeWidth="2"
                      strokeLinecap="round"
                      strokeLinejoin="round"
                    >
                      <polyline points="20 6 9 17 4 12" />
                    </svg>
                  ) : (
                    <svg
                      xmlns="http://www.w3.org/2000/svg"
                      width="16"
                      height="16"
                      viewBox="0 0 24 24"
                      fill="none"
                      stroke="currentColor"
                      strokeWidth="2"
                      strokeLinecap="round"
                      strokeLinejoin="round"
                    >
                      <rect x="9" y="9" width="13" height="13" rx="2" ry="2" />
                      <path d="M5 15H4a2 2 0 0 1-2-2V4a2 2 0 0 1 2-2h9a2 2 0 0 1 2 2v1" />
                    </svg>
                  )}
                </button>
                <button
                  onClick={() => onDelete(link.code)}
                  className="delete-btn"
                  title="Delete link"
                >
                  <svg
                    xmlns="http://www.w3.org/2000/svg"
                    width="16"
                    height="16"
                    viewBox="0 0 24 24"
                    fill="none"
                    stroke="currentColor"
                    strokeWidth="2"
                    strokeLinecap="round"
                    strokeLinejoin="round"
                  >
                    <path d="M3 6h18M19 6v14a2 2 0 0 1-2 2H7a2 2 0 0 1-2-2V6m3 0V4a2 2 0 0 1 2-2h4a2 2 0 0 1 2 2v2M10 11v6M14 11v6" />
                  </svg>
                </button>
              </div>
            </td>
          </tr>
        ))}
      </tbody>
    </table>
  );
}

export default LinksTable;

