# Contributing — publishing community news

This site is a static Astro project. Posts are Markdown files in `src/content/news/`. Publishing is done by merging to `main`, which triggers a deploy.

## Quick start: add a new post

1. Copy [`templates/post-template.md`](templates/post-template.md) to `src/content/news/your-slug.md`
2. Fill in the frontmatter (see rules below)
3. Write the body in Markdown
4. Open a pull request (or ask an editor to merge)

Local preview:

```bash
npm install
npm run dev
```

## Frontmatter fields

| Field | Required | Description |
|-------|----------|-------------|
| `title` | Yes | Headline shown on the site |
| `permalink` | Recommended | URL slug (`/news/your-slug`). Defaults to filename if omitted |
| `publishedAt` | Yes | ISO 8601 datetime, e.g. `2026-05-31T09:00:00Z` |
| `updatedAt` | No | Set when you revise a post |
| `category` | Yes | One of: `alert`, `council`, `traffic`, `event`, `business`, `community` |
| `urgent` | No | `true` pins to home banner for 48 hours (if not expired) |
| `verified` | No | `true` only for official or editor-approved posts |
| `source` | Yes | Attribution, e.g. "Kildare County Council" or "Irish Water" |
| `sourceUrl` | No | Link to official page |
| `expiresAt` | No | Post hidden from lists after this time (detail page shows "ended") |
| `eventStart` / `eventEnd` | For events | ISO datetimes for calendar |
| `location` | No | Human-readable place |
| `tags` | No | Array of strings |
| `community` | No | Defaults to `monasterevin` |

## Verification rules

- Set `verified: true` **only** for:
  - Official council, police, school, or utility notices
  - Posts an editor has fact-checked
- Resident tips: leave `verified: false` until an editor reviews
- Always include `source` and accurate `publishedAt` / `updatedAt` times

## Categories

- **alert** — Urgent town-wide notices (often paired with `urgent: true`)
- **council** — Official council business and notices
- **traffic** — Road closures, diversions, parking
- **event** — Community events (set `eventStart` for calendar)
- **business** — Openings, closures, local business news
- **community** — General community updates

## Local directory listings

Business and trades listings live in `src/content/services/` as YAML files.

1. Copy [`templates/service-template.yaml`](templates/service-template.yaml) to `src/content/services/your-business.yaml`
2. Fill in name, category, address, phone, website, and social links
3. Set `verified: true` only after an editor has confirmed the details
4. Merge to `main` to publish

| Field | Required | Description |
|-------|----------|-------------|
| `name` | Yes | Business or tradesperson name |
| `category` | Yes | e.g. `plumber`, `electrician`, `mechanic`, `cafe`, `shop` (see template) |
| `address` | Yes | Full address |
| `phone` | No | Contact number |
| `website` | No | Business website URL |
| `social` | No | `facebook`, `instagram`, `twitter`, `linkedin` URLs |
| `verified` | No | Editor-approved listing |
| `description` | No | Short note on services offered |

## Deploy workflow

1. Editor reviews PR
2. Merge to `main`
3. Netlify or Cloudflare Pages runs `npm run build` and publishes `dist/`

See [README.md](README.md) for hosting setup.
