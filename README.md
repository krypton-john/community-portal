# Monasterevin Community Portal

Phase 1: a static community news and alerts hub for Monasterevin residents. Verified council notices, traffic updates, events, and local announcements in one place.

## Features

- **Home** — Urgent banner + latest verified updates by category
- **News feed** — Filterable by category; toggle verified-only vs all community posts
- **Events calendar** — Month view + upcoming list (30 days)
- **RSS** — Site-wide feed at `/feed.xml` and alerts feed at `/feed/alerts.xml`
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

Edit [`src/config.ts`](src/config.ts) to set your town name, site URL, tip email, and optional council RSS URL.

Update `site` in [`astro.config.mjs`](astro.config.mjs) to match your production domain (used for RSS and Open Graph URLs).

## Content sources

| Source | Verified badge | How it gets published |
|--------|----------------|-------------------------|
| Hand-written Markdown in `src/content/news/` | Set per post by editors | PR merge to `main` |
| Council RSS ingest | Always verified | `npm run ingest:rss` before build (optional cron) |
| Resident tips | After editor review | Email → editor creates Markdown post |

## Optional: council RSS ingest

```bash
COUNCIL_RSS_URL=https://your-council.gov.uk/feed.xml npm run ingest:rss
npm run build
```

Schedule this on your host (see deploy configs below) to refresh ingested notices automatically.

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

For RSS ingest on a schedule, enable Netlify scheduled builds or use the included GitHub Action.

### Cloudflare Pages

[`wrangler.toml`](wrangler.toml) documents the Pages setup. In the Cloudflare dashboard:

- Framework preset: Astro
- Build command: `npm run build`
- Output directory: `dist`

Use Cloudflare Cron Triggers or GitHub Actions to run ingest + rebuild periodically.

## Editor workflow

See [CONTRIBUTING.md](CONTRIBUTING.md) for how to add posts, frontmatter rules, and verification policy.

## Roadmap

- **Phase 2** — API + admin UI
- **Phase 3** — Local services & trades directory
- **Phase 4** — Community sharing / borrowing hub
# community-portal
# community-portal
# community-portal
