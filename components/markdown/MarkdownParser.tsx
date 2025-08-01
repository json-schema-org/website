import getFindResultsByGlobalRegExp from '~/lib/getFindResultsByGlobalRegExp';

const REGEX_TAB_GROUPS =
  /\[tabs-start\s*"(?<label>.*)"\]((?!\[tabs-start).|\n)*\[tabs-end\]/gm;

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

export function parseMarkdown(markdown: string): Element[] {
  markdown = transformMarkdownLinks(markdown);

  const sortedTabGroups = (
    getFindResultsByGlobalRegExp(markdown, REGEX_TAB_GROUPS) || []
  ).sort((a, b) => (a.index < b.index ? -1 : 1));

  let textCuts = sortedTabGroups.map((tabGroup) => ({
    index: tabGroup.index,
    length: tabGroup.match.length,
  }));

  let elements: Element[] = [];
  let startIndex = 0;
  let sliceMore = true;

  do {
    const endIndex = textCuts[0]?.index || Infinity;
    const length = endIndex - startIndex;
    const slicedMarkdown = markdown.substr(startIndex, length);
    if (slicedMarkdown.length > 0) {
      const markdownElement: Element = {
        type: 'markdown',
        markdown: slicedMarkdown,
      };
      elements = [...elements, markdownElement];
    }

    if (textCuts[0]) {
      const tabsGroupElement: Element = {
        type: 'tabs-group',
        markdown: markdown.substr(textCuts[0].index, textCuts[0].length),
      };
      elements = [...elements, tabsGroupElement];
      startIndex = textCuts[0].index + textCuts[0].length;
      textCuts = textCuts.slice(1);
    } else {
      sliceMore = false;
    }
  } while (sliceMore);

  return elements;
}
