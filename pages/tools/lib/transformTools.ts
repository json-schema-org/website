import { DRAFT_ORDER, type JSONSchemaDraft } from '~/lib/config';
import type { JSONSchemaTool } from '../JSONSchemaTool';
import { compareBowtieResults, type ToolBowtieInfo } from './bowtie';

export interface Transform {
  query: string;
  sortBy: 'name' | 'license' | 'bowtie';
  sortOrder: 'ascending' | 'descending';
  groupBy: 'none' | 'toolingTypes' | 'languages';
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
  groupBy: 'toolingTypes',
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
const GROUP_BY: Transform['groupBy'][] = ['none', 'toolingTypes', 'languages'];

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
  // Links to the previous version of this page always spelled out every
  // setting, including its default sort (by name) and an empty search, so
  // their sort order is not a choice anybody made. Let those links fall back
  // to the current default.
  const isLegacyLink = firstValue(query.query) === '';
  const groupBy = firstValue(query.groupBy) as Transform['groupBy'];
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
    groupBy: GROUP_BY.includes(groupBy) ? groupBy : DEFAULT_TRANSFORM.groupBy,
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

  if (transform.groupBy !== DEFAULT_TRANSFORM.groupBy) {
    query.groupBy = transform.groupBy;
  }
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
      if (!getBowtieInfo(tool).implementation) return false;
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
  if (info.result) return info.result.compliance === null ? 1 : 0;
  if (info.kind === 'untested') return 2;
  return 3;
};

