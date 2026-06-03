import assert from 'node:assert/strict';
import {
  decodeBase64Utf8,
  encodeBase64Utf8,
} from '../public/admin/encoding.js';

const samples = [
  'Cafe',
  'Café & Food',
  'Emergency repairs — store drinking water if you are able',
  "You've worked hard — Go n-éirí an t-ádh libh!",
  `---
title: "Best of luck to our Leaving & Junior Cert students!"
---

This week's update includes Café listings, em dashes — and Irish text.`,
];

for (const sample of samples) {
  const encoded = encodeBase64Utf8(sample);
  assert.equal(decodeBase64Utf8(encoded), sample);

  const wrapped = encoded.match(/.{1,16}/g)?.join('\n') ?? encoded;
  assert.equal(decodeBase64Utf8(wrapped), sample);
}

const nonAsciiSample = 'Café — Go n-éirí an t-ádh libh!';
const encodedNonAscii = encodeBase64Utf8(nonAsciiSample);
assert.notEqual(
  atob(encodedNonAscii),
  nonAsciiSample,
  'Raw atob output is UTF-8 bytes and must not be used as editor text',
);
assert.equal(decodeBase64Utf8(encodedNonAscii), nonAsciiSample);

console.log('Admin UTF-8 encoding regression checks passed.');
