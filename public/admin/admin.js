import { decodeBase64Utf8, encodeBase64Utf8 } from './encoding.js';
import YAML from 'https://cdn.jsdelivr.net/npm/js-yaml@4.4.0/+esm';

const CONFIG = {
  owner: 'krypton-john',
  repo: 'community-portal',
  branch: 'main',
  paths: {
    news: 'src/content/news',
    services: 'src/content/services',
  },
};

const NEWS_CATEGORIES = [
  ['alert', 'Alert'],
  ['council', 'Council'],
  ['traffic', 'Traffic'],
  ['event', 'Event'],
  ['business', 'Business'],
  ['community', 'Community'],
];

const SERVICE_CATEGORIES = [
  ['plumber', 'Plumber'],
  ['electrician', 'Electrician'],
  ['builder', 'Builder'],
  ['gardener', 'Gardener'],
  ['mechanic', 'Mechanic'],
  ['childcare', 'Childcare'],
  ['cleaner', 'Cleaner'],
  ['painter', 'Painter'],
  ['roofer', 'Roofer'],
  ['cafe', 'Café & Food'],
  ['shop', 'Shop'],
  ['other', 'Other'],
];

const TOKEN_KEY = 'mcp_admin_token';

const state = {
  token: sessionStorage.getItem(TOKEN_KEY) ?? '',
  tab: 'news',
  items: [],
  editing: null,
  loading: false,
  message: null,
  messageType: 'info',
};

const root = document.getElementById('admin-root');

function escapeHtml(str) {
  return String(str)
    .replaceAll('&', '&amp;')
    .replaceAll('<', '&lt;')
    .replaceAll('>', '&gt;')
    .replaceAll('"', '&quot;');
}

function setMessage(text, type = 'info') {
  state.message = text;
  state.messageType = type;
  render();
}

async function githubFetch(path, options = {}) {
  const res = await fetch(`https://api.github.com${path}`, {
    ...options,
    headers: {
      Accept: 'application/vnd.github+json',
      Authorization: `Bearer ${state.token}`,
      'X-GitHub-Api-Version': '2022-11-28',
      ...(options.headers ?? {}),
    },
  });

  if (!res.ok) {
    const err = await res.json().catch(() => ({}));
    throw new Error(err.message ?? `GitHub API error (${res.status})`);
  }

  if (res.status === 204) return null;
  return res.json();
}

async function verifyToken() {
  await githubFetch('/user');
}

async function listFiles(path) {
  const data = await githubFetch(
    `/repos/${CONFIG.owner}/${CONFIG.repo}/contents/${path}?ref=${CONFIG.branch}`,
  );
  if (!Array.isArray(data)) return [];
  return data.filter((f) => f.type === 'file');
}

async function getFile(path) {
  const data = await githubFetch(
    `/repos/${CONFIG.owner}/${CONFIG.repo}/contents/${path}?ref=${CONFIG.branch}`,
  );
  const content = data.content ? decodeBase64Utf8(data.content) : '';
  return { ...data, decoded: content };
}

async function saveFile(path, content, message, sha) {
  const body = {
    message,
    content: encodeBase64Utf8(content),
    branch: CONFIG.branch,
  };
  if (sha) body.sha = sha;
  return githubFetch(`/repos/${CONFIG.owner}/${CONFIG.repo}/contents/${path}`, {
    method: 'PUT',
    body: JSON.stringify(body),
  });
}

async function deleteFile(path, sha, message) {
  return githubFetch(`/repos/${CONFIG.owner}/${CONFIG.repo}/contents/${path}`, {
    method: 'DELETE',
    body: JSON.stringify({ message, sha, branch: CONFIG.branch }),
  });
}

function parseMarkdownFile(raw) {
  const match = raw.match(/^---\r?\n([\s\S]*?)\r?\n---\r?\n([\s\S]*)$/);
  if (!match) return { data: {}, body: raw.trim() };
  const data = YAML.load(match[1]) ?? {};
  return { data, body: match[2].trim() };
}

