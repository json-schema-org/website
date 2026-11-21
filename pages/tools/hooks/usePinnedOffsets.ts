import { useEffect, useRef, useState } from 'react';

const DESKTOP = '(min-width: 1024px)';

/**
 * Where to pin something below the site's header, which is fixed to the top
 * of the window and changes height (the announcement banner can be closed).
 *
 * Gives a ref for the element being pinned, the offset to pin it at, how far
 * from the top of the window content is hidden by the two of them, and the
 * `scroll-margin-top` which makes a link into the page leave that much room
 * above its target. The site already has every page leave some room for its
 * header (a `scroll-padding-top`), which the margin is on top of. The pinned
 * element only counts at the sizes at which it is pinned.
 */
export default function usePinnedOffsets<T extends HTMLElement>() {
  const pinnedRef = useRef<T>(null);
  const [offsets, setOffsets] = useState({
    top: 0,
    covered: 0,
    scrollMargin: 0,
  });

  useEffect(() => {
    const header = document.querySelector('header');
    const desktop = window.matchMedia?.(DESKTOP);

    const measure = () => {
      const top = header?.getBoundingClientRect().height ?? 0;
      const pinned = desktop?.matches
        ? (pinnedRef.current?.getBoundingClientRect().height ?? 0)
        : 0;

      const covered = top + pinned;
      const padding =
        parseFloat(
          window.getComputedStyle(document.documentElement).scrollPaddingTop,
        ) || 0;
      const scrollMargin = covered - padding;

      setOffsets((previous) =>
        previous.top === top &&
        previous.covered === covered &&
        previous.scrollMargin === scrollMargin
          ? previous
          : { top, covered, scrollMargin },
      );
    };

    measure();

    const observer =
      typeof ResizeObserver === 'undefined'
        ? null
        : new ResizeObserver(measure);
    if (header) observer?.observe(header);
    if (pinnedRef.current) observer?.observe(pinnedRef.current);
    window.addEventListener('resize', measure);

    return () => {
      observer?.disconnect();
      window.removeEventListener('resize', measure);
    };
  }, []);

  return { pinnedRef, ...offsets };
}
