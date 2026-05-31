export const siteConfig = {
  name: 'Riverside Community Portal',
  tagline: 'Your single source for local news, alerts, and events',
  town: 'Riverside',
  description:
    'Verified community news, council notices, traffic updates, and local events for Riverside residents.',
  url: 'https://community-portal.example.com',
  tipEmail: 'news@riverside-community.example',
  councilRssUrl: import.meta.env.COUNCIL_RSS_URL ?? '',
};

export const categories = [
  { id: 'alert', label: 'Alerts' },
  { id: 'council', label: 'Council' },
  { id: 'traffic', label: 'Traffic' },
  { id: 'event', label: 'Events' },
  { id: 'business', label: 'Business' },
  { id: 'community', label: 'Community' },
] as const;

export type Category = (typeof categories)[number]['id'];
