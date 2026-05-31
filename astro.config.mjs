import { defineConfig } from 'astro/config';
import tailwind from '@astrojs/tailwind';

export default defineConfig({
  site: 'https://krypton-john.github.io',
  base: '/community-portal',
  integrations: [tailwind()],
});
