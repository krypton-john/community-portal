#!/usr/bin/env node
/**
 * Build-time council RSS ingest script.
 *
 * Usage:
 *   COUNCIL_RSS_URL=https://example.com/feed.xml npm run ingest:rss
 *
 * Writes normalized Markdown stubs to src/content/news/ingested/
 * Run before `npm run build` or schedule via Netlify/Cloudflare cron.
 */

import { mkdir, writeFile } from 'node:fs/promises';
import { createHash } from 'node:crypto';
import path from 'node:path';
import { fileURLToPath } from 'node:url';

const __dirname = path.dirname(fileURLToPath(import.meta.url));
const OUT_DIR = path.join(__dirname, '../src/content/news/ingested');

const RSS_URL = process.env.COUNCIL_RSS_URL;

function slugify(text) {
  return text
    .toLowerCase()
    .replace(/[^a-z0-9]+/g, '-')
    .replace(/^-|-$/g, '')
    .slice(0, 80);
}

function stripHtml(html) {
  return html.replace(/<[^>]+>/g, '').replace(/\s+/g, ' ').trim();
}

function parseRssItems(xml) {
  const items = [];
  const itemRegex = /<item>([\s\S]*?)<\/item>/gi;
  let match;

  while ((match = itemRegex.exec(xml)) !== null) {
    const block = match[1];
    const get = (tag) => {
      const m = block.match(new RegExp(`<${tag}[^>]*>([\\s\\S]*?)<\\/${tag}>`, 'i'));
      return m ? stripHtml(m[1]) : '';
    };

    const title = get('title');
    if (!title) continue;

    items.push({
      title,
      link: get('link'),
      pubDate: get('pubDate') || get('published') || new Date().toISOString(),
      description: get('description') || get('summary') || '',
    });
  }

  return items;
}

function toMarkdown(item) {
  const hash = createHash('sha256').update(item.link || item.title).digest('hex').slice(0, 12);
  const slug = `ingested-${slugify(item.title)}-${hash}`;
  const pubDate = new Date(item.pubDate);

  const frontmatter = `---
title: ${JSON.stringify(item.title)}
permalink: ${JSON.stringify(slug)}
publishedAt: ${pubDate.toISOString()}
category: council
urgent: false
verified: true
source: "Riverside Town Council (RSS)"
sourceUrl: ${JSON.stringify(item.link || '')}
tags: ["ingested", "council"]
community: riverside
---

${item.description || 'See the official source for full details.'}

[Read on the council website](${item.link || '#'})
`;

  return { slug, content: frontmatter };
}

async function main() {
  if (!RSS_URL) {
    console.log('COUNCIL_RSS_URL not set — skipping RSS ingest.');
    console.log('Set COUNCIL_RSS_URL to your council feed URL to enable ingest.');
    process.exit(0);
  }

  console.log(`Fetching ${RSS_URL}...`);
  const response = await fetch(RSS_URL);

  if (!response.ok) {
    throw new Error(`RSS fetch failed: ${response.status} ${response.statusText}`);
  }

  const xml = await response.text();
  const items = parseRssItems(xml);

  if (items.length === 0) {
    console.log('No RSS items found.');
    process.exit(0);
  }

  await mkdir(OUT_DIR, { recursive: true });

  let written = 0;
  for (const item of items.slice(0, 20)) {
    const { slug, content } = toMarkdown(item);
    const filePath = path.join(OUT_DIR, `${slug}.md`);
    await writeFile(filePath, content, 'utf8');
    written++;
  }

  console.log(`Wrote ${written} ingested posts to ${OUT_DIR}`);
}

main().catch((err) => {
  console.error(err);
  process.exit(1);
});
