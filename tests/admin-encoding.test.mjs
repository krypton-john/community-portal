import assert from 'node:assert/strict';
import test from 'node:test';

import { decodeBase64Content, encodeBase64Content } from '../public/admin/encoding.js';

test('admin content encoding preserves UTF-8 characters', () => {
  const content = `---
title: "Water main repair — temporary supply disruption"
category: alert
source: "Café community notice"
tags: ["utilities", "Monasterevín"]
---

Emergency repairs affect Dublin Street, Monasterevin. Editor note: don't garble “smart quotes”.
`;

  const encoded = encodeBase64Content(content);
  const withGitHubLineWraps = encoded.match(/.{1,60}/g).join('\n');

  assert.equal(decodeBase64Content(withGitHubLineWraps), content);
});
