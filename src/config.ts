export const siteConfig = {
  name: 'Monasterevin Community Portal',
  tagline: 'Your neighbour-led hub for local news, events & trusted trades',
  town: 'Monasterevin',
  description:
    'Verified community news, council notices, traffic updates, and local events for Monasterevin residents.',
  url: 'https://krypton-john.github.io/community-portal',
  tipEmail: 'tips@monasterevin-community.ie',
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

export const serviceCategories = [
  { id: 'plumber', label: 'Plumber' },
  { id: 'electrician', label: 'Electrician' },
  { id: 'builder', label: 'Builder' },
  { id: 'gardener', label: 'Gardener' },
  { id: 'mechanic', label: 'Mechanic' },
  { id: 'childcare', label: 'Childcare' },
  { id: 'cleaner', label: 'Cleaner' },
  { id: 'painter', label: 'Painter' },
  { id: 'roofer', label: 'Roofer' },
  { id: 'cafe', label: 'Café & Food' },
  { id: 'shop', label: 'Shop' },
  { id: 'other', label: 'Other' },
] as const;

export type ServiceCategory = (typeof serviceCategories)[number]['id'];
