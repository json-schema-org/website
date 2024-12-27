import { useEffect, useMemo, useState } from 'react';
import { useRouter } from 'next/router';
import Fuse from 'fuse.js';

import { type JSONSchemaDraft } from '~/lib/config';
import type { JSONSchemaTool } from '../JSONSchemaTool';

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
}

export type TransformUpdate =
  | Partial<Transform>
  | ((prevTransform: Transform) => Partial<Transform>);

export interface GroupedTools {
  [group: string]: JSONSchemaTool[];
}

const buildQueryString = (transform: Transform) => {
  return new URLSearchParams({
    query: transform.query,
    sortBy: transform.sortBy,
    sortOrder: transform.sortOrder,
    groupBy: transform.groupBy,
    licenses: transform.licenses.join(','),
    languages: transform.languages.join(','),
    drafts: transform.drafts.join(','),
    toolingTypes: transform.toolingTypes.join(','),
    environments: transform.environments.join(','),
    showObsolete: transform.showObsolete,
  }).toString();
};

export default function useToolsTransform(tools: JSONSchemaTool[]) {
  const router = useRouter();
  const { query } = router;

  const [transform, setTransform] = useState<Transform>({
    query: '',
    sortBy: 'name',
    sortOrder: 'ascending',
    groupBy: 'toolingTypes',
    languages: [],
    licenses: [],
    drafts: [],
    toolingTypes: [],
    environments: [],
    showObsolete: 'false',
  });

  useEffect(() => {
    if (!router.isReady) return;

    const parseArrayParam = (
      param: string | string[] | undefined,
    ): string[] => {
      if (Array.isArray(param)) {
        return param;
      }
      if (typeof param === 'string') {
        return param.split(',').filter(Boolean);
      }
      return [];
    };

    const updatedTransform = {
      query: (query.query as Transform['query']) || '',
      sortBy: (query.sortBy as Transform['sortBy']) || 'name',
      sortOrder: (query.sortOrder as Transform['sortOrder']) || 'ascending',
      groupBy: (query.groupBy as Transform['groupBy']) || 'toolingTypes',
      languages: parseArrayParam(query.languages) as Transform['languages'],
      licenses: parseArrayParam(query.licenses) as Transform['licenses'],
      drafts: parseArrayParam(query.drafts) as Transform['drafts'],
      toolingTypes: parseArrayParam(
        query.toolingTypes,
      ) as Transform['toolingTypes'],
      environments: parseArrayParam(
        query.environments,
      ) as Transform['environments'],
      showObsolete:
        (query.showObsolete as Transform['showObsolete']) || 'false',
    } satisfies Transform;

    const queryString = buildQueryString(updatedTransform);
    const hash = window.location.hash;

    router.replace(`/tools?${queryString}${hash}`, undefined, {
      shallow: true,
    });

    setTransform(updatedTransform);
  }, [router.isReady]);

  useEffect(() => {
    if (!router.isReady) return;
    const { query } = router;

    if (Object.keys(query).length === 0) {
      resetTransform();
    }
  }, [router]);

  const updateTransform = (update: TransformUpdate) => {
    setTransform((prevTransform) => {
      const newTransform =
        typeof update === 'function'
          ? { ...prevTransform, ...update(prevTransform) }
          : { ...prevTransform, ...update };

      const queryString = buildQueryString(newTransform);

      router.push(`/tools?${queryString}`, undefined, { shallow: true });

      return newTransform;
    });
  };

  const resetTransform = () => {
    const initialTransform: Transform = {
      query: '',
      sortBy: 'name',
      sortOrder: 'ascending',
      groupBy: 'toolingTypes',
      languages: [],
      licenses: [],
      drafts: [],
      toolingTypes: [],
      environments: [],
      showObsolete: 'false',
    };

    const queryString = buildQueryString(initialTransform);

    router.push(`/tools?${queryString}`, undefined, { shallow: true });

    updateTransform(initialTransform);
    window.scrollTo(0, 0);
  };

  const fuse = useMemo(
    () =>
      new Fuse(tools, { keys: ['name'], includeScore: true, threshold: 0.3 }),
    [tools],
  );

  const hits = useMemo(
    () =>
      transform.query.trim() === ''
        ? tools
        : fuse.search(transform.query).map((result) => result.item),
    [fuse, transform.query, tools],
  );

  const filteredHits = useMemo(
    () => filterTools(hits, transform),
    [hits, transform],
  );

  const sortedHits = useMemo(
    () => sortTools(filteredHits, transform),
    [filteredHits, transform.sortBy, transform.sortOrder],
  );

  const { numberOfTools, toolsByGroup } = useMemo(
    () => groupTools(sortedHits, transform),
    [sortedHits, transform.groupBy],
  );

  return {
    numberOfTools,
    tools: sortedHits,
    toolsByGroup,
    transform,
    setTransform: updateTransform,
    resetTransform,
  };
}

