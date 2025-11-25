import { useEffect, useMemo, useState } from 'react';
import LinkForm from '../components/LinkForm';
import LinksTable from '../components/LinksTable';
import { createLink, getLinks, deleteLink } from '../services/linkService';
import { getShortLinkBase } from '../utils/url';

function HomePage() {
  const [url, setUrl] = useState('');
  const [customCode, setCustomCode] = useState('');
  const [links, setLinks] = useState([]);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState('');
  const [fetchingLinks, setFetchingLinks] = useState(true);
  const shortLinkBase = useMemo(() => getShortLinkBase(), []);

  useEffect(() => {
    async function fetchData() {
      try {
        const data = await getLinks();
        setLinks(data);
      } catch (err) {
        console.error('Failed to fetch links:', err);
      } finally {
        setFetchingLinks(false);
      }
    }

    fetchData();
  }, []);

  async function handleSubmit(e) {
    e.preventDefault();
    setError('');
    setLoading(true);

    try {
      const newLink = await createLink(url, customCode);
      setLinks((prevLinks) => [newLink, ...prevLinks]);
      setUrl('');
      setCustomCode('');
    } catch (err) {
      setError(err.message);
} finally {
      setLoading(false);
    }
  }

  async function handleDelete(code) {
    

    try {
      await deleteLink(code);
      setLinks((prevLinks) => prevLinks.filter(link => link.code !== code));
    } catch (err) {
      alert('Failed to delete link: ' + err.message);
    }
  }

  return (
    <div className="app">
      <header className="header">
        <h1>URL Shortener</h1>
        <p>Transform long URLs into short, shareable links</p>
      </header>

      <LinkForm
        url={url}
        customCode={customCode}
        error={error}
        loading={loading}
        onUrlChange={(event) => setUrl(event.target.value)}
        onCustomCodeChange={(event) => setCustomCode(event.target.value)}
        onSubmit={handleSubmit}
      />

      <section className="dashboard-section">
        <div className="dashboard">
          <h2>Your Links</h2>
          <div className="dashboard-content">
            <LinksTable
              links={links}
              fetchingLinks={fetchingLinks}
              shortLinkBase={shortLinkBase}
              onDelete={handleDelete}
            />
          </div>
        </div>
      </section>
    </div>
  );
}

export default HomePage;

