import React from 'react';
import { getLayout } from '~/components/Sidebar';
import fs from 'fs';
import matter from 'gray-matter';
import StyledMarkdown from '~/components/StyledMarkdown';
import { SectionContext } from '~/context';
import DocTable from '~/components/DocTable';
import { Headline1 } from '~/components/Headlines';

export async function getStaticProps() {
  const index = fs.readFileSync('pages/draft-07/index.md', 'utf-8');
  const main = fs.readFileSync(
    'pages/draft-07/json-schema-release-notes.md',
    'utf-8',
  );
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
      <div className='w-5/6 mx-auto dark:text-slate-200'>
        <Headline1>{frontmatter.title}</Headline1>
        <DocTable frontmatter={frontmatter} />
        <StyledMarkdown markdown={blocks.index} />
        <StyledMarkdown markdown={blocks.body} />
      </div>
    </SectionContext.Provider>
  );
}
ImplementationsPages.getLayout = getLayout;