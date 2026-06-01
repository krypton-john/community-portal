/**
 * Prefix internal site paths with Astro's base URL (required for GitHub Pages project sites).
 * e.g. withBase('/news') → '/community-portal/news'
 */
export function withBase(path: string): string {
  if (!path || path.startsWith('http') || path.startsWith('mailto:') || path.startsWith('tel:')) {
    return path;
  }
  const base = import.meta.env.BASE_URL.endsWith('/')
    ? import.meta.env.BASE_URL
    : `${import.meta.env.BASE_URL}/`;
  const normalized = path.startsWith('/') ? path.slice(1) : path;
  return `${base}${normalized}`;
}
