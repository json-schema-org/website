import { useCallback, useEffect, useMemo, useRef } from 'react';
import { useRouter } from 'next/router';

import {
  DEFAULT_TRANSFORM,
  parseTransform,
  serializeTransform,
  type Transform,
} from '../lib/transformTools';

export type { Transform } from '../lib/transformTools';

export type TransformUpdate =
  | Partial<Transform>
  | ((prevTransform: Transform) => Partial<Transform>);

export interface SetTransformOptions {
  /**
   * Whether the change gets its own entry in the browser's history. Use
   * `replace` for changes which arrive in quick succession, like typing.
   */
  history?: 'push' | 'replace';
}

export type SetTransform = (
  update: TransformUpdate,
  options?: SetTransformOptions,
) => void;

/**
 * The state of the tooling page (its filters and sort order), which lives in
 * the query string so that it can be linked to, and so that the browser's
 * back and forward buttons step through it.
 */
export default function useToolsTransform() {
  const router = useRouter();

  const transform = useMemo(() => parseTransform(router.query), [router.query]);

  // Updates may be based on the previous state, and several can be made
  // before the router has caught up with the first of them.
  const latestTransform = useRef(transform);
  useEffect(() => {
    latestTransform.current = transform;
  }, [transform]);

  const setTransform: SetTransform = useCallback(
    (update, { history = 'push' } = {}) => {
      const previous = latestTransform.current;
      const next = {
        ...previous,
        ...(typeof update === 'function' ? update(previous) : update),
      };
      latestTransform.current = next;

      router[history](
        { pathname: router.pathname, query: serializeTransform(next) },
        undefined,
        { shallow: true, scroll: false },
      );
    },
    [router],
  );

  const resetTransform = useCallback(
    () => setTransform(DEFAULT_TRANSFORM),
    [setTransform],
  );

  return { transform, setTransform, resetTransform };
}