function buildMarkdownFile(data, body) {
  const fm = { ...data };
  Object.keys(fm).forEach((k) => {
    if (fm[k] === '' || fm[k] == null) delete fm[k];
  });
  if (Array.isArray(fm.tags) && fm.tags.length === 0) fm.tags = [];
  return `---\n${YAML.dump(fm, { lineWidth: -1 })}---\n\n${body.trim()}\n`;
}

function parseYamlFile(raw) {
  return YAML.load(raw) ?? {};
}

function buildYamlFile(data) {
  const cleaned = { ...data };
  if (cleaned.social) {
    Object.keys(cleaned.social).forEach((k) => {
      if (!cleaned.social[k]) delete cleaned.social[k];
    });
    if (Object.keys(cleaned.social).length === 0) delete cleaned.social;
  }
  Object.keys(cleaned).forEach((k) => {
    if (cleaned[k] === '' || cleaned[k] == null) delete cleaned[k];
  });
  return YAML.dump(cleaned, { lineWidth: -1 });
}

function slugify(text) {
  return text
    .toLowerCase()
    .replace(/[^a-z0-9]+/g, '-')
    .replace(/^-|-$/g, '')
    .slice(0, 60);
}

function defaultNewsData() {
  const now = new Date().toISOString();
  return {
    title: '',
    permalink: '',
    publishedAt: now,
    category: 'community',
    urgent: false,
    verified: false,
    source: '',
    sourceUrl: '',
    location: '',
    tags: [],
    community: 'monasterevin',
  };
}

function defaultServiceData() {
  return {
    name: '',
    category: 'other',
    address: '',
    phone: '',
    email: '',
    website: '',
    social: { facebook: '', instagram: '', twitter: '', linkedin: '' },
    verified: false,
    description: '',
    community: 'monasterevin',
  };
}

async function loadItems() {
  state.loading = true;
  render();
  try {
    const path = state.tab === 'news' ? CONFIG.paths.news : CONFIG.paths.services;
    const files = await listFiles(path);
    state.items = files
      .filter((f) => !f.name.startsWith('.'))
      .map((f) => ({
        name: f.name,
        path: f.path,
        sha: f.sha,
      }))
      .sort((a, b) => a.name.localeCompare(b.name));
  } catch (err) {
    setMessage(err.message, 'error');
  } finally {
    state.loading = false;
    render();
  }
}

async function openEditor(item) {
  state.loading = true;
  render();
  try {
    const file = await getFile(item.path);
    if (state.tab === 'news') {
      const { data, body } = parseMarkdownFile(file.decoded);
      state.editing = {
        path: item.path,
        sha: file.sha,
        isNew: false,
        data: {
          ...defaultNewsData(),
          ...data,
          tags: Array.isArray(data.tags) ? data.tags : [],
          urgent: Boolean(data.urgent),
          verified: Boolean(data.verified),
        },
        body,
      };
    } else {
      const data = parseYamlFile(file.decoded);
      state.editing = {
        path: item.path,
        sha: file.sha,
        isNew: false,
        data: {
          ...defaultServiceData(),
          ...data,
          social: { ...defaultServiceData().social, ...(data.social ?? {}) },
          verified: Boolean(data.verified),
        },
      };
    }
  } catch (err) {
    setMessage(err.message, 'error');
  } finally {
    state.loading = false;
    render();
  }
}

function openNewEditor() {
  if (state.tab === 'news') {
    state.editing = {
      path: '',
      sha: null,
      isNew: true,
      data: defaultNewsData(),
      body: 'Write your post content here.\n',
    };
  } else {
    state.editing = {
      path: '',
      sha: null,
      isNew: true,
      data: defaultServiceData(),
    };
  }
  render();
}

function closeEditor() {
  state.editing = null;
  render();
}

