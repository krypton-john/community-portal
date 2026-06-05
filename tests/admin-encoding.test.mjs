import assert from 'node:assert/strict';
import test from 'node:test';

import { decodeBase64Utf8, encodeBase64Utf8 } from '../public/admin/encoding.js';

test('admin GitHub content encoding preserves non-ASCII text', () => {
  const original = 'Canal Café — Go n-éirí an t-ádh libh!';
  const githubContent = Buffer.from(original, 'utf8').toString('base64');

  const decoded = decodeBase64Utf8(githubContent);
  const savedContent = encodeBase64Utf8(decoded);
  const persisted = Buffer.from(savedContent, 'base64').toString('utf8');

  assert.equal(decoded, original);
  assert.equal(persisted, original);
});
