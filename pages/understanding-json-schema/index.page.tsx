import React from 'react';
import { getLayout } from '~/components/Sidebar';
import fs from 'fs';
import matter from 'gray-matter';
import StyledMarkdown from '~/components/StyledMarkdown';
import { DocsHelp } from '~/components/DocsHelp';
import { SectionContext } from '~/context';
import { TableOfContentMarkdown } from '~/components/TOC';

// Function to remove all HTML tags
const stripHtmlTags = (markdown: string) => {
  // Regular expression to remove all HTML tags
  const htmlTagRegex = /<\/?[^>]+(>|$)/g;
  return markdown.replace(htmlTagRegex, '');
};

export async function getStaticProps() {
  const block1 = fs.readFileSync(
    'pages/understanding-json-schema/_index.md',
    'utf-8',
  );
  const { content: block1Content } = matter(block1);
  return {
    props: {
      blocks: [block1Content],
    },
  };
}

export default function ContentExample({ blocks }: { blocks: any[] }) {
  const markdownFile = '_indexPage';

  const sanitizedContent = stripHtmlTags(blocks[0]);
  return (
    <SectionContext.Provider value='docs'>
      <div className='flex pt-4'>
        <div className='w-full pr-5'>
          <StyledMarkdown markdown={sanitizedContent} />
          <DocsHelp markdownFile={markdownFile} />
        </div>
        <TableOfContentMarkdown markdown={sanitizedContent} depth={3} />
      </div>
    </SectionContext.Provider>
  );
}
ContentExample.getLayout = getLayout;
