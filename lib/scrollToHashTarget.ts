/**
 * Scrolls to the element with the given id when the URL hash points at it.
 * `window.location.hash` includes the leading `#`, so it's stripped before
 * comparing. Returns true if it scrolled.
 */
export default function scrollToHashTarget(
  hash: string,
  id: string,
  doc: Document = document,
): boolean {
  if (!hash) return false;
  let fragment = hash.startsWith('#') ? hash.slice(1) : hash;
  try {
    fragment = decodeURIComponent(fragment);
  } catch {
    return false;
  }
  if (!fragment || fragment !== id) return false;

  const target = doc.getElementById(id);
  if (!target) return false;

  target.scrollIntoView({ behavior: 'smooth' });
  return true;
}
