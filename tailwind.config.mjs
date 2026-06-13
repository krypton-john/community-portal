/** @type {import('tailwindcss').Config} */
export default {
  content: ['./src/**/*.{astro,html,js,jsx,md,mdx,svelte,ts,tsx,vue}', './public/admin/admin.js'],
  theme: {
    extend: {
      colors: {
        community: {
          teal: '#1a7f6e',
          'teal-dark': '#145c50',
          'teal-light': '#e8f5f2',
          coral: '#e85d4c',
          'coral-dark': '#c94a3a',
          gold: '#f4b942',
          'gold-light': '#fef6e4',
          cream: '#faf8f4',
          navy: '#1e293b',
        },
        brand: {
          50: '#e8f5f2',
          100: '#cceee6',
          500: '#1a7f6e',
          600: '#145c50',
          700: '#0f4a40',
          900: '#0a332c',
        },
      },
      fontFamily: {
        sans: ['"DM Sans"', 'system-ui', 'sans-serif'],
        display: ['"Fraunces"', 'Georgia', 'serif'],
      },
    },
  },
  plugins: [],
};
