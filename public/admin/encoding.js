const BASE64_CHUNK_SIZE = 0x8000;

export function decodeBase64Content(base64Content) {
  const binary = atob(base64Content.replace(/\n/g, ''));
  const bytes = Uint8Array.from(binary, (char) => char.charCodeAt(0));
  return new TextDecoder().decode(bytes);
}

export function encodeBase64Content(content) {
  const bytes = new TextEncoder().encode(content);
  let binary = '';

  for (let i = 0; i < bytes.length; i += BASE64_CHUNK_SIZE) {
    const chunk = bytes.subarray(i, i + BASE64_CHUNK_SIZE);
    binary += String.fromCharCode(...chunk);
  }

  return btoa(binary);
}
