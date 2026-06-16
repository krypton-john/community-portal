import { defineConfig } from 'astro/config';
import tailwind from '@astrojs/tailwind';
import rehypeSanitize from 'rehype-sanitize';

export default defineConfig({
  site: 'https://krypton-john.github.io',
  base: '/community-portal',
  integrations: [tailwind()],
  markdown: {
    rehypePlugins: [rehypeSanitize],
  },
});
