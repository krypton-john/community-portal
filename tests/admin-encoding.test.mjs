import assert from 'node:assert/strict';
import { Buffer } from 'node:buffer';
import { decodeBase64Utf8, encodeBase64Utf8 } from '../public/admin/encoding.js';

if (!globalThis.atob) {
  globalThis.atob = (value) => Buffer.from(value, 'base64').toString('binary');
}

if (!globalThis.btoa) {
  globalThis.btoa = (value) => Buffer.from(value, 'binary').toString('base64');
}

const content = [
  'name: Canal Caf\u00e9',
  'category: cafe',
  'description: Monasterevin\u2019s riverside caf\u00e9 serving tea, scones, and lunch.',
  'body: Community fair \u2013 Saturday at 10:30.',
].join('\n');

const expectedBase64 = Buffer.from(content, 'utf8').toString('base64');
const wrappedBase64 = expectedBase64.replace(/(.{24})/g, '$1\n');

assert.equal(decodeBase64Utf8(wrappedBase64), content);
assert.equal(encodeBase64Utf8(content), expectedBase64);
