import type { CollectionEntry } from 'astro:content';

export type NewsPost = CollectionEntry<'news'>;

export function getSlug(post: NewsPost): string {
  return post.data.permalink ?? post.slug;
}

export function getUpdatedAt(post: NewsPost): Date {
  return post.data.updatedAt ?? post.data.publishedAt;
}

export function isExpired(post: NewsPost, now = new Date()): boolean {
  if (!post.data.expiresAt) return false;
  return post.data.expiresAt.getTime() < now.getTime();
}

export function isUrgentActive(post: NewsPost, now = new Date()): boolean {
  if (!post.data.urgent) return false;
  if (isExpired(post, now)) return false;

  const fortyEightHoursAgo = now.getTime() - 48 * 60 * 60 * 1000;
  return post.data.publishedAt.getTime() >= fortyEightHoursAgo;
}

export function sortByPublishedDesc(a: NewsPost, b: NewsPost): number {
  return b.data.publishedAt.getTime() - a.data.publishedAt.getTime();
}

export function filterActivePosts(posts: NewsPost[], now = new Date()): NewsPost[] {
  return posts.filter((post) => !isExpired(post, now));
}

export function filterByCategory(
  posts: NewsPost[],
  category: string | null | undefined,
): NewsPost[] {
  if (!category) return posts;
  return posts.filter((post) => post.data.category === category);
}

export function filterVerified(posts: NewsPost[], verifiedOnly: boolean): NewsPost[] {
  if (!verifiedOnly) return posts;
  return posts.filter((post) => post.data.verified);
}

export function getEventPosts(posts: NewsPost[]): NewsPost[] {
  return posts.filter(
    (post) => post.data.category === 'event' && post.data.eventStart,
  );
}

export function getUpcomingEvents(
  posts: NewsPost[],
  daysAhead = 30,
  now = new Date(),
): NewsPost[] {
  const end = new Date(now);
  end.setDate(end.getDate() + daysAhead);

  return getEventPosts(posts)
    .filter((post) => {
      const start = post.data.eventStart!;
      return start >= now && start <= end;
    })
    .sort(
      (a, b) => a.data.eventStart!.getTime() - b.data.eventStart!.getTime(),
    );
}

export function formatDate(date: Date): string {
  return date.toLocaleDateString('en-GB', {
    weekday: 'short',
    day: 'numeric',
    month: 'short',
    year: 'numeric',
  });
}

export function formatDateTime(date: Date): string {
  return date.toLocaleString('en-GB', {
    weekday: 'short',
    day: 'numeric',
    month: 'short',
    year: 'numeric',
    hour: '2-digit',
    minute: '2-digit',
  });
}

export function categoryLabel(category: string): string {
  const labels: Record<string, string> = {
    alert: 'Alert',
    council: 'Council',
    traffic: 'Traffic',
    event: 'Event',
    business: 'Business',
    community: 'Community',
  };
  return labels[category] ?? category;
}

export function categoryColor(category: string): string {
  const colors: Record<string, string> = {
    alert: 'bg-red-100 text-red-800',
    council: 'bg-blue-100 text-blue-800',
    traffic: 'bg-amber-100 text-amber-900',
    event: 'bg-green-100 text-green-800',
    business: 'bg-purple-100 text-purple-800',
    community: 'bg-slate-100 text-slate-800',
  };
  return colors[category] ?? 'bg-gray-100 text-gray-800';
}

export function getCalendarDays(year: number, month: number) {
  const firstDay = new Date(year, month, 1);
  const lastDay = new Date(year, month + 1, 0);
  const startPad = (firstDay.getDay() + 6) % 7; // Monday-start week
  const days: (Date | null)[] = [];

  for (let i = 0; i < startPad; i++) days.push(null);
  for (let d = 1; d <= lastDay.getDate(); d++) {
    days.push(new Date(year, month, d));
  }

  return days;
}

export function eventsOnDate(events: NewsPost[], date: Date): NewsPost[] {
  const dayStart = new Date(date.getFullYear(), date.getMonth(), date.getDate());
  const dayEnd = new Date(dayStart);
  dayEnd.setDate(dayEnd.getDate() + 1);

  return events.filter((post) => {
    const start = post.data.eventStart!;
    const end = post.data.eventEnd ?? start;
    return start < dayEnd && end >= dayStart;
  });
}

export function isSameDay(a: Date, b: Date): boolean {
  return (
    a.getFullYear() === b.getFullYear() &&
    a.getMonth() === b.getMonth() &&
    a.getDate() === b.getDate()
  );
}
