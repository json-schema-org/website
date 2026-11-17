import { DRAFT_ORDER, type JSONSchemaDraft } from '~/lib/config';
import type { JSONSchemaTool } from '../JSONSchemaTool';
import {
  compareBowtieResults,
  type BowtieResult,
  type ToolBowtieInfo,
} from './bowtie';

export interface Transform {
  query: string;
  sortBy: 'name' | 'license' | 'bowtie';
  sortOrder: 'ascending' | 'descending';
  licenses: string[];
  languages: string[];
  drafts: JSONSchemaDraft[];
  toolingTypes: string[];
  environments: string[];
  showObsolete: 'true' | 'false';
  supportsBowtie: 'true' | 'false';
}

export const DEFAULT_TRANSFORM: Transform = {
  query: '',
  sortBy: 'bowtie',
  sortOrder: 'descending',
  licenses: [],
  languages: [],
  drafts: [],
  toolingTypes: [],
  environments: [],
  showObsolete: 'false',
  supportsBowtie: 'false',
};

export type GetBowtieInfo = (tool: JSONSchemaTool) => ToolBowtieInfo;

type QueryValue = string | string[] | undefined;

const SORT_BY: Transform['sortBy'][] = ['name', 'license', 'bowtie'];
const SORT_ORDER: Transform['sortOrder'][] = ['ascending', 'descending'];

const ARRAY_FIELDS = [
  'languages',
  'drafts',
  'toolingTypes',
  'licenses',
  'environments',
] as const;

const parseArrayParam = (param: QueryValue): string[] => {
  const values = Array.isArray(param) ? param : (param ?? '').split(',');
  return values.map((value) => value.trim()).filter(Boolean);
};

const firstValue = (param: QueryValue): string | undefined =>
  Array.isArray(param) ? param[0] : param;

/**
 * Read the state of the tooling page from the query string.
 */
export const parseTransform = (
  query: Record<string, QueryValue>,
): Transform => {
  // Links to the previous version of this page always spelled out its default
  // sort (by name) alongside a `groupBy`, so their sort order is not a choice
  // anybody made. Let those links fall back to the current default.
  const isLegacyLink = query.groupBy !== undefined;
  const sortBy = firstValue(query.sortBy) as Transform['sortBy'];
  const sortOrder = firstValue(query.sortOrder) as Transform['sortOrder'];
  const hasSortBy = !isLegacyLink && SORT_BY.includes(sortBy);
  const defaultSortOrder =
    hasSortBy && sortBy !== 'bowtie'
      ? 'ascending'
      : DEFAULT_TRANSFORM.sortOrder;

  return {
    query: firstValue(query.query) ?? '',
    sortBy: hasSortBy ? sortBy : DEFAULT_TRANSFORM.sortBy,
    sortOrder:
      hasSortBy && SORT_ORDER.includes(sortOrder)
        ? sortOrder
        : defaultSortOrder,
    languages: parseArrayParam(query.languages),
    drafts: parseArrayParam(query.drafts).filter(
      (draft): draft is JSONSchemaDraft =>
        (DRAFT_ORDER as readonly string[]).includes(draft),
    ),
    toolingTypes: parseArrayParam(query.toolingTypes),
    licenses: parseArrayParam(query.licenses),
    environments: parseArrayParam(query.environments),
    showObsolete: firstValue(query.showObsolete) === 'true' ? 'true' : 'false',
    supportsBowtie:
      firstValue(query.supportsBowtie) === 'true' ? 'true' : 'false',
  };
};

/**
 * Write the state of the tooling page as a query string, leaving out
 * everything which is at its default so that links stay short.
 */
export const serializeTransform = (
  transform: Transform,
): Record<string, string> => {
  const query: Record<string, string> = {};

  if (transform.query.trim() !== '') query.query = transform.query;

  ARRAY_FIELDS.forEach((field) => {
    if (transform[field].length > 0) query[field] = transform[field].join(',');
  });

  if (transform.showObsolete === 'true') query.showObsolete = 'true';
  if (transform.supportsBowtie === 'true') query.supportsBowtie = 'true';

  if (
    transform.sortBy !== DEFAULT_TRANSFORM.sortBy ||
    transform.sortOrder !== DEFAULT_TRANSFORM.sortOrder
  ) {
    query.sortBy = transform.sortBy;
    query.sortOrder = transform.sortOrder;
  }

  return query;
};