function toIso(val) {
  if (!val) return undefined;
  try {
    return new Date(val).toISOString();
  } catch {
    return undefined;
  }
}

function readForm() {
  const form = document.getElementById('edit-form');
  if (!form) return null;

  if (state.tab === 'news') {
    const tagsRaw = form.querySelector('[name=tags]').value;
    const tags = tagsRaw
      .split(',')
      .map((t) => t.trim())
      .filter(Boolean);
    return {
      data: {
        title: form.querySelector('[name=title]').value.trim(),
        permalink: form.querySelector('[name=permalink]').value.trim(),
        publishedAt: toIso(form.querySelector('[name=publishedAt]').value),
        updatedAt: toIso(form.querySelector('[name=updatedAt]').value),
        category: form.querySelector('[name=category]').value,
        urgent: form.querySelector('[name=urgent]').checked,
        verified: form.querySelector('[name=verified]').checked,
        source: form.querySelector('[name=source]').value.trim(),
        sourceUrl: form.querySelector('[name=sourceUrl]').value.trim(),
        expiresAt: toIso(form.querySelector('[name=expiresAt]').value),
        eventStart: toIso(form.querySelector('[name=eventStart]').value),
        eventEnd: toIso(form.querySelector('[name=eventEnd]').value),
        location: form.querySelector('[name=location]').value.trim(),
        tags,
        community: 'monasterevin',
      },
      body: form.querySelector('[name=body]').value,
    };
  }

  return {
    data: {
      name: form.querySelector('[name=name]').value.trim(),
      category: form.querySelector('[name=category]').value,
      address: form.querySelector('[name=address]').value.trim(),
      phone: form.querySelector('[name=phone]').value.trim(),
      email: form.querySelector('[name=email]').value.trim(),
      website: form.querySelector('[name=website]').value.trim(),
      verified: form.querySelector('[name=verified]').checked,
      description: form.querySelector('[name=description]').value.trim(),
      community: 'monasterevin',
      social: {
        facebook: form.querySelector('[name=social_facebook]').value.trim(),
        instagram: form.querySelector('[name=social_instagram]').value.trim(),
        twitter: form.querySelector('[name=social_twitter]').value.trim(),
        linkedin: form.querySelector('[name=social_linkedin]').value.trim(),
      },
    },
  };
}

async function saveEditor() {
  const payload = readForm();
  if (!payload) return;

  if (state.tab === 'news' && !payload.data.title) {
    setMessage('Title is required.', 'error');
    return;
  }
  if (state.tab === 'services' && !payload.data.name) {
    setMessage('Business name is required.', 'error');
    return;
  }

  state.loading = true;
  render();

  try {
    let path = state.editing.path;
    let content;
    let message;

    if (state.tab === 'news') {
      const slug = payload.data.permalink || slugify(payload.data.title);
      payload.data.permalink = slug;
      if (!path) path = `${CONFIG.paths.news}/${slug}.md`;
      content = buildMarkdownFile(payload.data, payload.body);
      message = state.editing.isNew
        ? `Add news: ${payload.data.title}`
        : `Update news: ${payload.data.title}`;
    } else {
      const slug = state.editing.isNew
        ? slugify(payload.data.name)
        : state.editing.path.split('/').pop().replace('.yaml', '');
      if (!path) path = `${CONFIG.paths.services}/${slug}.yaml`;
      content = buildYamlFile(payload.data);
      message = state.editing.isNew
        ? `Add listing: ${payload.data.name}`
        : `Update listing: ${payload.data.name}`;
    }

    await saveFile(path, content, message, state.editing.sha);
    state.editing = null;
    setMessage('Saved! Site will rebuild in 1–2 minutes.', 'success');
    await loadItems();
  } catch (err) {
    state.loading = false;
    setMessage(err.message, 'error');
  }
}

