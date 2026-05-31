export const siteConfig = {
  name: 'Monasterevin Community Portal',
  tagline: 'Local news, alerts, and events for Monasterevin',
  town: 'Monasterevin',
  description:
    'Verified community news, council notices, traffic updates, and local events for Monasterevin residents.',
  url: 'https://krypton-john.github.io/community-portal',
  tipEmail: 'tips@monasterevin-community.ie',
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
