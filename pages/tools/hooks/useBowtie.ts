import { useEffect, useMemo, useState } from 'react';

import type { BowtieImplementations } from '../JSONSchemaTool';
import {
  BOWTIE_IMPLEMENTATIONS_URL,
  buildBowtieIndex,
  type BowtieBadgeData,
  type BowtieBadges,
  type BowtieIndex,
} from '../lib/bowtie';

const badgeCache = new Map<string, Promise<BowtieBadgeData | null>>();

const fetchBadge = (url: string): Promise<BowtieBadgeData | null> => {
  let badge = badgeCache.get(url);

  if (!badge) {
    badge = fetch(url)
      .then((response) => (response.ok ? response.json() : null))
      .then((data) =>
        typeof data?.message === 'string' ? (data as BowtieBadgeData) : null,
      )
      .catch(() => null);
    badgeCache.set(url, badge);
  }

  return badge;
};

/**
 * The implementations Bowtie tests, indexed by their source repository. The
 * index is `null` until they have loaded, and if they cannot be loaded.
 */
export interface BowtieIndexState {
  index: BowtieIndex | null;
  isLoading: boolean;
}

export function useBowtieIndex(): BowtieIndexState {
  const [index, setIndex] = useState<BowtieIndex | null>(null);
  const [isLoading, setIsLoading] = useState(true);

  useEffect(() => {
    let isCurrent = true;

    fetch(BOWTIE_IMPLEMENTATIONS_URL)
      .then((response) => response.json())
      .then((implementations: BowtieImplementations) => {
        if (isCurrent) setIndex(buildBowtieIndex(implementations));
      })
      .catch((error) => {
        console.error('Error fetching Bowtie implementations:', error);
      })
      .finally(() => {
        if (isCurrent) setIsLoading(false);
      });

    return () => {
      isCurrent = false;
    };
  }, []);

  return { index, isLoading };
}

/**
 * Bowtie's compliance badges, by URL. They are added all together once every
 * one of them has arrived, so that a list sorted by them is reordered once
 * rather than repeatedly.
 */
export function useBowtieBadges(urls: string[]): BowtieBadges {
  const [badges, setBadges] = useState<BowtieBadges>({});
  const key = useMemo(
    () => Array.from(new Set(urls)).sort().join('\n'),
    [urls],
  );

  useEffect(() => {
    if (key === '') return;

    let isCurrent = true;
    const wanted = key.split('\n');

    Promise.all(wanted.map(fetchBadge)).then((loaded) => {
      if (!isCurrent) return;

      setBadges((previous) => {
        const next = { ...previous };
        wanted.forEach((url, index) => {
          next[url] = loaded[index];
        });
        return next;
      });
    });

    return () => {
      isCurrent = false;
    };
  }, [key]);

  return badges;
}
