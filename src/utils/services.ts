import type { CollectionEntry } from 'astro:content';

export type ServiceListing = CollectionEntry<'services'>;

export function sortByName(a: ServiceListing, b: ServiceListing): number {
  return a.data.name.localeCompare(b.data.name, 'en', { sensitivity: 'base' });
}

export function filterByCategory(
  listings: ServiceListing[],
  category: string | null | undefined,
): ServiceListing[] {
  if (!category) return listings;
  return listings.filter((item) => item.data.category === category);
}

export function filterBySearch(listings: ServiceListing[], query: string): ServiceListing[] {
  const q = query.trim().toLowerCase();
  if (!q) return listings;

  return listings.filter((item) => {
    const haystack = [
      item.data.name,
      item.data.address,
      item.data.phone ?? '',
      item.data.email ?? '',
      item.data.description ?? '',
      item.data.category,
    ]
      .join(' ')
      .toLowerCase();
    return haystack.includes(q);
  });
}

export function serviceCategoryLabel(category: string): string {
  const labels: Record<string, string> = {
    plumber: 'Plumber',
    electrician: 'Electrician',
    builder: 'Builder',
    gardener: 'Gardener',
    mechanic: 'Mechanic',
    childcare: 'Childcare',
    cleaner: 'Cleaner',
    painter: 'Painter',
    roofer: 'Roofer',
    cafe: 'Café & Food',
    shop: 'Shop',
    other: 'Other',
  };
  return labels[category] ?? category;
}

export function serializeListingsForClient(listings: ServiceListing[]) {
  return listings.map((item) => ({
    id: item.id,
    name: item.data.name,
    category: item.data.category,
    categoryLabel: serviceCategoryLabel(item.data.category),
    address: item.data.address,
    phone: item.data.phone ?? '',
    email: item.data.email ?? '',
    website: item.data.website ?? '',
    social: item.data.social ?? {},
    verified: item.data.verified,
    description: item.data.description ?? '',
  }));
}
