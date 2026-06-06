import assert from 'node:assert/strict';
import test from 'node:test';
import { decodeBase64Content, encodeBase64Content } from '../public/admin/encoding.js';

test('admin base64 helpers preserve UTF-8 content from GitHub', () => {
  const content = [
    'name: Canal Café',
    'description: Go n-éirí an t-ádh libh!',
    'body: Students — parents – neighbours',
  ].join('\n');
  const githubContent = Buffer.from(content, 'utf8').toString('base64').replace(/(.{20})/g, '$1\n');

  assert.equal(decodeBase64Content(githubContent), content);
  assert.equal(Buffer.from(encodeBase64Content(content), 'base64').toString('utf8'), content);
});
