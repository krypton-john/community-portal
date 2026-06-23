import assert from 'node:assert/strict';
import { describe, it } from 'node:test';

import { validateEditorPayload } from '../public/admin/validation.js';

describe('admin content validation', () => {
  it('rejects news posts missing fields required by the Astro schema', () => {
    const baseNews = {
      title: 'Community update',
      publishedAt: '2026-06-23T19:00:00.000Z',
      source: 'Town Council',
      sourceUrl: '',
    };

    assert.equal(
      validateEditorPayload('news', { data: { ...baseNews, source: '' } }),
      'Source is required.',
    );
    assert.equal(
      validateEditorPayload('news', { data: { ...baseNews, publishedAt: undefined } }),
      'Published date is required.',
    );
    assert.equal(validateEditorPayload('news', { data: baseNews }), null);
  });

  it('rejects service listings missing fields required by the Astro schema', () => {
    const baseService = {
      name: 'Canal Cafe',
      address: 'Main Street',
      email: '',
      website: '',
      social: {},
    };

    assert.equal(
      validateEditorPayload('services', { data: { ...baseService, address: '' } }),
      'Address is required.',
    );
    assert.equal(validateEditorPayload('services', { data: baseService }), null);
  });

  it('rejects optional contact fields that would fail content schema validation', () => {
    assert.equal(
      validateEditorPayload('news', {
        data: {
          title: 'Community update',
          publishedAt: '2026-06-23T19:00:00.000Z',
          source: 'Town Council',
          sourceUrl: 'not-a-url',
        },
      }),
      'Source URL must be a valid URL.',
    );

    assert.equal(
      validateEditorPayload('services', {
        data: {
          name: 'Canal Cafe',
          address: 'Main Street',
          email: 'not-an-email',
          website: '',
          social: {},
        },
      }),
      'Email must be a valid email address.',
    );

    assert.equal(
      validateEditorPayload('services', {
        data: {
          name: 'Canal Cafe',
          address: 'Main Street',
          email: '',
          website: 'https://example.com',
          social: { facebook: 'not-a-url' },
        },
      }),
      'Facebook URL must be a valid URL.',
    );
  });
});