/** The number of filters which are narrowing the list of tools. */
export const countActiveFilters = (transform: Transform): number =>
  ARRAY_FIELDS.reduce((count, field) => count + transform[field].length, 0) +
  (transform.query.trim() !== '' ? 1 : 0) +
  (transform.showObsolete === 'true' ? 1 : 0) +
  (transform.supportsBowtie === 'true' ? 1 : 0);

const lowerCaseArray = (values: string[]) =>
  values.map((value) => value.toLowerCase());

const matchesAny = (selected: string[], values: string[] = []) =>
  selected.length === 0 ||
  values.some((value) => selected.includes(value.toLowerCase()));

export const filterTools = (
  tools: JSONSchemaTool[],
  transform: Transform,
  getBowtieInfo: GetBowtieInfo,
): JSONSchemaTool[] => {
  const languages = lowerCaseArray(transform.languages);
  const licenses = lowerCaseArray(transform.licenses);
  const toolingTypes = lowerCaseArray(transform.toolingTypes);
  const environments = lowerCaseArray(transform.environments);

  return tools.filter((tool) => {
    if (transform.showObsolete === 'false' && tool.status === 'obsolete') {
      return false;
    }

    if (transform.supportsBowtie === 'true') {
      if (getBowtieInfo(tool).implementations.length === 0) return false;
    }

    return (
      matchesAny(languages, tool.languages) &&
      matchesAny(toolingTypes, tool.toolingTypes) &&
      matchesAny(environments, tool.environments) &&
      matchesAny(transform.drafts, tool.supportedDialects?.draft) &&
      matchesAny(licenses, tool.license ? [tool.license] : [])
    );
  });
};

const compareNames = (a: JSONSchemaTool, b: JSONSchemaTool) =>
  a.name.toLowerCase().localeCompare(b.name.toLowerCase());

/**
 * Tools with Bowtie results come first, then tools Bowtie tests but not
 * against the dialect in question, then everything else.
 */
const bowtieTier = (info: ToolBowtieInfo): number => {
  if (info.kind === 'tested')
    return info.results[0].compliance === null ? 1 : 0;
  if (info.kind === 'untested') return 2;
  return 3;
};

const compareBowtie = (
  a: ToolBowtieInfo,
  b: ToolBowtieInfo,
  sortOrder: Transform['sortOrder'],
): number => {
  const tierDifference = bowtieTier(a) - bowtieTier(b);
  if (tierDifference !== 0) return tierDifference;

  // A tool is ranked on the best of its results. Those for a newer dialect
  // outrank those for an older one, which only has an effect when no dialect
  // has been selected: otherwise every tool is compared on the same one.
  const [bestOfA, bestOfB]: (BowtieResult | undefined)[] = [
    a.results[0],
    b.results[0],
  ];
  if (!bestOfA || !bestOfB) return 0;

  const difference = compareBowtieResults(bestOfA, bestOfB);
  return sortOrder === 'descending' ? difference : -difference;
};

/**
 * Sort tools, always falling back to their names so that the order within
 * equally ranked tools is alphabetical.
 */
export const sortTools = (
  tools: JSONSchemaTool[],
  transform: Pick<Transform, 'sortBy' | 'sortOrder'>,
  getBowtieInfo: GetBowtieInfo,
): JSONSchemaTool[] => {
  const direction = transform.sortOrder === 'ascending' ? 1 : -1;

  return tools.slice().sort((a, b) => {
    if (transform.sortBy === 'bowtie') {
      return (
        compareBowtie(
          getBowtieInfo(a),
          getBowtieInfo(b),
          transform.sortOrder,
        ) || compareNames(a, b)
      );
    }

    if (transform.sortBy === 'license') {
      // Tools without a license go last, whichever way the rest are sorted.
      if (!a.license !== !b.license) return a.license ? -1 : 1;

      return (
        direction *
          (a.license ?? '')
            .toLowerCase()
            .localeCompare((b.license ?? '').toLowerCase()) ||
        compareNames(a, b)
      );
    }

    return direction * compareNames(a, b);
  });
};
