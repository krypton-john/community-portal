import assert from 'node:assert/strict';
import { describe, it } from 'node:test';

import { resolveSlug, slugify } from '../public/admin/slug.js';

describe('admin slug helpers', () => {
  it('keeps normal URL slugs unchanged', () => {
    assert.equal(slugify('main-street-closure-may-2026'), 'main-street-closure-may-2026');
  });

  it('normalizes path-like permalink input to a single safe segment', () => {
    assert.equal(resolveSlug('../bad'), 'bad');
    assert.equal(resolveSlug('../../package.json'), 'package-json');
    assert.equal(resolveSlug('Events/June Fair'), 'events-june-fair');
  });

  it('falls back to the title and detects empty generated slugs', () => {
    assert.equal(resolveSlug('', 'New Council Notice'), 'new-council-notice');
    assert.equal(resolveSlug('!!!'), '');
  });
});
