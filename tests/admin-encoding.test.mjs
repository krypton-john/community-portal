import assert from 'node:assert/strict';
import { test } from 'node:test';
import { decodeBase64Utf8, encodeBase64Utf8 } from '../public/admin/encoding.js';

test('admin content encoding preserves UTF-8 text', () => {
  const content = [
    'name: Canal Cafe',
    'title: "Water main repair - temporary supply disruption"',
    'Body: cafe notices, Irish text go n-eiri an t-adh libh, and emoji stay intact.',
    'Actual UTF-8: Canal Café - go n-éirí an t-ádh libh - 🚧',
  ].join('\n');

  const encoded = encodeBase64Utf8(content);

  assert.equal(decodeBase64Utf8(encoded), content);
});
