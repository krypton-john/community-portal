import assert from 'node:assert/strict';
import {
  buildMarkdownFile,
  buildYamlFile,
  validatePayloadForTab,
} from '../public/admin/admin.js';

const validNews = {
  data: {
    title: 'Council update',
    permalink: '',
    publishedAt: new Date('2026-06-01T10:00:00Z').toISOString(),
    category: 'council',
    urgent: false,
    verified: true,
    source: 'Town council',
    sourceUrl: 'https://example.com/update',
    tags: [],
    community: 'monasterevin',
  },
  body: 'Update details.',
};

const validService = {
  data: {
    name: 'Canal Cafe',
    category: 'cafe',
    address: 'Canal Harbour, Monasterevin',
    phone: '',
    email: 'hello@example.com',
    website: 'https://example.com',
    verified: true,
    description: '',
    community: 'monasterevin',
    social: {
      facebook: '',
      instagram: '',
      twitter: '',
      linkedin: '',
    },
  },
};

assert.equal(validatePayloadForTab('news', validNews), null);
assert.match(buildMarkdownFile(validNews.data, validNews.body), /source: Town council/);

assert.equal(
  validatePayloadForTab('news', {
    ...validNews,
    data: { ...validNews.data, source: '' },
  }),
  'Source is required.',
);
assert.equal(
  validatePayloadForTab('news', {
    ...validNews,
    data: { ...validNews.data, publishedAt: undefined },
  }),
  'Published at is required.',
);
assert.equal(
  validatePayloadForTab('news', {
    ...validNews,
    data: { ...validNews.data, sourceUrl: 'not-a-url' },
  }),
  'Source URL must be a valid http(s) URL.',
);

assert.equal(validatePayloadForTab('services', validService), null);
assert.match(buildYamlFile(validService.data), /address: Canal Harbour, Monasterevin/);

assert.equal(
  validatePayloadForTab('services', {
    ...validService,
    data: { ...validService.data, address: '' },
  }),
  'Address is required.',
);
assert.equal(
  validatePayloadForTab('services', {
    ...validService,
    data: { ...validService.data, email: 'not-an-email' },
  }),
  'Email must be a valid email address.',
);
assert.equal(
  validatePayloadForTab('services', {
    ...validService,
    data: {
      ...validService.data,
      social: { ...validService.data.social, facebook: 'ftp://example.com' },
    },
  }),
  'Facebook URL must be a valid http(s) URL.',
);

console.log('Admin validation checks passed.');
