# Monasterevin Community Portal

Phase 1: a static community news and alerts hub for Monasterevin residents. Verified council notices, traffic updates, events, and local announcements in one place.

## Features

- **Home** — Urgent banner + latest verified updates by category
- **News feed** — Filterable by category; toggle verified-only vs all community posts
- **Events calendar** — Month view + upcoming list (30 days)
- **Local directory** — Searchable trades & business listings at `/services`
- **Admin panel** — Browser-based editor at `/admin/` (GitHub token required)
- **About** — How to submit tips and what "verified" means

## Local development

Requirements: Node.js 18+ (20 recommended).

```bash
npm install
npm run dev
```

Open [http://localhost:4321](http://localhost:4321).

Build for production:

```bash
npm run build
npm run preview
```

## Configuration

Edit [`src/config.ts`](src/config.ts) to set your town name, site URL, and tip email.

Update `site` in [`astro.config.mjs`](astro.config.mjs) to match your production domain (used for Open Graph URLs).

## Content sources

| Source | Verified badge | How it gets published |
|--------|----------------|-------------------------|
| Hand-written Markdown in `src/content/news/` | Set per post by editors | Merge to `main` |
| Resident tips | After editor review | Email → editor creates Markdown post |

## Deploy

### GitHub Pages

This project deploys via GitHub Actions (not Jekyll). In repo **Settings → Pages**, set **Source** to **GitHub Actions**.

Live URL: `https://krypton-john.github.io/community-portal/`

Local preview with the same base path:

```bash
npm run build
npm run preview
# open http://localhost:4321/community-portal/
```

### Netlify

[`netlify.toml`](netlify.toml) is included. Connect your repo and deploy:

- Build command: `npm run build`
- Publish directory: `dist`

### Cloudflare Pages

[`wrangler.toml`](wrangler.toml) documents the Pages setup. In the Cloudflare dashboard:

- Framework preset: Astro
- Build command: `npm run build`
- Output directory: `dist`

## Editor workflow

See [CONTRIBUTING.md](CONTRIBUTING.md) for how to add posts, frontmatter rules, and verification policy.

Editors can also use the [admin panel](ADMIN.md) at `/admin/` to manage content in the browser.

## Roadmap

- **Phase 2** — API + admin UI
- **Phase 3** — Expand directory (reviews, availability, provider login)
- **Phase 4** — Community sharing / borrowing hub
