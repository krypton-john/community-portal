function isPresent(value) {
  return typeof value === 'string' ? value.trim().length > 0 : Boolean(value);
}

function isValidUrl(value) {
  if (!value) return true;

  try {
    new URL(value);
    return true;
  } catch {
    return false;
  }
}

function isValidEmail(value) {
  if (!value) return true;
  return /^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(value);
}

function firstInvalidUrl(fields) {
  return fields.find(([, value]) => value && !isValidUrl(value));
}

export function validateEditorPayload(tab, payload) {
  const data = payload?.data ?? {};

  if (tab === 'news') {
    if (!isPresent(data.title)) return 'Title is required.';
    if (!isPresent(data.publishedAt)) return 'Published date is required.';
    if (!isPresent(data.source)) return 'Source is required.';

    const invalidUrl = firstInvalidUrl([
      ['Source URL', data.sourceUrl],
    ]);
    if (invalidUrl) return `${invalidUrl[0]} must be a valid URL.`;

    return null;
  }

  if (tab === 'services') {
    if (!isPresent(data.name)) return 'Business name is required.';
    if (!isPresent(data.address)) return 'Address is required.';
    if (data.email && !isValidEmail(data.email)) return 'Email must be a valid email address.';

    const social = data.social ?? {};
    const invalidUrl = firstInvalidUrl([
      ['Website', data.website],
      ['Facebook URL', social.facebook],
      ['Instagram URL', social.instagram],
      ['X / Twitter URL', social.twitter],
      ['LinkedIn URL', social.linkedin],
    ]);
    if (invalidUrl) return `${invalidUrl[0]} must be a valid URL.`;

    return null;
  }

  return 'Unknown editor type.';
}
