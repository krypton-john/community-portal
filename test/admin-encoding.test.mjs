import assert from 'node:assert/strict';
import { describe, it } from 'node:test';

import { decodeBase64Content, encodeBase64Content } from '../public/admin/encoding.js';

describe('admin file encoding', () => {
  it('decodes GitHub base64 content as UTF-8 text', () => {
    const content = 'Go n-éirí an t-ádh libh! Café 🚲';
    const base64 = Buffer.from(content, 'utf8').toString('base64');
    const wrappedBase64 = `${base64.slice(0, 12)}\n${base64.slice(12)}`;

    assert.equal(decodeBase64Content(wrappedBase64), content);
  });

  it('encodes admin saves as UTF-8 base64', () => {
    const content = 'Monasterevin & surrounding area — Go n-éirí an t-ádh libh!';
    const encoded = encodeBase64Content(content);

    assert.equal(Buffer.from(encoded, 'base64').toString('utf8'), content);
  });

  it('round-trips longer content without corrupting multibyte characters', () => {
    const content = Array.from({ length: 3000 }, (_, i) => `Line ${i}: t-ádh Café 🚲`).join('\n');

    assert.equal(decodeBase64Content(encodeBase64Content(content)), content);
  });
});
