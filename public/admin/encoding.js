export function decodeBase64Utf8(base64) {
  const binary = atob(base64.replace(/\s/g, ''));
  const bytes = Uint8Array.from(binary, (char) => char.charCodeAt(0));
  return new TextDecoder().decode(bytes);
}

export function encodeBase64Utf8(text) {
  const bytes = new TextEncoder().encode(text);
  const chunks = [];
  const chunkSize = 0x8000;

  for (let i = 0; i < bytes.length; i += chunkSize) {
    chunks.push(String.fromCharCode(...bytes.subarray(i, i + chunkSize)));
  }

  return btoa(chunks.join(''));
}
