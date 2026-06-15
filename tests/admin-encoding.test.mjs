import assert from 'node:assert/strict';
import { test } from 'node:test';

import { decodeBase64Utf8, encodeBase64Utf8 } from '../public/admin/encoding.js';

test('decodes GitHub base64 content as UTF-8', () => {
  const base64 = Buffer.from('name: Canal Café\n', 'utf8').toString('base64');

  assert.equal(decodeBase64Utf8(base64), 'name: Canal Café\n');
});

test('round-trips admin content without corrupting Unicode', () => {
  const content = [
    '---',
    'title: "New café opens on Main Street"',
    'tags: ["café", "opening"]',
    '---',
    '',
    'Hours: Mon-Sat 7:30-17:00. Go n-éirí an t-ádh libh!',
    '',
  ].join('\n');

  assert.equal(decodeBase64Utf8(encodeBase64Utf8(content)), content);
});

test('ignores GitHub API base64 line wrapping', () => {
  const base64 = Buffer.from('Café & Food\n', 'utf8').toString('base64');
  const wrapped = base64.match(/.{1,4}/g).join('\n');

  assert.equal(decodeBase64Utf8(wrapped), 'Café & Food\n');
});
