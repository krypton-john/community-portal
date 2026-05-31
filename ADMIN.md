# Site admin guide

The admin panel lets editors manage **news posts** and **directory listings** in the browser. Changes are saved directly to GitHub and the site rebuilds automatically.

**Admin URL:** `https://krypton-john.github.io/community-portal/admin/`

Local preview: `http://localhost:4321/community-portal/admin/` (after `npm run build && npm run preview`)

---

## One-time setup: GitHub token

Each editor needs a [Personal Access Token](https://github.com/settings/tokens):

### Classic token (simplest)

1. Go to **Settings → Developer settings → Personal access tokens → Tokens (classic)**
2. **Generate new token (classic)**
3. Name: `Monasterevin portal admin`
4. Expiration: 90 days (or longer)
5. Scope: check **`repo`** (full control of private repositories)
6. Generate and **copy the token** (`ghp_…`)

### Fine-grained token (more secure)

1. **Settings → Developer settings → Personal access tokens → Fine-grained tokens**
2. Repository access: **Only select repositories** → `community-portal`
3. Permissions → **Contents**: Read and write
4. Generate and copy the token

---

## Using the admin

1. Open `/admin/`
2. Paste your token and click **Connect**
3. Choose **News posts** or **Directory listings**
4. Click **+ New** or **Edit** on an existing item
5. Fill in the form and click **Save to GitHub**
6. Wait 1–2 minutes for GitHub Actions to rebuild the live site

The token is stored in your **browser session only** (cleared when you close the tab or click Sign out).

---

## What gets updated

| Tab | Files | Live page |
|-----|-------|-----------|
| News posts | `src/content/news/*.md` | `/news/` |
| Directory | `src/content/services/*.yaml` | `/services/` |

Every save creates a commit on the `main` branch, which triggers the **Deploy to GitHub Pages** workflow.

---

## Tips

- Set **Verified** only for official or editor-checked content
- Use **Permalink** on news posts to control the URL slug
- For events, fill in **Event start** so they appear on the calendar
- Mark urgent posts with **Urgent alert** for the home page banner

---

## Troubleshooting

| Problem | Fix |
|---------|-----|
| "Bad credentials" | Token expired or wrong — create a new one |
| "Resource not accessible" | Token needs `repo` scope or Contents write |
| Changes not on site | Check **Actions** tab on GitHub — deploy may still be running |
| Admin page blank | Hard-refresh; ensure you're on `/community-portal/admin/` |

---

## Security notes

- Do **not** share your token
- Only give tokens to trusted editors
- Use fine-grained tokens with minimal permissions when possible
- The admin page is not linked in public navigation — share the URL only with editors