async function removeItem(item) {
  if (!confirm(`Delete ${item.name}? This cannot be undone.`)) return;
  state.loading = true;
  render();
  try {
    await deleteFile(item.path, item.sha, `Remove ${item.name}`);
    setMessage('Deleted. Site will rebuild shortly.', 'success');
    await loadItems();
  } catch (err) {
    state.loading = false;
    setMessage(err.message, 'error');
  }
}

function connect(token) {
  state.token = token.trim();
  sessionStorage.setItem(TOKEN_KEY, state.token);
}

function disconnect() {
  state.token = '';
  sessionStorage.removeItem(TOKEN_KEY);
  state.items = [];
  state.editing = null;
  render();
}

function renderLogin() {
  return `
    <div class="mx-auto max-w-md rounded-xl border border-slate-200 bg-white p-8 shadow-sm">
      <h1 class="text-2xl font-bold text-slate-900">Site admin</h1>
      <p class="mt-2 text-sm text-slate-600">
        Sign in with a GitHub personal access token that can edit
        <strong>${CONFIG.owner}/${CONFIG.repo}</strong>.
      </p>
      <label class="mt-6 block text-sm font-medium text-slate-700">GitHub token</label>
      <input id="token-input" type="password" placeholder="ghp_…"
        class="mt-1 w-full rounded-lg border border-slate-300 px-4 py-2.5 text-sm" />
      <button id="connect-btn"
        class="mt-4 w-full rounded-lg bg-blue-600 px-4 py-2.5 text-sm font-medium text-white hover:bg-blue-700">
        Connect
      </button>
      <p class="mt-4 text-xs text-slate-500">
        Create a token at
        <a class="text-blue-600 underline" href="https://github.com/settings/tokens" target="_blank" rel="noopener">github.com/settings/tokens</a>
        with <strong>repo</strong> scope. Stored in this browser session only.
      </p>
      <p class="mt-2 text-xs text-slate-500">
        See <a class="text-blue-600 underline" href="../ADMIN.md">ADMIN.md</a> for full setup steps.
      </p>
    </div>`;
}

function field(label, name, value, type = 'text', extra = '') {
  const v = escapeHtml(value ?? '');
  if (type === 'checkbox') {
    return `<label class="flex items-center gap-2 text-sm">
      <input type="checkbox" name="${name}" ${value ? 'checked' : ''} class="rounded" />
      ${label}
    </label>`;
  }
  if (type === 'textarea') {
    return `<label class="block text-sm font-medium text-slate-700">${label}
      <textarea name="${name}" rows="4" class="mt-1 w-full rounded-lg border border-slate-300 px-3 py-2 text-sm">${v}</textarea>
    </label>`;
  }
  if (type === 'select') {
    const options = extra
      .map(([val, lab]) => `<option value="${val}" ${val === value ? 'selected' : ''}>${lab}</option>`)
      .join('');
    return `<label class="block text-sm font-medium text-slate-700">${label}
      <select name="${name}" class="mt-1 w-full rounded-lg border border-slate-300 px-3 py-2 text-sm">${options}</select>
    </label>`;
  }
  return `<label class="block text-sm font-medium text-slate-700">${label}
    <input type="${type}" name="${name}" value="${v}" class="mt-1 w-full rounded-lg border border-slate-300 px-3 py-2 text-sm" />
  </label>`;
}

function formatDatetimeLocal(val) {
  if (!val) return '';
  try {
    const d = new Date(val);
    const pad = (n) => String(n).padStart(2, '0');
    return `${d.getFullYear()}-${pad(d.getMonth() + 1)}-${pad(d.getDate())}T${pad(d.getHours())}:${pad(d.getMinutes())}`;
  } catch {
    return '';
  }
}

