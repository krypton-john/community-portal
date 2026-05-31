import { defineConfig } from 'astro/config';
import tailwind from '@astrojs/tailwind';

export default defineConfig({
  site: 'https://community-portal.example.com',
  integrations: [tailwind()],
});
