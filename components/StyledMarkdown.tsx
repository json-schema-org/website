/* eslint-disable linebreak-style */
/* eslint-disable react-hooks/rules-of-hooks */

import React from 'react';
import { parseMarkdown, MarkdownRenderer, TabsGroup } from './markdown';

export default function StyledMarkdown({ markdown }: { markdown?: string }) {
  if (!markdown) return null;

  const elements = parseMarkdown(markdown);

  return (
    <div className='flex-1 min-w-0'>
      {elements.map((tabOrMarkup, index) => {
        if (tabOrMarkup.type === 'markdown') {
          return (
            <MarkdownRenderer key={index} markdown={tabOrMarkup.markdown} />
          );
        }
        return <TabsGroup key={index} markdown={tabOrMarkup.markdown} />;
      })}
    </div>
  );
}


