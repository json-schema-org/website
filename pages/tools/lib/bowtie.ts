import { DRAFT_ORDER, type JSONSchemaDraft } from '~/lib/config';
import type {
  BowtieImplementation,
  BowtieImplementations,
  JSONSchemaTool,
} from '../JSONSchemaTool';

export const BOWTIE_URL = 'https://bowtie.report';

/**
 * Bowtie's own metadata about the implementations it tests, keyed by the
 * identifiers Bowtie uses for them in its reports, badges and links.
 */
export const BOWTIE_IMPLEMENTATIONS_URL = `${BOWTIE_URL}/implementations.json`;
export const BOWTIE_ADD_IMPLEMENTATION_URL =
  'https://docs.bowtie.report/en/stable/implementers/';

/**
 * The dialects Bowtie reports on, keyed by the draft identifiers used in the
 * tooling data.
 */
export const BOWTIE_DIALECT_URIS: Partial<Record<JSONSchemaDraft, string>> = {
  '2020-12': 'https://json-schema.org/draft/2020-12/schema',
  '2019-09': 'https://json-schema.org/draft/2019-09/schema',
  '7': 'http://json-schema.org/draft-07/schema#',
  '6': 'http://json-schema.org/draft-06/schema#',
  '4': 'http://json-schema.org/draft-04/schema#',
  '3': 'http://json-schema.org/draft-03/schema#',
};

/** The content of a Bowtie badge, as served for shields.io endpoints. */
export interface BowtieBadgeData {
  label: string;
  message: string;
  color: string;
}

/** Badges by URL: `undefined` while loading, `null` if they failed to load. */
export type BowtieBadges = Record<string, BowtieBadgeData | null | undefined>;

export type BowtieIndex = Map<string, BowtieImplementation[]>;

/** How one implementation does against one dialect, according to Bowtie. */
export interface BowtieResult {
  implementation: BowtieImplementation;
  draft: JSONSchemaDraft;
  badgeUrl: string;
  badge: BowtieBadgeData | null | undefined;
  /** The percentage of Bowtie's tests which pass, once it is known. */
  compliance: number | null;
}

/**
 * What Bowtie can tell us about a tool for the dialect being looked at.
 *
 * - `unknown`: Bowtie's list of implementations is not available.
 * - `not-applicable`: the tool is not a validator, so Bowtie cannot test it.
 * - `not-on-bowtie`: a validator which Bowtie does not (yet) test.
 * - `untested`: on Bowtie, but not tested against the selected dialect.
 * - `tested`: on Bowtie, with `results` for the dialect, best first.
 */
export interface ToolBowtieInfo {
  kind: 'unknown' | 'not-applicable' | 'not-on-bowtie' | 'untested' | 'tested';
  /** Every Bowtie implementation of the tool which is being considered. */
  implementations: BowtieImplementation[];
  /** The dialect which was asked for, if one was. */
  draft?: JSONSchemaDraft;
  results: BowtieResult[];
}

export interface BowtieSelection {
  /** The dialect to report on. Defaults to the newest each one supports. */
  draft?: JSONSchemaDraft;
  /** Prefer implementations in these languages, when a tool has several. */
  languages?: string[];
}

