export function getShortLinkBase() {
  // In production, short links should point to the backend server
  // which handles the redirects (not the frontend)
  const configuredBase = import.meta.env.VITE_SHORT_BASE_URL?.trim();
  if (configuredBase) {
    return configuredBase.replace(/\/$/, '');
  }

  if (typeof window !== 'undefined') {
    // In development, frontend is on 5173, backend on 3000
    if (window.location.origin.includes('localhost:5173')) {
      return 'http://localhost:3000';
    }
    // In production without config, derive from API URL
    // Remove /api suffix to get the base backend URL
    const apiUrl = import.meta.env.VITE_API_URL;
    if (apiUrl) {
      return apiUrl.replace(/\/api\/?$/, '');
    }
    // Fallback to current origin (not ideal, but prevents broken links)
    return window.location.origin;
  }

  return '';
}

