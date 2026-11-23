/** Short, stable hex digest. Used to turn any name (any script) into an email-safe id. */
export async function shortHash(text: string, length = 20): Promise<string> {
  const bytes = new TextEncoder().encode(text);
  const digest = await crypto.subtle.digest('SHA-256', bytes);
  return Array.from(new Uint8Array(digest), (b) => b.toString(16).padStart(2, '0'))
    .join('')
    .slice(0, length);
}
