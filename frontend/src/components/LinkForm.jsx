function LinkForm({
  url,
  customCode,
  error,
  loading,
  onUrlChange,
  onCustomCodeChange,
  onSubmit
}) {
  return (
    <div className="link-form">
      <form onSubmit={onSubmit}>
        {error && <div className="error">{error}</div>}

        <div className="form-group">
          <label htmlFor="url">Long URL</label>
          <input
            id="url"
            type="url"
            placeholder="https://example.com/very/long/url"
            value={url}
            onChange={onUrlChange}
            required
          />
        </div>

        <div className="form-group">
          <label htmlFor="customCode">Custom Code (optional)</label>
          <input
            id="customCode"
            type="text"
            placeholder="mycode (6-8 alphanumeric characters)"
            value={customCode}
            onChange={onCustomCodeChange}
            pattern="[A-Za-z0-9]{6,8}"
            title="6-8 alphanumeric characters"
          />
        </div>

        <button type="submit" className="btn" disabled={loading}>
          {loading ? 'Creating...' : 'Shorten URL'}
        </button>
      </form>
    </div>
  );
}

export default LinkForm;

