import React from 'react';
import { getLayout } from '~/components/Sidebar';
import fs from 'fs';
import matter from 'gray-matter';
import StyledMarkdown from '~/components/StyledMarkdown';
import { SectionContext } from '~/context';
import DocTable from '~/components/DocTable';

export async function getStaticProps() {
  const index = fs.readFileSync('pages/draft/2020-12/index.md', 'utf-8');
  const main = fs.readFileSync('pages/draft/2020-12/release-notes.md', 'utf-8');
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
        {/* <div className='text-lg text-purple-600 font-bold'>
          <h1>{frontmatter.title}</h1>
          <h1>{frontmatter.Published}</h1>
          <h1>{frontmatter.type}</h1>
          <h1>{frontmatter.authors}</h1>
          <h1>{frontmatter.Metaschema}</h1>
          <h1>{frontmatter.Implementations}</h1>
          <h1>{frontmatter.Specification}</h1>
          <h1>{frontmatter.Status}</h1>
        </div> */}

        <DocTable frontmatter={frontmatter} />
        <StyledMarkdown markdown={blocks.index} />
        <StyledMarkdown markdown={blocks.body} />
      </div>
    </SectionContext.Provider>
  );
}
ImplementationsPages.getLayout = getLayout;
