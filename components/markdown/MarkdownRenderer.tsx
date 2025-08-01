import React from 'react';
import Markdown from 'markdown-to-jsx';
import { FullMarkdownContext } from '~/context';
import { textOverrides } from './overrides/TextElements';
import { listOverrides } from './overrides/ListElements';
import { tableOverrides } from './overrides/TableElements';
import { codeOverrides } from './overrides/CodeElements';
import { infoBoxOverrides } from './overrides/InfoBoxes';
import { customOverrides } from './overrides/CustomElements';
import { headlineOverrides } from './overrides/HeadlineElements';
import { TableOfContentsWrapper } from './TableOfContents';

// Combine all overrides
const allOverrides = {
  ...headlineOverrides,
  ...textOverrides,
  ...listOverrides,
  ...tableOverrides,
  ...codeOverrides,
  ...infoBoxOverrides,
  ...customOverrides,
  tableofcontent: { component: TableOfContentsWrapper },
};

export function MarkdownRenderer({ markdown }: { markdown: string }) {
  return (
    <FullMarkdownContext.Provider value={markdown}>
      <Markdown
        options={{
          forceBlock: true,
          overrides: allOverrides,
        }}
      >
        {markdown}
      </Markdown>
    </FullMarkdownContext.Provider>
  );
}
