export function decodeBase64Utf8(base64) {
  const normalized = base64.replace(/\s/g, '');
  const binary = atob(normalized);

  if (typeof TextDecoder !== 'undefined') {
    const bytes = Uint8Array.from(binary, (char) => char.charCodeAt(0));
    return new TextDecoder().decode(bytes);
  }

  return decodeURIComponent(escape(binary));
}

export function encodeBase64Utf8(content) {
  if (typeof TextEncoder !== 'undefined') {
    const bytes = new TextEncoder().encode(content);
    const chunkSize = 0x8000;
    let binary = '';

    for (let i = 0; i < bytes.length; i += chunkSize) {
      binary += String.fromCharCode(...bytes.subarray(i, i + chunkSize));
    }

    return btoa(binary);
  }

  return btoa(unescape(encodeURIComponent(content)));
}