export const normalizeSourceUrl = (url: string): string =>
  url
    .trim()
    .toLowerCase()
    .replace(/^(https?:\/\/)www\./, '$1')
    .replace(/[#?].*$/, '')
    .replace(/\/+$/, '')
    .replace(/\.git$/, '');

const LANGUAGE_ALIASES: Record<string, string> = {
  '.net': 'dotnet',
  'c#': 'dotnet',
  'f#': 'dotnet',
  cpp: 'c++',
  js: 'javascript',
  'node.js': 'javascript',
  ts: 'typescript',
  'python 3': 'python',
  golang: 'go',
};

/**
 * Bowtie and the tooling data name languages differently (`dotnet` and
 * `.NET`, for instance), so bring both to a common form.
 */
export const normalizeLanguage = (language: string): string => {
  const lowerCased = language.trim().toLowerCase();
  return LANGUAGE_ALIASES[lowerCased] ?? lowerCased;
};

const REPOSITORY_ROOT = /^(https?:\/\/[^/]+\/[^/]+\/[^/]+)/;

export const buildBowtieIndex = (
  implementations: BowtieImplementations,
): BowtieIndex => {
  const index: BowtieIndex = new Map();

  Object.entries(implementations).forEach(([id, metadata]) => {
    if (!metadata?.source) return;

    const source = normalizeSourceUrl(metadata.source);
    const implementation = {
      ...metadata,
      id,
      dialects: metadata.dialects ?? [],
    };
    index.set(source, [...(index.get(source) ?? []), implementation]);
  });

  return index;
};

const inLanguages = (
  implementations: BowtieImplementation[],
  languages: string[] = [],
): BowtieImplementation[] => {
  const wanted = languages.map(normalizeLanguage);
  const matches = implementations.filter((implementation) =>
    wanted.includes(normalizeLanguage(implementation.language)),
  );

  // A tool may be listed under a language other than the one Bowtie tests it
  // in (bindings to a library written in another language, say), in which
  // case what Bowtie has is still the best information there is.
  return matches.length > 0 ? matches : implementations;
};

/**
 * Find the Bowtie implementations of a tool.
 *
 * Bowtie does not know about the tooling data, nor the other way around, so
 * match on what the two have in common: the source repository (or its root,
 * for tools which live in a subdirectory of one), and then the language,
 * since several implementations can share a repository.
 */
export const findBowtieImplementations = (
  tool: JSONSchemaTool,
  index: BowtieIndex | null,
  preferredLanguages: string[] = [],
): BowtieImplementation[] => {
  if (!index || !tool.source) return [];

  const source = normalizeSourceUrl(tool.source);
  const repositoryRoot = source.match(REPOSITORY_ROOT)?.[1];
  const candidates = [
    ...(index.get(source) ??
      (repositoryRoot ? index.get(repositoryRoot) : undefined) ??
      []),
  ];

  return inLanguages(
    inLanguages(candidates, tool.languages),
    preferredLanguages,
  );
};

/** The newest of the given drafts, or `undefined` if there are none. */
export const newestDraft = (
  drafts: readonly string[],
): JSONSchemaDraft | undefined =>
  DRAFT_ORDER.find((draft) => drafts.includes(draft));

/** The newest draft Bowtie tests an implementation against. */
export const newestBowtieDraft = (
  implementation: BowtieImplementation,
): JSONSchemaDraft | undefined =>
  DRAFT_ORDER.find((draft) => {
    const uri = BOWTIE_DIALECT_URIS[draft];
    return uri !== undefined && implementation.dialects.includes(uri);
  });

export const getBowtieImplementationUrl = (
  implementation: BowtieImplementation,
): string =>
  `${BOWTIE_URL}/#/implementations/${encodeURIComponent(implementation.id)}`;

export const getBowtieBadgeUrl = (
  implementation: BowtieImplementation,
  draft: JSONSchemaDraft,
): string =>
  `${BOWTIE_URL}/badges/${encodeURIComponent(implementation.id)}/compliance/draft${draft}.json`;

/**
 * Extract the percentage of passing tests from a compliance badge, whose
 * message looks like "98% Passing".
 */
export const parseCompliance = (
  badge: BowtieBadgeData | null | undefined,
): number | null => {
  const match = badge?.message.match(/(\d+(?:\.\d+)?)\s*%/);
  return match ? Number(match[1]) : null;
};

/**
 * Order results best first: those for newer dialects ahead of those for older
 * ones, then by how much of Bowtie's test suite passes.
 */
export const compareBowtieResults = (
  a: BowtieResult,
  b: BowtieResult,
): number =>
  DRAFT_ORDER.indexOf(a.draft) - DRAFT_ORDER.indexOf(b.draft) ||
  (b.compliance ?? -1) - (a.compliance ?? -1);

/**
 * Work out what Bowtie reports for a tool.
 *
 * When a draft has been selected the results are for that draft. Otherwise
 * they are for the newest draft Bowtie tests each implementation against.
 */
export const getToolBowtieInfo = (
  tool: JSONSchemaTool,
  index: BowtieIndex | null,
  selection: BowtieSelection = {},
  badges: BowtieBadges = {},
): ToolBowtieInfo => {
  const implementations = findBowtieImplementations(
    tool,
    index,
    selection.languages,
  );

  if (implementations.length === 0) {
    return {
      kind: !index
        ? 'unknown'
        : tool.toolingTypes?.includes('validator')
          ? 'not-on-bowtie'
          : 'not-applicable',
      implementations,
      draft: selection.draft,
      results: [],
    };
  }

  const results = implementations
    .flatMap((implementation): BowtieResult[] => {
      const draft = selection.draft ?? newestBowtieDraft(implementation);
      const dialectUri = draft && BOWTIE_DIALECT_URIS[draft];

      if (!dialectUri || !implementation.dialects.includes(dialectUri)) {
        return [];
      }

      const badgeUrl = getBowtieBadgeUrl(implementation, draft);
      const badge = badges[badgeUrl];

      return [
        {
          implementation,
          draft,
          badgeUrl,
          badge,
          compliance: parseCompliance(badge),
        },
      ];
    })
    .sort(
      (a, b) =>
        compareBowtieResults(a, b) ||
        a.implementation.id.localeCompare(b.implementation.id),
    );

  return {
    kind: results.length > 0 ? 'tested' : 'untested',
    implementations,
    draft: selection.draft,
    results,
  };
};
