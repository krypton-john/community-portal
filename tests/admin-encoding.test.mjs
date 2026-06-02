import assert from 'node:assert/strict';

import {
  decodeBase64Content,
  encodeBase64Content,
} from '../public/admin/encoding.js';

const samples = [
  'name: Canal Café\ncategory: cafe\ndescription: Coffee by the canal.\n',
  `---
title: "New café opens on Main Street"
tags: ["café", "community"]
---

Opening weekend is 7-8 June.
`,
];

for (const sample of samples) {
  const encoded = encodeBase64Content(sample);
  const decoded = decodeBase64Content(encoded);

  assert.equal(decoded, sample);
  assert.ok(!decoded.includes('CafÃ©'));
}

console.log('Admin UTF-8 content encoding round-trip passed.');
