import { useEffect, useRef, useState } from 'react';

const DESKTOP = '(min-width: 1024px)';

/**
 * Where to pin something below the site's header, which is fixed to the top
 * of the window and changes height (the announcement banner can be closed).
 *
 * Gives a ref for the element being pinned, the offset to pin it at, and how
 * far from the top of the window content is hidden by the two of them, which
 * is how much room a link into the page has to leave above its target. The
 * pinned element only counts towards that at the sizes at which it is pinned.
 */
export default function usePinnedOffsets<T extends HTMLElement>() {
  const pinnedRef = useRef<T>(null);
  const [offsets, setOffsets] = useState({ top: 0, covered: 0 });

  useEffect(() => {
    const header = document.querySelector('header');
    const desktop = window.matchMedia?.(DESKTOP);

    const measure = () => {
      const top = header?.getBoundingClientRect().height ?? 0;
      const pinned = desktop?.matches
        ? (pinnedRef.current?.getBoundingClientRect().height ?? 0)
        : 0;

      setOffsets((previous) =>
        previous.top === top && previous.covered === top + pinned
          ? previous
          : { top, covered: top + pinned },
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