const compareBowtie = (
  a: ToolBowtieInfo,
  b: ToolBowtieInfo,
  sortOrder: Transform['sortOrder'],
): number => {
  const tierDifference = bowtieTier(a) - bowtieTier(b);
  if (tierDifference !== 0 || !a.result || !b.result) return tierDifference;

  // Results for a newer dialect outrank those for an older one, which only
  // has an effect when no dialect has been selected: otherwise every tool is
  // compared on the same one.
  const difference = compareBowtieResults(a.result, b.result);
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

/** The order in which tool types are listed: roughly, by how often they are wanted. */
const TOOLING_TYPES_ORDER = [
  'validator',
  'annotations',
  'bundler',
  'hyper-schema',
  'benchmarks',
  'documentation',
  'LDO-utility',
  'code-to-schema',
  'data-to-schema',
  'model-to-schema',
  'schema-to-types',
  'schema-to-code',
  'schema-to-web-UI',
  'schema-to-data',
  'util-general-processing',
  'util-schema-to-schema',
  'util-draft-migration',
  'util-format-conversion',
  'util-testing',
  'editor',
  'editor-plugins',
  'schema-repository',
  'registry',
  'linter',
  'linter-plugins',
];

/**
 * Whether the tools of a project are listed as a single entry.
 *
 * A project with a library for each of several languages would otherwise fill
 * a row for each of them, and look as though it were being promoted. Somebody
 * who has chosen a language, or is looking at the tools by language, is after
 * the library for that language, so then every tool is listed on its own.
 */
export const rollsUpProjects = (
  transform: Pick<Transform, 'languages' | 'groupBy'>,
): boolean =>
  transform.languages.length === 0 && transform.groupBy !== 'languages';

const distinct = <T>(lists: (T[] | undefined)[]): T[] =>
  Array.from(new Set(lists.flatMap((list) => list ?? [])));

/** Compare by the place of each value in a list, then alphabetically. */
const compareByOrder = (order: readonly string[], a: string, b: string) => {
  const [indexOfA, indexOfB] = [a, b].map((value) => order.indexOf(value));
  if (indexOfA !== -1 && indexOfB !== -1) return indexOfA - indexOfB;
  if (indexOfA !== indexOfB) return indexOfA === -1 ? 1 : -1;
  return a.toLowerCase().localeCompare(b.toLowerCase());
};

/** The single entry which stands for several tools of one project. */
const rollUp = (project: string, members: JSONSchemaTool[]): JSONSchemaTool => {
  // The tool the project is named after says the most about the project
  const lead = members.find((member) => member.name === project) ?? members[0];
  const languages = distinct(members.map((member) => member.languages)).sort(
    (a, b) => compareByOrder([], a, b),
  );
  const environments = distinct(members.map((member) => member.environments));
  const drafts = distinct(
    members.map((member) => member.supportedDialects?.draft),
  ).sort((a, b) => DRAFT_ORDER.indexOf(b) - DRAFT_ORDER.indexOf(a));
  const licenses = distinct(
    members.map((member) => (member.license ? [member.license] : [])),
  );

  return {
    name: project,
    project,
    members,
    description: `${project} has a separate tool for each of the languages it supports. Choose a language to list them on their own.`,
    toolingTypes: distinct(members.map((member) => member.toolingTypes)).sort(
      (a, b) => compareByOrder(TOOLING_TYPES_ORDER, a, b),
    ),
    ...(languages.length > 0 && { languages }),
    ...(environments.length > 0 && { environments }),
    ...(drafts.length > 0 && { supportedDialects: { draft: drafts } }),
    ...(licenses.length > 0 && { license: licenses.join(', ') }),
    ...(lead.source && { source: lead.source }),
    ...(lead.creators && { creators: lead.creators }),
    ...(lead.maintainers && { maintainers: lead.maintainers }),
    ...(lead.landscape && { landscape: lead.landscape }),
    ...(members.every((member) => member.status === 'obsolete') && {
      status: 'obsolete' as const,
    }),
  };
};

/**
 * List the tools of each project as a single entry, which takes the place of
 * the first of them. A project with only one tool among those given is left
 * as that tool, so roll up what is left after filtering.
 */
export const rollUpProjects = (tools: JSONSchemaTool[]): JSONSchemaTool[] => {
  const projects = new Map<string, JSONSchemaTool[]>();
  tools.forEach((tool) => {
    if (tool.project) {
      projects.set(tool.project, [...(projects.get(tool.project) ?? []), tool]);
    }
  });

  const rolledUp = new Set<string>();

  return tools.flatMap((tool) => {
    const members = tool.project ? projects.get(tool.project)! : [];
    if (members.length < 2) return [tool];
    if (rolledUp.has(tool.project!)) return [];

    rolledUp.add(tool.project!);
    return [rollUp(tool.project!, members)];
  });
};

/**
 * What Bowtie reports for the single entry of a project is what it reports
 * for the lowest ranked of the project's tools which have results, so that a
 * project is never ranked above what any one of its tools earns.
 */
export const rollUpBowtieInfo = (
  getBowtieInfo: GetBowtieInfo,
): GetBowtieInfo => {
  const getRolledUpBowtieInfo: GetBowtieInfo = (tool) => {
    if (!tool.members?.length) return getBowtieInfo(tool);

    const infos = tool.members.map(getBowtieInfo);
    const bestTier = Math.min(...infos.map(bowtieTier));

    return infos
      .filter((info) => bowtieTier(info) === bestTier)
      .reduce((lowest, info) =>
        compareBowtie(info, lowest, 'descending') > 0 ? info : lowest,
      );
  };

  return getRolledUpBowtieInfo;
};

/** The group for tools which have no value for what they are grouped by. */
export const UNGROUPED = '';

export interface ToolGroup {
  /** The tool type or language, `UNGROUPED`, or `null` when not grouping. */
  group: string | null;
  tools: JSONSchemaTool[];
}

const compareGroups =
  (groupBy: Transform['groupBy']) => (a: string, b: string) => {
    if (a === UNGROUPED || b === UNGROUPED)
      return a === b ? 0 : a === UNGROUPED ? 1 : -1;

    if (groupBy === 'toolingTypes') {
      const [indexOfA, indexOfB] = [a, b].map((group) =>
        TOOLING_TYPES_ORDER.indexOf(group),
      );
      if (indexOfA !== -1 && indexOfB !== -1) return indexOfA - indexOfB;
      if (indexOfA !== indexOfB) return indexOfA === -1 ? 1 : -1;
    }

    return a.toLowerCase().localeCompare(b.toLowerCase());
  };

/**
 * Split tools, which have already been filtered and sorted, into groups. Every
 * tool is in every group it belongs to, so that each group is complete. When
 * the tools are filtered by what they are grouped by, only the groups which
 * were asked for are given.
 */
export const groupTools = (
  tools: JSONSchemaTool[],
  transform: Transform,
): ToolGroup[] => {
  const { groupBy } = transform;
  if (groupBy === 'none') return [{ group: null, tools }];

  const selected = transform[groupBy].map((value) => value.toLowerCase());
  const groups = new Map<string, JSONSchemaTool[]>();

  tools.forEach((tool) => {
    const values = tool[groupBy]?.length ? tool[groupBy]! : [UNGROUPED];

    values
      .filter(
        (value) =>
          selected.length === 0 || selected.includes(value.toLowerCase()),
      )
      .forEach((value) =>
        groups.set(value, [...(groups.get(value) ?? []), tool]),
      );
  });

  return Array.from(groups.keys())
    .sort(compareGroups(groupBy))
    .map((group) => ({ group, tools: groups.get(group)! }));
};
