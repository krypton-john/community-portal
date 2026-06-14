import assert from 'node:assert/strict';
import test from 'node:test';

import { decodeBase64Utf8, encodeBase64Utf8 } from '../public/admin/content-encoding.js';

test('admin content encoding round-trips UTF-8 content', () => {
  const content = [
    'name: Canal Café',
    'title: "Water main repair — temporary supply disruption"',
    'Go n-éirí an t-ádh libh!',
  ].join('\n');

  assert.equal(decodeBase64Utf8(encodeBase64Utf8(content)), content);
});

test('admin content decoding handles GitHub line-wrapped base64', () => {
  const encoded = encodeBase64Utf8('tags: ["café", "opening"]');
  const wrapped = `${encoded.slice(0, 8)}\n${encoded.slice(8)}`;

  assert.equal(decodeBase64Utf8(wrapped), 'tags: ["café", "opening"]');
});
