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

/** The implementations Bowtie tests, by the identifier it gives them. */
export type BowtieIndex = Map<string, BowtieImplementation>;

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
 * - `tested`: on Bowtie, with a `result` for the dialect.
 */
export interface ToolBowtieInfo {
  kind: 'unknown' | 'not-applicable' | 'not-on-bowtie' | 'untested' | 'tested';
  implementation?: BowtieImplementation;
  /**
   * The validator the implementation belongs to, when that is not the tool
   * itself but one the tool is built on.
   */
  engine?: JSONSchemaTool;
  /** The dialect which was asked for, if one was. */
  draft?: JSONSchemaDraft;
  result?: BowtieResult;
}

export const buildBowtieIndex = (
  implementations: BowtieImplementations,
): BowtieIndex =>
  new Map(
    Object.entries(implementations).map(([id, metadata]) => [
      id,
      { ...metadata, id, dialects: metadata?.dialects ?? [] },
    ]),
  );

/**
 * Find the Bowtie implementation of a tool, which the tooling data names by
 * the identifier Bowtie gives it.
 */
export const findBowtieImplementation = (
  tool: JSONSchemaTool,
  index: BowtieIndex | null,
): BowtieImplementation | null =>
  (tool.bowtie?.identifier && index?.get(tool.bowtie.identifier)) || null;

/** The validators which tools are built on, for the tools built on one. */
export type BowtieEngines = Map<JSONSchemaTool, JSONSchemaTool>;

const normalizeUrl = (url: string): string =>
  url
    .trim()
    .toLowerCase()
    .replace(/\/+$/, '')
    .replace(/\.git$/, '');

/**
 * Find the validator each tool wraps, among those Bowtie tests.
 *
 * An online validator or a command line tool built on a validator behaves as
 * that validator does, so what Bowtie reports for the validator is the
 * accurate view of what the tool supports. Tools say which validators they
 * depend on by their source repositories.
 */
export const findBowtieEngines = (tools: JSONSchemaTool[]): BowtieEngines => {
  const testedBySource = new Map<string, JSONSchemaTool>();
  tools.forEach((tool) => {
    if (tool.bowtie?.identifier && tool.source) {
      const source = normalizeUrl(tool.source);
      if (!testedBySource.has(source)) testedBySource.set(source, tool);
    }
  });

  const engines: BowtieEngines = new Map();
  tools.forEach((tool) => {
    if (tool.bowtie?.identifier) return;

    const engine = (tool.dependsOnValidators ?? [])
      .map((validator) => testedBySource.get(normalizeUrl(validator)))
      .find((candidate) => candidate && candidate !== tool);
    if (engine) engines.set(tool, engine);
  });

  return engines;
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
 * When a draft has been selected the result is for that draft. Otherwise it
 * is for the newest draft Bowtie tests the implementation against. A tool
 * built on a validator Bowtie tests gets that validator's results.
 */
export const getToolBowtieInfo = (
  tool: JSONSchemaTool,
  index: BowtieIndex | null,
  selectedDraft?: JSONSchemaDraft,
  badges: BowtieBadges = {},
  engines?: BowtieEngines,
): ToolBowtieInfo => {
  const engine = engines?.get(tool);
  const implementation = findBowtieImplementation(engine ?? tool, index);

  if (!implementation) {
    return {
      kind: !index
        ? 'unknown'
        : tool.toolingTypes?.includes('validator')
          ? 'not-on-bowtie'
          : 'not-applicable',
      draft: selectedDraft,
    };
  }

  const draft = selectedDraft ?? newestBowtieDraft(implementation);
  const dialectUri = draft && BOWTIE_DIALECT_URIS[draft];

  if (!dialectUri || !implementation.dialects.includes(dialectUri)) {
    return { kind: 'untested', implementation, engine, draft: selectedDraft };
  }

  const badgeUrl = getBowtieBadgeUrl(implementation, draft);
  const badge = badges[badgeUrl];

  return {
    kind: 'tested',
    implementation,
    engine,
    draft: selectedDraft,
    result: {
      implementation,
      draft,
      badgeUrl,
      badge,
      compliance: parseCompliance(badge),
    },
  };
};