const lowerCaseArray = (arr: string[]) => arr.map((item) => item.toLowerCase());

const filterTools = (
  tools: JSONSchemaTool[],
  transform: Transform,
): JSONSchemaTool[] => {
  const filteredTools = tools.filter((tool) => {
    if (transform.showObsolete === 'false' && tool.status === 'obsolete')
      return false;

    const lowerCaseTransform = {
      languages: lowerCaseArray(transform.languages),
      licenses: lowerCaseArray(transform.licenses),
      toolingTypes: lowerCaseArray(transform.toolingTypes),
      environments: lowerCaseArray(transform.environments),
      drafts: transform.drafts,
    };

    return (
      // Matches Languages
      (!lowerCaseTransform.languages.length ||
        (tool.languages || []).some((lang) =>
          lowerCaseTransform.languages.includes(lang.toLowerCase()),
        )) &&
      // Matches Tooling Types
      (!lowerCaseTransform.toolingTypes.length ||
        (tool.toolingTypes || []).some((type) =>
          lowerCaseTransform.toolingTypes.includes(type.toLowerCase()),
        )) &&
      // Matches Environment
      (!lowerCaseTransform.environments.length ||
        (tool.environments || []).some((environment) =>
          lowerCaseTransform.environments.includes(environment.toLowerCase()),
        )) &&
      // Matches Dialect
      (!lowerCaseTransform.drafts.length ||
        (tool.supportedDialects?.draft || []).some((draft) =>
          lowerCaseTransform.drafts.includes(draft),
        )) &&
      // Matches License
      (!lowerCaseTransform.licenses.length ||
        (tool.license &&
          lowerCaseTransform.licenses.includes(tool.license.toLowerCase())))
    );
  });

  return filteredTools;
};

const sortTools = (
  tools: JSONSchemaTool[],
  transform: Transform,
): JSONSchemaTool[] => {
  return tools.slice().sort((a, b) => {
    let aValue: string | undefined;
    let bValue: string | undefined;

    if (transform.sortBy === 'name') {
      aValue = a.name.toLowerCase();
      bValue = b.name.toLowerCase();
    } else if (transform.sortBy === 'license') {
      aValue = (a.license || '').toLowerCase();
      bValue = (b.license || '').toLowerCase();
    } else if (transform.sortBy === 'bowtie') {
      const aHasIdentifier = Boolean(a.bowtie?.id);
      const bHasIdentifier = Boolean(b.bowtie?.id);

      if (transform.sortOrder === 'ascending') {
        if (aHasIdentifier && !bHasIdentifier) return -1;
        if (!aHasIdentifier && bHasIdentifier) return 1;
      } else {
        if (aHasIdentifier && !bHasIdentifier) return 1;
        if (!aHasIdentifier && bHasIdentifier) return -1;
      }

      aValue = (a.bowtie?.id || '').toLowerCase();
      bValue = (b.bowtie?.id || '').toLowerCase();
    }

    if (aValue === undefined || bValue === undefined) {
      return 0;
    }

    return transform.sortOrder === 'ascending'
      ? aValue.localeCompare(bValue)
      : bValue.localeCompare(aValue);
  });
};

const groupTools = (
  tools: JSONSchemaTool[],
  transform: Transform,
): {
  numberOfTools: number;
  toolsByGroup: GroupedTools;
} => {
  const toolingTypesOrder = [
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
    'linter',
    'linter-plugins',
  ];

  let numberOfTools = 0;
  const groupedTools: GroupedTools = {};
  const groupBy = transform.groupBy;

  if (groupBy === 'languages' || groupBy === 'toolingTypes') {
    tools.forEach((tool) => {
      const groups = tool[groupBy] || [];
      if (groups.length > 0) {
        groups.forEach((group) => {
          if (!groupedTools[group]) groupedTools[group] = [];
          groupedTools[group].push(tool);
        });
        numberOfTools++;
      }
    });
  } else {
    groupedTools['none'] = tools;
    return {
      numberOfTools: tools.length,
      toolsByGroup: groupedTools,
    };
  }

  const sortedGroupedTools = Object.keys(groupedTools)
    .sort((a, b) => {
      if (groupBy === 'toolingTypes') {
        const indexA = toolingTypesOrder.indexOf(a);
        const indexB = toolingTypesOrder.indexOf(b);
        if (indexA === -1 || indexB === -1) {
          return a.toLowerCase().localeCompare(b.toLowerCase());
        }
        return indexA - indexB;
      }
      return a.toLowerCase().localeCompare(b.toLowerCase());
    })
    .reduce((acc, key) => {
      acc[key] = groupedTools[key];
      return acc;
    }, {} as GroupedTools);

  return {
    numberOfTools,
    toolsByGroup: sortedGroupedTools,
  };
};
