# Site admin guide

The admin panel lets editors manage **news posts** and **directory listings** in the browser. Changes are saved directly to GitHub and the site rebuilds automatically.

**Admin URL:** `https://krypton-john.github.io/community-portal/admin/`

---

## One-time setup: GitHub token

Each editor needs a [Personal Access Token](https://github.com/settings/tokens):

### Classic token (simplest)

1. Go to **Settings → Developer settings → Personal access tokens → Tokens (classic)**
2. **Generate new token (classic)**
3. Name: `Monasterevin portal admin`
4. Scope: check **`repo`**
5. Copy the token (`ghp_…`)

### Fine-grained token (more secure)

1. **Fine-grained tokens** → repository `community-portal`
2. **Contents**: Read and write

---

## Using the admin

1. Open `/admin/`
2. Paste your token → **Connect**
3. Choose **News posts** or **Directory listings**
4. **+ New** or **Edit** → **Save to GitHub**
5. Wait 1–2 minutes for the site to rebuild

---

## Troubleshooting

| Problem | Fix |
|---------|-----|
| Bad credentials | Create a new token |
| Resource not accessible | Token needs repo / Contents write |
| Changes not live | Check GitHub **Actions** tab |

Token is stored in your browser session only. Do not share it.
