import rss from '@astrojs/rss';
import { getCollection } from 'astro:content';
import { siteConfig } from '../../config';
import { filterActivePosts, getSlug, sortByPublishedDesc } from '../../utils/posts';

export async function GET(context: { site: string | undefined }) {
  const posts = filterActivePosts(
    (await getCollection('news'))
      .filter(
        (post) =>
          post.data.urgent ||
          post.data.category === 'alert' ||
          post.data.category === 'council',
      )
      .sort(sortByPublishedDesc),
  ).slice(0, 50);

  return rss({
    title: `${siteConfig.name} — Alerts & Council`,
    description: 'Urgent alerts and official council notices for Riverside.',
    site: context.site ?? siteConfig.url,
    items: posts.map((post) => ({
      title: post.data.title,
      pubDate: post.data.publishedAt,
      description: `${post.data.source} — ${post.data.category}`,
      link: `/news/${getSlug(post)}/`,
      categories: [post.data.category],
    })),
    customData: `<language>en-gb</language>`,
  });
}
