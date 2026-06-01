import assert from 'node:assert/strict';
import test from 'node:test';

import { decodeBase64Content, encodeBase64Content } from '../public/admin/encoding.js';

test('admin GitHub content encoding preserves UTF-8 characters', () => {
  const content = [
    'name: Canal Café',
    'description: Fresh pastries, tea, and local notices — open daily.',
    'body: Ní neart go cur le chéile',
    '',
  ].join('\n');

  const expectedBase64 = Buffer.from(content, 'utf8').toString('base64');

  assert.equal(encodeBase64Content(content), expectedBase64);
  assert.equal(decodeBase64Content(expectedBase64), content);
  assert.equal(decodeBase64Content(`${expectedBase64.slice(0, 12)}\n${expectedBase64.slice(12)}`), content);
});