function renderNewsForm(editing) {
  const d = editing.data;
  return `
    <form id="edit-form" class="grid gap-4 sm:grid-cols-2">
      ${field('Title', 'title', d.title)}
      ${field('Permalink (URL slug)', 'permalink', d.permalink)}
      ${field('Published at', 'publishedAt', formatDatetimeLocal(d.publishedAt), 'datetime-local')}
      ${field('Updated at', 'updatedAt', formatDatetimeLocal(d.updatedAt), 'datetime-local')}
      ${field('Category', 'category', d.category, 'select', NEWS_CATEGORIES)}
      ${field('Source', 'source', d.source)}
      ${field('Source URL', 'sourceUrl', d.sourceUrl)}
      ${field('Location', 'location', d.location)}
      ${field('Expires at', 'expiresAt', formatDatetimeLocal(d.expiresAt), 'datetime-local')}
      ${field('Event start', 'eventStart', formatDatetimeLocal(d.eventStart), 'datetime-local')}
      ${field('Event end', 'eventEnd', formatDatetimeLocal(d.eventEnd), 'datetime-local')}
      ${field('Tags (comma-separated)', 'tags', (d.tags ?? []).join(', '))}
      <div class="flex flex-col gap-2 sm:col-span-2 sm:flex-row">
        ${field('Urgent alert', 'urgent', d.urgent, 'checkbox')}
        ${field('Verified', 'verified', d.verified, 'checkbox')}
      </div>
      ${field('Body (Markdown)', 'body', editing.body, 'textarea')}
    </form>`;
}

function renderServiceForm(editing) {
  const d = editing.data;
  const s = d.social ?? {};
  return `
    <form id="edit-form" class="grid gap-4 sm:grid-cols-2">
      ${field('Business name', 'name', d.name)}
      ${field('Category', 'category', d.category, 'select', SERVICE_CATEGORIES)}
      ${field('Address', 'address', d.address)}
      ${field('Phone', 'phone', d.phone)}
      ${field('Email', 'email', d.email, 'email')}
      ${field('Website', 'website', d.website, 'url')}
      ${field('Description', 'description', d.description, 'textarea')}
      ${field('Facebook URL', 'social_facebook', s.facebook, 'url')}
      ${field('Instagram URL', 'social_instagram', s.instagram, 'url')}
      ${field('X / Twitter URL', 'social_twitter', s.twitter, 'url')}
      ${field('LinkedIn URL', 'social_linkedin', s.linkedin, 'url')}
      <div class="sm:col-span-2">${field('Verified listing', 'verified', d.verified, 'checkbox')}</div>
    </form>`;
}

function renderEditor() {
  const e = state.editing;
  const title = e.isNew
    ? state.tab === 'news'
      ? 'New post'
      : 'New listing'
    : `Edit ${e.path.split('/').pop()}`;

  return `
    <div class="rounded-xl border border-slate-200 bg-white p-6 shadow-sm">
      <div class="mb-4 flex items-center justify-between">
        <h2 class="text-lg font-semibold">${title}</h2>
        <button id="close-editor" class="text-sm text-slate-500 hover:text-slate-800">Close</button>
      </div>
      ${state.tab === 'news' ? renderNewsForm(e) : renderServiceForm(e)}
      <div class="mt-6 flex gap-3">
        <button id="save-btn" class="rounded-lg bg-blue-600 px-4 py-2 text-sm font-medium text-white hover:bg-blue-700">Save to GitHub</button>
        <button id="cancel-btn" class="rounded-lg border border-slate-300 px-4 py-2 text-sm hover:bg-slate-50">Cancel</button>
      </div>
    </div>`;
}

