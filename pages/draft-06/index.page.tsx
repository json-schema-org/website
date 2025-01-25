import React from 'react';
import { getLayout } from '~/components/Sidebar';
import fs from 'fs';
import matter from 'gray-matter';
import StyledMarkdown from '~/components/StyledMarkdown';
import { SectionContext } from '~/context';
import DocTable from '~/components/DocTable';
import { Headline1 } from '~/components/Headlines';
import { DocsHelp } from '~/components/DocsHelp';
import { TableOfContentMarkdown } from '~/components/TOC';
export async function getStaticProps() {
  const index = fs.readFileSync('pages/draft-06/index.md', 'utf-8');

  const { content: indexContent, data: indexData } = matter(index);

  const frontmatter = { ...indexData };
  return {
    props: {
      blocks: {
        index: indexContent,
      },
      frontmatter,
    },
  };
}

export default function ImplementationsPages({
  blocks,
  frontmatter,
}: {
  blocks: any;
  frontmatter: any;
}) {
  return (
    <SectionContext.Provider value={null}>
      <div className='flex pt-4'>
        <div className='w-full pr-5'>
          <Headline1>{frontmatter.title}</Headline1>
          <DocTable frontmatter={frontmatter} />
          <StyledMarkdown markdown={blocks.index} />
          <DocsHelp />
        </div>
        <TableOfContentMarkdown markdown={blocks.index} depth={3} />
      </div>
    </SectionContext.Provider>
  );
}
ImplementationsPages.getLayout = getLayout;
