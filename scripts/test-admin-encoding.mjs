import assert from 'node:assert/strict';

import { decodeBase64Utf8, encodeBase64Utf8 } from '../public/admin/encoding.js';

const samples = [
  'Canal Café\nMain Street, Monasterevin\n',
  'title: "Café opening in Monasterevin"\ntags:\n  - fáilte\n',
  '---\ntitle: "Summer fair – June 2026"\n---\n\nBring reusable cups ☕\n',
];

for (const sample of samples) {
  assert.equal(decodeBase64Utf8(encodeBase64Utf8(sample)), sample);
}

const wrapped = encodeBase64Utf8(samples.join('\n')).replace(/(.{20})/g, '$1\n');
assert.equal(decodeBase64Utf8(wrapped), samples.join('\n'));

console.log('Admin encoding round-trip tests passed.');
