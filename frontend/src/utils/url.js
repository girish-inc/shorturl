/**
 * Get the base URL for shortened links.
 * 
 * IMPORTANT: Shortened links should ALWAYS use the FRONTEND URL, not the backend URL.
 * Format: frontendurl/code (e.g., https://your-app.vercel.app/abc123)
 * 
 * How it works:
 * 1. User gets a shortened link pointing to frontend: https://frontend.com/abc123
 * 2. Frontend route /:code catches the request
 * 3. Redirect component fetches link data and redirects to backend
 * 4. Backend redirects to the original URL and tracks the click
 * 
 * Configuration priority:
 * 1. VITE_SHORT_BASE_URL (if explicitly set) - should be your frontend URL
 * 2. window.location.origin (auto-detected frontend URL)
 * 3. Empty string (fallback)
 * 
 * @returns {string} The base URL for shortened links (frontend URL)
 */
export function getShortLinkBase() {
  const configuredBase = import.meta.env.VITE_SHORT_BASE_URL?.trim();
  if (configuredBase) {
    // Remove trailing slash for consistency
    return configuredBase.replace(/\/$/, '');
  }

  if (typeof window !== 'undefined') {
    // Use the current frontend origin for short links
    // This ensures shortened URLs are always frontendurl/code
    return window.location.origin;
  }

  return '';
}

