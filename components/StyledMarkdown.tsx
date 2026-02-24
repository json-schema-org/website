/* eslint-disable linebreak-style */

import React from 'react';
import getFindResultsByGlobalRegExp from '~/lib/getFindResultsByGlobalRegExp';
import {
  transformMarkdownLinks,
  REGEX_TAB_GROUPS,
  Element,
} from '~/lib/markdownUtils';
import { TabsGroup } from '~/components/TabsGroup';
import { StyledMarkdownBlock } from '~/components/StyledMarkdownBlock';

export default function StyledMarkdown({ markdown }: { markdown?: string }) {
  if (!markdown) return null;

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

  return (
    <div className='flex-1 min-w-0'>
      {elements.map((tabOrMarkup, index) => {
        if (tabOrMarkup.type === 'markdown') {
          return (
            <StyledMarkdownBlock key={index} markdown={tabOrMarkup.markdown} />
          );
        }
        return (
          <TabsGroup
            key={index}
            markdown={tabOrMarkup.markdown}
            StyledMarkdownBlock={StyledMarkdownBlock}
          />
        );
      })}
    </div>
  );
}

// Re-export the TableOfContentMarkdown for backward compatibility
export { TableOfContentMarkdown } from '~/components/TableOfContentMarkdown';
