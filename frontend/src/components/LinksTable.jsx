import EmptyState from './EmptyState';
import { formatDate } from '../utils/date';

function LinksTable({ links, fetchingLinks, shortLinkBase }) {
  if (fetchingLinks) {
    return <div className="loading">Loading links...</div>;
  }

  if (links.length === 0) {
    return <EmptyState />;
  }

  return (
    <table className="links-table">
      <thead>
        <tr>
          <th>Short Code</th>
          <th>Original URL</th>
          <th>Clicks</th>
          <th>Created</th>
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
              <span className="date">{formatDate(link.created_at)}</span>
            </td>
          </tr>
        ))}
      </tbody>
    </table>
  );
}

export default LinksTable;