function renderDashboard() {
  const tabClass = (t) =>
    state.tab === t
      ? 'border-b-2 border-blue-600 text-blue-700'
      : 'border-b-2 border-transparent text-slate-500 hover:text-slate-800';

  const rows = state.items
    .map(
      (item) => `
      <tr class="border-t border-slate-100">
        <td class="px-4 py-3 font-medium">${escapeHtml(item.name)}</td>
        <td class="px-4 py-3 text-right">
          <button data-edit="${escapeHtml(item.path)}" data-sha="${item.sha}" data-name="${escapeHtml(item.name)}"
            class="text-sm text-blue-600 hover:underline">Edit</button>
          <button data-delete="${escapeHtml(item.path)}" data-sha="${item.sha}" data-name="${escapeHtml(item.name)}"
            class="ml-3 text-sm text-red-600 hover:underline">Delete</button>
        </td>
      </tr>`,
    )
    .join('');

  return `
    <header class="mb-6 flex flex-wrap items-center justify-between gap-4">
      <div>
        <h1 class="text-2xl font-bold">Monasterevin admin</h1>
        <p class="text-sm text-slate-600">${CONFIG.owner}/${CONFIG.repo} · changes commit to <strong>${CONFIG.branch}</strong></p>
      </div>
      <button id="disconnect-btn" class="text-sm text-slate-500 hover:text-slate-800">Sign out</button>
    </header>

    ${state.message ? `<div class="mb-4 rounded-lg px-4 py-3 text-sm ${state.messageType === 'error' ? 'bg-red-50 text-red-800' : state.messageType === 'success' ? 'bg-green-50 text-green-800' : 'bg-blue-50 text-blue-800'}">${escapeHtml(state.message)}</div>` : ''}

    <nav class="mb-6 flex gap-6 border-b border-slate-200">
      <button data-tab="news" class="pb-2 text-sm font-medium ${tabClass('news')}">News posts</button>
      <button data-tab="services" class="pb-2 text-sm font-medium ${tabClass('services')}">Directory listings</button>
    </nav>

    ${state.editing ? renderEditor() : `
      <div class="rounded-xl border border-slate-200 bg-white shadow-sm">
        <div class="flex items-center justify-between border-b border-slate-100 px-4 py-3">
          <p class="text-sm text-slate-600">${state.loading ? 'Loading…' : `${state.items.length} file(s)`}</p>
          <button id="new-btn" class="rounded-lg bg-blue-600 px-3 py-1.5 text-sm font-medium text-white hover:bg-blue-700">+ New</button>
        </div>
        <table class="w-full text-left text-sm">
          <tbody>${rows || '<tr><td class="px-4 py-8 text-slate-500" colspan="2">No items yet.</td></tr>'}</tbody>
        </table>
      </div>
    `}`;
}

function render() {
  root.innerHTML = state.token ? renderDashboard() : renderLogin();
  bindEvents();
}

function bindEvents() {
  document.getElementById('connect-btn')?.addEventListener('click', async () => {
    const input = document.getElementById('token-input');
    connect(input.value);
    state.loading = true;
    render();
    try {
      await verifyToken();
      setMessage('Connected.', 'success');
      await loadItems();
    } catch (err) {
      disconnect();
      setMessage(err.message, 'error');
    }
  });

  document.getElementById('disconnect-btn')?.addEventListener('click', disconnect);

  document.querySelectorAll('[data-tab]').forEach((btn) => {
    btn.addEventListener('click', async () => {
      state.tab = btn.dataset.tab;
      state.editing = null;
      state.message = null;
      await loadItems();
    });
  });

  document.getElementById('new-btn')?.addEventListener('click', openNewEditor);
  document.getElementById('close-editor')?.addEventListener('click', closeEditor);
  document.getElementById('cancel-btn')?.addEventListener('click', closeEditor);
  document.getElementById('save-btn')?.addEventListener('click', saveEditor);

  document.querySelectorAll('[data-edit]').forEach((btn) => {
    btn.addEventListener('click', () =>
      openEditor({ path: btn.dataset.edit, sha: btn.dataset.sha, name: btn.dataset.name }),
    );
  });

  document.querySelectorAll('[data-delete]').forEach((btn) => {
    btn.addEventListener('click', () =>
      removeItem({ path: btn.dataset.delete, sha: btn.dataset.sha, name: btn.dataset.name }),
    );
  });
}

async function init() {
  if (state.token) {
    try {
      await verifyToken();
      await loadItems();
    } catch {
      disconnect();
    }
  } else {
    render();
  }
}

init();
