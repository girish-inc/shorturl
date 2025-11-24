// Use environment variable for API URL in production, proxy in development
const API_BASE = import.meta.env.VITE_API_URL || '/api';

async function handleResponse(response) {
  if (!response.ok) {
    const error = await response.json().catch(() => ({}));
    throw new Error(error.error || 'Request failed');
  }
  return response.json();
}

export async function createLink(url, customCode = '') {
  const body = { url };
  if (customCode && customCode.trim()) {
    body.customCode = customCode.trim();
  }

  const response = await fetch(`${API_BASE}/links`, {
    method: 'POST',
    headers: { 'Content-Type': 'application/json' },
    body: JSON.stringify(body)
  });

  return handleResponse(response);
}

export async function getLinks() {
  const response = await fetch(`${API_BASE}/links`);
  return handleResponse(response);
}

