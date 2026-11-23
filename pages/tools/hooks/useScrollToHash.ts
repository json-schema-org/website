import { useEffect, useRef } from 'react';

const fragmentOf = (hash: string): string => hash.replace(/^#/, '');

/**
 * The element a link's fragment refers to: by its id, or failing that the
 * group of tools it names. Links to the tools page have long been written
 * with fragments like `#validators`, which are not the ids of its groups.
 */
export const findHashTarget = (hash: string): HTMLElement | null => {
  let fragment = fragmentOf(hash);
  try {
    fragment = decodeURIComponent(fragment);
  } catch {
    // Not a valid encoding: look for it as it is
  }
  if (!fragment) return null;

  const group = fragment.toLowerCase();

  return (
    document.getElementById(fragment) ??
    document.getElementById(`group-${group}`) ??
    document.getElementById(`group-${group.replace(/s$/, '')}`)
  );
};

/** What tells us the reader has taken over where the page is scrolled to. */
const INTERACTIONS = ['wheel', 'touchstart', 'keydown', 'pointerdown'] as const;

/** How long a page can take to settle: fonts, and results which load late. */
const SETTLING_TIME = 5000;

/**
 * Bring what the address' fragment refers to into view below whatever is
 * fixed to the top of the window.
 *
 * The browser does this itself when a page loads, but before it is known how
 * much of the window is covered, so the target ends up underneath. So do it
 * again when that is known (`covered` is no longer zero), and each time the
 * page changes size while it settles, because what loads late moves the
 * target. That stops as soon as the reader does anything, and after a few
 * seconds at most: the page must not jump about under them.
 *
 * After that the browser gets links within the page right by itself, except
 * for a fragment which names a group without being its id.
 */
export default function useScrollToHash(covered: number) {
  const isSettling = useRef(true);
  const align = useRef(() => {});
  const observer = useRef<ResizeObserver | null>(null);

  useEffect(() => {
    align.current = () => {
      if (!isSettling.current || covered === 0) return;

      const target = findHashTarget(window.location.hash);
      if (!target) return;

      // What loads late moves the target by changing the size of what it is
      // in. The document itself may well not change size: this site's has
      // the height of the window, and its content overflows it.
      if (target.parentElement) observer.current?.observe(target.parentElement);
      target.scrollIntoView({ behavior: 'instant' });
    };
    align.current();
  }, [covered]);

  useEffect(() => {
    const settle = () => {
      isSettling.current = false;
    };
    const timeout = setTimeout(settle, SETTLING_TIME);
    INTERACTIONS.forEach((interaction) =>
      window.addEventListener(interaction, settle, { passive: true }),
    );

    observer.current =
      typeof ResizeObserver === 'undefined'
        ? null
        : new ResizeObserver(() => align.current());
    align.current();

    const scrollToAlias = () => {
      const { hash } = window.location;
      if (document.getElementById(fragmentOf(hash))) return;

      findHashTarget(hash)?.scrollIntoView();
    };
    window.addEventListener('hashchange', scrollToAlias);

    return () => {
      clearTimeout(timeout);
      INTERACTIONS.forEach((interaction) =>
        window.removeEventListener(interaction, settle),
      );
      observer.current?.disconnect();
      window.removeEventListener('hashchange', scrollToAlias);
    };
  }, []);
}
