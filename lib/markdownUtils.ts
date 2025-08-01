import getFindResultsByGlobalRegExp from '~/lib/getFindResultsByGlobalRegExp';

export const REGEX_TAB_GROUPS =
  /\[tabs-start\s*"(?<label>.*)"\]((?!\[tabs-start).|\n)*\[tabs-end\]/gm;

export const TAB_REGEX =
  /(?<=\[tab )\s*"(?<label>.*)"\](?<markdown>(.|\n)*?)\[tab/gm;

export type Element = {
  type: 'markdown' | 'tabs-group';
  markdown: string;
};

export function transformMarkdownLinks(markdown: string): string {
  const linkDefinitions: Record<string, string> = {};

  // Extract and remove link definitions
  markdown = markdown.replace(
    /^\[([^\]]+)\]:\s*(.+)$/gm,
    (_, key: string, value: string) => {
      linkDefinitions[key.toLowerCase()] = value;
      return '';
    },
  );

  // Replace reference-style links with inline links
  return markdown.replace(
    /\[([^\]]+)\]\[([^\]]*)\]/g,
    (_, text: string, id: string) => {
      const link = linkDefinitions[id.toLowerCase()];
      if (link) {
        return `[${text}](${link})`;
      }
      return _; // Return the original string if no link is found
    },
  );
}

export const hiddenElements = (...elements: string[]) => {
  return elements.reduce((acc, element) => {
    return {
      ...acc,
      [element]: { component: () => null },
    };
  }, {});
};

export const checkHasContent = (reactNode: React.ReactChild) => {
  if (!reactNode) return false;
  if (typeof reactNode === 'string' || typeof reactNode === 'number')
    return true;
  if ((reactNode?.props?.children || []).length === 0) return false;
  return reactNode.props.children.reduce(
    (acc: boolean, reactNode: React.ReactChild) => {
      if (acc) return acc;
      return checkHasContent(reactNode);
    },
    false,
  );
};

export function parseTabsFromMarkdown(markdown: string) {
  const groupLabel: string | null =
    getFindResultsByGlobalRegExp(markdown, REGEX_TAB_GROUPS)?.[0]?.groups?.find(
      (g) => g.name === 'label',
    )?.match || null;

  const tabs = getFindResultsByGlobalRegExp(markdown, TAB_REGEX).map((tab) => {
    const label = tab.groups?.find((g) => g.name === 'label')?.match || '';
    const markdown = (
      tab.groups?.find((g) => g.name === 'markdown')?.match || ''
    ).trim();
    return { label, markdown };
  });

  return { groupLabel, tabs };
}
