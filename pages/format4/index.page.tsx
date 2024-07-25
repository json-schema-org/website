import React from 'react';
import { getLayout } from '~/components/SiteLayout';
import fs from 'fs';
import matter from 'gray-matter';
import StyledMarkdown from '~/components/StyledMarkdown';
import { SectionContext } from '~/context';

export async function getStaticProps() {
  const index = fs.readFileSync('pages/format4/index.md', 'utf-8');
  const main = fs.readFileSync('pages/format4/body.md', 'utf-8');
  const { content: indexContent, data: indexData } = matter(index);
  const { content: bodyContent } = matter(main);

  const frontmatter = { ...indexData };
  return {
    props: {
      blocks: {
        index: indexContent,
        body: bodyContent,
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
      <div className='w-5/6 mx-auto mt-40 dark:text-slate-200'>
        <h1>{frontmatter.title}</h1>
        <h1>{frontmatter.type}</h1>

        <StyledMarkdown markdown={blocks.index} />
        <StyledMarkdown markdown={blocks.body} />
      </div>
    </SectionContext.Provider>
  );
}
ImplementationsPages.getLayout = getLayout;
