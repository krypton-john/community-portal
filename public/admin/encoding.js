export function decodeBase64Content(base64Content) {
  const normalized = base64Content.replace(/\n/g, '');
  const binary =
    typeof atob === 'function'
      ? atob(normalized)
      : Buffer.from(normalized, 'base64').toString('binary');
  const bytes = Uint8Array.from(binary, (char) => char.charCodeAt(0));
  return new TextDecoder().decode(bytes);
}

export function encodeBase64Content(content) {
  const bytes = new TextEncoder().encode(content);
  let binary = '';
  for (const byte of bytes) {
    binary += String.fromCharCode(byte);
  }
  return typeof btoa === 'function' ? btoa(binary) : Buffer.from(bytes).toString('base64');
}
